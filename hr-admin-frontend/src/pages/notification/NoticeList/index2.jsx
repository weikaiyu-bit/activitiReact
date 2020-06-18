import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderLayout, PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Row,
  Col,
  Table,
  Card,
  Button,
  Divider,
  Popconfirm,
  Form,
  message,
  Avatar,
  Tag,
  BackTop,
} from 'antd';

import AnnounceView from './components/AnnounceView';
import RemindView from './components/RemindView';
import MessageView from './components/MessageView';

@connect(({ todoListModel, loading }) => ({
  todoListModel,
  loading: loading.models.pullRemind,
}))
class TodoListIndex extends Component {
  getNotices = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `todoListModel/getNotices`,
      payload: {},
    });
  };

  state = {
    tab: 'waterfall',
  };

  handleTabChange = key => {
    console.log('key=', key);
    switch (key) {
      case 'board':
        this.setState({
          tab: 'board',
        });
        break;
      case 'waterfall':
        this.setState({
          tab: 'waterfall',
        });
        break;
      default:
        break;
    }
    console.log('state.tab=', this.state.tab);
  };

  renderBoard = data => {
    const announce = [];
    const message = [];
    const remind = [];

    for (let item of data) {
      switch (item.notifyType) {
        case 'announce':
          announce.push(item);
          break;
        case 'message':
          message.push(item);
          break;
        case 'remind':
          remind.push(item);
          break;
      }
    }
    console.log('announce=', announce);
    console.log('message=', message);
    console.log('remind=', remind);

    return (
      <div>
        <div style={{ width: '33%', float: 'left' }}>
          <AnnounceView dataSource={announce} title="通知" />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <RemindView dataSource={remind} title="提醒" />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <MessageView dataSource={message} title="消息" />
        </div>
        <BackTop />
      </div>
    );
  };

  render() {
    const data = notices;

    const tabList = [
      {
        key: 'waterfall',
        tab: '瀑布流',
      },
      {
        key: 'board',
        tab: '看板',
      },
    ];

    return (
      <PageHeaderWrapper title="待办事项" tabList={tabList}>
        {this.renderBoard(data)}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TodoListIndex);

var notices = [
  {
    id: '000000001',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    content: '你收到了 14 份新周报',
    createAt: '2017-08-09',
    notifyType: 'announce',
  },
  {
    id: '000000002',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    content: '你推荐的 曲妮妮 已通过第三轮面试',
    createAt: '2017-08-08',
    notifyType: 'announce',
  },
  {
    id: '000000003',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    content: '这种模板可以区分多种通知类型',
    createAt: '2017-08-07',
    isRead: true,
    notifyType: 'announce',
  },
  {
    id: '000000004',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    content: '左侧图标用于区分不同的类型',
    createAt: '2017-08-07',
    notifyType: 'announce',
  },
  {
    id: '000000005',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    content: '内容不要超过两行字，超出时自动截断',
    createAt: '2017-08-07',
    notifyType: 'announce',
  },
  {
    id: '000000006',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    content: '曲丽丽 评论了你',
    description: '描述信息描述信息描述信息',
    createAt: '2017-08-07',
    notifyType: 'message',
    clickClose: true,
  },
  {
    id: '000000007',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    content: '朱偏右 回复了你',
    description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    createAt: '2017-08-07',
    notifyType: 'message',
    clickClose: true,
  },
  {
    id: '000000008',
    senderAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    content: '标题',
    description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    createAt: '2017-08-07',
    notifyType: 'message',
    clickClose: true,
  },
  {
    id: '000000009',
    content: '任务名称',
    description: '任务需要在 2017-01-12 20:00 前启动',
    extra: '未开始',
    status: 'todo',
    notifyType: 'remind',
  },
  {
    id: '000000010',
    content: '第三方紧急代码变更',
    description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    extra: '马上到期',
    status: 'urgent',
    notifyType: 'remind',
  },
  {
    id: '000000011',
    content: '信息安全考试',
    description: '指派竹尔于 2017-01-09 前完成更新并发布',
    extra: '已耗时 8 天',
    status: 'doing',
    notifyType: 'remind',
  },
  {
    id: '000000012',
    content: 'ABCD 版本发布',
    description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    extra: '进行中',
    status: 'processing',
    notifyType: 'remind',
  },
];
