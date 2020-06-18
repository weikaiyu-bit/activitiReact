import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class SysUsersViewDrawer extends Component {
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
            <lable>用户头像: </lable>
          </Col>
        </Row>
        <lable>
          {' '}
          <img src={data.avatarUrl} alt="无" />
        </lable>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>用户名: </lable>
            <lable>{data.userName}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>昵称: </lable>
            <lable>{data.nickname}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>真实姓名: </lable>
            <lable>{data.realName}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>手机号码: </lable>
            <lable>{data.mobile}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>地区: </lable>
            <lable>{data.areaName}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>个人签名: </lable>
            <lable>{data.signature}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>二维码名片: </lable>
            <lable>{data.maxCard}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>创建时间: </lable>
            <lable>{data.createTime}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>更新日期: </lable>
            <lable>{data.updateTime}</lable>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default SysUsersViewDrawer;
