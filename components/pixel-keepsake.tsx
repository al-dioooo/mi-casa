import { PixelHeart, PixelStar } from "@/components/pixel-art";

export function PixelKeepsake({ variant = "letter" }: { variant?: "letter" | "garden" }) {
  return <div className={`pixel-keepsake pixel-keepsake--${variant}`} aria-hidden="true">
    <PixelStar />
    <svg viewBox="0 0 100 56" fill="none" shapeRendering="crispEdges">
      {variant === "letter" ? <>
        <path d="M14 22h68v30H14z" fill="#b0d5e9" /><path d="M14 22h68v4H14zM14 26h4v26h-4zM78 26h4v26h-4zM18 48h60v4H18z" fill="#527e9c" />
        <path d="M18 26h8v4h8v4h8v4h12v-4h8v-4h8v-4h8v4h-8v4h-8v4h-8v4H42v-4h-8v-4h-8v-4h-8z" fill="#739fb8" />
        <path d="M38 4h8v4h8V4h8v4h4v12h-4v4h-4v4h-4v4h-8v-4h-4v-4h-4v-4h-4V8h4z" fill="#d591a8" />
      </> : <>
        <path d="M10 48h80v4H10zM26 25h4v23h-4zM68 19h4v29h-4zM46 34h4v14h-4z" fill="#65959b" />
        <path d="M18 34h8v4h4v4h-8v-4h-4zM72 30h8v4h-4v4h-4zM50 39h8v4h-8z" fill="#89b5ac" />
        <path d="M22 10h12v6h6v12h-6v6H22v-6h-6V16h6zM62 4h16v6h6v12h-6v6H62v-6h-6V10h6z" fill="#9ac6e2" />
        <path d="M24 18h8v8h-8zM66 12h8v8h-8z" fill="#fff0c4" />
        <path d="M42 25h12v12H42z" fill="#dba5b9" /><path d="M46 29h4v4h-4z" fill="#fff0c4" />
      </>}
    </svg>
    <PixelHeart />
  </div>;
}
