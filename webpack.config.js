const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/server.js", // Entry point of your Node.js application
  output: {
    filename: "bundle.js", // The output filename
    path: path.resolve(__dirname, "dist"), // Output directory for the static files
  },
  mode: "production", // Set to 'production' for minified output
  target: "web",
  resolve: {
    fallback: {
      fs: false,
      zlib: require.resolve("browserify-zlib"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      net: require.resolve("net"),
      assert: require.resolve("assert/"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack app",
      filename: "index.html",
      template: "src/static/index.html",
    }),
  ],
};
