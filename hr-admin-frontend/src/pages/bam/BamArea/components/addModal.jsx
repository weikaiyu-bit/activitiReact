/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class BamAreaAddModal extends Component {
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
      areaName,
      areaCode,
      areaShort,
      areaIsHot,
      areaSequence,
      areaParentId,
      initDate,
      initAddr,
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
            <FormItem label="区域主键" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: id || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="区域名称" {...formItemLayout}>
              {getFieldDecorator('areaName', {
                initialValue: areaName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="区域代码" {...formItemLayout}>
              {getFieldDecorator('areaCode', {
                initialValue: areaCode || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="区域简称" {...formItemLayout}>
              {getFieldDecorator('areaShort', {
                initialValue: areaShort || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="是否热门(0:否、1:是)" {...formItemLayout}>
              {getFieldDecorator('areaIsHot', {
                initialValue: areaIsHot || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="区域序列" {...formItemLayout}>
              {getFieldDecorator('areaSequence', {
                initialValue: areaSequence || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="上级主键" {...formItemLayout}>
              {getFieldDecorator('areaParentId', {
                initialValue: areaParentId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="初始时间" {...formItemLayout}>
              {getFieldDecorator('initDate', {
                initialValue: initDate || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="初始地址" {...formItemLayout}>
              {getFieldDecorator('initAddr', {
                initialValue: initAddr || '',
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

export default Form.create()(BamAreaAddModal);
