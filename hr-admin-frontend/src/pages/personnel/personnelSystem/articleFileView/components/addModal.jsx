/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class ArticleFileViewAddModal extends Component {
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
    const { id, tentantId, appId, articleTitle, pid, articleExplain, type, state, creatorId, creator, creatorTime } = record;
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
                getFieldDecorator('tentantId', {
                  initialValue: tentantId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="应用id" {...formItemLayout}>
              {
                getFieldDecorator('appId', {
                  initialValue: appId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文章制度标题" {...formItemLayout}>
              {
                getFieldDecorator('articleTitle', {
                  initialValue: articleTitle || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="父节点" {...formItemLayout}>
              {
                getFieldDecorator('pid', {
                  initialValue: pid || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="文章制度说明" {...formItemLayout}>
              {
                getFieldDecorator('articleExplain', {
                  initialValue: articleExplain || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="类型" {...formItemLayout}>
              {
                getFieldDecorator('type', {
                  initialValue: type || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {
                getFieldDecorator('state', {
                  initialValue: state || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="创建人ID" {...formItemLayout}>
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
                getFieldDecorator('creatorTime', {
                  initialValue: creatorTime || '',
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

export default Form.create()(ArticleFileViewAddModal);
