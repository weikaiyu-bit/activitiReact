/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class ChgRecordAddModal extends Component {
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
    const { id, tenantId, userId, fileId, personName, beforeOrgId, beforeOrgName, afterOrgId, afterOrgName, beforePosition, afterPosition, beforeRank, afterRank, chgReason, approvaStatus, approvalTime, rejectReason, chgStatus, remark, creatorId, creator, createTime, moveUnitRecord } = record;
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
            <FormItem label="租户id" {...formItemLayout}>
              {
                getFieldDecorator('tenantId', {
                  initialValue: tenantId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="用户id" {...formItemLayout}>
              {
                getFieldDecorator('userId', {
                  initialValue: userId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="档案id" {...formItemLayout}>
              {
                getFieldDecorator('fileId', {
                  initialValue: fileId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="姓名" {...formItemLayout}>
              {
                getFieldDecorator('personName', {
                  initialValue: personName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="异动前单位id" {...formItemLayout}>
              {
                getFieldDecorator('beforeOrgId', {
                  initialValue: beforeOrgId || '',
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
            <FormItem label="异动后单位id" {...formItemLayout}>
              {
                getFieldDecorator('afterOrgId', {
                  initialValue: afterOrgId || '',
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
            <FormItem label="审批时间" {...formItemLayout}>
              {
                getFieldDecorator('approvalTime', {
                  initialValue: approvalTime || '',
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

export default Form.create()(ChgRecordAddModal);
