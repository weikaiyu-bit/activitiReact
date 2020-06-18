/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import RtCategoryAddModal from './components/addModal';
import RtCategoryEditModal from './components/editModal';
import RtCategoryViewDrawer from './components/viewDrawer';
import RtCategorySearchBar from './components/searchBar';

@connect(({ rtCategoryModel, loading }) => ({
  rtCategoryModel,
  loading: loading.models.fetch,
}))
class RtCategoryIndex extends Component {
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
    this.find(filter);
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
    this.setState({
      addData: {
        title: record ? '添加人才分类子节点' : '新建人才分类信息',
        visible: true,
        confirmLoading: false,
        record,
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
        title: '编辑后备人才分类',
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
    this.find(this.state.filter);
  };

  /** ********************************************************************************************* */

  find = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rtCategoryModel/fetch',
      payload: {
        ...filter,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    dispatch({
      type: 'rtCategoryModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建后备人才分类成功！');
            this.find(filter);
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
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'rtCategoryModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改后备人才分类成功！');
            this.find(filter);
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
    const { filter } = this.state;
    dispatch({
      type: 'rtCategoryModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除后备人才分类成功！');
            this.find(filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除后备人才分类失败！');
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
    const msg = (response.msg) ? response.msg : '发生未知错误！';

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
       title: '分类名称',
       dataIndex: 'categoryName',
       render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
       title: '备注',
       dataIndex: 'remark',
    },
    {
       title: '创建人id',
       dataIndex: 'creatorId',
    },
    {
       title: '创建时间',
       dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={ e => this.showAddModal(e, record)}>新建子节点</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除后备人才分类吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      rtCategoryModel: { data = [], total, tree },
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
              <RtCategorySearchBar form={form} pagination={paginationProps} onFind={this.find} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建根节点
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除后备人才分类吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete" >批量删除</Button>
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
              dataSource={tree}
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <RtCategoryViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <RtCategoryAddModal {...addData} />}
          {editData.visible && <RtCategoryEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(RtCategoryIndex);
