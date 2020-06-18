import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag } from 'antd';

import ErrorCode from '@/dtsea/common/ErrorCode';
import WfWorkflowCategoriesAddModal from './components/addModal';
import WfWorkflowCategoriesEditModal from './components/editModal';
import WfWorkflowCategoriesViewDrawer from './components/viewDrawer';
import WfWorkflowCategoriesSearchBar from './components/searchBar';

const dt = []
@connect(({ wfWorkflowCategoriesModel, loading }) => ({
  wfWorkflowCategoriesModel,
  loading: loading.models.wfWorkflowCategoriesModel,
}))
class WfWorkflowCategoriesIndex extends Component {
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
  };


  columns = [
    {
      title: '类别名称',
      dataIndex: 'categoryName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      ellipsis: true,
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
            color = '';
            text = '';
        }
        return (<Tag color={color}>{text}</Tag>);
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showAddModal1(record)} style={{ marginRight: 15 }}>添加子类别</a>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除流程类别吗？" onConfirm={() => this.delete(record.id, record)}>
            <a>删除</a>
          </Popconfirm>
          {/* <Divider type="vertical" />
          <Popconfirm title="您确认删除该分支吗？" onConfirm={() => this.deletetree(record)}>
            <a>删除该分支</a>
          </Popconfirm> */}
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findAll(pageNumber, pageSize, filter);
    this.Maketree(pageNumber, pageSize, filter);
  }

  /* ***************************************************** */

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
        title: '新建流程类别',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  showAddModal1 = (data) => {
    this.setState({
      addData: {
        title: '新建流程类别',
        visible: true,
        confirmLoading: false,
        data,
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

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑流程类别',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
    });
  };

  showEditModal2 = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑流程类别',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.treeupdate,
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

  /* ****************************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/fetch',
      payload: {
        ...filter,
      },
    });
  };

  Maketree = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/maketree',
      payload: {
        ...filter,
      },
    });
  };

  findAll = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/findAll',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:

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

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'wfWorkflowCategoriesModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建流程类别成功！');
            this.findAll(pageNumber, pageSize, filter)
            this.Maketree(pageNumber, pageSize, filter);
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
    const { pageNumber, pageSize, filter } = this.state;
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'wfWorkflowCategoriesModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改流程类别成功！');
            this.findAll(pageNumber, pageSize, filter);
            this.Maketree(pageNumber, pageSize, filter);
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


  delete = (ids) => {
    console.log(ids)
    const { pageNumber, pageSize, filter } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除流程类别成功！');
            this.setState({
              selectedRowKeys: [],
            })
            this.findAll(pageNumber, pageSize, filter);
            this.Maketree(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除流程类别失败！');
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

  childrenids =(record) => {
    dt.push(record.id)
    if (record.children !== undefined) {
          const childrenT = record.children
          for (let i = 0; i < childrenT.length; i += 1) {
              this.childrenids(childrenT[i])
          }
    }
  }

  deletetree =(record) => {
    this.childrenids(record)
    const ids = Array.from(dt)
    this.delete(ids)
    dt.splice(0, dt.length)
  }

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      wfWorkflowCategoriesModel: { rootdata, total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    console.log(rootdata)
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <WfWorkflowCategoriesSearchBar form={form}
                                             pagination={paginationProps} onFind={this.Maketree} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建流程类别
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除流程类别吗？" onConfirm={() => this.delete(selectedRowKeys)}>
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
              dataSource={rootdata}
              pagination={false}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <WfWorkflowCategoriesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <WfWorkflowCategoriesAddModal {...addData} />}
          {editData.visible && <WfWorkflowCategoriesEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(WfWorkflowCategoriesIndex);
