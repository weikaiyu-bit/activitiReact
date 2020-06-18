/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModel = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModel = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    // console.log('onOk', onOk);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.hideModel();
      }
    });
  };

  render() {
    const { children, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      serverName,
      serverUrl,
      serverStatus,
      remake,
      createTime,
      serverPort,
    } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <span onClick={this.showModel}>{children}</span>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="服务器名称">
              {getFieldDecorator('serverName', {
                initialValue: serverName || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="服务器路径">
              {getFieldDecorator('serverUrl', {
                initialValue: serverUrl || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="服务器端口">
              {getFieldDecorator('serverPort', {
                initialValue: serverPort || '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="服务器状态">
              {getFieldDecorator('serverStatus', {
                initialValue: serverStatus || '',
              })(
                <Select>
                  <Option value="正常">正常</Option>
                  <Option value="宕机">宕机</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remake', {
                initialValue: remake || '',
              })(<Input />)}
            </FormItem>
            {getFieldDecorator('createTime', {
              initialValue: createTime || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(EditModal);
