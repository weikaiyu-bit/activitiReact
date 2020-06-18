/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class BamApplicationAddModal extends Component {
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
              })(<Input />)}
            </FormItem>
            <FormItem label="租户id" {...formItemLayout}>
              {getFieldDecorator('applicationName', {
                initialValue: applicationName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="Logo名称" {...formItemLayout}>
              {getFieldDecorator('logoName', {
                initialValue: logoName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="Logo底色" {...formItemLayout}>
              {getFieldDecorator('logoColor', {
                initialValue: logoColor || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || '',
              })(
                <Radio.Group>
                  <Radio value="ENABLED" defaultChecked>
                    启用
                  </Radio>
                  <Radio value="DISABLE">停用</Radio>
                  <Radio value="IN_REVIEW">审核中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="版本" {...formItemLayout}>
              {getFieldDecorator('version', {
                initialValue: version || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea />)}
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

export default Form.create()(BamApplicationAddModal);
