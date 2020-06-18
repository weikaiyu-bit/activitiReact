/* eslint-disable react/no-unused-state */
/* eslint-disable no-empty */
/* eslint-disable no-duplicate-case */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Switch, Tag, Icon } from 'antd';

import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import CmsInformationAddModal from './components/addModal';
import CmsInformationEditModal from './components/editModal';
import CmsInformationViewDrawer from './components/viewDrawer';
import CmsInformationSearchBar from './components/searchBar';
import CategoryTreeView from './components/CategoryTreeView';
import ArticleView from './components/ArticleView';
import CmsInformationViewInformation from './components/viewInformation';

@connect(({ cmsInformationModel, loading }) => ({
  cmsInformationModel,
  loading: loading.models.fetch,
}))
class CmsInformationIndex extends Component {
  modelName = 'cmsInformationModel';

  state = {
    expandList: true, // 默认展开栏目列表
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
    viewInformationData: {
      visible: false,
      record: {},
    },
    selectedKeys: [],

    textDetail: false,
  };

  myRef = React.createRef();

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findCategory();
    this.findPage(pageNumber, pageSize, filter);
  }

  /**
   * *********************************************************************************************
   * */

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
      // textDetail: true,
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
        windowTitle: '新建文章内容',
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
        windowTitle: '编辑文章内容',
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

  showInformationModal = record => {
    this.setState({
      viewInformationData: {
        windowTitle: '查看文章信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.hideInformationModal,
        onClose: this.hideInformationModal,
      },
    });
  };

  hideInformationModal = () => {
    this.setState({
      viewInformationData: {
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
    this.setState({
      filter,
      pageNumber,
    });
    dispatch({
      type: 'cmsInformationModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findCategory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmsInformationModel/category',
    });
  };

  add = (id, values, msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmsInformationModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success(msg || '新建文章内容成功！');
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

  update = (id, values, msg) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    console.log('update', values);
    dispatch({
      type: 'cmsInformationModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success(msg || '修改文章内容成功！');
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

  // 修改文章状态
  changeContentStatus = (record, contentStatus, msg) => {
    const { pageNumber, pageSize, filter } = this.state;
    const {
      dispatch,
      cmsInformationModel: { total },
    } = this.props;

    const newTotal = total - 1;
    // 计算更改后页数
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize); // 向下取整
    dispatch({
      type: `${this.modelName}/update`,
      payload: {
        ...record,
        contentStatus,
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
    const {
      dispatch,
      cmsInformationModel: { total },
    } = this.props;
    console.log('ids', ids);
    const { pageNumber, pageSize, filter } = this.state;

    const newTotal = total - ids.length;
    // 计算删除后页数
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize);
    dispatch({
      type: 'cmsInformationModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (totalPage < pageNumber) {
              this.setState({ pageNumber: totalPage });
              this.findPage(totalPage, pageSize, filter);
            } else {
              this.findPage(pageNumber, pageSize, filter);
            }
            message.success('删除文章内容成功！');
            break;
          case ErrorCode.FAILURE:
            message.error('删除文章内容失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
    // 删除后将id缓存数组清空，防止下次删除传入过期id
    this.setState({
      selectedRowKeys: [],
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

  setSelectedKeys = selectedKeys => {
    this.setState({ selectedKeys });
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '来源',
      dataIndex: 'source',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
  ];

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList, selectedKeys } = this.state;
    this.setState(
      {
        expandList: !expandList,
      },
      () => {
        if (this.state.expandList) {
          this.myRef.current.setSelectKey(selectedKeys);
        }
      },
    );
  };

  renderSimpleList() {
    const {
      pageNumber,
      pageSize,
      selectedRowKeys,
      addData,
      editData,
      viewData,
      viewInformationData,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      cmsInformationModel: { data = [], total, categoryData = [] },
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
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              <RightOutlined />
            </a>
            <div style={{ marginBottom: '16px' }}>
              <CmsInformationSearchBar
                form={form}
                pagination={paginationProps}
                categoryData={categoryData}
                onFind={this.findPage}
              />
            </div>

            {/* <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>

              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除文章内容吗？"
                    onConfirm={() => this.delete(selectedRowKeys)}
                  >
                    <Button icon="delete">批量删除</Button>
                  </Popconfirm>
                </span>
              ) : (
                  ''
                )}
            </div> */}

            <Table
              rowKey="id"
              loading={loading}
              columns={this.columns}
              dataSource={data}
              bordered
              pagination={paginationProps}
              // rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>
          <CmsInformationViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            bordered
            categoryData={categoryData}
            onClose={this.hideDrawer}
          />

          {addData.visible && <CmsInformationAddModal {...addData} categoryData={categoryData} />}
          {editData.visible && (
            <CmsInformationEditModal {...editData} categoryData={categoryData} />
          )}
          {viewInformationData.visible && (
            <CmsInformationViewInformation {...viewInformationData} categoryData={categoryData} />
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderAdvancedList() {
    const {
      pageNumber,
      pageSize,
      selectedRowKeys,
      addData,
      editData,
      filter,
      viewInformationData,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      cmsInformationModel: { data = [], total, tree, categoryData = [] },
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
        <Card style={{ width: '23%', float: 'left', marginRight: '1%' }}>
          <CategoryTreeView
            tree={tree}
            data={categoryData}
            onFind={this.findPage}
            pageSize={pageSize}
            filter={filter}
            ref={this.myRef}
            setSelectedKeys={this.setSelectedKeys}
          />
        </Card>
        <Card style={{ width: '76%', float: 'left' }}>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <LeftOutlined />
          </a>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <CmsInformationSearchBar
                form={form}
                pagination={paginationProps}
                categoryData={categoryData}
                tree={tree}
                onFind={this.findPage}
                filter={filter}
              />
            </div>
            <Table
              rowKey="id"
              loading={loading}
              columns={this.columns}
              bordered
              dataSource={data}
              pagination={paginationProps}
              // rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <CmsInformationViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            categoryData={categoryData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <CmsInformationAddModal {...addData} categoryData={categoryData} />}
          {editData.visible && (
            <CmsInformationEditModal {...editData} categoryData={categoryData} />
          )}
          {viewInformationData.visible && (
            <CmsInformationViewInformation {...viewInformationData} categoryData={categoryData} />
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }

  render() {
    return this.state.expandList ? this.renderAdvancedList() : this.renderSimpleList();
  }
}

export default Form.create()(CmsInformationIndex);
