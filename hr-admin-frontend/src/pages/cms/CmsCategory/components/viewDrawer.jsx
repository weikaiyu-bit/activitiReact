import React, { Component } from 'react';
import { Drawer, Descriptions } from 'antd';

class CmsCategoryViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="栏目详情">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="租户id">{data.tentantId}</Descriptions.Item>
          <Descriptions.Item label="应用id">{data.appId}</Descriptions.Item>
          <Descriptions.Item label="父节点id">{data.pid}</Descriptions.Item>
          <Descriptions.Item label="子节点ids">{data.childrenIds}</Descriptions.Item>
          <Descriptions.Item label="栏目名称">{data.categoryName}</Descriptions.Item>
          <Descriptions.Item label="优化标题">{data.seoTitle}</Descriptions.Item>
          <Descriptions.Item label="栏目编码">{data.categoryCode}</Descriptions.Item>
          <Descriptions.Item label="栏目图片" span={3}>
            {data.picUrl ? (
              <img src={data.picUrl} width="400‬‬px" height="200px" alt="栏目图片" />
            ) : (
              '无'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="栏目类型">{data.categoryType}</Descriptions.Item>
          <Descriptions.Item label="所属模型">{data.modelId}</Descriptions.Item>
          <Descriptions.Item label="导航显示">
            {data.isMenu === 'true' ? '显示' : '不显示'}
          </Descriptions.Item>
          <Descriptions.Item label="允许投稿">
            {data.allowSubmit === 'true' ? '允许' : '不允许'}
          </Descriptions.Item>
          <Descriptions.Item label="分页大小">{data.pageSize}</Descriptions.Item>
          <Descriptions.Item label="排序">{data.sortNo}</Descriptions.Item>
          <Descriptions.Item label="栏目深度">{data.depth}</Descriptions.Item>
          <Descriptions.Item label="内容页规则">{data.urlRule}</Descriptions.Item>
          <Descriptions.Item label="列表模板">{data.categoryList}</Descriptions.Item>
          <Descriptions.Item label="内容模板">{data.categoryShow}</Descriptions.Item>
          <Descriptions.Item label="关键字">{data.keywords}</Descriptions.Item>
          <Descriptions.Item label="描述信息">{data.description}</Descriptions.Item>
          <Descriptions.Item label="创建人">{data.creatorUid}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新人">{data.updatorUid}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    );
  }
}

export default CmsCategoryViewDrawer;
