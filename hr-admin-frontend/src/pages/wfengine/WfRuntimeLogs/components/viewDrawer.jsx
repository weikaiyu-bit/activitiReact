import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class WfRuntimeLogsViewDrawer extends Component {
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
            <label>id: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>log_id: </label>
            <label>{data.logId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>run_id: </label>
            <label>{data.runId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>catg_id: </label>
            <label>{data.catgId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>flow_id: </label>
            <label>{data.flowId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>node_id: </label>
            <label>{data.nodeId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>节点名称: </label>
            <label>{data.activityNodeName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>实例名称: </label>
            <label>{data.runtimeName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>备注: </label>
            <label>{data.remark}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>进入时间: </label>
            <label>{data.entryTime}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>进入更新人: </label>
            <label>{data.entryUid}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>离开时间: </label>
            <label>{data.exitTime}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>离开更新人: </label>
            <label>{data.exitUid}</label>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default WfRuntimeLogsViewDrawer;
