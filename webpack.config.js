const path = require("path");
const webpack = require("webpack");

module.exports = () => {
  const plugins = [
    // Create global constants.
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.PACKAGE_VERSION": JSON.stringify(
        process.env.PACKAGE_VERSION
      ),
    }),
    // Add banner to the top of each generated chunk.
    new webpack.BannerPlugin({
      banner: `
        @Copyright (c) 2021-present, Hatchfi & Luumen Inc. All rights reserved.
        @Version: ${JSON.stringify(process.env.PACKAGE_VERSION)}
      `,
    }),
  ];

  // Compile for usage in a browser-like environment.
  // Output: "./dist/hatchfi.js"
  const browserConfig = {
    mode: "production",
    target: "web",
    devtool: "source-map",
    entry: "./src/index.js",
    output: {
      library: "Hatchfi",
      filename: "hatchfi.js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "window",
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: "babel-loader",
        },
      ],
    },
    plugins,
  };

  // Compile for usage in a Node.js-like environment (uses Node.js require to load chunks).
  // Output: "./dist/index.js"
  const modulesConfig = {
    mode: "production",
    target: "node",
    node: { process: false },
    entry: "./src/index.js",
    output: {
      library: "Hatchfi",
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "umd",
      umdNamedDefine: true,
      // TODO: Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: "babel-loader",
        },
      ],
    },
    plugins,
  };

  return [browserConfig, modulesConfig];
};
