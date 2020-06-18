import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Icon } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import SysFunctionsEditModal from './components/editModal';
import SysFunctionsViewDrawer from './components/viewDrawer';
import SysFunctionsSearchBar from './components/searchBar';

@connect(({ sysFunctionsModel, loading }) => ({
  sysFunctionsModel,
  loading: loading.models.fetch,
}))
class SysFunctionsIndex extends Component {
  modelName = 'sysFunctionsModel';

  state = {
    filter: {},
    viewData: {},
    editData: {
      visible: false,
      record: {},
    },
  };

  columns = [
    {
      title: '功能名称',
      dataIndex: 'functionName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      render: text => <Icon type={text}></Icon>,
    },
    {
      title: '功能类型',
      dataIndex: 'functionType',
      render: text => {
        switch (text) {
          case 'API':
            return '按钮/API';
          case 'MENU':
            return '菜单链接';
          case 'DIR':
            return '目录';
          default:
            return '';
        }
      },
    },
    {
      title: '链接',
      dataIndex: 'uri',
    },
    {
      title: '授权标识',
      dataIndex: 'auth',
    },
    {
      title: '显示',
      dataIndex: 'enable',
      render: text => {
        switch (text) {
          case 1:
            return '是';
          case 0:
            return '否';
          default:
            return '';
        }
      },
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
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
          <a onClick={() => this.showAddSubNodeModal(record.id)}>添加子节点</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="删除菜单功能信息" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { filter } = this.state;

    this.findAll(filter);
  }

  showDrawer = record => {
    console.log('record', record);
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

  // 打开添加子节点对话框
  showAddSubNodeModal = pid => {
    this.setState({
      editData: {
        title: pid > 0 ? '新建子节点' : '新建节点',
        visible: true,
        confirmLoading: false,
        pid,
        record: {},
        onOk: this.add,
        onClose: this.hideEditModal,
      },
    });
  };

  // 打开编辑对话框
  showEditModal = record => {
    this.setState({
      editData: {
        title: '编辑节点',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
    });
  };

  // 关闭对话框
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

  findAll = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新增成功');
            this.findAll(this.state.filter);
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
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改成功');
            this.findAll(this.state.filter);
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

  // 删除
  delete = ids => {
    console.log("index--> ids: "+ids);
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS: {
            message.success('删除用户信息成功！');
            const { filter } = this.state;
            this.findAll(filter);
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

  render() {
    const { addData, editData } = this.state;
    const {
      loading,
      form,
      sysFunctionsModel: { tree = [] },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            {/* <div style={{ marginBottom: '16px' }}>
              <SysFunctionsSearchBar form={form} onFind={this.findAll} />
            </div> */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={() => this.showAddSubNodeModal(0)}>
                  新建
                </Button>
              </span>
            </div>

            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={tree}
              pagination={false}
              onChange={this.handleTableChange}
              loading={loading}
              size="middle"
              defaultExpandAllRows
            />
          </div>
          <SysFunctionsViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {editData.visible && <SysFunctionsEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SysFunctionsIndex);
