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

        extensions = extensions || ["js"];
        filters = filters || [];
        const regexpInfo = {
            ext: '',
            body: '',
            // or 조건 /.*([.](body|body|body))$/
            // and 조건 /(?=.*body)(?=.*body)/gm
        }

        const extFilter = extensions.reduce((arr, cur, idx) => `${arr}${idx > 0 ? "|" : ""}${cur}`, "")
        regexpInfo.ext = `.*([.](${extFilter}))$`;

        mapFn = mapFn || (({dirent, dirPath, ext}) => {
            return {name: dirent.name, path: path.resolve(dirPath, dirent.name), ext}
        })

        const _getFiles = async (dirPath) => {
            let result = [];
            const dirList = await promises.opendir(dirPath);
            const extRegExp = new RegExp(regexpInfo.ext);
            for await (const dirent of dirList) {
                let fullPath = path.resolve(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    result = result.concat(await _getFiles(fullPath));
                } else {
                    let ext = path.extname(fullPath)
                    if (extRegExp.test(ext) === true) {
                        //TODO - 데이터 검색 필터 추가 예정
                        if (filters.length > 0) {
                            result.push(mapFn({dirent, dirPath, ext}))
                        } else {
                            result.push(mapFn({dirent, dirPath, ext}))
                        }
                    } else {
                        if (filters.length > 0) {
                            result.push(mapFn({dirent, dirPath, ext}))
                        }
                    }
                }
            }
            return result;
        }

        return await _getFiles(targetPath);
    }
}

export default SearchFiles;