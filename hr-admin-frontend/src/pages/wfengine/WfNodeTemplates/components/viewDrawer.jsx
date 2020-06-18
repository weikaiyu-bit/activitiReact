import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class WfNodeTemplatesViewDrawer extends Component {
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
            <span>流程类别: </span>
            <span>{data.categoryName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>模板名称: </span>
            <span>{data.templateName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>关联表单: </span>
            <span>{data.pageUrl}</span>
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

export default WfNodeTemplatesViewDrawer;
