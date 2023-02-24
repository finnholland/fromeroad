import * as React from "react";
export const Tick: React.FC<React.SVGProps<SVGSVGElement>> = (props: any) => (
  <svg
    x={0}
    y={0}
    viewBox="0 0 50.7 36.3"
    xmlSpace="preserve"
    {...props}
  >
    <path style={{ stroke: props.stroke, strokeWidth: props.strokeWidth, strokeLinecap: 'round', fill: 'none' }} d="M1.5,22.1l12.1,12.1c0.8,0.8,2,0.8,2.8,0L49.2,1.5"/>

  </svg>
);
export default Tick;

