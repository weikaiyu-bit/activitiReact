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
export default class ProjectTimelineView extends Component {
  componentDidMount() {
    const { jobTasksModel, onFindProjectRecord, projectId } = this.props.dataSource;
    const { allTaskData } = jobTasksModel;
    this.setjobTasks(allTaskData);
    // onFindProjectRecord({ id: projectId })
  }

  // 存储任务数据
  setjobTasks = data => {
    if (data !== undefined && data !== null) {
      for (let i = 0; i < data.length; i++) {
        jobTasks.set(data[i].id, data[i]);
      }
    }
  };

  // 获取时间差
  diffTime = e => {
    const date = new Date();
    const newdate = moment(date, 'YYYY-MM-DD HH:mm:ss');
    const olddate = moment(e.operateTime, 'YYYY-MM-DD HH:mm:ss');
    const minue = parseInt(newdate.diff(olddate) / 60000);
    const hour = parseInt(minue / 60);
    const day = parseInt(hour / 24);
    if (day > 365) return '1年前';
    if (day < 1 && hour > 0) return `${hour}小时前`;
    if (day < 1 && hour < 1) return `${minue}分钟前`;
    return `${day}天前`;
  };

  taskName = item => {
    const data = { ...jobTasks.get(item.taskId) };
    return data.taskName;
  };

  childrenTaskName = item => {
    const id = parseInt(item.description);
    const data = { ...jobTasks.get(id) };
    return data.taskName;
  };

  renderTestDynamic = item => (
    <Timeline.Item key={item.id}>
      <span>{item.operateTime}</span>
      <div dangerouslySetInnerHTML={{ __html: `${item.description}` }}></div>
      {this.diffTime(item)}
    </Timeline.Item>
  );

  render() {
    const { dataSource } = this.props;
    if (!dataSource.projectId) return false;
    const { jobTasksModel, jobProjectsModel } = this.props.dataSource;
    const { listProjectLog } = jobProjectsModel;
    const { allTaskData } = jobTasksModel;
    this.setjobTasks(allTaskData);
    //
    // return <div>{this.renderTimeline(dataSource)}</div>;

    return (
      <Timeline style={{ marginTop: 24 }}>
        {listProjectLog !== null && listProjectLog !== undefined
          ? listProjectLog.map(item => this.renderTestDynamic(item))
          : null}
      </Timeline>
    );
  }
}
