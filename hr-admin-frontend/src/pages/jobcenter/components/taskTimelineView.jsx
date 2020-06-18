/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { Component, PureComponent } from 'react';
import { Timeline, Icon } from 'antd';
import moment from 'moment';

/**
 * 事迹记录详情
 * @author b__c<br> bc@dtsea.net<br>2019-01-14 23:34:34
 * @router @msgDoSomethingLogFlux.goRoute('add',param) or @/admin/msg/msgDoSomethingLog/detail
 */
const jobTasks = new Map();
export default class TaskTimelineView extends Component {
  formatString = log => {
    let sthType = '';
    switch (log.sthTable) {
      case 'job_task':
        sthType = '任务';
        break;
      case 'cs_work_order':
        sthType = '客服工单';
        break;
    }

    if (log.what) {
      const html = (
        <span>
          <a src={log.sbUrl}>{log.someBody}</a> 对 <a src={log.sthUrl}>{log.someThing}</a> {log.did}
          了{sthType} {log.what}
        </span>
      );
      return html;
    }
    const html = (
      <span>
        <a src={log.sbUrl}>{log.someBody}</a> {log.did}了{sthType}{' '}
        <a src={log.sthUrl}>《{log.someThing}》</a>
      </span>
    );
    return html;
  };

  componentDidMount() {
    const { jobTasksModel } = this.props.dataSource;
    const { allTaskData } = jobTasksModel;
    this.setjobTasks(allTaskData);
  }

  // 存储任务数据
  setjobTasks=data => {
      if (data !== undefined && data !== null) {
        for (let i = 0; i < data.length; i++) {
          jobTasks.set(data[i].id, data[i])
        }
      }
  };

  // renderTimeline = logs => {
  //   if (!logs) return false;
  //
  //   // const dateFormat = 'YYYY-MM-DD hh:mm';
  //
  //   let i = logs.list.length;
  //   const loop = list =>
  //     list.map(item => {
  //       const optTime = item.createTime ? moment(item.createTime).fromNow() : '';
  //       // 格式化工单记录
  //       const text = this.formatString(item);
  //
  //       const isLast = --i == 0;
  //       if (isLast) {
  //         return (
  //           <Timeline.Item
  //             key={item.id}
  //             dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
  //           >
  //             <div style={{ color: '#999999' }}>{text}</div>
  //             <div style={{ color: '#999999' }}>{optTime}</div>
  //           </Timeline.Item>
  //         );
  //       }
  //       return (
  //         <Timeline.Item key={item.id}>
  //           <div>
  //             <b>{item.title}</b>
  //           </div>
  //           <div>
  //             <div style={{ color: '#999999' }}>{text}</div>
  //             <div style={{ color: '#999999' }}>{optTime}</div>
  //           </div>
  //         </Timeline.Item>
  //       );
  //     });
  //   return <Timeline>{loop(logs.list)}</Timeline>;
  // };

  // 筛选日志
  findtaskLog=() => {
    const { taskId, onFindRecord } = this.props.dataSource;
    onFindRecord({ taskId })
    // const { taskId, onFindRecord } = this.props.dataSource
    // const response = []
    // if (data === undefined || data === null) return []
    // for (let i = 0; i < data.length; i++) {
    //   if (data[i].taskId === taskId)response.push(data[i])
    // }
    // return response
  }

  // 获取时间差
  diffTime=e => {
    const date = new Date();
    const newdate = moment(date, 'YYYY-MM-DD HH:mm:ss');
    const olddate = moment(e.operateTime, 'YYYY-MM-DD HH:mm:ss');
    const minue = parseInt(newdate.diff(olddate) / 60000);
    const hour = parseInt(minue / 60);
    const day = parseInt(hour / 24);
    if (day > 365) return '1年前';
    if (day < 1 && hour > 0) return `${hour}小时前`;
    if (day < 1 && hour < 1) return `${minue}分钟前`;
    return `${day}天前`
  }

  taskName=item => {
    const data = { ...jobTasks.get(item.taskId) };
    return data.taskName
  }

  childrenTaskName=item => {
    const id = parseInt(item.description);
    const data = { ...jobTasks.get(id) };
    return data.taskName
  }

  renderDynamic=item => {
    // <a>{`${item.operatorName}`}</a>{`  ${item.description}`}<br />{ this.diffTime(item)}
    const { operatCode } = item;
    const taskName = this.taskName(item);
    switch (operatCode) {
      case 'addJob':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 新增了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'updateJob':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 修改了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'deleteJob':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 删除了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'addChildrenJob':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 新增了子任务 '}<a>{this.childrenTaskName(item)}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'upChildrenJob':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 修改了子任务 '}<a>{this.childrenTaskName(item)}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'deChildrenJob':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 删除了子任务 '}<a>{this.childrenTaskName(item)}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'addJobMember':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 新增了任务成员 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'updateJobMember':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 修改了任务成员 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'deleteJobMember':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 删除了任务成员 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'transfer':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 转派 '}<a>{taskName}</a>{' 给 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'refuse':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 驳回了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'stop':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 暂缓了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'finish':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 完成了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'remind':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 提醒了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'submitAnnex':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 在 '}<a>{taskName}</a>{' 提交了附件 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'comment':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 评论了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'query':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 查询了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'accept':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 受理了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'start':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 开始了任务 '}<a>{taskName}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'deleteAnnex':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 在 '}<a>{taskName}</a>{' 删除了附件 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      case 'reply':
        return (
          <Timeline.Item key={item.id}>
            <a>{`${item.operatorName}`}</a>{' 回复了 '}<a>{item.description}</a><br/>
            {this.diffTime(item)}
          </Timeline.Item>
        )
      default:
        break;
    }
  }

  renderTestDynamic=item => (
    <Timeline.Item key={item.id}>
      <span>{item.operateTime}</span>
      <div dangerouslySetInnerHTML={{ __html: `${item.description}` }}></div>
      {this.diffTime(item)}
    </Timeline.Item>
    );

  render() {
    const { dataSource } = this.props;
    console.log('动态', this.props);
    const { taskLog } = dataSource;
    //
    // return <div>{this.renderTimeline(dataSource)}</div>;

    return (
      <Timeline style={{ marginTop: 24 }}>
        {
          (taskLog !== null && taskLog !== undefined) ? (
            taskLog.map(item =>
              this.renderTestDynamic(item),
            )
          ) : (
            null
          )
        }

      </Timeline>
    );
  }
}
