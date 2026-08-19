import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null
let activePopoverEl: HTMLElement | null = null
let isExpanded = false
let hideTimeout: number | undefined

function getOrCreateBackdrop(): HTMLElement {
  let backdrop = document.getElementById("popover-backdrop")
  if (!backdrop) {
    backdrop = document.createElement("div")
    backdrop.id = "popover-backdrop"
    document.body.appendChild(backdrop)

    backdrop.addEventListener("click", () => {
      shrinkAndCloseAll()
    })
  }
  return backdrop
}

function shrinkAndCloseAll() {
  const backdrop = document.getElementById("popover-backdrop")
  backdrop?.classList.remove("active")
  isExpanded = false
  clearActivePopover(true)
}

// ESC key closes expanded popover
if (typeof window !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isExpanded) {
      shrinkAndCloseAll()
    }
  })
}

async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  if (isExpanded) return // don't open new hover popovers while one is expanded in modal view
  clearTimeout(hideTimeout)

  const link = (activeAnchor = this)
  if (link.dataset.noPopover === "true") {
    return
  }

  async function setPosition(popoverElement: HTMLElement) {
    if (popoverElement.classList.contains("popover-expanded")) return
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  function showPopover(popoverElement: HTMLElement) {
    clearActivePopover()
    activePopoverEl = popoverElement
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement as HTMLElement)

    if (hash !== "") {
      const inner = popoverElement.querySelector(".popover-inner") as HTMLElement | null
      if (inner) {
        const targetAnchor = `#popover-internal-${hash.slice(1)}`
        const heading = inner.querySelector(targetAnchor) as HTMLElement | null
        if (heading) {
          inner.scroll({ top: heading.offsetTop - 12, behavior: "instant" })
        }
      }
    }
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""
  const popoverId = `popover-${link.pathname}`
  const prevPopoverElement = document.getElementById(popoverId)

  if (!!prevPopoverElement) {
    showPopover(prevPopoverElement)
    return
  }

  const response = await fetchCanonical(targetUrl).catch((err) => {
    console.error(err)
  })

  if (!response) return
  const rawContentType = response.headers.get("Content-Type")
  if (!rawContentType) return
  const [contentType] = rawContentType.split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  popoverElement.setAttribute("data-lenis-prevent", "true")

  // Action Bar with Large Screen (Expand / Collapse) button
  const actionsEl = document.createElement("div")
  actionsEl.className = "popover-actions"
  actionsEl.innerHTML = `
    <button class="popover-btn expand-toggle-btn" title="Phóng to / Thu nhỏ (Large Screen)" aria-label="Toggle Large Screen">
      <svg class="icon-expand" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
      <svg class="icon-compress" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6"></path><path d="M20 10h-6V4"></path><path d="M14 10l7-7"></path><path d="M3 21l7-7"></path></svg>
    </button>
  `
  popoverElement.appendChild(actionsEl)

  // Expand / Collapse button click logic
  const expandBtn = actionsEl.querySelector(".expand-toggle-btn")
  expandBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    const backdrop = getOrCreateBackdrop()

    if (popoverElement.classList.contains("popover-expanded")) {
      // Shrink back to hover popover
      popoverElement.classList.remove("popover-expanded")
      backdrop.classList.remove("active")
      isExpanded = false
      setPosition(popoverElement)
    } else {
      // Expand to 80% Large Screen modal overlay
      popoverElement.classList.add("active-popover")
      popoverElement.classList.add("popover-expanded")
      backdrop.classList.add("active")
      isExpanded = true
      popoverElement.style.transform = "translate(-50%, -50%)"
    }
  })

  // Prevent closing when mouse enters the popover
  popoverElement.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout)
  })

  popoverElement.addEventListener("mouseleave", () => {
    if (!isExpanded) {
      hideTimeout = window.setTimeout(() => {
        clearActivePopover()
      }, 150)
    }
  })

  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.setAttribute("data-lenis-prevent", "true")
  popoverInner.addEventListener("wheel", (e) => {
    e.stopPropagation()
  }, { passive: true })
  popoverInner.dataset.contentType = contentType ?? undefined
  popoverElement.appendChild(popoverInner)

  switch (contentTypeCategory) {
    case "image":
      const img = document.createElement("img")
      img.src = targetUrl.toString()
      img.alt = targetUrl.pathname
      popoverInner.appendChild(img)
      break
    case "application":
      switch (typeInfo) {
        case "pdf":
          const pdf = document.createElement("iframe")
          pdf.src = targetUrl.toString()
          popoverInner.appendChild(pdf)
          break
        default:
          break
      }
      break
    default:
      const contents = await response.text()
      const html = p.parseFromString(contents, "text/html")
      normalizeRelativeURLs(html, targetUrl)
      html.querySelectorAll("[id]").forEach((el) => {
        const targetID = `popover-internal-${el.id}`
        el.id = targetID
      })
      const elts = [...html.getElementsByClassName("popover-hint")]
      if (elts.length === 0) return

      elts.forEach((elt) => popoverInner.appendChild(elt))
  }

  if (!!document.getElementById(popoverId)) {
    return
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    return
  }

  showPopover(popoverElement)
}

function clearActivePopover(force: boolean = false) {
  if (isExpanded && !force) return
  activeAnchor = null
  activePopoverEl = null
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => {
    if (!popoverElement.classList.contains("popover-expanded") || force) {
      popoverElement.classList.remove("active-popover")
      popoverElement.classList.remove("popover-expanded")
    }
  })
}

function setupPopovers() {
  getOrCreateBackdrop()
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  for (const link of links) {
    link.addEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseleave", () => {
      if (!isExpanded) {
        hideTimeout = window.setTimeout(() => {
          clearActivePopover()
        }, 200)
      }
    })
    window.addCleanup(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler)
    })
  }
}

document.addEventListener("nav", setupPopovers)
document.addEventListener("render", setupPopovers)
