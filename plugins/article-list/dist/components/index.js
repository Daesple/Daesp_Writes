import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";

function simplifySlug(fp) {
  return (fp || "").replace(/(^|\/)index$/, "");
}

function pathToRoot(slug) {
  let rootPath = (slug || "").split("/").filter((x) => x !== "").slice(0, -1).map(() => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}

function resolveRelative(current, target) {
  const rootPath = pathToRoot(current);
  const targetClean = simplifySlug(target);
  if (targetClean === "" || targetClean === ".") return rootPath === "." ? "./" : rootPath + "/";
  return rootPath === "." ? `./${targetClean}` : `${rootPath}/${targetClean}`;
}

function getNodeDate(page) {
  const d = page?.dates?.modified || page?.dates?.created;
  if (!d) return null;
  const dateObj = d instanceof Date ? d : new Date(d);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

function formatShortDate(d) {
  if (!d) return "";
  try {
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  } catch (e) {
    return "";
  }
}

function getTagColor(tag) {
  const t = (tag || "").toLowerCase().trim();
  if (t === "project") return "var(--type-project, #38bdf8)";
  if (t === "resource") return "var(--type-resource, #fbbf24)";
  if (t === "concept" || t === "moc") return "var(--type-concept, #a78bfa)";
  return "var(--type-other, #5f7898)";
}

const ArticleList = ({ allFiles, fileData, displayClass }) => {
  const currentSlug = fileData?.slug || "";

  // Filter all content notes: exclude index, explorer, tag pages, and unlisted notes
  const notes = (allFiles || [])
    .filter((file) => {
      const s = (file.slug || "").toLowerCase();
      if (!s || s === "index" || s === "explorer") return false;
      if (s === "tags" || s.startsWith("tags/")) return false;
      if (file.unlisted === true) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = getNodeDate(a);
      const dateB = getNodeDate(b);
      if (dateA && dateB) {
        const diff = dateB.getTime() - dateA.getTime();
        if (diff !== 0) return diff;
      } else if (dateA && !dateB) {
        return -1;
      } else if (!dateA && dateB) {
        return 1;
      }
      const titleA = (a.frontmatter?.title || a.slug || "").toLowerCase();
      const titleB = (b.frontmatter?.title || b.slug || "").toLowerCase();
      return titleA.localeCompare(titleB);
    });

  // Calculate tag stats for FILTER BY TYPE
  const tagCounts = new Map();
  notes.forEach((note) => {
    const rawTags = note.frontmatter?.tags || [];
    const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
    if (tags.length === 0) {
      tagCounts.set("other", (tagCounts.get("other") || 0) + 1);
    } else {
      tags.forEach((t) => {
        const cleanTag = String(t).trim().toLowerCase();
        if (cleanTag) {
          tagCounts.set(cleanTag, (tagCounts.get(cleanTag) || 0) + 1);
        }
      });
    }
  });

  // Sort tags: project first, then resource, then concept/moc, then alphabetically
  const sortedTags = Array.from(tagCounts.entries()).sort(([a, countA], [b, countB]) => {
    const priority = { project: 1, resource: 2, concept: 3, moc: 4, other: 99 };
    const pA = priority[a] || 50;
    const pB = priority[b] || 50;
    if (pA !== pB) return pA - pB;
    return b.localeCompare(a);
  });

  return _jsxs("aside", {
    class: `article-list-container ${displayClass || ""}`,
    children: [
      // 1. Heading label "NOTES"
      _jsxs("div", {
        class: "article-list-header",
        children: [
          _jsx("span", { children: "NOTES" }),
          _jsx("span", { class: "article-list-total", children: notes.length })
        ]
      }),

      // 2. Scrollable list of ALL notes
      _jsx("div", {
        class: "article-list-scroll",
        children: _jsx("ul", {
          class: "article-ul",
          children: notes.map((note) => {
            const rawTags = note.frontmatter?.tags || [];
            const tags = Array.isArray(rawTags) ? rawTags.map((t) => String(t).trim().toLowerCase()) : [String(rawTags).trim().toLowerCase()];
            const primaryTag = tags[0] || "other";
            const dotColor = getTagColor(primaryTag);
            const date = getNodeDate(note);
            const dateStr = formatShortDate(date);
            const title = note.frontmatter?.title || note.slug;
            const isCurrent = currentSlug === note.slug;
            const href = resolveRelative(currentSlug, note.slug);
            const dataTags = tags.length > 0 ? tags.join(" ") : "other";

            return _jsx(
              "li",
              {
                class: `article-item ${isCurrent ? "current" : ""}`,
                "data-tags": dataTags,
                "data-primary-tag": primaryTag,
                children: _jsxs("a", {
                  href: href,
                  class: `article-row ${isCurrent ? "active" : ""}`,
                  title: title,
                  children: [
                    _jsx("span", {
                      class: "article-type-dot",
                      style: `background-color: ${dotColor};`
                    }),
                    _jsx("span", {
                      class: "article-title",
                      children: title
                    }),
                    dateStr ? _jsx("time", {
                      class: "article-date",
                      dateTime: date ? date.toISOString() : "",
                      children: dateStr
                    }) : null
                  ]
                })
              },
              note.slug
            );
          })
        })
      }),

      // 3. BELOW the list: heading "FILTER BY TYPE"
      _jsxs("div", {
        class: "filter-type-section",
        children: [
          _jsxs("div", {
            class: "filter-type-header",
            children: [
              _jsx("span", { class: "filter-type-title", children: "FILTER BY TYPE" }),
              _jsxs("div", {
                class: "filter-type-actions",
                children: [
                  _jsx("button", {
                    type: "button",
                    class: "filter-action-btn select-all-btn",
                    title: "Select all",
                    "aria-label": "Select all",
                    children: _jsxs("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "13",
                      height: "13",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2.2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        _jsx("polyline", { points: "9 11 12 14 22 4" }),
                        _jsx("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" })
                      ]
                    })
                  }),
                  _jsx("button", {
                    type: "button",
                    class: "filter-action-btn unselect-all-btn",
                    title: "Unselect all",
                    "aria-label": "Unselect all",
                    children: _jsxs("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "13",
                      height: "13",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2.2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        _jsx("circle", { cx: "12", cy: "12", r: "10" }),
                        _jsx("line", { x1: "4.93", y1: "4.93", x2: "19.07", y2: "19.07" })
                      ]
                    })
                  })
                ]
              })
            ]
          }),
          _jsx("div", {
            class: "filter-type-list",
            children: sortedTags.map(([tag, count]) => {
              const dotColor = getTagColor(tag);
              return _jsxs(
                "button",
                {
                  type: "button",
                  class: "filter-type-btn active",
                  "data-tag": tag,
                  "aria-label": `Filter by ${tag}`,
                  children: [
                    _jsx("span", {
                      class: "article-type-dot",
                      style: `background-color: ${dotColor};`
                    }),
                    _jsx("span", {
                      class: "filter-tag-name",
                      children: tag
                    }),
                    _jsx("span", {
                      class: "filter-tag-count",
                      children: count
                    })
                  ]
                },
                tag
              );
            })
          })
        ]
      })
    ]
  });
};

