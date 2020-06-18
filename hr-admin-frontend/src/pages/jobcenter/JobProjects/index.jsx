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
  Tag,
  Progress,
  Icon,
  Tree,
  Input,
  Spin,
} from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import JobProjectsAddModal from './components/addModal';
import JobProjectsEditModal from './components/editModal';
import JobProjectsViewDrawer from './components/viewDrawer';
import JobProjectsSearchBar from './components/searchBar';

const { Search } = Input;
const dataList = [];
const generateList = data => {
  dataList.splice(0, dataList.length);
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: node.categoryName });
    if (node.children) {
      generateList(node.children);
    }
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
@connect(({ jobProjectsModel, jobProjectCategoryModel, jobProductsModel, loading }) => ({
  jobProjectsModel,
  jobProjectCategoryModel,
  jobProductsModel,
  loading,
}))
class JobProjectsIndex extends Component {
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
    expandList: true,
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    projectLoading: false,
    categoryId: '',
    selectTreeKey: '',
  };

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
    this.categoryTree(filter);
    this.findProduct(filter);
  }

  /** ********************************************************************************************* */

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: {
        id: record.id,
      },
    });
  };

  hideDrawer = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  showAddModal = () => {
    const { jobProjectCategoryModel, jobProductsModel } = this.props;
    const { treeData } = jobProjectCategoryModel;
    const { categoryId } = this.state;
    this.setState({
      addData: {
        title: '新建项目信息',
        visible: true,
        confirmLoading: false,
        record: {},
        treeData,
        jobProductsModel,
        categoryId,
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
    const { jobProjectCategoryModel, jobProductsModel } = this.props;
    const { treeData } = jobProjectCategoryModel;
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑项目信息',
        visible: true,
        confirmLoading: false,
        record,
        treeData,
        jobProductsModel,
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

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /** ********************************************************************************************* */

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
      callback: response => {
        generateList(response.data);
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    this.setState({ projectLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
      callback: response => {
        this.setState({ projectLoading: false });
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建项目信息成功！');
            const { pageNumber, pageSize, categoryId } = this.state;
            this.findPage(pageNumber, pageSize, { categoryId });
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
    const payload = { id, ...values };
    dispatch({
      type: 'jobProjectsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改项目信息成功！');
            const { pageNumber, pageSize, categoryId } = this.state;
            this.findPage(pageNumber, pageSize, { categoryId });
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

  delete = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            this.setState({ selectedRowKeys: [] });
            message.success('删除项目信息成功！');
            const { pageNumber, pageSize, categoryId } = this.state;
            this.findPage(pageNumber, pageSize, { categoryId });
            break;
          case ErrorCode.FAILURE:
            message.error('删除项目信息失败！');
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

  columns = [
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
            <Tag
              style={{ marginTop: '2px' }}
              key={item}
              color={
                item === '日常任务'
                  ? 'orange'
                  : item === '重要任务'
                  ? 'lime'
                  : item === '紧急任务'
                  ? 'cyan'
                  : item === '学习发展'
                  ? 'blue'
                  : '#b53fa1'
              }
            >
              {item}
            </Tag>
          ));
        return <span>{loop(words)}</span>;
      },
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
      title: '任务进度',
      dataIndex: 'progress',
      render(text, record) {
        return <Progress percent={parseInt(record.progress)} size="small" />;
      },
    },
    {
      title: '责任人',
      dataIndex: 'executorName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除项目信息吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 树控件搜索框change
  onCategorySearch = value => {
    this.categoryTree({ categoryName: value });
  };

  // 展开树控件
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 选中树节点
  selectCategory = e => {
    const { pageNumber, pageSize } = this.state;
    this.setState({ categoryId: e.toString() });
    this.findPage(pageNumber, pageSize, { categoryId: e.toString() });
  };

  onChange = e => {
    const { value } = e.target;
    const { jobProjectCategoryModel } = this.props;
    const { treeData } = jobProjectCategoryModel;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  // 项目类型树控件
  renderCategoryList = () => {
    const { jobProjectCategoryModel } = this.props;
    const { treeData } = jobProjectCategoryModel;
    const { expandedKeys, autoExpandParent, searchValue } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    return (
      <div>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="请输入关键字"
          onChange={this.onChange}
          onSearch={this.onCategorySearch}
        />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(Array.from(treeData !== undefined && treeData !== null ? treeData : []))}
          onSelect={this.selectCategory}
        />
      </div>
    );
  };

  // 项目列表
  renderProjectList = () => {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData, projectLoading } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      form,
      jobProjectsModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const {
      loading: { effects },
    } = this.props;
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <JobProjectsSearchBar
            form={form}
            categoryId={this.state.categoryId}
            pagination={paginationProps}
            onFind={this.findPage}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ marginBottom: '16px', marginRight: '8px' }}>
            <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新建
            </Button>
          </span>
          {selectedRowKeys.length > 0 ? (
            <span>
              <Popconfirm
                title="您确认需要批量删除项目信息吗？"
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
          loading={effects['jobProjectsModel/fetch']}
          columns={this.columns}
          dataSource={data}
          pagination={paginationProps}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
        />
        {this.state.viewVisible && (
          <JobProjectsViewDrawer
            visible={this.state.viewVisible}
            {...this.state.viewData}
            page={{ pageNumber, pageSize }}
            onClose={this.hideDrawer}
          />
        )}
        {addData.visible && <JobProjectsAddModal {...addData} />}
        {editData.visible && <JobProjectsEditModal {...editData} />}
      </div>
    );
  };

  renderSimpleList() {
    return (
      <PageHeaderWrapper title="任务列表">
        <Card>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="right" />
          </a>
          {this.renderProjectList()}
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderAdvancedList = () => (
    <PageHeaderWrapper>
      <Card style={{ width: '30%', float: 'left', marginRight: '1%' }}>
        {this.renderCategoryList()}
      </Card>
      <Card style={{ width: '69%', float: 'left' }}>
        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
          <Icon type="vertical-right" />
        </a>
        {this.renderProjectList()}
      </Card>
    </PageHeaderWrapper>
  );

  render() {
    const { expandList } = this.state;
    return <div>{expandList ? this.renderAdvancedList() : this.renderSimpleList()}</div>;
  }
}

export default Form.create()(JobProjectsIndex);
