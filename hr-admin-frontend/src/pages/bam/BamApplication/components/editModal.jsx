/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;

class BamApplicationEditModal extends Component {
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
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
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

export default Form.create()(BamApplicationEditModal);
