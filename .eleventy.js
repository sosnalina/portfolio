module.exports = function (eleventyConfig) {
  // Static assets are hand-authored, not templated — copy them through untouched.
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("cockpit-widget.html");
  eleventyConfig.addPassthroughCopy("walkthrough-gallery.html");
  eleventyConfig.addPassthroughCopy("accordion-gallery.html");
  eleventyConfig.addPassthroughCopy("figma_thumb.png");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    // Only .njk files are treated as templates. Everything else (existing
    // static .html demo pages, etc.) is left alone / passed through above —
    // this build step does not take over files outside its own scope.
    templateFormats: ["njk"],
  };
};
