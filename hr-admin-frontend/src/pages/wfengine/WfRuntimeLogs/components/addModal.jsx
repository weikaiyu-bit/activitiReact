import React, { Component } from 'react';
import { Modal, Form, Input  } from 'antd';

const FormItem = Form.Item;

class WfRuntimeLogsAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
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
    const {id, logId, runId, catgId, flowId, nodeId, activityNodeName, runtimeName, remark, entryTime, entryUid, exitTime, exitUid, } = record
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
            <FormItem label="id" {...formItemLayout}>
              {
                getFieldDecorator('id', {
                  initialValue: id || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="log_id" {...formItemLayout}>
              {
                getFieldDecorator('logId', {
                  initialValue: logId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="run_id" {...formItemLayout}>
              {
                getFieldDecorator('runId', {
                  initialValue: runId || '',
                })(<Input />)
              }
            </FormItem>
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
            <FormItem label="node_id" {...formItemLayout}>
              {
                getFieldDecorator('nodeId', {
                  initialValue: nodeId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="节点名称" {...formItemLayout}>
              {
                getFieldDecorator('activityNodeName', {
                  initialValue: activityNodeName || '',
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
            <FormItem label="备注" {...formItemLayout}>
              {
                getFieldDecorator('remark', {
                  initialValue: remark || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="进入时间" {...formItemLayout}>
              {
                getFieldDecorator('entryTime', {
                  initialValue: entryTime || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="进入更新人" {...formItemLayout}>
              {
                getFieldDecorator('entryUid', {
                  initialValue: entryUid || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="离开时间" {...formItemLayout}>
              {
                getFieldDecorator('exitTime', {
                  initialValue: exitTime || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="离开更新人" {...formItemLayout}>
              {
                getFieldDecorator('exitUid', {
                  initialValue: exitUid || '',
                })(<Input />)
              }
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

export default Form.create()(WfRuntimeLogsAddModal);
