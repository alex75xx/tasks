(() => {
  const colors = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#a855f7",
    "#ec4899",
  ];

  let confettiContainer = null;
  const audio = new Audio("additional-settings/party-mode/yahoo.m4a");

  const ensureConfettiContainer = () => {
    if (confettiContainer) return confettiContainer;
    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);
    confettiContainer = container;
    return container;
  };

  const trigger = () => {
    const container = ensureConfettiContainer();
    const pieces = 320;
    for (let i = 0; i < pieces; i += 1) {
      const piece = document.createElement("div");
      const left = Math.random() * 100;
      const duration = 2.2 + Math.random() * 1.0;
      const xEnd = (Math.random() - 0.5) * 240;
      const yStart = -20 - Math.random() * 40;
      const yEnd = 100 + Math.random() * 40;
      piece.className = "confetti-piece";
      piece.style.left = `${left}%`;
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.setProperty("--duration", `${duration}s`);
      piece.style.setProperty("--x-end", `${xEnd}px`);
      piece.style.setProperty("--y-start", `${yStart}vh`);
      piece.style.setProperty("--y-end", `${yEnd}vh`);
      container.appendChild(piece);
      setTimeout(() => {
        piece.remove();
      }, (duration + 0.2) * 1000);
    }

    // Try to play celebratory sound; ignore failures (e.g., autoplay block).
    try {
      audio.currentTime = 0;
      audio.play();
    } catch (err) {
      // no-op
    }
  };

  window.createPartyConfetti = () => trigger;
})();


