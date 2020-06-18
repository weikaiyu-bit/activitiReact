/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Drawer, Descriptions, Tag } from 'antd';

class BamDictionaryViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  nodeType = nodeType => {
    switch (nodeType) {
      case 'category':
        return <Tag color="#CD853F">类别</Tag>;
      case 'dictionary':
        return <Tag color="#FF8C00">字典</Tag>;
      default:
        return <Tag>未定义</Tag>;
    }
  };

  tenantName = tenantId => {
    const { tentants } = this.props;
    tentants.map(item => {
      if (tenantId == item.id) {
        return <Descriptions.Item label="租户名">{item.tentantName}</Descriptions.Item>;
      }
    });
  };

  render() {
    const { data = {}, visible, tentants } = this.props;
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详细">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="字典id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="父节点id">{data.pid}</Descriptions.Item>
          <Descriptions.Item label="应用id">{data.appId}</Descriptions.Item>
          <Descriptions.Item label="租户ID">{data.tenantId}</Descriptions.Item>
          <Descriptions.Item label="租户名">
            {tentants
              ? tentants.map(item => {
                  if (data.tenantId == item.id) {
                    return item.tentantName;
                  }
                })
              : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="字典名称">{data.dictName}</Descriptions.Item>
          <Descriptions.Item label="节点类型">{this.nodeType(data.nodeType)}</Descriptions.Item>
          <Descriptions.Item label="备注">{data.remark}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="创建人id">{data.creatorId}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default BamDictionaryViewDrawer;
