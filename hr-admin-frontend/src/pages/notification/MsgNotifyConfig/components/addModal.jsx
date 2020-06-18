import React, { Component } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const m = new Map();
class MsgNotifyConfigAddModal extends Component {
  state = {
    selectType: [],
    actions: [],
  }

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
  };

  // 处理相同的动作
  handleActionTheSame = (rule, value, callback) => {
    const { values } = this.props;
    const { children } = values;
    const fx = children.findIndex(item => value === item.action);
    if (fx > -1) {
      callback(`动作类型一致！: ${value}`)
    } else {
      callback()
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  }

  // 类型联动查询
  handleProvinceChange= value => {
    this.setState({ actions: m.get(value) })
  }

  okHandler = () => {
    const { onOk, record, value } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, { ...values, targetType: value.targetType });
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
    const { action, reasonAction, notifyTmpl } = record;
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
            <FormItem label="关联动作" {...formItemLayout}>
              {getFieldDecorator('action', {
                initialValue: action || '',
                validateTrigger: ['onChange', 'onSubmit'],
                rules: [{
                  required: true, message: '关联动作不能为空',
                }, {
                  validator: this.handleActionTheSame.bind(this),
                }],
              })(<Input />)}
            </FormItem>
            <FormItem label="订阅事件" {...formItemLayout}>
              {getFieldDecorator('reasonAction', {
                initialValue: reasonAction || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="消息模板" {...formItemLayout}>
              {getFieldDecorator('notifyTmpl', {
                initialValue: notifyTmpl || '',
              })(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(MsgNotifyConfigAddModal);
