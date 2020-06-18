/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Statistic, Icon, Form, Row, Col } from 'antd';
import { UpOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';
import ArticleList2 from '../../cms/components/ArticleList2';
import ArticleFileViewViewDrawer from '../../personnel/personnelSystem/articleFileView/components/viewDrawer';
import HomeHistogram from './homeHistogram';
import './css.css';

@connect(({ cmsBulletinBoard, articleFileViewModel, loading }) => ({
  cmsBulletinBoard,
  articleFileViewModel,
  loading: loading.models.fetch,
}))
class DashboardIndex extends Component {
  modelName = 'cmsBulletinBoard';

  state = {
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    show1: true,
    show2: true,
    show3: true,
    viewVisible: false,
    viewData: {},
    windowHeight: 1024,
    ArticleListHeight: 2706,
    TableHeight: 2706,
    TableHeight2: 2706,
  };

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findCategory();
    this.findPage(pageNumber, pageSize, filter);
    this.findSystemArticlePage(pageNumber, pageSize, filter);
    window.addEventListener('resize', this.handleResize.bind(this)); // 监听窗口大小改变
    this.setState({ windowHeight: window.screen.availHeight });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize = e => {
    this.setState({ windowHeight: e.target.innerHeight });
  };
  /** ********************************************************************************************* */

  showDrawer2 = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
    });
  };

  hideDrawer2 = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  findCategory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmsBulletinBoard/category',
    });
  };

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
      callback: response => {
        console.log('返回', response);
      },
    });
  };

  findSystemArticlePage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    this.setState({
      filter,
      pageNumber,
    });
    dispatch({
      type: 'articleFileViewModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
      callback: response => {
        console.log('返回', response);
      },
    });
  };

  /** ********************************************************************************************* */
  changeShow1 = () => {
    const { show1 } = this.state;
    this.setState({ show1: !show1 });
  };

  changeShow2 = () => {
    const { show2 } = this.state;
    this.setState({ show2: !show2 });
  };

  changeShow3 = () => {
    const { show3 } = this.state;
    this.setState({ show3: !show3 });
  };

  /** ********************************************************************************************* */
  onScroll = e => {
    if (e.target.scrollHeight - e.target.scrollTop === 598) {
      const { Edmund } = this.state;
      if (!Edmund) {
        this.setState(prevState => ({
          pageNumber: prevState.pageNumber + 1,
        }));
        const { pageNumber, pageSize } = this.state;
        this.findPage(pageNumber, pageSize);
      }
    }
  };

  onScroll2 = e => {
    if (e.target.scrollHeight - e.target.scrollTop === 598) {
      const { Edmund } = this.state;
      if (!Edmund) {
        this.setState(prevState => ({
          pageNumber: prevState.pageNumber + 1,
        }));
        const { pageNumber, pageSize } = this.state;
        this.findSystemArticlePage(pageNumber, pageSize);
      }
    }
  };

  handleScrollFrame = () => {
    const tx = {
      scrollHeight: 350,
    };
    return tx;
  };

  render() {
    const { cmsBulletinBoard, articleFileViewModel } = this.props;
    const columns = [
      {
        title: '',
        render: (text, record, index) => `${index + 1}`,
        align: 'center',
      },
      {
        title: '事项',
        dataIndex: 'zt',
      },
      {
        title: '人数',
        dataIndex: 'rq',
      },
      {
        title: '',
        dataIndex: 'operation',
        render: (text, record) => (
          <>
            <a>查看</a>
          </>
        ),
      },
    ];

    const columns1 = [
      {
        title: '',
        render: (text, record, index) => `${index + 1}`,
        align: 'center',
      },
      {
        title: 'articleTitle',
        dataIndex: 'articleTitle',
        render: (text, record) => <a onClick={() => this.showDrawer2(record)}>{text}</a>,
      },
      {
        title: '',
        dataIndex: 'operation',
        render: (text, record) => (
          <>
            <a onClick={() => this.setState({ id: record.id })}>下载</a>
          </>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        zt: '试用期到期人员',
        rq: '33',
      },
      {
        key: '2',
        zt: '已超过退休时间人员',
        rq: '21',
      },
      {
        key: '3',
        zt: '即将过生日人员',
        rq: '37',
      },
      {
        key: '4',
        zt: '待转入人员',
        rq: '0',
      },
      {
        key: '5',
        zt: '待转出人员',
        rq: '0',
      },
      {
        key: '6',
        zt: '退回人员',
        rq: '0',
      },
    ];

    const data1 = [
      {
        key: '1',
        zt: '中华人民共和国公务员法',
      },
      {
        key: '2',
        zt: '《中华人民共和国公务员法》实施方案（中发...',
      },
      {
        key: '3',
        zt: '关于办理担任中央管理职务的公务员登记有关...',
      },
      {
        key: '4',
        zt: '关于事业单位参照公务员法管理工作有关问题...',
      },
      {
        key: '5',
        zt: '公务员考核规定（试行）（中组发〔2007...',
      },
      {
        key: '6',
        zt: '关于做好公务员登记中干部档案相关工作的通...',
      },
    ];
    const list = [
      {
        description: '12112',
        content: 'content',
      },
      {
        description: '12112',
        content: 'content',
      },
      {
        description: '12112',
        content: 'content',
      },
      {
        description: '12112',
        content: 'content',
      },
    ];
    const list1 = [
      {
        description: 'sadadwdawdaw',
      },
      {
        description: 'sadadwdawdaw',
      },
      {
        description: 'sadadwdawdaw',
      },
      {
        description: 'sadadwdawdaw',
      },
    ];
    const { ArticleListHeight, windowHeight, TableHeight, TableHeight2 } = this.state;
    const style = {
      height: ArticleListHeight > windowHeight - 300 ? windowHeight - 300 : ArticleListHeight,
    };
    const style1 = {
      height: TableHeight > windowHeight - 300 ? windowHeight - 300 : TableHeight,
    };
    const style2 = {
      height: TableHeight2 > windowHeight - 300 ? windowHeight - 300 : TableHeight2,
    };

    return (
      // PageHeaderWrapper
      <>
        <Row gutter={24}>
          <Col span={6}>
            <Card bordered={false}>
              <span style={{ display: 'flex', height: '40px' }}>
                <Icon type="user" style={{ fontSize: '48px' }} />
                <Statistic style={{ marginLeft: 32 }} title="总人数" value={567} suffix="人" />
              </span>
            </Card>
          </Col>
          <Col span={18}>
            <Card
              bordered={false}
              style={{ width: '100%', float: 'left', marginBottom: '1%', fontWeight: 'bold' }}
            >
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/nx.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  女性
                  <span style={{ color: '#FF6F4E' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#FF6F4E' }}>46%</span> */}
                </Row>
              </div>
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/ssmz.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  少数民族
                  <span style={{ color: '#6CE44C' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#6CE44C' }}>46%</span> */}
                </Row>
              </div>
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/ry.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  非共产党员
                  <span style={{ color: '#FEB478' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#FEB478' }}>46%</span> */}
                </Row>
              </div>
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/bk.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  本科及以上
                  <span style={{ color: '#5B86DF' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#5B86DF' }}>46%</span> */}
                </Row>
              </div>
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/ry1.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  30岁以下
                  <span style={{ color: '#3EE9E4' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#3EE9E4' }}>46%</span> */}
                </Row>
              </div>
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/ry2.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  35岁以下
                  <span style={{ color: '#6B8CFF' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#6B8CFF' }}>46%</span> */}
                </Row>
              </div>
              <div style={{ height: '40px', float: 'left', marginRight: '2%' }}>
                <Row justify="center">
                  <Col span={8} offset={8}>
                    <img
                      src={require('./icon/nx1.png')}
                      style={{ width: '30px', height: '30px' }}
                    ></img>
                  </Col>
                </Row>
                <Row>
                  处级以上女性
                  <span style={{ color: '#FF748A' }}>38</span>人
                  {/* ，占
              <span style={{ color: '#FF748A' }}>46%</span> */}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginBottom: '1%' }}>
          <Col>
            <Card bordered={false}>
              <div className="HistogramCard">
                <HomeHistogram />
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            {this.state.show1 ? (
              <Card
                bordered={false}
                title="资讯文章"
                extra={[
                  <a onClick={this.changeShow1}>
                    <UpOutlined />
                  </a>,
                  <a style={{ marginLeft: '5px' }}>
                    <CloseOutlined />
                  </a>,
                ]}
              >
                <Scrollbars
                  // style={{ height: 'auto', maxHeight: `${this.state.windowHeight}px` }}
                  style={style}
                  // autoHide="true"
                  onScroll={this.onScroll}
                  onScrollFrame={this.handleScrollFrame}
                >
                  <div id="ArticleList">
                    <ArticleList2 dataSource={cmsBulletinBoard.data} />
                  </div>
                </Scrollbars>
              </Card>
            ) : (
              <Card
                bordered={false}
                title="资讯文章"
                extra={[
                  <a onClick={this.changeShow1}>
                    <DownOutlined />
                  </a>,
                  <a style={{ marginLeft: '5px' }}>
                    <CloseOutlined />
                  </a>,
                ]}
              ></Card>
            )}
          </Col>
          <Col span={8}>
            {this.state.show2 ? (
              <Card
                bordered={false}
                title="事务提醒"
                extra={[
                  <a onClick={this.changeShow2}>
                    <UpOutlined />
                  </a>,
                  <a style={{ marginLeft: '5px' }}>
                    <CloseOutlined />
                  </a>,
                ]}
              >
                <Scrollbars
                  // style={{ height: 'auto', maxHeight: `${this.state.windowHeight}px` }}
                  style={style1}
                  autoHide="true"
                  onScroll={this.onScroll}
                  onScrollFrame={this.handleScrollFrame}
                >
                  <div id="Table1">
                    <Table columns={columns} dataSource={data} pagination={false} />
                  </div>
                </Scrollbars>
              </Card>
            ) : (
              <Card
                bordered={false}
                title="事务提醒"
                extra={[
                  <a onClick={this.changeShow2}>
                    <DownOutlined />
                  </a>,
                  <a style={{ marginLeft: '5px' }}>
                    <CloseOutlined />
                  </a>,
                ]}
              ></Card>
            )}
          </Col>
          <Col span={8}>
            {this.state.show3 ? (
              <Card
                bordered={false}
                title="人事制度文件"
                extra={[
                  <a onClick={this.changeShow3}>
                    <UpOutlined />
                  </a>,
                  <a style={{ marginLeft: '5px' }}>
                    <CloseOutlined />
                  </a>,
                ]}
              >
                <Scrollbars
                  // style={{ height: 'auto', maxHeight: `${this.state.windowHeight}px` }}
                  style={style2}
                  autoHide="true"
                  onScroll={this.onScroll2}
                  onScrollFrame={this.handleScrollFrame}
                >
                  <div id="Table2">
                    <Table
                      columns={columns1}
                      dataSource={articleFileViewModel.data}
                      pagination={false}
                      showHeader={false}
                    />
                  </div>
                </Scrollbars>
              </Card>
            ) : (
              <Card
                bordered={false}
                title="人事制度文件"
                extra={[
                  <a onClick={this.changeShow3}>
                    <DownOutlined />
                  </a>,
                  <a style={{ marginLeft: '5px' }}>
                    <CloseOutlined />
                  </a>,
                ]}
              ></Card>
            )}
          </Col>
        </Row>
      </>
      // PageHeaderWrapper
    );
  }
}

export default Form.create()(DashboardIndex);
