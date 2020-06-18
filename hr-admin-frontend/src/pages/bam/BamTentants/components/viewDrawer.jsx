/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Drawer, Descriptions, Tag } from 'antd';

class BamTentantsViewDrawer extends Component {
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
      <Drawer width="40%" visible={visible} onClose={this.close} title="详细信息">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="租户id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="租户名称">{data.tentantName}</Descriptions.Item>
          <Descriptions.Item label="所在国家">{data.country}</Descriptions.Item>
          <Descriptions.Item label="所在州省">{data.province}</Descriptions.Item>
          <Descriptions.Item label="所在地址">{data.address}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data.contacts}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{data.phone}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">{data.email}</Descriptions.Item>
          <Descriptions.Item label="状态">{this.status(data.status)}</Descriptions.Item>
          <Descriptions.Item label="备注">{data.remark}</Descriptions.Item>
          <Descriptions.Item label="更新日期">{data.updateTime}</Descriptions.Item>
          <Descriptions.Item label="更新人id">{data.updatorId}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="创建人id">{data.creatorId}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default BamTentantsViewDrawer;
