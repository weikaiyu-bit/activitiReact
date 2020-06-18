import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class MsgNotifyConfigViewDrawer extends Component {
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
            <span>关联动作: </span>
            <span>{data.action}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>订阅事件: </span>
            <span>{data.reasonAction}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <span>消息模板: </span>
            <span>{data.notifyTmpl}</span>
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

export default MsgNotifyConfigViewDrawer;
