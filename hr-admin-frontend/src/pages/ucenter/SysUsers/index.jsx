import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Table,
  Card,
  Button,
  Divider,
  Popconfirm,
  Form,
  message,
  // Avatar,
  Tag,
  Row,
  Col,
} from 'antd';

import moment from 'moment';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import SysUsersEditModal from './components/editModal';
import SysUsersViewDrawer from './components/viewDrawer';
import SysUsersSearchBar from './components/searchBar';
import UserRolesModal from './components/userRolesModal';

@connect(({ sysUsersModel, loading }) => ({
  sysUsersModel,
  loading: loading.models.fetch,
}))
class SysUsers extends Component {
  modelName = 'sysUsersModel';

  state = {
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    editData: {
      visible: false,
      record: {},
    },
    showRoles: {
      visible: false,
      placement: 'left',
    },
    userRolesData: {
      visible: false,
    },
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      render: (text, record) => {
        switch (record.status) {
          case 'enabled':
            return <Tag color="cyan">启用</Tag>;
          case 'disabled':
            return <Tag color="magenta">停用</Tag>;
          case 'auditing':
            return <Tag color="orange">审核中</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''), // 格式化时间显示
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditRole(record)}>配置角色</a>
          {record.id > 1 && (
            <>
              <Divider type="vertical" />
              <Popconfirm title="您确认删除该用户吗？" onConfirm={() => this.delete([record.id])}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="您确认重置密码吗？" onConfirm={() => this.resetPwd(record.id)}>
                <a>重置密码</a>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);
    this.findRoles();
  }

  findRoles = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchRoles`,
    });
  };

  /*
   * **********************************************************************************************
   * */

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
        title: record.id > 0 ? '编辑用户' : '新建用户',
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

  handleTableChange = pagination => {
    this.setState({
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /*
   * **********************************************************************************************
   * */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        pageNumber,
        pageSize,
        ...filter,
      },
    });
  };

  add = (_, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS: {
            message.success('新建用户信息成功！');
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

  update = (id, values) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    console.log('values=', values);

    dispatch({
      type: `${this.modelName}/update`,
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS': {
            message.success('修改用户信息成功！');
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

  delete = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS: {
            message.success('删除用户信息成功！');
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          }
          case ErrorCode.FAILURE:
            message.error('删除用户信息失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  resetPwd = id => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/resetPwd`,
      payload: { id },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS: {
            message.success('重置密码成功！');
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

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';
    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        //  routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  onFind = filter => {
    this.setState({ filter }, () => {
      const { pageNumber, pageSize } = this.state;
      this.findPage(pageNumber, pageSize, filter);
    });
  };

  // 保存用户角色
  saveUserRole = (userId, roleIds) => {
    const { dispatch } = this.props;

    const values = {
      id: userId,
      ids: Array.from(new Set(roleIds)), // 去重
    };
    // console.log(values);
    // return;
    dispatch({
      type: `${this.modelName}/saveUserRole`,
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

  showEditRole = record => {
    this.setState({
      userRolesData: {
        title: `配置【${record.realName}（${record.userName}）】角色`,
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.saveUserRole,
        onClose: this.hideEditRole,
      },
    });
  };

  hideEditRole = () => {
    this.setState({
      userRolesData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  getUserRoles = (id, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchRsUserRole`,
      payload: {
        userId: id,
      },
      callback,
    });
  };

  render() {
    const { pageNumber, pageSize, editData, userRolesData } = this.state;
    const {
      loading,
      form,
      sysUsersModel: { data = [], total, roles, selectedRoles },
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
        <Row>
          <Col>
            <Card>
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <SysUsersSearchBar
                    form={form}
                    onFind={this.onFind}
                    pagination={paginationProps}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                    <Button icon="plus" type="primary" onClick={() => this.showEditModal({})}>
                      新建
                    </Button>
                  </span>
                </div>
                <Table
                  rowKey="id"
                  loading={loading}
                  columns={this.columns}
                  dataSource={data}
                  pagination={paginationProps}
                  selectedRoles={selectedRoles}
                  onChange={this.handleTableChange}
                />
              </div>
              <SysUsersViewDrawer
                visible={this.state.viewVisible}
                data={this.state.viewData}
                roles={this.state.showRoles}
                onClose={this.hideDrawer}
              />
              {editData.visible && <SysUsersEditModal {...editData} />}
              {userRolesData.visible && (
                <UserRolesModal
                  {...userRolesData}
                  roles={roles}
                  getUserRoles={this.getUserRoles}
                ></UserRolesModal>
              )}
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SysUsers);
