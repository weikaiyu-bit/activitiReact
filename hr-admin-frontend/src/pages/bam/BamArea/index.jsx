/* eslint-disable default-case */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import Item from 'antd/lib/list/Item';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import BamAreaAddModal from './components/addModal';
import BamAreaEditModal from './components/editModal';
import BamAreaViewDrawer from './components/viewDrawer';
import BamAreaSearchBar from './components/searchBar';

@connect(({ bamAreaModel, loading }) => ({
  bamAreaModel,
  loading: loading.models.fetch,
}))
class BamAreaIndex extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pid: { pid: 0 },
    tree: {},
    cid: 0,
    // pageNumber: 1,
    // pageSize: 10,
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
    const { pageNumber, pageSize, filter, pid } = this.state;
    this.findPid({ pid: 0 });
    // this.findPage(pageNumber, pageSize, filter);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bamAreaModel.cdata !== nextProps.bamAreaModel.cdata) {
      if (nextProps.bamAreaModel.cdata) {
        const { tree } = this.props.bamAreaModel;
        const id = this.state.cid;
        const { cdata } = nextProps.bamAreaModel;
        const dataMap = items => {
          items.find(item => {
            if (item.id === id) {
              item.children = cdata;
              if (item.children.length === 0) {
                delete item.children;
              }
              return items;
            }
            if (item.children && item.children.length > 0) {
              dataMap(item.children);
            }
          });
        };
        dataMap(tree);
      }
    }
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
        title: '新建区域字典',
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

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑区域字典',
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
    dispatch({
      type: 'bamAreaModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findFilter = filter => {
    const { dispatch } = this.props;
    this.setState({
      filter,
    });
    dispatch({
      type: 'bamAreaModel/fetch',
      payload: {
        ...filter,
      },
    });
  };

  findPid = filter => {
    const { dispatch } = this.props;
    this.setState({
      filter,
    });
    dispatch({
      type: 'bamAreaModel/listpid',
      payload: {
        ...filter,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamAreaModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建区域字典成功！');
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
      type: 'bamAreaModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改区域字典成功！');
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
      type: 'bamAreaModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除区域字典成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除区域字典失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  handldOnExpand = (expanded, record) => {
    const { id } = record;
    if (record.children.length === 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'bamAreaModel/clist',
        payload: {
          pid: id,
        },
      });
      this.setState({
        cid: id,
      });
    }
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
      title: '区域名称',
      dataIndex: 'areaName',
    },
    {
      title: '区域代码',
      dataIndex: 'areaCode',
    },
  ];

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      bamAreaModel: { data = [], tree, cdata },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <BamAreaSearchBar form={form} onFind={this.findFilter} />
            </div>

            {/* <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除区域字典吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete" >批量删除</Button>
                  </Popconfirm>
                </span>
              ) : (
                  ''
                )}
            </div> */}

            <Table
              rowKey="id"
              loading={loading}
              columns={this.columns}
              dataSource={tree}
              onExpand={this.handldOnExpand}
              // rowSelection={rowSelection}
              pagination={false}
            />
          </div>

          <BamAreaViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <BamAreaAddModal {...addData} />}
          {editData.visible && <BamAreaEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(BamAreaIndex);
