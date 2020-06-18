/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Switch, Button, Divider, Popconfirm, Form, message, Tree, Input, Menu, Dropdown, Checkbox } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import EXModal from './components/EXModal';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import OrgOrganizationEditModal from './components/editModal';
import OrgOrganizationViewDrawer from './components/viewDrawer';
import OrgOrganizationSearchBar from './components/searchBar';
import OrgOrganizationAddModal from './components/addModal';
import Staffing from './components/Staffing'
import Export from './components/Export'
import Column from './components/Column'

const { TreeNode } = Tree;
const { Search } = Input;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id.toString();
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  console.log('parentKey1', parentKey);
  return parentKey;
};

@connect(({ organizationGovModel, loading }) => ({
  organizationGovModel,
  loading: loading.models.fetch,
}))
class OrganizationGovIndex extends Component {
  modelName = 'organizationGovModel';

  state = {
    selectedRowKeys: [],
    filter: {},
    area: {},
    viewData: {},
    treeData: [],
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
    },
    exData: {
      visible: false,
    },
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
    expandList: true,
    selectedRecord: [],
    staffingData: {

    },
    exportData: {

    },
    columnData: {

    },
  };

  columns = [
    {
      title: '机构名称',
      dataIndex: 'orgName',
      width: 260,
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '单位隶属关系',
      dataIndex: 'subordination',
      width: 200,
    },
    {
      title: '组织机构代码',
      dataIndex: 'orgCode',
      width: 150,
    },
    {
      title: '机构级别',
      dataIndex: 'level',
      width: 150,
    },
    {
      title: '机构类别',
      dataIndex: 'category',
      width: 200,
    },
    {
      title: '所在政区',
      dataIndex: 'area',
    },
    {
      title: '正职领导',
      dataIndex: 'principalLeaderPos',
    },
    {
      title: '副职领导',
      dataIndex: 'deputyLeaderPos',
    },
    // {
    //   title: '内设机构应配领导正职',
    //   dataIndex: 'shouldInternalLeaderNumber',
    // },
    // {
    //   title: '内设机构应配领导副职',
    //   dataIndex: 'shouldInternalLeadershipNumber',
    // },
    // {
    //   title: '内设机构应配正职非领导',
    //   dataIndex: 'shouldInternalLeadershipCount',
    // },
    // {
    //   title: '内设机构应配副职非领导',
    //   dataIndex: 'shouldInternalLeadershipNumber',
    // },
    // {
    //   title: '行政编制数',
    //   dataIndex: 'adminNumber',
    // },
    // {
    //   title: '参照公务员法管理事业编制数',
    //   dataIndex: 'careerParticipationNumber',
    // },
    // {
    //   title: '其他事业编制数',
    //   dataIndex: 'careerNoparticipationNumber',
    // },
    // {
    //   title: '内设机构应配领导职数',
    //   dataIndex: 'shouldInternalLeaderNumber',
    // },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '机构简称',
      dataIndex: 'orgShortName',
      width: 260,
    },
    {
      title: '机构性质',
      dataIndex: 'orgType',
    },
    // {
    //   title: '可管理子节点',
    //   dataIndex: 'isMgChildren',
    //   render: (isMgChildren, record) => {
    //     if (isMgChildren === '授权') {
    //       return (
    //         <Switch defaultChecked onChange={checked => this.onChangeMgChildren(checked, record)} />
    //       );
    //     }
    //     return (
    //       <Switch
    //         unCheckedChildren
    //         onChange={checked => this.onChangeMgChildren(checked, record)}
    //       />
    //     );
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={e => this.showAddModal(e, record)}>新建下级机构</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="是否刪除该机构" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
      fixed: 'right',
      width: 200,
    },
  ];

  componentDidMount() {
    const { filter } = this.state;
    this.findByFilter(filter);
    this.findorgLevel({ dataId: 16 })
    this.findOrgCategory({ dataId: 8 })
    this.findSubjection({ dataId: 1 });
    this.findArea({ areaName: '广西' });
    // this.findTenant();
    // this.findProvince();
  }

  findArea = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchArea`,
      payload: {
        ...filter,
      },
    });
  }

  findSubjection = filter => {
    const { dispatch } = this.props;
    console.log('filter', filter);
    dispatch({
      type: `${this.modelName}/fetchSubjection`,
      payload: {
        ...filter,
      },
    });
  };
  showDrawer = record => {
    console.log('record', record);
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

  showExModal = () => {
    const { selectedRecord } = this.state
    this.setState(prevState => ({
      exData: {
        title: '领导职数配备情况表',
        visible: true,
        confirmLoading: false,
        record: selectedRecord,
        // onOk: this.add,
        onClose: this.hideExModal,
      },
    }));
  };

  hideExModal = () => {
    this.setState({
      exData: {
        visible: false,
        confirmLoading: false,
        // onOk: null,
      },
    });
  };

  showStaffing = () => {
    const { selectedRecord } = this.state
    this.setState(prevState => ({
      staffingData: {
        title: '机构编制人员对比表',
        visible: true,
        confirmLoading: false,
        record: selectedRecord,
        // onOk: this.add,
        onClose: this.hideStaffing,
      },
    }));
  };

  hideStaffing = () => {
    this.setState({
      staffingData: {
        visible: false,
        confirmLoading: false,
        // onOk: null,
      },
    });
  };

  showExport = () => {
    const { selectedRecord } = this.state
    const tableValue = JSON.parse(JSON.stringify(this.columns));
    tableValue.splice(tableValue.findIndex(item => item.dataIndex === 'action'), 1)
    this.setState(prevState => ({
      exportData: {
        title: '预览',
        visible: true,
        confirmLoading: false,
        record: selectedRecord,
        tableValue,
        // onOk: this.add,
        onClose: this.hideExport,
      },
    }));
  };

  hideExport = () => {
    this.setState({
      exportData: {
        visible: false,
        confirmLoading: false,
        // onOk: null,
      },
    });
  };

  showColumn = () => {
    const { selectedRecord } = this.state
    const tableValue = this.columns
    this.setState(prevState => ({
      columnData: {
        title: '预览',
        visible: true,
        confirmLoading: false,
        record: selectedRecord,
        tableValue,
        // onOk: this.add,
        onClose: this.hideColumn,
      },
    }));
  };

  hideColumn = () => {
    this.setState({
      columnData: {
        visible: false,
        confirmLoading: false,
        // onOk: null,
      },
    });
  };

  showAddModal = record => {
    const {
      organizationGovModel: { orgLevel, orgCategoryTree, area, SubjectionTree },
    } = this.props;
    this.setState(prevState => ({
      addData: {
        title: record ? '新建下级机构' : '新建机构',
        visible: true,
        confirmLoading: false,
        record,
        orgLevel,
        orgCategoryTree,
        SubjectionTree,
        area,
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    }));
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
    const {
      organizationGovModel: { orgLevel, orgCategoryTree, area, SubjectionTree  },
    } = this.props;
    this.setState({
      editData: {
        title: '编辑组织机构信息',
        visible: true,
        confirmLoading: false,
        record,
        orgLevel,
        orgCategoryTree,
        SubjectionTree,
        area,
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

  onSelectChange = (currySelectedRowKeys, record) => {
    this.setState({
      selectedRowKeys: currySelectedRowKeys,
      selectedRecord: record,
    });
  };

  /*
   * ***********************************************************************************************
   * */
  findAll = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
    });
  };

  // 查询机构级别数据字典
  findorgLevel = filter => {
    const { dispatch } = this.props;
    console.log('filter', filter);
    dispatch({
      type: `${this.modelName}/fetchOrgLevel`,
      payload: {
        ...filter,
      },
    });
  };

  // 查询机构类别数据字典OrgCategory
  findOrgCategory = filter => {
    const { dispatch } = this.props;
    console.log('filter', filter);
    dispatch({
      type: `${this.modelName}/fetchOrgCategory`,
      payload: {
        ...filter,
      },
    });
  };

  findTenant = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchlistTenant`,
    });
  };

  findByFilter = filter => {
    const { dispatch } = this.props;
    this.setState({
      filter,
    });
    dispatch({
      type: `${this.modelName}/fetchByFilter`,
      payload: {
        ...filter,
      },
    });
  };

  findProvince = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchProvince`,
      payload: {
        ...filter,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { filter, area } = this.state;
    console.log('addid', id)
    console.log('addvalues', values)
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (id) {
              message.success('添加子节点成功');
              this.findByFilter({ ...filter, ...area });
            } else {
              message.success('新增组织机构成功');
              this.findByFilter({ ...area });
            }
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
      type: `${this.modelName}/update`,
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改成功');
            this.findByFilter(filter);
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
    console.log("要删除机构的id: "+ids);
    const { dispatch } = this.props;
    const { filter } = this.state;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            this.findByFilter(filter);
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
    // 删除后将id缓存数组清空，防止下次删除传入过期id
    this.setState({
      selectedRowKeys: [],
    });
  };

  onChangeMgChildren = (checked, record) => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    console.log('state', this.state);
    dispatch({
      type: `${this.modelName}/update`,
      payload: { ...record, isMgChildren: checked ? '授权' : '禁止' },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改成功');
            console.log('filter295', filter);
            this.findByFilter(filter);
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

  /*
  树形控件
   */

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('info', info);
    console.log('selectedKeys', selectedKeys)
    this.setState({ selectedKeys, pageNumber: 1 });
    const { id } = info.node.props.dataRef;
    const area = {};
    if (info.selected) {
      area.areaId = id;
      // orgs.tenantId = pid;
      if (Object.keys(area).length) {
        this.setState({ area }, () => {
          this.findByFilter(this.state.area);
        });
      }
    } else {
      this.setState({ area }, () => {
        this.findByFilter(this.state.orgs);
      });
    }
  };

  // 处理成树的结构数据
  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.areaName.indexOf(searchValue);
      const beforeStr = item.areaName.substr(0, index);
      const afterStr = item.areaName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.areaName}</span>
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

  onChange = e => {
    const {
      organizationGovModel: { bamData, bamTree },
    } = this.props;
    const { value } = e.target;
    const expandedKeys = bamData
      .map(item => {
        if (item.areaName.indexOf(value) > -1) {
          return getParentKey(item.id, bamTree);
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

  /*
   * ***********************************************************************************************
   * */
  onChangeOrderedList = e => {
    const { projectFilter } = this.state;
    const { statusList } = projectFilter;
    if (e.target.checked) {
      statusList.push(e.target.value)
    } else {
      statusList.splice(statusList.findIndex(item => item === e.target.value), 1)
    }
  };

  render() {
    const { selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      organizationGovModel: { tree = [], bamTree, orgLevel, area, orgCategoryTree, SubjectionTree },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <OrgOrganizationSearchBar form={form} orgLevel={orgLevel} area={area} orgCategoryTree={orgCategoryTree} onFind={this.findByFilter} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <span>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建机构
                </Button>
              </span>
              <span style={{ marginLeft: 12 }}>
                <Button icon="export" onClick={() => this.showExport()}>
                  导出
                </Button>
              </span>
              {/* <span style={{ marginLeft: 12 }}>
                <Button icon="orderedList" onClick={() => this.showColumn()}>
                  显示列设置
                </Button>
              </span> */}
              {selectedRowKeys.length > 0 ? (
                <span style={{ marginLeft: 12 }}>
                  <Popconfirm
                    title="您确认需要批量删除组织机构吗？"
                    onConfirm={() => this.delete(selectedRowKeys)}
                  >
                    <Button icon="delete">批量删除</Button>
                  </Popconfirm>
                </span>
              ) : (
                  ''
                )}

              <span style={{ float: 'right' }}>
                <Button style={{ marginLeft: 12 }} icon="barChart" onClick={() => this.showExModal()}>
                  领导职数配备情况表
                </Button>
                <Button style={{ marginLeft: 12 }} icon="barChart" onClick={() => this.showStaffing()}>
                  机构编制人员对比表
                </Button>
              </span>
            </div>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={tree}
              rowSelection={rowSelection}
              loading={loading}
              pagination={false}
              size="small"
              scroll={{ x: 2000, y: 800 }}
            />
          </div>

          <OrgOrganizationViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <OrgOrganizationAddModal {...addData} />}
          {editData.visible && <OrgOrganizationEditModal {...editData} dataSource={tree} />}
          {this.state.exData.visible && <EXModal {...this.state.exData} />}
          {this.state.staffingData.visible && <Staffing {...this.state.staffingData} />}
          {this.state.exportData.visible && <Export {...this.state.exportData} />}
          {this.state.columnData.visible && <Column {...this.state.columnData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(OrganizationGovIndex);
