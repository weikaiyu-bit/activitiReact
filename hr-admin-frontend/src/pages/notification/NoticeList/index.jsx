import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Form,
  BackTop,
  Button,
  Spin,
} from 'antd';
import AnnounceView from './components/AnnounceView';
import MessageBoardView from './components/MessageBoardView';
import MessageView from './components/MessageView';

@connect(({ noticeListModel, loading, user }) => ({
  noticeListModel,
  user,
  loading,
}))
class NoticeListIndex extends Component {
  componentDidMount () {
    // const { pageNumber, pageSize, filter } = this.state;
    // this.findPage(pageNumber, pageSize, filter);
  }

  /* ************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch, user } = this.props;
    const { currentUser } = user
    const { id } = currentUser
    dispatch({
      // type: `noticeListModel/getUserNotice`,
      type: 'noticeListModel/fetch',
      payload: {
        uid: id,
        pageNumber,
        pageSize,
        ...filter,
      },
    });
  };

  handleTabChange = key => {
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
  };

  renderBoard = data => {
    const { dispatch } = this.props;

    return (
      <div>
        <div style={{ width: '33%', float: 'left' }}>
          <MessageBoardView title="提醒" dispatch={dispatch} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <MessageView title="消息" />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <AnnounceView title="通知" dispatch={dispatch} />
        </div>
        <BackTop />
      </div>
    );
  };

  // 任务
  test = () => {
    const { jobTasksModel, user } = this.props
    const { allTaskData } = jobTasksModel
    const { currentUser } = user
    const { id } = currentUser
    const list = []
    for (let i = 0; i < allTaskData.length; i++) {
      if (allTaskData[i].executorId === id) {
        this.subscribe1(id, allTaskData[i].id, 'JOB')
        list.push(allTaskData[i].id)
      }
    }
  }

  // 项目
  test1 = () => {
    const { jobProjectsModel, user } = this.props
    const { listProject } = jobProjectsModel
    const { currentUser } = user
    const { id } = currentUser
    const list = []
    for (let i = 0; i < listProject.length; i++) {
      if (listProject[i].executorId === id) {
        this.subscribe1(id, listProject[i].id, 'PROJECT')
        list.push(listProject[i].id)
      }
    }
  }

  render () {
    const { user } = this.props
    const { currentUser } = user
    const { id } = currentUser
    return (
      <PageHeaderWrapper title={false}>
        <div>
          <div style={{ width: '33%', float: 'left' }}>
            {/* {id !== undefined && <MessageBoardView id={id} title="提醒" />} */}
            <MessageBoardView title="提醒" />
          </div>
          <div style={{ width: '33%', float: 'left' }}>
            <MessageView title="消息" />
          </div>
          <div style={{ width: '33%', float: 'left' }}>
            <AnnounceView title="通知" />
          </div>
          <BackTop />
        </div>
      </PageHeaderWrapper >
    );
  }
}

export default Form.create()(NoticeListIndex);
