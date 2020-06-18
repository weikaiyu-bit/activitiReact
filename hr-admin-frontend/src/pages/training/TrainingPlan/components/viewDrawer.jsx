/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Drawer, Row, Col, Tag, Table } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';

@connect(({ trainingRsMemberModel, loading }) => ({
  trainingRsMemberModel,
  loading,
}))
class TrainingPlanViewDrawer extends Component {
  state = {
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '所在单位id',
      dataIndex: 'orgId',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '民族',
      dataIndex: 'national',
    },
    {
      title: '职务名称',
      dataIndex: 'positionName',
    },
    {
      title: '培训状态',
      dataIndex: 'state',
    },
  ];

  afterVisibleChange = isOpen => {
    if (isOpen) {
      const { pageNumber, pageSize } = this.state;
      const { data } = this.props;
      this.findPage(pageNumber, pageSize, { planId: data.id });
    }
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'trainingRsMemberModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };


  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };


  rendeTag = state => {
    switch (state) {
      case '编辑中':
        return <Tag color="cyan">{state}</Tag>;
      case '已发布':
        return <Tag color="blue">{state}</Tag>;
      case '已关闭':
        return <Tag color="#CCC">{state}</Tag>;
      default:
        return <Tag>{state}</Tag>;
    }
  };

  render() {
    const { data = {}, visible, trainingRsMemberModel: { trainingRsMemberData } } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="详细信息" afterVisibleChange={this.afterVisibleChange}>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <h2>{data.title}</h2>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col span={8}>
            <span><strong>发布人: </strong></span>
            {data.publisher}
            <span style={{ marginLeft: 24 }}>
              {this.rendeTag(data.state)}
            </span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>发布内容: </strong></span>
            <p>{data.content}</p>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>培训时间: </strong></span>
            <label>{data.trainingTime}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>培训地点: </strong></span>
            <label>{data.address}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>培训对象: </strong></span>
            <label>{data.trainingObjects}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>备注: </strong></span>
            <p>{data.remark}</p>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>发布时间:</strong></span>
            <label>{data.publishTime}</label>
          </Col>
          <Col span={12}>
            <span><strong>经办单位: </strong></span>
            {data.handlingOrgName}
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }} >
          <Col span={12}>
            <span><strong>经办人:</strong></span>
            {data.handler}
          </Col>
          <Col span={12}>
            <span><strong>联系电话:</strong></span>
            {data.tel}
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <span><strong>人员名单:</strong></span>
            <Table
              rowKey="id"
              columns={this.columns}
              size="small"
              dataSource={trainingRsMemberData}
            />
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default TrainingPlanViewDrawer;
