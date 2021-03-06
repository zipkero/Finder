import React, {useState} from 'react';
import {List, Input, Button, Row, Col, Divider, Modal} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import File from './File';
import SearchFiles from '../modules/SearchFiles';
import TagList from './TagList';

function warning() {
    Modal.warning({
        title: '검색어 추가는 10개까지만 가능합니다.',
    });
}

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

        if (tags.length >= 10) {
            warning(e);
            return;
        }

        setTags(tags => tags.concat({
            value: filter
        }));

        setFilter('');
    }

    const onChange = (e) => {
        setFilter(e.target.value);
    }

    const onClose = (value) => {
        setTags(tags => tags.filter(tag => tag.value !== value))
    }

    const getFiles = async () => {
        const sf = new SearchFiles();
        console.log(tags)
        const fileList = await sf.search("./pages", {
            extensions: ["js"],
            keywords: tags.map(tag => tag.value)
        })
        setFiles(fileList);
    }

    return (
        <div>
            <Row justify="center" style={{paddingTop: "20px"}}>
                <Col span="20">
                    <Input value={filter} onChange={onChange} onKeyDown={onKeyDown}/>
                </Col>
            </Row>
            <Row justify="center" style={{padding: "20px"}}>
                <Col>
                    <TagList tags={tags} onClose={onClose}/>
                </Col>
            </Row>
            <Row justify="center">
                <Col span="20">
                    <Button type="primary" block onClick={onSearch} icon={<SearchOutlined/>}>
                        Search
                    </Button>
                </Col>
            </Row>
            <Divider>Result</Divider>
            <List
                size="large"
            >
                {files && files.map(file => (
                    <File key={file.name} file={file}/>
                ))}
            </List>
        </div>
    );
}

export default FileList;