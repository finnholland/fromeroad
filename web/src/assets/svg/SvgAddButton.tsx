import * as React from "react";
export const SvgAddButton: React.FC<React.SVGProps<SVGSVGElement>> = (props: any) => (
  <svg
    x={0}
    y={0}
    viewBox="0 0 40 40"
    xmlSpace="preserve"
    {...props}
  >
    <circle cx="20" cy="20" r="19.5" fill="white" style={{stroke: props.fill, fill: "white"}}/>
    <path d="M29 20L11 20" stroke-linecap="round" style={{stroke: props.stroke}}/>
    <path d="M20 29L20 11" stroke-linecap="round" style={{stroke: props.stroke}}/>
  </svg>
);
export default SvgAddButton;