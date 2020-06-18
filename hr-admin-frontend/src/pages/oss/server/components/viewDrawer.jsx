/* eslint-disable no-console */
import React, { Component } from 'react';
import { Drawer, Row, Col, Tag } from 'antd';

class ViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;
    console.log('viewData', data);

    const { serverStatus } = data;
    let color = '';
    switch (serverStatus) {
      case '正常':
        color = 'green';
        break;
      case '宕机':
        color = 'red';
        break;
      default:
        color = '';
        break;
    }

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>服务器名称：</lable>
            <lable>{data.serverName}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>服务器路径：</lable>
            <lable>{data.serverUrl}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>服务器端口：</lable>
            <lable>{data.serverPort}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>服务器状态：</lable>
            <Tag color={color}>{serverStatus}</Tag>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>备注：</lable>
            <lable>{data.remake}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>创建时间：</lable>
            <lable>{data.createTime}</lable>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default ViewDrawer;
