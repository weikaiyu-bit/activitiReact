import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class JobMembersEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /************************************************************************************************/

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime
            ? moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : values.updateTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /************************************************************************************************/

  render() {
    const { title, visible, record } = this.props;
    const { id, projectId, uid, name, username, avatarUrl, memberType } = record;
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
            <FormItem label="ID" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: id || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="项目id" {...formItemLayout}>
              {getFieldDecorator('projectId', {
                initialValue: projectId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="用户id" {...formItemLayout}>
              {getFieldDecorator('uid', {
                initialValue: uid || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: name || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('username', {
                initialValue: username || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="头像" {...formItemLayout}>
              {getFieldDecorator('avatarUrl', {
                initialValue: avatarUrl || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="成员类型" {...formItemLayout}>
              {getFieldDecorator('memberType', {
                initialValue: memberType || '',
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

export default Form.create()(JobMembersEditModal);
