import React, { useState } from 'react';
import { List, Input, Button } from 'antd';
import File from './File';
import FileManager from '../modules/FileManager';

const { Search } = Input;

function FileList(props) {
    const [files, setFiles] = useState([]);

    const getFileList = async () => {
        const fm = new FileManager("D:\\WebService\\WebResource\\ECERP\\Contents\\pages");
        const fileList = await fm.getAllFiles()        
        setFiles(fileList);
    }

    return (
        <div>
            <Input></Input>
            <Button title="Search" onClick={()=> getFileList()} />
            <List
                size="large"
                bordered>
                {files && files.map(file => (
                    <File key={file} file={file} />
                ))}
            </List>

        </div>
    );
}

export default FileList;