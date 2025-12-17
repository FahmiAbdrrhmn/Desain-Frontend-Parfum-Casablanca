document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded, checking GSAP...");

  const gsapInstance = window.gsap;
  if (!gsapInstance) {
    console.error("GSAP gagal dimuat - window.gsap tidak ada.");
    return;
  }

  console.log("GSAP loaded:", gsapInstance);

  if (window.SplitText) {
    gsapInstance.registerPlugin(window.SplitText);
    console.log("SplitText plugin registered");
  } else {
    console.error("GSAP SplitText gagal dimuat - window.SplitText tidak ada.");
  }

  const splitTextIntoLines = (selector, options = {}) => {
    const target = document.querySelector(selector);
    if (!target) {
      console.warn("Target not found:", selector);
      return null;
    }
    if (!window.SplitText) {
      console.warn("SplitText not available");
      return null;
    }

    const defaults = { type: "lines", linesClass: "line", ...options };
    return new window.SplitText(target, defaults);
  };

  splitTextIntoLines(".preloader-copy p");
  splitTextIntoLines(".preloader-counter p");

  gsapInstance.set(["nav", ".hero-img", ".hero-content"], { y: "35svh" });

  const animateCounter = (selector, duration = 5, delay = 0) => {
    const counterElement = document.querySelector(selector);
    if (!counterElement) return;

    let currentValue = 0;
    const updateInterval = 200;
    const maxDuration = duration * 1000;

    setTimeout(() => {
      const startTime = Date.now();
      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / maxDuration;

        if (currentValue < 100 && elapsed < maxDuration) {
          const target = Math.floor(progress * 100);
          const jump = Math.floor(Math.random() * 25) + 5;
          currentValue = Math.min(target + jump, 100);

          counterElement.textContent = currentValue.toString().padStart(2, "0");
          setTimeout(updateCounter, updateInterval + Math.random() * 100);
        } else {
          counterElement.textContent = "100";
        }
      };

      updateCounter();
    }, delay * 1000);
  };

  animateCounter(".preloader-counter p", 4.5, 2);

  const box = document.querySelector(".preloader-box");
  if (!box) {
    console.warn("preloader-box tidak ditemukan.");
  }

  gsapInstance.set(".preloader-box", { scale: 0.6, transformOrigin: "center center" });

  const computeCoverScale = () => {
    if (!box) return 40; // fallback
    const rect = box.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    return Math.max(scaleX, scaleY) * 1.1;
  };

  const finalScale = computeCoverScale();

  const t1 = gsapInstance.timeline();

  t1.set(".preloader-box", { zIndex: 9999, position: "relative" })
    .set([".preloader-texts", ".preloader-revealer", ".preloader-copy", ".preloader-counter"], { zIndex: 1, position: "relative" })
    .to(".preloader-box", {
      scale: finalScale,
      duration: 0.9,
      ease: "power2.in",
      delay: 0.8,
    })
    .to(
      ".preloader",
      {
        autoAlpha: 0,
        duration: 0.15,
        onComplete: () => {
          const el = document.querySelector(".preloader");
          if (el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
          }
        },
      },
      ">-0.05"
    )
    .to(
      ["nav", ".hero-img", ".hero-content"],
      {
        y: "0%",
        duration: 1.1,
        ease: "power3.out",
      },
      "<"
    );

  console.log("Animation timeline created and started");
});
