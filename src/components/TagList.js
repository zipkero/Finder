import React from 'react';
import {Tag} from 'antd';

function TagList({tags, onClose}) {
    return (
        <div>
            {tags.map(tag => (
                <Tag key={tag.value} onClose={() => onClose(tag.value)} closable style={{marginBottom: "5px"}}>
                    {tag.value}
                </Tag>
            ))}
        </div>
    )
}

export default TagList