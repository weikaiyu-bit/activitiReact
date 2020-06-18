import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message } from 'antd';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import MsgTargetTypesAddModal from './components/addModal';
import MsgTargetTypesEditModal from './components/editModal';
import MsgTargetTypesViewDrawer from './components/viewDrawer';
import MsgTargetTypesSearchBar from './components/searchBar';
import MsgNotifyConfigAddModal from '../MsgNotifyConfig/components/addModal';
import MsgNotifyConfigEditModal from '../MsgNotifyConfig/components/editModal';

@connect(({ msgTargetTypesModel, msgNotifyConfigModel, loading }) => ({
  msgTargetTypesModel,
  msgNotifyConfigModel,
  loading: loading.models.fetch,
}))
class MsgTargetTypesIndex extends Component {
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
    msgNotifyConfigAddData: {
      visible: false,
      record: {},
    },
    msgNotifyConfigEditData: {
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
          <a onClick={() => this.showMsgNofityConfigAddModal(record)}>添加关联动作</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
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
    this.makeTree(filter)
    this.findNotifyConfig({ targetType: '21' })
  }

  /* ******************************** */

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
    const {
      msgTargetTypesModel: { treeData },
    } = this.props;
    this.setState({
      addData: {
        title: '新建目标类型',
        visible: true,
        confirmLoading: false,
        record: {},
        treeData,
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
    const {
      msgTargetTypesModel: { treeData },
    } = this.props;
    this.setState({
      editData: {
        title: '编辑目标类型',
        visible: true,
        confirmLoading: false,
        record,
        treeData,
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

  showMsgNofityConfigAddModal = values => {
    const { msgTargetTypesModel } = this.props;
    this.setState({
      msgNotifyConfigAddData: {
        title: '新建关联动作',
        visible: true,
        confirmLoading: false,
        record: {},
        values,
        msgTargetTypesModel,
        onOk: this.addMsgNotifyConfig,
        onClose: this.hideMsgNofityConfigAddModal,
      },
    });
  };

  hideMsgNofityConfigAddModal = () => {
    this.setState({
      msgNotifyConfigAddData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  showMsgNofityConfigEditModal = record => {
    const { msgTargetTypesModel } = this.props;
    this.setState({
      msgNotifyConfigEditData: {
        title: '编辑目标类型',
        visible: true,
        confirmLoading: false,
        record,
        msgTargetTypesModel,
        onOk: this.updateMsgNotifyConfig,
        onClose: this.hideMsgNofityConfigEditModal,
      },
    });
  };

  hideMsgNofityConfigEditModal = () => {
    this.setState({
      msgNotifyConfigEditData: {
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

  /* **************************************************************** */
  // 测试
  findNotifyConfig = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msgNotifyConfigModel/find',
      payload: {
        ...filter,
      },
    });
  };

  // 增加关联动作
  addMsgNotifyConfig = (id, values) => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    dispatch({
      type: 'msgNotifyConfigModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建消息配置成功！');
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

  // 修改关联动作
  updateMsgNotifyConfig = (id, values) => {
    const { filter } = this.state;
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'msgNotifyConfigModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改消息配置成功！');
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

  // 生成树
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
      type: 'msgTargetTypesModel/fetch',
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
      type: 'msgTargetTypesModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建目标类型成功！');
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
    const { pageNumber, pageSize, filter } = this.state;
    const payload = { id, ...values };
    dispatch({
      type: 'msgTargetTypesModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改目标类型成功！');
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

  deleteConfig = id => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'msgNotifyConfigModel/remove',
      payload: { ids: id },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除消息配置成功！');
            this.makeTree(filter);
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

  delete = ids => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    dispatch({
      type: 'msgTargetTypesModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除目标类型成功！');
            this.makeTree(filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除目标类型失败！');
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
    console.log('record', record);
    const subData = record.children;
    console.log('subData', subData)
    const columns = [
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
            <a onClick={() => this.showMsgNofityConfigEditModal(test)}>编辑</a>
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
    console.log('MsgTargetTypes', this.props);
    const { pageNumber, pageSize, selectedRowKeys, addData, editData, msgNotifyConfigEditData, msgNotifyConfigAddData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      msgTargetTypesModel: { data = [], total, treeData },
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
              <MsgTargetTypesSearchBar
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
                    title="您确认需要批量删除目标类型吗？"
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
              // rowSelection={rowSelection}
              // onChange={this.handleTableChange}
              expandedRowRender={this.expandedRowRender}
              childrenColumnName={false}
            />
          </div>

          <MsgTargetTypesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {msgNotifyConfigAddData.visible && <MsgNotifyConfigAddModal {...msgNotifyConfigAddData} />}
          {msgNotifyConfigEditData.visible && <MsgNotifyConfigEditModal {...msgNotifyConfigEditData} />}
          {addData.visible && <MsgTargetTypesAddModal {...addData} />}
          {editData.visible && <MsgTargetTypesEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MsgTargetTypesIndex);
