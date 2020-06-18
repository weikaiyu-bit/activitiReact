/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Card, Icon, Tabs, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import TaskListView from '../components/taskListView';
import TaskView from '../components/taskView';

const { TabPane } = Tabs;

/**
 * 我的任务
 * @author b__c<br> bc@dtsea.net<br>2019-01-11 23:45:52
 */
@connect(({ jobTasksModel, jobRecordsModel, myJobsModel, jobCommentsModel, loading }) => ({
  jobTasksModel,
  jobRecordsModel,
  myJobsModel,
  jobCommentsModel,
  loading,
}))
export default class JobMyTaskPage extends PureComponent {
  state = {
    expandList: true,
    tabKey: '1',
    filter: {},
    taskListDataSource: [],
    taskViewLoading: false,
    onClickList: false,
  };

  modelName = 'myJobsModel';

  componentDidMount() {
    this.findTasks({ pid: 0 });
    this.fetchComments({});
    this.findAllTasks({});
  }

  // 删除任务讨论
  removeComments = ids => {
    console.log(ids);
    const { dispatch } = this.props;
    dispatch({
      type: 'jobCommentsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除评论回复成功！');
            this.fetchComments({});
            break;
          case ErrorCode.FAILURE:
            message.error('删除评论回复失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  // 添加评论
  addComment = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobCommentsModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('评论回复成功！');
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  // 分页搜索任务记录
  findCommentPage = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobCommentsModel/fetchCommentPage',
      payload: {
        ...filter,
      },
    });
  };

