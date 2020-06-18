/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';
import moment from 'moment';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import RtRecommendationFormAddModal from './components/addModal';
import RtRecommendationFormEditModal from './components/editModal';
import RtRecommendationFormViewDrawer from './components/viewDrawer';
import RtRecommendationFormSearchBar from './components/searchBar';
import styles from './css/style.less'


@connect(({ rtRecommendationFormModel, loading }) => ({
  rtRecommendationFormModel,
  loading: loading.models.fetch,
}))
class RtRecommendationFormIndex extends Component {
  modelName = 'rtRecommendationFormModel'
  state = {
    selectedRowKeys: [],
    filter: {
      state: '',
    },
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
    this.findNation({ dataId: 97 });
    this.findPoliticalOrientation({ dataId: 100 });
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
        title: '新建后备人才推荐表',
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
    this.setState({pageNumber, pageSize});
    this.setState( preState =>({
      filter: { ...preState.filter, ...filter },
    }),()=>{
      const { dispatch } = this.props;
      dispatch({
        type: `${this.modelName}/fetch`,
        payload: {
          ...filter,
          pageNumber,
          pageSize,
        },
      });
    })
  };

  // 民族
  findNation = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchNation`,
      payload: {
        ...filter,
      },
    });
  };

  //政治面貌
  findPoliticalOrientation = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchPoliticalOrientation`,
      payload:{
        ...filter,
      },
    });
  }

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    console.log("values",values)
    const filters = {
      ...values,
      politicalOrientation: values.politicalOrientation.label
    }
    dispatch({
      type: `${this.modelName}/add`,
      payload: filters,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建后备人才推荐表成功！');
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
      type: `${this.modelName}/update`,
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改后备人才推荐表成功！');
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

  // 修改状态
  changeStatus = (record, state, msg) => {
    const { pageNumber, pageSize, filter } = this.state;
    const { dispatch, rtRecommendationFormModel: { total } } = this.props;

    const newTotal = total - 1;
    // 计算更改后页数
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize); // 向下取整
    dispatch({
      type: `${this.modelName}/update`,
      payload: {
        ...record,
        state,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (totalPage < pageNumber) {
              this.setState({ pageNumber: totalPage });
              this.findPage(totalPage, pageSize, filter);
            } else {
              this.findPage(pageNumber, pageSize, filter);
            }
            message.success(msg || '操作成功！');
            break;
          case ErrorCode.FAILURE:
            message.success('操作失败！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          default:
            message.error(response.msg);
            this.findPage(pageNumber, pageSize, filter);
            break;
        }
      },
    });
  };

  delete = ids => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除后备人才推荐表成功！');
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

  columns = [
    {
      title: `被推荐人姓名`,
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
      key: 'recommenderOpinion',
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
      render: text => (text ? moment(text).format('YYYY年MM月DD日') : ''),
      ellipsis: true,
      align: 'center',
      width: 130,
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
      width: 130,
      render: (text, record) => (
        <>
          <a onClick={() => this.changeStatus(record, '审核中', '提交成功！')} >提交</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除后备人才推荐表吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
      fixed: 'right',
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
      rtRecommendationFormModel: { data = [], total, nationData, politicalOrientationData },
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
          <div className={styles}>
            <div style={{ marginBottom: '16px' }}>
              <RtRecommendationFormSearchBar form={form} pagination={paginationProps} onFind={this.findPage} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
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
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
              size="small"
              scroll={{ x: 1800, y: 650 }}
            />
          </div>

          <RtRecommendationFormViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <RtRecommendationFormAddModal {...addData} nationData={nationData} politicalOrientationData={politicalOrientationData}/>}
          {editData.visible && <RtRecommendationFormEditModal {...editData} nationData={nationData} politicalOrientationData={politicalOrientationData}/>}
        </Card>
    );
  }
}

export default Form.create()(RtRecommendationFormIndex);
