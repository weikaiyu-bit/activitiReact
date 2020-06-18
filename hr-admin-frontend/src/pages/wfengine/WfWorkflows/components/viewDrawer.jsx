import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';
import Designer from '@/components/wfdesigner'
import FlowViewer from '@/pages/wfengine/WfFlowDesiger/viewer';

class WfWorkflowsViewDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shown: true,
    }
  }

  close = () => {
    const { onClose } = this.props;
    this.setState({
      shown: false,
    })
    if (onClose) onClose();
  };

  __shown = e => {
  }

  // 转化json
  /**
   * 判断是否json
   * @param $string
   * @returns {boolean}
   */
  isJson = ($string) => {
    if (typeof $string === 'string') {
      try {
        const obj = JSON.parse($string);
        if (typeof obj === 'object' && obj) {
          return JSON.parse($string);
        }
      } catch (e) {
        //  console.log('error：'+str+'!!!'+e);
      }
    } return false;
  }

  render() {
    const { data = {}, visible } = this.props;
    const { shown } = this.state;
    return (
      <Drawer width="40%" afterVisibleChange={this.__shown} visible={visible} onClose={this.close} title="查看详情">
        { shown === true && <FlowViewer data={ { content: this.isJson(data.flowJson) }} />}
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>流程类别: </span>
            <span>{data.categoryName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>流程名称: </span>
            <span>{data.flowName}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>开始节点: </span>
            <span>{data.beginNodeId}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>终止节点: </span>
            <span>{data.endNodeId}</span>
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
            <span>创建时间: </span>
            <span>{data.createTime}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>开始节点: </span>
            <span>{data.beginNodeId}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>终止节点: </span>
            <span>{data.endNodeId}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>备注: </span>
            <span>{data.remark}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>创建时间: </span>
            <span>{data.createTime}</span>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <span>创建人: </span>
            <span>{data.creatorUid}</span>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default WfWorkflowsViewDrawer;
