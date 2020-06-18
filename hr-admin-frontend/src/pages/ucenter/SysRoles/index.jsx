import React, { Component } from 'react';
import { connect } from 'dva';

import { Table, Card, Button, Divider, Popconfirm, Form, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import SysRolesSearchBar from './components/searchBar';
import SysRolesEditModal from './components/editModal';
import SysRolesViewDrawer from './components/viewDrawer';
import RoleRightsModal from './components/roleRightsModal';

@connect(({ sysRolesModel, loading }) => ({
  sysRolesModel,
  loading: loading.models.fetch,
}))
class SysRoles extends Component {
  modelName = 'sysRolesModel';

  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    editData: {
      visible: false,
      record: {},
    },
    userRolesData: {
      visible: false,
    },
  };

  columns = [
    {
      title: '序号',
      key: 'order',
      render: (text, record, index) => index + 1,
    },
    {
      title: '角色名',
      dataIndex: 'roleName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditFunc(record)}>功能权限</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);
    this.findRoleFuncs();
  }

  findRoleFuncs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchFunctions`,
    });
  };

  getRoleFuncs = (id, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchRsRoleFunc`,
      payload: {
        roleId: id,
      },
      callback,
    });
  };

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
    this.setState({
      editData: {
        title: record.id > 0 ? '编辑角色信息' : '新建角色信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: record.id > 0 ? this.update : this.add,
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

  saveRoleFunc = (roleId, funcIds) => {
    const {
      dispatch,
      sysRolesModel: { selectedRoleFuncs = [] },
    } = this.props;
    const ids = [...funcIds];
    // 去重
    const selectedKeys = Array.from(new Set(selectedRoleFuncs));
    // console.log('old', selectedKeys, 'new', funcIds)
    let adds = [];
    let removes = [];
    if (!funcIds || funcIds.length === 0) {
      removes = selectedKeys;
    }
    if (!selectedKeys || selectedKeys.length === 0) {
      adds = funcIds;
    }

    // 新增的
    adds = funcIds.filter(item => selectedKeys.indexOf(item) === -1);

    // 删除的
    removes = selectedKeys.filter(item => funcIds.indexOf(item) === -1);

    if (removes.length === 0 && adds.length === 0) {
      message.success('没有任何需要修改');
      return;
    }
    const values = {
      id: roleId,
      ids,
    };
    // console.log(values);
    // return;
    dispatch({
      type: `${this.modelName}/saveRoleFunc`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改角色权限成功');
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

  showEditFunc = record => {
    // this.getRoleFuncs(record.id);
    this.setState({
      userRolesData: {
        title: `配置【${record.roleName}】功能权限`,
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.saveRoleFunc,
        onClose: this.hideEditFunc,
      },
    });
  };

  hideEditFunc = () => {
    this.setState({
      userRolesData: {
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
    this.setState({
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  onFind = filter => {
    // 保存查询条件
    this.setState({ filter });
    const { pageNumber, pageSize } = this.state;
    this.findPage(pageNumber, pageSize, filter);
  };

  // 添加
  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建角色成功');
            // const { pageNumber, pageSize, filter } = this.state;
            this.findPage(this.state.pageNumber, this.state.pageSize, this.state.filter);
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

  // 修改
  update = (id, values) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    console.log('id=', id);
    console.log('values=', values);
    dispatch({
      type: `${this.modelName}/update`,
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS': {
            message.success('修改成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          }
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

  // 删除
  delete = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS: {
            message.success('删除成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          }
          case ErrorCode.FAILURE:
            message.error('删除失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  render() {
    const { pageNumber, pageSize, selectedRowKeys, editData, userRolesData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      sysRolesModel: { data = [], total, tree },
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
              <SysRolesSearchBar form={form} onFind={this.onFind} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  marginBottom: '16px',
                  marginRight: '8px',
                }}
              >
                <Button icon="plus" type="primary" onClick={() => this.showEditModal({})}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除角色吗？"
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
              columns={this.columns}
              rowSelection={rowSelection} // 注释则不显示勾选
              dataSource={data}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              loading={loading}
              size="middle"
            />
          </div>
          <SysRolesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />

          {editData.visible && <SysRolesEditModal {...editData} />}
          {userRolesData.visible && (
            <RoleRightsModal {...userRolesData} tree={tree} getRoleFuncs={this.getRoleFuncs} />
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SysRoles);
