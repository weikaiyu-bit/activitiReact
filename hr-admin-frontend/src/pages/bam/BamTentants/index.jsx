/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import BamTentantsAddModal from './components/addModal';
import BamTentantsEditModal from './components/editModal';
import BamTentantsViewDrawer from './components/viewDrawer';
import BamTentantsSearchBar from './components/searchBar';

@connect(({ bamTentantsModel, loading }) => ({
  bamTentantsModel,
  loading: loading.models.fetch,
}))
class BamTentantsIndex extends Component {
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
        title: '新建租户信息',
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
        title: '编辑租户信息',
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
    this.setState({
      filter,
      pageNumber,
    });
    dispatch({
      type: 'bamTentantsModel/fetch',
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
      type: 'bamTentantsModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建租户信息成功！');
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
      type: 'bamTentantsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改租户信息成功！');
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
      bamTentantsModel: { total },
    } = this.props;
    const { pageNumber, pageSize, filter } = this.state;

    const newTotal = total - ids.length;
    // 计算删除后页数
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize);
    dispatch({
      type: 'bamTentantsModel/remove',
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
            message.success('删除租户信息成功！');
            break;
          case ErrorCode.FAILURE:
            message.error('删除租户信息失败！');
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
      title: '租户名称',
      dataIndex: 'tentantName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '所在国家',
      dataIndex: 'country',
    },
    {
      title: '所在区省',
      dataIndex: 'province',
    },
    {
      title: '所在城市',
      dataIndex: 'city',
    },
    {
      title: '所在地址',
      dataIndex: 'address',
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        switch (record.status) {
          case 'ENABLED':
            return <Tag color="cyan">启用</Tag>;
          case 'DISABLE':
            return <Tag color="magenta">停用</Tag>;
          case 'IN_REVIEW':
            return <Tag color="orange">审核中</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
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
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除租户信息吗？" onConfirm={() => this.delete([record.id])}>
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
      bamTentantsModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
      // showTotal: all => `共 ${all} 条`,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <BamTentantsSearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.findPage}
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
                    title="您确认需要批量删除租户信息吗？"
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
              onChange={this.handleTableChange}
            />
          </div>

          <BamTentantsViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <BamTentantsAddModal {...addData} />}
          {editData.visible && <BamTentantsEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(BamTentantsIndex);
