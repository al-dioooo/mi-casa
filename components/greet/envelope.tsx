type EnvelopeProps = {
  isOpen: boolean;
  isUnlocked: boolean;
  recipient: string;
  onOpen: () => void;
};

export function Envelope({ isOpen, isUnlocked, recipient, onOpen }: EnvelopeProps) {
  return (
    <button
      className={`envelope ${isUnlocked ? "envelope--unlocked" : ""} ${isOpen ? "envelope--open" : ""}`}
      type="button"
      disabled={!isUnlocked || isOpen}
      aria-label={isUnlocked ? "Break the envelope seal" : "Sealed envelope"}
      onClick={onOpen}
    >
      <span className="envelope__fold" />
      <span className="envelope__stamp" aria-hidden="true">
        <svg width="22" height="20" viewBox="0 0 11 10" shapeRendering="crispEdges"><path fill="currentColor" d="M1 1h3v1H1zM7 1h3v1H7zM0 2h5v1H0zM6 2h5v1H6zM0 3h11v3H0zM1 6h9v1H1zM2 7h7v1H2zM3 8h5v1H3zM4 9h3v1H4z" /></svg>
      </span>
      <span className="envelope__flap" />
      <span className="envelope__seal">A</span>
      <span className="envelope__recipient">{recipient}</span>
    </button>
  );
}
