/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class PersonnelSystemFileAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, record } = this.props;
    const { id, tentantId, appId, articleId, fileName, fileSuffix, fileUrl, fileSize, uploadName, uploadTime, hashCode } = record;
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
            <FormItem label="id" {...formItemLayout}>
              {
                getFieldDecorator('id', {
                  initialValue: id || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="租户id" {...formItemLayout}>
              {
                getFieldDecorator('tentantId', {
                  initialValue: tentantId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="应用id" {...formItemLayout}>
              {
                getFieldDecorator('appId', {
                  initialValue: appId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文章id" {...formItemLayout}>
              {
                getFieldDecorator('articleId', {
                  initialValue: articleId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文件名" {...formItemLayout}>
              {
                getFieldDecorator('fileName', {
                  initialValue: fileName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文件后缀名" {...formItemLayout}>
              {
                getFieldDecorator('fileSuffix', {
                  initialValue: fileSuffix || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文件url" {...formItemLayout}>
              {
                getFieldDecorator('fileUrl', {
                  initialValue: fileUrl || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文件大小" {...formItemLayout}>
              {
                getFieldDecorator('fileSize', {
                  initialValue: fileSize || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="上传人" {...formItemLayout}>
              {
                getFieldDecorator('uploadName', {
                  initialValue: uploadName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="上传时间" {...formItemLayout}>
              {
                getFieldDecorator('uploadTime', {
                  initialValue: uploadTime || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文件加密" {...formItemLayout}>
              {
                getFieldDecorator('hashCode', {
                  initialValue: hashCode || '',
                })(<Input />)
              }
            </FormItem>
            {
              getFieldDecorator('id', {
                initialValue: record.id || '',
              })(<Input type="hidden" />)
            }
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PersonnelSystemFileAddModal);
