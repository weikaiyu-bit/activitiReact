import React, { Component } from 'react';
import {Modal, Form, Input, Select, Icon, Divider} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class SysFunctionsAddPidModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }

  showModel = e => {
    if (e) e.stopPropagation();
    this.setState({
      previewVisible: true,
    });
  };

  hideModel = () => {
    this.setState({
      previewVisible: false,
    });
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.hideModel();
      }
    });
  };

  render() {
    const { children, title, record } = this.props;
    const { id, pid } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    return (
      <>
        <span onClick={this.showModel}>{children}</span>
        <Modal
          title={title}
          width={700}
          visible={this.state.previewVisible}
          onOk={this.okHandler}
          onCancel={this.hideModel}
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
                initialValue: null || '',
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
                initialValue: null || '',
              })(
                <Select
                showSearch
                style={{ width: 200 }}
                placeholder="请选择你需要的图标"
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
                initialValue: null || '',
              })(<Input
                placeholder="请输入授权标识"/>)}
            </FormItem>
            <FormItem label="路由" {...formItemLayout}>
              {getFieldDecorator('routing', {
                initialValue: null || '',
              })(<Input
                placeholder="请输入路由"/>)}
            </FormItem>
            <FormItem label="标签" {...formItemLayout}>
              {getFieldDecorator('tag', {
                initialValue: null || '',
              })(<Input
                placeholder="请输入标签"/>)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: null || '',
              })(<TextArea
                placeholder="请输入备注"
                rows={4} />)}
            </FormItem>
            <FormItem type="hidden" {...formItemLayout}>
              {getFieldDecorator('pid', {
                initialValue: pid === undefined ? '' : id,
              })(<Input type="hidden" />)}
            </FormItem>
            <FormItem type="hidden" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: id === undefined ? '' : id,
              })(<Input type="hidden" />)}
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

export default Form.create()(SysFunctionsAddPidModal);
