import type { ReactNode } from "react";

export function PixelHeart({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 14" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true"><path d="M2 0h4v2h4V0h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2V8H0V2h2Z" /><path d="M2 2h3v2H2Z" fill="#fff" opacity=".6" /></svg>;
}

export function PixelStar({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 20 20" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true"><path d="M8 0h4v6h2v2h6v4h-6v2h-2v6H8v-6H6v-2H0V8h6V6h2Z" /></svg>;
}

export function RetroComputer({ children }: { children: ReactNode }) {
  return <div className="computer-scene">
    <div className="orbit orbit--heart"><PixelHeart /><span>sent with love</span></div>
    <PixelStar className="scene-star scene-star--one" />
    <PixelStar className="scene-star scene-star--two" />
    <div className="floating-save" aria-hidden="true"><div className="floating-save__label"><PixelHeart /></div><div className="floating-save__slot" /></div>
    <div className="computer">
      <svg className="computer-art" viewBox="0 0 480 450" fill="none" shapeRendering="crispEdges" aria-hidden="true">
        <path d="M62 422h362v8H62zM88 430h310v8H88z" fill="#618ca4" opacity=".18" />
        <path d="M88 18h292v10h20v18h12v242h-12v16H84V36h4z" fill="#376787" />
        <path d="M90 18h266v10h20v254H76V36h14z" fill="#a9d2e6" />
        <path d="M90 18h266v10H90zM76 36h12v224H76z" fill="#f2fbff" />
        <path d="M376 38h20v238h-20z" fill="#75a7c1" />
        <path d="M95 42h251v10h12v185h-12v10H95v-10H84V52h11z" fill="#487b98" />
        <path d="M104 53h232v10h10v163h-10v10H104v-10H94V63h10z" fill="#244d67" />
        <path d="M106 61h226v165H106z" fill="#e4f5fc" />
        <path d="M98 254h38v7H98z" fill="#6597b2" />
        <path d="M310 253h12v10h-12z" fill="#efffbc" /><path d="M328 253h12v10h-12z" fill="#5a8fae" />
        <path d="M179 283h94v32h-94z" fill="#6699b5" /><path d="M179 283h19v26h-19z" fill="#8ebdd4" />
        <path d="M145 311h164v14H145z" fill="#3b6b89" /><path d="M145 307h152v10H145z" fill="#baddeb" />
        <path d="M66 331h286v12h18v16h16v18h16v35H48v-35h8v-29h10z" fill="#376787" />
        <path d="M70 329h274v12h16v16h16v18h14v21H54v-21h8v-27h8z" fill="#acd2e4" />
        <path d="M70 329h274v9H70zM54 385h336v11H54z" fill="#ecf8ff" />
        {[0, 1, 2].map(row => Array.from({ length: 12 }, (_, col) => <g key={`${row}-${col}`}><path d={`M${80 + col * 22 - row * 4} ${344 + row * 13}h17v9h-17z`} fill="#598aa6" /><path d={`M${80 + col * 22 - row * 4} ${342 + row * 13}h15v7h-15z`} fill="#f0faff" /></g>))}
        <path d="M128 380h150v7H128z" fill="#6497b2" /><path d="M128 377h146v7H128z" fill="#edf9ff" />
        <path d="M408 312h24v8h12v30h-8v-23h-12v-8h-16z" fill="#376787" />
        <path d="M421 345h23v8h10v38h-8v8h-32v-8h-7v-33h7v-13z" fill="#376787" />
        <path d="M421 345h17v8h9v33h-8v6h-20v-7h-6v-27h8z" fill="#d7edf7" />
        <path d="M427 346h4v17h-4z" fill="#6093af" />
      </svg>
      <div className="computer-display"><div className="computer-display__bar"><span>angel_mail.exe</span><span>− □ ×</span></div>{children}<span className="computer-display__status">1 unread message <span>♥</span></span></div>
      <span className="computer-brand">MI CASA® — PERSONAL UNIVERSE</span>
    </div>
    <div className="scene-caption"><span className="status-dot" /> a little world, just for you.</div>
  </div>;
}
