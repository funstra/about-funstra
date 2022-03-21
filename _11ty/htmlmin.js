const htmlterser = require("html-minifier-terser");
module.exports = async function (content, outputPath) {
  if (!(process.env.NODE_ENV == "production")) {
    return content;
  }
  if (outputPath && outputPath.endsWith(".html")) {
    let minified = await htmlterser.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      customAttrCollapse: /d/,
    });
    return minified;
  }

  return content;
};
