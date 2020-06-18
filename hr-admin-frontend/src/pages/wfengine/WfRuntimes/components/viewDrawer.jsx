import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';
import WfRuntimeTrailTimeline from "../../components/WfRuntimeTrailTimeline";


class WfRuntimesViewDrawer extends Component {

  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data={}, logs={}, visible } = this.props;
    console.log('data=', data);
    console.log('logs=', logs);

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详情">
        <Row>
          <Col span={12}>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>流程名字: </span>
                <span>{data.flowName}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>流程类别: </span>
                <span>{data.categoryName}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>实例名称: </span>
                <span>{data.runtimeName}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>当前节点: </span>
                <span>{data.nodeName}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>实例轨迹: </span>
                <span>{data.trailJson}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>实例状态: </span>
                <span>{data.status}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>更新日期: </span>
                <span>{data.updateTime}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <span>更新人: </span>
                <span>{data.updatorUid}</span>
              </Col>
            </Row>
            <Row style={ { marginTop: 12 } } >
              <Col span={12}>
                <WfRuntimeTrailTimeline dataSource={logs} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default WfRuntimesViewDrawer;
