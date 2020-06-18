import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class SysRolesEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.hideModel();
      }
    });
  };

  hideModel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, record } = this.props;
    const { roleName, remark } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <Modal
          title={title}
          // width={720}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModel}
          maskClosable={false}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="角色名称" {...formItemLayout}>
              {getFieldDecorator('roleName', {
                initialValue: roleName || '',
                rules: [
                  {
                    required: true,
                    message: '角色名称不能为空',
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '长度为1到10个字',
                  },
                ],
              })(<Input placeholder="请输入角色名称" />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea placeholder="请输入备注" rows={4} />)}
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

export default Form.create()(SysRolesEditModal);
