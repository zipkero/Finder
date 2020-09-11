import React from 'react';
import { Tag } from 'antd';

function TagList({ tags }) {
    return (
        <div>
            {tags.map(tag => (
                <Tag key={tag.id} closable style={{ marginBottom: "5px" }}>
                    {tag.name}
                </Tag>
            ))}
        </div>
    )
}

export default TagList