/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at  */
import React, { PureComponent } from 'react';
import { Card, Icon, Tabs, message, BackTop } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TaskKanBanView from '../components/taskKanBanView';

const { TabPane } = Tabs;

/**
 * 我的任务
 * @author b__c<br> bc@dtsea.net<br>2019-01-11 23:45:52
 */
@connect(({ jobTasksModel, jobRecordsModel, myJobsModel, loading }) => ({
  jobTasksModel,
  jobRecordsModel,
  myJobsModel,
  loading: loading.models.fetch,
}))
export default class JobKanBanPage extends PureComponent {
  state = {
    tab: 'byState',
  };

  componentDidMount() {
    this.findAllTasks({});
  }

  findAllTasks = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/fetch',
      payload: {
        ...filter,
      },
    });
  };

  handleTabChange = key => {
    console.log('key=', key);
    switch (key) {
      case 'byState':
        this.setState({
          tab: 'byState',
        });
        break;

      case 'byTag':
        this.setState({
          tab: 'byTag',
        });
        break;
      case 'byProject':
        this.setState({
          tab: 'byProject',
        });
        break;
      case 'byExcutor':
        this.setState({
          tab: 'byExcutor',
        });
        break;
      default:
        break;
    }
    console.log('state.tab=', this.state.tab);
  };

  renderKanBan = data => {
    console.log('renderBoard');

    return (
      <div>
        <div style={{ width: '25%', float: 'left' }}>
          <TaskKanBanView dataSource={data} title="待办的" />
        </div>
        <div style={{ width: '25%', float: 'left' }}>
          <TaskKanBanView dataSource={data} title="已办的" />
        </div>
        <div style={{ width: '25%', float: 'left' }}>
          <TaskKanBanView dataSource={data} title="跟踪的" />
        </div>
        <BackTop />
      </div>
    );
  };

  render() {
    const {
      jobTasksModel: { data },
    } = this.props;
    console.log('data', data);
    if (!data) return false;

    const taskListData = {
      dataSource: data,
    };

    const tabList = [
      {
        key: 'byState',
        tab: '按状态',
      },
      {
        key: 'byTag',
        tab: '按标签',
      },
      {
        key: 'byProject',
        tab: '按项目',
      },
      {
        key: 'byExcutor',
        tab: '按负责人',
      },
    ];

    return (
      <PageHeaderWrapper title="任务看板" tabList={tabList} onTabChange={this.handleTabChange}>
        {this.renderKanBan(data)}
      </PageHeaderWrapper>
    );
  }
}
