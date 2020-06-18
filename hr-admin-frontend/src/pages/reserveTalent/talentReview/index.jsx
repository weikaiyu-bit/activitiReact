/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import moment from 'moment';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import TalentReviewAddModal from './components/addModal';
import TalentReviewEditModal from './components/editModal';
import TalentReviewViewDrawer from './components/viewDrawer';
import TalentReviewSearchBar from './components/searchBar';


@connect(({ talentReviewModel, loading }) => ({
  talentReviewModel,
  loading: loading.models.fetch,
}))
class TalentReviewIndex extends Component {
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

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑后备人才推荐表',
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
      type: 'talentReviewModel/fetch',
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
      type: 'talentReviewModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建后备人才推荐表成功！');
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
      type: 'talentReviewModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改后备人才推荐表成功！');
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
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'talentReviewModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除后备人才推荐表成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除后备人才推荐表失败！');
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

  // eslint-disable-next-line react/sort-comp
  columns = [
    {
      title: '被推荐人姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      ellipsis: true,
      align: 'center',
      width: 100,
      fixed: 'left',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      align: 'center',
      width: 50,
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
      render: text => (text ? moment(text).format('YYYY年MM月DD日') : ''),
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '民族',
      dataIndex: 'national',
      ellipsis: true,
      align: 'center',
      width: 70,
    },
    {
      title: '籍贯',
      dataIndex: 'nativePlace',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '婚姻状况',
      dataIndex: 'maritalStatus',
      ellipsis: true,
      align: 'center',
      width: 90,
    },
    {
      title: '健康状况',
      dataIndex: 'health',
      ellipsis: true,
      align: 'center',
      width: 90,
    },
    {
      title: '政治面貌',
      dataIndex: 'politicalOrientation',
      ellipsis: true,
      align: 'center',
      width: 90,
    },
    {
      title: '参加工作时间',
      dataIndex: 'workTime',
      render: text => (text ? moment(text).format('YYYY年MM月DD日') : ''),
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '所在单位',
      dataIndex: 'orgName',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '工作经历',
      dataIndex: 'workExperience',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '推荐理由',
      dataIndex: 'reason',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '推荐人意见',
      dataIndex: 'recommenderOpinion',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '推荐人',
      dataIndex: 'recommender',
      ellipsis: true,
      align: 'center',
      width: 60,
    },
    {
      title: '推荐时间',
      dataIndex: 'recommendedTime',
      ellipsis: true,
      align: 'center',
      width: 130,
      render(value){
        if (value != null){
          return <span>{moment(value).format("YYYY-MM-DD")}</span>
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      align: 'center',
      width: 80,
      fixed: 'right',
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
      ellipsis: true,
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除后备人才推荐表吗？" onConfirm={() => this.delete([record.id])}>
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
      talentReviewModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };

    return (
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <TalentReviewSearchBar form={form} pagination={paginationProps} onFind={this.findPage} />
            </div>

            <div style={{ marginBottom: '16px' }}>

              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除后备人才推荐表吗？" onConfirm={() => this.delete(selectedRowKeys)}>
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
              bordered
              size="small"
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
              scroll={{x: 1600, y: 690}}
            />
          </div>

          <TalentReviewViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />

          {editData.visible && <TalentReviewEditModal {...editData} />}
        </Card>
    );
  }
}

export default Form.create()(TalentReviewIndex);
