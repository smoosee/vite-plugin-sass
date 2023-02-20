import { existsSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { AcceptedPlugin } from 'postcss';
import { parseSourceMap } from './utils';

export default (): AcceptedPlugin => {
    let parsedSourceMap, rootPath;
    return {
        postcssPlugin: 'postcss:sass-tools',
        async Once(root, helper) {
            const { file, map } = root.source.input;
            rootPath = dirname(file);
            if (map) {
                parsedSourceMap = await parseSourceMap(file, map);
            }
        },
        Declaration(declaration) {
            let { value, source, parent } = declaration;
            if (parsedSourceMap) {
                const matches = value.match(/(url\((['"]\.[^\)]*)\))*/g).filter(Boolean);

                if (matches?.length) {
                    const positions = [source.start, parent.source.start];
                    const sources = positions.map(pos => parsedSourceMap.originalPositionFor(pos));
                    matches.forEach(key => {
                        const oldValue = key.split(/['"?#]/g)[1];
                        if (oldValue?.startsWith('.')) {
                            sources.every(({ source }: any) => {
                                const absolutePath = resolve(rootPath, dirname(source), oldValue);
                                const relativePath = relative(rootPath, absolutePath).replace(/\\/g, '/');
                                if (existsSync(absolutePath)) {
                                    value = value.replace(oldValue, relativePath);
                                    return false;
                                }
                                return true;
                            });
                        }
                    });
                }
            }
            declaration.value = value;
        },
    };
};
