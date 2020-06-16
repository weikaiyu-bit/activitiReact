import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';

@connect(({ pfileFamilyRelationsModel, loading }) => ({
  pfileFamilyRelationsModel,
  loading,
}))
class ViewDrawer extends Component {
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  handleOk = () => {
    const { onCancel, dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      console.log('values', values);
      if (!err) {
        dispatch({
          type: 'pfileFamilyRelationsModel/add',
        });
      }
    });
    onCancel();
  };

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item label="请假名称" name="username">
            {getFieldDecorator('username', {})(<Input/>)}
          </Form.Item>

          <Form.Item label="请假天数" name="number">
            {getFieldDecorator('number', {})(<Input type="number" />)}
          </Form.Item>

          <Form.Item label="请假原因" name="describe">
            {getFieldDecorator('describe', {})(<Input/>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'ViewDrawer' })(ViewDrawer);
