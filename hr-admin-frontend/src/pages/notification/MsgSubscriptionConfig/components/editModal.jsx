import React, { Component } from 'react';
import { Modal, Form, Input, Switch, InputNumber, Select, Radio, message } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';

const FormItem = Form.Item;
const { Option } = Select;
const m = new Map();
class MsgSubscriptionConfigEditModal extends Component {
  state = {
    beforeShowButton: true,
    repeatShowButton: true,
    loadRepetitionPeriod: null,
    loadAheadTime: null,
    actions: [],
  };
  /* selectedRowKeys: [],
 filter: {},
 pageNumber: 1,
 pageSize: 10, */

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
  handleProvinceChange= value => {
    this.setState({ actions: m.get(value) })
  };

  /* ****************************************************************** */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
        onOk(record.id, {
          ...record,
          ...values,
        });
      }
    });
    this.cancelHandel();
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

// 重复
  handleRepetitionPeriod = value => {
    this.setState({ loadRepetitionPeriod: value })
  };

//  提前
  handleAheadTime = value => {
    this.setState({ loadAheadTime: value })
  }
  /* ********************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const {
      msgTargetTypesModel,
    } = this.props;
    const { repeatShowButton, beforeShowButton, actions } = this.state;
    const {
      appId,
      tenantId,
      targetType,
      action,
      subscriberUid,
      isRepeat,
      repetitionPeriod,
      isAhead,
      aheadTime,
    } = record;
    // console.log(isAhead ? JSON.parse(isAhead) : false);
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
            <FormItem label="重复提醒" {...formItemLayout}>
              {getFieldDecorator('isRepeat', {
                initialValue: isRepeat ? JSON.parse(isRepeat) : false,
                valuePropName: 'checked',
              })(<Switch onClick={() => this.onRepeatChange()} />)}
            </FormItem>
            <FormItem label="每隔" {...formItemLayout}>
              {getFieldDecorator('repetitionPeriod', {
                initialValue: Number(repetitionPeriod),
              })(
                <>
                  <InputNumber
                    min={1}
                    max={1440}
                    disabled={repeatShowButton}
                    value={this.state.loadRepetitionPeriod}
                    onChange={this.handleRepetitionPeriod}
                  />
                  <span> 分提醒</span>
                </>,
              )}
            </FormItem>
            <FormItem label="提前提醒" {...formItemLayout}>
              {getFieldDecorator('isAhead', {
                initialValue: isAhead ? JSON.parse(isAhead) : false,
                valuePropName: 'checked',
              })(<Switch onClick={() => this.onBeforeChange()} />)}
            </FormItem>
            <FormItem label="提前" {...formItemLayout}>
              {getFieldDecorator('aheadTime', {
                initialValue: aheadTime,
              })(
                <div>
                  <InputNumber min={1} max={10080} disabled={beforeShowButton}
                               onChange={this.handleAheadTime}
                               value={this.state.loadAheadTime} />
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

export default Form.create()(MsgSubscriptionConfigEditModal);
