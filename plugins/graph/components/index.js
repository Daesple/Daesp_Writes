// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Locale definitions
var en_US_default = { components: { graph: { title: "Graph View" } } };
var vi_VN_default = { components: { graph: { title: "Sơ đồ liên kết" } } };
var locales = { "en-US": en_US_default, "vi-VN": vi_VN_default };
function i18n(locale) {
  return locales[locale] || locales["vi-VN"] || en_US_default;
}

// SCSS Styles
var graph_default = `
.graph {
  margin-top: 1rem;
}
.graph > h3 {
  font-size: 0.95rem;
  margin: 0 0 0.5rem 0;
}
.graph > .graph-outer {
  border-radius: 12px;
  border: 1px solid var(--lightgray);
  box-sizing: border-box;
  height: 260px;
  margin: 0.5em 0;
  position: relative;
  overflow: hidden;
}
.graph > .graph-outer > .global-graph-icon {
  cursor: pointer;
  background: none;
  border: none;
  color: var(--dark);
  opacity: 0.5;
  width: 28px;
  height: 28px;
  position: absolute;
  padding: 0.25rem;
  margin: 0.35rem;
  top: 0;
  right: 0;
  border-radius: 6px;
  background-color: transparent;
  transition: all 0.25s ease;
}
.graph > .graph-outer > .global-graph-icon:hover {
  background-color: var(--lightgray);
}
.graph > .global-graph-outer {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  backdrop-filter: blur(14px);
  display: none;
  overflow: hidden;
}
.graph > .global-graph-outer.active {
  display: inline-block;
}
.graph > .global-graph-outer > .global-graph-container {
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 16px;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 85vh;
  width: 85vw;
}
@media all and (max-width: 800px) {
  .graph > .global-graph-outer > .global-graph-container {
    width: 92%;
    height: 90vh;
  }
}
.graph-container {
  width: 100%;
  height: 100%;
}
`;

