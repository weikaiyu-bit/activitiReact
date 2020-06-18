/** 版权所有，侵权必纠
 * Copyright(c) 2020 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { Component } from 'react';
import { Card, List, Avatar, Input, Button, Icon, Progress, Tag, message } from 'antd';
import moment from 'moment';
import { omit } from '@/dtsea/common/utils';
import { connect } from 'dva';
import JobTaskAddModal from '../JobTasks/components/addModal';
import ErrorCode from '@/dtsea/common/ErrorCode';

const { Search } = Input;
const today = moment(new Date());
/**
 * 工作任务列表
 * @author b__c<br> bc@dsea.net<br>2020-2-19 11:03:48
 */
@connect(({ myJobsModel, loading }) => ({
  myJobsModel, loading,
}))
export default class TaskKanBanView extends Component {
  state = {
    addData: {
      visible: false,
      record: {},
    },
  };

  onClick = item => {
    const { onSelected } = this.props;
    if (onSelected) {
      onSelected(item);
    }
  };

  onTaskSearch = values => {
    const { onFind } = this.props;
    onFind({
      taskName: values,
      pid: 0,
    });
  };

  callbackDefault = response => {
    const msg = (response.msg) ? response.msg : '发生未知错误！';
    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  renderIcon = askChannel => {
    switch (askChannel) {
      case 'oa':
        return <Icon type="desktop" style={{ fontSize: 18 }} />;
      case 'face2face':
        return <Icon type="team" style={{ fontSize: 18 }} />;
      case 'phone':
        return <Icon type="phone" style={{ fontSize: 18 }} />;
      case 'chat_tools':
        return <Icon type="message" style={{ fontSize: 18 }} />;
      case 'other':
      default:
        return <Icon type="meh" style={{ fontSize: 18 }} />;
    }
  };

  renderStatus = status => {
    let color = '';
    let content = status;
    switch (status) {
      case 'editing':
        color = 'orange';
        content = '编辑中';
        break;
      case 'planning':
        color = 'lime';
        content = '计划中';
        break;
      case 'doing':
        color = 'cyan';
        content = '进行中';
        break;
      case 'completed':
        color = 'blue';
        content = '已完成';
        break;
      case 'delay':
        color = 'magenta';
        content = '已逾期';
        break;
      case 'pause':
        color = '#CCCCCC';
        content = '暂缓';
        break;
      case 'undone':
        color = '#666666';
        content = '已撤销';
        break;
      default:
        break;
    }
    return <Tag color={color}>{content}</Tag>;
  };

  getProgressStatus = taskStatus => {
    if (taskStatus === 'pause' || taskStatus === 'undone' || taskStatus === 'delay') {
      return 'exception';
    } if (taskStatus === 'completed') {
      return 'success';
    }
    return 'normal';
  };

  showAddTaskModal = () => {
    const { myJobsModel: { projectData, membersData }, add } = this.props;
    this.setState({
      addData: {
        title: '新建任务信息',
        visible: true,
        record: {},
        onOk: add,
        onClose: this.hideAddTaskModal,
        projectData,
        jobMembers: membersData,
      },
    });
  };

  hideAddTaskModal = () => {
    this.setState({
      addData: {
        visible: false,
      },
    });
  };

  renderPlanEndDateAndProgress = item => {
    const { taskStatus } = item;
    const { tabKey } = this.props;
    const dateFormat = 'YYYY-MM-DD';
    if (tabKey === '1' || tabKey === '2') {
      return (
        <div style={{ textAlign: 'right', marginRight: '6px', width: 61 }}>
          {this.renderPlanEndDate(item)}
          <br/>
          <Progress
            percent={parseInt(item.progress, 10)}
            size="small"
            status={this.getProgressStatus(taskStatus)}
          />
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'right', marginRight: '6px' }}>
        {item.planEndDate ? moment(item.planEndDate).format(dateFormat) : ''}
        <br />
        {this.renderStatus(item.taskStatus)}
      </div>
    )
  };

  renderPlanEndDate = item => {
    const dateFormat = 'YYYY-MM-DD';
    let planDate = item.planEndDate ? moment(item.planEndDate, dateFormat).fromNow() : '';

    let color = '';
    // 按时间紧迫度设置不同颜色
    if (planDate && item.taskStatus == '进行中') {
      if (planDate.indexOf('前') >= 0) {
        // 逾期
        color = 'magenta';
      } else {
        const differ = moment(item.planEndDate).diff(today, 'day');
        if (differ < 3) {
          // 3天内
          color = 'red';
        } else if (differ < 7) {
          // 7天内
          color = 'orange';
        }
      }
    } else if (planDate && item.taskStatus == '已完成') {
      planDate = '已完成'
    }
    return <label style={{ color }}>{planDate}</label>;
  };

  renderItem = item => {
    if (item.isSelected) {
      return (
        <List.Item
          style={{ backgroundColor: item.itemColor, borderRadius: 4 }}
          onClick={() => {
            this.onClick(item);
          }}
        >
          <List.Item.Meta
            avatar={
              <a title={item.projectName}>
                <Avatar
                  shape="square"
                  style={{ backgroundColor: item.logoColor, verticalAlign: 'middle', marginLeft: '6px' }}
                >
                  {item.projectLogo}
                </Avatar>
              </a>
            }
            title={<span style={{ color: 'white' }}>{omit(item.taskName || '', 13)}</span>}
            description={omit(item.executorName || '', 10)}
          />
          {this.renderPlanEndDateAndProgress(item)}
        </List.Item>
      );
    }
    return (
      <List.Item
        style={{ backgroundColor: item.itemColor }}
        onClick={() => {
          this.onClick(item);
        }}
      >
        <List.Item.Meta
          avatar={
            <a title={item.projectName}>
              <Avatar
                shape="square"
                style={{ backgroundColor: item.logoColor, verticalAlign: 'middle', marginLeft: '6px' }}
              >
                {item.projectLogo}
              </Avatar>
            </a>
          }
          title={omit(item.taskName || '', 13)}
          description={item.executorName}
        />
        {this.renderPlanEndDateAndProgress(item)}
      </List.Item>
    );
  };

  render() {
    const { dataSource, title } = this.props;
    console.log('dataSource', dataSource);
    if (!dataSource) return false;

    return (
      <Card title={title} style={{ marginTop: 12, marginRight: 12 }}>
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={item => this.renderItem(item)}
        />
      </Card>
    );
  }
}
