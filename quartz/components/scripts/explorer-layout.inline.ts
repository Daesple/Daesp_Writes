// ==========================================
// 🧭 Dedicated 3-Column Editorial Layout for Explorer Page
// Automatically transforms clean Obsidian Markdown into .gm-explorer layout
// Supports ## Main Groups and ### Subgroups
// ==========================================

function formatExplorerPage() {
  const isExplorer =
    document.body?.dataset?.slug === "explorer" ||
    window.location.pathname.replace(/\/$/, "").endsWith("/explorer")

  if (!isExplorer) return

  const article = document.querySelector("article")
  if (!article) return

  // If already formatted, do not repeat
  if (article.querySelector(".gm-explorer")) return

  const contentRoot =
    article.querySelector(".markdown-preview-view") ||
    article.querySelector(".markdown-rendered") ||
    article

  const children = Array.from(contentRoot.children)
  if (children.length === 0) return

  // Find optional subtitle (first paragraph before any heading)
  let subtitleText = ""
  for (const el of children) {
    const tag = el.tagName.toLowerCase()
    if (tag === "h1" || tag === "h2" || tag === "h3") break
    if (tag === "p") {
      subtitleText = el.textContent?.trim() || ""
      break
    }
  }

  // Get title
  const h1 = document.querySelector(".page-title") || article.querySelector("h1")
  const pageTitle = h1?.textContent?.trim() || "Explorer"

  type ExplorerItem =
    | { type: "item"; titleHtml: string; meta: string }
    | { type: "subgroup"; title: string }

  type ExplorerSection = { name: string; items: ExplorerItem[] }

  const sections: ExplorerSection[] = []
  let currentSection: ExplorerSection | null = null

  for (const child of children) {
    const tag = child.tagName.toLowerCase()

    if (tag === "h2") {
      // Main section (Column 1)
      const clone = child.cloneNode(true) as HTMLElement
      clone.querySelectorAll("a[role='anchor'], svg").forEach((a) => a.remove())
      const name = clone.textContent?.trim() || ""
      if (name) {
        currentSection = { name, items: [] }
        sections.push(currentSection)
      }
    } else if (tag === "h3") {
      // Subgroup under the current main section
      const clone = child.cloneNode(true) as HTMLElement
      clone.querySelectorAll("a[role='anchor'], svg").forEach((a) => a.remove())
      const name = clone.textContent?.trim() || ""
      if (name) {
        if (!currentSection) {
          currentSection = { name: "Projects", items: [] }
          sections.push(currentSection)
        }
        currentSection.items.push({ type: "subgroup", title: name })
      }
    } else if (tag === "ul" || tag === "ol") {
      if (!currentSection) {
        currentSection = { name: "General", items: [] }
        sections.push(currentSection)
      }

      const lis = Array.from(child.querySelectorAll("li"))
      for (const li of lis) {
        const anchor = li.querySelector("a")
        let titleHtml = ""
        let restText = ""

        if (anchor) {
          const anchorClone = anchor.cloneNode(true) as HTMLAnchorElement
          if (
            anchorClone.classList.contains("tag-link") &&
            !anchorClone.textContent?.trim().startsWith("#")
          ) {
            anchorClone.textContent = `#${anchorClone.textContent?.trim()}`
          }
          titleHtml = anchorClone.outerHTML
          const fullHtml = li.innerHTML
          const anchorIndex = fullHtml.indexOf(anchor.outerHTML)
          if (anchorIndex !== -1) {
            restText = fullHtml.slice(anchorIndex + anchor.outerHTML.length)
          } else {
            restText = li.textContent?.replace(anchor.textContent || "", "") || ""
          }
        } else {
          // Plain text or tag without anchor
          const raw = li.textContent?.trim() || ""
          const parts = raw.split(/[\s]*[|—–][\s]*/)
          titleHtml = parts[0]
          restText = parts.slice(1).join(" | ")
        }

        const meta = restText.replace(/^[\s|—–\-·:]+/, "").trim()
        currentSection.items.push({ type: "item", titleHtml, meta })
      }
    }
  }

  // If no sections were extracted, keep original content
  if (sections.length === 0) return

  const sectionsHtml = sections
    .map((sec) => {
      if (!sec.items.length) return ""
      const rowsHtml = sec.items
        .map((it) => {
          if (it.type === "subgroup") {
            return `
              <div class="gm-subgroup-row">
                <span class="gm-subgroup-label">${it.title}</span>
              </div>
            `
          }
          return `
            <div class="gm-row">
              <div class="gm-item-title">${it.titleHtml}</div>
              <div class="gm-item-meta">${it.meta}</div>
            </div>
          `
        })
        .join("")

      return `
        <section class="gm-section">
          <div class="gm-col-group">
            <h2 class="gm-group-name">${sec.name}</h2>
          </div>
          <div class="gm-col-content">
            ${rowsHtml}
          </div>
        </section>
      `
    })
    .join("")

  const explorerHtml = `
    <div class="gm-explorer">
      <header class="gm-header">
        <h1 class="gm-title">${pageTitle}</h1>
        ${subtitleText ? `<p class="gm-subtitle">${subtitleText}</p>` : ""}
      </header>
      ${sectionsHtml}
    </div>
  `

  contentRoot.innerHTML = explorerHtml
}

if (typeof window !== "undefined") {
  document.addEventListener("nav", formatExplorerPage)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", formatExplorerPage)
  } else {
    formatExplorerPage()
  }
}
