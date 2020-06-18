/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and availabel online at */
import React, { Component } from 'react';
import { Card, Drawer, Row, Col, Form, Descriptions, Badge, DatePicker, BackTop } from 'antd';
import { LikeOutlined, } from '@ant-design/icons';

import RtPerformanceVoteViewDrawer from './viewDrawer';

const { Meta } = Card;


export default class PerformanceSummaryCard extends Component {
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


  renderCardList = () => {
    const children = [];
    const { dataSource: data } = this.props;

    data.forEach(record => {
      children.push(
        <Card
          key={record.name}
          hoverable
          style={{ width: 400, float: 'left', margin: 12 }}
          onClick={() => this.showDrawer(record)}
          actions={[
            <a><LikeOutlined key="like" text="156" /> {record.voteCount} </a>
          ]}
        >
          <Row style={{ height: 200 }}>
            <Meta
              avatar={<img width="136" height="168" alt="example" src={record.photoUrl} />}
              title={record.name}
              description={record.resume}
            />
          </Row>
          <Row style={{ height: 200 }}>
            <span><strong>推荐理由：</strong></span>
            <p>
              {record.reason}
            </p>
          </Row>
        </Card>,
      )
    });
    return children;
  };

  render() {
    const { dataSource: data } = this.props;
    const { viewData, viewVisible } = this.state;
    const dataSource = {
      data: viewData,
    };

    return (
      <>
        <div className="site-card-wrapper">
          {this.renderCardList()}

          <RtPerformanceVoteViewDrawer
            width="40%"
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
        </div>
      </>
    );
  }
}
