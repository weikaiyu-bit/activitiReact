import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class MsgTargetTypesEditModal extends Component {
  /* ***************************************** */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
        });
      }
    });
    console.log("1")
    this.cancelHandel();
  };

  cancelHandel = () => {
    console.log("2")
    const { onClose } = this.props;
    onClose();
  };

  /* ****************************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const { id, appId, tenantId, targetType, remark, createAt } = record;
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
            <FormItem label="目标类型" {...formItemLayout}>
              {getFieldDecorator('targetType', {
                initialValue: targetType || '',
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

export default Form.create()(MsgTargetTypesEditModal);
