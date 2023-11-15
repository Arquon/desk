import path from "path";
import postcssPresetEnv from "postcss-preset-env";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import Dotenv from "dotenv-webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
// import { InjectManifest } from "workbox-webpack-plugin";
import { type RuleSetUseItem, type Configuration } from "webpack";

const isServe = process.env.NODE_ENV === "serve";
const isDev = process.env.NODE_ENV === "development" || isServe;
const isProd = process.env.NODE_ENV === "production";

const imagesFileName = "img/[name][ext]";
const fontsFileName = "fonts/[name][ext]";
const cssFileName = "css/[name].css";
const dotenvPath = isDev ? "./.env.development" : "./.env.production";

const plugins = [
   new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/templates/index.html",
   }),
   new MiniCssExtractPlugin({ filename: cssFileName }),
   new Dotenv({
      path: dotenvPath,
   }),
   new CopyWebpackPlugin({
      patterns: [
         { from: "src/templates/manifest.json", to: "[name][ext]" },
         { from: "src/templates/robots.txt", to: "[name][ext]" },
         { from: "src/assets/icons/*.png", to: "icons/[name][ext]" },
         { from: "src/assets/icons/favicon.ico", to: "[name][ext]" },
      ],
   }),
   // new InjectManifest({
   //    maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
   //    swSrc: "./src/sw/serviceWorker.ts",
   //    swDest: "service-worker.js",
   // }),
];

if (isServe) {
   plugins.push(new ReactRefreshPlugin());
}

type Optimization = Configuration["optimization"];

const optimization = (): Optimization => {
   const config: Optimization = {
      splitChunks: {
         chunks: "all",
      },
   };

   if (isProd) {
      config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()];
   }

   return config;
};

const cssLoaders = (isSass: boolean = false): RuleSetUseItem[] => {
   const miniCssExtractPluginLoader = {
      loader: MiniCssExtractPlugin.loader,
   };

   const cssLoader = {
      loader: "css-loader",
   };

   const postCssLoader = {
      loader: "postcss-loader",
      options: {
         postcssOptions: {
            plugins: [postcssPresetEnv],
         },
      },
   };

   const sassLoader = {
      loader: "sass-loader",
   };

   const loaders = [miniCssExtractPluginLoader, cssLoader, postCssLoader];
   if (isSass) loaders.push(sassLoader);

   return loaders;
};

interface IAppConfiguration extends Configuration {
   devServer: Record<string, any>;
}

const config: IAppConfiguration = {
   target: "web",
   mode: (isProd && "production") || (isDev && "development") || "development",
   resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      alias: {
         "@": path.resolve(__dirname, "src"),
         "@@": path.resolve(__dirname, "./"),
      },
   },
   entry: {
      index: "./src/index.tsx",
   },
   output: {
      filename: "js/[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      publicPath: "/",
   },
   devServer: {
      client: {
         overlay: {
            warnings: false,
            errors: true,
         },
      },
      port: 8000,
      historyApiFallback: true,
   },
   plugins,
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: cssLoaders(),
            generator: {
               filename: cssFileName,
            },
         },
         {
            test: /\.scss$/i,
            use: cssLoaders(true),
            generator: {
               filename: cssFileName,
            },
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/resource",
            generator: {
               filename: imagesFileName,
            },
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
            generator: {
               filename: fontsFileName,
            },
         },
         {
            test: /\.[jt]s?/,
            loader: "ts-loader",
            options: {
               transpileOnly: isProd,
               // transpileOnly: true,
            },
            exclude: [/node_modules/, /\.(json)/],
         },
      ],
   },
   optimization: optimization(),
   devtool: "source-map",
};

export default config;
