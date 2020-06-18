import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class JobCommentsAddModal extends Component {
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
      taskId,
      replyId,
      replyComments,
      comment,
      createTime,
      commentatorUid,
      commentatorName,
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
            <FormItem label="评论ID" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: id || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="任务ID" {...formItemLayout}>
              {getFieldDecorator('taskId', {
                initialValue: taskId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="回复ID" {...formItemLayout}>
              {getFieldDecorator('replyId', {
                initialValue: replyId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="回复内容" {...formItemLayout}>
              {getFieldDecorator('replyComments', {
                initialValue: replyComments || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="评论回复" {...formItemLayout}>
              {getFieldDecorator('comment', {
                initialValue: comment || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="评论时间" {...formItemLayout}>
              {getFieldDecorator('createTime', {
                initialValue: createTime || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="评论人ID" {...formItemLayout}>
              {getFieldDecorator('commentatorUid', {
                initialValue: commentatorUid || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="评论人名称" {...formItemLayout}>
              {getFieldDecorator('commentatorName', {
                initialValue: commentatorName || '',
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

export default Form.create()(JobCommentsAddModal);
