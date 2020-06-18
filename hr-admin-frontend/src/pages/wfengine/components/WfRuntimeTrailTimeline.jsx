/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at*/
import React, { Component } from 'react';
import { Timeline, Button, Icon } from 'antd';

/**工作流实例轨迹详情
 * @author b__c<br> bc@dsea.net<br>2018-12-05 16:08:45
 */
export default class WfRuntimeTrailTimeline extends Component {
  state = {
    reverse: false,
  }

  handleReverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }


  render() {
    let data = this.props.dataSource;
    console.log('data=', data);
    if (!data) return false;


    let i = data.length;
    const loop = list => list.map((item) => {
      let isLast = (--i == 0);
      if (isLast){
        return (
          <Timeline.Item key={item.trailId} dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }}/>}>
            <div><b>{ item.activityNodeName }</b></div>
            <div><span style={{color:'#999999'}}>{ item.entryTime}</span></div>
            <div><span style={{color:'#999999'}}>{ item.remark}</span></div>
          </Timeline.Item>
        );
      }else{
        return (
          <Timeline.Item key={item.trailId}>
            <div><b>{ item.activityNodeName }</b></div>
            <div><span style={{color:'#999999'}}>{ item.entryTime}</span></div>
            <div><span style={{color:'#999999'}}>{ item.remark}</span></div>
          </Timeline.Item>
        );
      }
    });

    return (
      <div>
        <Button style={{ marginTop: 16 }} onClick={this.handleReverse}>倒转</Button>
        <br/><br/>
        <Timeline reverse={this.state.reverse}>
          { loop(data) }
        </Timeline>
      </div>
    );
  }
}
