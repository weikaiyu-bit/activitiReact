import React, { Component } from 'react';
import { Drawer, Spin, message } from 'antd';
import { connect } from 'dva';
import ProjectView from '../../components/projectView';
import ErrorCode from '../../../../dtsea/common/ErrorCode';

@connect(
  ({
    jobProjectsModel,
    jobTasksModel,
    myJobsModel,
    jobMembersModel,
    jobProjectCategoryModel,
    jobProductsModel,
    loading,
  }) => ({
    jobProjectsModel,
    jobTasksModel,
    myJobsModel,
    jobMembersModel,
    jobProjectCategoryModel,
    jobProductsModel,
    loading,
  }),
)
class JobProjectsViewDrawer extends Component {
  state = {
    selectItem: [],
    viewDrawerLoading: false,
    memberPageNumber: 1,
    memberPageSize: 10,
  };

  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  modelName = 'myJobsModel';

  componentDidMount() {
    const { id } = this.props;
    const { memberPageNumber, memberPageSize } = this.state;
    this.findAllProject({});
    this.makeTreeProject({ id });
    this.findAnnex({ id });
    // this.findLog({ id });
    this.findTasks({});
    this.findProjectRecord({ id });
    this.findByProjectId(id);
    this.findProjectMember(memberPageNumber, memberPageSize, { projectId: id });
    this.categoryTree({});
    this.findProduct({});
  }

  // 搜索产品
  findProduct = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProductsModel/findByExample',
      payload: {
        ...filter,
      },
    });
  };

  // 生成项目类型树
  categoryTree = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectCategoryModel/makeTree',
      payload: {
        ...filter,
      },
    });
  };

  findProjectMember = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobMembersModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  // 根据ID查询
  findByProjectId = id => {
    this.setState({ viewDrawerLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/findByProjectId',
      payload: id,
      callback: response => {
        this.setState({ viewDrawerLoading: false });
        const { data } = response;
        const { page } = this.props;
        this.setState({ selectItem: data });
        if (page !== undefined && page !== null) {
          this.findPage(page.pageNum, page.pageSize, {});
        }
      },
    });
  };

  // 搜索项目动态
  findProjectRecord = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/findProjectRecord',
      payload: {
        ...filter,
      },
    });
  };

  // 搜索任务附件
  findAnnex = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/findAnnex',
      payload: {
        ...filter,
      },
    });
  };

  // 搜索所有任务
  findTasks = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/fetchTask',
      payload: {
        ...filter,
      },
    });
  };

  // 搜索任务项目
  findAllProject = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/findProject',
      payload: {
        ...filter,
      },
    });
  };

  // 生成项目树控件
  makeTreeProject = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/makeTreeProject',
      payload: {
        ...filter,
      },
    });
  };

  // 搜索任务日志
  findTaskLogs = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobRecordsModel/find',
      payload: {
        ...record,
      },
    });
  };

  // 删除附件
  deleteFile = ids => {
    const { data } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/removeFile`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除附件成功!');
            this.findAnnex({ id: data.id });
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

  // 修改项目信息
  updateProject = (id, values) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'jobProjectsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改项目信息成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            const { id } = this.props;
            this.findByProjectId(id);
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

  render() {
    const {
      data = {},
      visible,
      jobProjectsModel,
      jobTasksModel,
      jobProductsModel,
      jobProjectCategoryModel,
    } = this.props;
    const { treeData } = jobProjectCategoryModel;
    const { selectItem, viewDrawerLoading } = this.state;
    const ProjectViewData = {
      dataSource: { ...selectItem },
      jobProjectsModel,
      jobTasksModel,
      onRemoveFile: this.deleteFile,
      onFindRecord: this.findTaskLogs,
      onFindProjectRecord: this.findProjectRecord,
      updateProject: this.updateProject,
      onFindByProjectId: this.findByProjectId,
      jobProductsModel,
      treeData,
    };
    const {
      loading: { effects },
    } = this.props;
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="项目信息">
        <Spin spinning={effects['jobProjectsModel/fetch']} size="large">
          {viewDrawerLoading === false && <ProjectView {...ProjectViewData} />}
        </Spin>
      </Drawer>
    );
  }
}

export default JobProjectsViewDrawer;
