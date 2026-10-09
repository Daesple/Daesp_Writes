import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";

const ThemeSelector = ({ displayClass }) => {
  return _jsxs("div", {
    class: `theme-selector-container ${displayClass || ""}`,
    children: [
      _jsxs("button", {
        type: "button",
        class: "theme-trigger-btn",
        "aria-label": "Select theme",
        title: "Chọn giao diện (Theme)",
        children: [
          _jsx("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "15",
            height: "15",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: _jsx("path", {
              d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
            })
          }),
          _jsx("span", {
            class: "theme-current-label",
            children: "Blue"
          }),
          _jsx("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "12",
            height: "12",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            class: "theme-chevron-icon",
            children: _jsx("path", {
              d: "m6 9 6 6 6-6"
            })
          })
        ]
      }),
      _jsxs("div", {
        class: "theme-dropdown hidden",
        role: "menu",
        children: [
          _jsxs("button", {
            type: "button",
            class: "theme-option-btn",
            "data-theme": "light",
            role: "menuitem",
            children: [
              _jsx("span", { class: "theme-option-swatch swatch-light" }),
              _jsx("span", { class: "theme-option-name", children: "Light" }),
              _jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "13",
                height: "13",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                class: "theme-check-icon",
                children: _jsx("path", { d: "M20 6 9 17l-5-5" })
              })
            ]
          }),
          _jsxs("button", {
            type: "button",
            class: "theme-option-btn",
            "data-theme": "dark",
            role: "menuitem",
            children: [
              _jsx("span", { class: "theme-option-swatch swatch-dark" }),
              _jsx("span", { class: "theme-option-name", children: "Dark" }),
              _jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "13",
                height: "13",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                class: "theme-check-icon",
                children: _jsx("path", { d: "M20 6 9 17l-5-5" })
              })
            ]
          }),
          _jsxs("button", {
            type: "button",
            class: "theme-option-btn active",
            "data-theme": "blue",
            role: "menuitem",
            children: [
              _jsx("span", { class: "theme-option-swatch swatch-blue" }),
              _jsx("span", { class: "theme-option-name", children: "Blue" }),
              _jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "13",
                height: "13",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                class: "theme-check-icon",
                children: _jsx("path", { d: "M20 6 9 17l-5-5" })
              })
            ]
          })
        ]
      })
    ]
  });
};

ThemeSelector.beforeDOMLoaded = `
(() => {
  const saved = localStorage.getItem("theme") || "blue";
  document.documentElement.setAttribute("saved-theme", saved);
  document.documentElement.setAttribute("data-theme", saved);
  const applyBody = () => {
    if (document.body) {
      document.body.classList.remove("theme-dark", "theme-light", "theme-blue", "theme-blueprint");
      document.body.classList.add("theme-" + saved);
    }
  };
  if (document.body) applyBody();
  else document.addEventListener("DOMContentLoaded", applyBody);
})();
`;

