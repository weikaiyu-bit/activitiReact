import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Select, message, DatePicker } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const m = new Map();
class MsgNotifyAddModal extends Component {
  modelName = 'msgTargetTypesModel';

  msgNotifyConfigModelModeName = 'msgNotifyConfigModel';

  constructor(props) {
    super(props);
    this.state = {
      selectType: [],
      selectTypeValue: null,
      actions: [],
    };
  }

  componentDidMount () {
    const {
      msgTargetTypesModel,
    } = this.props;
    const { treeData } = msgTargetTypesModel;
    this.setTargetTypes(treeData);
  }

  setTargetTypes = values => {
    if (values !== undefined && values !== null) {
      for (let i = 0; i < values.length; i++) {
        m.set(values[i].targetType, values[i].children)
      }
    }
  };

  // 类型联动查询
  handleProvinceChange = value => {
    this.setState({ actions: m.get(value) })
  };

  handleRadioChange = e => {
    this.setState({ selectTypeValue: e.target.value })
  };

  okHandler = () => {
    const { onOk, record, currentUser } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.senderAt = values.senderAt ?
          moment(values.senderAt).format('YYYY-MM-DD 00:00:00') : values.senderAt;
        if (this.state.selectTypeValue) {
          values.action = this.state.selectTypeValue;
        }
        onOk(record.id, { ...values, senderId: currentUser.id, senderName: currentUser.name, senderAvatar: currentUser.avatar });
        this.cancelHandel();
      }
    });
  };


  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render () {
    const { title, visible, record } = this.props;
    const {
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
    const {
      msgTargetTypesModel: { data },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { selectType } = this.state;
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
          <Form horizontal="true" onSubmit={this.okHandler} >
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
              })(<TextArea />)}
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

export default Form.create()(MsgNotifyAddModal);
