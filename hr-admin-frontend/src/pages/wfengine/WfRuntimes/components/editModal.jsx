import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;

class WfRuntimesEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /************************************************************************************************/

  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /************************************************************************************************/

  render() {
    const { title, visible, record } = this.props;
    const {id, runId, catgId, flowId, runtimeName, currentNodeId, status, trailJson, updateTime, updatorUid, } = record
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
          <FormItem label="catg_id" {...formItemLayout}>
            {
              getFieldDecorator('catgId', {
                initialValue: catgId || '',
              })(<Input />)
            }
          </FormItem>
          <FormItem label="flow_id" {...formItemLayout}>
            {
              getFieldDecorator('flowId', {
                initialValue: flowId || '',
              })(<Input />)
            }
          </FormItem>
          <FormItem label="实例名称" {...formItemLayout}>
            {
              getFieldDecorator('runtimeName', {
                initialValue: runtimeName || '',
              })(<Input />)
            }
          </FormItem>
          <FormItem label="当前节点" {...formItemLayout}>
            {
              getFieldDecorator('currentNodeId', {
                initialValue: currentNodeId || '',
              })(<Input />)
            }
          </FormItem>
          <FormItem label="实例状态" {...formItemLayout}>
            {
              getFieldDecorator('status', {
                initialValue: status || 'starting',
              })(
                <Radio.Group>
                  <Radio value='starting'>正在发起</Radio>
                  <Radio value='running'>运行中</Radio>
                  <Radio value='stopping'>已停止</Radio>
                  <Radio value='suspend'>暂停</Radio>
                </Radio.Group>
              )}
          </FormItem>
          {
            getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)
          }
        </Form>
      </Modal>
      </>
    );
  }
}

export default Form.create()(WfRuntimesEditModal);
