import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message } from 'antd';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import TargetTypesAddModal from './components/addTargetTypeModal';
import TargetTypesEditModal from './components/editTargetTypeModal';
import MsgNotifyConfigAddModal from './components/addModal';
import MsgNotifyConfigEditModal from './components/editModal';
import MsgNotifyConfigViewDrawer from './components/viewDrawer';
import MsgNotifyConfigSearchBar from './components/searchBar';

@connect(({ msgNotifyConfigModel, msgTargetTypesModel, loading }) => ({
  msgNotifyConfigModel,
  msgTargetTypesModel,
  loading: loading.models.fetch,
}))
class MsgNotifyConfigIndex extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    addTargetTypeData: {
      visible: false,
    },
    editTargetTypeData: {
      visible: false,
    },
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
      title: '目标类型',
      dataIndex: 'targetType',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
          <a onClick={() => this.showAddModal(record)}>添加关联动作</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditTargetTypeModal(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除目标类型吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount () {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
  }

  /* ************************************************************** */

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

  showEditModal = record => {
    this.setState({
      editData: {
        title: '编辑订阅配置',
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

  // 目标类型添加
  showAddTargetTypeModal = flag => {
    this.setState({
      addTargetTypeData: {
        title: '新建目标类型',
        visible: !!flag,
        record: {},
        confirmLoading: false,
        onOk: this.addTargetType,
        onClose: this.hideAddTargetTypeModal,
      },
    });
  };

  // 隐藏目标类型model
  hideAddTargetTypeModal = flag => {
    this.setState({
      addTargetTypeData: {
        visible: !!flag,
        record: {},
      },
    });
  };

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建消息配置',
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

  // 编辑目标类型
  showEditTargetTypeModal = (flag, record) => {
    const {
      msgNotifyConfigModel: { data },
    } = this.props;
    this.setState({
      editTargetTypeData: {
        title: '编辑目标类型配置',
        visible: !!flag,
        confirmLoading: false,
        record: record || {},
        listRecord: data,
        onOk: this.updateTargetType,
        onClose: this.hideEditTargetTypeModal,
      },
    });
  };

  // 编辑目标类型model
  hideEditTargetTypeModal = flag => {
    this.setState({
      editTargetTypeData: {
        visible: !!flag,
        confirmLoading: false,
        record: {},
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

  /* ****************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msgNotifyConfigModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  addTargetType = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'msgTargetTypesModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建消息配置成功！');
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

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'msgNotifyConfigModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建消息配置成功！');
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

  // 目标类型修改方法
  updateTargetType = (id, values) => {
    const { pageNumber, pageSize, filter } = this.state;
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'msgTargetTypesModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改目标类型成功！');
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
    const { pageNumber, pageSize, filter } = this.state;
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'msgNotifyConfigModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改消息配置成功！');
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

  deleteConfig = id => {
    console.log(id);
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'msgNotifyConfigModel/remove',
      payload: { ids: id },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除消息配置成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除消息配置失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'msgTargetTypesModel/remove',
      payload: { ids: id },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除目标类型配置成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除目标类型配置失败！');
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

  expandedRowRender = record => {
    const subData = record.list;

    const columns = [
      // {
      //   title: '目标类型',
      //   dataIndex: 'targetType',
      //   key: 'targetType'
      // },
      {
        title: '关联动作',
        dataIndex: 'action',
        key: 'action',
        render: (text, test) => <a onClick={() => this.showDrawer(test)}>{text}</a>,
      },
      {
        title: '订阅事件',
        dataIndex: 'reasonAction',
        key: 'reasonAction',
      },
      {
        title: '消息模板',
        dataIndex: 'notifyTmpl',
        key: 'notifyTmpl',
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, test) => (
          <>
            <a onClick={() => this.showEditModal(test)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="您确认删除消息配置吗？" onConfirm={() => this.deleteConfig(test.id)}>
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];

    return <Table rowKey="id" columns={columns} dataSource={subData} pagination={false} />;
  };

  render () {
    const {
      pageNumber,
      pageSize,
      selectedRowKeys,
      addData,
      editData,
      addTargetTypeData,
      editTargetTypeData,
    } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    const {
      loading,
      form,
      msgNotifyConfigModel: { data = [], total },
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
              <MsgNotifyConfigSearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.findPage}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.showAddTargetTypeModal(true)}
                >
                  新建目标类型
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除消息配置吗？"
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
              // rowSelection={rowSelection}
              expandedRowRender={this.expandedRowRender}
              onChange={this.handleTableChange}
            />
          </div>

          <MsgNotifyConfigViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {editTargetTypeData.visible && <TargetTypesEditModal {...editTargetTypeData} />}
          {addTargetTypeData.visible && <TargetTypesAddModal {...addTargetTypeData} />}
          {addData.visible && <MsgNotifyConfigAddModal {...addData} />}
          {editData.visible && <MsgNotifyConfigEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MsgNotifyConfigIndex);
