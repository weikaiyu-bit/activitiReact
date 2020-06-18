import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tree, Input } from 'antd';

import ErrorCode from '@/dtsea/common/ErrorCode';
import WfNodeTemplatesAddModal from './components/addModal';
import WfNodeTemplatesEditModal from './components/editModal';
import WfNodeTemplatesViewDrawer from './components/viewDrawer';
import WfNodeTemplatesSearchBar from './components/searchBar';

const { TreeNode } = Tree;
const { Search } = Input;
const gData = [];
const getParentKey = (key, tree) => {
  debugger
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if(node.key ==='4315492371777598'){
       debugger
      }
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
};

@connect(({ wfNodeTemplatesModel, wfWorkflowCategoriesModel, loading }) => ({
  wfNodeTemplatesModel,
  wfWorkflowCategoriesModel,
  loading: loading.models.wfNodeTemplatesModel,
}))
class WfNodeTemplatesIndex extends Component {
  state = {
    selectedKeys: [], // 树节点
    showButton: true, // 新建按钮显示


    expandedKeys: [],
    searchValue: '', // 树节点搜索条件
    autoExpandParent: true,
    expandList: true,
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
  };

  columns = [
    {
      title: '流程类别',
      dataIndex: 'categoryName',
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '关联表单',
      dataIndex: 'pageUrl',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除节点模板吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
    this.findcgAll();
  }

  /* ************************************************************* */

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
    const { catgId } = this.state.filter
    this.setState({
      addData: {
        title: '新建节点模板',
        visible: true,
        confirmLoading: false,
        record: {
          catgId,
        },
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
    this.setState({
      editData: {
        title: '编辑节点模板',
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
  //  this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /* ************************************************ */

  findPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize });
    // console.log({ filter })
    this.setState(preState => ({
      filter: { ...preState.filter, ...filter },
    }), () => {
      this.find(pageNumber, pageSize, this.state.filter)
    })
  };

  // 获取分类
  findcgAll=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/treeMenu',
      payload: {
      },
    });
  }

  find = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfNodeTemplatesModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'wfNodeTemplatesModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建节点模板成功！');
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
    const { pageNumber, pageSize, filter } = this.state;
    const payload = { id, ...values };
    dispatch({
      type: 'wfNodeTemplatesModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改节点模板成功！');
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
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'wfNodeTemplatesModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除节点模板成功！');
            this.findPage(pageNumber, pageSize, filter);
            this.setState({
              selectedRowKeys: [],
            })
            break;
          case ErrorCode.FAILURE:
            message.error('删除节点模板失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  callbackDefault = response => {
    const msg = (response.msg) ? response.msg : '发生未知错误！';
    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
       // routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  // 定义一个拿子组件返回值this的函数
  onRef = (ref) => {
    this.child = ref
  }

  // 调用处理函数
  click = () => {
    this.child.myName()
  }

  // 重构树界面
  renderTreeNodes = tree => {
    if (!tree) return '';
    const newTree = tree.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
    return newTree;
  };
  /* ********************树方法************************** */

  // 树
  onSelect = (selectedKeys, info) => {
    console.log()
    // selectedKeys.toString();
    const showButton = !info.selected
    this.setState({ showButton })
    this.setState({ selectedKeys })
    this.setState(preState => (
      {
        filter: { ...preState.filter, catgId: selectedKeys.toString() },
      }), () => {
      const { pageNumber, pageSize, filter } = this.state;
      this.findPage(pageNumber, pageSize, filter);
    })
    // console.log(this.state.filter)
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const xx = "部落"
    const {
      wfWorkflowCategoriesModel: { treeData },
    } = this.props;
    const expandedKeys = treeData
      .map(item => {
        if (item.title.indexOf(xx) > -1) {
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
  /* *********************** */

  // 重置查询
  resFindPage = (pageNumber, pageSize, filter) => {
    const { showButton } = this.state;
    this.setState({ pageNumber, pageSize });
    // 初始化新建按钮
    this.setState({ showButton: !showButton })
    this.setState({
      selectedKeys: [],
    })
    this.setState({ filter }, () => {
      this.find(pageNumber, pageSize, filter);
    })
  }

  render() {
    const { pageNumber, pageSize,
      selectedRowKeys, addData, editData, showButton, selectedKeys,
      searchValue, expandedKeys, autoExpandParent } = this.state;
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
    const { dispatch } = this.props
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      wfNodeTemplatesModel: { data = [], total },
    } = this.props;
    const {
      wfWorkflowCategoriesModel: { treeData },
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
            onChange={this.onChange}
          />
          <Tree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            selectedKeys={selectedKeys}
            treeData={loop(treeData)}
          >
          </Tree>
        </Card>
        <Card bordered={false} style={{ width: this.state.expandList ? '76%' : '100%', float: 'left' }}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <WfNodeTemplatesSearchBar pagination={paginationProps} dispatch={dispatch}
                                        form={form} onFind={this.findPage}
                                        resFindPage={this.resFindPage}
                                        onRef={this.onRef} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal} disabled={showButton}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除节点模板吗？" onConfirm={() => this.delete(selectedRowKeys)}>
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
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <WfNodeTemplatesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <WfNodeTemplatesAddModal {...addData} />}
          {editData.visible && <WfNodeTemplatesEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(WfNodeTemplatesIndex);
