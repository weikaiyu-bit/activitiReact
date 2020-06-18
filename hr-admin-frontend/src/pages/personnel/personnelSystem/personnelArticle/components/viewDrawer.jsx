/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class PersonnelSystemArticleViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="人事制度文件">
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文章制度标题: </label>
            <label>{data.articleTitle}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>父节点: </label>
            <label>{data.pid}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文章制度说明: </label>
            <label>{data.articleExplain}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>类型: </label>
            <label>{data.type}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>状态: </label>
            <label>{data.state}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>创建人ID: </label>
            <label>{data.creatorId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>创建人: </label>
            <label>{data.creator}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>创建时间: </label>
            <label>{data.creatorTime}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>发布人ID: </label>
            <label>{data.publisherID}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>发布人: </label>
            <label>{data.publisherName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>发布时间: </label>
            <label>{data.publisherTime}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>撤下人ID: </label>
            <label>{data.withdrawID}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>撤下人: </label>
            <label>{data.withdrawName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>撤下时间: </label>
            <label>{data.withdrawTime}</label>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default PersonnelSystemArticleViewDrawer;
