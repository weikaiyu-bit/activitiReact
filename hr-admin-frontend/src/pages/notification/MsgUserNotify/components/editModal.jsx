import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment'
const FormItem = Form.Item;

class MsgUserNotifyEditModal extends Component {
  /* ********************************** */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        values.sentAt=values.sentAt?
        moment(values.sentAt).format('YYYY-MM-DD 00:00:00') : values.sentAt;
        values.createAt=values.createAt?
        moment(values.createAt).format('YYYY-MM-DD 00:00:00'):values.createAt;
        onOk(record.id, {
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

  /* *********************************** */

  render() {
    console.log(this.props)
    const { title, visible, record } = this.props;
    const {
      id,
      appId,
      tenantId,
      notifyId,
      ownerUid,
      notifyType,
      content,
      description,
      status,
      extra,
      action,
      targetId,
      targetName,
      targetType,
      senderId,
      senderName,
      senderAvatar,
      senderType,
      sentAt,
      isRead,
      clickClose,
      createAt,
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
            <FormItem label="id" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: id || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="应用id" {...formItemLayout}>
              {getFieldDecorator('appId', {
                initialValue: appId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="租户id" {...formItemLayout}>
              {getFieldDecorator('tenantId', {
                initialValue: tenantId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="关联消息" {...formItemLayout}>
              {getFieldDecorator('notifyId', {
                initialValue: notifyId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="消息所属者" {...formItemLayout}>
              {getFieldDecorator('ownerUid', {
                initialValue: ownerUid || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="消息类型" {...formItemLayout}>
              {getFieldDecorator('notifyType', {
                initialValue: notifyType || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="消息内容" {...formItemLayout}>
              {getFieldDecorator('content', {
                initialValue: content || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: description || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="扩展" {...formItemLayout}>
              {getFieldDecorator('extra', {
                initialValue: extra || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="动作类型" {...formItemLayout}>
              {getFieldDecorator('action', {
                initialValue: action || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="目标id" {...formItemLayout}>
              {getFieldDecorator('targetId', {
                initialValue: targetId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="目标名称" {...formItemLayout}>
              {getFieldDecorator('targetName', {
                initialValue: targetName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="目标类型" {...formItemLayout}>
              {getFieldDecorator('targetType', {
                initialValue: targetType || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="发送者id" {...formItemLayout}>
              {getFieldDecorator('senderId', {
                initialValue: senderId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="发送者名称" {...formItemLayout}>
              {getFieldDecorator('senderName', {
                initialValue: senderName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="发送者头像" {...formItemLayout}>
              {getFieldDecorator('senderAvatar', {
                initialValue: senderAvatar || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="发送者类型" {...formItemLayout}>
              {getFieldDecorator('senderType', {
                initialValue: senderType || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="发送时间" {...formItemLayout}>
              {getFieldDecorator('sentAt', {
                initialValue: moment(sentAt) || '',
              })(<DatePicker
                style={{
                  width: '100%',
                }}
                placeholder="请输入创建时间"
              />)}
            </FormItem>
            <FormItem label="已读标记" {...formItemLayout}>
              {getFieldDecorator('isRead', {
                initialValue: isRead || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="点击关闭" {...formItemLayout}>
              {getFieldDecorator('clickClose', {
                initialValue: clickClose || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="创建时间" {...formItemLayout}>
              {getFieldDecorator('createAt', {
                initialValue: moment(createAt) || '',
              })(<DatePicker
                style={{
                  width: '100%',
                }}
                placeholder="请输入创建时间"
              />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}


export default Form.create()(MsgUserNotifyEditModal);
