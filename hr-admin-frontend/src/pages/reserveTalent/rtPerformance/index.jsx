import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Icon, Tree, Dropdown, Tag, Menu } from 'antd';

import moment from 'moment'
import {
  DownOutlined,
} from '@ant-design/icons';
import utils from '@/dtsea/common/utils';
import ErrorCode from '../../../dtsea/common/ErrorCode';

import RtPerformanceAddModal from './components/addModal';
import RtPerformanceEditModal from './components/editModal';
import RtPerformanceViewDrawer from './components/viewDrawer';
import RtPerformanceSearchBar from './components/searchBar';

const { TreeNode } = Tree;
const batchMenu = (
  <Menu>
    <Menu.Item>
      <a>
        任免审批表
      </a>
    </Menu.Item>
    <Menu.Item>
      <a>
        公务员职级套转表
      </a>
    </Menu.Item>
    <Menu.Item>
      <a>
        参公人员职级套转表
      </a>
    </Menu.Item>
    <Menu.Item>
      <a>
        公务员职级晋升表
      </a>
    </Menu.Item>
  </Menu>
);

@connect(({ rtPerformanceModel, loading }) => ({
  rtPerformanceModel,
  loading: loading.models.fetch,
}))
class RtPerformanceIndex extends Component {

  state = {
    expandList: true,
    tabKey: 'byList',
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
      data: {},
    },
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
    organizationLevelDictData: [],
    healthDictData: [],
    professionalAndTechnicalTitleDictData: [],
    preJobLevelDictData: [],
    currentRankDictData: [],
    nationDictData: [],
    categoryDictData: [],
    organizationData: [],
  };

  columns = [
    {
      title: '被推荐人姓名',
      dataIndex: 'name',
      ellipsis: true,
      align: 'center',
      width: 80,
      fixed: 'left',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      align: 'center',
      width: 60,
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
      ellipsis: true,
      align: 'center',
      width: 110,
      key: 'birth',
      render: text => this.renderDate(text),
    },
    {
      title: '民族',
      dataIndex: 'national',
      ellipsis: true,
      align: 'center',
      width: 70,
    },
    {
      title: '籍贯',
      dataIndex: 'nativePlace',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '婚姻状况',
      dataIndex: 'maritalStatus',
      ellipsis: true,
      align: 'center',
      width: 70,
    },
    {
      title: '健康状况',
      dataIndex: 'health',
      ellipsis: true,
      align: 'center',
      width: 70,
    },
    {
      title: '政治面貌',
      dataIndex: 'politicalOrientation',
      ellipsis: true,
      align: 'center',
      width: 70,
    },
    {
      title: '参加工作时间',
      dataIndex: 'workTime',
      ellipsis: true,
      align: 'center',
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '所在单位',
      dataIndex: 'orgName',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '业绩简介',
      dataIndex: 'performanceProfile',
      ellipsis: true,
      key: 'performanceProfile',
      width: 100,
      align: 'center',
    },
    {
      title: '推荐人',
      dataIndex: 'recommender',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '推荐时间',
      dataIndex: 'recommendedTime',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '投票计数',
      dataIndex: 'voteCount',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      align: 'center',
      width: 90,
      render: (text, data) => {
        switch (data.state) {
          case '编辑中':
            return <Tag color="orange">{data.state}</Tag>;
          case '投票中':
            return <Tag color="cyan">{data.state}</Tag>;
          case '已关闭':
            return <Tag color="#CCC">{data.state}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      ellipsis: true,
      align: 'center',
      width: 250,
      fixed: 'right',
      render: (text, record) => (
        <>
          <a onClick={() => this.showAddModal(record)}>新建</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <a >发布</a>
          <Divider type="vertical" />
          <a >撤下</a>
          <Divider type="vertical" />
          <a >关闭</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除个人业绩展示信息吗？" onConfirm={() => this.delete([record.uid])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  /*********************************************************************************** */

  componentDidMount() {
    // 查询人才分类
    this.findRtCategory({
      tenantId: 5,
    }, response => {
      if (response.code === ErrorCode.SUCCESS) {
        this.setState({
          organizationData: utils.dataToTree(response.data),
        });
      }
    });
    // 97:民族   级别:16   现职级:96  先职务层次: 95  专业技术职称:29   人员类别: 99  健康状况: 28
    this.findDictData({
      dataIds: [99, 97, 96, 95, 29, 28, 16],
    }, response => {
      if (response.code === ErrorCode.SUCCESS) {
        const organizationLevel = [];
        const health = [];
        const professionalAndTechnicalTitle = [];
        const preJobLevel = [];
        const currentRank = [];
        const nation = [];
        const category = [];
        response.data.forEach(item => {
          switch (item.dataId) {
            case 16: // 机构级别
              organizationLevel.push(item);
              break;
            case 28: // 健康状况
              health.push(item);
              break;
            case 29: // 专业技术职称
              professionalAndTechnicalTitle.push(item);
              break;
            case 95: // 现职务层次
              preJobLevel.push(item);
              break;
            case 96: // 现职级
              currentRank.push(item);
              break;
            case 97: // 民族
              nation.push(item);
              break;
            case 99: // 人员类别
              category.push(item);
              break;
            default:
              break;
          }
        });
        this.setState({
          organizationLevelDictData: organizationLevel,
          healthDictData: health,
          professionalAndTechnicalTitleDictData: utils.dataToTree(professionalAndTechnicalTitle),
          preJobLevelDictData: utils.dataToTree(preJobLevel),
          currentRankDictData: utils.dataToTree(currentRank),
          nationDictData: nation,
          categoryDictData: category,
        });
      }
    });
  }

  // 获取人员状态信息
  findStatus = groupId => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchStatus`,
      payload: { groupId },
    });
  };

  findRtCategory = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rtPerformanceModel/fetchRtCategory',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findDictData = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamDictDataModel/fetch',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
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

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rtPerformanceModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rtPerformanceModel/add',
      payload: values,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建个人业绩展示信息成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
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
      type: 'rtPerformanceModel/update',
      payload,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改个人业绩展示信息成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
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
      type: 'rtPerformanceModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除个人业绩展示信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除个人业绩展示信息失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  // ////////////////////////////////////////////////////////////////////////////////////

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
    });
  };

  hideDrawer = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建个人业绩展示信息',
        visible: true,
        confirmLoading: false,
        record: {},
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

  showEditModal = record => {
    const { dispatch } = this.props;
    const {
      //  机构级别
      organizationLevelDictData,
      //  健康状况
      healthDictData,
      //  专业技术职称
      professionalAndTechnicalTitleDictData,
      //  先职务层次
      preJobLevelDictData,
      //  现职级
      currentRankDictData,
      //  民族
      nationDictData,
      //  人员类别
      categoryDictData,
      // 单位列表
      organizationData,
    } = this.state;
    this.setState({
      editData: {
        dispatch,
        title: '编辑个人业绩展示信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
        organizationLevelDictData,
        healthDictData,
        professionalAndTechnicalTitleDictData,
        preJobLevelDictData,
        currentRankDictData,
        nationDictData,
        categoryDictData,
        organizationData,
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

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  // 获取集团ID
  getRoot = pid => {
    const { data } = this.props.rtPerformanceModel;
    for (let i = 0; i < data.length; i += 1) {
      if (pid === data[i].id) {
        return data[i].pid;
      }
    }
    return null;
  };

  // 选中左侧树状菜单,展示数据并存储集团ID
  onSelect = (selectedKeys, info) => {
    this.setState(
      {
        selectedKeys,
        pageNumber: 1,
      },
      () => {
        const { pageNumber, pageSize } = this.state;
        const { id } = info.node.props.dataRef;
        const orgId = id;
        this.findPage(pageNumber, pageSize, { orgId });
        this.props.form.resetFields('statusCode');
      },
    );
  };


  // //////////////////////////////////////////////////////////////////////////////////

  renderDate = text => ((text) ? moment(text).format('YYYY年MM月DD日') : '');

  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.categoryName.indexOf(searchValue);
      const beforeStr = item.categoryName.substr(0, index);
      const afterStr = item.categoryName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.categoryName}</span>
          );
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id} dataRef={item} />;
    });
    return newTree;
  };

  renderOrganizationTree() {
    const {
      rtPerformanceModel: { tree },
    } = this.props;

    return (
      <Tree
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
        {this.renderTreeNodes(tree)}
      </Tree>
    );
  }

  renderTalents() {
    const { pageNumber, pageSize, selectedRowKeys, tabKey } = this.state;
    let catgPer = {};
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      rtPerformanceModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };

    return (
      <Table
        rowKey="id"
        loading={loading}
        columns={this.columns}
        dataSource={data}
        pagination={paginationProps}
        rowSelection={rowSelection}
        onChange={this.handleTableChange}
        bordered
        size="middle"
        scroll={{ x: 1870, y: 650 }}
      />
    );
  }

  renderAdvancedList() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const {
      form,
      rtPerformanceModel: { total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const DictData = {
      form,
      pagination: paginationProps,
      onFind: this.findPage,
      findDictData: this.findDictData,
    };
    return (
      <>
        <div style={{ width: '20%', height: 900, float: 'left', marginRight: '1%' }} >
          <Card style={{ height: 900, overflow: 'auto' }} >
            {this.renderOrganizationTree()}
          </Card>
        </div>
        <div style={{ width: '79%', height: 900, float: 'left' }}>
          <Card style={{ height: 900, overflow: 'auto' }}>
            <div>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                <Icon type="left" />
              </a>
              <div style={{ marginBottom: '16px' }}>
                <RtPerformanceSearchBar {...DictData} />
              </div>
              {this.renderTalents()}
            </div>
          </Card>

        </div>
      </ >
    );
  }

  renderSimpleList() {
    const { pageNumber, pageSize, addData, editData } = this.state;
    const {
      form,
      rtPerformanceModel: { total, tree },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const DictData = {
      form,
      pagination: paginationProps,
      onFind: this.findPage,
      findDictData: this.findDictData,
    };

    return (
      <Card>
        <div>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="right" />
          </a>
          <div style={{ marginBottom: '16px' }}>
            <RtPerformanceSearchBar {...DictData} />
          </div>
          {this.renderTalents()}
        </div>
      </Card>
    );
  }

  render() {
    const { expandList, addData, editData, tabKey } = this.state;

    return (
      <div>
        { expandList? this.renderAdvancedList() : this.renderSimpleList()}

        <RtPerformanceViewDrawer
          visible={this.state.viewVisible}
          data={this.state.viewData}
          onClose={this.hideDrawer}
        />
        {addData.visible && <RtPerformanceAddModal {...addData} />}
        {editData.visible && <RtPerformanceEditModal {...editData} />}
      </div>
    );
  }
}

export default Form.create()(RtPerformanceIndex);
