const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

revealItems.forEach((item) => observer.observe(item));

const cinematicSection = document.querySelector(".scroll-cinematic");
let cinematicTicking = false;

const updateCinematic = () => {
  if (!cinematicSection) return;
  const rect = cinematicSection.getBoundingClientRect();
  const viewport = window.innerHeight || 0;
  const total = rect.height + viewport;
  const progress = total > 0 ? (viewport - rect.top) / total : 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  cinematicSection.style.setProperty("--p", clamped.toFixed(3));
};

const onScroll = () => {
  if (cinematicTicking) return;
  cinematicTicking = true;
  window.requestAnimationFrame(() => {
    updateCinematic();
    cinematicTicking = false;
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
updateCinematic();
