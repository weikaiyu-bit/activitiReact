/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import BamDictionaryAddModal from './components/addModal';
import BamDictionaryEditModal from './components/editModal';
import BamDictionaryViewDrawer from './components/viewDrawer';
import BamDictionarySearchBar from './components/searchBar';

@connect(({ bamDictionaryModel, loading }) => ({
  bamDictionaryModel,
  loading: loading.models.fetch,
}))
class BamDictionaryIndex extends Component {
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
    // this.findFilter(filter);
    // this.findTentants();
    this.findPage(pageNumber, pageSize, filter);
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
        title: '新建数据字典',
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
        title: '编辑数据字典',
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

  findFilter = filter => {
    const { dispatch } = this.props;
    this.setState({
      filter,
    });
    dispatch({
      type: 'bamDictionaryModel/fetch',
      payload: {
        ...filter,
      },
    });
  };

  findTentants = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamDictionaryModel/fetchTentans',
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    console.log('pageNumber', pageNumber);
    console.log('pageSize', pageSize);
    const { dispatch } = this.props;
    this.setState({
      filter,
    });
    dispatch({
      type: 'bamDictionaryModel/fetch',
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
      type: 'bamDictionaryModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建数据字典成功！');
            // this.findFilter(filter);
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
      type: 'bamDictionaryModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改数据字典成功！');
            this.findPage(pageNumber, pageSize, filter);
            // this.findFilter(filter);
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
      type: 'bamDictionaryModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除数据字典成功！');
            this.findPage(pageNumber, pageSize, filter);
            // this.findFilter(filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除数据字典失败！');
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
      title: '字典名称',
      dataIndex: 'dictName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '节点类型',
      dataIndex: 'nodeType',
      render: (text, record) => {
        switch (record.nodeType) {
          case 'category':
            return <Tag color="#CD853F">类别</Tag>;
          case 'dictionary':
            return <Tag color="#FF8C00">字典</Tag>;
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
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {/* <a onClick={e => this.showAddModal(e, record)}>添加子节点</a>
          <Divider type="vertical" /> */}
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除数据字典吗？" onConfirm={() => this.delete([record.id])}>
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
      bamDictionaryModel: { data = [], tree = [], tentants, total },
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
              <BamDictionarySearchBar form={form} onFind={this.findFilter} />
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
                    title="您确认需要批量删除数据字典吗？"
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
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              // pagination={false}
              onChange={this.handleTableChange}
            />
          </div>

          <BamDictionaryViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            tentants={tentants}
            onClose={this.hideDrawer}
          />
          {addData.visible && <BamDictionaryAddModal {...addData} tentants={tentants} />}
          {editData.visible && <BamDictionaryEditModal {...editData} tentants={tentants} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(BamDictionaryIndex);
