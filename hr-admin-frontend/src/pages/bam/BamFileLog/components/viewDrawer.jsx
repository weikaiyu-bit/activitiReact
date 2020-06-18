import React, { Component } from 'react';
import { Drawer, Descriptions } from 'antd';

class BamFileLogViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详情">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="日志id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="应用id">{data.appId}</Descriptions.Item>
          <Descriptions.Item label="租户id">{data.tenantId}</Descriptions.Item>
          <Descriptions.Item label="用户id">{data.uid}</Descriptions.Item>
          <Descriptions.Item label="类别id">{data.categoryId}</Descriptions.Item>
          <Descriptions.Item label="文件id">{data.fileId}</Descriptions.Item>
          <Descriptions.Item label="文件名称">{data.fileName}</Descriptions.Item>
          <Descriptions.Item label="文件类型">{data.fileType}</Descriptions.Item>
          <Descriptions.Item label="文件URL">{data.fileUrl}</Descriptions.Item>
          <Descriptions.Item label="文件大小">{data.fileSize}</Descriptions.Item>
          <Descriptions.Item label="文件状态">{data.fileStatus}</Descriptions.Item>
          <Descriptions.Item label="相关表">{data.rsTable}</Descriptions.Item>
          <Descriptions.Item label="关联id">{data.rsId}</Descriptions.Item>
          <Descriptions.Item label="操作码">{data.operateCode}</Descriptions.Item>
          <Descriptions.Item label="操作描述">{data.description}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default BamFileLogViewDrawer;
