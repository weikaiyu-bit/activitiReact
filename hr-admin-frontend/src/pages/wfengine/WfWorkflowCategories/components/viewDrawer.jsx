import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class WfWorkflowCategoriesViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详情">
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>类别名称: </span>
            <span>{data.categoryName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>驱动类型: </span>
            <span>{data.flowType}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>备注: </span>
            <span>{data.remark}</span>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default WfWorkflowCategoriesViewDrawer;
