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
  function we() {
    let u = window.location.pathname;
    if (u.endsWith("/")) u = u.slice(0, -1);
    if (u.startsWith("/")) u = u.slice(1);
    return u;
  }
  function Nu() {
    return typeof document === "undefined" ? "" : document.body?.dataset?.basepath ?? "";
  }
  function $u(u, e) {
    let t = e ?? Nu();
    let a = u.startsWith("/") ? u : "/" + u;
    return t + a;
  }
  function ft(u, e) {
    if (u === e || u.endsWith("/" + e)) u = u.slice(0, -e.length);
    return u;
  }
  function _t(u, e) {
    if (u.startsWith("/")) u = u.substring(1);
    if (!e && u.endsWith("/")) u = u.slice(0, -1);
    return u;
  }
  function Fu(u) {
    let e = _t(ft(u, "index"), true);
    return e.length === 0 ? "/" : e;
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

      // Obsidian-style Graph Filters from localStorage
      var graphFilters = { tags: true, attachments: false, existingFiles: true, orphans: true };
      try {
        var savedFilters = JSON.parse(localStorage.getItem("quartz-graph-filters") || "{}");
        graphFilters = Object.assign(graphFilters, savedFilters);
      } catch (e) {}

      if (graphFilters.tags !== undefined) showTags = graphFilters.tags;

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

      // Detect dark vs light theme
      var isDark = document.documentElement.getAttribute("saved-theme") === "dark" ||
                   (!document.documentElement.getAttribute("saved-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);

      var computedStyle = getComputedStyle(document.documentElement);
      var colorSecondary = resolveColor(computedStyle.getPropertyValue("--secondary").trim(), isDark ? "#a882ff" : "#7c3aed");
      var colorTertiary = resolveColor(computedStyle.getPropertyValue("--tertiary").trim(), isDark ? "#48c78e" : "#059669");
      var colorGray = resolveColor(computedStyle.getPropertyValue("--gray").trim(), isDark ? "#9e9eb0" : "#64748b");
      // 20-30% brighter in dark mode, 20-30% darker in light mode
      var colorLineDefault = isDark ? "#525268" : "#94a3b8";
      var colorDark = resolveColor(computedStyle.getPropertyValue("--dark").trim(), isDark ? "#f8fafc" : "#0f172a");
      var colorLight = resolveColor(computedStyle.getPropertyValue("--light").trim(), isDark ? "#16161a" : "#faf8f8");
      var fontFam = computedStyle.getPropertyValue("--bodyFont").trim() || "inherit";

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
          return r + 26; // Generous circular collision boundary
        }).iterations(4));

      if (enableRadial) {
        var rad = Math.min(width, height) / 2 * 0.8;
        sim.force("radial", d3.forceRadial(rad).strength(0.2));
      }

      var linkContainer = new PIXI.Container();
      var nodeContainer = new PIXI.Container();
      var labelContainer = new PIXI.Container();
      mainStage.addChild(linkContainer);
      mainStage.addChild(nodeContainer);
      mainStage.addChild(labelContainer);

      var nodeItems = [];
      var linkItems = [];
      var hoveredNodeId = null;
      var activeNodeIds = new Set();
      var dragStartTime = 0;
      var isDragging = false;
      var currentZoom = d3.zoomIdentity;

      function getNodeColor(node) {
        if (node.id === currentKey) return colorSecondary;
        if (node.id.startsWith("tags/")) return colorTertiary;
        if (visited.has(node.id)) return colorTertiary;
        return colorGray;
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
          if (hoveredNodeId !== null) {
            item.alpha = item.active ? 0.95 : 0.05;
            item.color = item.active ? colorSecondary : colorLineDefault;
          } else {
            // Visible, crisp default lines (20-30% brighter/darker than background)
            item.alpha = 0.6;
            item.color = colorLineDefault;
          }
        }

        // Node circle alpha
        for (var i = 0; i < nodeItems.length; i++) {
          var item = nodeItems[i];
          if (hoveredNodeId !== null && focusOnHover) {
            item.gfx.alpha = item.active ? 1.0 : 0.15;
          } else {
            item.gfx.alpha = 1.0;
          }
        }

        // Title/Label alpha and highlighting (Obsidian style)
        var baseScale = 1 / scaleFactor;
        var hoverScale = baseScale * 1.12;
        for (var i = 0; i < nodeItems.length; i++) {
          var item = nodeItems[i];
          var nid = item.simulationData.id;
          var deg = item.degree;

          if (hoveredNodeId !== null) {
            if (nid === hoveredNodeId) {
              // Hovered node title: Bright & Highlighted in Purple
              item.label.alpha = 1.0;
              item.label.scale.set(hoverScale * 1.1);
              item.label.style.fill = colorSecondary;
              item.label.style.fontWeight = "bold";
            } else if (item.active) {
              // Directly connected node titles: HIGHLIGHTED & FULLY VISIBLE
              item.label.alpha = 0.95;
              item.label.scale.set(hoverScale);
              item.label.style.fill = colorDark;
              item.label.style.fontWeight = "600";
            } else {
              // Unconnected node titles: FADED OUT completely to avoid overlap/clutter
              item.label.alpha = 0.03;
              item.label.scale.set(baseScale);
            }
          } else {
            // Default view:
            var isCurrent = (nid === currentKey);
            if (isCurrent) {
              item.label.alpha = 1.0;
              item.label.scale.set(hoverScale);
              item.label.style.fill = colorSecondary;
              item.label.style.fontWeight = "bold";
            } else if (deg >= 2) {
              // Hub nodes: high visibility
              item.label.alpha = 0.9;
              item.label.scale.set(baseScale);
              item.label.style.fill = colorDark;
              item.label.style.fontWeight = "normal";
            } else {
              // Leaf nodes: subtle visibility
              item.label.alpha = 0.7;
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
        var rad = getNodeRadius(nodeData);
        var deg = getNodeDegree(nodeData);
        var col = getNodeColor(nodeData);

        var txt = new PIXI.Text({
          text: nodeData.text,
          style: {
            fontSize: fontSz * 14.5,
            fill: (nodeData.id === currentKey) ? colorSecondary : colorDark,
            fontFamily: fontFam,
            fontWeight: (nodeData.id === currentKey) ? "bold" : "normal"
          },
          resolution: (window.devicePixelRatio || 1) * 3
        });
        // Set anchor to top-center (0.5, 0) so the text sits strictly BELOW the circle
        txt.anchor.set(0.5, 0);
        txt.alpha = (nodeData.id === currentKey) ? 1.0 : (deg >= 2 ? 0.9 : 0.7);
        txt.scale.set(1 / scaleFactor);
        labelContainer.addChild(txt);

        var gfx = new PIXI.Graphics();
        gfx.circle(0, 0, rad);
        gfx.fill({ color: isTag ? colorLight : col });
        if (isTag) gfx.stroke({ width: 1.5, color: colorTertiary });
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
          label: txt,
          radius: rad,
          degree: deg,
          color: col,
          active: false
        });
      }

      // Create Links
      for (var lk = 0; lk < simulationLinks.length; lk++) {
        var linkData = simulationLinks[lk];
        var linkGfx = new PIXI.Graphics();
        linkGfx.eventMode = "none";
        linkContainer.addChild(linkGfx);
        linkItems.push({
          simulationData: linkData,
          gfx: linkGfx,
          color: colorLineDefault,
          alpha: 0.6,
          active: false
        });
      }

      // Drag behavior
      if (enableDrag) {
        var findSubject = function(event) {
          var x = (event.x - currentZoom.x) / currentZoom.k;
          var y = (event.y - currentZoom.y) / currentZoom.k;
          for (var i = 0; i < simulationNodes.length; i++) {
            var n = simulationNodes[i];
            var dx = x - n.x - width / 2;
            var dy = y - n.y - height / 2;
            if (Math.sqrt(dx * dx + dy * dy) < getNodeRadius(n) + 10) return n;
          }
          return null;
        };

        var dragBehavior = d3.drag()
          .container(app.canvas)
          .subject(findSubject)
          .on("start", function(event) {
            if (!event.active) sim.alphaTarget(1).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
            var curX = (event.x - currentZoom.x) / currentZoom.k - width / 2;
            var curY = (event.y - currentZoom.y) / currentZoom.k - height / 2;
            event.subject.__dragOffset = { x: curX - event.subject.x, y: curY - event.subject.y };
            dragStartTime = Date.now();
            isDragging = true;
            hoveredNodeId = event.subject.id;
          })
          .on("drag", function(event) {
            var curX = (event.x - currentZoom.x) / currentZoom.k - width / 2;
            var curY = (event.y - currentZoom.y) / currentZoom.k - height / 2;
            event.subject.fx = curX - event.subject.__dragOffset.x;
            event.subject.fy = curY - event.subject.__dragOffset.y;
          })
          .on("end", function(event) {
            if (!event.active) sim.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
            isDragging = false;
            updateActiveSet(null);
            updateVisuals();
            if (Date.now() - dragStartTime < 400) {
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

      // Zoom behavior
      if (enableZoom) {
        var zoomBehavior = d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([0.2, 4.5])
          .on("zoom", function(event) {
            currentZoom = event.transform;
            mainStage.scale.set(currentZoom.k, currentZoom.k);
            mainStage.position.set(currentZoom.x, currentZoom.y);
          });
        d3.select(app.canvas).call(zoomBehavior);
      }

      var isStopped = false;
      function onFrame() {
        if (!isStopped) {
          for (var i = 0; i < nodeItems.length; i++) {
            var item = nodeItems[i];
            var nx = item.simulationData.x;
            var ny = item.simulationData.y;
            if (nx != null && ny != null) {
              item.gfx.position.set(nx + width / 2, ny + height / 2);
              // Place label strictly BELOW node circle with 4px gap (Obsidian alignment)
              item.label.position.set(nx + width / 2, ny + height / 2 + item.radius + 4);
            }
          }
          for (var i = 0; i < linkItems.length; i++) {
            var link = linkItems[i];
            var simD = link.simulationData;
            var sx = simD.source.x, sy = simD.source.y;
            var tx = simD.target.x, ty = simD.target.y;
            if (sx != null && sy != null && tx != null && ty != null) {
              link.gfx.clear();
              link.gfx.moveTo(sx + width / 2, sy + height / 2);
              link.gfx.lineTo(tx + width / 2, ty + height / 2);
              // Ultra-thin crisp lines: 0.5px default, 0.9px when active!
              var strokeWidth = link.active ? 0.9 : 0.5;
              link.gfx.stroke({ alpha: link.alpha, width: strokeWidth, color: link.color });
            }
          }
          requestAnimationFrame(onFrame);
        }
      }

      sim.restart();
      updateVisuals();
      onFrame();

      return function cleanup() {
        isStopped = true;
        sim.stop();
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
