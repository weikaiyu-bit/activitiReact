/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { Component } from 'react';
import { List, Avatar, Input, Tag, Icon, Tooltip } from 'antd';
import moment from 'moment';
import { omit } from '@/dtsea/common/utils';

const { Search } = Input;
/**
 * 客服工单列表
 * @author b__c<br> bc@dsea.net<br>2018-12-08 15:20:05
 */
export default class WorkOrderListView extends Component {
  state = {
    itemColor: '',
  };

  tasks = [];

  onClick = item => {
    this.changeColor(item, '#64afff', '');
    if (this.props.onSelected) {
      this.props.onSelected(item);
    }
  };

  handleMouseOver = item => {
  };

  changeColor(currentItem, color, color2) {
    const { tasks } = this;
    for (const i in tasks) {
      const item = tasks[i];
      if (currentItem) {
        if (currentItem.id === item.id) {
          item.isSelected = true;
          item.itemColor = color;
        } else {
          item.isSelected = false;
          item.itemColor = color2;
        }
      } else if (currentItem.id === item.id || item.isSelected) {
        item.itemColor = color;
      } else {
        item.itemColor = color2;
      }
    }
  }

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
    switch (status) {
      case '编辑中':
        color = 'orange';
        break;
      case '计划中':
        color = 'lime';
        break;
      case '进行中':
        color = 'cyan';
        break;
      case '已完成':
        color = 'blue';
        break;
      case '已逾期':
        color = 'magenta';
        break;
      case '暂停':
        color = '#CCCCCC';
        break;
      case '已撤销':
        color = '#666666';
        break;
    }

    return <Tag color={color}>{status}</Tag>;
  };

  renderItem = item => {
    const dateFormat = 'YYYY-MM-DD';
    if (item.isSelected) {
      return (
        <List.Item
          style={{ backgroundColor: item.itemColor }}
          onClick={() => {
            this.onClick(item);
          }}
          onMouseOver={() => {
            this.handleMouseOver(item);
          }}
        >
          <List.Item.Meta
            avatar={
              <a title={item.projectName}>
                <Avatar
                  shape="square"
                  style={{ backgroundColor: item.logoColor, verticalAlign: 'middle' }}
                >
                  {item.projectLogo}
                </Avatar>
              </a>
            }
            title={<span style={{ color: 'white' }}>{omit(item.taskName || '', 13)}</span>}
            description={omit(item.executorName || '', 10)}
          />
          <div style={{ textAlign: 'right' }}>
            {item.planEndDate ? moment(item.planEndDate).format(dateFormat) : ''}
            <br />
            {this.renderStatus(item.taskStatus)}
          </div>
        </List.Item>
      );
    }
    return (
      <List.Item
        style={{ backgroundColor: item.itemColor }}
        onClick={() => {
          this.onClick(item);
        }}
        onMouseOver={() => {
          this.handleMouseOver(item);
        }}
      >
        <List.Item.Meta
          avatar={
            <a title={item.projectName}>
              <Avatar
                shape="square"
                style={{ backgroundColor: item.logoColor, verticalAlign: 'middle' }}
              >
                {item.projectLogo}
              </Avatar>
            </a>
          }
          title={omit(item.taskName || '', 13)}
          description={omit(item.executorName || '', 10)}
        />
        <div style={{ textAlign: 'right' }}>
          {item.planEndDate ? moment(item.planEndDate).format(dateFormat) : ''}
          <br />
          {this.renderStatus(item.taskStatus)}
        </div>
      </List.Item>
    );
  };

  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return false;
    }
    this.tasks = dataSource;

    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="请输入关键字" onChange={this.onChange} />
        <List
          itemLayout="horizontal"
          dataSource={this.tasks}
          renderItem={item => this.renderItem(item)}
        />
      </div>
    );
  }
}
