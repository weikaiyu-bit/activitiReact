/* eslint-disable react/sort-comp */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, Tag, message } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import PerformanceSummaryCard from './components/PerformanceSummaryCard';

@connect(({ rtPerformanceVoteModel, loading }) => ({
  rtPerformanceVoteModel,
  loading: loading.models.fetch,
}))
class RtPerformanceVoteIndex extends Component {
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
        title: '新建个人业绩展示信息',
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
        title: '编辑个人业绩展示信息',
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
      type: 'rtPerformanceVoteModel/fetch',
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
      type: 'rtPerformanceVoteModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建个人业绩展示信息成功！');
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
      type: 'rtPerformanceVoteModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改个人业绩展示信息成功！');
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
      type: 'rtPerformanceVoteModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除个人业绩展示信息成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除个人业绩展示信息失败！');
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
      title: '被推荐人姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '照片',
      dataIndex: 'photoUrl',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
    },
    {
      title: '民族',
      dataIndex: 'national',
    },
    {
      title: '籍贯',
      dataIndex: 'nativePlace',
    },
    {
      title: '婚姻状况',
      dataIndex: 'maritalStatus',
    },
    {
      title: '健康状况',
      dataIndex: 'health',
    },
    {
      title: '政治面貌',
      dataIndex: 'politicalOrientation',
    },
    {
      title: '参加工作时间',
      dataIndex: 'workTime',
    },
    {
      title: '所在单位',
      dataIndex: 'orgName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '业绩简介',
      dataIndex: 'performanceProfile',
    },
    {
      title: '领导评价',
      dataIndex: 'leaderEvaluation',
    },
    {
      title: '推荐理由',
      dataIndex: 'reason',
    },
    {
      title: '推荐人意见',
      dataIndex: 'recommenderOpinion',
    },
    {
      title: '推荐人',
      dataIndex: 'recommender',
    },
    {
      title: '推荐时间',
      dataIndex: 'recommendedTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '投票计数',
      dataIndex: 'voteCount',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text, data) => {
        switch (data.state) {
          case '编辑中':
            return <Tag color="orange">{data.state}</Tag>;
          case '审核中':
            return <Tag color="lime">{data.state}</Tag>;
          case '已收录':
            return <Tag color="cyan">{data.state}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除个人业绩展示信息吗？" onConfirm={() => this.delete([record.uid])}>
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
      rtPerformanceVoteModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };

    return (
      <div>
        <Card bordered={false}>
          <div>
            <PerformanceSummaryCard dataSource={data} />
          </div>
        </Card>
      </div>
    );
  }
}

export default Form.create()(RtPerformanceVoteIndex);
