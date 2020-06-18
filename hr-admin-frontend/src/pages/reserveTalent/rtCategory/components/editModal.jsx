/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

class RtCategoryEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
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
   const { id, pid, categoryName, remark, creatorId, createTime } = record
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
            <FormItem label="分类名称" {...formItemLayout}>
              {
                getFieldDecorator('categoryName', {
                  initialValue: categoryName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {
                getFieldDecorator('remark', {
                  initialValue: remark || '',
                })(<TextArea rows={5} />)
              }
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(RtCategoryEditModal);
