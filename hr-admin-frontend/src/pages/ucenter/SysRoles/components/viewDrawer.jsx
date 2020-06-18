import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class SysRolesViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="角色信息">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>角色名称: </lable>
            <lable>{data.roleName}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>备注: </lable>
            <lable>{data.remark}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>更新时间: </lable>
            <lable>{data.updateTime}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>创建时间: </lable>
            <lable>{data.createTime}</lable>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default SysRolesViewDrawer;
