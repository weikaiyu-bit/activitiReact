/* eslint-disable no-undef */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Switch, Avatar } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import CmsCategoryAddModal from './components/addModal';
import CmsCategoryEditModal from './components/editModal';
import CmsCategoryViewDrawer from './components/viewDrawer';
import CmsCategorySearchBar from './components/searchBar';

@connect(({ cmsCategoryModel, loading }) => ({
  cmsCategoryModel,
  loading: loading.models.fetch,
}))
class CmsCategoryIndex extends Component {
  modelName = 'cmsCategoryModel';

  state = {
    selectedRowKeys: [],
    filter: {},
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
    const { filter } = this.state;

    this.findFilter(filter);
  }
  /* ********************************************************************************************** */

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

  showAddModal = (e, record) => {
    console.log('showAddModalRecord', record);
    this.setState({
      addData: {
        title: record ? '新建子栏目' : '新建网站栏目',
        visible: true,
        confirmLoading: false,
        record,
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
        title: '编辑网站栏目',
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
  /* ********************************************************************************************** */

  findFilter = filter => {
    const { dispatch } = this.props;
    console.log('filter', filter);
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建网站栏目成功!!!');
            this.findFilter(filter);
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
      type: `${this.modelName}/update`,
      payload,
      callback: response => {
        const { filter } = this.state;
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改成功！');
            this.findFilter(filter);
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
    const { filter } = this.state;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除网站栏目成功！');
            this.findFilter(filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除网站栏目失败！');
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

  navigationOnChange = (checked, record) => {
    console.log(checked, record);
    record.isMenu = checked;
    this.update(record.id, record);
  };

  submissionOnChange = (checked, record) => {
    console.log(checked, record);
    record.allowSubmit = checked;
    this.update(record.id, record);
  };

  columns = [
    {
      title: '栏目名称',
      dataIndex: 'categoryName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '优化标题',
      dataIndex: 'seoTitle',
    },
    {
      title: '栏目编码',
      dataIndex: 'categoryCode',
    },
    {
      title: '栏目图片',
      dataIndex: 'picUrl',
      render: (text, record) => {
        if (record.picUrl) return <Avatar shape="square" src={record.picUrl} />;
        return <Avatar shape="square" icon="file-image" />;
      },
    },
    {
      title: '栏目类型',
      dataIndex: 'categoryType',
    },
    {
      title: '所属模型',
      dataIndex: 'modelId',
    },
    {
      title: '导航显示',
      dataIndex: 'isMenu',
      render: (value, record) => {
        if (value === 'true') {
          return (
            <Switch defaultChecked onChange={checked => this.navigationOnChange(checked, record)} />
          );
        }
        return (
          <Switch
            defaultChecked={false}
            onChange={checked => this.navigationOnChange(checked, record)}
          />
        );
      },
    },
    {
      title: '允许投稿',
      dataIndex: 'allowSubmit',
      render: (value, record) => {
        if (value === 'true') {
          return (
            <Switch defaultChecked onChange={checked => this.submissionOnChange(checked, record)} />
          );
        }
        return (
          <Switch
            defaultChecked={false}
            onChange={checked => this.submissionOnChange(checked, record)}
          />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <a onClick={e => this.showAddModal(e, record)}>新增子栏目</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除网站栏目吗？" onConfirm={() => this.delete([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  render = () => {
    const { selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      cmsCategoryModel: { data = [], tree = [] },
    } = this.props;
    console.log('data', data);
    console.log('tree', tree);
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <CmsCategorySearchBar form={form} onFind={this.findFilter} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建根栏目
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除网站栏目吗？"
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
              dataSource={tree}
              rowSelection={rowSelection}
              pagination={false}
            />
          </div>

          <CmsCategoryViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <CmsCategoryAddModal {...addData} />}
          {editData.visible && <CmsCategoryEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  };
}

export default Form.create()(CmsCategoryIndex);
