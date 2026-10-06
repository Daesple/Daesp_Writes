---
title: Explorer
---

<div class="gm-explorer">
  <header class="gm-header">
    <h1 class="gm-title">Explorer</h1>
    <p class="gm-subtitle">Danh mục tự động cập nhật toàn bộ bài viết, tài nguyên và chủ đề từ vault.</p>
  </header>

  <div id="explorer-dynamic-container">
    <div class="explorer-loading" style="padding: 2rem 0; color: var(--gray); font-style: italic;">
      Đang tải danh mục bài viết từ vault...
    </div>
  </div>
</div>

<script>
(() => {
  async function renderDynamicExplorer() {
    const container = document.getElementById("explorer-dynamic-container");
    if (!container) return;

    try {
      const basePath = (document.body.dataset.basepath || "").replace(/\/$/, "");
      let index = null;
      if (window.fetchData) {
        try { index = await window.fetchData; } catch (e) {}
      }
      if (!index) {
        const res = await fetch(`${basePath}/static/contentIndex.json`);
        if (!res.ok) throw new Error("Could not load contentIndex.json");
        index = await res.json();
      }

      const projects = [];
      const resources = [];
      const topicNotes = [];
      const tagCount = {};

      Object.entries(index).forEach(([slug, item]) => {
        // Exclude system/index files
        if (
          slug === "index" ||
          slug === "explorer" ||
          slug === "404" ||
          slug.endsWith("/index") ||
          slug.startsWith("tags/")
        ) {
          return;
        }

        const fp = (item.filePath || slug).toLowerCase();
        const title = item.title || slug.split("/").pop();
        const date = item.date || "";

        // Track tags
        (item.tags || []).forEach(t => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });

        if (fp.startsWith("projects/")) {
          const parts = (item.filePath || "").split("/");
          let hint = "Project";
          if (parts.length > 2) {
            hint = parts[parts.length - 2].replace(/^\d+[\.\-_]\s*/, "");
          }
          projects.push({ slug, title, date, hint });
        } else if (fp.startsWith("resources/")) {
          resources.push({ slug, title, date, hint: "Resource" });
        } else if (fp.startsWith("topics/")) {
          topicNotes.push({ slug, title, hint: "Topic Hub" });
        }
      });

      // Sort projects & resources by date (newest first)
      const sortByDate = (a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        if (db !== da) return db - da;
        return a.title.localeCompare(b.title);
      };

      projects.sort(sortByDate);
      resources.sort(sortByDate);

      // Topics: combine topic hub notes and vault tags
      const topics = [];
      topicNotes.forEach(tn => {
        topics.push({
          title: tn.title,
          href: `${basePath}/${tn.slug}`,
          meta: tn.hint
        });
      });

      // Also add unique vault tags
      Object.entries(tagCount).forEach(([tag, count]) => {
        const exists = topics.some(t => t.title.toLowerCase() === tag.toLowerCase());
        if (!exists) {
          topics.push({
            title: `#${tag}`,
            href: `${basePath}/tags/${tag}`,
            meta: `${count} ${count > 1 ? "notes" : "note"}`
          });
        }
      });

      topics.sort((a, b) => a.title.localeCompare(b.title));

      function formatDate(dStr) {
        if (!dStr) return "";
        try {
          const d = new Date(dStr);
          if (isNaN(d.getTime())) return "";
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch {
          return "";
        }
      }

      function buildSection(groupName, items, isTopic = false) {
        if (!items.length) return "";
        const rowsHtml = items.map(it => {
          const href = isTopic ? it.href : `${basePath}/${it.slug}`;
          const metaText = isTopic ? it.meta : (formatDate(it.date) || it.hint);
          return `
            <div class="gm-row">
              <div class="gm-item-title">
                <a href="${href}">${it.title}</a>
              </div>
              <div class="gm-item-meta">${metaText}</div>
            </div>
          `;
        }).join("");

        return `
          <section class="gm-section">
            <div class="gm-col-group">
              <h2 class="gm-group-name">${groupName}</h2>
            </div>
            <div class="gm-col-content">
              ${rowsHtml}
            </div>
          </section>
        `;
      }

      container.innerHTML = 
        buildSection("Projects", projects) +
        buildSection("Resources", resources) +
        buildSection("Topics", topics, true);

    } catch (err) {
      console.error("Error generating explorer:", err);
      container.innerHTML = `<div style="color: var(--gray); padding: 2rem 0;">Không thể tải dữ liệu tự động.</div>`;
    }
  }

  document.addEventListener("nav", renderDynamicExplorer);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderDynamicExplorer);
  } else {
    renderDynamicExplorer();
  }
})();
</script>
