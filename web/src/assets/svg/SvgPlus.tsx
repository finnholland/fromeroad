import * as React from "react";
export const SvgPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props: any) => (
  <svg
    x={0}
    y={0}
    viewBox="0 0 20 20"
    xmlSpace="preserve"
    {...props}
  >
    <path d="M19 10L1 10" strokeLinecap="round" style={{stroke: props.stroke, strokeWidth: props.strokeWidth}}/>
    <path d="M10 19L10 1.00003" strokeLinecap="round" style={{stroke: props.stroke, strokeWidth: props.strokeWidth, visibility: props.fontVariant}}/>
  </svg>
);
export default SvgPlus;