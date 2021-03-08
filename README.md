<p align="center">
    <a href="https://www.npmjs.org/package/@devlop-ab/laravel-mix-manifest-webpack-plugin"><img src="https://img.shields.io/npm/v/@devlop-ab/laravel-mix-manifest-webpack-plugin.svg" alt="Latest Stable Version"></a>
    <a href="https://github.com/devlop/laravel-mix-manifest-webpack-plugin/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

# laravel

This will generate a [Laravel Mix](https://laravel-mix.com/) compatible manifest, this is convenient if you are not using Laravel Mix but still want to use the [mix helper](https://laravel.com/docs/8.x/helpers#method-mix) in Laravel.

# Installing

using npm

```bash
npm install @devlop-ab/laravel-mix-manifest-webpack-plugin
```

# Usage 

```js
// in webpack.config.js
const LaravelMixManifestWebpackPlugin = require('@devlop-ab/laravel-mix-manifest-webpack-plugin');

// then add to plugins array in config
module.exports = {
    plugins: [
        new LaravelMixManifestWebpackPlugin({
            // the path to the public root 
            public: path.resolve(__dirname, 'public'),
            // the name of the output file
            name: 'mix-manifest.json',
        }),
    ],
}
```
