/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class BamExceptionLogEditModal extends Component {
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
      appId,
      tenantId,
      uid,
      username,
      action,
      uri,
      method,
      parameters,
      requestTime,
      message,
      userAgent,
      ip,
      actionTime,
      status,
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
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('username', {
                initialValue: username || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作" {...formItemLayout}>
              {getFieldDecorator('action', {
                initialValue: action || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="请求URI" {...formItemLayout}>
              {getFieldDecorator('uri', {
                initialValue: uri || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="请求方式" {...formItemLayout}>
              {getFieldDecorator('method', {
                initialValue: method || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="请求参数" {...formItemLayout}>
              {getFieldDecorator('parameters', {
                initialValue: parameters || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="请求时长" {...formItemLayout}>
              {getFieldDecorator('requestTime', {
                initialValue: requestTime || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="异常信息" {...formItemLayout}>
              {getFieldDecorator('message', {
                initialValue: message || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="User-Agent" {...formItemLayout}>
              {getFieldDecorator('userAgent', {
                initialValue: userAgent || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="机器ip" {...formItemLayout}>
              {getFieldDecorator('ip', {
                initialValue: ip || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="操作时间" {...formItemLayout}>
              {getFieldDecorator('actionTime', {
                initialValue: actionTime || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || '',
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

export default Form.create()(BamExceptionLogEditModal);
