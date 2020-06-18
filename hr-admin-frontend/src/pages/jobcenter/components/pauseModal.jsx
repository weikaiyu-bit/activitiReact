import React, { Component } from 'react';
import { Modal, Form, Row, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class pauseModal extends Component {
  onHandler = () => {
    const {
      onOk,
      onCancel,
      form: { validateFields },
    } = this.props;
    validateFields((error, values) => {
      if (error) return;
      onOk(values.reason, values.rescue);
      onCancel();
    });
  };

  render() {
    const {
      title,
      visible,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal title={title} visible={visible} onOk={this.onHandler} onCancel={onCancel} width={840}>
        <Form layout="horizontal" style={{ marginTop: 20 }}>
          <Row>
            <FormItem label="未完成原因" {...formItemLayout}>
              {getFieldDecorator('reason', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '未完成原因不能为空！',
                  },
                ],
              })(<TextArea rows={4} />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem label="补救措施" {...formItemLayout}>
              {getFieldDecorator('rescue', {
                initialValue: '',
              })(<TextArea rows={4} />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
