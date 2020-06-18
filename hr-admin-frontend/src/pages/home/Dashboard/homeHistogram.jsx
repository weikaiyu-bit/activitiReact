/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, { Component, PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import antd, {
  Radio,
  Card,
  Button,
  Divider,
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

const statisticalChartImg = require('./icon/统计图.png');
const lineChartImg = require('./icon/折线图.png');

const ToolotipAntd = antd.Tooltip;
const { TabPane } = Tabs;
// 46
const barChartData = [
  {
    省部级正职: 1,
    省部级副职: 2,
    厅局级正职: 3,
    厅局级副职: 3,
    县处级正职: 5,
    县处级副职: 7,
    乡科级正职: 3,
    乡科级副职: 5,
    科员: 2,
    办事员: 6,
    试用期人员: 5,
    其他: 4,
    name: '人数',
  },
];
const ds3 = new DataSet();
const dv3 = ds3.createView().source(barChartData);
dv3.transform({
  type: 'fold',
  fields: [
    '省部级正职',
    '省部级副职',
    '厅局级正职',
    '厅局级副职',
    '县处级正职',
    '县处级副职',
    '乡科级正职',
    '乡科级副职',
    '科员',
    '办事员',
    '试用期人员',
    '其他',
  ],
  // fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
  // 展开字段集
  key: '工作台',
  // key字段
  value: '任务中心', // value字段
});
// 29
const barChartData1 = [
  {
    一级警长: 1,
    二级警长: 2,
    三级警长: 3,
    四级警长: 3,
    一级警员: 5,
    二级警员: 7,
    三级警员: 3,
    试用期: 5,
    name: '人数',
  },
];
const ds4 = new DataSet();
const dv4 = ds4.createView().source(barChartData1);
dv4.transform({
  type: 'fold',
  fields: [
    '一级警长',
    '二级警长',
    '三级警长',
    '四级警长',
    '一级警员',
    '二级警员',
    '三级警员',
    '试用期',
  ],
  // fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
  // 展开字段集
  key: '工作台',
  // key字段
  value: '任务中心', // value字段
});
// 60
const barChartData2 = [
  {
    '首席大法官、检察官': 1,
    '一级大法官、检察官': 2,
    '二级大法官、检察官': 3,
    '一级高级法官、 检察官': 3,
    '二级高级法官、检察官': 5,
    '三级高级法官、检察官': 7,
    '四级高级法官、检察官': 3,
    '一级法官、检察官': 5,
    '二级法官、检察官': 8,
    '三级法官、检察官': 10,
    '四级法官、检察官': 5,
    '五级法官、检察官': 8,
    name: '人数',
  },
];
const ds5 = new DataSet();
const dv5 = ds5.createView().source(barChartData2);
dv5.transform({
  type: 'fold',
  fields: [
    '首席大法官、检察官',
    '一级大法官、检察官',
    '二级大法官、检察官',
    '一级高级法官、 检察官',
    '二级高级法官、检察官',
    '三级高级法官、检察官',
    '四级高级法官、检察官',
    '一级法官、检察官',
    '二级法官、检察官',
    '三级法官、检察官',
    '四级法官、检察官',
    '五级法官、检察官',
  ],
  // fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
  // 展开字段集
  key: '工作台',
  // key字段
  value: '任务中心', // value字段
});
class HomeHistogram extends Component {
  state = {
    clickkey: 1,
    title: '综合',
    number: 46,
    percentage: 34,
    chart: 'Histogram',
  };

  componentDidMount() {}

  changeChartTyle = type => {
    this.setState({ chart: type });
  };

  /** ********************************************************************************************* */
  renderHistogram = () => {
    const { clickkey, chart } = this.state;
    console.log(clickkey);
    switch (clickkey) {
      case 1:
        return chart === 'Histogram' ? (
          <Chart height={300} data={dv3} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom
              type="intervalStack"
              position="工作台*任务中心"
              color="name"
              adjust={[
                {
                  type: 'dodge',
                  marginRatio: 1 / 32,
                },
              ]}
            />
          </Chart>
        ) : (
          <Chart height={300} data={dv3} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="工作台*任务中心" size={2} />
            <Geom
              type="point"
              position="工作台*任务中心"
              size={4}
              shape="circle"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        );
      case 2:
        return chart === 'Histogram' ? (
          <Chart height={300} data={dv4} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom
              type="intervalStack"
              position="工作台*任务中心"
              color="name"
              adjust={[
                {
                  type: 'dodge',
                  marginRatio: 1 / 32,
                },
              ]}
            />
          </Chart>
        ) : (
          <Chart height={300} data={dv4} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="工作台*任务中心" size={2} />
            <Geom
              type="point"
              position="工作台*任务中心"
              size={4}
              shape="circle"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        );
      case 3:
        return chart === 'Histogram' ? (
          <Chart height={300} data={dv5} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom
              type="intervalStack"
              position="工作台*任务中心"
              color="name"
              adjust={[
                {
                  type: 'dodge',
                  marginRatio: 1 / 32,
                },
              ]}
            />
          </Chart>
        ) : (
          <Chart height={300} data={dv5} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="工作台*任务中心" size={2} />
            <Geom
              type="point"
              position="工作台*任务中心"
              size={4}
              shape="circle"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        );
    }
  };

  /** ********************************************************************************************* */
  clickLi = key => {
    this.setState({ clickkey: key });
    if (key === 1) {
      this.setState({ title: '综合', number: 46, percentage: 34 });
    }
    if (key === 2) {
      this.setState({ title: '警察', number: 29, percentage: 21 });
    }
    if (key === 3) {
      this.setState({ title: '法检', number: 60, percentage: 44 });
    }
  };

  render() {
    const { clickkey } = this.state;
    console.log('clickkey', clickkey);

    return (
      <>
        <div>
          <Row>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <h2>{`共135人,${this.state.title}${this.state.number}人,约占比${this.state.percentage}%`}</h2>
                </Col>
              </Row>
            </Col>
            {/* {
              clickkey === 1 ? (
                <Col span={8} offset={4}>
                  <ul style={{ float: 'right' }}>
                    <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#FFD597' }} onClick={() => this.clickLi(1)}>综合</a></li>
                    <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#000000' }} onClick={() => this.clickLi(2)}>警察</a></li>
                    <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#000000' }} onClick={() => this.clickLi(3)}>法检</a></li>
                  </ul>
                </Col>

              ) : (
                  clickkey === 2 ? (
                    <Col span={8} offset={4}>
                      <ul style={{ float: 'right' }}>
                        <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#000000' }} onClick={() => this.clickLi(1)}>综合</a></li>
                        <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#FFD597' }} onClick={() => this.clickLi(2)}>警察</a></li>
                        <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#000000' }} onClick={() => this.clickLi(3)}>法检</a></li>
                      </ul>
                    </Col>
                  ) : (
                      <Col span={8} offset={4}>
                        <ul style={{ float: 'right' }}>
                          <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#000000' }} onClick={() => this.clickLi(1)}>综合</a></li>
                          <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#000000' }} onClick={() => this.clickLi(2)}>警察</a></li>
                          <li style={{ float: 'left', marginRight: '5px' }}><a style={{ color: '#FFD597' }} onClick={() => this.clickLi(3)}>法检</a></li>
                        </ul>
                      </Col>
                    )
                )
            } */}
          </Row>
          <Row>
            <Col span={2} offset={22}>
              <div style={{ float: 'right' }}>
                <ToolotipAntd title="折线图">
                  <img
                    alt=""
                    src={lineChartImg}
                    style={{ width: '20px', height: '20px', float: 'left', marginRight: '10px' }}
                    onClick={() => this.changeChartTyle('line')}
                  ></img>
                </ToolotipAntd>
                <ToolotipAntd title="统计图">
                  <img
                    alt=""
                    src={statisticalChartImg}
                    style={{ width: '20px', height: '20px', float: 'left' }}
                    onClick={() => this.changeChartTyle('Histogram')}
                  ></img>
                </ToolotipAntd>
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ height: '250px' }}>{this.renderHistogram()}</div>
      </>
    );
  }
}

export default Form.create()(HomeHistogram);
