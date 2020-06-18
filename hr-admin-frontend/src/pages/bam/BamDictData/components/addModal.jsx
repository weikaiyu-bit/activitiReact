/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class BamDictDataAddModal extends Component {
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
    const { title, visible, record, dictData } = this.props;
    const {
      id,
      pid,
      tenantId,
      nodeType,
      dataName,
      dataValue,
      tags,
      remark,
      sortNo,
      updateTime,
      updatorId,
      createTime,
      creatorId,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    console.log('dictData', dictData);
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
            <FormItem label="数据名称" {...formItemLayout}>
              {getFieldDecorator('dataName', {
                initialValue: dataName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="数据值" {...formItemLayout}>
              {getFieldDecorator('dataValue', {
                initialValue: dataValue || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="数据标签" {...formItemLayout}>
              {getFieldDecorator('tags', {
                initialValue: tags || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="节点类型" {...formItemLayout}>
              {getFieldDecorator('nodeType', {
                initialValue: nodeType || '',
              })(
                <Radio.Group>
                  <Radio value="category">类别</Radio>
                  <Radio value="data">数据</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sortNo', {
                initialValue: sortNo || '',
                // rules: [
                //   {
                //     required: true,
                //     message: '联系电话不能为空',
                //   }, {
                //     pattern: /^[0-9]+$/,
                //     message: '请输入数字',
                //   },
                // ],
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<TextArea />)}
            </FormItem>
            {getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)}
            {getFieldDecorator('pid', {
              initialValue: record.pid || '',
            })(<Input type="hidden" />)}
            {getFieldDecorator('tenantId', {
              initialValue: record.tenantId || '',
            })(<Input type="hidden" />)}
            {getFieldDecorator('dataId', {
              // initialValue: dictData ? dictData.id : record.dataId || 0,
              initialValue: dictData && dictData.dataId == 0 ? dictData.id : record.dataId || 0,
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BamDictDataAddModal);
