import * as React from "react";
export const Hamburger: React.FC<React.SVGProps<SVGSVGElement>> = (props: any) => (
  <svg
    x={0}
    y={0}
    viewBox="0 0 18 16"
    xmlSpace="preserve"
    {...props}
  >
    <path d="M1 1H17M17 8H1M17 15H1" strokeLinecap="round" style={{fill: props.fill, stroke: props.stroke, strokeWidth: props.strokeWidth,}} />

  </svg>
);
export default Hamburger;