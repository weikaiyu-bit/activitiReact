/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable react/sort-comp */
/* eslint-disable no-case-declarations */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import moment from 'moment';
import ErrorCode from '../../../../dtsea/common/ErrorCode';
import PersonnelSystemArticleAddModal from './components/addModal';
import PersonnelSystemArticleEditModal from './components/editModal';
import PersonnelSystemArticleViewDrawer from './components/viewDrawer';
import PersonnelSystemArticleSearchBar from './components/searchBar';

@connect(({ personnelSystemArticleModel, loading }) => ({
  personnelSystemArticleModel,
  loading: loading.models.fetch,
}))
class PersonnelSystemArticleIndex extends Component {
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
    ViewType: 'normol',
  };

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
  }


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
        title: '新建人事制度文章',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.add,
        onClose: this.hideAddModal,
      },
      ViewType: 'add',
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
      ViewType: 'normol',
    });
  };

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑人事制度文章',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
      ViewType: 'edit',
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
      ViewType: 'normol',
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
      type: 'personnelSystemArticleModel/fetch',
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
      type: 'personnelSystemArticleModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建人事制度文章成功！');
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
      type: 'personnelSystemArticleModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改人事制度文章成功！');
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
      type: 'personnelSystemArticleModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除人事制度文章成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除人事制度文章失败！');
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
      title: '文章制度标题',
      dataIndex: 'articleTitle',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },

    {
      title: '文章制度说明',
      dataIndex: 'articleExplain',
    },
    // {
    //    title: '类型',
    //    dataIndex: 'type',
    // },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'creatorTime',
      render: (text, record) => {
        const time = record.creatorTime ? moment(record.creatorTime)
        .format('YYYY-MM-DD') : record.creatorTime
        return time;
      },
    },
    {
      title: '发布人',
      dataIndex: 'publisherName',
    },
    {
      title: '发布时间',
      dataIndex: 'publisherTime',
      render: (text, record) => {
        const time = record.publisherTime ? moment(record.publisherTime)
        .format('YYYY-MM-DD') : record.publisherTime
        return time;
      },
    },
    {
      title: '撤下人',
      dataIndex: 'withdrawName',
    },
    {
      title: '撤下时间',
      dataIndex: 'withdrawTime',
      render: (text, record) => {
        const time = record.withdrawTime ? moment(record.withdrawTime)
        .format('YYYY-MM-DD') : record.withdrawTime
        return time;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        switch (record.state) {
          // 草稿
          case '草稿':
            return (
              <>
                <a>发布</a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="您确认删除文章内容吗？" onConfirm={() => this.delete([record.id])}>
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          // 已发布
          case '已发布':
            return (
              <>
                <a>撤下</a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="您确认删除文章内容吗？" onConfirm={() => this.delete([record.id])}>
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          // 已撤下
          case '已撤下':
            return (
              <>
                <a>发布</a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="您确认删除文章内容吗？" onConfirm={() => this.delete([record.id])}>
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          default:
            return (
              <>
              </>
            );
        }
      },
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
      personnelSystemArticleModel: { data = [], total },
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
        {this.state.ViewType === 'normol' &&
          <Card bordered={false}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <PersonnelSystemArticleSearchBar form={form} pagination={paginationProps} onFind={this.findPage} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                  <Button icon="plus" type="primary" onClick={this.showAddModal}>
                    新建
                </Button>
                </span>

                {selectedRowKeys.length > 0 ? (
                    <span>
                      <Popconfirm title="您确认需要批量删除人事制度文章吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                        <Button icon="delete" style={{ marginRight: 5, marginLeft: 5 }}>批量删除</Button>
                      </Popconfirm>
                      <Popconfirm title="您确认需要批量删除人事制度文章吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                        <Button icon="plus" >批量发布</Button>
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
                bordered
                pagination={paginationProps}
                rowSelection={rowSelection}
                onChange={this.handleTableChange}
              />
            </div>

            <PersonnelSystemArticleViewDrawer
              visible={this.state.viewVisible}
              data={this.state.viewData}
              onClose={this.hideDrawer}
            />
            {addData.visible && <PersonnelSystemArticleAddModal {...addData} />}
            {editData.visible && <PersonnelSystemArticleEditModal {...editData} />}
          </Card>
        }
        {this.state.ViewType === 'add' &&
          <PersonnelSystemArticleAddModal {...addData} />
        }
        {this.state.ViewType === 'edit' &&
          <PersonnelSystemArticleEditModal {...editData} />
        }
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(PersonnelSystemArticleIndex);
