/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at*/
import { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import { connect } from 'dva';
import MyProfile from "./components/MyProfileView";
import * as utils from '@/dtsea/common/utils';

/**
 * 个人中心
 * @author b__c<br> bc@dtsea.net<br>2019-01-11 02:32:42
 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.fetchCurrent,
}))
export default class MyCenter extends PureComponent {
  state = {
    selectedTab: 'articles',
  };

  onTabChange = key => {
    console.log('key=', key);
    this.setState({ selectedTab: key });
  };

  renderTab = data => {
    switch (this.state.selectedTab) {
      case 'articles':
        return false;
      // const  articles = myProfileFlux.getProps('articles');
      // console.log('articles=', articles);
      // articles.list.map((item) =>{
      //   item.categoryName= '待修改'; //TODO： this.fields.catgId._data[item.catgId];
      // });
      // return <ArticlesListView dataSource={articles} />;
      case 'applications':
        return false;
      case 'projects':
        return false;
      default:
        return false;
    }
  };

  render() {
    // const { currentUser } = this.props;
     const currentUser = utils.getLoginUser();
     if(!currentUser){

       return false;
     }

    const loginUser = {
      areaName: "43673457",
      avatarUrl: "/api/v1/minio/oss/file/4723043592079360",
      mobile: "123456789",
      nickname: "系统管理员",
      realName: "吴坚",
      signature: "",
      status: "ENABLED",
      uid: 1,
      updateTime: "2019-12-23 21:12:06",
      userName: "admin",
    };
    const articles = {};


    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>(0)</span>
          </span>
        ),
      },
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];
    return (
      <Row gutter={24}>
        <Col lg={17} md={24}>
          <Card onTabChange={this.onTabChange} tabList={operationTabList} >
            {this.renderTab(loginUser)}
          </Card>
        </Col>
        <Col lg={7} md={24}>
          <MyProfile dataSource={currentUser} />
        </Col>
      </Row>
    );
  }
}
