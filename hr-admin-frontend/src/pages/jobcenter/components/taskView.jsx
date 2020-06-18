/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and availabel online at */
import React, { Component } from 'react';
import { BackTop, Tabs } from 'antd';
import TaskTimelineView from './taskTimelineView';
import TaskCommentView from './taskCommentView';
import TaskFileView from './taskFileView';
import TaskBaseInfoView from './taskBaseInfoView';
import SubTaskView from './subTaskView';


const { TabPane } = Tabs;
/**
 * 编辑工作任务
 * @author b__c<br> bc@dtsea.net<br>2019-01-11 23:46:15
 */

export default class TaskView extends Component {
  state = {
    showApplication: false,
    showProject: false,
    tabKey: '1',
  };

  onShowAppDrawer = () => {
    this.setState({
      showApplication: true,
    });
  };

  onCloseAppDrawer = () => {
    this.setState({
      showApplication: false,
    });
  };

  onShowProjectDrawer = () => {
    this.setState({
      showProject: true,
    });
  };

  onCloseProjectDrawer = () => {
    this.setState({
      showProject: false,
    });
  };


  onChangeTab = key => {
    this.setState({
      tabKey: key,
    });
  };

  onSubmit = e => {
    const values = formUtil.getValues(e, this);
    if (values) {
      // jobTaskFlux.update(values);
    }
  };

  // 递归获得当前节点及子节点
  getIds = (record, ids) => {
    if (record.children !== undefined) {
      const { children } = record;
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        this.getIds(child, ids);
      }
    }
    ids.push(record.id);
  };

  render() {
    const {
      dataSource,
      onSave,
      onFind,
      onRemove,
      onFindRecord,
      onSaveComments,
      onFindComments,
      onRemoveComments,
      onUpdateTask,
      isParentTask,
      jobCommentsModel,
      onFindCommentsPage,
      onRemoveTask,
    } = this.props;
    if (!dataSource) return false;
    const taskInfoData = {
      data: dataSource,
      onUpdateTask,
      isParentTask,
      onRemoveTask,
    };
    const jobRecordsData = {
      jobTasksModel: this.props.jobTasksModel,
      ...this.props.jobRecordsModel,
      taskId: dataSource.id,
      onFindRecord,
    };
    const commentsData = {
      taskId: dataSource.id,
      data: this.props.commentsData,
      onSaveComments,
      onFindComments,
      onRemoveComments,
      jobCommentsModel,
      onFindCommentsPage,
      onFindRecord,
    };
    const filesData = {
      onSave,
      onFind,
      onRemove,
      id: dataSource.id,
      data: this.props.filesData,
      onFindRecord,
    };
    const { onSaveTask, onFindTaskTree } = this.props;
    const subTaskData = {
      dataSource,
      onSaveTask,
      onFindTaskTree,
      getIds: this.getIds,
      onRemoveTask,
    };
    return (
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        <TaskBaseInfoView {...taskInfoData}/>
        <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
          <TabPane tab="动态" key="1">
            <TaskTimelineView dataSource={jobRecordsData} />
          </TabPane>
          <TabPane tab="评论" key="2">
            <TaskCommentView {...commentsData}/>
          </TabPane>
          <TabPane tab="附件" key="3">
            <TaskFileView {...filesData}/>
          </TabPane>
        {
          isParentTask &&
          <TabPane tab="子任务" key="4">
            <SubTaskView {...subTaskData}/>
          </TabPane>
        }
        </Tabs>
        <BackTop />
      </div>
    );
  }
}
