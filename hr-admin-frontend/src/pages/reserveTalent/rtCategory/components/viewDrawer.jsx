import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class RtCategoryViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="详细信息">
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>id: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>父节点id: </label>
            <label>{data.pid}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>分类名称: </label>
            <label>{data.categoryName}</label>
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
            <label>创建人id: </label>
            <label>{data.creatorId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>创建时间: </label>
            <label>{data.createTime}</label>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default RtCategoryViewDrawer;
