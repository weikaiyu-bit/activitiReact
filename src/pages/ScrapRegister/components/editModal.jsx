import React, { useState, useRef } from 'react';

// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Popconfirm, Input, Row, Col, Drawer, Checkbox, Button, Upload, Form, Divider, DatePicker, Select } from 'antd';
import ProTable from '@ant-design/pro-table';
import AddEquipment from './addEquipment'
const { TextArea } = Input;
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

  const fileList = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error',
    },
  ];

  const files = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    listType: 'picture',
    defaultFileList: [...fileList],
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
            <Col span={8} offset={4}>
              <Checkbox defaultChecked>同时发布到供应商平台</Checkbox>
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
              <FormItem name="maintenanceId" label="设备编号" {...formItemLayout}>
                <Select defaultValue="SIEMENS西门子" style={{ width: '100%' }} >
                  <Option value="SIEMENS西门子">SIEMENS西门子</Option>
                  <Option value="PHILIPS飞利浦医疗">PHILIPS飞利浦医疗</Option>
                  <Option value="迈瑞Mindray">迈瑞Mindray</Option>
                  <Option value="GE医疗">GE医疗</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="equipmentName" label="设备名称" {...formItemLayout}>
                <Select defaultValue="SIEMENS西门子" style={{ width: '100%' }} >
                  <Option value="SIEMENS西门子">SIEMENS西门子</Option>
                  <Option value="PHILIPS飞利浦医疗">PHILIPS飞利浦医疗</Option>
                  <Option value="迈瑞Mindray">迈瑞Mindray</Option>
                  <Option value="GE医疗">GE医疗</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem name="faultType" label="规格类型" {...formItemLayout}>
                <Select defaultValue="SIEMENS西门子" style={{ width: '100%' }} >
                  <Option value="SIEMENS西门子">SIEMENS西门子</Option>
                  <Option value="PHILIPS飞利浦医疗">PHILIPS飞利浦医疗</Option>
                  <Option value="迈瑞Mindray">迈瑞Mindray</Option>
                  <Option value="GE医疗">GE医疗</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="department" label="申请科室" {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem name="faultType" label="出厂编号" {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="department" label="生产厂家" {...formItemLayout}>
                <Select defaultValue="SIEMENS西门子" style={{ width: '100%' }} >
                  <Option value="SIEMENS西门子">SIEMENS西门子</Option>
                  <Option value="PHILIPS飞利浦医疗">PHILIPS飞利浦医疗</Option>
                  <Option value="迈瑞Mindray">迈瑞Mindray</Option>
                  <Option value="GE医疗">GE医疗</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem name="faultType" label="申请日期" {...formItemLayout}>
                <DatePicker style={{ width: '100%' }} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="department" label="申请人" {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem name="faultProblem" label="使用状况" {...{ labelCol: { span: 2 }, wrapperCol: { span: 20 } }}>
                <TextArea Row={4} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem name="faultProblem" label="报废原因" {...{ labelCol: { span: 2 }, wrapperCol: { span: 20 } }}>
                <TextArea Row={4} />
              </FormItem>
            </Col>
          </Row>
          <Upload {...files} className='upload-list-inline'>
            <Row style={{ marginTop: 12 }}>
              <Col span={5}>
                <span style={{ fontWeight: 'bold' }}>附件：</span>
              </Col>
              <Col span={4} offset={15}>
                <a style={{ float: 'right' }}>本地上传</a>
              </Col>
            </Row>
            <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
          </Upload>

          <Row style={{ marginTop: 12 }}>
            <Col span={24}>
              <span style={{ fontWeight: 'bold' }}>技术鉴定：</span>
              <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <table ></table>
            <Checkbox.Group style={{ width: '100%', lineHeight: '3.5715' }}>
              <div >
                <strong>维修鉴定情况：<br />
                  <p style={{ textIndent: '2em' }}>因设备满足以下情况，无法维修，建议报废：</p>
                </strong>
              </div>
              <Col span={24}>
                <Checkbox value="A"> 在满足医院规定国资科相关报废条款条件下，使用期限达到六年或以上。</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="B">发生不良事件，存在较大安全隐患。</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="C">发生不良事件，存在较大安全隐患。</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="D">硬件老化，发热过大，导致机器长时间工作下性能衰减，影响工作效率。</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="E">无法购买到维修配件。</Checkbox>
              </Col>
            </Checkbox.Group>,
              <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />

            <Col span={12}>
              <Form.Item label="鉴定人" {...formItemLayout}>
                <Input placeholder="请填写鉴定人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="鉴定日期" {...formItemLayout}>
                <DatePicker style={{ width: '100%' }} placeholder="请填写鉴定日期" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <FormItem name="faultProblem" label="鉴定意见" {...{ labelCol: { span: 2 }, wrapperCol: { span: 20 } }}>
                <TextArea Row={4} />
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Drawer>
      {addEquipmentData.visible && <AddEquipment {...addEquipmentData} />}
    </>
  )
}
