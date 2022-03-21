import zip from "./zip.js";

// Fetch html string and return a new html document
/**
 * @param {string} href
 * @returns {Promise<{page: Document,title: string}>}
 */
const getHTML = async href => {
  const res = await fetch(href);
  const page = new DOMParser().parseFromString(await res.text(), "text/html");
  return { page, title: page.querySelector("title").innerHTML };
};

// Query [data-page] elements
/**
 * @param {Document} doc
 * @returns {{elm:HTMLElement,val:String}[]}
 */
const routerAttr = doc => {
  return Array.from(doc.querySelectorAll("[data-page]")).map(elm => ({
    elm,
    val: elm.getAttribute("data-page"),
  }));
};
// Query [router:resource] elements
/**
 * @param {Document} doc
 * @returns {{elm:HTMLElement,val:String}[]}
 */
const routerResource = doc => {
  return Array.from(doc.head.querySelectorAll("[router\\:resource]")).map(
    elm => ({
      elm,
      val: elm.getAttribute("router:resource"),
    })
  );
};

// Get the diff between destination/source page
/**
 *  @param {Document} destination
 * @returns {Promise<[{elm:HTMLElement,val:String},{elm:HTMLElement,val:String}]>}
 */
const diffPage = async destination => {
  const [destrouters, srcrouters] = [destination, document].map(
    routerAttr
  );
  const zipedrouters = zip(destrouters, srcrouters);
  for (const [dest, src] of zipedrouters) {
    if (dest.val !== src.val) {
      return [dest, src];
    }
  }
  return [null, null];
};


// TODO abstract this
/**
 * @param {Document} dom
 * @param {keyof HTMLElementTagNameMap} selectorString
 */
const preFetchDOMResources = async (dom, selectorString) => {
  const resources = dom.querySelectorAll(`${selectorString}[src]`);
  console.log("prefetch resources");
  console.log(resources);
  return Promise.all([...resources].map(async src => fetch(src.src)));
};


// sets the page
/**
 * @param {object} o
 * @param {string} o.pathname
 * @param {string} o.href
 */
const setPage = async target => {
  const { pathname, href } = target;
  document.documentElement.classList.add("time-out");

  document
    .querySelector("header nav")
    .querySelector("a[aria-current]")
    ?.removeAttribute("aria-current");
  target.setAttribute("aria-current", "page");

  const destinationDocument = await getHTML(href);
  const [dest, src] = await diffPage(destinationDocument.page);
  const resources = [...routerResource(destinationDocument.page)];
  resources.forEach(reSrc => {
    import(reSrc.elm.src);
  });
  document.documentElement.classList.add("time-out");

  src.elm.classList.add("slideOut");
  const pageTransitionDuration =
    parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--page-transition-duration")
        .replace("s", "")
    ) * 1000;

  dest.elm.classList.add("slideIn");
  setTimeout(() => {
    src.elm.remove();
    dest.elm.classList.remove("slideIn");
    document.documentElement.classList.remove("time-out");
  }, pageTransitionDuration);

  src.elm.parentElement.appendChild(dest.elm);
  document.querySelector("main").scrollTo({
    top: 0,
  });
  document.documentElement.setAttribute("router:current-page", pathname);
  document.querySelector("title").innerHTML = destinationDocument.title;

  return true;
};

// listen for anchor clicks
document.addEventListener("click", async e => {
  const { target } = e;
  //if target is anchor and anchor origin is same as current webpage
  if (
    target.tagName === "A" &&
    target.origin === location.origin &&
    target.pathname !== location.pathname
  ) {
    e.preventDefault();
    history.pushState({}, null, target.pathname);
    await setPage(target);
    dispatchEvent(
      new CustomEvent("router:nav", {
        bubbles: true,
        detail: { route: target.pathname },
      })
    );
  }
});

// handle history change
onpopstate = e => {
  const target = document.querySelector(`a[href='${location.pathname}']`);
  setPage(target);
};
