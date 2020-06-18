/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio, AutoComplete } from 'antd';

const { Option } = AutoComplete;
const FormItem = Form.Item;
const { TextArea } = Input;

class BamTentantsAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      result: [],
    };
  }

  componentDidMount() {
    const {
      form: { setFieldsValue, getFieldsValue },
    } = this.props;
    setFieldsValue({ status: 'ENABLED' }); // 第一次进页面设置status的默认选中项为ENABLED
    getFieldsValue();
  }

  okHandler = (e, msg) => {
    e.preventDefault();
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
        });
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSearch = value => {
    let result;
    if (!value || value.indexOf('@') >= 0) {
      result = [];
    } else {
      result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
    this.setState({ result });
  };

  render() {
    const { title, visible, record } = this.props;
    const { result } = this.state;
    const children = result.map(email => <Option key={email}>{email}</Option>);
    const {
      id,
      tentantName,
      country,
      province,
      city,
      address,
      contacts,
      phone,
      email,
      status,
      remark,
      updateTime,
      updatorId,
      createTime,
      creatorId,
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
            <FormItem label="租户名称" {...formItemLayout}>
              {getFieldDecorator('tentantName', {
                initialValue: tentantName || '',
                rules: [
                  {
                    required: true,
                    message: '租户名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="所在国家" {...formItemLayout}>
              {getFieldDecorator('country', {
                initialValue: country || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="所在州省" {...formItemLayout}>
              {getFieldDecorator('province', {
                initialValue: province || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="所在城市" {...formItemLayout}>
              {getFieldDecorator('city', {
                initialValue: city || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="所在地址" {...formItemLayout}>
              {getFieldDecorator('address', {
                initialValue: address || '',
                rules: [
                  {
                    required: true,
                    message: '租户名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="联系人" {...formItemLayout}>
              {getFieldDecorator('contacts', {
                initialValue: contacts || '',
                rules: [
                  {
                    required: true,
                    message: '联系人不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="联系电话" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: phone || '',
                rules: [
                  {
                    required: true,
                    message: '联系电话不能为空',
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: '请输入数字',
                  },
                ],
                // 下面这个函数可以直接把其他字符过滤掉，无法输入到上面
                // getValueFromEvent: event => event.target.value.replace(/\D/g, ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="电子邮箱" {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: email || '',
              })(<AutoComplete onSearch={this.handleSearch}>{children}</AutoComplete>)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || '',
              })(
                <Radio.Group>
                  <Radio value="ENABLED" defaultChecked>
                    启用
                  </Radio>
                  <Radio value="DISABLE">停用</Radio>
                  <Radio value="IN_REVIEW">审核中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea />)}
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

export default Form.create()(BamTentantsAddModal);
