import React, { useState } from 'react';
import { List, Input, Button, Row, Col, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import File from './File';
import SearchFiles from '../modules/SearchFiles';
import TagList from './TagList';


function FileList(props) {
    const [files, setFiles] = useState([]);
    const [tags, setTags] = useState([]);
    const [filter, setFilter] = useState('');

    const onSearch = (e) => {
        getFiles();
    }

    const onKeyDown = (e) => {        
        if (e.keyCode !== 13) {
            return;
        }

        setTags(tags => tags.concat({
            id: Date.now(),
            name: filter
        }));

        setFilter('');
    }

    const onChange = (e) => {
        setFilter(e.target.value);
    }

    const getFiles = async () => {
        const sf = new SearchFiles();
        const fileList = await sf.search("./pages", {
            extensions: [".js"],
        })
        console.log(fileList);
        setFiles(fileList);
    }

    return (
        <div>
            <Row justify="center" style={{ paddingTop: "20px" }}>
                <Col>
                    <Input value={filter} onChange={onChange} onKeyDown={onKeyDown} />
                </Col>
            </Row>
            <Row justify="center" style={{ padding: "20px" }}>
                <Col>
                    <TagList tags={tags} />
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                    <Button type="primary" onClick={onSearch} icon={<SearchOutlined />}>
                        Search
                    </Button>
                </Col>
            </Row>
            <Divider>Result</Divider>
            <List
                size="large"
                >
                {files && files.map(file => (
                    <File key={file.name} file={file} />
                ))}
            </List>
        </div>
    );
}

export default FileList;