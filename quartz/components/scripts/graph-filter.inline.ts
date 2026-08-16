// ==========================================
// ⚙️ Obsidian-style Graph View Filter Settings (Tags & Orphans)
// ==========================================

interface GraphFilterState {
  tags: boolean
  orphans: boolean
}

const DEFAULT_FILTERS: GraphFilterState = {
  tags: true,
  orphans: true,
}

function getSavedFilters(): GraphFilterState {
  try {
    const saved = localStorage.getItem("quartz-graph-filters")
    if (saved) return { ...DEFAULT_FILTERS, ...JSON.parse(saved) }
  } catch (e) {}
  return { ...DEFAULT_FILTERS }
}

function saveFilters(filters: GraphFilterState) {
  try {
    localStorage.setItem("quartz-graph-filters", JSON.stringify(filters))
  } catch (e) {}
}

function triggerGraphReRender() {
  if (typeof window !== "undefined") {
    if ((window as any).__quartzReRenderGlobalGraph) {
      ;(window as any).__quartzReRenderGlobalGraph()
    }
    if ((window as any).__quartzReRenderLocalGraph) {
      ;(window as any).__quartzReRenderLocalGraph()
    }
  }
}

function createFilterPanel(parent: HTMLElement): HTMLElement {
  let panel = parent.querySelector(".graph-filter-panel") as HTMLElement | null
  if (panel) return panel

  const filters = getSavedFilters()

  panel = document.createElement("div")
  panel.className = "graph-filter-panel hidden"
  panel.innerHTML = `
    <div class="filter-panel-header">
      <div class="filter-panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        <span>Filters</span>
      </div>
      <div class="filter-panel-actions">
        <button class="filter-btn filter-reset-btn" title="Khôi phục mặc định" aria-label="Reset">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        </button>
        <button class="filter-btn filter-close-btn" title="Đóng" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
    <div class="filter-panel-body">
      <div class="filter-item">
        <span class="filter-label">Tags</span>
        <label class="toggle-switch">
          <input type="checkbox" data-filter="tags" ${filters.tags ? "checked" : ""}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="filter-item">
        <span class="filter-label">Orphans</span>
        <label class="toggle-switch">
          <input type="checkbox" data-filter="orphans" ${filters.orphans ? "checked" : ""}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
  `

  parent.appendChild(panel)

  // Bind checkbox changes
  const checkboxes = panel.querySelectorAll<HTMLInputElement>("input[data-filter]")
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const currentFilters = getSavedFilters()
      const filterKey = cb.dataset.filter as keyof GraphFilterState
      if (filterKey) {
        currentFilters[filterKey] = cb.checked
        saveFilters(currentFilters)
        triggerGraphReRender()
      }
    })
  })

  // Close button
  const closeBtn = panel.querySelector(".filter-close-btn")
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    panel?.classList.add("hidden")
  })

  // Reset button
  const resetBtn = panel.querySelector(".filter-reset-btn")
  resetBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    saveFilters(DEFAULT_FILTERS)
    checkboxes.forEach((cb) => {
      const key = cb.dataset.filter as keyof GraphFilterState
      if (key) cb.checked = DEFAULT_FILTERS[key]
    })
    triggerGraphReRender()
  })

  return panel
}

function setupGlobalGraphFilters() {
  const globalOuters = document.querySelectorAll<HTMLElement>(".global-graph-outer")

  globalOuters.forEach((outer) => {
    let settingsBtn = outer.querySelector(".graph-settings-btn") as HTMLElement | null
    if (!settingsBtn) {
      settingsBtn = document.createElement("button")
      settingsBtn.className = "graph-settings-btn"
      settingsBtn.title = "Bộ lọc Graph (Filters)"
      settingsBtn.setAttribute("aria-label", "Graph Filters")
      settingsBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      `
      outer.appendChild(settingsBtn)

      const panel = createFilterPanel(outer)

      settingsBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        panel.classList.toggle("hidden")
      })
    }
  })
}

if (typeof window !== "undefined") {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null
    if (!target?.closest(".graph-filter-panel") && !target?.closest(".graph-settings-btn")) {
      document.querySelectorAll(".graph-filter-panel").forEach((p) => p.classList.add("hidden"))
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".graph-filter-panel").forEach((p) => p.classList.add("hidden"))
    }
  })

  setupGlobalGraphFilters()
  document.addEventListener("DOMContentLoaded", setupGlobalGraphFilters)
  window.addEventListener("load", setupGlobalGraphFilters)
  document.addEventListener("nav", setupGlobalGraphFilters)
  document.addEventListener("render", setupGlobalGraphFilters)

  let checks = 0
  const interval = setInterval(() => {
    setupGlobalGraphFilters()
    checks++
    if (checks > 10) clearInterval(interval)
  }, 300)
}
