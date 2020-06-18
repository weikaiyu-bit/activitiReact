/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class ArticleFileViewViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="人事制度文件">
        {/* <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>id: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>租户id: </label>
            <label>{data.tentantId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>应用id: </label>
            <label>{data.appId}</label>
          </Col>
        </Row> */}
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文章制度标题: </label>
            <label>{data.articleTitle}</label>
          </Col>
        </Row>
        {/* <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>父节点: </label>
            <label>{data.pid}</label>
          </Col>
        </Row> */}
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文章制度说明: </label>
            <label>{data.articleExplain}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文章制度内容: </label>
            <label>{data.articleContent}</label>
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
        <Row style={{ marginTop: 12 }} >
          <Col span={12} >
            <label>文件列表: </label>
            <label style={{ marginLeft: 15 }}> <a href="#">全部下载</a> </label>
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <label>文件一 </label>
            <label style={{ marginLeft: 10 }}><a href="#">在线预览</a></label>
            <label style={{ marginLeft: 10 }}><a href="#">下载</a></label>
          </Col>
          <Col span={24} style={{ marginTop: 12 }}>
            <label>文件二 </label>
            <label style={{ marginLeft: 10 }}><a href="#">在线预览</a></label>
            <label style={{ marginLeft: 10 }}><a href="#">下载</a></label>
          </Col>
          <Col span={24} style={{ marginTop: 12 }}>
            <label>文件三 </label>
            <label style={{ marginLeft: 10 }}><a href="#">在线预览</a></label>
            <label style={{ marginLeft: 10 }}><a href="#">下载</a></label>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default ArticleFileViewViewDrawer;
