/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class BamScheduleViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="璇︾粏淇℃伅">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>id: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>应用id: </label>
            <label>{data.appId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>租户id: </label>
            <label>{data.tenantId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>调度器名称: </label>
            <label>{data.scheduleName}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>JavaBean名称: </label>
            <label>{data.beanName}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>参数: </label>
            <label>{data.parameter}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>CRON表达式: </label>
            <label>{data.cronExpression}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>备注: </label>
            <label>{data.remark}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>状态: </label>
            <label>{data.status}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>更新日期: </label>
            <label>{data.updateTime}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>更新人id: </label>
            <label>{data.updatorId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>创建时间: </label>
            <label>{data.createTime}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>创建人id: </label>
            <label>{data.creatorId}</label>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default BamScheduleViewDrawer;
