import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { TextArea } = Input;
class JobProjectCategoryEditModal extends Component {
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
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
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

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record } = this.props;
    const { id, pid, categoryName, remark } = record;
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
            <FormItem label="类别名称" {...formItemLayout}>
              {getFieldDecorator('categoryName', {
                initialValue: categoryName || '',
                rules: [
                  {
                    required: true,
                    message: '类别名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || '',
              })(
                <BraftEditor
                  media={{ uploadFn: this.uploadFn }}
                  style={{ border: '1px solid #E8E8E8' }}
                  contentStyle={{ height: 'auto', maxHeight: '600px', minHeight: '300px' }}
                  excludeControls={[
                    'undo',
                    'redo',
                    'separator',
                    'font-size',
                    'line-height',
                    'letter-spacing',
                    'separator',
                    'text-color',
                    'bold',
                    'italic',
                    'underline',
                    'strike-through',
                    'separator',
                    'superscript',
                    'subscript',
                    'remove-styles',
                    'separator',
                    'text-indent',
                    'text-align',
                    'separator',
                    'headings',
                    'list-ul',
                    'list-ol',
                    'blockquote',
                    'code',
                    'separator',
                    'link',
                    'separator',
                    'hr',
                    'separator',
                    'separator',
                    'clear',
                    'fullscreen',
                  ]}
                />,
              )}
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

export default Form.create()(JobProjectCategoryEditModal);
