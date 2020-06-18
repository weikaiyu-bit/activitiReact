import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class JobRecordsViewDrawer extends Component {
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
            <label>日志id: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>任务ID: </label>
            <label>{data.taskId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>之前状态: </label>
            <label>{data.preStatus}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>当前状态: </label>
            <label>{data.curStatus}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>操作码: </label>
            <label>{data.operatCode}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>操作描述: </label>
            <label>{data.description}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>操作时间: </label>
            <label>{data.operateTime}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>操作人: </label>
            <label>{data.operatorUid}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>操作人名称: </label>
            <label>{data.operatorName}</label>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default JobRecordsViewDrawer;
