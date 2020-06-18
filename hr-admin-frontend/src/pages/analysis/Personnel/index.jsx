/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, { Component, PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Table,
  Card,
  Button,
  Select,
  Popconfirm,
  Form,
  message,
  Avatar,
  Tag,
  Row,
  Col,
  Tabs,
} from 'antd';
import { Axis, Chart, Coord, Geom, Legend, Tooltip, Label } from 'bizcharts';
import DataSet from '@antv/data-set';

const { TabPane } = Tabs;
const { Option } = Select;
class Personnel extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
    },
    clickkey: 1,
  };

  componentDidMount() {}

  /** ********************************************************************************************* */

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

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建应用信息',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  hideAddModal = () => {
    this.setState({
      addData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑应用信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
    });
  };

  hideEditModal = () => {
    this.setState({
      editData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /** ********************************************************************************************* */

  render() {
    const data = [
      { name: '大专学科', value: 1 },
      { name: '大专及以下', value: 1 },
      { name: '研究生', value: 1 },
      { name: '大学本科', value: 1 },
    ];

    class SliderChart extends React.Component {
      render() {
        return (
          <Chart data={data} forceFit height={400}>
            <Coord type="theta" />
            <Tooltip showTitle={false} />
            <Geom type="intervalStack" position="value" color="name">
              <Label content="name" />
            </Geom>
          </Chart>
        );
      }
    }
    const { DataView } = DataSet;

    // const dv = new DataView();
    // dv.source(data1).transform({
    //   type: 'percent',
    //   field: 'count',
    //   dimension: 'title',
    //   as: 'percent',
    // });
    // const cols = {
    //   percent: {
    //     formatter: val => {
    //       val = `${val * 100}%`;
    //       return val;
    //     },
    //   },
    // };

    const data4 = [
      {
        year: '2008年',
        value: 3,
      },
      {
        year: '2009年',
        value: 4,
      },
      {
        year: '2010年',
        value: 3.5,
      },
      {
        year: '2011年',
        value: 5,
      },
      {
        year: '2012年',
        value: 4.9,
      },
      {
        year: '2013年',
        value: 6,
      },
      {
        year: '2014年',
        value: 7,
      },
      {
        year: '2015年',
        value: 9,
      },
      {
        year: '2016年',
        value: 13,
      },
      {
        year: '2017年',
        value: 15,
      },
      {
        year: '2018年',
        value: 18,
      },
    ];
    const cols1 = {
      value: {
        min: 0,
      },
      year: {
        range: [0, 1],
      },
    };

    const data5 = [
      {
        year: '20岁以下',
        value: 10000,
      },
      {
        year: '20-25岁',
        value: 16100,
      },
      {
        year: '20-30岁',
        value: 15900,
      },
      {
        year: '30-35岁',
        value: 17409,
      },
      {
        year: '35-40岁',
        value: 17000,
      },
      {
        year: '40-45岁',
        value: 31056,
      },
      {
        year: '45-50岁',
        value: 31982,
      },
      {
        year: '50-55岁',
        value: 32040,
      },
      {
        year: '55-60岁',
        value: 33233,
      },
      {
        year: '60-65岁',
        value: 33233,
      },
      {
        year: '66岁以上',
        value: 33233,
      },
    ];
    const cols2 = {
      value: {
        min: 10000,
      },
      year: {
        range: [0, 1],
      },
    };
    const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          style={{ width: '40%', float: 'left', marginRight: '1%', marginBottom: '1%' }}
        >
          <div style={{ height: '700px' }}>
            <Row gutter={4}>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/基础信息.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>基础信息库</div>
                </div>
              </Col>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/出入口管理系统.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>入口管理</div>
                </div>
              </Col>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/登记备案服务费.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>登记备案</div>
                </div>
              </Col>
            </Row>
            <Row gutter={4} style={{ marginTop: '5%' }}>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/监督.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>监督惩戒</div>
                </div>
              </Col>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/表彰.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>表彰奖励</div>
                </div>
              </Col>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    {' '}
                    <img
                      src={require('./icon/选拔任用.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>选拔任用</div>
                </div>
              </Col>
            </Row>
            <Row gutter={4} style={{ marginTop: '5%' }}>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/教育.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>教育培训</div>
                </div>
              </Col>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/退出.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>退出管理</div>
                </div>
              </Col>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/政策.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>政策法规</div>
                </div>
              </Col>
            </Row>
            <Row gutter={4} style={{ marginTop: '5%' }}>
              <Col value={100} span={4} offset={2}>
                <div style={{ textAlign: 'center' }}>
                  <a>
                    <img
                      src={require('./icon/技术规范.png')}
                      style={{ width: '100px', height: '100px' }}
                    ></img>
                  </a>
                  <div style={{ marginTop: '5%' }}>指标项解释及技术规范</div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        <Card bordered={false} style={{ width: '59%', float: 'left', marginBottom: '1%' }}>
          <div style={{ height: '450px' }}>
            <a>
              <img
                src={require('./icon/截图.PNG')}
                style={{ height: '450px', width: '100%' }}
              ></img>
            </a>
          </div>
        </Card>
        <Card bordered={false} style={{ width: '14%', float: 'left', marginBottom: '1%' }}>
          <div style={{ height: '187px', verticalAlign: 'center' }}>
            <div style={{ textAlign: 'center', height: '130px' }}>
              <a>
                <img
                  src={require('./icon/年报.png')}
                  style={{ width: '100px', height: '100px' }}
                ></img>
              </a>
              <div>统计年报</div>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          style={{ width: '14%', float: 'left', marginBottom: '1%', marginLeft: '1%' }}
        >
          <div style={{ height: '187px' }}>
            <div style={{ textAlign: 'center', verticalAlign: 'center', height: '130px' }}>
              <a>
                <img
                  src={require('./icon/统计报表.png')}
                  style={{ width: '100px', height: '100px' }}
                ></img>
              </a>
              <div>统计专用信息管理</div>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          style={{ width: '14%', float: 'left', marginBottom: '1%', marginLeft: '1%' }}
        >
          <div style={{ height: '187px' }}>
            <div style={{ textAlign: 'center', verticalAlign: 'center', height: '130px' }}>
              <a>
                <img
                  src={require('./icon/统计报表1.png')}
                  style={{ width: '100px', height: '100px' }}
                ></img>
              </a>
              <div>报表直统</div>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          style={{ width: '14%', float: 'left', marginBottom: '1%', marginLeft: '1%' }}
        >
          <div style={{ height: '187px' }}>
            <div style={{ textAlign: 'center', verticalAlign: 'center', height: '130px' }}>
              <a>
                <img
                  src={require('./icon/统计年报.png')}
                  style={{ width: '100px', height: '100px' }}
                ></img>
              </a>
              <div>历年报表</div>
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Personnel);
