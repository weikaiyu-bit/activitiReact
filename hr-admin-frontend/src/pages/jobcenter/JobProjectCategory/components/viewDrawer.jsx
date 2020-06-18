import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class JobProjectCategoryViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="项目类别">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>类别id: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>父节点id: </label>
            <label>{data.pid}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>类别名称: </label>
            <label>{data.categoryName}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>备注: </label>
            <label>{data.remark}</label>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default JobProjectCategoryViewDrawer;
