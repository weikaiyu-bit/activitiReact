import React, { useRef } from 'react';
import { Drawer, Row, Col, Divider } from 'antd';
import ProTable from '@ant-design/pro-table';
import '@ant-design/compatible/assets/index.css';
import { findFile } from '../../service'

export default props => {
  const { data = {}, visible } = props;
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
      render: text => <a>{text}</a>,
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
      title="预算申请"
      footer={
        <Row>
          <Col span={12}>
            {`金额合计${data.amountTotal || (0)}${data.priceUnit}`}
          </Col>
        </Row>
      }
    >
      <span style={{ fontWeight: 'bold' }}>基本信息：</span>
      <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>申请编号: </span>
          <span>{data.applyId}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>合同编号: </span>
          <span>{data.contractId}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>验收人: </span>
          <span>{data.accepterName}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>预定验收时间: </span>
          <span>{data.agreedAcceptanceTime}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>状态: </span>
          <span>{data.status}</span>
        </Col>
        <Col span={12}>
          <span style={{ fontWeight: 'bold' }}>实际验收时间: </span>
          <span>{data.acceptanceTime}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <span style={{ fontWeight: 'bold' }}>备注: </span>
        <span>{data.remarks}</span>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <span style={{ fontWeight: 'bold' }}>设备信息：</span>
      </Row>
      <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
      <ProTable
        size="small"
        columns={columns}
        request={() => ({ data: data.acceptanceDetailed })}
        rowKey="id"
        // params={{ keywords }}
        // toolBarRender={false}
        toolBarRender={false}
        pagination={false}
        search={false}
        actionRef={assestRef}
      />
      <Row style={{ marginTop: 12 }}>
        <span style={{ fontWeight: 'bold' }}>附件信息：</span>
      </Row>
      <Divider style={{ margin: '6px 0', borderTop: '1px solid #89a8d8' }} />
      <ProTable
        size="small"
        columns={columnsFile}
        request={() => findFile()}
        rowKey="id"
        // params={{ keywords }}
        toolBarRender={false}
        pagination={false}
        search={false}
        actionRef={fileRef}
      />
    </Drawer>
  );
}