ThemeSelector.afterDOMLoaded = `
(() => {
  function updateAllThemeUI(activeTheme) {
    const rawTheme = activeTheme || document.documentElement.getAttribute("saved-theme") || "blue";
    const theme = (rawTheme === "blueprint") ? "blue" : rawTheme;
    document.querySelectorAll(".theme-selector-container").forEach((container) => {
      const label = container.querySelector(".theme-current-label");
      if (label) {
        label.textContent = theme === "blue" ? "Blue" : (theme === "dark" ? "Dark" : "Light");
      }
      container.querySelectorAll(".theme-option-btn").forEach((opt) => {
        const optTheme = opt.getAttribute("data-theme");
        if (optTheme === theme || (theme === "blue" && optTheme === "blueprint")) {
          opt.classList.add("active");
        } else {
          opt.classList.remove("active");
        }
      });
    });
  }

  function applyTheme(chosenTheme) {
    if (!chosenTheme) return;
    const normalized = (chosenTheme === "blueprint") ? "blue" : chosenTheme;
    document.documentElement.setAttribute("saved-theme", normalized);
    document.documentElement.setAttribute("data-theme", normalized);
    document.body?.classList.remove("theme-dark", "theme-light", "theme-blue", "theme-blueprint");
    document.body?.classList.add("theme-" + normalized);
    localStorage.setItem("theme", normalized);

    updateAllThemeUI(normalized);

    document.querySelectorAll(".theme-dropdown").forEach((d) => d.classList.add("hidden"));

    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: normalized } }));

    if (window.__quartzReRenderLocalGraph) window.__quartzReRenderLocalGraph();
    if (window.__quartzReRenderGlobalGraph) {
      const activeModal = document.querySelector(".global-graph-outer.active");
      if (activeModal) window.__quartzReRenderGlobalGraph();
    }
  }

  if (!window.__themeSelectorHandlerAttached) {
    window.__themeSelectorHandlerAttached = true;

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".theme-trigger-btn");
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const container = trigger.closest(".theme-selector-container");
        const dropdown = container?.querySelector(".theme-dropdown");
        if (dropdown) {
          const isCurrentlyHidden = dropdown.classList.contains("hidden");
          document.querySelectorAll(".theme-dropdown").forEach((d) => {
            if (d !== dropdown) d.classList.add("hidden");
          });
          if (isCurrentlyHidden) {
            dropdown.classList.remove("hidden");
          } else {
            dropdown.classList.add("hidden");
          }
        }
        return;
      }

      const option = e.target.closest(".theme-option-btn");
      if (option) {
        e.preventDefault();
        e.stopPropagation();
        const theme = option.getAttribute("data-theme");
        applyTheme(theme);
        return;
      }

      if (!e.target.closest(".theme-selector-container")) {
        document.querySelectorAll(".theme-dropdown").forEach((d) => d.classList.add("hidden"));
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".theme-dropdown").forEach((d) => d.classList.add("hidden"));
      }
    });
  }

  updateAllThemeUI();
  document.addEventListener("nav", () => updateAllThemeUI());
})();
`;

ThemeSelector.css = `
.theme-selector-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.theme-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: var(--headerFont);
  color: var(--darkgray);
  background: var(--lightgray);
  border: 1px solid color-mix(in srgb, var(--darkgray) 15%, transparent);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;

  &:hover {
    color: var(--secondary);
    border-color: var(--secondary);
    background: var(--highlight);
  }

  svg {
    opacity: 0.85;
    pointer-events: none;
  }

  .theme-current-label {
    pointer-events: none;
  }

  .theme-chevron-icon {
    opacity: 0.6;
    margin-left: 0.1rem;
    pointer-events: none;
  }
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 135px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 9999;
  backdrop-filter: blur(10px);
  animation: themeMenuPop 0.15s cubic-bezier(0.16, 1, 0.3, 1);

  &.hidden {
    display: none !important;
  }
}

@keyframes themeMenuPop {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.theme-option-btn {
  display: flex !important;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.65rem !important;
  font-size: 0.82rem;
  font-family: var(--bodyFont);
  font-weight: 500;
  color: var(--darkgray) !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 6px !important;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  width: 100% !important;
  user-select: none;

  &:hover {
    background: var(--highlight) !important;
    color: var(--dark) !important;
  }

  &.active {
    background: color-mix(in srgb, var(--secondary) 15%, transparent) !important;
    color: var(--secondary) !important;
    font-weight: 600 !important;
  }
}

.theme-option-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  pointer-events: none;

  &.swatch-light {
    background: #f8fafc;
    border: 1.5px solid #94a3b8;
  }

  &.swatch-dark {
    background: #0b0f17;
    border: 1.5px solid #475569;
  }

  &.swatch-blue,
  &.swatch-blueprint {
    background: #0d223a;
    border: 1.5px solid #38bdf8;
  }
}

.theme-option-name {
  pointer-events: none;
}

.theme-check-icon {
  margin-left: auto;
  opacity: 0;
  color: var(--secondary);
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.theme-option-btn.active .theme-check-icon {
  opacity: 1;
}
`;

const ThemeSelectorDefault = () => ThemeSelector;

export { ThemeSelectorDefault as ThemeSelector };
