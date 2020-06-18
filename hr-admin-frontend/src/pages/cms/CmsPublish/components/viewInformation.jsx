/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable no-lone-blocks */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import Reacr, { Component } from 'react';
import { Switch, Descriptions, Modal, Tag } from 'antd';

class CmsPublishViewInformation extends Component {
  state = {
    categoryName: '',
  };

  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  contentStatus = status => {
    switch (status) {
      // 草稿
      case 'DRAFT':
        return <Tag color="orange">草稿</Tag>;
      // 已投稿
      case 'SUBMITTED':
        return <Tag color="cyan">已投稿</Tag>;
      // 已接收
      case 'RECEIVED':
        return <Tag color="magenta">已接收</Tag>;
      // 废稿
      case 'SCRAP':
        return <Tag color="volcano">废稿</Tag>;
      // 已发布
      case 'PUBLISHED':
        return <Tag color="blue">已发布</Tag>;
      default:
        return <Tag color="">未定义</Tag>;
    }
  };

  categoryName = categoryId => {
    this.props.categoryData.map(element => {
      if (element.id === categoryId) {
        return <Descriptions.Item label="栏目id">{element.categoryName}</Descriptions.Item>;
      }
    });
  };

  render() {
    const { visible, record, windowTitle, categoryData } = this.props;

    return (
      <Modal
        title={windowTitle}
        visible={visible}
        width={1024}
        footer={null}
        onOk={this.close}
        onCancel={this.close}
        maskClosable={false}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="id">{record.id}</Descriptions.Item>
          <Descriptions.Item label="租户id">{record.tentantId}</Descriptions.Item>
          <Descriptions.Item label="应用id">{record.appId}</Descriptions.Item>
          {categoryData.map(element => {
            if (element.id === record.categoryId) {
              return (
                <Descriptions.Item label="栏目id / 栏目名称">
                  {record.categoryId} / {element.categoryName}
                </Descriptions.Item>
              );
            }
          })}
          <Descriptions.Item label="标题">{record.title}</Descriptions.Item>
          <Descriptions.Item label="作者">{record.author}</Descriptions.Item>
          <Descriptions.Item label="来源">{record.source}</Descriptions.Item>
          <Descriptions.Item label="文章风格">{record.style}</Descriptions.Item>
          <Descriptions.Item label="缩略图" span={3}>
            {record.thumbnail ? (
              <img src={record.thumbnail} width="400‬‬px" height="200px" alt="缩略图" />
            ) : (
              '无'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="是否缩略图">{record.isThumbnail}</Descriptions.Item>
          <Descriptions.Item label="标签">{record.tags}</Descriptions.Item>
          <Descriptions.Item label="外链">{record.url}</Descriptions.Item>
          <Descriptions.Item label="是否外链">
            <Switch checked={record.isUrl === 'true'} />{' '}
          </Descriptions.Item>
          <Descriptions.Item label="关键字">{record.keywords}</Descriptions.Item>
          <Descriptions.Item label="描述">{record.description}</Descriptions.Item>
          <Descriptions.Item label="推荐">
            <Switch checked={record.isGood === 'true'} />
          </Descriptions.Item>
          <Descriptions.Item label="置顶">
            <Switch checked={record.onTop === 'true'} />
          </Descriptions.Item>
          <Descriptions.Item label="允许评论">
            <Switch checked={record.allowComment === 'true'} />
          </Descriptions.Item>
          <Descriptions.Item label="评论">{record.comments}</Descriptions.Item>
          <Descriptions.Item label="阅读单价">{record.price}</Descriptions.Item>
          <Descriptions.Item label="点击率">{record.clicks}</Descriptions.Item>
          <Descriptions.Item label="文章状态">
            {this.contentStatus(record.contentStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="工作流实例">{record.runId}</Descriptions.Item>
          <Descriptions.Item label="当前节点">{record.currentNodeId}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{record.createTiume}</Descriptions.Item>
          <Descriptions.Item label="创建人ID">{record.creatorUid}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{record.publishTime}</Descriptions.Item>
          <Descriptions.Item label="发布人ID">{record.publisherUid}</Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
}

export default CmsPublishViewInformation;
