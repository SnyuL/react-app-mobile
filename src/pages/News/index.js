import React, { useState,useEffect } from 'react'

import { ImagePicker, WingBlank, SegmentedControl } from 'antd-mobile';
import NavHeader from "../../components/NavHeader/index"


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
  useEffect(()=>{
    console.log(files, "files")
  })
  const onChange = (file, type, index) => {
    setFiles(files = file)
    console.log(files, type, index);
  }
  const onSegChange = (e) => {
    // console.log(e)
    setMultiple(multiple = e.nativeEvent.selectedSegmentIndex)

  }
  return (
    <div>
      <NavHeader>我的</NavHeader>
      {/* tab切换 */}
      <WingBlank>
        <SegmentedControl
          values={['切换到单选', '切换到多选']}
          selectedIndex={multiple ? 1 : 0}
          onChange={onSegChange}
        />
        {/* 图片上传 */}
        <ImagePicker
          files={files}
          onChange={onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 7}
          multiple={multiple}
        />
      </WingBlank>
    </div>

  );


}