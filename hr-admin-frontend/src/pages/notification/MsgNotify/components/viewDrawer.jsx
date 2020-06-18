import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class MsgNotifyViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="消息通知信息">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>通知id: </span>
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
            <span>消息类型: </span>
            <span>{data.notifyType}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>消息内容: </span>
            <span>{data.content}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>描述: </span>
            <span>{data.description}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>状态: </span>
            <span>{data.status}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>扩展: </span>
            <span>{data.extra}</span>
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
            <span>目标id: </span>
            <span>{data.targetId}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>目标名称: </span>
            <span>{data.targetName}</span>
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
            <span>发送者id: </span>
            <span>{data.senderId}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>发送者名称: </span>
            <span>{data.senderName}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>发送者头像: </span>
            <span>{data.senderAvatar}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>发送者类型: </span>
            <span>{data.senderType}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>发送时间: </span>
            <span>{data.createAt}</span>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default MsgNotifyViewDrawer;
