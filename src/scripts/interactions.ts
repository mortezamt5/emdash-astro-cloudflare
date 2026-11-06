const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const nav = document.querySelector<HTMLElement>("#nav");
const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuItems = [...document.querySelectorAll<HTMLElement>("#menu > li")].filter((item) => item.querySelector("button.m-btn"));
const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
let menuTimer: number | undefined;
function closeMenus(except?: HTMLElement) {
  for (const item of menuItems) {
    if (item === except) continue;
    item.classList.remove("open");
    item.querySelector(".m-btn")?.setAttribute("aria-expanded", "false");
  }
}
function openMenu(item: HTMLElement) {
  closeMenus(item);
  item.classList.add("open");
  item.querySelector(".m-btn")?.setAttribute("aria-expanded", "true");
}
for (const item of menuItems) {
  const button = item.querySelector<HTMLButtonElement>(".m-btn");
  button?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (item.classList.contains("open")) closeMenus();
    else openMenu(item);
  });
  item.addEventListener("focusout", (event) => {
    if (!item.contains(event.relatedTarget as Node)) closeMenus();
  });
  if (finePointer) {
    item.addEventListener("mouseenter", () => {
      window.clearTimeout(menuTimer);
      openMenu(item);
    });
    item.addEventListener("mouseleave", () => {
      menuTimer = window.setTimeout(() => closeMenus(), 140);
    });
  }
}
document.addEventListener("pointerdown", (event) => {
  if (!(event.target as Element).closest("#menu")) closeMenus();
});

const mobileNav = document.querySelector<HTMLElement>("#mnav");
const burger = document.querySelector<HTMLButtonElement>("#burger");
const mobileClose = document.querySelector<HTMLButtonElement>("#mclose");
let returnFocus: HTMLElement | null = null;
function closeMobile() {
  if (!mobileNav?.classList.contains("open")) return;
  mobileNav.classList.remove("open");
  mobileNav.setAttribute("aria-hidden", "true");
  mobileNav.inert = true;
  burger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  returnFocus?.focus();
}
burger?.addEventListener("click", () => {
  if (!mobileNav) return;
  returnFocus = document.activeElement as HTMLElement;
  mobileNav.inert = false;
  mobileNav.classList.add("open");
  mobileNav.setAttribute("aria-hidden", "false");
  burger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  mobileClose?.focus();
});
mobileClose?.addEventListener("click", closeMobile);
mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobile));
mobileNav?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...mobileNav.querySelectorAll<HTMLElement>('a,button,summary')].filter((element) => element.getClientRects().length);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openButton = menuItems.find((item) => item.classList.contains("open"))?.querySelector<HTMLButtonElement>(".m-btn");
  closeMenus();
  if (mobileNav?.classList.contains("open")) closeMobile();
  else openButton?.focus();
});
window.matchMedia("(min-width: 1025px)").addEventListener("change", (event) => {
  if (event.matches) closeMobile();
});

const marqueeTrack = document.querySelector<HTMLElement>("#track");
if (marqueeTrack) {
  for (const token of [...marqueeTrack.children]) {
    const clone = token.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  }
}

function bindTabs(list: HTMLElement, tabs: HTMLButtonElement[], panels: HTMLElement[]) {
  function activate(index: number, focus = false) {
    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute("aria-selected", String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });
    panels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
      panel.classList.toggle("on", panelIndex === index);
    });
    if (focus) tabs[index]?.focus();
  }
  tabs.forEach((tab, index) => tab.addEventListener("click", () => activate(index)));
  list.addEventListener("keydown", (event) => {
    const selected = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    let next = selected;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (selected + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (selected - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    activate(next, true);
  });
  return activate;
}

const amsTabList = document.querySelector<HTMLElement>(".tabs[role=tablist]");
if (amsTabList) {
  const tabs = [...amsTabList.querySelectorAll<HTMLButtonElement>("[role=tab]")];
  const panels = tabs.map((tab) => document.getElementById(tab.dataset.view ?? "")!).filter(Boolean);
  tabs.forEach((tab, index) => {
    tab.id = "ams-tab-" + index;
    tab.setAttribute("aria-controls", tab.dataset.view ?? "");
    tab.tabIndex = index === 0 ? 0 : -1;
    panels[index]?.setAttribute("role", "tabpanel");
    panels[index]?.setAttribute("aria-labelledby", tab.id);
    if (index > 0 && panels[index]) panels[index].hidden = true;
  });
  bindTabs(amsTabList, tabs, panels);
}

const platformTabs = document.querySelector<HTMLElement>("#platList");
if (platformTabs) {
  const tabs = [...platformTabs.querySelectorAll<HTMLButtonElement>("[role=tab]")];
  const panels = tabs.map((_, index) => document.querySelector<HTMLElement>("#platform-panel-" + index)!).filter(Boolean);
  const activate = bindTabs(platformTabs, tabs, panels);
  const platformPanel = document.querySelector<HTMLElement>("#platPanel");
  let autoAdvance: number | undefined;
  let stoppedByUser = false;
  const stopAuto = () => {
    window.clearInterval(autoAdvance);
    autoAdvance = undefined;
  };
  if (!reduceMotion && platformPanel && tabs.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || stoppedByUser) {
        stopAuto();
        return;
      }
      if (autoAdvance === undefined) autoAdvance = window.setInterval(() => {
        const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
        activate((current + 1) % tabs.length);
      }, 6000);
    }, { threshold: .4 });
    observer.observe(platformPanel);
    platformPanel.addEventListener("mouseenter", stopAuto);
    platformPanel.addEventListener("focusin", stopAuto);
    platformTabs.addEventListener("click", () => { stoppedByUser = true; stopAuto(); });
    platformTabs.addEventListener("keydown", (event) => {
      if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        stoppedByUser = true;
        stopAuto();
      }
    });
  }
}

