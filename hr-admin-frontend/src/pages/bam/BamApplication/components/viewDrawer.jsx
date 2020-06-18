import React, { Component } from 'react';
import { Drawer, Descriptions, Tag, Avatar } from 'antd';

class BamApplicationViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  status = status => {
    switch (status) {
      case 'ENABLED':
        return <Tag color="cyan">启用</Tag>;
      case 'DISABLE':
        return <Tag color="magenta">停用</Tag>;
      case 'IN_REVIEW':
        return <Tag color="orange">审核中</Tag>;
      default:
        return <Tag>无</Tag>;
    }
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详情">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="应用id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="租户id">{data.tenantId}</Descriptions.Item>
          <Descriptions.Item label="应用名称">{data.applicationName}</Descriptions.Item>
          <Descriptions.Item label="Logo">
            <Avatar
              shape="square"
              style={{ backgroundColor: data.logoColor, verticalAlign: 'middle' }}
            >
              {data.logoName}
            </Avatar>
          </Descriptions.Item>
          <Descriptions.Item label="版本">{data.version}</Descriptions.Item>
          <Descriptions.Item label="备注">{data.remark}</Descriptions.Item>
          <Descriptions.Item label="状态">{this.status(data.status)}</Descriptions.Item>
          <Descriptions.Item label="更新日期">{data.updateTime}</Descriptions.Item>
          <Descriptions.Item label="更新人id">{data.updatorId}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="创建人id">{data.creatorId}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default BamApplicationViewDrawer;
