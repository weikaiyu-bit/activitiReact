import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';


const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ msgTargetTypesModel, loading }) => ({
  msgTargetTypesModel,
  loading: loading.models.fetch,
}))
class TargetTypesAddModal extends Component {
  msgTargetTypesModelName='msgTargetTypesModel';

  componentDidMount() {
    // 查找全部
    this.findAll();
  }

  findAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.msgTargetTypesModelName}/findAll`,
      payload: {},
    });
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
    onClose(false);
  };

  // 处理相同的目标类型
  handleTargetTypeTheSame = (rule, value, callback) => {
    const {
      msgTargetTypesModel: { data },
    } = this.props;
    console.log(data)
    const fx = data.findIndex(item => value === item.targetType)
    if (fx > -1) {
      callback(`目标类型一致！: ${value}`)
    } else {
      callback()
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  }

  
  render() {
    const { title, visible, record } = this.props;
    const { targetType, remark } = record;
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
            <FormItem label="目标类型" {...formItemLayout}>
              {getFieldDecorator('targetType', {
                initialValue: targetType || '',
                rules: [{
                  required: true, message: '目标类型不能为空',
                }, {
                  validator: this.handleTargetTypeTheSame.bind(this),
                }],
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea rows={7} />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(TargetTypesAddModal);
