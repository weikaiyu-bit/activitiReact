import React, { Component } from 'react';
import { Modal, Form, Input, Select, Radio } from 'antd';
import Se from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Option } = Se.Select;
@connect(({ wfWorkflowCategoriesModel, loading }) => ({
  wfWorkflowCategoriesModel,
  loading: loading.models.fetch,
}))
class WfWorkflowCategoriesEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /************************************************************************************************/
  componentDidMount() {
    this.findAll();
  }
  findAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `wfWorkflowCategoriesModel/findAll`,
      payload: {
      },
    });
  };
  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      console.log(values)
      if (!err) {
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
        },{...record});
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /************************************************************************************************/

  render() {
    const { title, visible, record } = this.props;
    const {id, catgId, pid, categoryName, flowType, remark, } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const {
      wfWorkflowCategoriesModel: { data = [] },
    } = this.props;
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
          <FormItem label="pid" {...formItemLayout}>
            {
              getFieldDecorator('pid', {
                initialValue: pid || '',
              })(<Se.Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                 {data.map((item) =>
                  <Option value={item.id} key={item.id} >{item.categoryName}</Option>)
                }
              </Se.Select>,)
            }
          </FormItem>
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
      </>
    );
  }
}

export default Form.create()(WfWorkflowCategoriesEditModal);
