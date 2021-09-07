import React, { useState, useEffect } from 'react'
import { ImagePicker } from 'antd-mobile';

export default function ImagePickerExample(props) {
    console.log(useState, "props")

    let [multiple, setMultiple] = useState(0);
    let [files, setFiles] = useState([{
        url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
        id: '2121',
    }, {
        url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
        id: '2122',
    }]);
    useEffect(() => {
        console.log(files, "files11111")
    })
    const onChange = (file, type, index) => {
        setFiles(files = file)
        console.log(files, type, index);
    }
    return (
        <div>
            {/* 图片上传 */}
            <ImagePicker
                files={files}
                onChange={onChange}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={files.length < 7}
                multiple={multiple}
            />
        </div>
    );


}