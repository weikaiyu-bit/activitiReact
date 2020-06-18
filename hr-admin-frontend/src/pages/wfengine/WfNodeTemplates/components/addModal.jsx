import React, { Component } from 'react';
import { Modal, Form, Input, TreeSelect } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ wfWorkflowCategoriesModel }) => ({
  wfWorkflowCategoriesModel,
}))
class WfNodeTemplatesAddModal extends Component {
  wfWorkflowCategoriesModelName='wfWorkflowCategoriesModel';

  componentDidMount() {
    this.wfWorkflowCategoriesfindAll();
  }

  /* **************流程类别数据****************** */
  wfWorkflowCategoriesfindAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.wfWorkflowCategoriesModelName}/treeMenu`,
      payload: {},
    });
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
    const {
      wfWorkflowCategoriesModel: { treeData },
    } = this.props;
    const { title, visible, record } = this.props;
    const { templateName, pageUrl, catgId, remark } = record
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
            <FormItem label="模板名称" {...formItemLayout}>
            {
              getFieldDecorator('templateName', {
                initialValue: templateName || '',
              })(<Input />)
            }
          </FormItem>
          <FormItem label="流程类别" {...formItemLayout}>
            {getFieldDecorator('catgId', {
              initialValue: catgId,
            })(
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择"
              />,
            )}
          </FormItem>
            <FormItem label="关联表单" {...formItemLayout}>
              {
                getFieldDecorator('pageUrl', {
                  initialValue: pageUrl || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {
                getFieldDecorator('remark', {
                  initialValue: remark || '',
                })(<TextArea />)
              }
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(WfNodeTemplatesAddModal);
