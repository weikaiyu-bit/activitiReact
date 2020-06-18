/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class ChgRecordEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...record,
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

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record } = this.props;
   const { id, tenantId, userId, fileId, personName, beforeOrgId, beforeOrgName, afterOrgId, afterOrgName, beforePosition, afterPosition, beforeRank, afterRank, chgReason, approvaStatus, approvalTime, rejectReason, chgStatus, remark, creatorId, creator, createTime, moveUnitRecord } = record
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
            <FormItem label="姓名" {...formItemLayout}>
              {
                getFieldDecorator('personName', {
                  initialValue: personName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动前单位" {...formItemLayout}>
              {
                getFieldDecorator('beforeOrgName', {
                  initialValue: beforeOrgName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动后单位" {...formItemLayout}>
              {
                getFieldDecorator('afterOrgName', {
                  initialValue: afterOrgName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动前职务" {...formItemLayout}>
              {
                getFieldDecorator('beforePosition', {
                  initialValue: beforePosition || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动后职务" {...formItemLayout}>
              {
                getFieldDecorator('afterPosition', {
                  initialValue: afterPosition || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动前职级" {...formItemLayout}>
              {
                getFieldDecorator('beforeRank', {
                  initialValue: beforeRank || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动后职级" {...formItemLayout}>
              {
                getFieldDecorator('afterRank', {
                  initialValue: afterRank || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动原因" {...formItemLayout}>
              {
                getFieldDecorator('chgReason', {
                  initialValue: chgReason || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="审批状态" {...formItemLayout}>
              {
                getFieldDecorator('approvaStatus', {
                  initialValue: approvaStatus || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="驳回原因" {...formItemLayout}>
              {
                getFieldDecorator('rejectReason', {
                  initialValue: rejectReason || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动状态" {...formItemLayout}>
              {
                getFieldDecorator('chgStatus', {
                  initialValue: chgStatus || '',
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
            <FormItem label="调动单位信息" {...formItemLayout}>
              {
                getFieldDecorator('moveUnitRecord', {
                  initialValue: moveUnitRecord || '',
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

export default Form.create()(ChgRecordEditModal);
