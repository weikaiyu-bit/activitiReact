import React, { useState, useRef } from 'react';

// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Popconfirm, Input, Row, Col, Drawer, Button, Form, Divider } from 'antd';
import ProTable from '@ant-design/pro-table';
import AddEquipment from './addEquipment'

const FormItem = Form.Item;

export default props => {
  const { title, visible, record } = props;
  const {
    id,
    budgetId,
    status,
    budgetType,
    budgetYear,
    hospitalDistrictCode,
    hospitalDistrictName,
    departmentCode,
    departmentName,
    remarks,
    amountTotal,
    priceUnit,
  } = record;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  const [form] = Form.useForm();
  React.useEffect(() => {
    form.setFieldsValue({
      id,
      budgetId,
      status,
      budgetType,
      budgetYear,
      hospitalDistrictCode,
      hospitalDistrictName,
      departmentCode,
      departmentName,
      remarks,
      amountTotal,
    });
  }, []);

  const ActionType = {
    reload: () => { },
    fetchMore: () => { },
    reset: () => { },
  }

  const assestRef = useRef(ActionType);
  const fileRef = useRef(ActionType);

  const [assetsState, setAssetsState] = useState([])

  const [addEquipmentData, setAddEquipmentData] = useState(
    {
      visible: false,
      record: {},
    },
  )

  const hideAddEquipmentModal = () => {
    setAddEquipmentData(
      {
        visible: false,
        record: {},
      },
    )
  }

  const showAddEquipmentModal = () => {
    setAddEquipmentData(
      {
        visible: true,
        record: {},
        assetsState,
        setAssetsState,
        onClose: hideAddEquipmentModal,
        FormItem,
        title: '新增设备',
        current: assestRef.current,
      },
    )
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '设备名称',
      dataIndex: 'assets',
      valueType: 'text',
    },
    {
      title: '设备型号',
      dataIndex: 'assetsSpecs',
      valueType: 'text',
    },
    {
      title: '数量',
      dataIndex: 'assetsNumber',
      valueType: 'text',
    },
    {
      title: '单价',
      dataIndex: 'assetsUnivalence',
      valueType: 'text',
    },
    {
      title: '单位',
      dataIndex: 'priceUnit',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      render: (text, record) => (
        <>
          <Popconfirm title="您确认删除附件吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  const columnsFile = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      valueType: 'text',
    },
    {
      title: '提交人',
      dataIndex: 'submitterName',
      valueType: 'text',
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      render: (text, record) => (
        <>
          <Popconfirm title="您确认删除附件吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const okHandler = () => {
    form.validateFields().then(values => {
      console.log('values', values)
    });
  };


  const cancelHandel = () => {
    const { onClose } = props;
    onClose();
  };

  return (
    <>
      <Drawer
        width="50%"
        visible={visible}
        onClose={cancelHandel}
        title={title}
        footer={
          <Row>
            <Col span={12}>
              {`金额合计${amountTotal || (0)}${priceUnit}`}
            </Col>
            <Col span={12}>
              <Button type="primary" style={{ float: 'right' }} onClick={okHandler}>提交</Button>
            </Col>
          </Row>
        }
      >
        <span style={{ fontWeight: 'bold' }}>基本信息：</span>
        <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
        <Form horizontal="true" onFinish={okHandler} form={form} >
          <Row>
            <Col span={12}>
              <FormItem name="budgetId" label="申请编号" {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="budgetType" label="合同编号" {...{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem name="budgetYear" label="验收人" {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="departmentName" label="预定验收时间" {...{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem name="status" label="状态" {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="hospitalDistrictName" label="实际验收时间" {...{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem name="remarks" label="备注" {...{ labelCol: { span: 2 }, wrapperCol: { span: 20 } }}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <span style={{ fontWeight: 'bold' }}>设备列表：</span>
            </Col>
            <Col span={4} offset={15}>
              <a style={{ float: 'right' }} onClick={() => showAddEquipmentModal()}>添加设备</a>
            </Col>
          </Row>
          <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
        </Form>
        <ProTable
          size="small"
          columns={columns}
          request={() => ({ data: assetsState })}
          onLoad={() => console.log('onload', { data: assetsState })}
          rowKey="id"
          toolBarRender={false}
          pagination={false}
          search={false}
          actionRef={assestRef}
        />
        <Row style={{ marginTop: 12 }}>
          <Col span={5}>
            <span style={{ fontWeight: 'bold' }}>附件信息：</span>
          </Col>
          <Col span={4} offset={15}>
            <a style={{ float: 'right' }}>本地上传</a>
          </Col>
        </Row>
        <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
        <ProTable
          size="small"
          columns={columnsFile}
          rowKey="id"
          toolBarRender={false}
          pagination={false}
          search={false}
          actionRef={fileRef}
        />
      </Drawer>
      {addEquipmentData.visible && <AddEquipment {...addEquipmentData} />}
    </>
  )
}
