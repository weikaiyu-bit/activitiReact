import React from 'react';
import { Modal, Input, Form } from 'antd';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

export default props => {
  const { title, visible, current, setAssetsState, assetsState, FormItem } = props;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();
  React.useEffect(() => {
    form.setFieldsValue({
      assets: '',
      assetsSpecs: '',
      assetsNumber: '',
      price_unit: '',
    });
  }, []);

  const cancelHandel = () => {
    const { onClose } = props;
    onClose();
  };

  const okHandler = () => {
    form.validateFields().then(values => {
      assetsState.push(values)
      setAssetsState(assetsState)
      current.reload()
      cancelHandel()
    });
  };


  return (
    <>
      <Modal
        title={title}
        width={620}
        visible={visible}
        onOk={okHandler}
        onCancel={cancelHandel}
      >
        <Form horizontal="true" onFinish={okHandler} form={form} >
          <FormItem name="assets" label="设备名称" {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name="assetsSpecs" label="设备型号" {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name="assetsNumber" label="数量" {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name="priceUnit" label="单价" {...formItemLayout}>
            <Input />
          </FormItem>

        </Form>
      </Modal>
    </>
  );
}
