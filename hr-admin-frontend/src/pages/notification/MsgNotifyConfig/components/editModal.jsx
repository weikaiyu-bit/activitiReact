import React, { Component } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

const m = new Map();
class MsgNotifyConfigEditModal extends Component {
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
    const { record } = this.props;
    this.setState({ actions: m.get(record.targetType) })
  };


  // 处理相同的动作
  handleActionTheSame = (rule, value, callback) => {
    const { actions } = this.state;
    const { record } = this.props;
    const fx = actions.findIndex(item => value === item.action);
    const fxx = (value === record.action);
    if (fx > -1 && !fxx) {
       callback('动作类型重复')
    } else {
      callback()
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  };

  /* ************************************************** */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) return;
      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
          createAt: record.createAt ?
            moment(record.createAt).format('YYYY-MM-DD  HH:mm:ss') : record.createAt,
        });
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /* ***************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const {
      msgTargetTypesModel: { data },
    } = this.props;
    const { appId, tenantId, targetType, action, reasonAction, notifyTmpl } = record;
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
                  validator: this.handleActionTheSame,
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
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(MsgNotifyConfigEditModal);
