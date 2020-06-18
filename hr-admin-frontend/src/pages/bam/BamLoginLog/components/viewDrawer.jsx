import React, { Component } from 'react';
import { Drawer, Descriptions } from 'antd';

class BamLoginLogViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详细">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="日志id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="应用id">{data.appId}</Descriptions.Item>
          <Descriptions.Item label="租户id">{data.tenantId}</Descriptions.Item>
          <Descriptions.Item label="用户id">{data.uid}</Descriptions.Item>
          <Descriptions.Item label="用户名">{data.username}</Descriptions.Item>
          <Descriptions.Item label="操作">{data.action}</Descriptions.Item>
          <Descriptions.Item label="User-Agent">{data.userAgent}</Descriptions.Item>
          <Descriptions.Item label="机器ip">{data.ip}</Descriptions.Item>
          <Descriptions.Item label="操作时间">{data.actionTime}</Descriptions.Item>
          <Descriptions.Item label="状态">{data.status}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default BamLoginLogViewDrawer;
