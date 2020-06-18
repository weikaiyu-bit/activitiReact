/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Radio, AutoComplete } from 'antd';

const FormItem = Form.Item;
const { Option } = AutoComplete;

class BamTentantsEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    result: [],
  };

  /** ********************************************************************************************* */

  okHandler = e => {
    e.preventDefault();
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
        });
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSearch = value => {
    let result;
    if (!value || value.indexOf('@') >= 0) {
      result = [];
    } else {
      result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
    this.setState({ result });
  };

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record } = this.props;
    const { result } = this.state;
    const children = result.map(email => <Option key={email}>{email}</Option>);
    const {
      id,
      tentantName,
      country,
      province,
      city,
      address,
      contacts,
      phone,
      email,
      status,
      remark,
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

    return (
      <>
        <Modal
          title={title}
          width={720}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
          maskClosable={false}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            {getFieldDecorator('id', {
              initialValue: id || '',
            })(<Input type="hidden" />)}
            <FormItem label="租户名称" {...formItemLayout}>
              {getFieldDecorator('tentantName', {
                initialValue: tentantName || '',
                rules: [
                  {
                    required: true,
                    message: '租户名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="所在国家" {...formItemLayout}>
              {getFieldDecorator('country', {
                initialValue: country || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="所在州省" {...formItemLayout}>
              {getFieldDecorator('province', {
                initialValue: province || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="所在城市" {...formItemLayout}>
              {getFieldDecorator('city', {
                initialValue: city || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="所在地址" {...formItemLayout}>
              {getFieldDecorator('address', {
                initialValue: address || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="联系人" {...formItemLayout}>
              {getFieldDecorator('contacts', {
                initialValue: contacts || '',
                rules: [
                  {
                    required: true,
                    message: '联系人不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="联系电话" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: phone || '',
                rules: [
                  {
                    required: true,
                    message: '联系电话不能为空',
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: '请输入数字',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="电子邮箱" {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: email || '',
              })(<AutoComplete onSearch={this.handleSearch}>{children}</AutoComplete>)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || '',
              })(
                <Radio.Group>
                  <Radio value="ENABLED">启用</Radio>
                  <Radio value="DISABLE">停用</Radio>
                  <Radio value="IN_REVIEW">审核中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(<Input />)}
            </FormItem>
            {/* <FormItem label="更新日期" {...formItemLayout}>
              {
                getFieldDecorator('updateTime', {
                  initialValue: updateTime || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="更新人id" {...formItemLayout}>
              {
                getFieldDecorator('updatorId', {
                  initialValue: updatorId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="创建时间" {...formItemLayout}>
              {
                getFieldDecorator('createTime', {
                  initialValue: createTime || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="创建人id" {...formItemLayout}>
              {
                getFieldDecorator('creatorId', {
                  initialValue: creatorId || '',
                })(<Input />)
              }
            </FormItem> */}
            {getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BamTentantsEditModal);
