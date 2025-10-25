// forge.config.cjs
const path = require("path");
const { VitePlugin } = require("@electron-forge/plugin-vite");

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.resolve(__dirname, "assets/icon"), // optional
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    // ✅ Primary Vite integration
    new VitePlugin({
      build: [
        {
          entry: "main.jsx", // ✅ correct relative path
          config: "vite.renderer.config.js",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.js",
        },
      ],
    }),

    // ✅ Optional plugin - doesn't conflict
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
