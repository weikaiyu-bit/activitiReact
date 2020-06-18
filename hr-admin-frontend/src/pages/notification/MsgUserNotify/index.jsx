import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Switch, Tag } from 'antd';

import ErrorCode from '@/dtsea/common/ErrorCode';
import MsgUserNotifyAddModal from './components/addModal';
import MsgUserNotifyEditModal from './components/editModal';
import MsgUserNotifyViewDrawer from './components/viewDrawer';
import MsgUserNotifySearchBar from './components/searchBar';

@connect(({ msgUserNotifyModel, loading }) => ({
  msgUserNotifyModel,
  loading: loading.models.fetch,
}))
class MsgUserNotifyIndex extends Component {
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
      title: '消息所属者',
      dataIndex: 'ownerUid',
      fixed: 'left',
      width: 100,
    },
    {
      title: '消息类型',
      dataIndex: 'notifyType',
      fixed: 'left',
      width: 100,
      render: (text) => {
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
      title: '消息内容',
      dataIndex: 'content',
      fixed: 'left',
      width: 100,
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: '扩展',
      dataIndex: 'extra',
      width: 100,
    },
    {
      title: '已读标记',
      dataIndex: 'isRead',
      width: 100,
      render: (text) => {
        if (text === 'true') {
          return <Switch size="small" disabled="true" defaultChecked />;
        } return <Switch size="small" />;
      },
    },
    {
      title: '点击关闭',
      dataIndex: 'clickClose',
      width: 100,
      render: (text) => {
        if (text === 'true') {
          return <Switch size="small" disabled="true" defaultChecked />;
          } return <Switch size="small" />;
      },
    },
    {
      title: '目标id',
      dataIndex: 'targetId',
      width: 100,
    },
    {
      title: '目标名称',
      dataIndex: 'targetName',
      width: 100,
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      width: 100,
    },
    {
      title: '动作类型',
      dataIndex: 'action',
      width: 100,
    },
    {
      title: '发送者id',
      dataIndex: 'senderId',
      width: 100,
    },
    {
      title: '发送者名称',
      dataIndex: 'senderName',
      width: 100,
    },
    {
      title: '发送者头像',
      dataIndex: 'senderAvatar',
      width: 100,
    },
    {
      title: '发送者类型',
      dataIndex: 'senderType',
      width: 100,
    },
    {
      title: '发送时间',
      dataIndex: 'sentAt',
      width: 110,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 110,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 110,
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="您确认删除用户消息队列吗？"
            onConfirm={() => this.delete(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
  }

  /* ********************************************************************* */

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
        title: '新建用户消息队列',
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
    this.setState({
      editData: {
        title: '编辑用户消息队列',
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

  /* ********************************************************************* */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msgUserNotifyModel/fetch',
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
      type: 'msgUserNotifyModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建用户消息队列成功！');
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
      type: 'msgUserNotifyModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改用户消息队列成功！');
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
      type: 'msgUserNotifyModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除用户消息队列成功！');
            if (ids instanceof Array) {
              this.setState({ selectedRowKeys: [] })
            }
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除用户消息队列失败！');
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
        // routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      msgUserNotifyModel: { data = [], total },
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
              <MsgUserNotifySearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.findPage}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              {/* <span style={{ marginBottom: '16px', marginRight: '8px' }}>
              <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新建
              </Button>
              </span> */}
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除用户消息队列吗？"
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
              scroll={{ x: 1920 }}
            />
          </div>

          <MsgUserNotifyViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <MsgUserNotifyAddModal {...addData} />}
          {editData.visible && <MsgUserNotifyEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MsgUserNotifyIndex);
