import React, { useState } from 'react';
import { Tag } from 'antd';

function TagList() {
    const onClose = (e) => {
        console.log(e);
    }
    return (
        <div>
            <Tag closable onClose={onClose} style={{ marginBottom: "5px" }}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitFunction
            </Tag>
            <Tag closable onClose={onClose}>
                onInitWidget
            </Tag>
            <Tag closable onClose={onClose}>
                searchManager
            </Tag>
        </div>
    )
}

export default TagList