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
import { SmileTwoTone } from '@ant-design/icons';
import StackedHistogram from './StackedHistogram';

const { TabPane } = Tabs;
const { Option } = Select;
class Statistics extends Component {
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
    return (
      <PageHeaderWrapper
        extra={[
          <Select style={{ width: 120 }} placeholder="报告期选择">
            <Option value="2018">2018</Option>
            <Option value="2017">2017</Option>
            <Option value="2016">2016</Option>
          </Select>,
          <Select style={{ width: 120 }} placeholder="数据来源">
            <Option value="年度统计">年度统计</Option>
            <Option value="直统">直统</Option>
          </Select>,
          <Button type="primary">导出报告</Button>,
        ]}
      >
        <Card
          bordered={false}
          style={{ width: '20%', float: 'left', marginRight: '1%', marginBottom: '1%' }}
        >
          <div style={{ height: '50px' }}>
            <Row>
              <Col span={15}>汇总单位公务员总人数</Col>
              <Col span={9}>
                <li
                  style={{
                    height: '50px',
                    width: '25px',
                    backgroundColor: 'blue',
                    color: '#FFFFFF ',
                    fontSize: '35px',
                    textAlign: 'center',
                    float: 'left',
                    marginRight: '5px',
                  }}
                >
                  8
                </li>
                <li
                  style={{
                    height: '50px',
                    width: '25px',
                    backgroundColor: 'blue',
                    color: '#FFFFFF ',
                    fontSize: '35px',
                    textAlign: 'center',
                    float: 'left',
                    marginRight: '0px',
                  }}
                >
                  8
                </li>
              </Col>
            </Row>
          </div>
        </Card>
        <Card bordered={false} style={{ width: '79%', float: 'left', marginBottom: '1%' }}>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
            <Row justify="center">
              <Col span={8} offset={8}>
                <img src={require('./icon/nx.png')} style={{ width: '30px', height: '30px' }}></img>
              </Col>
            </Row>
            <Row>
              女性
              <span style={{ color: '#FF6F4E' }}>38</span>
              人，占
              <span style={{ color: '#FF6F4E' }}>46%</span>
            </Row>
          </div>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
            <Row justify="center">
              <Col span={8} offset={8}>
                <img
                  src={require('./icon/ssmz.png')}
                  style={{ width: '30px', height: '30px' }}
                ></img>
              </Col>
            </Row>
            <Row>
              少数名族
              <span style={{ color: '#6CE44C' }}>38</span>
              人，占
              <span style={{ color: '#6CE44C' }}>46%</span>
            </Row>
          </div>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
            <Row justify="center">
              <Col span={8} offset={8}>
                <img src={require('./icon/ry.png')} style={{ width: '30px', height: '30px' }}></img>
              </Col>
            </Row>
            <Row>
              非工厂党员
              <span style={{ color: '#FEB478' }}>38</span>
              人，占
              <span style={{ color: '#FEB478' }}>46%</span>
            </Row>
          </div>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
            <Row justify="center">
              <Col span={8} offset={8}>
                <img src={require('./icon/bk.png')} style={{ width: '30px', height: '30px' }}></img>
              </Col>
            </Row>
            <Row>
              本科及以上
              <span style={{ color: '#5B86DF' }}>38</span>
              人，占
              <span style={{ color: '#5B86DF' }}>46%</span>
            </Row>
          </div>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
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
              <span style={{ color: '#3EE9E4' }}>38</span>
              人，占
              <span style={{ color: '#3EE9E4' }}>46%</span>
            </Row>
          </div>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
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
              <span style={{ color: '#6B8CFF' }}>38</span>
              人，占
              <span style={{ color: '#6B8CFF' }}>46%</span>
            </Row>
          </div>
          <div style={{ height: '50px', float: 'left', marginRight: '2%' }}>
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
              <span style={{ color: '#FF748A' }}>38</span>
              人，占
              <span style={{ color: '#FF748A' }}>46%</span>
            </Row>
          </div>
        </Card>
        <Card
          bordered={false}
          style={{ width: '40%', float: 'left', marginRight: '1%', marginBottom: '1%' }}
        >
          <h2>国家统计局广西调查总队学历情况</h2>
          <SliderChart />
        </Card>
        <Card bordered={false} style={{ width: '59%', float: 'left', marginBottom: '1%' }}>
          <StackedHistogram />
        </Card>
        <Card bordered={false} style={{ width: '49%', float: 'left', marginRight: '1%' }}>
          <h2>历年公务员人数变化情况(万人)</h2>
          <Chart height={400} data={data4} scale={cols1} forceFit>
            <Axis name="year" />
            <Axis name="value" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="year*value" size={2} />
            <Geom
              type="point"
              position="year*value"
              size={4}
              shape="circle"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        </Card>
        <Card bordered={false} style={{ width: '49%', float: 'left' }}>
          <h2>年龄情况分析</h2>
          <Chart height={400} data={data5} scale={cols2} forceFit>
            <Axis name="year" />
            <Axis
              name="value"
              label={{
                formatter: val => `${(val / 10000).toFixed(1)}k`,
              }}
            />
            <Tooltip
              crosshairs={{
                type: 'line',
              }}
            />
            <Geom type="area" position="year*value" color="#FFD597" />
            <Geom type="line" position="year*value" color="#FFD597" size={2} />
          </Chart>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Statistics);
