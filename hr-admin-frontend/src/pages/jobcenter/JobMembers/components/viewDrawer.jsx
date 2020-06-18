import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class JobMembersViewDrawer extends Component {
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
            <label>ID: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>项目id: </label>
            <label>{data.projectId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>用户id: </label>
            <label>{data.uid}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>名称: </label>
            <label>{data.name}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>用户名: </label>
            <label>{data.username}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>头像: </label>
            <label>{data.avatarUrl}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>成员类型: </label>
            <label>{data.memberType}</label>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default JobMembersViewDrawer;
