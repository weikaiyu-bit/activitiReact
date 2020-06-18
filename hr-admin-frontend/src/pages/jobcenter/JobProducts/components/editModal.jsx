import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import InputColor from 'react-input-color';
import moment from 'moment';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { TextArea } = Input;

class JobProductsEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    color: '',
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const htmlContent = values.remark.toHTML();
        const { color } = this.state;
        onOk(record.id, {
          ...values,
          remark: htmlContent,
          logoColor: color,
          updateTime: values.updateTime
            ? moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : values.updateTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  // 上传
  uploadFn = param => {
    const serverURL = '/api/v1/minio/oss/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = response => {
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log('response', response);
      let str = response.target.response;
      // 截取地址
      str = str.match(/"fileId":"(\S*)","fileName":"/);
      const fileUrl = `/api/v1/minio/oss/file/${str[1]}`;
      console.log('fileUrl', fileUrl);
      param.success({
        url: fileUrl,
        meta: {
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
        },
      });
    };

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败，请重试。',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

  /** ********************************************************************************************* */
  changeColor = e => {
    this.setState({ color: e.hex });
  };

  render() {
    const { title, visible, record } = this.props;
    const {
      id,
      tenantId,
      applicationName,
      logoName,
      logoColor,
      version,
      remark,
      status,
      updateTime,
      updatorId,
      createTime,
      creatorId,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <>
        <Modal
          title={title}
          width={720}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="应用名称" {...formItemLayout}>
              {getFieldDecorator('applicationName', {
                initialValue: applicationName || '',
                rules: [
                  {
                    required: true,
                    message: '应用名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Logo名称" {...formItemLayout}>
              {getFieldDecorator('logoName', {
                initialValue: logoName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="Logo底色" {...formItemLayout}>
              <InputColor initialHexColor={logoColor} onChange={this.changeColor} />
            </FormItem>
            <FormItem label="版本" {...formItemLayout}>
              {getFieldDecorator('version', {
                initialValue: version || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue:
                  BraftEditor.createEditorState(remark) || BraftEditor.createEditorState(''),
              })(
                <BraftEditor
                  style={{ border: '1px solid #E8E8E8' }}
                  media={{ uploadFn: this.uploadFn }}
                  contentStyle={{ height: 'auto', maxHeight: '600px' }}
                  excludeControls={[
                    'undo',
                    'redo',
                    'separator',
                    'font-size',
                    'line-height',
                    'letter-spacing',
                    'separator',
                    'text-color',
                    'bold',
                    'italic',
                    'underline',
                    'strike-through',
                    'separator',
                    'superscript',
                    'subscript',
                    'remove-styles',
                    'separator',
                    'text-indent',
                    'text-align',
                    'separator',
                    'headings',
                    'list-ul',
                    'list-ol',
                    'blockquote',
                    'code',
                    'separator',
                    'link',
                    'separator',
                    'hr',
                    'separator',
                    'separator',
                    'clear',
                    'fullscreen',
                  ]}
                />,
              )}
            </FormItem>
            {getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(JobProductsEditModal);
