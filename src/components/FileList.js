import React, { useState } from 'react';
import { List, Input, Button, Row, Col, Divider } from 'antd';
import File from './File';
import FileManager from '../modules/FileManager';
import TagList from './TagList';


function FileList(props) {
    const [files, setFiles] = useState([]);

    const getFileList = async () => {
        const fm = new FileManager("D:\\WebService\\WebResource\\ECERP\\Contents\\pages");
        const fileList = await fm.getAllFiles()
        setFiles(fileList);
    }

    return (
        <div>
            <Row justify="center" style={{paddingTop:"20px"}}>
                <Col>
                    <Input />
                </Col>                
            </Row>
            <Row justify="center" style={{padding:"20px"}}>
                <Col>
                    <TagList />
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                <Button type="primary" block>Search</Button>
                </Col>
            </Row>
            <Divider>Result</Divider>
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