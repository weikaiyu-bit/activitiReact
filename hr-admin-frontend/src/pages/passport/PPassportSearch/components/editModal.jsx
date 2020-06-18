import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class PPassportSearchEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /* ********************************************************************************************** */

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

  /* ******************************************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const { id, fileId, name, type, receive, receiveId,
      receiveOrg, receiveOrgId, state, keeper, approval,
      approvalTime, remark, creatorId, creator, createTime, } = record
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
            <FormItem label="档案Id" {...formItemLayout}>
              {
                getFieldDecorator('fileId', {
                  initialValue: fileId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件名称" {...formItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: name || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件类型" {...formItemLayout}>
              {
                getFieldDecorator('type', {
                  initialValue: type || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件领用人" {...formItemLayout}>
              {
                getFieldDecorator('receive', {
                  initialValue: receive || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件领用人ID" {...formItemLayout}>
              {
                getFieldDecorator('receiveId', {
                  initialValue: receiveId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件领用人所在单位" {...formItemLayout}>
              {
                getFieldDecorator('receiveOrg', {
                  initialValue: receiveOrg || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件领用人所在单位ID" {...formItemLayout}>
              {
                getFieldDecorator('receiveOrgId', {
                  initialValue: receiveOrgId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件状态" {...formItemLayout}>
              {
                getFieldDecorator('state', {
                  initialValue: state || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件保管人" {...formItemLayout}>
              {
                getFieldDecorator('keeper', {
                  initialValue: keeper || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件审核人" {...formItemLayout}>
              {
                getFieldDecorator('approval', {
                  initialValue: approval || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="出入境证件审核时间" {...formItemLayout}>
              {
                getFieldDecorator('approvalTime', {
                  initialValue: approvalTime || '',
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
            <FormItem label="创建人id" {...formItemLayout}>
              {
                getFieldDecorator('creatorId', {
                  initialValue: creatorId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="创建人" {...formItemLayout}>
              {
                getFieldDecorator('creator', {
                  initialValue: creator || '',
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

export default Form.create()(PPassportSearchEditModal);
