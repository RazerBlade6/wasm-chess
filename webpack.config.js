const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { execSync } = require('child_process');

module.exports = {
  entry: './src/script.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    // Automatically copy .wasm to dist/
    new CopyPlugin({
      patterns: [
        { from: 'src/main.wasm', to: 'main.wasm' }
      ]
    }),

    // Build .wasm from C before compilation
    {
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('BuildWasmPlugin', () => {
          try {
            execSync(`clang-20 --target=wasm32 -I src/include -Wl,--no-entry,--export-all,--allow-undefined -nostdlib -std=c99 -O3 -Wall -Werror -pedantic -o src/main.wasm src/main.c`, {
              stdio: 'inherit'
            });
          } catch (error) {
            console.error('WASM build failed');
            process.exit(1);
          }
        });
      }
    }
  ],
  experiments: {
    asyncWebAssembly: true,
  },
  devServer: {
    static: './dist',
    port: 8080,
  },
  mode: 'development',
};

