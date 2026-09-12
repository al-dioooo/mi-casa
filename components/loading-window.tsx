import { PixelHeart } from "@/components/pixel-art";

export function LoadingWindow() {
  return <div className="route-loading" role="status"><div className="loading-window"><div className="boot-titlebar"><span>MI CASA / OPENING A LITTLE MOMENT</span></div><PixelHeart /><p>Just a little moment.</p><div className="loading-blocks" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <span key={i} />)}</div><span className="helper-note">Something worth keeping is on its way.</span></div></div>;
}
