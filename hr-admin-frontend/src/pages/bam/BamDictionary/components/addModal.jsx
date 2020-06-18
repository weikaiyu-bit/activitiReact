/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class BamDictionaryAddModal extends Component {
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
        if (record) {
          onOk(record.id, {
            ...values,
            pid: record.id,
          });
        } else {
          values.pid = 0;
          onOk(record, values);
        }
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  renderAdvancedList() {
    const { title, visible, record, tentants } = this.props;
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
            <FormItem label="字典名称" {...formItemLayout}>
              {getFieldDecorator('dictName', {
                // initialValue: dictName || '',
                rules: [
                  {
                    required: true,
                    message: '字典名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="节点类型" {...formItemLayout}>
              {getFieldDecorator('nodeType', {
                initialValue: 'category',
              })(
                <Radio.Group disabled="true">
                  <Radio value="category">类别</Radio>
                  <Radio value="dictionary">字典</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="租户" {...formItemLayout}>
              {getFieldDecorator('tenantId', {
                // initialValue: record.tenantId || '',
              })(
                <Select placeholder="请选择" style={{ width: '300px' }}>
                  {tentants.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.tentantName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                // initialValue: remark || '',
              })(<TextArea />)}
            </FormItem>
            {getFieldDecorator('id', {
              // initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }

  renderSimpleList() {
    const { title, visible, record, tentants } = this.props;
    const { id, pid, appId, tenantId, dictName, remark, createTime, creatorId } = record;
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
            <FormItem label="字典名称" {...formItemLayout}>
              {getFieldDecorator('dictName', {
                // initialValue: dictName || '',
                rules: [
                  {
                    required: true,
                    message: '字典名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="节点类型" {...formItemLayout}>
              {getFieldDecorator('nodeType', {
                initialValue: record === undefined ? 'dictionary' : record.nodeType,
              })(
                <Radio.Group>
                  <Radio value="category">类别</Radio>
                  <Radio value="dictionary">字典</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="租户" {...formItemLayout}>
              {getFieldDecorator('tenantId', {
                initialValue: Number.parseInt(record.tenantId) || '',
              })(
                <Select placeholder="请选择" style={{ width: '300px' }}>
                  {tentants.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.tentantName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                // initialValue: remark || '',
              })(<TextArea />)}
            </FormItem>
            {getFieldDecorator('id', {
              // initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }

  render() {
    return this.props.record ? this.renderSimpleList() : this.renderAdvancedList();
  }
}

export default Form.create()(BamDictionaryAddModal);
