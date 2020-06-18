import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class SysFunctionsViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="菜单信息">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>功能名称: </lable>
            <lable>{data.functionName}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>功能类型: </lable>
            <lable>{data.functionType}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>图标: </lable>
            <lable>{data.icon}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>授权标识: </lable>
            <lable>{data.auth}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>路由: </lable>
            <lable>{data.routing}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>排序: </lable>
            <lable>{data.sortNo}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>标签: </lable>
            <lable>{data.tag}</lable>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <lable>备注: </lable>
            <lable>{data.remark}</lable>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default SysFunctionsViewDrawer;
