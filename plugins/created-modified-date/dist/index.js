import fs from 'fs';
import { Repository } from '@napi-rs/simple-git';
import path from 'path';
import { styleText } from 'util';
import child_process from 'child_process';

// src/transformer.ts
var defaultOptions = {
  priority: ["frontmatter", "git", "filesystem"],
  defaultDateType: "created"
};
var iso8601DateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
function coerceDate(fp, d) {
  if (typeof d === "string" && iso8601DateOnlyRegex.test(d)) {
    d = `${d}T00:00:00`;
  }
  const dt = d === void 0 ? new Date() : d === null ? new Date(0) : new Date(d);
  const invalidDate = isNaN(dt.getTime()) || dt.getTime() === 0;
  if (invalidDate && d !== void 0) {
    console.log(
      styleText(
        "yellow",
        `
Warning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`
      )
    );
  }
  return invalidDate ? new Date() : dt;
}

var gitCreatedCache = null;
var gitModifiedCache = null;

function getGitHistoryDates() {
  if (gitCreatedCache && gitModifiedCache) return { created: gitCreatedCache, modified: gitModifiedCache };
  gitCreatedCache = new Map();
  gitModifiedCache = new Map();
  try {
    const out = child_process.execSync('git -c core.quotepath=off log --format=COMMIT:%aI --name-only', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    const lines = out.split('\n');
    let curDate = null;
    for (const line of lines) {
      const l = line.trim();
      if (l.startsWith('COMMIT:')) {
        curDate = l.substring(7);
      } else if (l.length > 0) {
        const norm = l.replace(/\\/g, '/');
        if (!gitModifiedCache.has(norm)) gitModifiedCache.set(norm, new Date(curDate).getTime());
        gitCreatedCache.set(norm, new Date(curDate).getTime());
      }
    }
  } catch (e) {}
  return { created: gitCreatedCache, modified: gitModifiedCache };
}

var CreatedModifiedDate = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "CreatedModifiedDate",
    markdownPlugins(ctx) {
      return [
        () => {
          let repo = void 0;
          let repositoryWorkdir;
          if (opts.priority.includes("git")) {
            try {
              repo = Repository.discover(ctx.argv.directory);
              repositoryWorkdir = repo.workdir() ?? ctx.argv.directory;
            } catch (e) {}
          }
          return async (_tree, file) => {
            let created = void 0;
            let modified = void 0;
            let published = void 0;
            const data = file.data;
            const fp = data.relativePath;
            const fullFp = data.filePath;
            for (const source of opts.priority) {
              if (source === "filesystem") {
                const st = await fs.promises.stat(fullFp);
                created ||= st.birthtimeMs;
                modified ||= st.mtimeMs;
              } else if (source === "frontmatter" && data.frontmatter) {
                created ||= data.frontmatter.date || data.frontmatter.created;
                modified ||= data.frontmatter.date || data.frontmatter.modified;
                published ||= data.frontmatter.date || data.frontmatter.published;
              } else if (source === "git") {
                const gitDates = getGitHistoryDates();
                const relGitPath = path.relative(repositoryWorkdir || '.', fullFp).replace(/\\/g, '/');
                if (gitDates.created.has(relGitPath)) {
                  created ||= gitDates.created.get(relGitPath);
                }
                if (gitDates.modified.has(relGitPath)) {
                  modified ||= gitDates.modified.get(relGitPath);
                }
                if (repo && !modified) {
                  try {
                    modified ||= await repo.getFileLatestModifiedDateAsync(relGitPath);
                  } catch (e) {}
                }
              }
            }
            data.dates = {
              created: coerceDate(fp, created),
              modified: coerceDate(fp, modified),
              published: coerceDate(fp, published)
            };
            data.defaultDateType = opts.defaultDateType;
          };
        }
      ];
    }
  };
};

export { CreatedModifiedDate };