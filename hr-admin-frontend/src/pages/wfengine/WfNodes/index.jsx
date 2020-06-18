import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Badge } from 'antd';

import ErrorCode from '@/dtsea/common/ErrorCode';
import WfNodesAddModal from './components/addModal';
import WfNodesEditModal from './components/editModal';
import WfNodesViewDrawer from './components/viewDrawer';
import WfNodesSearchBar from './components/searchBar';
import WfNodesManagementModal from './components/managementModal';

// 存储模板名称，插入到表格
const m = new Map()
// 存储徽标
const hb = new Map()
@connect(({ wfNodesModel, wfNodeTemplatesModel, wfRuntimesModel, wfWorkflowsModel, loading }) => ({
  wfNodesModel,
  wfNodeTemplatesModel,
  wfRuntimesModel,
  wfWorkflowsModel,
  loading: loading.models.wfNodesModel,
}))
class WfNodesIndex extends Component {
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
    magData: {
      visible: false,
      record: {},
    },
  };

  columns = [
    {
      title: '流程名字',
      dataIndex: 'flowName',
    },
    {
      title: '节点名称',
      dataIndex: 'nodeName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '关联表单',
      dataIndex: 'pageUrl',
    },
    {
      title: '入口节点',
      dataIndex: 'entryNodeIds',
    },
    {
      title: '出口节点',
      dataIndex: 'exitNodeIds',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Badge count={this.huibiaoshu(record)} dot offset={[5, 0]}>
            <a onClick={() => this.showMagModal(record)}>管理</a>
          </Badge>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除流程节点吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
    this.find(pageNumber, pageSize, filter);
    this.findtmp(filter);
    this.findflow(filter)
  }

  /* ******************************************************* */

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
        title: '新建流程节点',
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
    this.setState({
      editData: {
        title: '编辑流程节点',
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

  showMagModal = record => {
    const { pageNumber, pageSize } = this.state
    this.setState({
      magData: {
        title: '管理流程节点',
        visible: true,
        confirmLoading: false,
        pageNumber,
        pageSize,
        record,
        onOk: this.findPage,
        onClose: this.hideMagModal,
      },
    });
  }

  hideMagModal =() => {
    this.setState({
      magData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  }

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
  //  this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /* ***************************************** */

  findflow=(filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowsModel/findAll',
      payload: {
        ...filter,
      },
    });
  }

  findlog=(filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfRuntimeLogsModel/fetch',
      payload: {
        ...filter,
      },
    });

  }

  setm=(data) => {
    if (data != null && data != undefined) {
      for(let i=0;i<data.length;i++){
          m.set(data[i].id,data[i].templateName)
      }
    }
  }

  findtmp=(filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfNodeTemplatesModel/findAll',
      payload: {
        ...filter,
      },
      callback: response => {
        this.setm(response.data)
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize });
    this.setState({ filter })
    const { dispatch } = this.props;
    dispatch({
      type: 'wfNodesModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };
  // 设置徽标

  sethb=(id, flowId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfRuntimesModel/find',
      payload: {
        currentNodeId: id,
        status: '运行中',
        flowId,
      },
      callback: response => {
        if(response.data===null || response.data===undefined || response.total===0){
          hb.set(id,0)
        }else{
          hb.set(id,response.total)
        }
      }
    });
  }
  find = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfNodesModel/findAll',
      payload: {
        flowId:filter.flowId,
        nodeName:filter.nameNode,
        entryNodeIds:filter.entryNodeIds,
        exitNodeIds:filter.exitNodeIds,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfNodesModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建流程节点成功！');
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
      type: 'wfNodesModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改流程节点成功！');
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
      type: 'wfNodesModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除流程节点成功！');
            this.setState({
              selectedRowKeys: [],
            })
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除流程节点失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  callbackDefault = response => {
    const msg = (response.msg)? response.msg: '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
     //   routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

// 返回徽标数
  huibiaoshu=(record) => {
    if(hb.has(record.id) && hb.get(record.id)!==0)return hb.get(record.id)
    return 0
  }

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData,magData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      wfNodesModel: { data = [], total, alldata },
    } = this.props;
    const tmpdata = this.props.wfNodeTemplatesModel.data
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const ad = {
      alldata,
      tmpdata,
    }
    const fwdata=this.props.wfWorkflowsModel.data
    const flowdata={
      fwdata
    }
    // 将对应模板名称插入表格
    if(data!=null && data!=undefined){
      for(let i=0;i<data.length;i++){
          if( data[i].tempId!=null && data[i].tempId!=undefined &&  m.has(data[i].tempId) ){
            data[i]={...data[i],'templateName':m.get(data[i].tempId)}
          }else{
            data[i]={...data[i],'templateName':''}
          }

      }
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <WfNodesSearchBar form={form}
                                pagination={paginationProps} onFind={this.findPage} {...ad} />
            </div>

            <div style={{ marginBottom: '16px'}}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title={'您确认需要批量删除流程节点吗？'} onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete"  >批量删除</Button>
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
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <WfNodesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <WfNodesAddModal {...addData} {...ad} {...flowdata} />}
          {editData.visible && <WfNodesEditModal {...editData} {...ad}/>}
          {magData.visible && <WfNodesManagementModal {...magData}/>}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(WfNodesIndex);
