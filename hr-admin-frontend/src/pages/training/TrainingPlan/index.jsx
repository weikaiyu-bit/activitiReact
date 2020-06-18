/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import TrainingPlanAddModal from './components/addModal';
import TrainingPlanEditModal from './components/editModal';
import TrainingPlanViewDrawer from './components/viewDrawer';
import TrainingPlanSearchBar from './components/searchBar';

@connect(({ trainingPlanModel, loading }) => ({
  trainingPlanModel,
  loading,
}))
class TrainingPlanIndex extends Component {
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
        headTitle: '新建培训计划',
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
        headTitle: '编辑培训计划',
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
      type: 'trainingPlanModel/fetch',
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
      type: 'trainingPlanModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建培训计划成功！');
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

  update = (id, values, msg) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'trainingPlanModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            if (msg) {
              message.success(msg);
            } else {
              message.success('修改培训计划成功！');
            }
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
      type: 'trainingPlanModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除培训计划成功！');
            this.setState({
              selectedRowKeys: [],
            });
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除培训计划失败！');
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
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '培训内容',
      dataIndex: 'content',
      ellipsis: true,
      width: 150,
    },
    {
      title: '培训时间',
      dataIndex: 'trainingTime',
    },
    {
      title: '培训地点',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '培训对象',
      dataIndex: 'trainingObjects',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 150,
    },
    {
      title: '经办单位',
      dataIndex: 'handlingOrgName',
      ellipsis: true,
    },
    {
      title: '经办人',
      dataIndex: 'handler',
    },
    {
      title: '联系电话',
      dataIndex: 'tel',
    },
    {
      title: '计划状态',
      dataIndex: 'state',
      render: (text, data) => {
        switch (data.state) {
          case '编辑中':
            return <Tag color="cyan">{data.state}</Tag>;
          case '已发布':
            return <Tag color="blue">{data.state}</Tag>;
          case '已关闭':
            return <Tag color="#CCC">{data.state}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '发布人',
      dataIndex: 'publisher',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 250,
      render: (text, record) => (
        <>
          <a onClick={() => this.update(record.id, { ...record, state: '已发布' }, '发布成功')}>发布</a>
          <Divider type="vertical" />
          <a onClick={() => this.update(record.id, { ...record, state: '已撤下' }, '撤下成功')}>撤下</a>
          <Divider type="vertical" />
          <a onClick={() => this.update(record.id, { ...record, state: '已关闭' }, '关闭成功')}>关闭</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除培训计划吗？" onConfirm={() => this.delete([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      // loading,
      form,
      trainingPlanModel: { data = [], total },
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
              <TrainingPlanSearchBar form={form} pagination={paginationProps} onFind={this.findPage} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除培训计划吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete" >批量删除</Button>
                  </Popconfirm>
                </span>) : ('')}
            </div>

            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              size="middle"
              bordered
              onChange={this.handleTableChange}
            />
          </div>
          <TrainingPlanViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <TrainingPlanAddModal {...addData} />}
          {editData.visible && <TrainingPlanEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TrainingPlanIndex);
