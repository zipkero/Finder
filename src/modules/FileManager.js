const fs = window.require('fs');
const fspromises = fs.promises;

class FileManager {
    constructor(basePath) {
        this.path = basePath;
    }

    async getAllFiles() {             
        const fileList = await fspromises.readdir(this.path)
        return fileList
    }

    async getCurrentFiles() {
    }
}

export default FileManager;