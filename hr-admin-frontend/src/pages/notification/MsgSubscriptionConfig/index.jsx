import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message } from 'antd';
import moment from 'moment';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import MsgSubscriptionConfigAddModal from './components/addModal';
import MsgSubscriptionConfigEditModal from './components/editModal';
import MsgSubscriptionConfigViewDrawer from './components/viewDrawer';
import MsgSubscriptionConfigSearchBar from './components/searchBar';

@connect(({ msgSubscriptionConfigModel, msgTargetTypesModel, loading }) => ({
  msgSubscriptionConfigModel,
  msgTargetTypesModel,
  loading: loading.models.fetch,
}))
class MsgSubscriptionConfigIndex extends Component {
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
    // {
    //    title: '应用id',
    //    dataIndex: 'appId',
    // },
    // {
    //    title: '租户id',
    //    dataIndex: 'tenantId',
    // },
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '订阅用户',
      dataIndex: 'subscriberUid',
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
    },
    {
      title: '动作类型',
      dataIndex: 'action',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '重复提醒',
      dataIndex: 'isRepeat',
    },
    {
      title: '重复间隔',
      dataIndex: 'repetitionPeriod',
    },
    {
      title: '提前提醒',
      dataIndex: 'isAhead',
    },
    {
      title: '提前量',
      dataIndex: 'aheadTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      render (val) {
        if (val != null) {
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除订阅配置吗？" onConfirm={() => this.delete(record.id)}>
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
  }

  /* *********************************************************************** */

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
    const { msgTargetTypesModel } = this.props;
    this.setState({
      addData: {
        title: '新建订阅配置',
        visible: true,
        confirmLoading: false,
        record: {},
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
        title: '编辑订阅配置',
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

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /* ********************************************* */


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
      type: 'msgSubscriptionConfigModel/fetch',
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
      type: 'msgSubscriptionConfigModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建订阅配置成功！');
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
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'msgSubscriptionConfigModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改订阅配置成功！');
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
      type: 'msgSubscriptionConfigModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (ids instanceof Array) {
              this.setState({ selectedRowKeys: [] })
            }
            message.success('删除订阅配置成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除订阅配置失败！');
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
      msgSubscriptionConfigModel: { data = [], total },
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
              <MsgSubscriptionConfigSearchBar
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
                    title="您确认需要批量删除订阅配置吗？"
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

          <MsgSubscriptionConfigViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <MsgSubscriptionConfigAddModal {...addData} />}
          {editData.visible && <MsgSubscriptionConfigEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MsgSubscriptionConfigIndex);