ArticleList.css = `
.article-list-container {
  display: flex;
  flex-direction: column;
  height: 100% !important;
  max-height: 100% !important;
  min-height: 0 !important;
  overflow: hidden !important;
  box-sizing: border-box;
  font-family: var(--bodyFont);
}

.article-list-header {
  font-family: var(--codeFont);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--bp-text-3, var(--gray));
  padding: 0 0.2rem 0.5rem 0.2rem;
  margin-bottom: 0.35rem;
  border-bottom: 1px solid var(--bp-line, var(--lightgray));
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  flex-shrink: 0;
}

.article-list-total {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--bp-text-3, var(--gray));
  opacity: 0.85;
}

.article-list-scroll {
  flex: 1 1 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  min-height: 0 !important;
  padding-right: 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: var(--bp-line, var(--lightgray)) transparent;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--bp-line, var(--lightgray));
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--bp-line-strong, var(--gray));
  }
}

.article-ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.article-item {
  margin: 0;
  padding: 0;
  transition: opacity 0.2s ease;

  &.hidden {
    display: none !important;
  }
}

.article-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.45rem;
  border-radius: 4px;
  text-decoration: none;
  color: var(--bp-text-2, var(--dark));
  font-size: 0.83rem;
  line-height: 1.35;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: var(--bp-raised, rgba(56, 189, 248, 0.08));
    color: var(--bp-accent, var(--secondary));

    .article-title {
      color: var(--bp-accent, var(--secondary));
    }
  }

  &.active {
    background-color: var(--bp-raised, rgba(56, 189, 248, 0.12));
    color: var(--bp-accent, var(--secondary));
    font-weight: 600;

    .article-title {
      color: var(--bp-accent, var(--secondary));
    }
  }
}

.article-type-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
  pointer-events: none;
}

.article-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  font-size: inherit;
}

.article-date {
  font-family: var(--codeFont);
  font-size: 0.7rem;
  color: var(--bp-text-3, var(--gray));
  margin-left: auto;
  flex-shrink: 0;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0.85;
}

/* Filter By Type Section */
.filter-type-section {
  flex-shrink: 0;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--bp-line, var(--lightgray));
}

.filter-type-header {
  font-family: var(--codeFont);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--bp-text-3, var(--gray));
  margin-bottom: 0.4rem;
  padding: 0 0.2rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-type-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.filter-action-btn {
  background: transparent;
  border: 1px solid var(--bp-line, var(--lightgray));
  color: var(--bp-text-3, var(--gray));
  padding: 0.2rem 0.3rem;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.15s ease;

  &:hover {
    color: var(--bp-accent, var(--secondary));
    border-color: var(--bp-accent, var(--secondary));
    background: var(--bp-raised, rgba(56, 189, 248, 0.08));
  }

  svg {
    pointer-events: none;
  }
}

.filter-type-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.filter-type-btn {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0.3rem 0.45rem;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  user-select: none;
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--bp-raised, rgba(56, 189, 248, 0.08));
  }

  &.active {
    opacity: 1;

    .filter-tag-name {
      color: var(--bp-text, var(--dark));
      font-weight: 500;
    }
  }

  &.inactive {
    opacity: 0.38;
    filter: grayscale(0.7);

    .filter-tag-name {
      color: var(--bp-text-3, var(--gray));
    }
  }
}

.filter-tag-name {
  font-family: var(--bodyFont);
  font-size: 0.8rem;
  text-transform: capitalize;
  pointer-events: none;
}

.filter-tag-count {
  font-family: var(--codeFont);
  font-size: 0.7rem;
  color: var(--bp-text-3, var(--gray));
  margin-left: auto;
  pointer-events: none;
  opacity: 0.85;
}
`;

