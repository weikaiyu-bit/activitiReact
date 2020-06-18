import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class DailyAttendanceViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="详细信息">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>id: </label>
            <label>{data.id}</label>
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
            <label>应用id: </label>
            <label>{data.appId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>档案ID: </label>
            <label>{data.fileId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>姓名: </label>
            <label>{data.name}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>性别: </label>
            <label>{data.sex}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>统计关系所在单位: </label>
            <label>{data.orgName}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>部门: </label>
            <label>{data.department}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>考勤时间: </label>
            <label>{data.attendanceTime}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>考勤地点: </label>
            <label>{data.attendancePlace}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>是否缺勤: </label>
            <label>{data.isAbsenteeism}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>缺勤原因: </label>
            <label>{data.absenteeismReason}</label>
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
            <label>创建人: </label>
            <label>{data.creatorId}</label>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default DailyAttendanceViewDrawer;
