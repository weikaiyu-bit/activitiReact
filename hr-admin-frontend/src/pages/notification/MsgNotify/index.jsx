import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import MsgNotifyAddModal from './components/addModal';
import MsgNotifyEditModal from './components/editModal';
import MsgNotifyViewDrawer from './components/viewDrawer';
import MsgNotifySearchBar from './components/searchBar';


@connect(({ msgNotifyModel, msgTargetTypesModel, loading, user }) => ({
  msgNotifyModel,
  msgTargetTypesModel,
  user,
  loading: loading.models.fetch,
}))
class MsgNotifyIndex extends Component {
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
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '发送者头像',
      dataIndex: 'senderAvatar',
      render: text => <Avatar src={text} />,
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      title: '发送者名称',
      dataIndex: 'senderName',
      ellipsis: true,
      width: 110,
    },
    {
      title: '发送者id',
      dataIndex: 'senderId',
      ellipsis: true,
      width: 100,
    },
    {
      title: '发送者类型',
      dataIndex: 'senderType',
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '扩展',
      dataIndex: 'extra',
    },
    {
      title: '动作类型',
      dataIndex: 'action',
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
    },
    {
      title: '目标名称',
      dataIndex: 'targetName',
    },
    {
      title: '目标id',
      dataIndex: 'targetId',
    },
    {
      title: '消息类型',
      dataIndex: 'notifyType',
      render: text => {
        switch (text) {
          case 'remind':
            return <Tag color="magenta">提醒</Tag>;
          case 'announce':
            return <Tag color="blue">通知</Tag>;
          case 'message':
            return <Tag color="green">消息</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '发送时间',
      dataIndex: 'senderAt',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除消息通知吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount () {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
    this.makeTree(filter);
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
    const { msgTargetTypesModel, user } = this.props;
    const { currentUser } = user;
    console.log('当前登录用户', currentUser)
    this.setState({
      addData: {
        title: '新建消息通知',
        visible: true,
        confirmLoading: false,
        record: {},
        currentUser,
        msgTargetTypesModel,
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
    const { msgTargetTypesModel } = this.props;
    this.setState({
      editData: {
        title: '编辑消息通知',
        visible: true,
        confirmLoading: false,
        record,
        msgTargetTypesModel,
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

  onSetPageFilter = newFilter => {
    const { filter } = this.state
    this.setState({ filter: { ...filter, ...newFilter } })
  }

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /* ***************************************************************** */
  // 目标类型生成树
  makeTree = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msgTargetTypesModel/makeTree',
      payload: {
        ...filter,
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msgNotifyModel/fetch',
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
    const {
      msgNotifyModel: { total },
    } = this.props;
    const num = (total + 1 % pageSize !== 0) + (total + 1) / pageSize;
    dispatch({
      type: 'msgNotifyModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建消息通知成功！');
            this.setState({ pageNumber: num })
            this.findPage(num, pageSize, filter);
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
      type: 'msgNotifyModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改消息通知成功！');
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
    const {
      msgNotifyModel: { total },
    } = this.props;
    const num = typeof (ids) === 'number' ? (
      parseInt(((total - 1) / pageSize), 10) + (((total - 1) % pageSize > 0))
    ) : (
        parseInt(((total - ids.length) / pageSize), 10) + (((total - ids.length) % pageSize > 0))
      )
    dispatch({
      type: 'msgNotifyModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除消息通知成功！');
            this.setState({ pageNumber: num })
            this.findPage(num, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除消息通知失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        //  routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  render () {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      msgNotifyModel: { data = [], total },
    } = this.props;
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
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <MsgNotifySearchBar form={form} onSetPageFilter={this.onSetPageFilter} onFind={this.findPage} pagination={paginationProps} />
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
                    title="您确认需要批量删除消息通知吗？"
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
              columns={this.columns}
              rowSelection={rowSelection}
              dataSource={data}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              loading={loading}

            />
          </div>

          <MsgNotifyViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <MsgNotifyAddModal {...addData} />}
          {editData.visible && <MsgNotifyEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MsgNotifyIndex);
