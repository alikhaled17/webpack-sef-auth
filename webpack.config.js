const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.ts",
    login: "./src/pages/login/index.ts",
    signup: "./src/pages/signup/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.css$/i,
        include: [path.resolve(__dirname, "src")],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: `./src/pages/login/index.html`,
          to: `login/index.html`,
        },
        {
          from: `./src/pages/signup/index.html`,
          to: `signup/index.html`,
        },
        { from: `./src/index.html`, to: `index.html` },
        { from: "./src/assets", to: "assets" },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  output: {
    publicPath: "public",
    path: path.resolve(__dirname, "public"),
    // filename: ({ runtime }) => {
    //   return runtime === "app" ? "index.js" : "[name]/index.js";
    // },
    filename: ({ runtime }) => {
      return runtime === "app" ? "index.js" : "[name].js";
    },
    clean: true,
  },
};

// const pages = ["signup", "login"];

// module.exports = {
//   entry: {
//     app: "./src/index.ts",
//     login: "./src/pages/login/index.ts",
//     signup: "./src/pages/signup/index.ts",
//   },
//   mode: "development",
//   devServer: {
//     watchFiles: ["src/**/*"],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.css$/i,
//         include: path.resolve(__dirname, "src"),
//         use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
//       },
//     ],
//   },
//   resolve: {
//     extensions: [".tsx", ".ts", ".js"],
//   },
//   plugins: [
//     new CopyPlugin({
//       patterns: [
//         ...pages.map((page) => {
//           return {
//             from: `./src/pages/${page}/index.html`,
//             to: `./${page}/index.html`,
//           };
//         }),
//         { from: `./src/index.html`, to: `./app/index.html` },
//         { from: "./src/assets", to: "app/assets" },
//       ],
//     }),
//     new MiniCssExtractPlugin({
//       filename: "style.css",
//     }),
//   ],
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "[name]/index.js",
//     clean: true,
//   },
// };
