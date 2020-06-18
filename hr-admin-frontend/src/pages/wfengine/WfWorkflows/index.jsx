import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag, Tree, Input } from 'antd';
import moment from 'moment';
import Link from 'umi/link';

import ErrorCode from '@/dtsea/common/ErrorCode';
import WfWorkflowsAddModal from './components/addModal';
import WfWorkflowsEditModal from './components/editModal';
import WfWorkflowsViewDrawer from './components/viewDrawer';
import WfWorkflowsSearchBar from './components/searchBar';
// import Designer from '@/components/wfdesigner';
// import FlowViewer from '../WfFlowDesiger/viewer';

const { Search } = Input;
@connect(({ wfWorkflowsModel, wfWorkflowCategoriesModel, loading }) => ({
  wfWorkflowCategoriesModel,
  wfWorkflowsModel,
  loading: loading.models.wfWorkflowsModel,
}))

class WfWorkflowsIndex extends Component {
  state = {
    selectedKeys: [], // 树默认节点
    showButton: true, // 新建按钮显示
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
  //  shown: false,
  //  curr: {},
  };

  columns = [
    /* {
      title: '流程类别',
      dataIndex: 'categoryName',
    }, */
    {
      title: '流程名称',
      dataIndex: 'flowName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '开始节点',
      dataIndex: 'beginNodeId',
    },
    {
      title: '终止节点',
      dataIndex: 'endNodeId',
    },
    {
      title: '驱动类型',
      dataIndex: 'flowType',
      render(value) {
        let color = '';
        let text = '';
        switch (value) {
          case 'manual':
            color = 'lime';
            text = '人工';
            break;
          case 'auto':
            color = 'cyan';
            text = '自动';
            break;
          default:
            color = 'red';
            text = '未定义';
            break;
        }
        return (<Tag color={color}>{text}</Tag>);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render(val) {
        if (val != null) {
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorUid',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          {/* <Divider type="vertical" />
          <a onClick={() => this.__view({ shown: true,
            curr: { ...record, content: this.isJson(record.flowJson) } })}>预览</a> */}
          <Divider type="vertical" />
          <Link to={`WfFlowDesiger?id=${record.id}&catgId=${record.catgId}`}>设计</Link>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除工作流流程吗？" onConfirm={() => this.delete(record.id)}>
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

  /* ********************************************************************************** */

  // 转化json
  /**
   * 判断是否json
   * @param $string
   * @returns {boolean}
   */
  isJson = ($string) => {
    if (typeof $string === 'string') {
      try {
        const obj = JSON.parse($string);
        if (typeof obj === 'object' && obj) {
          return JSON.parse($string);
        }
      } catch (e) {
        //  console.log('error：'+str+'!!!'+e);
      }
    } return false;
  }

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
        title: '新建工作流流程',
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
    console.log(record)
    this.setState({
      editData: {
        title: '编辑工作流流程',
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
    // this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /* ********************************************************************************** */

  // 获取分类
  findcgAll=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/treeMenu',
      payload: {
      },
    });
  }

  findPage = (pageNumber, pageSize, filter) => {
      this.setState({ pageNumber, pageSize });
     // console.log({ filter })
      this.setState(preState => ({
        filter: { ...preState.filter, ...filter },
      }), () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'wfWorkflowsModel/fetch',
          payload: {
            ...this.state.filter,
            pageNumber,
            pageSize,
          },
        });
      })
 //   this.setState({ filter })
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'wfWorkflowsModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建工作流流程成功！');
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
      type: 'wfWorkflowsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改工作流流程成功！');
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
      type: 'wfWorkflowsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除工作流流程成功！');
            this.setState({
              selectedRowKeys: [],
            })
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除工作流流程失败！');
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

  __view(v) {
    // console.log(v,JSON.parse(v.flowJson))
    this.setState({
      ...v,
    })
  }

  // 树
  onSelect = (selectedKeys, info) => {
 //   console.log(selectedKeys)
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

  // 重置查询
  resFindPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize });
    this.setState({
      selectedKeys: [],
    })
    this.setState({ filter }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'wfWorkflowsModel/fetch',
        payload: {
          ...this.state.filter,
          pageNumber,
          pageSize,
        },
      });
    })
  }

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData,
      showButton, selectedKeys } = this.state;
   // curr, shown
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      wfWorkflowCategoriesModel: { treeData },
    } = this.props;
    const {
      loading,
      form,
      wfWorkflowsModel: { data = [], total },
    } = this.props;
  //  console.log(wfWorkflowCategoriesModel)
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
      showTotal: all => `共 ${all} 条`,
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
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
          >
          </Tree>
        </Card>
        {/* <Modal title="预览" width={760} visible={shown}
        footer={null} onCancel={() => { this.__view({ shown: false }) }}>
          <FlowViewer data={curr} />
        </Modal> */}
        <Card bordered={false} style={{ width: this.state.expandList ? '76%' : '100%', float: 'left' }}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <WfWorkflowsSearchBar form={form}
                                    pagination={paginationProps}
                                    onFind={this.findPage}
                                    resFindPage={this.resFindPage}/>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal} disabled={showButton}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除工作流流程吗？" onConfirm={() => this.delete(selectedRowKeys)}>
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

          <WfWorkflowsViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <WfWorkflowsAddModal {...addData} />}
          {editData.visible && <WfWorkflowsEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(WfWorkflowsIndex);
