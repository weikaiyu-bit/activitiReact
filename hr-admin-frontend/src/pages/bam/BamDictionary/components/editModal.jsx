/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class BamDictionaryEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
          updateTime: values.updateTime
            ? moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : values.updateTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /** ******************************************************************************************** */

  render() {
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
                initialValue: dictName || '',
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
                initialValue: record === undefined ? '' : record.nodeType,
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
                initialValue: remark || '',
              })(<Input />)}
            </FormItem>
            {getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BamDictionaryEditModal);