  // 搜索任务讨论记录
  fetchComments = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myJobsModel/fetchComments',
      payload: {
        ...record,
      },
    });
  };

  // 搜索任务日志
  findTaskLogs = record => {
    this.setState({ taskViewLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'jobRecordsModel/findLog',
      payload: {
        ...record,
      },
      callback: response => {
        this.setState({ taskViewLoading: false, onClickList: false });
      },
    });
  };

  // 搜索所有任务
  findAllTasks = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/fetchTask',
      payload: {
        ...filter,
      },
    });
  };

  findFiles = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchFiles`,
      payload: filter,
    });
  };

  addTask = (values, filterId) => {
    const { dispatch } = this.props;
    console.log('addValue=', values);
    dispatch({
      type: 'jobTasksModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建任务信息成功！');
            if (filterId) {
              this.findTaskTree({ pid: filterId });
            } else {
              this.findTasks({ pid: 0 });
            }
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            if (filterId) {
              this.findTaskTree({ pid: filterId });
            }
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  updateTask = (id, values) => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    const payload = { id, ...values };
    dispatch({
      type: 'jobTasksModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改任务信息成功！');
            break;
          case ErrorCode.FAILURE:
            message.error('修改任务信息失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
        this.findTasks({ ...filter, pid: 0 });
        this.findTaskLogs({ taskId: id });
      },
    });
  };

  addFile = values => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/addFile`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            this.findFiles({ taskId: values.taskId });
            message.success('附件上传成功！');
            break;
          case ErrorCode.FAILURE:
            message.error('附件上传失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  deleteTask = (ids, selectedItemId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除任务信息成功！');
            this.findTaskTree({ pid: selectedItemId });
            this.findTasks({ pid: 0 });
            break;
          case ErrorCode.FAILURE:
            message.error('删除任务信息失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  deleteFile = (ids, taskId) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/removeFile`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除附件成功!');
            this.findFiles({ taskId });
            break;
          case ErrorCode.FAILURE:
            message.error('删除附件失败!');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  findComments = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchComments`,
      payload: filter,
    });
  };

  findTaskTree = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchTaskTree`,
      payload: filter,
      callback: response => {
        if (response.code === ErrorCode.FAILURE) {
          message.error('查询失败，请重试');
        } else if (response.code !== ErrorCode.SUCCESS) {
          this.callbackDefault(response);
        }
      },
    });
  };

  findProjects = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchProjects`,
      payload: filter,
    });
  };

  findMembers = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchMembers`,
      payload: filter,
    });
  };

  findEditMembers = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchEditMembers`,
      payload: filter,
    });
  };

  onSelected = item => {
    this.setState({ onClickList: true });
    const {
      myJobsModel: { data },
    } = this.props;
    this.findFiles({ taskId: item.id });
    this.findComments({ taskId: item.id });
    this.findCommentPage({ taskId: item.id, pageNum: 1 });
    this.findTaskLogs({ taskId: item.id });
    this.findTaskTree({ pid: item.id });
    this.changeColor(data, item, '#64afff', '');
    this.findEditMembers({ projectId: item.projectId });
    this.setState({
      selectedItem: item,
    });
  };

  onChangeTab = key => {
    this.findTasks({ pid: 0 });
    this.setState({
      tabKey: key,
    });
  };

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  findTasks = filter => {
    const { dispatch } = this.props;
    const { selectedItem } = this.state;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: { ...filter },
      callback: response => {
        if (response.code === ErrorCode.FAILURE) {
          message.error('查询失败，请重试');
        } else if (response.code !== ErrorCode.SUCCESS) {
          this.callbackDefault(response);
        }
        this.setState({ filter });
        const { data } = response;
        if (!selectedItem) {
          this.setState({ taskListDataSource: data });
          return;
        }
        const index = data.findIndex(item => item.id === selectedItem.id);
        if (index === -1) {
          this.setState({ selectedItem: null });
          this.setState({ taskListDataSource: data });
          return;
        }
        this.setState({ selectedItem: data[index] });
        this.changeColor(data, data[index], '#64afff', '');
      },
    });
  };

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  changeColor = (data, currentItem, color, color2) => {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (currentItem) {
        if (currentItem.id === item.id) {
          item.isSelected = true;
          item.itemColor = color;
        } else {
          item.isSelected = false;
          item.itemColor = color2;
        }
      } else if (currentItem.id === item.id || item.isSelected) {
        item.itemColor = color;
      } else {
        item.itemColor = color2;
      }
    }
    this.setState({ taskListDataSource: data });
  };

  renderTaskView() {
    const { myJobsModel, jobRecordsModel, jobTasksModel, jobCommentsModel } = this.props;
    const { selectedItem } = this.state;
    const { filesData, commentsData } = this.props.myJobsModel;
    if (!selectedItem) return false;
    const taskEditData = {
      dataSource: selectedItem,
      filesData,
      onSave: this.addFile,
      onRemove: this.deleteFile,
      onFind: this.findFiles,
      onFindComments: this.fetchComments,
      onFindCommentsPage: this.findCommentPage,
      commentsData,
      callbackDefault: this.callbackDefault,
      isParentTask: true,
      onSaveTask: this.addTask,
      myJobsModel,
      jobRecordsModel,
      jobTasksModel,
      jobCommentsModel,
      onFindRecord: this.findTaskLogs,
      onSaveComments: this.addComment,
      onFindTaskTree: this.findTaskTree,
      onRemoveTask: this.deleteTask,
      onRemoveComments: this.removeComments,
      onUpdateTask: this.updateTask,
    };
    return <TaskView {...taskEditData} />;
  }

  renderSimpleList() {
    return (
      <PageHeaderWrapper title="我的任务">
        <Card>
          <a onClick={this.toggleForm}>
            <Icon type="right" />
          </a>
          {this.renderTaskView()}
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderAdvancedList() {
    const { tabKey, taskListDataSource, taskViewLoading, onClickList } = this.state;
    if (taskListDataSource.length === 0) {
      return false;
    }
    const taskListData = {
      dataSource: taskListDataSource,
      onSelected: this.onSelected,
      onFind: this.findTasks,
      tabKey,
      onFindProject: this.findProjects,
      onFindMembers: this.findMembers,
      add: this.addTask,
      changeColor: this.changeColor,
    };
    return (
      <PageHeaderWrapper title="我的任务">
        <Card style={{ width: '30%', float: 'left', marginRight: '1%' }}>
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
            <TabPane tab="我负责的" key="1">
              <TaskListView {...taskListData} />
            </TabPane>
            <TabPane tab="我指派的" key="2">
              <TaskListView {...taskListData} />
            </TabPane>
            <TabPane tab="我参与的" key="3">
              <TaskListView {...taskListData} />
            </TabPane>
          </Tabs>
        </Card>

        <Card style={{ width: '69%', float: 'left' }}>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="left" />
          </a>
          <Spin spinning={onClickList && taskViewLoading} size="large">
            {!onClickList && this.renderTaskView()}
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }

  render() {
    const { expandList } = this.state;
    return <div>{expandList ? this.renderAdvancedList() : this.renderSimpleList()}</div>;
  }
}
