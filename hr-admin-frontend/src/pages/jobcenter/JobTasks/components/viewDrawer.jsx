import React, { Component } from 'react';
import { Drawer, message, Skeleton, Spin } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import TaskView from '../../components/taskView';

@connect(({ jobTasksModel, jobRecordsModel, myJobsModel, jobCommentsModel, loading }) => ({
  jobTasksModel,
  myJobsModel,
  jobRecordsModel,
  jobCommentsModel,
  loading,
}))
class JobTasksViewDrawer extends Component {
  jobTasksModelName = 'jobTasksModel';

  modelName = 'myJobsModel';

  state = {
    filter: {},
    taskLoading: false,
    fileLoading: false,
    recordLoading: false,
    commentLoading: false,
  };

  componentDidMount() {
    const { selectedItem } = this.props;
    this.findTasks({ id: selectedItem.id });
    this.findFiles({ taskId: selectedItem.id });
    this.fetchComments({ taskId: selectedItem.id });
    this.findCommentPage({ taskId: selectedItem.id, pageNum: 1 });
    this.findTaskLogs({ taskId: selectedItem.id });
  }

  findFiles = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchFiles`,
      payload: filter,
    });
  };

  // 修改任务信息
  updateTask = (id, values) => {
    const { dispatch, makeTree, selectTreeKey } = this.props;
    const { filter } = this.state;
    const payload = { id, ...values };
    dispatch({
      type: `${this.jobTasksModelName}/update`,
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
        this.findTasks(filter);
        // onFindTaskTree({ pid: id });
        if (makeTree !== undefined) {
          makeTree({ projectId: selectTreeKey });
        }
      },
    });
  };

  findTasks = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.jobTasksModelName}/fetch`,
      payload: { ...filter },
      callback: response => {
        if (response.code === ErrorCode.FAILURE) {
          message.error('查询失败，请重试');
        } else if (response.code !== ErrorCode.SUCCESS) {
          this.callbackDefault(response);
        }
      },
    });
    this.setState({ filter });
  };

  // 删除任务讨论
  removeComments = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobCommentsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除评论回复成功！');
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
    const { dispatch } = this.props;
    dispatch({
      type: 'jobRecordsModel/findLog',
      payload: {
        ...record,
      },
      callback: response => {},
    });
  };

  // 添加评论
  addComment = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobCommentsModel/add',
      payload: { ...values },
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

  renderTaskView(data) {
    const {
      selectedItem,
      jobTasksModel,
      myJobsModel,
      jobRecordsModel,
      jobCommentsModel,
      loading,
    } = this.props;
    const { commentsData, filesData } = myJobsModel;
    if (!data) return <Skeleton avatar active />;
    const taskEditData = {
      dataSource: data,
      filesData,
      commentsData,
      onSave: this.addFile,
      onRemove: this.deleteFile,
      onFind: this.findFiles,
      onFindComments: this.fetchComments,
      onFindCommentsPage: this.findCommentPage,
      onRemoveComments: this.removeComments,
      callbackDefault: this.callbackDefault,
      jobRecordsModel,
      jobTasksModel,
      jobCommentsModel,
      onFindRecord: this.findTaskLogs,
      onSaveComments: this.addComment,
      onUpdateTask: this.updateTask,
    };
    return <TaskView {...taskEditData} />;
  }

  render() {
    const {
      visible,
      onClose,
      jobTasksModel: { data },
      selectedItem,
    } = this.props;
    return (
      <Drawer width="50%" visible={visible} onClose={onClose} title="任务详情">
        {this.renderTaskView(data[0])}
      </Drawer>
    );
  }
}

export default JobTasksViewDrawer;
