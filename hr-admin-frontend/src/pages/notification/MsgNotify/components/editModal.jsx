import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const { Option } = Select;
const m = new Map();
class MsgNotifyEditModal extends Component {
  state = {
    actions: [],
  };

  /* ***************************** */
  componentDidMount() {
    const {
      msgTargetTypesModel,
    } = this.props;
    const { treeData } = msgTargetTypesModel;
    this.setTargetTypes(treeData);
  }

  setTargetTypes=values => {
    if (values !== undefined && values !== null) {
      for (let i = 0; i < values.length; i++) {
        m.set(values[i].targetType, values[i].children)
      }
    }
    const { record } = this.props;
    this.setState({ actions: m.get(record.targetType) })
  };

// 类型联动查询
  handleProvinceChange = value => {
    this.setState({ actions: m.get(value) })
  };

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
          createAt: record.createAt ?
            moment(record.createAt).format('YYYY-MM-DD  HH:mm:ss') : record.createAt,
          senderAt: record.senderAt ?
            moment(record.senderAt).format('YYYY-MM-DD  HH:mm:ss') : record.senderAt,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /* ********************************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const {
      id,
      appId,
      tenantId,
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
      senderAt,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const {
      msgTargetTypesModel,
    } = this.props;
    const { treeData } = msgTargetTypesModel;
    const { actions } = this.state;
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
            <FormItem label="消息类型" {...formItemLayout}>
              {getFieldDecorator('notifyType', {
                initialValue: notifyType || 'announce',
              })(
                <Radio.Group>
                  <Radio value="announce">通知</Radio>
                  <Radio value="remind">提醒</Radio>
                  <Radio value="message">消息</Radio>
                </Radio.Group>,
              )}
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
                initialValue: targetType,
              })(
                <Select placeholder="请选择" style={{ width: '150px' }} onChange={this.handleProvinceChange}>
                  {treeData.map(item => (
                    <Option value={item.targetType} key={item.id}>
                      {item.targetType}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="动作类型" {...formItemLayout}>
              {getFieldDecorator('action', {
                initialValue: action || '',
              })(
                <Radio.Group>
                  {
                    (actions !== null && actions !== undefined) ? (
                      Array.from(actions).map(item =>
                        <Radio key={item.id} value={item.action}
                        >{item.action}</Radio>)
                    ) : (null)
                  }
                </Radio.Group>,
              )}
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
                initialValue: senderType || 'SYSTEM',
              })(
                <Radio.Group>
                  <Radio value="SYSTEM">系统</Radio>
                  <Radio value="USER">用户</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(MsgNotifyEditModal);
