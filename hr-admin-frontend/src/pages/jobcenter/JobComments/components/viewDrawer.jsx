import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';

class JobCommentsViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="璇︾粏淇℃伅">
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>评论ID: </label>
            <label>{data.id}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>任务ID: </label>
            <label>{data.taskId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>回复id: </label>
            <label>{data.replyId}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>回复内容: </label>
            <label>{data.replyComments}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>评论回复: </label>
            <label>{data.comment}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>评论时间: </label>
            <label>{data.createTime}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>评论人ID: </label>
            <label>{data.commentatorUid}</label>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <label>评论人名称: </label>
            <label>{data.commentatorName}</label>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default JobCommentsViewDrawer;
