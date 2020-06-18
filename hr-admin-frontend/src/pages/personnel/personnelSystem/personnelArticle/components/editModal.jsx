/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Card, Button, Row, Col, Space, Icon } from 'antd';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;

class PersonnelSystemArticleEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    editorState: BraftEditor.createEditorState(null),
  };


  componentDidMount() {
    const htmlContent = BraftEditor.createEditorState(this.props.record.content);
    this.setState({
      visible: true,
      editorState: htmlContent,
    });
    console.log('开始');
  }


  uploadFn = param => {
    const serverURL = '/api/v1/minio/oss/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = response => {
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log('response', response);
      const str = response.target.response;
      const url = response.target.response.data;
      console.log('url', url);
      // 截取地址
      // str = str.match(/"fileId":"(\S*)","fileName":"/)[1];
      const fileUrl = url;
      console.log('fileUrl', fileUrl);
      param.success({
        url: fileUrl,
        meta: {
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
        },
      })
    };

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };

    const errorFn = response => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败，请重试。',
      })
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };


  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          creatorTime: values.creatorTime ? moment(values.creatorTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.creatorTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };


  render() {
    const { title, visible, record } = this.props;
    const { id, tentantId, appId, articleTitle, pid, articleExplain, type, state, creatorId, creator, creatorTime } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const propsUpload = {
      action: '/api/v1/minio/oss/upload',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <>
        <Card>
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="文章制度标题" {...formItemLayout}>
              {
                getFieldDecorator('articleTitle', {
                  initialValue: articleTitle || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文章制度说明" {...formItemLayout}>
              {
                getFieldDecorator('articleExplain', {
                  initialValue: articleExplain || '',
                })(<Input.TextArea autoSize={{ minRows: 5 }} />)
              }
            </FormItem>
            <FormItem label="内容" {...formItemLayout}>
            {getFieldDecorator('articleContent', {
              validateFields: 'articleContent',
              rules: [{
                type: 'object',
                // 是否必填
                required: true,
              }],
              initialValue: BraftEditor.createEditorState(''),
            })(
              // <div className="my-component" style={{ width: '100%' }}>
              <BraftEditor
                media={{ uploadFn: this.uploadFn }}
              />,
              // </div>,
            )}
          </FormItem>
            <FormItem label="附件上传" {...formItemLayout}>
              <Upload {...propsUpload}>
                <Button>
                  <Icon type="upload" />
                  附件上传
                </Button>
              </Upload>
            </FormItem>
            <Row justify="center">
              <Col span={8}></Col>
              <Col span={8}>
                <Button type="primary" style={{ marginLeft: 5, marginRight: 5 }} onClick={() => this.okHandler()}>提交</Button>
                <Button type="ghost" style={{ marginLeft: 5, marginRight: 5 }} onClick={() => this.cancelHandel()}>取消</Button>
              </Col>
              <Col span={8}></Col>
            </Row>
            {/* <FormItem label="类型" {...formItemLayout}>
              {
                getFieldDecorator('type', {
                  initialValue: type || '',
                })(<Input />)
              }
            </FormItem> */}
            {
              getFieldDecorator('id', {
                initialValue: record.id || '',
              })(<Input type="hidden" />)
            }
          </Form>
        </Card>
      </>
    );
  }
}

export default Form.create()(PersonnelSystemArticleEditModal);
