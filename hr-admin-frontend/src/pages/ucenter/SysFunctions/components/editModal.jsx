import React, { Component } from 'react';
import { Modal, Form, Input, Select, Icon, Divider, Radio } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class SysFunctionsEditModal extends Component {
  constructor(props) {
    super(props);
    const {
      record: { functionType = true },
    } = props;
    this.state = {
      menuForm: functionType,
    };
  }

  okHandler = () => {
    const {
      onOk,
      record: { id },
      pid = 0,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(id, { pid, id, ...values });
        this.hideModel();
      }
    });
  };

  hideModel = () => {
    const { onClose } = this.props;
    onClose();
  };

  toggleForm = e => {
    this.setState({
      menuForm: e.currentTarget.value,
    });
  };

  renderMenuForm() {
    const { visible, title, record } = this.props;
    const { functionType, functionName, enable, icon, uri, auth, sortNo, remark } = record;
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
          onCancel={this.hideModel}
          maskClosable={false}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="功能类型" {...formItemLayout}>
              {getFieldDecorator('functionType', {
                initialValue: functionType || '',
                rules: [
                  {
                    required: true,
                    message: '功能类型不能为空',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="MENU">菜单</Radio>
                  <Radio value="API" onClick={this.toggleForm}>
                    按钮/API
                  </Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('functionName', {
                initialValue: functionName || '',
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '长度为1到10个字',
                  },
                ],
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
            <FormItem label="显示" {...formItemLayout}>
              {getFieldDecorator('enable', {
                initialValue: `${enable}`,
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="菜单图标" {...formItemLayout}>
              {getFieldDecorator('icon', {
                initialValue: icon || '',
              })(
                <Select
                  placeholder="请选择你需要的图标"
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  filterOption={(input, options) =>
                    options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">无</Option>
                  <Option value="dashboard">
                    <Icon type="dashboard" /> <Divider type="vertical" />
                    工作台
                  </Option>
                  <Option value="user">
                    <Icon type="user" /> <Divider type="vertical" />
                    账号
                  </Option>
                  <Option value="team">
                    <Icon type="team" /> <Divider type="vertical" />
                    角色
                  </Option>
                  <Option value="menu">
                    <Icon type="menu" /> <Divider type="vertical" />
                    菜单
                  </Option>
                  <Option value="apartment">
                    <Icon type="apartment" /> <Divider type="vertical" />
                    组织
                  </Option>
                  <Option value="solution">
                    <Icon type="solution" /> <Divider type="vertical" />
                    岗位
                  </Option>
                  <Option value="warning">
                    <Icon type="warning" theme="twoTone" /> <Divider type="vertical" />
                    慎重
                  </Option>
                  <Option value="star">
                    <Icon type="star" theme="twoTone" /> <Divider type="vertical" />
                    星号
                  </Option>
                  <Option value="check-circle">
                    <Icon type="check-circle" theme="twoTone" /> <Divider type="vertical" />
                    确认
                  </Option>
                  <Option value="exclamation-circle">
                    <Icon type="exclamation-circle" theme="twoTone" /> <Divider type="vertical" />
                    注意
                  </Option>
                  <Option value="fire">
                    <Icon type="fire" theme="twoTone" /> <Divider type="vertical" />
                    火热
                  </Option>
                  <Option value="like">
                    <Icon type="like" theme="twoTone" /> <Divider type="vertical" />
                    点赞
                  </Option>
                  <Option value="question-circle">
                    <Icon type="question-circle" theme="twoTone" /> <Divider type="vertical" />
                    其他
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="菜单路由" {...formItemLayout}>
              {getFieldDecorator('uri', {
                initialValue: uri || '',
                rules: [
                  {
                    required: true,
                    message: '菜单路由不能为空',
                  },
                ],
              })(<Input placeholder="请输入路由" />)}
            </FormItem>
            <FormItem label="授权标识" {...formItemLayout}>
              {getFieldDecorator('auth', {
                initialValue: auth || '',
              })(<Input placeholder="请输入授权标识" />)}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sortNo', {
                initialValue: sortNo,
              })(<Input placeholder="排序" />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea placeholder="备注" rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }

  renderApiForm() {
    const { visible, title, record } = this.props;
    const { functionType, functionName, uri, auth, sortNo, remark } = record;
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
          onCancel={this.hideModel}
          maskClosable={false}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="功能类型" {...formItemLayout}>
              {getFieldDecorator('functionType', {
                initialValue: functionType || '',
                rules: [
                  {
                    required: true,
                    message: '功能类型不能为空',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="MENU" onClick={this.toggleForm}>
                    菜单
                  </Radio>
                  <Radio value="API">按钮/API</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('functionName', {
                initialValue: functionName || '',
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '长度为1到10个字',
                  },
                ],
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
            <FormItem label="API接口" {...formItemLayout}>
              {getFieldDecorator('uri', {
                initialValue: uri || '',
                rules: [
                  {
                    required: true,
                    message: 'API接口不能为空',
                  },
                ],
              })(<Input placeholder="请输入API接口" />)}
            </FormItem>
            <FormItem label="授权标识" {...formItemLayout}>
              {getFieldDecorator('auth', {
                initialValue: auth || '',
              })(<Input placeholder="请输入授权标识" />)}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sortNo', {
                initialValue: sortNo,
              })(<Input placeholder="排序" />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea placeholder="备注" rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }

  render() {
    const { menuForm } = this.state;
    switch (menuForm) {
      case 'MENU':
        return this.renderMenuForm();
      case 'API':
        return this.renderApiForm();
      default:
        return this.renderMenuForm();
    }
  }
}

export default Form.create()(SysFunctionsEditModal);
