import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class MsgSubscriptionConfigViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="订阅配置信息">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>id: </span>
            <span>{data.id}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>应用id: </span>
            <span>{data.appId}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>租户id: </span>
            <span>{data.tenantId}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>目标类型: </span>
            <span>{data.targetType}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>动作类型: </span>
            <span>{data.action}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>订阅用户: </span>
            <span>{data.subscriberUid}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>重复提醒: </span>
            <span>{data.isRepeat}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>重复间隔: </span>
            <span>{data.repetitionPeriod}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>提前提醒: </span>
            <span>{data.isAhead}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>提前量: </span>
            <span>{data.aheadTime}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>创建时间: </span>
            <span>{data.createAt}</span>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default MsgSubscriptionConfigViewDrawer;