const meters = [...document.querySelectorAll<HTMLElement>("[data-meter]")];
for (const meter of meters) {
  for (let index = 0; index < 18; index++) {
    const bar = document.createElement("i");
    bar.style.height = (15 + Math.random() * 60) + "%";
    meter.appendChild(bar);
  }
}
if (!reduceMotion && meters.length) window.setInterval(() => {
  for (const meter of meters) {
    if (!meter.getClientRects().length) continue;
    for (const [index, bar] of [...meter.children].entries()) {
      const envelope = Math.sin(Date.now() / 300 + index * .6) * .3 + .5;
      (bar as HTMLElement).style.height = Math.max(8, Math.min(100, envelope * 70 + Math.random() * 40)) + "%";
    }
  }
}, 140);

const durations = [...document.querySelectorAll<HTMLElement>(".dur[data-t]")];
if (!reduceMotion && durations.length) window.setInterval(() => {
  for (const duration of durations) {
    const elapsed = Number(duration.dataset.t ?? 0) + 1;
    duration.dataset.t = String(elapsed);
    duration.textContent = String(Math.floor(elapsed / 60)).padStart(2, "0") + ":" + String(elapsed % 60).padStart(2, "0");
  }
}, 1000);

const log = document.querySelector<HTMLElement>("#log");
const events = [
  ["pri", "INFO", "Visitor entrance · camera 2 selected (DTMF 2)"],
  ["ok", "OK", "HA health check · master responding"],
  ["pri", "INFO", "PA · Block A · announcement ended"],
  ["warn", "WARN", "Workshop · J-IPS30 · packet loss 2%"],
  ["pri", "INFO", "ConnCross · Gate 2 relay → CCTV preset 4"],
  ["ok", "OK", "Lift 3 · EN81 call closed by service centre"],
];
let eventIndex = 0;
if (log && !reduceMotion) window.setInterval(() => {
  const [kind, label, message] = events[eventIndex++ % events.length];
  const row = document.createElement("div");
  row.className = "new";
  const time = document.createElement("time");
  time.textContent = new Date().toTimeString().slice(0, 8);
  const status = document.createElement("span");
  status.className = kind;
  status.textContent = label;
  const content = document.createElement("span");
  content.className = "msg";
  content.textContent = message;
  row.appendChild(time);
  row.appendChild(status);
  row.appendChild(content);
  log.insertBefore(row, log.firstChild);
  while (log.children.length > 7) log.lastElementChild?.remove();
}, 3800);

document.querySelectorAll<HTMLElement>(".wavebar").forEach((wave) => {
  for (let index = 0; index < 64; index++) {
    const bar = document.createElement("i");
    bar.style.height = (12 + Math.abs(Math.sin(index * .45)) * 60 + Math.random() * 28) + "%";
    wave.appendChild(bar);
  }
});
document.querySelectorAll<HTMLElement>(".qr").forEach((qr) => {
  const pattern = "1111111100000110111011010110101101101100000111111101000101010101001101";
  for (let index = 0; index < 49; index++) {
    const cell = document.createElement("i");
    const fixed = (index % 7 < 3 && index < 21) || (index % 7 > 3 && index < 21) || (index % 7 < 3 && index > 27);
    if (!fixed && pattern[index] !== "1") cell.className = "w";
    qr.appendChild(cell);
  }
});

if (!reduceMotion && "IntersectionObserver" in window) {
  const elements = [...document.querySelectorAll<HTMLElement>(".rv")].filter((element) => element.getBoundingClientRect().top > innerHeight * .92);
  elements.forEach((element) => element.classList.add("pre"));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("pre");
    observer.unobserve(entry.target);
  }), { rootMargin: "0px 0px -8% 0px" });
  elements.forEach((element) => observer.observe(element));
}
