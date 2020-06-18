import React, { Component } from 'react';
import { Modal, Form, Input, Radio,Select } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
@connect(({ wfWorkflowCategoriesModel, loading }) => ({
  wfWorkflowCategoriesModel,
  loading: loading.models.fetch,
}))
class WfWorkflowCategoriesAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }

  okHandler = () => {
    const { onOk, record,data } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {...values,pid:data===undefined?(null):(data.id)});
        this.cancelHandel();
      }
    });
  };
  componentDidMount() {
    this.findAll();
  }
  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };
  findAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `wfWorkflowCategoriesModel/findAll`,
      payload: {
      },
    });
  };
  render() {
    const { title, visible, record,values } = this.props;
    const { id, catgId, pid, categoryName, flowType, remark } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <Modal
          title={title}
          width={720}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="类别名称" {...formItemLayout}>
              {
                getFieldDecorator('categoryName', {
                  initialValue: categoryName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="驱动类型" {...formItemLayout}>
              {
                getFieldDecorator('flowType', {
                  initialValue: 'manual',
                })(
                  <Radio.Group>
                    <Radio value='manual'>人工</Radio>
                    <Radio value='auto'>自动</Radio>
                  </Radio.Group>
                )}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {
                getFieldDecorator('remark', {
                  initialValue: remark || '',
                })(<TextArea />)
              }
            </FormItem>
            {
              getFieldDecorator('id', {
                initialValue: record.id || '',
              })(<Input type="hidden" />)
            }
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(WfWorkflowCategoriesAddModal);
