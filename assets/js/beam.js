/* Adds a travelling border beam (see beam.css) to a short list of key elements.
   Ambient beams only run while the element is on screen. */
(() => {
  const targets = [
    [".system-card", "glow"],                 // hero ecosystem card
    [".tl", "glow"],                          // framework showcase
    [".adp-card", "quick"],                   // downloads stat card
    [".rm-track .phase.active", "ink"],       // roadmap: milestone in review
    ["#v0-1 .rp-window", "glow"],              // roadmap page: milestone in review
    [".mega-side", "glow"],                   // spec card inside the menus
    [".nf-card", "glow"],                     // 404 card
    [".hero .button-primary, .cta .button, .nav-cta, .adp-foot .button", "hover"],
    [".newsletter-form", "focus"],
  ];
  const ambient = [];
  targets.forEach(([sel, kind]) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.querySelector(":scope > .beam")) return;
      el.dataset.beam = kind;
      const s = document.createElement("span");
      s.className = "beam";
      s.setAttribute("aria-hidden", "true");
      el.append(s);
      if (kind !== "hover" && kind !== "focus") ambient.push(el);
    });
  });
  if (!("IntersectionObserver" in window)) {
    ambient.forEach((el) => el.classList.add("beam-on"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle("beam-on", e.isIntersecting));
  });
  ambient.forEach((el) => io.observe(el));
  // menus are display:none / hidden until opened, so run their beam whenever visible
  document.querySelectorAll(".mega-side[data-beam]").forEach((el) => el.classList.add("beam-on"));
})();
