type IconName = "arrow-up-right" | "arrow-right" | "arrow-left" | "turn-right" | "check" | "lock" | "save" | "sound" | "muted" | "close";

const paths: Record<IconName, string> = {
  "arrow-up-right": "M6 2h8v8h-2V6h-2v2H8v2H6v2H4v2H2v-2h2v-2h2V8h2V6h2V4H6Z",
  "arrow-right": "M8 2h2v2h2v2h2v4h-2v2h-2v2H8v-2h2v-2H2V6h8V4H8Z",
  "arrow-left": "M6 2h2v2H6v2h8v4H6v2h2v2H6v-2H4v-2H2V6h2V4h2Z",
  "turn-right": "M2 2h2v6h6V6H8V4h2v2h2v2h2v4h-2v2h-2v2H8v-2h2v-2H2Z",
  check: "M12 2h2v4h-2v2h-2v2H8v2H6v2H4v-2H2v-2H0V6h2v2h2v2h2V8h2V6h2V4h2Z",
  lock: "M4 0h8v2h2v5h2v9H0V7h2V2h2Zm0 3v4h8V3Zm3 7v4h2v-4Z",
  save: "M0 0h12v2h2v2h2v12H0Zm3 2v5h8V2Zm0 9v3h10v-3Z",
  sound: "M6 2h2v12H6v-2H4v-2H0V6h4V4h2Zm4 3h2v6h-2Zm3-3h2v3h1v6h-1v3h-2v-3h1V5h-1Z",
  muted: "M6 2h2v12H6v-2H4v-2H0V6h4V4h2Zm4 3h2v2h2V5h2v2h-2v2h2v2h-2V9h-2v2h-2V9h2V7h-2Z",
  close: "M2 2h2v2h2v2h4V4h2V2h2v2h-2v2h-2v4h2v2h2v2h-2v-2h-2v-2H6v2H4v2H2v-2h2v-2h2V6H4V4H2Z",
};

export function PixelIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={`pixel-icon ${className}`} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><path fillRule="evenodd" d={paths[name]} /></svg>;
}
