import React, { Component } from 'react';
import {Modal, Form, Input, Select, Icon, Divider} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { option } = Select;

class SysFunctionsAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // previewVisible: false,
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
    const { visible, title, record } = this.props;
    const {
      functionName,
      icon,
      auth,
      routing,
      remark,
      tag,
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
            <FormItem label="功能类型"{...formItemLayout}>
              {getFieldDecorator('functionType')(
                <Select placeholder="请选择"
                        style={{ width: '200px' }}
                >
                  <Option value="FUNC">
                    功能
                  </Option>
                  <Option value="MENU">
                    菜单
                  </Option>
                  <Option value="DIR">
                    目录
                  </Option>
                  <Option value="">页面元素</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="功能名称" {...formItemLayout}>
              {getFieldDecorator('functionName', {
                initialValue: functionName || '',
                rules: [
                  {
                    required: true,
                    message: '功能名称不能为空',
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '长度为1到10个字',
                  },
                ],
              })(<Input
                placeholder="请输入功能名称"/>)}
            </FormItem>
            <FormItem label="图标" {...formItemLayout}>
              {getFieldDecorator('icon', {
                initialValue: icon || '',
              })(
                <Select placeholder="请选择你需要的图标"
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, options) =>
                  options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="user"><Icon type="user" /> <Divider type="vertical" />账号标记</Option>
                <Option value="team"><Icon type="team" /> <Divider type="vertical" />角色标记</Option>
                  <Option value="menu"><Icon type="menu" /> <Divider type="vertical" />菜单标记</Option>
                  <Option value="apartment"><Icon type="apartment" /> <Divider type="vertical" />组织标记</Option>
                  <Option value="solution"><Icon type="solution" /> <Divider type="vertical" />岗位标记</Option>
                <Option value="warning"><Icon type="warning" theme="twoTone" /> <Divider type="vertical" />慎重标记</Option>
                  <Option value="star"><Icon type="star" theme="twoTone" /> <Divider type="vertical" />星号标记</Option>
                  <Option value="check-circle"><Icon type="check-circle" theme="twoTone" /> <Divider type="vertical" />确认标记</Option>
                  <Option value="exclamation-circle"><Icon type="exclamation-circle" theme="twoTone" /> <Divider type="vertical" />注意标记</Option>
                  <Option value="fire"><Icon type="fire" theme="twoTone" /> <Divider type="vertical" />火热标记</Option>
                  <Option value="like"><Icon type="like" theme="twoTone" /> <Divider type="vertical" />点赞标记</Option>
                  <Option value="question-circle"><Icon type="question-circle" theme="twoTone" /> <Divider type="vertical" />其他标记</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="授权标识" {...formItemLayout}>
              {getFieldDecorator('auth', {
                initialValue: auth || '',
              })(<Input
                placeholder="请输入授权标识"/>)}
            </FormItem>
            <FormItem label="路由" {...formItemLayout}>
              {getFieldDecorator('routing', {
                initialValue: routing || '',
              })(<Input
                placeholder="请输入路由"/>)}
            </FormItem>
            <FormItem label="标签" {...formItemLayout}>
              {getFieldDecorator('tag', {
                initialValue: tag || '',
              })(<Input
                placeholder="请输入标签"/>)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea
                placeholder="请输入备注"
                rows={4} />)}
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

export default Form.create()(SysFunctionsAddModal);