// Script implementation
var graph_inline_default = `
(function() {
  function Nu() {
    if (typeof document === "undefined") return "";
    // On localhost / local dev server, ignore basepath (Quartz build sets it
    // to the GitHub Pages subpath, but the dev file server serves from root)
    var host = typeof location !== "undefined" ? location.hostname : "";
    if (host === "localhost" || host === "127.0.0.1") return "";
    return document.body?.dataset?.basepath ?? "";
  }
  function $u(u, e) {
    let t = e ?? Nu();
    let a = u.startsWith("/") ? u : "/" + u;
    return t + a;
  }
  function Fu(u) {
    if (!u) return "index";
    u = u.toLowerCase().trim();
    let base = Nu().toLowerCase();
    if (base && u.startsWith(base)) {
      u = u.substring(base.length);
    }
    if (u.startsWith("/")) u = u.substring(1);
    if (u.endsWith(".html")) u = u.slice(0, -5);
    if (u.endsWith("/index")) u = u.slice(0, -6);
    if (u.endsWith("/")) u = u.slice(0, -1);
    if (u === "" || u === "/") return "index";
    return u;
  }
  function we() {
    if (document.body && document.body.dataset && document.body.dataset.slug) {
      return Fu(document.body.dataset.slug);
    }
    return Fu(window.location.pathname);
  }
  function ke(u) {
    while (u.firstChild) u.removeChild(u.firstChild);
  }

  function loadScript(src) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) return Promise.resolve();
    return new Promise(function(resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.crossOrigin = "anonymous";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  Promise.all([
    loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
    loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js")
  ]).then(function() {
    initGraph();
  }).catch(function(err) {
    console.error("[Graph] Failed to load libraries:", err);
  });

  function initGraph() {
    var d3 = window.d3;
    var PIXI = window.PIXI;
    if (!d3 || !PIXI) return;

    var visitedKey = "graph-visited";
    function getVisited() {
      return new Set(JSON.parse(localStorage.getItem(visitedKey) || "[]"));
    }
    function markVisited(slug) {
      var v = getVisited();
      v.add(slug);
      localStorage.setItem(visitedKey, JSON.stringify(Array.from(v)));
    }

    function resolveColor(prop, fallback) {
      if (!prop) return fallback;
      var el = document.createElement("div");
      el.style.color = prop;
      el.style.position = "absolute";
      el.style.visibility = "hidden";
      document.body.appendChild(el);
      var c = getComputedStyle(el).color;
      el.remove();
      return c || fallback;
    }

    var renderGeneration = 0;

    async function renderGraph(container, currentSlug, gen) {
      var currentKey = Fu(currentSlug);
      if (currentKey === "") currentKey = "index";
      var visited = getVisited();

      ke(container);
      if (gen !== undefined && gen !== renderGeneration) return function() {};

      var cfg = JSON.parse(container.dataset.cfg || "{}");
      var enableDrag = cfg.drag ?? true;
      var enableZoom = cfg.zoom ?? true;
      var depth = cfg.depth ?? 1;
      var scaleFactor = cfg.scale || 1.1;
      var repelStrength = cfg.repelForce || 2.4;
      var centerStrength = cfg.centerForce || 0.16;
      var linkDist = cfg.linkDistance || 55;
      var fontSz = cfg.fontSize || 0.55;
      var removeTags = cfg.removeTags || [];
      var showTags = cfg.showTags ?? true;
      var focusOnHover = cfg.focusOnHover ?? true;
      var enableRadial = cfg.enableRadial ?? false;
      var enableRotate = Boolean(cfg.rotate);
      var enableCurvedLinks = Boolean(cfg.curvedLinks);
      var enableFlowParticles = Boolean(cfg.flowParticles);

      var prefersReducedMotion = false;
      try {
        prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (e) {}
      if (prefersReducedMotion) {
        enableRotate = false;
        enableFlowParticles = false;
      }

      // Obsidian-style Graph Filters from localStorage
      var graphFilters = { tags: true, attachments: false, existingFiles: true, orphans: true };
      try {
        var savedFilters = JSON.parse(localStorage.getItem("quartz-graph-filters") || "{}");
        graphFilters = Object.assign(graphFilters, savedFilters);
      } catch (e) {}

      if (cfg.showTags === false) {
        showTags = false;
      } else if (graphFilters.tags !== undefined) {
        showTags = graphFilters.tags;
      }

      var isAttachment = function(p) {
        return /\.(png|jpe?g|webp|gif|svg|mp4|pdf|mp3|zip)$/i.test(p) || p.startsWith("assets/") || p.startsWith("static/");
      };

      var contentData;
      try {
        var rawData = await fetchData;
        contentData = new Map();
        for (var k in rawData) {
          if (!graphFilters.attachments && isAttachment(k)) continue;
          if (!graphFilters.tags && k.startsWith("tags/")) continue;
          contentData.set(Fu(k), rawData[k]);
        }
      } catch (err) {
        console.error("[Graph] Data load error:", err);
        return function() {};
      }

      var width = container.offsetWidth;
      var height = Math.max(container.offsetHeight, 250);
      var allLinks = [];
      var tagNodes = [];
      var knownKeys = new Set(contentData.keys());
      var ghostKeys = new Set();

      contentData.forEach(function(item, slug) {
        if (!graphFilters.attachments && isAttachment(slug)) return;
        if (!graphFilters.tags && slug.startsWith("tags/")) return;

        var links = item.links || [];
        for (var i = 0; i < links.length; i++) {
          var target = Fu(links[i]);
          if (!graphFilters.attachments && isAttachment(target)) continue;
          if (!graphFilters.tags && target.startsWith("tags/")) continue;

          if (knownKeys.has(target)) {
            allLinks.push({ source: slug, target: target });
          } else if (!graphFilters.existingFiles) {
            // Unresolved ghost link
            ghostKeys.add(target);
            allLinks.push({ source: slug, target: target });
          }
        }
        if (showTags) {
          var tags = item.tags || [];
          for (var t = 0; t < tags.length; t++) {
            var tag = tags[t];
            if (removeTags.indexOf(tag) === -1) {
              var tagSlug = Fu("tags/" + tag);
              if (tagNodes.indexOf(tagSlug) === -1) tagNodes.push(tagSlug);
              allLinks.push({ source: slug, target: tagSlug });
            }
          }
        }
      });

      var activeSlugs = new Set();
      if (depth >= 0) {
        var queue = [currentKey];
        var seen = new Set([currentKey]);
        for (var step = 0; step <= depth && queue.length > 0; step++) {
          var nextQueue = [];
          for (var q = 0; q < queue.length; q++) {
            var curr = queue[q];
            activeSlugs.add(curr);
            for (var l = 0; l < allLinks.length; l++) {
              var link = allLinks[l];
              if (link.source === curr && !seen.has(link.target)) {
                seen.add(link.target);
                nextQueue.push(link.target);
              }
              if (link.target === curr && !seen.has(link.source)) {
                seen.add(link.source);
                nextQueue.push(link.source);
              }
            }
          }
          queue = nextQueue;
        }
      } else {
        knownKeys.forEach(function(k) {
          if (!graphFilters.attachments && isAttachment(k)) return;
          if (!graphFilters.tags && k.startsWith("tags/")) return;
          activeSlugs.add(k);
        });
        if (showTags) {
          for (var tg = 0; tg < tagNodes.length; tg++) activeSlugs.add(tagNodes[tg]);
        }
        if (!graphFilters.existingFiles) {
          ghostKeys.forEach(function(gk) { activeSlugs.add(gk); });
        }
      }

      // Filter orphan nodes if orphans filter is OFF
      if (!graphFilters.orphans) {
        var connectedSlugs = new Set();
        for (var lk = 0; lk < allLinks.length; lk++) {
          connectedSlugs.add(allLinks[lk].source);
          connectedSlugs.add(allLinks[lk].target);
        }
        var filteredSlugs = new Set();
        activeSlugs.forEach(function(s) {
          if (connectedSlugs.has(s)) filteredSlugs.add(s);
        });
        activeSlugs = filteredSlugs;
      }

      var simulationNodes = [];
      var nodeMap = new Map();
      activeSlugs.forEach(function(slug) {
        var isTag = slug.startsWith("tags/");
        var labelText = isTag ? "#" + slug.substring(5) : contentData.get(slug)?.title || slug;
        var nodeTags = isTag ? [] : contentData.get(slug)?.tags || [];
        var n = {
          id: slug,
          text: labelText,
          tags: nodeTags,
          x: (Math.random() - 0.5) * (width * 0.6),
          y: (Math.random() - 0.5) * (height * 0.6),
          vx: 0,
          vy: 0
        };
        simulationNodes.push(n);
        nodeMap.set(slug, n);
      });

      var simulationLinks = [];
      for (var lk = 0; lk < allLinks.length; lk++) {
        var l = allLinks[lk];
        if (activeSlugs.has(l.source) && activeSlugs.has(l.target)) {
          var srcNode = nodeMap.get(l.source);
          var tgtNode = nodeMap.get(l.target);
          if (srcNode && tgtNode) {
            simulationLinks.push({ source: srcNode, target: tgtNode });
          }
        }
      }

      // Detect dark vs light vs blue/blueprint theme
      var savedTheme = document.documentElement.getAttribute("saved-theme") || "blue";
      var isBlueprint = savedTheme === "blue" || savedTheme === "blueprint";
      var isDark = savedTheme === "dark" || isBlueprint ||
                   (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

      var computedStyle = getComputedStyle(document.documentElement);
      var colorSecondary = resolveColor(computedStyle.getPropertyValue("--secondary").trim(), isBlueprint ? "#38bdf8" : (isDark ? "#a882ff" : "#7c3aed"));
      var colorTertiary = resolveColor(computedStyle.getPropertyValue("--tertiary").trim(), isBlueprint ? "#7dd3fc" : (isDark ? "#48c78e" : "#059669"));
      var colorGray = resolveColor(computedStyle.getPropertyValue("--gray").trim(), isBlueprint ? "#648ba8" : (isDark ? "#9e9eb0" : "#64748b"));
      // 20-30% brighter in dark mode, technical grid lines in blueprint
      var colorLineDefault = isBlueprint ? "#1e4976" : (isDark ? "#525268" : "#94a3b8");
      var colorDark = resolveColor(computedStyle.getPropertyValue("--dark").trim(), isBlueprint ? "#ffffff" : (isDark ? "#f8fafc" : "#0f172a"));
      var colorLight = resolveColor(computedStyle.getPropertyValue("--light").trim(), isBlueprint ? "#0d223a" : (isDark ? "#16161a" : "#faf8f8"));
      var fontFam = computedStyle.getPropertyValue("--bodyFont").trim() || "inherit";

      // Color coding palette (Blueprint uses cohesive drafting blues & cyans with clear hierarchy)
      var colorCurrent = colorSecondary; // Current active page
      var colorProjects = resolveColor(isBlueprint ? "#93c5fd" : (isDark ? "#60a5fa" : "#2563eb")); // Technical drafting blue
      var colorResources = resolveColor(isBlueprint ? "#67e8f9" : (isDark ? "#34d399" : "#059669")); // Cyan drafting ink
      var colorTopics = resolveColor(isBlueprint ? "#38bdf8" : (isDark ? "#fbbf24" : "#d97706")); // Electric blueprint cyan for hubs
      var colorTags = resolveColor(isBlueprint ? "#7dd3fc" : (isDark ? "#f472b6" : "#e11d48")); // Sky blueprint ink
      var colorDefault = resolveColor(isBlueprint ? "#94a3b8" : (isDark ? "#94a3b8" : "#64748b")); // Technical chalk gray

      // High-contrast Hover Text Highlight Color
      var colorHoverHighlight = resolveColor(isBlueprint ? "#ffffff" : (isDark ? "#38bdf8" : "#0284c7"));

      // Blueprint color system type colors
      var colorTypeProject = resolveColor(computedStyle.getPropertyValue("--type-project").trim(), "#38bdf8");
      var colorTypeResource = resolveColor(computedStyle.getPropertyValue("--type-resource").trim(), "#fbbf24");
      var colorTypeConcept = resolveColor(computedStyle.getPropertyValue("--type-concept").trim(), "#a78bfa");
      var colorTypeOther = resolveColor(computedStyle.getPropertyValue("--type-other").trim(), "#5f7898");
      var colorBpLine = resolveColor(computedStyle.getPropertyValue("--bp-line").trim(), "rgba(56,189,248,0.18)");
      var colorBpText = resolveColor(computedStyle.getPropertyValue("--bp-text").trim(), "#e6f1ff");

      function getNodeTypeColor(node) {
        var tags = node.tags;
        if ((!tags || tags.length === 0) && contentData) {
          var d = contentData.get(node.id);
          tags = d?.tags;
        }
        var firstTag = (Array.isArray(tags) && tags.length > 0) ? tags[0] : "";
        if (firstTag === "project") return colorTypeProject;
        if (firstTag === "resource") return colorTypeResource;
        if (firstTag === "concept") return colorTypeConcept;
        if (firstTag) return colorTypeOther;
        return colorTypeOther || colorBpLine;
      }

      function getLinkControlPoint(x1, y1, x2, y2, srcId, tgtId) {
        var mx = (x1 + x2) / 2;
        var my = (y1 + y2) / 2;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.001) return { cx: mx, cy: my };
        var dir = (srcId < tgtId) ? 1 : -1;
        var offset = len * 0.15 * dir;
        var nx = (-dy / len) * offset;
        var ny = (dx / len) * offset;
        return { cx: mx + nx, cy: my + ny };
      }

      var app = new PIXI.Application();
      await app.init({
        width: width,
        height: height,
        antialias: true,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        eventMode: "static"
      });
      container.appendChild(app.canvas);

      var mainStage = new PIXI.Container();
      app.stage.addChild(mainStage);

      var graphWrapper = new PIXI.Container();
      graphWrapper.position.set(width / 2, height / 2);
      graphWrapper.pivot.set(width / 2, height / 2);
      mainStage.addChild(graphWrapper);

      function getNodeDegree(node) {
        var deg = 0;
        for (var i = 0; i < simulationLinks.length; i++) {
          if (simulationLinks[i].source.id === node.id || simulationLinks[i].target.id === node.id) deg++;
        }
        return deg;
      }

      function getNodeRadius(node) {
        var deg = getNodeDegree(node);
        // Obsidian-style hub scaling: bigger circles for hub notes, small clean dots for leaves
        if (deg >= 5) return 6.5 + Math.sqrt(deg) * 2.2;
        if (deg >= 2) return 4.5 + Math.sqrt(deg) * 1.5;
        return 3.5;
      }

      // Enhanced collision radius to guarantee titles and nodes never overlap
      var sim = d3.forceSimulation(simulationNodes)
        .force("charge", d3.forceManyBody().strength(-130 * repelStrength))
        .force("center", d3.forceCenter().strength(centerStrength))
        .force("link", d3.forceLink(simulationLinks).distance(linkDist))
        .force("collide", d3.forceCollide().radius(function(d) {
          var r = getNodeRadius(d);
          return r + 26;
        }).iterations(4));

      if (enableRadial) {
        var rad = Math.min(width, height) / 2 * 0.8;
        sim.force("radial", d3.forceRadial(rad).strength(0.2));
      }

      var linkContainer = new PIXI.Container();
      var particleGfx = new PIXI.Graphics();
      particleGfx.eventMode = "none";
      var nodeContainer = new PIXI.Container();
      var labelContainer = new PIXI.Container();
      graphWrapper.addChild(linkContainer);
      graphWrapper.addChild(particleGfx);
      graphWrapper.addChild(nodeContainer);
      graphWrapper.addChild(labelContainer);

      var nodeItems = [];
      var linkItems = [];
      var hoveredNodeId = null;
      var activeNodeIds = new Set();
      var dragStartTime = 0;
      var isDragging = false;

      var activeFilterTags = null;
      try {
        if (window.__quartzActiveFilterTags instanceof Set) {
          activeFilterTags = window.__quartzActiveFilterTags;
        }
      } catch (e) {}

      function isNodeFilterVisible(node) {
        if (!activeFilterTags || !node) return true;
        var nid = node.id || "";
        if (nid.startsWith("tags/")) {
          var tagClean = nid.substring(5).toLowerCase();
          return activeFilterTags.has(tagClean);
        }
        var tags = node.tags;
        if ((!tags || tags.length === 0) && contentData) {
          tags = contentData.get(nid)?.tags;
        }
        if (!tags || tags.length === 0) {
          return activeFilterTags.has("other");
        }
        for (var t = 0; t < tags.length; t++) {
          if (activeFilterTags.has(String(tags[t]).toLowerCase().trim())) return true;
        }
        return false;
      }

      var initScale = scaleFactor || 1.0;
      var initialZoom = d3.zoomIdentity
        .translate((width / 2) * (1 - initScale), (height / 2) * (1 - initScale))
        .scale(initScale);
      var currentZoom = initialZoom;
      var targetZoom = initialZoom;
      mainStage.scale.set(currentZoom.k, currentZoom.k);
      mainStage.position.set(currentZoom.x, currentZoom.y);

      function getNodeColor(node) {
        var slug = node.id.toLowerCase();
        if (node.id === currentKey) return colorCurrent;
        if (slug.startsWith("tags/")) return colorTags;
        if (slug.startsWith("topics/") || (node.tags && node.tags.includes("moc"))) return colorTopics;
        if (slug.startsWith("projects/")) return colorProjects;
        if (slug.startsWith("resources/")) return colorResources;
        return colorDefault;
      }

      function updateActiveSet(id) {
        hoveredNodeId = id;
        if (id === null) {
          activeNodeIds = new Set();
          for (var i = 0; i < nodeItems.length; i++) nodeItems[i].active = false;
          for (var i = 0; i < linkItems.length; i++) linkItems[i].active = false;
        } else {
          activeNodeIds = new Set([id]);
          for (var i = 0; i < linkItems.length; i++) {
            var simL = linkItems[i].simulationData;
            if (simL.source.id === id || simL.target.id === id) {
              activeNodeIds.add(simL.source.id);
              activeNodeIds.add(simL.target.id);
              linkItems[i].active = true;
            } else {
              linkItems[i].active = false;
            }
          }
          for (var i = 0; i < nodeItems.length; i++) {
            nodeItems[i].active = activeNodeIds.has(nodeItems[i].simulationData.id);
          }
        }
      }

      function updateVisuals() {
        // Link alpha & color
        for (var i = 0; i < linkItems.length; i++) {
          var item = linkItems[i];
          var srcNode = item.simulationData.source;
          var tgtNode = item.simulationData.target;
          var srcVis = isNodeFilterVisible(srcNode);
          var tgtVis = isNodeFilterVisible(tgtNode);

          if (!srcVis || !tgtVis) {
            item.targetAlpha = 0;
            item.isFilteredOut = true;
          } else {
            item.isFilteredOut = false;
            if (hoveredNodeId !== null) {
              item.targetAlpha = item.active ? 0.85 : 0.04;
              item.targetColor = item.active ? colorSecondary : (item.baseColor || colorLineDefault);
            } else {
              // Visible, crisp default lines (20-30% brighter/darker than background)
              var isCurrentLink = (item.simulationData.source.id === currentKey || item.simulationData.target.id === currentKey);
              item.targetAlpha = isCurrentLink ? (enableCurvedLinks ? 0.65 : 0.85) : (enableCurvedLinks ? 0.25 : 0.55);
              item.targetColor = isCurrentLink ? colorCurrent : (item.baseColor || colorLineDefault);
            }
          }
        }
        linksNeedRedraw = true;

        // Node circle alpha
        for (var i = 0; i < nodeItems.length; i++) {
          var item = nodeItems[i];
          var isVis = isNodeFilterVisible(item.simulationData);
          item.isFilteredOut = !isVis;

          if (!isVis) {
            item.targetGfxAlpha = 0;
          } else if (hoveredNodeId !== null && focusOnHover) {
            item.targetGfxAlpha = item.active ? 1.0 : 0.12;
          } else {
            item.targetGfxAlpha = 1.0;
          }
        }

        // Title/Label alpha and scaling (Obsidian semantic zoom & fade)
        var zoomK = currentZoom.k || 1.0;
        var baseScale = (1 / scaleFactor) * Math.pow(zoomK, -0.6);
        var zoomAlpha = Math.max(0, Math.min(1, (zoomK - 0.50) / 0.35));
        var leafAlpha = Math.max(0, Math.min(1, (zoomK - 0.70) / 0.35));

        for (var i = 0; i < nodeItems.length; i++) {
          var item = nodeItems[i];
          if (item.isFilteredOut) {
            item.targetLabelAlpha = 0;
            continue;
          }
          var nid = item.simulationData.id;
          var deg = item.degree;

          if (hoveredNodeId !== null) {
            if (nid === hoveredNodeId) {
              // Hovered node title: Highlighted in Sky Blue / Cyan with normal clean weight
              item.targetLabelAlpha = 1.0;
              item.label.scale.set(baseScale);
              item.label.style.fill = colorHoverHighlight;
              item.label.style.fontWeight = "normal";
            } else if (item.active) {
              // Directly connected node titles: normal clean weight, clearly visible
              item.targetLabelAlpha = 0.95;
              item.label.scale.set(baseScale);
              item.label.style.fill = colorDark;
              item.label.style.fontWeight = "normal";
            } else {
              // Unconnected node titles: FADED OUT smoothly to avoid overlap/clutter
              item.targetLabelAlpha = 0.02;
              item.label.scale.set(baseScale);
              item.label.style.fill = colorDark;
              item.label.style.fontWeight = "normal";
            }
          } else {
            // Default view with Zoom-level fade:
            var isCurrent = (nid === currentKey);
            if (isCurrent) {
              item.targetLabelAlpha = Math.max(0.65, zoomAlpha);
              item.label.scale.set(baseScale * 1.08);
              item.label.style.fill = colorCurrent;
              item.label.style.fontWeight = "bold";
            } else if (deg >= 2) {
              // Hub nodes: appear at medium zoom
              item.targetLabelAlpha = zoomAlpha * 0.9;
              item.label.scale.set(baseScale);
              item.label.style.fill = colorDark;
              item.label.style.fontWeight = "normal";
            } else {
              // Leaf nodes: appear as you zoom in closer
              item.targetLabelAlpha = leafAlpha * 0.75;
              item.label.scale.set(baseScale);
              item.label.style.fill = colorDark;
              item.label.style.fontWeight = "normal";
            }
          }
        }
      }

      // Create Nodes
      for (var k = 0; k < simulationNodes.length; k++) {
        var nodeData = simulationNodes[k];
        var isTag = nodeData.id.startsWith("tags/");
        var isCurrent = (nodeData.id === currentKey);
        var rad = getNodeRadius(nodeData);
        if (isCurrent) rad = rad * 1.35 + 1.5;
        var deg = getNodeDegree(nodeData);
        var col = getNodeColor(nodeData);

        var txt = new PIXI.Text({
          text: nodeData.text,
          style: {
            fontSize: isCurrent ? (fontSz * 15.5) : (fontSz * 14.5),
            fill: isCurrent ? colorCurrent : colorDark,
            fontFamily: fontFam,
            fontWeight: isCurrent ? "bold" : "normal"
          },
          resolution: (window.devicePixelRatio || 1) * 3
        });
        // Set anchor to top-center (0.5, 0) so the text sits strictly BELOW the circle
        txt.anchor.set(0.5, 0);
        txt.alpha = isCurrent ? 1.0 : (deg >= 2 ? 0.9 : 0.7);
        txt.scale.set(1 / scaleFactor);
        labelContainer.addChild(txt);

        var haloGfx = null;
        if (isCurrent) {
          haloGfx = new PIXI.Graphics();
          // Soft aura glow
          haloGfx.circle(0, 0, rad + 4.5);
          haloGfx.fill({ color: colorCurrent, alpha: 0.12 });
          // Outer target halo ring
          haloGfx.circle(0, 0, rad + 4.5);
          haloGfx.stroke({ width: 1.5, color: colorCurrent, alpha: 0.75 });
          nodeContainer.addChild(haloGfx);
        }

        var gfx = new PIXI.Graphics();
        gfx.circle(0, 0, rad);
        gfx.fill({ color: isTag ? colorLight : col });
        if (isTag) {
          gfx.stroke({ width: 1.5, color: colorTags });
        } else if (isCurrent) {
          gfx.stroke({ width: 1.5, color: colorCurrent, alpha: 0.95 });
        }
        gfx.eventMode = "static";
        gfx.cursor = "pointer";

        (function(targetData, targetGfx) {
          targetGfx.on("pointerover", function() {
            updateActiveSet(targetData.id);
            if (!isDragging) updateVisuals();
          });
          targetGfx.on("pointerleave", function() {
            updateActiveSet(null);
            if (!isDragging) updateVisuals();
          });
        })(nodeData, gfx);

        nodeContainer.addChild(gfx);
        nodeItems.push({
          simulationData: nodeData,
          gfx: gfx,
          haloGfx: haloGfx,
          label: txt,
          radius: rad,
          degree: deg,
          color: col,
          currentGfxAlpha: 1.0,
          targetGfxAlpha: 1.0,
          currentLabelAlpha: 0.7,
          targetLabelAlpha: 0.7,
          active: false
        });
      }

      // Create Links
      for (var lk = 0; lk < simulationLinks.length; lk++) {
        var linkData = simulationLinks[lk];
        var linkGfx = new PIXI.Graphics();
        linkGfx.eventMode = "none";
        linkContainer.addChild(linkGfx);
        var baseLinkColor = enableCurvedLinks ? getNodeTypeColor(linkData.source) : colorLineDefault;
        var baseLinkAlpha = enableCurvedLinks ? 0.25 : 0.6;
        linkItems.push({
          simulationData: linkData,
          gfx: linkGfx,
          baseColor: baseLinkColor,
          color: baseLinkColor,
          targetColor: baseLinkColor,
          alpha: baseLinkAlpha,
          currentAlpha: baseLinkAlpha,
          targetAlpha: baseLinkAlpha,
          active: false
        });
      }

      // Feature 3: Flowing dots along links (max 50, under 900px: max 25)
      var particles = [];
      if (enableFlowParticles && simulationLinks.length > 0) {
        var maxParticles = (window.innerWidth < 900) ? 25 : 45;
        // Shuffle links slightly so dots are naturally distributed across the network
        var scoredLinks = simulationLinks.slice().sort(function(a, b) {
          var scoreA = getNodeDegree(a.source) + getNodeDegree(a.target) + (Math.random() * 4 - 2);
          var scoreB = getNodeDegree(b.source) + getNodeDegree(b.target) + (Math.random() * 4 - 2);
          return scoreB - scoreA;
        });
        var chosenLinks = scoredLinks.slice(0, maxParticles);
        for (var pIdx = 0; pIdx < chosenLinks.length; pIdx++) {
          var pLink = chosenLinks[pIdx];
          var pColor = getNodeTypeColor(pLink.source) || colorBpText;
          particles.push({
            link: pLink,
            progress: Math.random(),
            duration: 4200 + Math.random() * 5800,
            radius: 1.3 + Math.random() * 0.7,
            color: pColor
          });
        }
      }

      var currentAngle = 0;
      var lastInteractionTime = 0;
      var lastTime = performance.now();
      var linksNeedRedraw = true;
      var isZooming = false;
      var zoomEndTimeout = null;
      var zoomBehavior = null;
      var isTabHidden = document.hidden;
      var isOutOfView = false;

      var handleVisibilityChange = function() {
        isTabHidden = document.hidden;
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      var observer = null;
      try {
        observer = new IntersectionObserver(function(entries) {
          for (var o = 0; o < entries.length; o++) {
            if (entries[o].target === container) {
              isOutOfView = !entries[o].isIntersecting;
            }
          }
        }, { threshold: 0.05 });
        observer.observe(container);
      } catch (e) {}

      var resizeObserver = null;
      try {
        resizeObserver = new ResizeObserver(function(entries) {
          for (var rIdx = 0; rIdx < entries.length; rIdx++) {
            var cr = entries[rIdx].contentRect;
            if (cr.width > 50 && cr.height > 50) {
              if (Math.abs(cr.width - width) > 4 || Math.abs(cr.height - height) > 4) {
                width = Math.round(cr.width);
                height = Math.round(cr.height);
                try {
                  app.renderer.resize(width, height);
                } catch (err) {}
                graphWrapper.position.set(width / 2, height / 2);
                graphWrapper.pivot.set(width / 2, height / 2);
                if (enableZoom && typeof zoomBehavior !== "undefined" && zoomBehavior) {
                  zoomBehavior.extent([[0, 0], [width, height]]);
                }
                linksNeedRedraw = true;
              }
            }
          }
        });
        resizeObserver.observe(container);
      } catch (e) {}

      // Drag behavior with inverse rotation support
      if (enableDrag) {
        var findSubject = function(event) {
          var zx = (event.x - currentZoom.x) / currentZoom.k;
          var zy = (event.y - currentZoom.y) / currentZoom.k;
          var rx = zx - width / 2;
          var ry = zy - height / 2;
          var cos = Math.cos(-currentAngle);
          var sin = Math.sin(-currentAngle);
          var unrotatedX = rx * cos - ry * sin;
          var unrotatedY = rx * sin + ry * cos;
          for (var i = 0; i < simulationNodes.length; i++) {
            var n = simulationNodes[i];
            if (!isNodeFilterVisible(n)) continue;
            var dx = unrotatedX - n.x;
            var dy = unrotatedY - n.y;
            if (Math.sqrt(dx * dx + dy * dy) < getNodeRadius(n) + 10) return n;
          }
          return null;
        };

        var lastDragX = 0, lastDragY = 0, lastDragTime = 0;
        var nodeVx = 0, nodeVy = 0;

        var dragBehavior = d3.drag()
          .container(app.canvas)
          .subject(findSubject)
          .on("start", function(event) {
            if (!event.active) sim.alphaTarget(0.8).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
            var zx = (event.x - currentZoom.x) / currentZoom.k;
            var zy = (event.y - currentZoom.y) / currentZoom.k;
            var rx = zx - width / 2;
            var ry = zy - height / 2;
            var cos = Math.cos(-currentAngle);
            var sin = Math.sin(-currentAngle);
            var curX = rx * cos - ry * sin;
            var curY = rx * sin + ry * cos;
            event.subject.__dragOffset = { x: curX - event.subject.x, y: curY - event.subject.y };
            dragStartTime = Date.now();
            lastDragX = curX;
            lastDragY = curY;
            lastDragTime = performance.now();
            nodeVx = 0;
            nodeVy = 0;
            isDragging = true;
            hoveredNodeId = event.subject.id;
            lastInteractionTime = performance.now();
            linksNeedRedraw = true;
          })
          .on("drag", function(event) {
            var zx = (event.x - currentZoom.x) / currentZoom.k;
            var zy = (event.y - currentZoom.y) / currentZoom.k;
            var rx = zx - width / 2;
            var ry = zy - height / 2;
            var cos = Math.cos(-currentAngle);
            var sin = Math.sin(-currentAngle);
            var curX = rx * cos - ry * sin;
            var curY = rx * sin + ry * cos;
            event.subject.fx = curX - event.subject.__dragOffset.x;
            event.subject.fy = curY - event.subject.__dragOffset.y;
            var now = performance.now();
            var dt = Math.max(now - lastDragTime, 8);
            nodeVx = ((curX - lastDragX) / dt) * 16.6;
            nodeVy = ((curY - lastDragY) / dt) * 16.6;
            lastDragX = curX;
            lastDragY = curY;
            lastDragTime = now;
            lastInteractionTime = now;
            linksNeedRedraw = true;
          })
          .on("end", function(event) {
            if (!event.active) sim.alphaTarget(0.2);
            // Apply drag momentum inertia to node velocity
            event.subject.vx = (event.subject.vx || 0) + nodeVx * 0.85;
            event.subject.vy = (event.subject.vy || 0) + nodeVy * 0.85;
            event.subject.fx = null;
            event.subject.fy = null;
            isDragging = false;
            lastInteractionTime = performance.now();
            linksNeedRedraw = true;
            setTimeout(function() { if (!isDragging) sim.alphaTarget(0); }, 300);
            updateActiveSet(null);
            updateVisuals();
            if (Date.now() - dragStartTime < 400 && Math.abs(nodeVx) < 1.2 && Math.abs(nodeVy) < 1.2) {
              window.location.href = $u(event.subject.id);
            }
          });

        d3.select(app.canvas).call(dragBehavior);
      } else {
        for (var i = 0; i < nodeItems.length; i++) {
          (function(item) {
            item.gfx.on("click", function() {
              window.location.href = $u(item.simulationData.id);
            });
          })(nodeItems[i]);
        }
      }

      // Zoom & Pan behavior
      if (enableZoom) {
        zoomBehavior = d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([0.15, 5.0])
          .wheelDelta(function(event) {
            return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
          })
          .on("zoom", function(event) {
            targetZoom = event.transform;
            isZooming = true;
            lastInteractionTime = performance.now();
            clearTimeout(zoomEndTimeout);
            zoomEndTimeout = setTimeout(function() {
              isZooming = false;
              lastInteractionTime = performance.now();
            }, 250);
          });
        d3.select(app.canvas).call(zoomBehavior).call(zoomBehavior.transform, initialZoom);
      }

      var isStopped = false;
      function onFrame() {
        if (!isStopped) {
          var now = performance.now();
          var delta = Math.min(now - lastTime, 100);
          lastTime = now;

          if (isTabHidden || isOutOfView) {
            requestAnimationFrame(onFrame);
            return;
          }

          // Feature 1: Smooth rotation around center
          // - Drag: pause completely
          // - Hover: gentle slow rotation (1/3 speed)
          // - Idle: full speed
          if (enableRotate) {
            var fullSpeed = 0.000020644; // ~5 min / full turn
            var hoverSpeed = fullSpeed * 0.35; // ~14 min / turn while hovering
            var rotSpeed;
            if (isDragging || isZooming) {
              rotSpeed = 0;
            } else if (hoveredNodeId !== null) {
              rotSpeed = hoverSpeed;
            } else {
              rotSpeed = fullSpeed;
            }
            if (rotSpeed > 0) {
              currentAngle = (currentAngle + rotSpeed * delta) % (Math.PI * 2);
              graphWrapper.rotation = currentAngle;
            }
          }

          // Smooth inertia lerp for zoom & pan in graph view
          var diffK = targetZoom.k - currentZoom.k;
          var diffX = targetZoom.x - currentZoom.x;
          var diffY = targetZoom.y - currentZoom.y;
          if (Math.abs(diffK) > 0.0001 || Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01) {
            var lerp = 0.22;
            currentZoom = d3.zoomIdentity
              .translate(currentZoom.x + diffX * lerp, currentZoom.y + diffY * lerp)
              .scale(currentZoom.k + diffK * lerp);
            mainStage.scale.set(currentZoom.k, currentZoom.k);
            mainStage.position.set(currentZoom.x, currentZoom.y);
            updateVisuals();
          }

          // Smooth animated fade transitions for nodes and links
          var fadeLerp = 0.20;
          for (var i = 0; i < nodeItems.length; i++) {
            var item = nodeItems[i];
            item.currentGfxAlpha += (item.targetGfxAlpha - item.currentGfxAlpha) * fadeLerp;
            item.gfx.alpha = item.currentGfxAlpha;
            item.gfx.visible = item.currentGfxAlpha > 0.005;
            item.currentLabelAlpha += (item.targetLabelAlpha - item.currentLabelAlpha) * fadeLerp;
            item.label.alpha = item.currentLabelAlpha;
            item.label.visible = item.currentLabelAlpha > 0.005;
            if (enableRotate) {
              item.label.rotation = -currentAngle;
            }
          }
          for (var i = 0; i < linkItems.length; i++) {
            var link = linkItems[i];
            var prevAlpha = link.currentAlpha;
            link.currentAlpha += (link.targetAlpha - link.currentAlpha) * fadeLerp;
            link.alpha = link.currentAlpha;
            link.gfx.visible = link.currentAlpha > 0.005;
            link.color = link.targetColor || link.baseColor || colorLineDefault;
            if (Math.abs(link.currentAlpha - prevAlpha) > 0.005) {
              linksNeedRedraw = true;
            }
          }
          var pulse = (Math.sin(now * 0.0024) + 1) * 0.5; // Smooth 0..1 wave (~2.6s cycle)

          for (var i = 0; i < nodeItems.length; i++) {
            var item = nodeItems[i];
            var nx = item.simulationData.x;
            var ny = item.simulationData.y;
            if (nx != null && ny != null) {
              var posX = nx + width / 2;
              var posY = ny + height / 2;
              item.gfx.position.set(posX, posY);
              if (item.haloGfx) {
                item.haloGfx.position.set(posX, posY);
                var haloScale = 1.0 + pulse * 0.22;
                item.haloGfx.scale.set(haloScale, haloScale);
                item.haloGfx.alpha = item.currentGfxAlpha * (0.40 + pulse * 0.50);
              }
              // Place label BELOW the node circle
              // Offset = radius + gap, then corrected because label is scaled down
              var labelScale = 1 / scaleFactor;
              var labelGap = 5;
              item.label.position.set(posX, posY + item.radius + labelGap);            }
          }

          var isSimRunning = sim.alpha() > 0.005 || isDragging;
          if (isSimRunning) {
            linksNeedRedraw = true;
          }

          // Feature 2: Redraw curved links only when node positions move or alpha settles
          if (linksNeedRedraw || !enableCurvedLinks) {
            for (var i = 0; i < linkItems.length; i++) {
              var link = linkItems[i];
              var simD = link.simulationData;
              var sx = simD.source.x, sy = simD.source.y;
              var tx = simD.target.x, ty = simD.target.y;
              if (sx != null && sy != null && tx != null && ty != null) {
                link.gfx.clear();
                var startX = sx + width / 2;
                var startY = sy + height / 2;
                var endX = tx + width / 2;
                var endY = ty + height / 2;
                link.gfx.moveTo(startX, startY);
                if (enableCurvedLinks) {
                  var cp = getLinkControlPoint(startX, startY, endX, endY, simD.source.id, simD.target.id);
                  link.gfx.quadraticCurveTo(cp.cx, cp.cy, endX, endY);
                } else {
                  link.gfx.lineTo(endX, endY);
                }
                var isCurrentLink = (simD.source.id === currentKey || simD.target.id === currentKey);
                var strokeWidth = link.active ? 1.0 : (isCurrentLink ? 0.75 : 0.5);
                link.gfx.stroke({ alpha: link.alpha, width: strokeWidth, color: link.color });
              }
            }
            if (!isSimRunning) {
              linksNeedRedraw = false;
            }
          }

          // Feature 3: Flowing dots along curved lines
          if (enableFlowParticles && particles.length > 0) {
            particleGfx.clear();
            for (var p = 0; p < particles.length; p++) {
              var pt = particles[p];
              pt.progress = (pt.progress + delta / pt.duration) % 1.0;
              var simL = pt.link;
              // Skip particles on filtered-out links
              if (!isNodeFilterVisible(simL.source) || !isNodeFilterVisible(simL.target)) continue;
              var sx = simL.source.x, sy = simL.source.y;
              var tx = simL.target.x, ty = simL.target.y;
              if (sx != null && sy != null && tx != null && ty != null) {
                var pX1 = sx + width / 2;
                var pY1 = sy + height / 2;
                var pX2 = tx + width / 2;
                var pY2 = ty + height / 2;
                var prog = pt.progress;
                var invP = 1.0 - prog;
                var dotX, dotY;
                if (enableCurvedLinks) {
                  var pCp = getLinkControlPoint(pX1, pY1, pX2, pY2, simL.source.id, simL.target.id);
                  dotX = invP * invP * pX1 + 2 * invP * prog * pCp.cx + prog * prog * pX2;
                  dotY = invP * invP * pY1 + 2 * invP * prog * pCp.cy + prog * prog * pY2;
                } else {
                  dotX = pX1 + (pX2 - pX1) * prog;
                  dotY = pY1 + (pY2 - pY1) * prog;
                }
                var dotAlpha = 0.8;
                if (prog < 0.1) {
                  dotAlpha = 0.8 * (prog / 0.1);
                } else if (prog > 0.9) {
                  dotAlpha = 0.8 * ((1.0 - prog) / 0.1);
                }
                particleGfx.circle(dotX, dotY, 1.8);
                particleGfx.fill({ color: pt.color, alpha: dotAlpha });
              }
            }
          }

          requestAnimationFrame(onFrame);
        }
      }

      var handleGraphFilter = function(e) {
        var tags = e.detail?.tags;
        if (Array.isArray(tags)) {
          activeFilterTags = new Set(tags.map(function(t) { return String(t).toLowerCase(); }));
          window.__quartzActiveFilterTags = activeFilterTags;
        } else {
          activeFilterTags = null;
          window.__quartzActiveFilterTags = null;
        }
        updateVisuals();
        linksNeedRedraw = true;
      };
      document.addEventListener("quartz-filter-tags", handleGraphFilter);

      sim.restart();
      updateVisuals();
      onFrame();

      // Homepage intro animation: hide sidebar + headbar, reveal after graph settles
      var isHomepage = (Fu(we()) === "index");
      if (isHomepage && enableRotate && !window.__graphIntroPlayed) {
        window.__graphIntroPlayed = true;
        var body = document.body;
        var prefersReducedMotion = false;
        try { prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}
        if (!prefersReducedMotion) {
          body.classList.add("graph-intro-active");
          setTimeout(function() {
            body.classList.remove("graph-intro-active");
            body.classList.add("graph-intro-done");
            // Remove done class after transition ends (cleanup)
            setTimeout(function() {
              body.classList.remove("graph-intro-done");
            }, 1200);
          }, 3500);
        }
      }

      return function cleanup() {
        isStopped = true;
        sim.stop();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        document.removeEventListener("quartz-filter-tags", handleGraphFilter);
        if (observer) {
          try { observer.disconnect(); } catch (e) {}
        }
        if (resizeObserver) {
          try { resizeObserver.disconnect(); } catch (e) {}
        }
        try { app.destroy(true); } catch (e) {}
      };
    }

    var localCleanups = [];
    var globalCleanups = [];

    function clearCleanups() {
      for (var i = 0; i < localCleanups.length; i++) localCleanups[i]();
      localCleanups = [];
      for (var i = 0; i < globalCleanups.length; i++) globalCleanups[i]();
      globalCleanups = [];
    }

    function closeGlobal() {
      for (var i = 0; i < globalCleanups.length; i++) globalCleanups[i]();
      globalCleanups = [];
      var outers = document.querySelectorAll(".global-graph-outer");
      for (var i = 0; i < outers.length; i++) {
        outers[i].classList.remove("active");
        var sb = outers[i].closest(".sidebar");
        if (sb) sb.style.zIndex = "";
      }
    }

    function openGlobal() {
      for (var i = 0; i < globalCleanups.length; i++) globalCleanups[i]();
      globalCleanups = [];
      var cur = we();
      var outers = document.querySelectorAll(".global-graph-outer");
      for (var i = 0; i < outers.length; i++) {
        var g = outers[i];
        g.classList.add("active");
        var sb = g.closest(".sidebar");
        if (sb) sb.style.zIndex = "1";
        var container = g.querySelector(".global-graph-container");
        if (container) {
          renderGraph(container, cur, undefined).then(function(cl) {
            globalCleanups.push(cl);
          });
        }
      }
    }

    function toggleGlobal() {
      var anyActive = false;
      var outers = document.querySelectorAll(".global-graph-outer");
      for (var i = 0; i < outers.length; i++) {
        if (outers[i].classList.contains("active")) anyActive = true;
      }
      if (anyActive) closeGlobal();
      else openGlobal();
    }

    function refreshLocal() {
      for (var i = 0; i < localCleanups.length; i++) localCleanups[i]();
      localCleanups = [];
      var curGen = ++renderGeneration;
      var cur = we();
      markVisited(Fu(cur));
      var containers = document.querySelectorAll(".graph-container");
      for (var i = 0; i < containers.length; i++) {
        (function(c) {
          renderGraph(c, cur, curGen).then(function(cl) {
            if (curGen === renderGeneration) localCleanups.push(cl);
          });
        })(containers[i]);
      }
    }

    function onNavigate(evt) {
      var slug = evt.detail ? evt.detail.url : we();
      markVisited(Fu(slug));
      refreshLocal();

      var icons = document.querySelectorAll(".global-graph-icon");
      for (var i = 0; i < icons.length; i++) {
        icons[i].onclick = toggleGlobal;
      }

      document.removeEventListener("click", onDocumentClick);
      document.addEventListener("click", onDocumentClick);

      document.removeEventListener("keydown", onKeyDown);
      document.addEventListener("keydown", onKeyDown);
    }

    function onDocumentClick(evt) {
      var outers = document.querySelectorAll(".global-graph-outer.active");
      if (outers.length > 0) {
        var inside = evt.target.closest(".global-graph-container") || evt.target.closest(".global-graph-icon");
        if (!inside) closeGlobal();
      }
    }

    function onKeyDown(evt) {
      if (evt.key === "Escape") {
        closeGlobal();
      }
      if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === "g") {
        evt.preventDefault();
        toggleGlobal();
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        onNavigate({ detail: { url: we() } });
      });
    } else {
      onNavigate({ detail: { url: we() } });
    }

    window.__quartzReRenderGlobalGraph = openGlobal;
    window.__quartzReRenderLocalGraph = refreshLocal;

    document.addEventListener("prenav", clearCleanups);
    document.addEventListener("nav", onNavigate);
    document.addEventListener("render", onNavigate);
    document.addEventListener("themechange", function() {
      refreshLocal();
      var outers = document.querySelectorAll(".global-graph-outer.active");
      if (outers.length > 0) openGlobal();
    });
  }
})();
`;

