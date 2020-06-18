import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Table,
  Card,
  Button,
  Divider,
  Popconfirm,
  Form,
  message,
  Avatar,
  Select,
  Tag,
  Progress,
  Input,
  Icon,
  Switch,
  Col,
} from 'antd';
import router from 'umi/router';
import myStyle from '@/assets/css/style.css';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import JobTasksAddModal from './components/addModal';
import JobTasksEditModal from './components/editModal';
import JobTasksViewDrawer from './components/viewDrawer';
import JobTasksSearchBar from './components/searchBar';
import JobProjectsViewDrawer from '../JobProjects/components/viewDrawer';

const { Search } = Input;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Option } = Select;
@connect(({ jobTasksModel, jobRecordsModel, myJobsModel, jobProjectsModel, loading }) => ({
  jobTasksModel,
  jobRecordsModel,
  myJobsModel,
  jobProjectsModel,
  loading,
}))
class JobTasksIndex extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
    },
    projectViewData: {},
    expandList: true,
    selectTreeKey: -1,
    taskView: false,
    selectIndex: -1,
    hideSwitch: true,
  };

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findProject(pageNumber, pageSize, filter);
    // this.makeTree(filter);
    this.findJobMembers(filter);
    this.fetchComments(filter);
    this.findTaskLogs(filter);
    this.findTasks(filter);
    this.makeTreeProject(filter);
    this.findAllProject(filter);
  }

  /** ********************************************************************************************* */
  // 项目抽屉
  showProjectDrawer = record => {
    this.setState({
      projectViewData: {
        viewVisible: true,
        viewData: record.id,
      },
    });
  };

  hideProjectDrawer = () => {
    this.setState({
      projectViewData: {
        viewVisible: false,
        viewData: {},
      },
    });
  };

  showDrawer = record => {
    this.setState({
      viewData: {
        visible: true,
        selectedItem: record,
        onClose: this.hideDrawer,
      },
    });
  };

  hideDrawer = () => {
    this.setState({
      viewData: {
        visible: false,
      },
    });
  };

  // 新增子任务
  addChildren = record => {
    const { selectTreeKey } = this.state;
    this.setState({
      addData: {
        title: '新建任务信息',
        visible: true,
        confirmLoading: false,
        type: 'children',
        record: {},
        projectId: selectTreeKey,
        pidData: { ...record },
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  showAddModal = () => {
    const { selectTreeKey } = this.state;
    this.setState({
      addData: {
        title: '新建任务信息',
        visible: true,
        confirmLoading: false,
        type: 'root',
        record: {},
        projectId: selectTreeKey,
        pidData: { id: 0 },
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  hideAddModal = () => {
    this.setState({
      addData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑任务信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
    });
  };

  hideEditModal = () => {
    this.setState({
      editData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  renderTableClass = record => {
    if (record.taskStatus === 'completed' || record.taskStatus === 'undone') {
      return myStyle.grayDisplay;
    }
    return false;
  };

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findProject(pagination.current, pagination.pageSize, this.state.filter);
  };

  // eslint-disable-next-line max-len
  /** ********************************************************************************************* */

  // 项目列表搜索框搜索
  onProjectSearch = value => {
    console.log(value);
    const { pageNumber, pageSize } = this.state;
    this.findProject(pageNumber, pageSize, { projectName: value });
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
      type: 'jobRecordsModel/find',
      payload: {
        ...record,
      },
    });
  };

  // 搜索任务成员
  findJobRsTaskUser = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/findJobRsTaskUser',
      payload: {
        ...filter,
      },
    });
  };

  // 搜索项目成员
  findJobMembers = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/findJobMembers',
      payload: {
        ...filter,
      },
    });
  };

  // 跳转到设计界面
  gotoDesign = record => {
    router.push('/jobcenter/JobTasks/JobDesign');
    router.push({
      pathname: '/jobcenter/JobTasks/JobDesign',
      query: {
        record,
      },
    });
  };

  // 搜索所有项目
  findProject = (pageNumber, pageSize, filter) => {
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

  // 生成树
  makeTree = filter => {
    this.setState({ taskLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/makeTree',
      payload: {
        ...filter,
      },
      callback: response => {
        this.setState({ taskLoading: false });
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = values => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    dispatch({
      type: 'jobTasksModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建任务信息成功！');
            const { selectTreeKey } = this.state;
            this.makeTree({ projectId: selectTreeKey });
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

  update = (id, values) => {
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
            const { selectTreeKey } = this.state;
            this.makeTree({ projectId: selectTreeKey });
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

  // 删除树节点及节点以下任务
  getIds = (record, ids) => {
    console.log(record);
    if (record.children !== undefined) {
      const { children } = record;
      for (let i = 0; i < children.length; i += 1) {
        const a = children[i];
        this.getIds(a, ids);
      }
    }
    ids.push(record.id);
    return ids;
  };

  deleteBranch = record => {
    const ids = this.getIds(record, []);
    this.delete(ids);
  };

  delete = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            this.setState({ selectedRowKeys: [] });
            message.success('删除任务信息成功！');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
            const { selectTreeKey } = this.state;
            this.makeTree({ projectId: selectTreeKey });
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

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  // eslint-disable-next-line react/sort-comp
  columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render(text) {
        if (!text) return false;
        const words = text.split(',');
        const loop = words =>
          words.map(item => (
            <Tag key={item} color={renderTagsColor(item)}>
              {item}
            </Tag>
          ));
        return <span>{loop(words)}</span>;
      },
    },
    {
      title: '责任人',
      dataIndex: 'executorName',
    },
    {
      title: '任务进度',
      dataIndex: 'progress',
      render(text, record) {
        // eslint-disable-next-line radix
        return <Progress percent={parseInt(record.progress)} size="small" />;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      render(text) {
        let color = '';
        switch (text) {
          case 'editing':
            text = '编辑中';
            color = 'orange';
            break;
          case 'planning':
            text = '计划中';
            color = 'lime';
            break;
          case 'doing':
            text = '进行中';
            color = 'cyan';
            break;
          case 'completed':
            text = '已完成';
            color = 'blue';
            break;
          case 'delay':
            text = '已逾期';
            color = 'magenta';
            break;
          case 'pause':
            text = '暂停';
            color = '#CCCCCC';
            break;
          case 'undone':
            text = '已撤销';
            color = '#666666';
            break;
          case 'refuse':
            text = '已驳回';
            color = '#666666';
            break;
          default:
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.addChildren(record)}>添加子任务</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除任务信息吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 任务列表
  renderTaskList = () => {
    const {
      pageNumber,
      pageSize,
      selectedRowKeys,
      addData,
      editData,
      viewData,
      selectTreeKey,
      hideSwitch,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      jobTasksModel: { data = [], total, tree, projectData, jobMembers },
    } = this.props;
    const {
      loading: { effects },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const ad = {
      projectData,
      jobMembers,
    };
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <JobTasksSearchBar
            form={form}
            pagination={paginationProps}
            selectTreeKey={selectTreeKey}
            onFind={this.makeTree}
            hideSwitch
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ marginBottom: '16px', marginRight: '8px' }}>
            <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新建任务
            </Button>
          </span>
          {selectedRowKeys.length > 0 ? (
            <span>
              <Popconfirm
                title="您确认需要批量删除任务信息吗？"
                onConfirm={() => this.delete(selectedRowKeys)}
              >
                <Button icon="delete">批量删除</Button>
              </Popconfirm>
            </span>
          ) : (
            ''
          )}
        </div>
        <Table
          rowKey="id"
          loading={effects['jobTasksModel/makeTree']}
          columns={this.columns}
          dataSource={tree}
          pagination={false}
          rowSelection={rowSelection}
          rowClassName={this.renderTableClass}
        />
        {viewData.visible && (
          <JobTasksViewDrawer
            {...viewData}
            selectTreeKey={selectTreeKey}
            makeTree={this.makeTree}
          />
        )}
        {addData.visible && <JobTasksAddModal {...addData} {...ad} />}
        {editData.visible && <JobTasksEditModal {...editData} {...ad} />}
      </div>
    );
  };

  handleSwitchChange = checked => {
    this.setState({
      hideSwitch: checked,
    });
  };

  projectColumns = [
    {
      title: '项目logo',
      dataIndex: 'projectLogo',
      render(text, record) {
        return (
          <Avatar
            shape="square"
            style={{ backgroundColor: record.logoColor, verticalAlign: 'middle' }}
          >
            {text}
          </Avatar>
        );
      },
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      render: (text, record) => <a onClick={() => this.showProjectDrawer(record)}>{text}</a>,
    },
    {
      title: '项目状态',
      dataIndex: 'taskStatus',
      render(text, record) {
        // let text = (typeof record == 'object')? record.status: record;
        let color = '';
        switch (text) {
          case 'editing':
            text = '编辑中';
            color = 'orange';
            break;
          case 'planning':
            text = '计划中';
            color = 'lime';
            break;
          case 'doing':
            text = '进行中';
            color = 'cyan';
            break;
          case 'completed':
            text = '已完成';
            color = 'blue';
            break;
          case 'delay':
            text = '已逾期';
            color = 'magenta';
            break;
          case 'pause':
            text = '暂停';
            color = '#CCCCCC';
            break;
          case 'undone':
            text = '已撤销';
            color = '#666666';
            break;
          case 'refuse':
            text = '已驳回';
            color = '#666666';
            break;
          default:
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '责任人',
      dataIndex: 'executorName',
    },
  ];

  onClickProject = (record, rowkey) => {
    this.setState({
      taskView: true,
      selectTreeKey: record.id,
    });
    this.makeTree({ projectId: record.id });
  };

  // 项目列表
  renderProjectList = () => {
    const {
      jobProjectsModel: { data = [] },
    } = this.props;
    const { projectViewData, selectIndex } = this.state;
    const {
      loading: { effects },
    } = this.props;
    const rowStyle = {
      backgroundColor: '#64afff',
    };
    return (
      <div>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="请输入关键字"
          onSearch={this.onProjectSearch}
        />
        <span style={{ fontSize: 20 }}>
          <a title="过滤条件">
            <Icon type="filter" />
          </a>
          <a title="按开始日期排序">
            <Icon type="sort-ascending" />
          </a>
        </span>
        <Table
          rowKey="id"
          loading={effects['jobProjectsModel/fetch']}
          showHeader={false}
          columns={this.projectColumns}
          dataSource={data}
          onChange={this.handleTableChange}
          onRowClick={this.onClickProject}
          rowClassName={(record, index) => (index === selectIndex ? 'rowColor' : '')}
          onRow={(record, index) => ({
            onClick: e => {
              this.setState({ selectIndex: index });
              let tr = e.target.parentNode; // 拿到tr标签
              if (tr.nodeName !== 'TR') {
                tr = tr.parentNode;
              }
              // 给所有tr标签设置颜色
              for (let i = 0; i < tr.parentNode.childNodes.length; i += 1) {
                if (i === index) {
                  tr.parentNode.childNodes[i].childNodes[1].childNodes[0].style.color = '#FFFFFF';
                  tr.parentNode.childNodes[i].style.color = '#FFFFFF';
                  tr.parentNode.childNodes[i].style.backgroundColor = '#64afff';
                } else {
                  tr.parentNode.childNodes[i].childNodes[1].childNodes[0].style.color = '#40A9FF';
                  tr.parentNode.childNodes[i].style.color = '#505659';
                  tr.parentNode.childNodes[i].style.backgroundColor = '#FFFFFF';
                }
              }
              // 单独设置被选中的标签颜色
              // tr.style.color = 'FFCC66';
            },
          })}
        />
        {projectViewData.viewVisible && (
          <JobProjectsViewDrawer
            visible={projectViewData.viewVisible}
            id={projectViewData.viewData}
            onClose={this.hideProjectDrawer}
          />
        )}
      </div>
    );
  };

  renderSimpleList() {
    return (
      <PageHeaderWrapper title="任务列表">
        <Card style={{ width: '30%', float: 'left', marginRight: '1%' }}>
          {this.renderProjectList()}
        </Card>
        <Card style={{ width: '69%', float: 'left' }}>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="left" />
          </a>
          {this.state.taskView && this.renderTaskList()}
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderAdvancedList() {
    return (
      <PageHeaderWrapper title="任务列表">
        <Card>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="right" />
          </a>
          {this.state.taskView && this.renderTaskList()}
        </Card>
      </PageHeaderWrapper>
    );
  }

  render() {
    console.log(this.props);
    const { expandList } = this.state;
    return <div>{expandList ? this.renderSimpleList() : this.renderAdvancedList()}</div>;
  }
}

const renderTagsColor = item => {
  switch (item) {
    case '紧急任务':
      return '#f50';
    case '重要任务':
      return '#108ee9';
    case '日常任务':
      return '#2db7f5';
    case '学习发展':
      return '#87d068';
    case 'BUG':
      return 'red';
    case '需求变更':
      return 'orange';
    case '新需求':
      return 'green';
    default:
      return 'default';
  }
};

export default Form.create()(JobTasksIndex);
