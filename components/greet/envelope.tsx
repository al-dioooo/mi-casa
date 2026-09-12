type EnvelopeProps = {
  isOpen: boolean;
  isUnlocked: boolean;
  recipient: string;
  onOpen: () => void;
};

export function Envelope({ isOpen, isUnlocked, recipient, onOpen }: EnvelopeProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      className={`envelope ${isUnlocked ? "envelope--unlocked" : ""} ${isOpen ? "envelope--open" : ""}`}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
      aria-label={isUnlocked ? "Break the envelope seal" : "Sealed envelope"}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="envelope__fold" />
      <div className="envelope__stamp" aria-hidden="true">
        <svg width="22" height="20" viewBox="0 0 11 10" shapeRendering="crispEdges"><path fill="currentColor" d="M1 1h3v1H1zM7 1h3v1H7zM0 2h5v1H0zM6 2h5v1H6zM0 3h11v3H0zM1 6h9v1H1zM2 7h7v1H2zM3 8h5v1H3zM4 9h3v1H4z" /></svg>
      </div>
      <div className="envelope__flap" />
      <div className="envelope__seal">A</div>
      <div className="envelope__recipient">{recipient}</div>
    </div>
  );
}
