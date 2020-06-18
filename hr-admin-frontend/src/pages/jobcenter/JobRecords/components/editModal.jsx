import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class JobRecordsEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
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

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record } = this.props;
    const {
      id,
      taskId,
      preStatus,
      curStatus,
      operatCode,
      description,
      operateTime,
      operatorUid,
      operatorName,
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
            <FormItem label="任务ID" {...formItemLayout}>
              {getFieldDecorator('taskId', {
                initialValue: taskId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="之前状态" {...formItemLayout}>
              {getFieldDecorator('preStatus', {
                initialValue: preStatus || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="当前状态" {...formItemLayout}>
              {getFieldDecorator('curStatus', {
                initialValue: curStatus || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作码" {...formItemLayout}>
              {getFieldDecorator('operatCode', {
                initialValue: operatCode || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: description || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作人" {...formItemLayout}>
              {getFieldDecorator('operatorUid', {
                initialValue: operatorUid || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作人名称" {...formItemLayout}>
              {getFieldDecorator('operatorName', {
                initialValue: operatorName || '',
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

export default Form.create()(JobRecordsEditModal);
