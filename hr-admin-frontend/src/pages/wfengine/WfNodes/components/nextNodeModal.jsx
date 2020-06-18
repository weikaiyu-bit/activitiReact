import React, { Component } from 'react';
import { Modal, Form, Input,Select,Drawer, Row, Col,Radio,message   } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;


class WfNodesNextnodeModal extends Component {
  state = {
    value:0,
    node:0,
  };

  /************************************************************************************************/

  componentDidMount() {
    
  }
 
  okHandler = () => {
    const {value} =this.state
    const {record,onOk,noderecord} =this.props
    const gj=record.trailJson===null?(''):(record.trailJson)+','+value
    const { dispatch } = this.props;
    dispatch({
      type: 'wfRuntimesModel/update',
      payload:{
          ...record,
          currentNodeId:value,
          trailJson:gj
      },
    });
    const log=this.findlogid(record)
    
    if(value!==0)this.addLog(value,record)
    const filter={
      currentNodeId:noderecord.id,
      status:'运行中',
      flowId:noderecord.flowId
    }
    onOk({...filter})
    this.cancelHandel();
  };
  uplog=(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: `wfRuntimeLogsModel/update`,
      payload:{
        ...record,
        exitUid:'007'
      },
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改实例日志成功！');
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
  }
  findlogid=(record)=>{
    const {noderecord} =this.props
    const { dispatch } = this.props;
    dispatch({
      type: `wfRuntimeLogsModel/find`,
      payload: {
        runId:record.id,
        flowId:record.flowId,
        nodeId:noderecord.id,
        activityNodeName:noderecord.nodeName,
        runtimeName:record.runtimeName,
        catgId:record.catgId
      },
      callback: response => {
        let i=response.data.length-1
        let log= response.data[i]
        if(log!=null && log !=undefined)this.uplog(log)
      }
    });
  }
  addLog=(value,record)=>{
    const {noderecord} =this.props
    const { dispatch } = this.props;
    dispatch({
      type: `wfRuntimeLogsModel/add`,
      payload: {
        runId:record.id,
        flowId:record.flowId,
        nodeId:value,
        activityNodeName:noderecord.nodeName,
        runtimeName:record.runtimeName,
        entryUid:12345,
        catgId:record.catgId
      },
    });
  }
  cancelHandel = () => {
    const { onClose } = this.props;
    
    onClose();
  };

  /************************************************************************************************/
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  fenjie=(record)=>{
      let a=[]
      if(record!==null){
        let b=''
        for(let i=0;i<record.length;i++){
          if(record[i]===','){
              a.push(b)
              b=''
          }else if(i===record.length-1){
                b+=record[i]
                a.push(b)
                b=''
          }else{
            b+=record[i]
          }
        }
      }
      return a
  }
  render() {
    const { title, visible, record,noderecord } = this.props;
    const cc=this.fenjie(noderecord.exitNodeIds)
    console.log(this.props)
    return (
      <>
        <Modal
          title={title}
          width={600}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
        <Row style={ { marginTop: 12 } } >
          <Col span={30}>
            <label>id: </label>
            <label>{record.id}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={30}>
            <label>runtimeName: </label>
            <label>{record.runtimeName}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={30}>
            <label>status: </label>
            <label>{record.status}</label>
          </Col>
        </Row>
        <Row style={ { marginTop: 12 } } >
          <Col span={30}>
          <label>下一个节点: </label><br></br>
          <Radio.Group  onChange={this.onChange} value={this.state.value}>
            {
              cc.map((item,index)=>
              <Radio key={index} value={item}>{item}</Radio>
              )
            }
        </Radio.Group>
          </Col>
        </Row>
        </Modal>
      </>
    );
  }
}

export default WfNodesNextnodeModal
