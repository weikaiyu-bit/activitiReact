import React, { Component } from 'react';
import { Drawer, Row, Col, Descriptions, Table } from 'antd';

class OrgOrganizationViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };
  countColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '正职领导',
      dataIndex: 'shouldLeadershipCount',
      key: 'shouldLeadershipCount',
    },
    {
      title: '副职领导',
      dataIndex: 'shouldLeadershipNumber',
      key: 'shouldLeadershipNumber',
    },
  ];

  numberColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '行政编制',
      dataIndex: 'adminNumber',
      key: 'adminNumber',
    },
    {
      title: '参照公务员法管理事业编制',
      dataIndex: 'careerParticipationNumber',
      key: 'careerParticipationNumber',
    },
    {
      title: '其他事业编制',
      dataIndex: 'careerNoparticipationNumber',
      key: 'careerNoparticipationNumber',
    },
    {
      title: '工勤编制',
      dataIndex: 'workNumber',
      key: 'workNumber',
    },
    {
      title: '其他编制',
      dataIndex: 'otherNumber',
      key: 'otherNumber',
    },
  ];

  inCountColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '领导职数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '正职',
      dataIndex: 'shouldLeadershipCount',
      key: 'shouldLeadershipCount',
    },
    {
      title: '副职',
      dataIndex: 'shouldLeadershipNumber',
      key: 'shouldLeadershipNumber',
    },
  ];


  render() {
    const { data = {}, visible } = this.props;


    const dataSource1 = [
      {
        key: '1',
        title: '应配职数',
        shouldLeadershipCount: 2,
        shouldLeadershipNumber: 1,
        adminNumber: 2,
        careerParticipationNumber: 1,
        count: 2,
      },
      {
        key: '2',
        title: '实配职数',
        adminNumber: 2,
        careerParticipationNumber: 1,
        count: 1,
      },
    ];

    const dataSource2 = [
      {
        key: '1',
        title: '编制数',
        adminNumber: 2,
        careerParticipationNumber: 1,
        careerNoparticipationNumber: 0,
        workNumber: 0,
        otherNumber: 0,
      },
      {
        key: '2',
        title: '实有人数',
        shouldLeadershipCount: 2,
        shouldLeadershipNumber: 1,
      },
    ];

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="组织结构信息">
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="机构名称">{data.orgName}</Descriptions.Item>
              <Descriptions.Item label="机构简称">{data.orgShortName}</Descriptions.Item>
              <Descriptions.Item label="机构级别">{data.level}</Descriptions.Item>
              <Descriptions.Item label="所在政区">{data.area}</Descriptions.Item>
              <Descriptions.Item label="机构类别">{data.category}</Descriptions.Item>
              <Descriptions.Item label="隶属关系">{data.subordination}</Descriptions.Item>
              <Descriptions.Item label="机构成立批准日期">{data.jgclpzDate}</Descriptions.Item>
              <Descriptions.Item label="机构成立批准文号">{data.areaId}</Descriptions.Item>
              <Descriptions.Item label="参照公务员法管理申请日期">{data.czgyyfglsqDate}</Descriptions.Item>
              <Descriptions.Item label="参照公务员管理法申请文号">{data.czgyyglfspNo}</Descriptions.Item>
              <Descriptions.Item label="参照公务员管理法审批日期">{data.czgyyglfspDate}</Descriptions.Item>
              <Descriptions.Item label="参照公务员管理法审批文号">{data.czgyyglfspNo}</Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>{data.remark}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Row style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Table columns={this.countColumns} dataSource={dataSource1} size='small' pagination={false} />
          </Col>
          <Col span={1}>
          </Col>
          <Col span={17} >
            <Table columns={this.numberColumns} dataSource={dataSource2} size='small' pagination={false} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Table columns={this.inCountColumns} dataSource={dataSource1} size='small' pagination={false} />
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default OrgOrganizationViewDrawer;
