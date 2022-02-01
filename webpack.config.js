const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  target: "webworker",
  optimization: {
    usedExports: true
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      loader: "babel-loader",
      exclude: /\/node_modules\//,
      options: {
        presets: [[
          "@babel/preset-env",
          {
            modules: false,
            loose: true,
            useBuiltIns: "usage",
            corejs: 3,
            targets: "last 1 Chrome versions",
            exclude: [
              /web\.dom/, // We ain't got no DOM...
              /generator|runtime/
            ]
          }
        ]],
        plugins: []
      }
    }]
  }
};
