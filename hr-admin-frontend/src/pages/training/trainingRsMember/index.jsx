/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Tag, Form, message } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import TrainingRsMemberAddModal from './components/addModal';
import TrainingRsMemberEditModal from './components/editModal';
import TrainingRsMemberViewDrawer from './components/viewDrawer';
import TrainingRsMemberSearchBar from './components/searchBar';

@connect(({ trainingRsMemberModel, loading }) => ({
  trainingRsMemberModel,
  loading,
}))
class TrainingRsMemberIndex extends Component {
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
    this.findPlan(pageNumber, pageSize, filter);
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
        title: '新建培训人员名单',
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
        title: '编辑培训人员名单',
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
      type: 'trainingRsMemberModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findPlan = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'trainingRsMemberModel/fetchTrainingPlan',
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
      type: 'trainingRsMemberModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建培训人员名单成功！');
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
      type: 'trainingRsMemberModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改培训人员名单成功！');
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
      type: 'trainingRsMemberModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除培训人员名单成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除培训人员名单失败！');
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
       width: 200,
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
      trainingRsMemberModel: { planData = [], total },
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
              <TrainingRsMemberSearchBar form={form} pagination={paginationProps} onFind={this.findPlan} />
            </div>

            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={planData}
              size="middle"
              bordered
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <TrainingRsMemberViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <TrainingRsMemberAddModal {...addData} />}
          {editData.visible && <TrainingRsMemberEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TrainingRsMemberIndex);
