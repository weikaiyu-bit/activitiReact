/* eslint-disable @typescript-eslint/no-unused-vars */
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
import PPersonnelFilesViewDrawer from './components/viewDrawer';
import TalentQuerySearchBar from './components/searchBar';
// import PPersonnelFilesSearchNameOrIdCardModal from './components/searchNameOrIdCardModal';
// import PPersonnelFilesSearchOrgModal from './components/searchOrgModal';
// import PersonnelSummaryCard from '../components/personnelSummaryCard';
// import AddModal from './components/addModal'
// import EditModal from './components/editModal'

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

@connect(({ talentQueryModel, loading }) => ({
  talentQueryModel,
  loading,
}))
class TalentQueryIndex extends Component {
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
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      ellipsis: true,
      align: 'center',
      width: 70,
      fixed: 'left'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      align: 'center',
      width: 60,
    },
    {
      title: '人员状态',
      dataIndex: 'state',
      ellipsis: true,
      align: 'center',
      width: 80,
      render: (text, data) => {
        switch (data.state) {
          case '未入职':
            return <Tag color="orange">{data.state}</Tag>;
          case '入职':
            return <Tag color="lime">{data.state}</Tag>;
          case '在职':
            return <Tag color="cyan">{data.state}</Tag>;
          case '职位变动':
            return <Tag color="hotpink">{data.state}</Tag>;
          case '提拔':
            return <Tag color="blue">{data.state}</Tag>;
          case '退休':
            return <Tag color="magenta">{data.state}</Tag>;
          case '调动':
            return <Tag color="hotpink">{data.state}</Tag>;
          case '辞职':
            return <Tag color="magenta">{data.state}</Tag>;
          case '辞退':
            return <Tag color="red">{data.state}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      ellipsis: true,
      align: 'center',
      width: 140,
    },
    {
      title: '所在单位',
      dataIndex: 'orgId',
      ellipsis: true,
      align: 'center',
      width: 150,
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
      ellipsis: true,
      align: 'center',
      width: 110,
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
      title: '出生地',
      dataIndex: 'birthplace',
      ellipsis: true,
      align: 'center',
      width: 150,
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
      title: '入党时间',
      dataIndex: 'partyTime',
      ellipsis: true,
      align: 'center',
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '公务员登记时间',
      dataIndex: 'serviceTime',
      ellipsis: true,
      align: 'center',
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '专业技术类公务员任职资格',
      dataIndex: 'civilServantQualification',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '专长',
      dataIndex: 'speciality',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '健康状况',
      dataIndex: 'health',
      ellipsis: true,
      align: 'center',
      width: 80,
    },
    {
      title: '管理类别',
      dataIndex: 'manageCategory',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '人员类别',
      dataIndex: 'personnelCategory',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '编制类型',
      dataIndex: 'posistionCategory',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '统计关系所在单位',
      dataIndex: 'rsOrgId',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
  ];

  /*********************************************************************************** */

  componentDidMount() {
    // 查询人才分类
    this.findOrg({
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

  findOrg = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'talentQueryModel/fetchOrg',
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

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建人事档案信息',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  showEditModal = record => {
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
        title: '编辑人事档案信息',
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
  /** ********************************************************************************************* */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'talentQueryModel/fetch',
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
      type: 'talentQueryModel/add',
      payload: values,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建人事档案信息成功！');
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
      type: 'talentQueryModel/update',
      payload,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改人事档案信息成功！');
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
      type: 'talentQueryModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除人事档案信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除人事档案信息失败！');
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
    console.log(record)
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
        title: '新建人事档案信息',
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


  // 选中左侧树状菜单,展示数据并存储集团ID
  onSelect = (selectedKeys, info) => {
    console.log('info.node.props.dataRef :>> ', info.node.props.dataRef);
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
      talentQueryModel: { tree },
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

  renderPersonnelFiles() {
    const { pageNumber, pageSize, selectedRowKeys, tabKey } = this.state;
    let catgPer = {};
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading: { effects },
      talentQueryModel: { data, total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    // if (tabKey === 'byList') {
    catgPer = (
      <Table
        rowKey="id"
        loading={effects['talentQueryModel/fetch']}
        columns={this.columns}
        dataSource={data}
        pagination={paginationProps}
        rowSelection={rowSelection}
        onChange={this.handleTableChange}
        bordered
        size="middle"
        scroll={{ x: 1990, y: 650 }}
      />
    );
    return catgPer;
  }

  renderAdvancedList() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const {
      form,
      talentQueryModel: { total },
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
                <TalentQuerySearchBar {...DictData} />
              </div>
              {this.renderPersonnelFiles()}
            </div>
          </Card>

        </div>
      </ >
    );
  }

  renderSimpleList() {
    const { pageNumber, pageSize, selectedRowKeys } = this.state;
    const {
      form,
      talentQueryModel: { total, tree },
    } = this.props;
    console.log("total",total)
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
            <TalentQuerySearchBar {...DictData} />
          </div>
          {this.renderPersonnelFiles()}
        </div>
      </Card>
    );
  }

  render() {
    const { expandList, addData, editData, tabKey } = this.state;
    //   const { talentQueryModel: { tree }, loading: { effects } } = this.props;
    //   console.log('editData', editData);
    return (
     <div>
        {expandList ? this.renderAdvancedList() : this.renderSimpleList()}

        <PPersonnelFilesViewDrawer
          visible={this.state.viewVisible}
          data={this.state.viewData}
          onClose={this.hideDrawer}
        />
     </div>
    );
  }
}

export default Form.create()(TalentQueryIndex);
