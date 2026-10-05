(() => {
  document.documentElement.classList.add("js");

  try {
    let setAtmosphereHeroVisible = () => {};
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.append(progressBar);

    let scrollFrame = 0;
    const updateScrollProgress = () => {
      scrollFrame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };
    const queueScrollProgress = () => {
      if (!scrollFrame)
        scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    };
    window.addEventListener("scroll", queueScrollProgress, { passive: true });
    window.addEventListener("resize", queueScrollProgress, { passive: true });
    updateScrollProgress();

    const atmosphere = document.createElement("canvas");
    atmosphere.className = "site-atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");
    document.body.prepend(atmosphere);
    const atmosphereContext = atmosphere.getContext("2d");
    if (atmosphereContext) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const atmosphereNodes = [];
      let atmosphereWidth = 0;
      let atmosphereHeight = 0;
      let atmosphereScale = 1;
      let atmosphereFrame = 0;
      let lastAtmosphereDraw = 0;
      let atmosphereEdges = [];
      let heroOverlapsAtmosphere = false;
      let pointerX = -1000;
      let pointerY = -1000;

      const resizeAtmosphere = () => {
        atmosphereWidth = window.innerWidth;
        atmosphereHeight = window.innerHeight;
        atmosphereScale = Math.min(2, window.devicePixelRatio || 1);
        atmosphere.width = Math.round(atmosphereWidth * atmosphereScale);
        atmosphere.height = Math.round(atmosphereHeight * atmosphereScale);
        atmosphereContext.setTransform(
          atmosphereScale,
          0,
          0,
          atmosphereScale,
          0,
          0,
        );

        const columns = Math.max(3, Math.ceil(atmosphereWidth / 170));
        const rows = Math.max(4, Math.ceil(atmosphereHeight / 155));
        const cellWidth = atmosphereWidth / (columns - 1);
        const cellHeight = atmosphereHeight / (rows - 1);
        atmosphereNodes.length = 0;
        atmosphereEdges = [];

        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            const index = row * columns + column;
            const x = column * cellWidth + (Math.random() - 0.5) * 24;
            const y = row * cellHeight + (Math.random() - 0.5) * 22;
            atmosphereNodes.push({
              x,
              y,
              homeX: x,
              homeY: y,
              phase: Math.random() * Math.PI * 2,
              radius: Math.random() > 0.88 ? 2.5 : 1.8,
              accent: Math.random() > 0.86,
            });

            if (column < columns - 1) atmosphereEdges.push([index, index + 1]);
            if (row < rows - 1) atmosphereEdges.push([index, index + columns]);
            if (
              column < columns - 1 &&
              row < rows - 1 &&
              (row + column) % 2 === 0
            ) {
              atmosphereEdges.push([index, index + columns + 1]);
            }
          }
        }

        drawAtmosphere(0, false);
      };

      const drawAtmosphere = (time, move) => {
        atmosphereContext.clearRect(0, 0, atmosphereWidth, atmosphereHeight);
        atmosphereNodes.forEach((node) => {
          if (!move) return;
          const pointerDistance = Math.hypot(
            node.homeX - pointerX,
            node.homeY - pointerY,
          );
          const pointerInfluence =
            pointerDistance < 150 ? (150 - pointerDistance) / 150 : 0;
          node.x = node.homeX + Math.sin(time * 0.00034 + node.phase) * 8;
          node.y = node.homeY + Math.cos(time * 0.00029 + node.phase) * 7;
          if (pointerInfluence) {
            node.x += Math.sign(node.homeX - pointerX) * pointerInfluence * 10;
            node.y += Math.sign(node.homeY - pointerY) * pointerInfluence * 10;
          }
        });

        atmosphereEdges.forEach(([from, to]) => {
          const first = atmosphereNodes[from];
          const second = atmosphereNodes[to];
          const accented = first.accent || second.accent;
          atmosphereContext.beginPath();
          atmosphereContext.moveTo(first.x, first.y);
          atmosphereContext.lineTo(second.x, second.y);
          atmosphereContext.lineWidth = accented ? 1 : 0.75;
          atmosphereContext.strokeStyle = accented
            ? "rgba(92, 133, 43, 0.14)"
            : "rgba(7, 17, 14, 0.065)";
          atmosphereContext.stroke();
        });

        atmosphereNodes.forEach((node) => {
          const pulse = move ? Math.sin(time * 0.0012 + node.phase) * 0.35 : 0;
          atmosphereContext.beginPath();
          atmosphereContext.arc(
            node.x,
            node.y,
            node.radius + pulse,
            0,
            Math.PI * 2,
          );
          atmosphereContext.fillStyle = node.accent
            ? "rgba(121, 174, 49, 0.78)"
            : "rgba(7, 17, 14, 0.18)";
          if (node.accent) {
            atmosphereContext.shadowColor = "rgba(121, 174, 49, 0.24)";
            atmosphereContext.shadowBlur = 5;
          }
          atmosphereContext.fill();
          atmosphereContext.shadowBlur = 0;
        });
      };

      const animateAtmosphere = (timestamp) => {
        atmosphereFrame = 0;
        if (document.hidden || reducedMotion) return;
        if (timestamp - lastAtmosphereDraw >= 32) {
          drawAtmosphere(timestamp, true);
          lastAtmosphereDraw = timestamp;
        }
        atmosphereFrame = window.requestAnimationFrame(animateAtmosphere);
      };
      const startAtmosphere = () => {
        if (reducedMotion) {
          drawAtmosphere(0, false);
        } else if (
          !document.hidden &&
          !heroOverlapsAtmosphere &&
          !atmosphereFrame
        ) {
          atmosphereFrame = window.requestAnimationFrame(animateAtmosphere);
        }
      };
      const stopAtmosphere = () => {
        if (atmosphereFrame) window.cancelAnimationFrame(atmosphereFrame);
        atmosphereFrame = 0;
      };
      setAtmosphereHeroVisible = (visible) => {
        heroOverlapsAtmosphere = visible;
        atmosphere.classList.toggle("is-muted", visible);
        if (visible) stopAtmosphere();
        else startAtmosphere();
      };

      window.addEventListener("resize", resizeAtmosphere, { passive: true });
      window.addEventListener(
        "pointermove",
        (event) => {
          pointerX = event.clientX;
          pointerY = event.clientY;
        },
        { passive: true },
      );
      window.addEventListener(
        "pointerleave",
        () => {
          pointerX = -1000;
          pointerY = -1000;
        },
        { passive: true },
      );
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAtmosphere();
        else startAtmosphere();
      });
      resizeAtmosphere();
      startAtmosphere();
    }

    const hero = document.querySelector(".hero");
    if (hero) {
      const headline = hero.querySelector("h1");
      if (headline) {
        const accessibleName = headline.textContent.replace(/\s+/g, " ").trim();
        headline.setAttribute("aria-label", accessibleName);
        let wordIndex = 0;
        const wrapWords = (node) => {
          [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              const fragment = document.createDocumentFragment();
              child.textContent
                .split(/(\s+)/)
                .filter(Boolean)
                .forEach((part) => {
                  if (/^\s+$/.test(part)) {
                    fragment.append(document.createTextNode(part));
                    return;
                  }
                  const mask = document.createElement("span");
                  const word = document.createElement("span");
                  mask.className = "w";
                  word.textContent = part;
                  mask.style.setProperty("--i", wordIndex++);
                  mask.append(word);
                  fragment.append(mask);
                });
              child.replaceWith(fragment);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              wrapWords(child);
            }
          });
        };
        wrapWords(headline);
      }

      const canvas = document.createElement("canvas");
      canvas.className = "hero-net";
      canvas.setAttribute("aria-hidden", "true");
      hero.prepend(canvas);

      const context = canvas.getContext("2d");
      let activateHeroNetwork = () => {};
      if (context) {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const ink =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--ink")
            .trim() || "#07110e";
        const acid =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--acid")
            .trim() || "#b7f343";
        const nodes = [];
        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let animationFrame = 0;
        let heroVisible = false;
        let heroStarted = false;
        let pointer = null;

        const resizeCanvas = () => {
          const bounds = canvas.getBoundingClientRect();
          width = bounds.width;
          height = bounds.height;
          pixelRatio = Math.min(2, window.devicePixelRatio || 1);
          canvas.width = Math.round(width * pixelRatio);
          canvas.height = Math.round(height * pixelRatio);
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          const count = Math.min(
            70,
            Math.max(18, Math.floor((width * height) / 24000)),
          );
          nodes.length = 0;
          for (let index = 0; index < count; index += 1) {
            nodes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: reducedMotion ? 0 : (Math.random() - 0.5) * 0.22,
              vy: reducedMotion ? 0 : (Math.random() - 0.5) * 0.22,
              radius: Math.random() > 0.88 ? 2.3 : 1.5,
              accent: Math.random() > 0.82,
            });
          }
          if (heroStarted) drawNetwork(false);
        };

        const drawNetwork = (move) => {
          context.clearRect(0, 0, width, height);
          for (let first = 0; first < nodes.length; first += 1) {
            const node = nodes[first];
            if (move && pointer) {
              const deltaX = node.x - pointer.x;
              const deltaY = node.y - pointer.y;
              const distance = Math.hypot(deltaX, deltaY);
              if (distance > 0 && distance < 115) {
                const force = (115 - distance) / 1150;
                node.vx += (deltaX / distance) * force;
                node.vy += (deltaY / distance) * force;
              }
            }
            if (move) {
              node.x += node.vx;
              node.y += node.vy;
              node.vx *= 0.995;
              node.vy *= 0.995;
              if (node.x < 0 || node.x > width) node.vx *= -1;
              if (node.y < 0 || node.y > height) node.vy *= -1;
              node.x = Math.max(0, Math.min(width, node.x));
              node.y = Math.max(0, Math.min(height, node.y));
            }
            for (let second = first + 1; second < nodes.length; second += 1) {
              const other = nodes[second];
              const distance = Math.hypot(node.x - other.x, node.y - other.y);
              if (distance < 150) {
                context.strokeStyle = `rgba(7, 17, 14, ${(1 - distance / 150) * 0.2})`;
                context.lineWidth = 0.7;
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(other.x, other.y);
                context.stroke();
              }
            }
            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fillStyle = node.accent ? acid : "rgba(7, 17, 14, 0.2)";
            context.fill();
            if (node.accent) {
              context.strokeStyle = ink;
              context.lineWidth = 0.7;
              context.stroke();
            }
          }
        };

        const animateNetwork = () => {
          if (!heroVisible || reducedMotion) return;
          drawNetwork(true);
          animationFrame = window.requestAnimationFrame(animateNetwork);
        };

        const startNetwork = () => {
          if (!heroStarted) return;
          if (reducedMotion) {
            drawNetwork(false);
          } else if (heroVisible && !animationFrame) {
            animationFrame = window.requestAnimationFrame(animateNetwork);
          }
        };

        const stopNetwork = () => {
          if (animationFrame) window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        };
        activateHeroNetwork = () => {
          heroStarted = true;
          startNetwork();
        };

        window.addEventListener("resize", resizeCanvas, { passive: true });
        hero.addEventListener(
          "pointermove",
          (event) => {
            const bounds = canvas.getBoundingClientRect();
            pointer = {
              x: event.clientX - bounds.left,
              y: event.clientY - bounds.top,
            };
          },
          { passive: true },
        );
        hero.addEventListener(
          "pointerleave",
          () => {
            pointer = null;
          },
          { passive: true },
        );
        if ("IntersectionObserver" in window) {
          new IntersectionObserver(([entry]) => {
            heroVisible = entry.isIntersecting;
            setAtmosphereHeroVisible(heroVisible);
            if (heroVisible) startNetwork();
            else stopNetwork();
          }).observe(hero);
        } else {
          heroVisible = true;
          setAtmosphereHeroVisible(true);
        }
        resizeCanvas();
      }

      const startHero = () => {
        hero.classList.add("is-ready");
        if (hero.dataset.enhanceStarted) return;
        hero.dataset.enhanceStarted = "true";
        activateHeroNetwork();
      };

      startHero();
    }

    const packageNames = [
      "ai-operations-spec",
      "agenticlens",
      "agentic-evals",
      "agentic-chaos",
      "agentic-sidecar",
      "control-tower",
      "mcp-server",
    ];
    const tickerHero = document.querySelector(".hero");
    if (tickerHero) {
      const ticker = document.createElement("div");
      ticker.className = "ticker";
      ticker.setAttribute("aria-hidden", "true");
      const track = document.createElement("div");
      track.className = "ticker-track";
      for (let copy = 0; copy < 4; copy += 1) {
        const sequence = document.createElement("div");
        sequence.className = "ticker-sequence";
        packageNames.forEach((name) => {
          const item = document.createElement("span");
          item.textContent = name;
          sequence.append(item);
        });
        track.append(sequence);
      }
      ticker.append(track);
      tickerHero.after(ticker);
    }

    const revealSelectors =
      ".section-heading,.loop-step,.dash-card,.diff-card,.phase,.faq-item,.newsletter-inner,.cta>*";
    const revealItems = [...document.querySelectorAll(revealSelectors)];
    revealItems.forEach((item) => {
      const siblingIndex = [...item.parentElement.children].indexOf(item);
      item.classList.add("rv");
      item.style.setProperty("--d", `${(siblingIndex % 4) * 80}ms`);
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("in"));
    }

    const loopTrack = document.querySelector(".loop-track");
    const loopSteps = loopTrack
      ? [...loopTrack.querySelectorAll(".loop-step")]
      : [];
    if (
      loopTrack &&
      loopSteps.length &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      "IntersectionObserver" in window
    ) {
      let cycleTimer = 0;
      let activeIndex = -1;
      const cycleObserver = new IntersectionObserver(
        ([entry]) => {
          window.clearInterval(cycleTimer);
          cycleTimer = 0;
          if (!entry.isIntersecting) {
            loopSteps.forEach((step) => step.classList.remove("is-lit"));
            activeIndex = -1;
            return;
          }
          const activateNext = () => {
            loopSteps.forEach((step) => step.classList.remove("is-lit"));
            activeIndex = (activeIndex + 1) % loopSteps.length;
            loopSteps[activeIndex].classList.add("is-lit");
          };
          activateNext();
          cycleTimer = window.setInterval(activateNext, 1600);
        },
        { threshold: 0.12 },
      );
      cycleObserver.observe(loopTrack);
    }
  } catch {
    document.documentElement.classList.remove("js");
    document.querySelector(".hero")?.classList.add("is-ready");
    document
      .querySelectorAll(".rv")
      .forEach((item) => item.classList.add("in"));
  }
})();
