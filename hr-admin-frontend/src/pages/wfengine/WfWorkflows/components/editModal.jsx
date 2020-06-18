import React, { Component } from 'react';
import { Modal, Form, Input, Radio, TreeSelect } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ wfWorkflowCategoriesModel }) => ({
  wfWorkflowCategoriesModel,
}))
class WfWorkflowsEditModal extends Component {
  /* **************************************************************** */

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
    const { onOk, record, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          createTime: record.createTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /* ************************************************************** */

  render() {
    const {
      wfWorkflowCategoriesModel,
    } = this.props;
    const { title, visible, record } = this.props;
   const { catgId, flowName, flowJson, beginNodeId, endNodeId, remark, pageUrl } = record
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
            <FormItem label="流程名称" {...formItemLayout}>
              {
                getFieldDecorator('flowName', {
                  initialValue: flowName || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="流程定义" {...formItemLayout}>
              {
                getFieldDecorator('flowJson', {
                  initialValue: flowJson || '',
                })(<TextArea rows={10} disabled="true"/>)
              }
            </FormItem>
            <FormItem label="驱动类型" {...formItemLayout}>
              {
                getFieldDecorator('flowType', {
                  initialValue: 'manual',
                })(
                  <Radio.Group>
                    <Radio value="manual">人工</Radio>
                    <Radio value="auto">自动</Radio>
                  </Radio.Group>,
                )}
            </FormItem>
            <FormItem label="流程类别" {...formItemLayout}>
              {getFieldDecorator('catgId', {
                initialValue: catgId,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={wfWorkflowCategoriesModel.treeData}
                  treeDefaultExpandAll
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
            <FormItem label="开始节点" {...formItemLayout}>
              {
                getFieldDecorator('beginNodeId', {
                  initialValue: beginNodeId || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="终止节点" {...formItemLayout}>
              {
                getFieldDecorator('endNodeId', {
                  initialValue: endNodeId || '',
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

export default Form.create()(WfWorkflowsEditModal);
