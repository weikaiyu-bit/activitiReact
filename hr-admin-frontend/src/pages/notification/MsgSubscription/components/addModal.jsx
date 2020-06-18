import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, Radio } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';

const FormItem = Form.Item;
const { Option } = Select;
const m = new Map();
class MsgSubscriptionAddModal extends Component {
  state = {
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


  // 类型联动查询
  handleProvinceChange= value => {
    this.setState({ actions: m.get(value) })
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
    const { title, visible, record } = this.props;
    const { actions } = this.state;
    const {
      msgTargetTypesModel
    } = this.props;
    const { appId, tenantId, targetId, targetType, action, subscriberUid } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { treeData } = msgTargetTypesModel;
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
            <FormItem label="目标id" {...formItemLayout}>
              {getFieldDecorator('targetId', {
                initialValue: targetId || '',
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
            <FormItem label="订阅用户" {...formItemLayout}>
              {getFieldDecorator('subscriberUid', {
                initialValue: subscriberUid || '',
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(MsgSubscriptionAddModal);
