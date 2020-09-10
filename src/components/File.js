import React from 'react';
import { List } from 'antd';

function File(props) {
    const {file} = props;
    return (
        <List.Item>{file}</List.Item>
    );
}

export default File;