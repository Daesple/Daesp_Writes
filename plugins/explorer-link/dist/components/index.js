import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";

function pathToRoot(slug) {
  let rootPath = slug.split("/").filter((x) => x !== "").slice(0, -1).map(() => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}

const ExplorerLink = ({ fileData, displayClass }) => {
  const baseDir = pathToRoot(fileData.slug);
  const explorerHref = baseDir === "." ? "./explorer" : `${baseDir}/explorer`;
  return _jsxs("a", {
    href: explorerHref,
    class: `headbar-explorer-btn ${displayClass || ""}`,
    "aria-label": "Explorer",
    title: "Mở Explorer",
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
          d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
        })
      }),
      _jsx("span", {
        children: "Explorer"
      })
    ]
  });
};

ExplorerLink.css = `
.headbar-explorer-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: var(--headerFont);
  color: var(--darkgray);
  background: var(--lightgray);
  border: 1px solid color-mix(in srgb, var(--darkgray) 15%, transparent);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: var(--secondary);
    border-color: var(--secondary);
    background: var(--highlight);
  }

  svg {
    opacity: 0.85;
  }
}
`;

const ExplorerLinkDefault = () => ExplorerLink;

export { ExplorerLinkDefault as ExplorerLink };
