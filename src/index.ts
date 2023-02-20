import { Plugin } from 'vite';
import { compileSassFile, resolveSassUrls } from './utils';

export default () => {
    let sassOptions = {};
    return {
        name: 'vite:sass-resolver',
        enforce: 'pre',
        configResolved(config) {
            sassOptions = config?.css?.preprocessorOptions?.scss || {};
        },
        async transform(code, file, options) {
            if (/\.(sass|scss)$/.test(file)) {
                const { css, map } = compileSassFile(file, sassOptions);
                const resolved = await resolveSassUrls(file, css, map);
                return { code: resolved.css, map: resolved.map };
            }
        },
    } as Plugin;
};
