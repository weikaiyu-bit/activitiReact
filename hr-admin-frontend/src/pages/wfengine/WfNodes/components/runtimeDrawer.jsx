import React, { Component } from 'react';
import { Drawer, Row, Col,Timeline, Icon } from 'antd';
import {connect}  from 'dva'
@connect(({ wfRuntimeLogsModel, loading }) => ({
  wfRuntimeLogsModel,
  loading: loading.models.fetch,
}))
class RuntimeDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };
  componentDidMount(){
    let {data} = this.props
    this.findLog(data.id)
  }
  findLog=(id)=>{
    const { dispatch } = this.props;
    dispatch({
      type: `wfRuntimeLogsModel/find`,
      payload: {
        runId:id
      },
    });
  }
  render() {
    console.log(this.props)
    const { data = {}, visible } = this.props;
    const {
      wfRuntimeLogsModel:{alldata}
    }=this.props
    console.log(alldata)
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="查看详情">
      <Row>
        <Col span={12}>
          <Row style={ { marginTop: 12 } } >
            <Col span={12}>
              <label>flow_id: </label>
              <label>{data.flowId}</label>
            </Col>
          </Row>
          <Row style={ { marginTop: 12 } } >
            <Col span={30}>
              <label>实例名称: </label>
              <label>{data.runtimeName}</label>
            </Col>
          </Row>
          <Row style={ { marginTop: 12 } } >
            <Col span={12}>
              <label>当前节点: </label>
              <label>{data.currentNodeId}</label>
            </Col>
          </Row>
          <Row style={ { marginTop: 12 } } >
            <Col span={12}>
              <label>实例状态: </label>
              <label>{data.status}</label>
            </Col>
          </Row>
          <Row style={ { marginTop: 12 } } >
            <Col span={12}>
              <label>更新日期: </label>
              <label>{data.updateTime}</label>
            </Col>
          </Row>
          <Row style={ { marginTop: 12 } } >
            <Col span={12}>
              <label>更新人: </label>
              <label>{data.updatorUid}</label>
            </Col>
          </Row>
          <Row style={ { marginTop: 12 } } >
            <Col span={60}>
            <label>实例轨迹: </label><br></br>
            <Timeline>
            {
              alldata!==undefined?(alldata.map((item)=>
              item.exitTime===null?(
                <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }}/>} color="green" key={item.id}>
                名称:{item.activityNodeName}<br></br>
                进入时间:{item.entryTime}<br></br>
                执行人:{item.runtimeName}
                </Timeline.Item>
              ):(<Timeline.Item  key={item.id}>
                名称:{item.activityNodeName}<br></br>
                进入时间:{item.entryTime}<br></br>
                离开时间:{item.exitTime}<br></br>
                执行人:{item.runtimeName}
              </Timeline.Item>)
              )):(null)
            }
            </Timeline>
            </Col>
          </Row>
        </Col>
      </Row>
    </Drawer>
    )
  }
}

export default RuntimeDrawer
