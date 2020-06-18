import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class BamFileLogEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /************************************************************************************************/

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
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

  /************************************************************************************************/

  render() {
    const { title, visible, record } = this.props;
    const {
      id,
      appId,
      tenantId,
      uid,
      categoryId,
      fileId,
      fileName,
      fileType,
      fileUrl,
      fileSize,
      fileStatus,
      rsTable,
      rsId,
      operateCode,
      description,
      createTime,
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
            <FormItem label="日志id" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: id || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="应用id" {...formItemLayout}>
              {getFieldDecorator('appId', {
                initialValue: appId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="租户id" {...formItemLayout}>
              {getFieldDecorator('tenantId', {
                initialValue: tenantId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="用户id" {...formItemLayout}>
              {getFieldDecorator('uid', {
                initialValue: uid || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="类别id" {...formItemLayout}>
              {getFieldDecorator('categoryId', {
                initialValue: categoryId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="文件id" {...formItemLayout}>
              {getFieldDecorator('fileId', {
                initialValue: fileId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="文件名称" {...formItemLayout}>
              {getFieldDecorator('fileName', {
                initialValue: fileName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="文件类型" {...formItemLayout}>
              {getFieldDecorator('fileType', {
                initialValue: fileType || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="文件URL" {...formItemLayout}>
              {getFieldDecorator('fileUrl', {
                initialValue: fileUrl || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="文件大小" {...formItemLayout}>
              {getFieldDecorator('fileSize', {
                initialValue: fileSize || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="文件状态" {...formItemLayout}>
              {getFieldDecorator('fileStatus', {
                initialValue: fileStatus || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="相关表" {...formItemLayout}>
              {getFieldDecorator('rsTable', {
                initialValue: rsTable || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="关联id" {...formItemLayout}>
              {getFieldDecorator('rsId', {
                initialValue: rsId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作码" {...formItemLayout}>
              {getFieldDecorator('operateCode', {
                initialValue: operateCode || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: description || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="创建时间" {...formItemLayout}>
              {getFieldDecorator('createTime', {
                initialValue: createTime || '',
              })(<Input />)}
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

export default Form.create()(BamFileLogEditModal);
