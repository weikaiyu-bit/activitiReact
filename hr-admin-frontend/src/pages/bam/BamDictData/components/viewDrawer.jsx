/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Drawer, Tag, Descriptions } from 'antd';

class BamDictDataViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  nodeType = nodeType => {
    switch (nodeType) {
      case 'category':
        return <Tag color="#CD853F">类别</Tag>;
      case 'data':
        return <Tag color="#FF8C00">数据</Tag>;
      default:
        return <Tag>未定义</Tag>;
    }
  };

  render() {
    const { data = {}, visible, tentants } = this.props;
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详细">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="数据id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="父节点id">{data.pid}</Descriptions.Item>
          <Descriptions.Item label="应用id">{data.appId}</Descriptions.Item>
          <Descriptions.Item label="租户ID">{data.tenantId}</Descriptions.Item>
          <Descriptions.Item label="租户名">
            {tentants
              ? tentants.map(item => {
                  if (data.tenantId === item.id) {
                    return item.tentantName;
                  }
                })
              : ''}
          </Descriptions.Item>
          <Descriptions.Item label="数据名称">{data.dataName}</Descriptions.Item>
          <Descriptions.Item label="数据值">{data.dataValue}</Descriptions.Item>
          <Descriptions.Item label="数据标签">{data.tags}</Descriptions.Item>
          <Descriptions.Item label="节点类型">{this.nodeType(data.nodeType)}</Descriptions.Item>
          <Descriptions.Item label="备注">{data.remark}</Descriptions.Item>
          <Descriptions.Item label="排序">{data.sortNo}</Descriptions.Item>
          <Descriptions.Item label="更新日期">{data.updateTime}</Descriptions.Item>
          <Descriptions.Item label="更新人id">{data.updatorId}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="创建人id">{data.creatorId}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default BamDictDataViewDrawer;
