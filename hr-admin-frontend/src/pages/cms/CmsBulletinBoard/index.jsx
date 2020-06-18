/* eslint-disable react/no-unused-state */
/* eslint-disable no-empty */
/* eslint-disable no-duplicate-case */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List, Card, Button, Divider, Popconfirm, Form, message, Switch, Tag, Icon } from 'antd';
import ArticleList from '../components/ArticleList';

@connect(({ cmsBulletinBoard, loading }) => ({
  cmsBulletinBoard,
  loading: loading.models.fetch,
}))
class CmsBulletinBoardIndex extends Component {
  modelName = 'cmsBulletinBoard';

  state = {
    expandList: true, // 默认展开栏目列表
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findCategory();
    this.findPage(pageNumber, pageSize, filter);
  }

  /**
   * *********************************************************************************************
   * */

  /** ********************************************************************************************* */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    this.setState({
      filter,
      pageNumber,
    });
    dispatch({
      type: 'cmsBulletinBoard/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findCategory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmsBulletinBoard/category',
    });
  };

  render() {
    const {
      loading,
      cmsBulletinBoard: { data = [] },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <ArticleList dataSource={data} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CmsBulletinBoardIndex);
