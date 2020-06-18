import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import JobRecordsAddModal from './components/addModal';
import JobRecordsEditModal from './components/editModal';
import JobRecordsViewDrawer from './components/viewDrawer';
import JobRecordsSearchBar from './components/searchBar';

@connect(({ jobRecordsModel, loading }) => ({
  jobRecordsModel,
  loading: loading.models.fetch,
}))
class JobRecordsIndex extends Component {
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
        title: '新建任务更新记录',
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
        title: '编辑任务更新记录',
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
      type: 'jobRecordsModel/fetch',
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
      type: 'jobRecordsModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建任务更新记录成功！');
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
      type: 'jobRecordsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改任务更新记录成功！');
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
      type: 'jobRecordsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除任务更新记录成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除任务更新记录失败！');
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
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  columns = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
    },
    {
      title: '之前状态',
      dataIndex: 'preStatus',
      render(text, record) {
        // let text = (typeof record == 'object')? record.status: record;
        let color = '';
        switch (text) {
          case 'editing':
            text = '编辑中';
            color = 'orange';
            break;
          case 'planning':
            text = '计划中';
            color = 'lime';
            break;
          case 'doing':
            text = '进行中';
            color = 'cyan';
            break;
          case 'completed':
            text = '已完成';
            color = 'blue';
            break;
          case 'delay':
            text = '已逾期';
            color = 'magenta';
            break;
          case 'pause':
            text = '暂停';
            color = '#CCCCCC';
            break;
          case 'undone':
            text = '已撤销';
            color = '#666666';
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '当前状态',
      dataIndex: 'curStatus',
      render(text, record) {
        // let text = (typeof record == 'object')? record.status: record;
        let color = '';
        switch (text) {
          case 'editing':
            text = '编辑中';
            color = 'orange';
            break;
          case 'planning':
            text = '计划中';
            color = 'lime';
            break;
          case 'doing':
            text = '进行中';
            color = 'cyan';
            break;
          case 'completed':
            text = '已完成';
            color = 'blue';
            break;
          case 'delay':
            text = '已逾期';
            color = 'magenta';
            break;
          case 'pause':
            text = '暂停';
            color = '#CCCCCC';
            break;
          case 'undone':
            text = '已撤销';
            color = '#666666';
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作码',
      dataIndex: 'operatCode',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '操作描述',
      dataIndex: 'description',
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
    },
    {
      title: '操作人',
      dataIndex: 'operatorUid',
    },
    {
      title: '操作人名称',
      dataIndex: 'operatorName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除任务更新记录吗？" onConfirm={() => this.delete(record.id)}>
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
      jobRecordsModel: { data = [], total },
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
              <JobRecordsSearchBar
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
                    title="您确认需要批量删除任务更新记录吗？"
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

          <JobRecordsViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <JobRecordsAddModal {...addData} />}
          {editData.visible && <JobRecordsEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(JobRecordsIndex);
