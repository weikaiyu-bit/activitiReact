/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';


class PersonnelSystemFileViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="璇︾粏淇℃伅">
        <Row style={ { marginTop: 12 } } >
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
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文章id: </label>
            <label>{data.articleId}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文件名: </label>
            <label>{data.fileName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文件后缀名: </label>
            <label>{data.fileSuffix}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文件url: </label>
            <label>{data.fileUrl}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文件大小: </label>
            <label>{data.fileSize}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>上传人: </label>
            <label>{data.uploadName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>上传时间: </label>
            <label>{data.uploadTime}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={12}>
            <label>文件加密: </label>
            <label>{data.hashCode}</label>
          </Col>
        </Row>
      </Drawer>
    )
  }
}

export default PersonnelSystemFileViewDrawer;
