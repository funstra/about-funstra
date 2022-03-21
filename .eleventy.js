const htmlmin = require("./_11ty/htmlmin.js");
const image = require("./_11ty/image.js");

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig*/
module.exports = eleventyConfig => {
  // image - -
  eleventyConfig.addNunjucksShortcode("image", image);

  eleventyConfig.addPassthroughCopy("./src/client/css/");
  eleventyConfig.addPassthroughCopy("./src/client/js/");
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");
  eleventyConfig.addPassthroughCopy("./src/assets/img");
  eleventyConfig.addPassthroughCopy("./src/assets/vid");

  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-vite"));
  if (process.env.NODE_ENV == "production") {
    // eleventyConfig.addTransform("htmlmin", htmlmin);
  }

  return {
    dir: {
      input: "src",
    },
  };
};
