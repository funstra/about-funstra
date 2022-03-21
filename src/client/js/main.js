import "./router.js";
import "./controll-tower.js"
// import "./scroll-animation";

addEventListener("popstate", e => {
  console.log(e);
});

dispatchEvent(
  new CustomEvent("router:nav", {
    bubbles: true,
    detail: { route: location.pathname },
  })
);
