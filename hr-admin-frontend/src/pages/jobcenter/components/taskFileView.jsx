import React, { Component } from 'react';
import { Button, Upload, Collapse } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '@/assets/css/taskFileViewCSS.css';

const { Panel } = Collapse;

export default class TaskFileView extends Component {
  state = {
    fileList: [],
  };

componentDidMount() {
  const { id, onFind } = this.props;
  onFind({ taskId: id });
}

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (!data) return;
    const fileList = [];
    const reg = /\.(png|jpg|gif|jpeg|webp)$/;
    const fileIcon = 'M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM761 656h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-23.1-31.9a7.92 7.92 0 0 0-6.5-3.3H573c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.9-5.3.1-12.7-6.4-12.7zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z';
    for (let i = 0; i < data.length; i += 1) {
      fileList.push({
        uid: data[i].id,
        name: data[i].fileName,
        status: 'done',
        url: `/api/v1/minio/oss/file/${data[i].fileId}`,
        thumbUrl: reg.test(data[i].fileName) ? `/api/v1/minio/oss/file/${data[i].fileId}` : fileIcon,
      });
    }
    this.setState({ fileList });
  }

  handleUploadChange = ({ file, fileList }) => {
    const { onSave, onFind, onRemove, id, onFindRecord } = this.props;
    const fileIcon = 'M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM761 656h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-23.1-31.9a7.92 7.92 0 0 0-6.5-3.3H573c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.9-5.3.1-12.7-6.4-12.7zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z';
    // 文件上传成功，写入文件地址到数据库
    if (file && file.status === 'done') {
      const newFile = {
        id: 0,
        taskId: id,
        fileId: file.response.data.fileId,
        fileName: file.name,
      };
      onSave(newFile);
      onFindRecord({ taskId: id })
    } else if (file && file.status === 'removed') {
      if (typeof file.uid === 'number') {
        onRemove([file.uid], id);
        onFindRecord({ taskId: id })
      } else {
        onFind({ taskId: id });
      }
    }
    if (file && file.status !== 'removed' && fileList[fileList.length - 1].thumbUrl === '') fileList[fileList.length - 1].thumbUrl = fileIcon;
    this.setState({
      fileList,
    });
  };

   render() {
     const { fileList } = this.state;
     const uploadProps = {
       listType: 'picture',
       action: '/api/v1/minio/oss/upload',
       fileList,
       className: 'upload-list-inline',
       onChange: this.handleUploadChange,
     };
     return (
       <div>
         <Collapse defaultActiveKey={['1']}>
           <Panel header="任务附件" key="1">
             <Upload {...uploadProps}>
               <Button style={{ marginBottom: '10px' }}>
                 <UploadOutlined /> 上传
               </Button>
             </Upload>
           </Panel>
           <Panel header="评论附件" key="2">
           </Panel>
         </Collapse>
       </div>
     );
   }
}
