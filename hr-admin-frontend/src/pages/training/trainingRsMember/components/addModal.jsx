/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class TrainingRsMemberAddModal extends Component {
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
    const { id, planId, fileId, orgId, rsOrgId, name, sex, national, positionName, level, rank, resume, photoUrl, pyCode, sortNo, state } = record;
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
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(TrainingRsMemberAddModal);
