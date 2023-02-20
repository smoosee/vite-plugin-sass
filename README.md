<div align="center">

<h1> vite-plugin-sass </h1>
Vite plugin for resolving sass urls.

[![][img.release]][link.release]
[![][img.license]][link.license]

![][img.node]
![][img.npm]
![][img.downloads]

[![][img.banner]][link.npm]

</div>

<h2>Table of Contents</h2>

- [Install](#install)
- [How it works](#how-it-works)

## Install

1. Install the plugin:

```shell
yarn add @smoosee/vite-plugin-sass -D
```

2. Add the plugin

```ts
import { defineConfig } from 'vite';
import VitePluginSass from '@smoosee/vite-plugin-sass';

export default defineConfig({
    plugins: [VitePluginSass()],
});
```

## How it works

-   This plugin is meant mainly to fix a long standing issue with vite [`7651`](https://github.com/vitejs/vite/issues/7651)/[`11012`](https://github.com/vitejs/vite/issues/11012).

-   The plugin is enforced `pre`, and it compiles the original sass code into css (not redundant to the vite compiling process).

-   Using `source-maps` library inside a `postcss` plugin to resolve the original paths of where `url()` methods are called in the `.scss` files, and updating the source files with the relative address of those assets to the root `.scss` file.

[img.release]: https://img.shields.io/github/actions/workflow/status/smoosee/vite-plugin-sass/release.yml?logo=github&label=release
[img.license]: https://img.shields.io/github/license/smoosee/vite-plugin-sass?logo=github
[img.node]: https://img.shields.io/node/v/@smoosee/vite-plugin-sass?logo=node.js&logoColor=white&labelColor=339933&color=grey&label=
[img.npm]: https://img.shields.io/npm/v/@smoosee/vite-plugin-sass?logo=npm&logoColor=white&labelColor=CB3837&color=grey&label=
[img.downloads]: https://img.shields.io/npm/dt/@smoosee/vite-plugin-sass?logo=docusign&logoColor=white&labelColor=purple&color=grey&label=
[img.banner]: https://nodei.co/npm/@smoosee/vite-plugin-sass.png
[link.release]: https://github.com/smoosee/vite-plugin-sass/actions/workflows/release.yml
[link.license]: https://github.com/smoosee/vite-plugin-sass/blob/master/LICENSE
[link.npm]: https://npmjs.org/package/@smoosee/vite-plugin-sass
