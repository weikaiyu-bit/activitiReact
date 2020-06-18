import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;

class SysUsersEditModal extends Component {
  // 保存
  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.cancelHandel();
      }
    });
  };

  // 关闭对话框
  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const {
      title,
      visible,
      record: { userName, nickname, realName, mobile, status },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
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
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: userName || '',
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空',
                  },
                  {
                    min: 2,
                    max: 20,
                    message: '长度为2到10个字',
                  },
                ],
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem label="真实姓名" {...formItemLayout}>
              {getFieldDecorator('realName', {
                initialValue: realName || '',
                rules: [
                  {
                    required: true,
                    message: '真实姓名不能为空',
                  },
                  {
                    min: 2,
                    max: 10,
                    message: '长度为2到10个字',
                  },
                ],
              })(<Input placeholder="请输入真实姓名" />)}
            </FormItem>
            <FormItem label="昵称" {...formItemLayout}>
              {getFieldDecorator('nickname', {
                initialValue: nickname || '',
                rules: [
                  {
                    min: 2,
                    max: 20,
                    message: '长度为2到10个字',
                  },
                ],
              })(<Input placeholder="请输入昵称" />)}
            </FormItem>
            <FormItem label="手机号码" {...formItemLayout}>
              {getFieldDecorator('mobile', {
                initialValue: mobile || '',
                rules: [
                  {
                    min: 1,
                    max: 20,
                    message: '长度为1到10个字',
                  },
                  {
                    pattern: /^[0-9]*$/, // new RegExp('^\\w+$', 'g'),
                    message: '用户名必须为数字',
                  },
                ],
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
            <FormItem label="用户状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || 'enabled',
              })(
                <Radio.Group>
                  <Radio value="enabled">启用</Radio>
                  <Radio value="disabled">停用</Radio>
                  <Radio value="auditing">审核中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(SysUsersEditModal);
