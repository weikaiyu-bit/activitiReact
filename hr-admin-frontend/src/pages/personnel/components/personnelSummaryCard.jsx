/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and availabel online at */
import React, { Component } from 'react';
import { Card, Drawer, Row, Col, Form, Descriptions, Badge, DatePicker, BackTop } from 'antd';
import PersonnelFileView from './personnelFileView';
import '@/assets/css/style.css';

const { Meta } = Card;


/**
 * 编辑工作任务
 * @author b__c<br> bc@dtsea.net<br>2020-4-7
 */
export default class PersonnelSummaryCard extends Component {
  state = {
    showApplication: false,
    showProject: false,
    tabKey: '1',
    viewVisible: false,
    viewData: {},
  };

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
  
  onRef = (ref) => {
    this.child = ref
  }

  renderCardList = () => {
    const children = [];
    const { dataSource: data } = this.props;

    data.forEach(record => {
      children.push(
        <Card
          key={record.name}
          hoverable
          className="ellipsis"
          style={{ height: 230, width: 350, float: 'left', margin: 6, overflow: 'auto' }}
          onClick={() => this.showDrawer(record)}
        >
          <Meta
            avatar={<img width="136" height="168" alt="example" src={record.photoUrl} />}
            title={record.name}
            description={record.resume}
          />
        </Card>,
      )
    });
    return children;
  };

  render() {
    // const { dataSource: data } = this.props;
    const { viewData, viewVisible } = this.state;
    const dataSource = {
      record: viewData,
    };

    return (
      <>
        <div className="site-card-wrapper">
          {this.renderCardList()}
          <Drawer width="960px" visible={viewVisible} onClose={this.hideDrawer} title="人事档案">
            <PersonnelFileView {...dataSource}  onRef={this.onRef} />
          </Drawer>
        </div>
      </>
    );
  }
}
