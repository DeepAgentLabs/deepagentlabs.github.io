const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
  toggle.textContent = open ? "Menu" : "Close";
});

nav?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    if (toggle) toggle.textContent = "Menu";
  }),
);

document.querySelector("#year").textContent = String(new Date().getFullYear());

const faqTriggers = [...document.querySelectorAll(".faq-trigger")];

faqTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const open = trigger.getAttribute("aria-expanded") !== "true";

    faqTriggers.forEach((item) => {
      const expanded = item === trigger && open;
      item.setAttribute("aria-expanded", String(expanded));
      item.closest(".faq-item")?.classList.toggle("is-open", expanded);
      const answer = document.getElementById(
        item.getAttribute("aria-controls"),
      );
      answer?.setAttribute("aria-hidden", String(!expanded));
    });
  });
});
