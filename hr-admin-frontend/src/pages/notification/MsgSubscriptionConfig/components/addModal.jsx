import React, { Component } from 'react';
import { Modal, Form, Input, Select, Radio, Switch, InputNumber, message } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';

const FormItem = Form.Item;
const { Option } = Select;
const m = new Map();
class MsgSubscriptionConfigAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beforeShowButton: true,
      repeatShowButton: true,
      actions: [],
    };
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

  onRepeatChange = () => {
    const { repeatShowButton } = this.state;
    this.setState({
      repeatShowButton: !repeatShowButton,
    });
  };

  onBeforeChange = () => {
    const { beforeShowButton } = this.state;
    this.setState({
      beforeShowButton: !beforeShowButton,
    });
  };


  // 类型联动查询
  handleProvinceChange= value => {
    this.setState({ actions: m.get(value) })
  }


  render() {
    const { title, visible, record } = this.props;
    const {
      msgTargetTypesModel,
    } = this.props;
    const {
      targetType,
      action,
      appId,
      tenantId,
      subscriberUid,
      repetitionPeriod,
      aheadTime,
    } = record;
    const { repeatShowButton, beforeShowButton, actions } = this.state;
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
            <FormItem label="订阅用户" {...formItemLayout}>
              {getFieldDecorator('subscriberUid', {
                initialValue: subscriberUid || '',
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
            <FormItem label="重复提醒" {...formItemLayout}>
              {getFieldDecorator('isRepeat', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch onClick={() => this.onRepeatChange()} />)}
            </FormItem>
            <FormItem label="每隔" {...formItemLayout}>
              {getFieldDecorator('repetitionPeriod', {
                initialValue: repetitionPeriod || 5,
              })(
                <div>
                  <InputNumber min={1} max={1440} disabled={repeatShowButton} defaultValue={5} />
                  <span> 分提醒</span>
                </div>,
              )}
            </FormItem>
            <FormItem label="提前提醒" {...formItemLayout}>
              {getFieldDecorator('isAhead', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch onClick={() => this.onBeforeChange()} />)}
            </FormItem>
            <FormItem label="提前" {...formItemLayout}>
              {getFieldDecorator('aheadTime', {
                initialValue: aheadTime || 60,
              })(
                <div>
                  <InputNumber min={1} max={10080} disabled={beforeShowButton} defaultValue={60} />
                  <span> 分提醒</span>
                </div>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(MsgSubscriptionConfigAddModal);
