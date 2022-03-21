const init = () => {
  const sectionsList = document.querySelector("svg");
  const sections = document.querySelectorAll("#sections-list > li");

  const sectionsTop = [...sections].slice(1).map(section => {
    section.dataset.offsetTop = section.offsetTop - sectionsList.offsetHeight;
    return section.offsetTop - sectionsList.offsetHeight;
  });

  /**@param {HTMLElement} section */
  const startHandler = section => {
    return e => {
      const f = e.target.scrollTop / section.offsetHeight;
      section.querySelector("text.factor").textContent = Math.min(f, 1);
      console.log(`start handler: ${f}`);

      const ani = section
        .querySelector("svg circle")
        .animate([{ transform: "scale(1)" }, { transform: "scale(2)" }], {
          duration: 1,
        });
      ani.pause();
      ani.currentTime = f;
    };
  };
  const designexitHandler = section => {
    return e => {
      const f =
        (e.target.scrollTop - section.dataset.offsetTop) /
        (section.offsetHeight * 2);
      section.querySelector("text.factor").textContent = Math.min(f, 1);
      console.log(`designexit handler: ${f}`);

      const aniRect = section.querySelector("svg rect + rect").animate(
        [
          { transform: "scale(1,1)", fill: "red" },
          { transform: "scale(0.25,8)", fill: "paleturquoise" },
        ],
        {
          duration: 1,
        }
      );
      aniRect.pause();
      aniRect.currentTime = f;
      section
        .querySelector("#pattern-dots")
        .setAttribute("patternTransform", `translate(${f * 8192} 0)`);
    };
  };
  const aboutUsHandler = section => {
    return e => {
      const f =
        (e.target.scrollTop - section.dataset.offsetTop) / section.offsetHeight;
      section.querySelector("text.factor").textContent = Math.min(f, 1);
      console.log(`about-us handler: ${f}`);

      const ani = section
        .querySelector("svg g")
        .animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(180deg)" }],
          {
            duration: 1,
          }
        );
      ani.pause();
      ani.currentTime = f;
    };
  };

  const handlerMap = new Map();
  handlerMap.set("start", startHandler);
  handlerMap.set("designexit", designexitHandler);
  handlerMap.set("about-us", aboutUsHandler);

  const handlerMemory = new Map();

  // Add InterSectionObservers to all page sections
  const dataPage = document.querySelector("[data-page='works']");
  const main = document.querySelector("main");
  dataPage.querySelectorAll("li").forEach(li => {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            //   console.log("intersecting: ", li);
            li.classList.add("intersecting");
            //   const handler = handlerMap.get(li.dataset.section)(li);
            //   handlerMemory.set(li.dataset.section, handler);

            //   sectionsList.addEventListener("scroll", handler);
          } else if (!entry.isIntersecting) {
            //   console.log("not intersection: ", li);
            li.classList.remove("intersecting");

            //   const handler = handlerMemory.get(li.dataset.section);

            //   sectionsList.removeEventListener("scroll", handler);
          }
        });
      },
      {
        root: main,
        rootMargin: "-10% 0px -10% 0px",
      }
    );
    obs.observe(li);
  });
};

init();

addEventListener("router:nav", e => {
  if (e.detail.route === "/works/") {
    init();
  }
});
