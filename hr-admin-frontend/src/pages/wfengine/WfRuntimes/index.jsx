import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Popconfirm, Form, message, Tag } from 'antd';

import ErrorCode from '@/dtsea/common/ErrorCode';
import WfRuntimesAddModal from './components/addModal';
import WfRuntimesEditModal from './components/editModal';
import WfRuntimesViewDrawer from './components/viewDrawer';
import WfRuntimesSearchBar from './components/searchBar';
import moment from 'moment';

@connect(({ wfRuntimesModel, loading }) => ({
  wfRuntimesModel,
  loading: loading.models.wfRuntimesModel,
}))
class WfRuntimesIndex extends Component {
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
      title: '流程名字',
      dataIndex: 'flowName',
    },
    {
      title: '流程类别',
      dataIndex: 'categoryName',
    },
    {
      title: '实例名称',
      dataIndex: 'runtimeName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '当前节点',
      dataIndex: 'nodeName',
    },
    {
      title: '实例状态',
      dataIndex: 'status',
      render(value) {
        const text = (typeof value === 'object') ? value.status : value;
        let color = '';
        switch (text) {
          case '正在发起':
            color = 'lime';
            break;
          case '运行中':
            color = 'cyan';
            break;
          case '已停止':
            color = 'red';
            break;
          case '暂停':
            color = 'orange';
            break;
          default:
            color = ''
        }

        return (<Tag color={color}>{text}</Tag>);
      },
    },
    {
      title: '实例轨迹',
      dataIndex: 'trailJson',
      ellipsis: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      render(val) {
        if (val != null) {
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
    },
    {
      title: '更新人',
      dataIndex: 'updatorUid',
    },
    /* {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除工作流实例吗？" onConfirm={() => this.delete([record.uid])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    }, */
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
  }

  /* *************************************************************************** */

  showDrawer = record => {
    this.findLogs();
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
        title: '新建工作流实例',
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
        title: '编辑工作流实例',
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
   // this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /* ************************************************************* */

  findPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize });
    const { dispatch } = this.props;
    dispatch({
      type: 'wfRuntimesModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findLogs = () => {
    const filter = {}
    const { dispatch } = this.props;
    const { pageNumber, pageSize } = this.state;
    dispatch({
      type: 'wfRuntimesModel/fetchLogs',
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
      type: 'wfRuntimesModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建工作流实例成功！');
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
      type: 'wfRuntimesModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改工作流实例成功！');
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
      type: 'wfRuntimesModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除工作流实例成功！');
            this.setState({
              selectedRowKeys: [],
            })
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除工作流实例失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  callbackDefault = response => {
    const msg = (response.msg) ? response.msg : '发生未知错误！';
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
      wfRuntimesModel: { data = [], logs = [], total },
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
              <WfRuntimesSearchBar form={form}
                                   pagination={paginationProps} onFind={this.findPage} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title ="您确认需要批量删除工作流实例吗？" onConfirm={() => this.delete(selectedRowKeys)}>
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
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <WfRuntimesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            logs={logs}
            onClose={this.hideDrawer}
          />
          {addData.visible && <WfRuntimesAddModal {...addData} />}
          {editData.visible && <WfRuntimesEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(WfRuntimesIndex);
