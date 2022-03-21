addEventListener("router:nav", e => {
  // console.log(e.detail);
  const { route } = e.detail;
  if (route === "/about/") {
    const gaze = document.querySelector('[abstract\\:entity="gaze"] circle');
    const main = document.querySelector('[data-page=""] > main');
    main.addEventListener("mousemove", e => {
      const rect = main.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const x = e.clientX - rect.left;

      // console.log(`x: ${x} - y: ${y}`);
      // console.log(e.offsetX);
      // console.log(e.offsetY);
      // gaze.setAttribute("x2", `${x}`);
      // gaze.setAttribute("y2", `${y}`);

      // const d = `M512,512 A1,1 0 0 0 ${x},${y}`;
      // gaze.setAttribute("d", d);
      // gaze.setAttribute("cx", x);
      // gaze.setAttribute("cy", y);
      // gaze.setAttribute("transform", `translate(${x} ${y})`);
      // gaze.style.transform = `translate(${x}px,${y}px)`;
    });
  }
});
