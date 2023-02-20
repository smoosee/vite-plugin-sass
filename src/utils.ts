import { existsSync, readFileSync } from 'fs';
import { dirname, isAbsolute, parse, resolve } from 'path';

import { LegacySharedOptions, renderSync } from 'sass';
import { SourceMapConsumer } from 'source-map';

import postcss from 'postcss';
import postcssPlugin from './postcss';

export const parseSourceMap = (filePath, sourceMap) => {
    if (sourceMap?.text) {
        sourceMap = JSON.parse(sourceMap.text);
    }
    const adjustedSourceMap = adjustSourceMap(filePath, sourceMap);
    return new SourceMapConsumer(adjustedSourceMap);
};

export const adjustSourceMap = (resourcePath, sourceMap, absolute = true) => {
    const processSourceMap = require('adjust-sourcemap-loader/lib/process');
    const format = absolute ? 'absolute' : 'projectRelative';
    const adjusted = processSourceMap({ resourcePath }, { format }, sourceMap);
    return adjusted;
};

export const compileSassFile = (filePath, sassOptions?: LegacySharedOptions<'sync'>) => {
    if (!isAbsolute(filePath)) {
        filePath = resolve(process.cwd(), filePath).replace(/\\/g, '/');
    } else {
        filePath = resolve(filePath).replace(/\\/g, '/');
    }

    if (existsSync(filePath)) {
        const sassCode = readFileSync(filePath);
        return compileSassCode(filePath, sassCode, sassOptions);
    } else {
        console.error('[sass-tools:compile]', `File provided not found at location ${filePath}`);
    }
};

export const compileSassCode = (filePath, sassCode, sassOptions?: LegacySharedOptions<'sync'>) => {
    const result = renderSync({
        ...sassOptions,
        file: filePath,
        outFile: filePath,
        sourceMapRoot: dirname(filePath),
        sourceMap: true,
        sourceMapEmbed: false,
        omitSourceMapUrl: true,
    });

    const css = result.css.toString();
    const map = JSON.parse(result.map.toString());

    return { css, map };
};

export const resolveSassUrls = async (resourcePath, cssContent, sourceMap) => {
    const content = await postcss([
        //
        postcssPlugin(),
    ]).process(cssContent, {
        from: resourcePath,
        map: {
            prev: sourceMap,
            absolute: false,
            inline: false,
            annotation: false,
            sourcesContent: true,
        },
    });

    return content;
};
