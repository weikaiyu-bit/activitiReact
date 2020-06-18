import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }

  showModel = e => {
    if (e) e.stopPropagation();
    this.setState({
      previewVisible: true,
    });
  };

  hideModel = () => {
    this.setState({
      previewVisible: false,
    });
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    // console.log('onOk', onOk);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.hideModel();
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      apply,
      directory,
      fileName,
      fileType,
      fileUrl,
      fileSize,
      fileStatus,
      logId,
      createTime,
    } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <span onClick={this.showModel}>{children}</span>
        <Modal
          title="编辑文件信息"
          width={720}
          visible={this.state.previewVisible}
          onOk={this.okHandler}
          onCancel={this.hideModel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="应用">
              {getFieldDecorator('apply', {
                initialValue: apply || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="目录">
              {getFieldDecorator('directory', {
                initialValue: directory || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文件名称">
              {getFieldDecorator('fileName', {
                initialValue: fileName || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文件类型">
              {getFieldDecorator('fileType', {
                initialValue: fileType || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文件路径">
              {getFieldDecorator('fileUrl', {
                initialValue: fileUrl || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文件大小">
              {getFieldDecorator('fileSize', {
                initialValue: fileSize || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文件状态">
              {getFieldDecorator('fileStatus', {
                initialValue: fileStatus || '',
              })(<Input />)}
            </FormItem>
            {getFieldDecorator('createTime', {
              initialValue: createTime || '',
            })(<Input type="hidden" />)}
            {getFieldDecorator('logId', {
              initialValue: logId || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(EditModal);
