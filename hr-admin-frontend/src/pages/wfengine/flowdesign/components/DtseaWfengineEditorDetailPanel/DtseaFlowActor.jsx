import React, { Component } from 'react';
import {Modal, Form, Input, Radio, Switch, Select} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
class DtseaFlowActor extends Component {
  okHandler = () => {
    const { onOk, record, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
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
    const { title, visible, Nodes } = this.props;
    console.log(Nodes)
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
          <Form horizontal="true" onSubmit={this.okHandler} {...formItemLayout}>
            <FormItem label="流程启动者">
              {
                getFieldDecorator('flowName')(<Switch />)
              }
            </FormItem>
            <FormItem label="流程参数">
              <Input />
            </FormItem>
            <FormItem label="节点处理人">
              <Select placeholder="请选择节点处理人">
                {Nodes.map((item) => {
                   if (item.type === 'node') {
                     return <Option value={item.model.label} key={item.id} >
                       {item.model.label}</Option>
                  } return ''
                  },
                )}
              </Select>,
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(DtseaFlowActor);
