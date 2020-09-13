import React from 'react';
import { List, Skeleton } from 'antd';

function File(props) {
    const { file } = props;
    return (
        <List.Item>
            <Skeleton avatar title={false} loading={false} active>
                <List.Item.Meta
                    title={<a href="https://ant.design">{file.name}</a>}
                    description={file.path}
                />
            </Skeleton>
        </List.Item>
    );
}

export default File;