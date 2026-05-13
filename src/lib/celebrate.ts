import confetti from "canvas-confetti";
import { toast } from "sonner";

export function celebrate(message: string, description?: string) {
  const end = Date.now() + 800;
  const colors = ["#c97a2d", "#e8a85c", "#fff3df", "#7a4a1a"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    scalar: 1.1,
  });
  toast.success(message, { description, duration: 4000 });
}
