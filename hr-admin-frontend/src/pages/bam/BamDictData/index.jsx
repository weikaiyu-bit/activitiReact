/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Input, Divider, Popconfirm, Form, message, Tree, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import BamDictDataAddModal from './components/addModal';
import BamDictDataEditModal from './components/editModal';
import BamDictDataViewDrawer from './components/viewDrawer';
import BamDictDataSearchBar from './components/searchBar';

const { TreeNode } = Tree;
const { Search } = Input;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id.toString();
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

@connect(({ bamDictDataModel, loading }) => ({
  bamDictDataModel,
  loading: loading.models.fetch,
}))
class BamDictDataIndex extends Component {
  state = {
    showButton: true,
    square: 'left-square',
    expandList: true,
    selectedRowKeys: [],
    dictionary: {},
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    addData: {
      visible: false,
      record: {},
      dictData: {},
    },
    editData: {
      visible: false,
      record: {},
    },
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
  };

  componentDidMount() {
    this.findTreeNode();
  }

  /** ********************************************************************************************* */

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

  showAddModal = (e, record) => {
    this.setState(prevState => ({
      addData: {
        title: '新建字典数据',
        visible: true,
        confirmLoading: false,
        record: prevState.dictionary,
        dictData: record,
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
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑字典数据',
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
    const { dictionary } = this.state;
    this.setState({
      filter,
    });
    dispatch({
      type: 'bamDictDataModel/fetch',
      payload: {
        ...dictionary,
        ...filter,
      },
    });
  };

  findTentants = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamDictDataModel/fetchTentans',
    });
  };

  findTreeNode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamDictDataModel/bamDictionary',
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'bamDictDataModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建字典数据成功！');
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
      type: 'bamDictDataModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改字典数据成功！');
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
    const {
      dispatch,
      bamDictDataModel: { total },
    } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    const newTotal = total - ids.length;
    // 计算删除后页数
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize);
    dispatch({
      type: 'bamDictDataModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (totalPage < pageNumber) {
              this.setState({ pageNumber: totalPage });
              this.findPage(totalPage, pageSize, filter);
            } else {
              this.findPage(pageNumber, pageSize, filter);
            }
            message.success('删除字典数据成功！');
            // this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除字典数据失败！');
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

  columns = [
    {
      title: '数据名称',
      dataIndex: 'dataName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '数据值',
      dataIndex: 'dataValue',
    },
    {
      title: '数据标签',
      dataIndex: 'tags',
    },
    {
      title: '类型',
      dataIndex: 'nodeType',
      render: (text, record) => {
        switch (record.nodeType) {
          case 'category':
            return <Tag color="#CD853F">类别</Tag>;
          case 'data':
            return <Tag color="#FF8C00">数据</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={e => this.showAddModal(e, record)}>添加子节点</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除字典数据吗？" onConfirm={() => this.delete([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  /*
 树形控件
  */

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys, pageNumber: 1 });
    const { pageSize } = this.state;
    console.log('info.node.props.dataRef :>> ', info.node.props.dataRef);
    const { id, tenantId } = info.node.props.dataRef;
    const dictionary = {};
    if (info.selected) {
      dictionary.dataId = id;
      dictionary.tenantId = tenantId;
      this.setState({
        showButton: false,
      });
      if (Object.keys(dictionary).length) {
        this.setState({ dictionary }, () => {
          this.findPage(1, pageSize, this.state.dictionary);
        });
      }
    } else {
      this.setState({ dictionary }, () => {
        this.findPage(1, pageSize, { pid: -1 });
      });
      this.setState({
        showButton: true,
      });
    }
  };

  // 处理成树的结构数据
  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.dictName.indexOf(searchValue);
      const beforeStr = item.dictName.substr(0, index);
      const afterStr = item.dictName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <>
            {item.nodeType === 'category' ? (
              <span style={{ color: '#9370db' }}>
                {beforeStr}
                {searchValue}
                {afterStr}
              </span>
            ) : (
              <span style={{ color: '#00ced1' }}>
                {beforeStr}
                {searchValue}
                {afterStr}
              </span>
            )}
          </>
        ) : (
          <>
            {item.nodeType === 'category' ? (
              <span style={{ color: '#faebd7' }}>{item.dictName}</span>
            ) : (
              <span style={{ color: '#faebd7' }}>{item.dictName}</span>
            )}
          </>
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

  onSearchChange = e => {
    const {
      bamDictDataModel: { dictionary, tree },
    } = this.props;
    const { value } = e.target;
    const expandedKeys = dictionary
      .map(item => {
        if (item.dictName.indexOf(value) > -1) {
          return getParentKey(item.id, tree);
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

  leftDisplay = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
      square: expandList ? 'right-square' : 'left-square',
    });
  };

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData, showButton } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      bamDictDataModel: { data, total, tree, tentants, dataTree },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    return (
      <PageHeaderWrapper>
        <Card
          style={{
            width: '23%',
            float: 'left',
            marginRight: '1%',
            display: this.state.expandList ? '' : 'none',
          }}
        >
          <Search
            style={{ marginBottom: 8 }}
            placeholder="请输入关键字"
            onChange={this.onSearchChange}
          />
          <Tree
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            // onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(tree)}
          </Tree>
        </Card>
        <Card style={{ width: this.state.expandList ? '76%' : '100%', float: 'left' }}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <BamDictDataSearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.findPage}
                leftDisplay={this.leftDisplay}
                square={this.state.square}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button
                  icon="plus"
                  type="primary"
                  disabled={showButton}
                  onClick={this.showAddModal}
                >
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除字典数据吗？"
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
              loading={loading}
              columns={this.columns}
              dataSource={dataTree}
              // pagination={paginationProps}
              rowSelection={rowSelection}
              pagination={false}
              onChange={this.handleTableChange}
            />
          </div>

          <BamDictDataViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            tentants={tentants}
            onClose={this.hideDrawer}
          />
          {addData.visible && <BamDictDataAddModal {...addData} />}
          {editData.visible && <BamDictDataEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(BamDictDataIndex);
