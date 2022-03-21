const Image = require("@11ty/eleventy-img");
module.exports = function (dir, name, alt) {
  const src = `./src/assets/${dir}${
    dir ? "/" : ""
  }${name}`.toLocaleLowerCase();
  const opt = {
    widths: [256, 384, 512, 768, 1024, 1536, 2048],
    filenameFormat: function (id, src, width, format, options) {
      return `${src.slice(
        src.lastIndexOf("/") + 1,
        src.lastIndexOf(".")
      )}-${width}.${format}`;
    },
    formats: ['jpeg'],
    urlPath: "/assets/img/" + dir,
    outputDir: "./_site/assets/img/" + dir,
  };

  Image(src, opt);

  let imageAttributes = {
    alt,
    sizes: "100vw",
    loading: "lazy",
    decoding: "async",
  };
  let metadata = Image.statsSync(src, opt);
  return Image.generateHTML(metadata, imageAttributes);
};
