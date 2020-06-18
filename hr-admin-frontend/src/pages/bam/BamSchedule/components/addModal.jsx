/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class BamScheduleAddModal extends Component {
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
    const {
      id,
      appId,
      tenantId,
      scheduleName,
      beanName,
      parameter,
      cronExpression,
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
            <FormItem label="id" {...formItemLayout}>
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
            <FormItem label="调度器名称" {...formItemLayout}>
              {getFieldDecorator('scheduleName', {
                initialValue: scheduleName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="JavaBean名称" {...formItemLayout}>
              {getFieldDecorator('beanName', {
                initialValue: beanName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="参数" {...formItemLayout}>
              {getFieldDecorator('parameter', {
                initialValue: parameter || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="CRON表达式" {...formItemLayout}>
              {getFieldDecorator('cronExpression', {
                initialValue: cronExpression || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="更新日期" {...formItemLayout}>
              {getFieldDecorator('updateTime', {
                initialValue: updateTime || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="更新人id" {...formItemLayout}>
              {getFieldDecorator('updatorId', {
                initialValue: updatorId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="创建时间" {...formItemLayout}>
              {getFieldDecorator('createTime', {
                initialValue: createTime || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="创建人id" {...formItemLayout}>
              {getFieldDecorator('creatorId', {
                initialValue: creatorId || '',
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

export default Form.create()(BamScheduleAddModal);
