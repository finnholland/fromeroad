import * as React from "react";
export const SvgRemoveButton: React.FC<React.SVGProps<SVGSVGElement>> = (props: any) => (
  <svg
    x={0}
    y={0}
    viewBox="0 0 20 20"
    xmlSpace="preserve"
    {...props}
  >
    <circle cx="10" cy="10" r="9.5" style={{stroke: props.stroke, fill: "white"}}/>
    <path d="M13.1821 13.182L6.81817 6.81803" strokeLinecap="round" style={{stroke: props.stroke}}/>
    <path d="M6.81787 13.182L13.1818 6.81803" strokeLinecap="round" style={{stroke: props.stroke}}/>
  </svg>
);
export default SvgRemoveButton;