ArticleList.afterDOMLoaded = `
(function() {
  function setupArticleFilter() {
    var container = document.querySelector(".article-list-container");
    if (!container) return;

    var filterBtns = container.querySelectorAll(".filter-type-btn");
    var articleItems = container.querySelectorAll(".article-item");
    var selectAllBtn = container.querySelector(".select-all-btn");
    var unselectAllBtn = container.querySelector(".unselect-all-btn");
    if (!filterBtns.length) return;

    var activeTags = new Set();
    filterBtns.forEach(function(btn) {
      if (!btn.classList.contains("inactive")) {
        activeTags.add(btn.getAttribute("data-tag"));
      }
    });

    function applyFilter() {
      articleItems.forEach(function(item) {
        var tagsStr = item.getAttribute("data-tags") || "";
        var itemTags = tagsStr.split(" ").filter(Boolean);
        var visible = false;
        if (itemTags.length === 0) {
          visible = activeTags.has("other");
        } else {
          for (var i = 0; i < itemTags.length; i++) {
            if (activeTags.has(itemTags[i])) {
              visible = true;
              break;
            }
          }
        }
        if (visible) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });

      // Synchronize active filter tags with the Graph component
      document.dispatchEvent(new CustomEvent("quartz-filter-tags", {
        detail: { tags: Array.from(activeTags) }
      }));
    }

    filterBtns.forEach(function(btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        var tag = btn.getAttribute("data-tag");
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          btn.classList.remove("active");
          btn.classList.add("inactive");
        } else {
          activeTags.add(tag);
          btn.classList.add("active");
          btn.classList.remove("inactive");
        }
        applyFilter();
      };
    });

    if (selectAllBtn) {
      selectAllBtn.onclick = function(e) {
        e.preventDefault();
        filterBtns.forEach(function(btn) {
          var tag = btn.getAttribute("data-tag");
          if (tag) activeTags.add(tag);
          btn.classList.add("active");
          btn.classList.remove("inactive");
        });
        applyFilter();
      };
    }

    if (unselectAllBtn) {
      unselectAllBtn.onclick = function(e) {
        e.preventDefault();
        activeTags.clear();
        filterBtns.forEach(function(btn) {
          btn.classList.remove("active");
          btn.classList.add("inactive");
        });
        applyFilter();
      };
    }

    // Apply initial state to sync graph
    applyFilter();
  }

  document.addEventListener("nav", setupArticleFilter);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupArticleFilter);
  } else {
    setupArticleFilter();
  }
})();
`;

const ArticleListDefault = () => ArticleList;

export { ArticleListDefault as ArticleList, ArticleListDefault as default };
