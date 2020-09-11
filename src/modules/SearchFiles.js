const fs = window.require('fs');
const path = window.require('path');

const promises = fs.promises;

class SearchFiles {
    async search(targetPath, options) {
        let {
            extensions,
            mapFn,
            filters
        } = options || {};

        extensions = extensions || [];
        mapFn = mapFn || (({ dirent, dirPath, ext }) => {
            return { name: dirent.name, path: path.resolve(dirPath, dirent.name), ext }
        })

        const _getFiles = async (dirPath) => {
            let result = [];
            const dirList = await promises.opendir(dirPath);
            for await (const dirent of dirList) {
                let fullPath = path.resolve(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    result = result.concat(await _getFiles(fullPath));
                } else {
                    let ext = path.extname(fullPath)
                    if (extensions.length > 0) {
                        if (extensions.includes(ext)) {
                            result.push(mapFn({ dirent, dirPath, ext }))
                        }
                    } else {
                        result.push(mapFn({ dirent, dirPath, ext }))
                    }
                }
            }
            return result;
        }

        return await _getFiles(targetPath);
    }
}

export default SearchFiles;