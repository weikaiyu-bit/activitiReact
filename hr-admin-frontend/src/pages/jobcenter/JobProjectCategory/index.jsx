import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import JobProjectCategoryAddModal from './components/addModal';
import JobProjectCategoryEditModal from './components/editModal';
import JobProjectCategoryViewDrawer from './components/viewDrawer';
import JobProjectCategorySearchBar from './components/searchBar';

@connect(({ jobProjectCategoryModel, loading }) => ({
  jobProjectCategoryModel,
  loading: loading.models.fetch,
}))
class JobProjectCategoryIndex extends Component {
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

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
    this.makeTree(filter);
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

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建项目类别',
        visible: true,
        confirmLoading: false,
        type: 'root',
        record: {},
        pidData: { id: 0 },
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  showAddChildrenModal = record => {
    this.setState({
      addData: {
        title: '新建项目类别',
        visible: true,
        confirmLoading: false,
        type: 'children',
        record: {},
        pidData: { ...record },
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
        title: '编辑项目类别',
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

  // 生成树
  makeTree = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectCategoryModel/makeTree',
      payload: {
        ...filter,
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProjectCategoryModel/fetch',
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
      type: 'jobProjectCategoryModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建项目类别成功！');
            const { filter } = this.state;
            this.makeTree(filter);
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
      type: 'jobProjectCategoryModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改项目类别成功！');
            const { filter } = this.state;
            this.makeTree(filter);
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
      type: 'jobProjectCategoryModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            this.setState({ selectedRowKeys: [] });
            message.success('删除项目类别成功！');
            const { filter } = this.state;
            this.makeTree(filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除项目类别失败！');
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
      title: '类别名称',
      dataIndex: 'categoryName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
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
          <a onClick={() => this.showAddChildrenModal(record)}>新建子类别</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除项目类别吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  render() {
    console.log(this.props);
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      jobProjectCategoryModel: { data = [], total, treeData },
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
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <JobProjectCategorySearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.makeTree}
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
                    title="您确认需要批量删除项目类别吗？"
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
              dataSource={treeData}
              pagination={false}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <JobProjectCategoryViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <JobProjectCategoryAddModal {...addData} />}
          {editData.visible && <JobProjectCategoryEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(JobProjectCategoryIndex);
