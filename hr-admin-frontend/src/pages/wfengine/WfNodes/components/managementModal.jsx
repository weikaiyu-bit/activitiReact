import React, { Component } from 'react';
import { Modal, Form, Input,Select,Table,Drawer,Popconfirm,Divider  } from 'antd';
import { connect } from 'dva';

import WfNodesNextnodeModal from './nextNodeModal';
import RuntimeDrawer from './runtimeDrawer'


@connect(({ wfRuntimesModel,wfWorkflowsModel, loading }) => ({
  wfRuntimesModel,
  wfWorkflowsModel,
  loading: loading.models.fetch,
}))
class WfNodesManagementModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      nextNodeData:{
        visible: false,
        record: {},
      },
      runtimeVisible:false,
      viewData:{},
      endNodeId:0
    };
    
  }
  componentDidMount(){
    let {record} =this.props
    const filter={
      currentNodeId:record.id,
      status:'运行中',
      flowId:record.flowId
    }
    this.findruntime(filter)
    this.findflow(filter)
  }
  findruntime=(filter)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'wfRuntimesModel/find',
      payload: {
        ...filter,
      },
    });
  }
  findflow=(filter)=>{
    console.log(filter)
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowsModel/fetch',
      payload: {
        id:filter.flowId
      },
      callback: response => {
        if(response.total===1){
            this.setState({endNodeId:response.data[0].endNodeId})
        }
      }
    });
  }
  okHandler = () => {
    const {onOk,pageNumber,pageSize} =this.props
    onOk(pageNumber,pageSize,{})
    this.cancelHandel()
  };
  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };
  showDrawer = record => {
    this.setState({
      runtimeVisible: true,
      viewData: record,
    });
  };

  hideDrawer = () => {
    this.setState({
      runtimeVisible: false,
      viewData: {},
    });
  };
  shownextNodeModal=(record)=>{
    const { dispatch } = this.props;
    this.setState({
      nextNodeData: {
        dispatch: dispatch,
        title: '进入下一个节点',
        visible: true,
        confirmLoading: false,
        noderecord:this.props.record,
        record,
        onOk: this.findruntime,
        onClose: this.hidenextNodeModal,
      },
    });
  }
  hidenextNodeModal=()=>{
    this.setState({
      nextNodeData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  }
  Endruntime=(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'wfRuntimesModel/update',
      payload:{
        ...record,
        status:'已停止'
      }
    });
    const filter={
      currentNodeId:record.id,
      status:'运行中',
      flowId:record.flowId
    }
    this.findruntime(filter)
  }
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width:100
    },
    {
      title: '实例名称',
      dataIndex: 'runtimeName',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {record.currentNodeId===this.state.endNodeId?(
            <Popconfirm title={'您确认删除流程节点吗？'} onConfirm={() => this.Endruntime(record)}>
            <a>结束</a>
            </Popconfirm>
          ):(
            <>
            <a onClick={() => this.shownextNodeModal(record)}>进入下一节点</a>
            <Divider type="vertical" />
            <Popconfirm title={'您确认结束工作流程吗？'} onConfirm={() => this.Endruntime(record)}>
            <a>结束</a>
            </Popconfirm>
            </>
          )
        
        }
          
        </>
      ),
    },
  ];
  render() {
    const { title, visible, record } = this.props;
    const {
      wfRuntimesModel: { data = [] },
    } = this.props;
    const {nextNodeData} = this.state
    console.log(this.props)
    return (
      <>
        <Modal
          title={title}
          width={720}
          
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
           <Table
              rowKey="id"
              columns={this.columns}
              dataSource={data}
              pagination={false}
              scroll={{y:300}}
            />
           
        </Modal>
        {this.state.runtimeVisible && <RuntimeDrawer
            visible={this.state.runtimeVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />  }
        {nextNodeData.visible && <WfNodesNextnodeModal {...nextNodeData}/>}
      </>
      
    );
  }
}

export default WfNodesManagementModal;
