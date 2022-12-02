const config = {
  publicPath: "./public",
  pages: [
    {
      html: "./src/pages/index.html",
      js: "./src/pages/index.js",
      css: "./src/pages/index.scss",
      name: "index",
      // includeComponents: [],
      // outputFileName: "index",
      outputPath: "",
      // inject: true,
    },
  ],
  // components: [],
  copyFolders: [
    { from: "./src/images", to: "images" },
    { from: "./src/dependencies", to: "dependencies" },
  ],
};

module.exports = config;
