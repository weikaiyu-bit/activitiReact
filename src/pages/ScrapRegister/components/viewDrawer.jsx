import React, { useRef } from 'react';
import { Drawer, Row, Col, Divider, Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import '@ant-design/compatible/assets/index.css';

export default props => {
  const { data = {}, visible } = props;
  const { maintenance = {} } = data
  const columns = [
    {
      title: '维修单号',
      dataIndex: 'maintenanceId',
      valueType: 'text',
    },
    {
      title: '设备编号',
      dataIndex: 'equipmentId',
      valueType: 'text',
      render: text => <a>{text}</a>,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      valueType: 'text',
    },
    {
      title: '设备型号',
      dataIndex: 'equipmentModel',
      valueType: 'text',
    },
    {
      title: '保修截止期',
      dataIndex: 'assetSerialNumber',
      valueType: 'text',
    },
    {
      title: '报修科室',
      dataIndex: 'applicationDepartment',
      valueType: 'text',
    },
    {
      title: '报修人',
      dataIndex: 'repairerName',
      valueType: 'text',
    },
    {
      title: '报修时间',
      dataIndex: 'repairApplicationTime',
      valueType: 'text',
    },
    {
      title: '故障问题',
      dataIndex: 'faultProblem',
      valueType: 'text',
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      valueType: 'text',
    },
  ];
  const close = () => {
    const { onClose } = props;
    if (onClose) onClose();
  };

  const ActionType = {
    reload: () => { },
    fetchMore: () => { },
    reset: () => { },
  }

  const assestRef = useRef(ActionType);
  const fileRef = useRef(ActionType);
  assestRef.current.reload();
  fileRef.current.reload();
  return (
    <Drawer width="50%"
      visible={visible}
      onClose={close}
      title={data.title}
      footer={
        <Row>
          <Col span={12} offset={12}>
            <Button type="primary" style={{ float: 'right' }}>维修申请</Button>
          </Col>
        </Row>
      }
    >
      <span style={{ fontWeight: 'bold' }}>检修信息：</span>
      <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>维修类型: </span>
          <span>{data.maintenanceType}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>维修厂商: </span>
          <span>{data.maintenanceManufacturer}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>故障类型: </span>
          <span>{data.faultType}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>故障问题: </span>
          <span>{data.faultProblem}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>厂商报价: </span>
          <span>{data.manufacturerOffer}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>预计修复时间: </span>
          <span>{data.estimatedRepairTime}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>检修人: </span>
          <span>{data.maintenancePersonnelName}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>检修时间: </span>
          <span>{data.repairTime}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={24}>
          <span style={{ fontWeight: 'bold' }}>检修意见: </span>
          <span>{data.maintenanceOpinions}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={24}>
          <span style={{ fontWeight: 'bold' }}>故障描述: </span>
          <span>{data.faultDescription}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <span style={{ fontWeight: 'bold' }}>维修登记信息：</span>
      </Row>
      <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>报修科室: </span>
          <span>{maintenance.applicationDepartment}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>设备名称: </span>
          <span>{maintenance.equipmentName}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>设备编号: </span>
          <span>{maintenance.equipmentId}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>设备型号: </span>
          <span>{maintenance.equipmentModel}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>设备类型: </span>
          <span>{maintenance.equipmentTypeName}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>保修截止期: </span>
          <span>{maintenance.warrantyExpirationDate}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>报修人: </span>
          <span>{maintenance.repairerName}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>抄送人: </span>
          <span>{maintenance.ccName}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>报修时间: </span>
          <span>{maintenance.repairApplicationTime}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>紧急程度: </span>
          <span>{maintenance.urgency}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={24}>
          <span style={{ fontWeight: 'bold' }}>故障问题: </span>
          <span>{maintenance.faultProblem}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={24}>
          <span style={{ fontWeight: 'bold' }}>故障描述: </span>
          <span>{maintenance.faultDescription}</span>
        </Col>
      </Row>
    </Drawer>
  );
}
