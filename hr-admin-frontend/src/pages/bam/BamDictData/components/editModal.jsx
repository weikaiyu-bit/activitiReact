/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;

class BamDictDataEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /* a********************************************************************************************** */

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

  /* ********************************************************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const {
      id,
      pid,
      appId,
      tenantId,
      dataName,
      dataValue,
      tags,
      remark,
      sortNo,
      updateTime,
      updatorId,
      createTime,
      creatorId,
      nodeType,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    console.log('sortNo', sortNo);
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
            <FormItem label="数据名称" {...formItemLayout}>
              {getFieldDecorator('dataName', {
                initialValue: dataName || '',
                rules: [
                  {
                    required: true,
                    message: '数据名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="数据值" {...formItemLayout}>
              {getFieldDecorator('dataValue', {
                initialValue: dataValue || '',
                // rules: [{
                //   required: true,
                //   message: '数据值不能为空',
                // }],
              })(<Input />)}
            </FormItem>
            <FormItem label="数据标签" {...formItemLayout}>
              {getFieldDecorator('tags', {
                initialValue: tags || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="节点类型" {...formItemLayout}>
              {getFieldDecorator('nodeType', {
                initialValue: nodeType || '',
              })(
                <Radio.Group>
                  <Radio value="category">类别</Radio>
                  <Radio value="data">数据</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sortNo', {
                initialValue: sortNo || '',
                // rules: [
                //   {
                //     required: true,
                //     message: '联系电话不能为空',
                //   }, {
                //     pattern: /^[0-9]+$/,
                //     message: '请输入数字',
                //   },
                // ],
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BamDictDataEditModal);
