/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class TrainingRsMemberEditModal extends Component {
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
    const { id, planId, fileId, orgId, rsOrgId, name, sex, national, positionName, level, rank, resume, photoUrl, pyCode, sortNo, state } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <Modal
          title={title}
          width={960}
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
            <FormItem label="培训计划id" {...formItemLayout}>
              {
                getFieldDecorator('planId', {
                  initialValue: planId || '',
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
            <FormItem label="所在单位id" {...formItemLayout}>
              {
                getFieldDecorator('orgId', {
                  initialValue: orgId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="统计关系所在单位" {...formItemLayout}>
              {
                getFieldDecorator('rsOrgId', {
                  initialValue: rsOrgId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="姓名" {...formItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: name || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="性别" {...formItemLayout}>
              {
                getFieldDecorator('sex', {
                  initialValue: sex || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="民族" {...formItemLayout}>
              {
                getFieldDecorator('national', {
                  initialValue: national || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="职务名称" {...formItemLayout}>
              {
                getFieldDecorator('positionName', {
                  initialValue: positionName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="级别" {...formItemLayout}>
              {
                getFieldDecorator('level', {
                  initialValue: level || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="现职级" {...formItemLayout}>
              {
                getFieldDecorator('rank', {
                  initialValue: rank || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="简历" {...formItemLayout}>
              {
                getFieldDecorator('resume', {
                  initialValue: resume || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="照片" {...formItemLayout}>
              {
                getFieldDecorator('photoUrl', {
                  initialValue: photoUrl || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="拼音码" {...formItemLayout}>
              {
                getFieldDecorator('pyCode', {
                  initialValue: pyCode || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {
                getFieldDecorator('sortNo', {
                  initialValue: sortNo || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="培训状态" {...formItemLayout}>
              {
                getFieldDecorator('state', {
                  initialValue: state || '',
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

export default Form.create()(TrainingRsMemberEditModal);
