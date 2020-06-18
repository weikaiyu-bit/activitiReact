/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

class RtCategoryAddModal extends Component {
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
        if (record) {
          onOk(record.id, {
            ...values,
            pid: record.id,
          });
        } else {
          onOk(record, {
            ...values,
            pid: 0,
          });
        }
        // onOk(record.id, values);
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
    // const { id, pid, categoryName, remark, creatorId, createTime } = record;
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
                  // initialValue: categoryName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="创建时间" {...formItemLayout}>
              {
                getFieldDecorator('createTime', {
                  // initialValue: createTime || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {
                getFieldDecorator('remark', {
                  // initialValue: remark || '',
                })(<TextArea rows={5} />)
              }
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(RtCategoryAddModal);