var l;
l = {
  __e: function(n2, l2, u3, t2) {
    for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
      if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
    } catch (l3) {
      n2 = l3;
    }
    throw n2;
  }
};

var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

var defaultOptions = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.15,
    repelForce: 2.4,
    centerForce: 0.16,
    linkDistance: 55,
    fontSize: 0.55,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: false
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.95,
    repelForce: 2.8,
    centerForce: 0.14,
    linkDistance: 60,
    fontSize: 0.55,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: true
  }
};

var Graph_default = ((userOpts) => {
  const Graph = ({ displayClass, cfg }) => {
    const localGraph = { ...defaultOptions.localGraph, ...userOpts?.localGraph };
    const globalGraph = { ...defaultOptions.globalGraph, ...userOpts?.globalGraph };
    return u2("div", { class: classNames(displayClass, "graph"), children: [
      u2("h3", { children: i18n(cfg.locale ?? "vi-VN").components.graph.title }),
      u2("div", { class: "graph-outer", children: [
        u2("div", { class: "graph-container", "data-cfg": JSON.stringify(localGraph) }),
        u2("button", { class: "global-graph-icon", "aria-label": "Global Graph", children: u2(
          "svg",
          {
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            xmlnsXlink: "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 55 55",
            fill: "currentColor",
            xmlSpace: "preserve",
            children: u2(
              "path",
              {
                d: "M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17\n                s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4\n                c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562\n                C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829\n                c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91\n                v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4\n                s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665\n                C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z M11,9c0-1.103,0.897-2,2-2s2,0.897,2,2s-0.897,2-2,2\n                S11,10.103,11,9z M6,51c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S8.206,51,6,51z M33,49c0,2.206-1.794,4-4,4s-4-1.794-4-4\n                s1.794-4,4-4S33,46.794,33,49z M29,31c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S32.309,31,29,31z M47,41c0,1.103-0.897,2-2,2\n                s-2-0.897-2-2s0.897-2,2-2S47,39.897,47,41z M49,10c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S51.206,10,49,10z"
              }
            )
          }
        ) })
      ] }),
      u2("div", { class: "global-graph-outer", children: u2("div", { class: "global-graph-container", "data-cfg": JSON.stringify(globalGraph) }) })
    ] });
  };
  Graph.css = graph_default;
  Graph.afterDOMLoaded = graph_inline_default;
  return Graph;
});

export { Graph_default as Graph, Graph_default as default };
