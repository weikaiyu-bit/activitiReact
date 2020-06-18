import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class WfNodesViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详情">
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>流程名字: </span>
            <span>{data.flowName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>节点名称: </span>
            <span>{data.nodeName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>备注: </span>
            <span>{data.remark}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>关联表单: </span>
            <span>{data.pageUrl}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>入口节点: </span>
            <span>{data.entryNodeIds}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>出口节点: </span>
            <span>{data.exitNodeIds}</span>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default WfNodesViewDrawer;
