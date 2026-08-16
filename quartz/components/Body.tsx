import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import graphFilterScript from "./scripts/graph-filter.inline"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = graphFilterScript

export default (() => Body) satisfies QuartzComponentConstructor
