/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, { Component, PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Radio,
  Card,
  Button,
  Divider,
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
    name: '30岁及以下',
  },
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
    name: '30-40岁',
  },
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
    name: '40-50岁',
  },
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
    name: '50-60岁',
  },
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
    name: '60岁以上',
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
    name: '30岁及以下',
  },
  {
    一级警长: 1,
    二级警长: 2,
    三级警长: 3,
    四级警长: 3,
    一级警员: 5,
    二级警员: 7,
    三级警员: 3,
    试用期: 5,
    name: '30-40岁',
  },
  {
    一级警长: 1,
    二级警长: 2,
    三级警长: 3,
    四级警长: 3,
    一级警员: 5,
    二级警员: 7,
    三级警员: 3,
    试用期: 5,
    name: '40-50岁',
  },
  {
    一级警长: 1,
    二级警长: 2,
    三级警长: 3,
    四级警长: 3,
    一级警员: 5,
    二级警员: 7,
    三级警员: 3,
    试用期: 5,
    name: '50-60岁',
  },
  {
    一级警长: 1,
    二级警长: 2,
    三级警长: 3,
    四级警长: 3,
    一级警员: 5,
    二级警员: 7,
    三级警员: 3,
    试用期: 5,
    name: '60岁以上',
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
const barChartData2 = [
  {
    '首席大法官、检察官': 1,
    '一级大法官、检察官': 2,
    '二级大法官、检察官': 3,
    ' 一级高级法官、 检察官': 3,
    '二级高级法官、检察官': 5,
    '三级高级法官、检察官': 7,
    '四级高级法官、检察官': 3,
    '一级法官、检察官': 5,
    '二级法官、检察官': 8,
    '三级法官、检察官': 10,
    '四级法官、检察官': 5,
    '五级法官、检察官': 8,
    name: '30岁及以下',
  },
  {
    '首席大法官、检察官': 1,
    '一级大法官、检察官': 2,
    '二级大法官、检察官': 3,
    ' 一级高级法官、 检察官': 3,
    '二级高级法官、检察官': 5,
    '三级高级法官、检察官': 7,
    '四级高级法官、检察官': 3,
    '一级法官、检察官': 5,
    '二级法官、检察官': 8,
    '三级法官、检察官': 10,
    '四级法官、检察官': 5,
    '五级法官、检察官': 8,
    name: '30-40岁',
  },
  {
    '首席大法官、检察官': 1,
    '一级大法官、检察官': 2,
    '二级大法官、检察官': 3,
    ' 一级高级法官、 检察官': 3,
    '二级高级法官、检察官': 5,
    '三级高级法官、检察官': 7,
    '四级高级法官、检察官': 3,
    '一级法官、检察官': 5,
    '二级法官、检察官': 8,
    '三级法官、检察官': 10,
    '四级法官、检察官': 5,
    '五级法官、检察官': 8,
    name: '40-50岁',
  },
  {
    '首席大法官、检察官': 1,
    '一级大法官、检察官': 2,
    '二级大法官、检察官': 3,
    ' 一级高级法官、 检察官': 3,
    '二级高级法官、检察官': 5,
    '三级高级法官、检察官': 7,
    '四级高级法官、检察官': 3,
    '一级法官、检察官': 5,
    '二级法官、检察官': 8,
    '三级法官、检察官': 10,
    '四级法官、检察官': 5,
    '五级法官、检察官': 8,
    name: '50-60岁',
  },
  {
    '首席大法官、检察官': 1,
    '一级大法官、检察官': 2,
    '二级大法官、检察官': 3,
    ' 一级高级法官、 检察官': 3,
    '二级高级法官、检察官': 5,
    '三级高级法官、检察官': 7,
    '四级高级法官、检察官': 3,
    '一级法官、检察官': 5,
    '二级法官、检察官': 8,
    '三级法官、检察官': 10,
    '四级法官、检察官': 5,
    '五级法官、检察官': 8,
    name: '60岁以上',
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
    '一级高级法官、',
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
class StackedHistogram extends Component {
  state = {
    clickkey: 1,
  };

  componentDidMount() {}

  /** ********************************************************************************************* */
  renderHistogram = () => {
    const { clickkey } = this.state;
    console.log(clickkey);
    switch (clickkey) {
      case 1:
        return (
          <Chart height={400} data={dv3} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Legend
              position="top"
              type="scroll"
              offsetY={8}
              // offsetY={-window.innerHeight / 2 + 120}
              // offsetX={-100}
            />
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
        );
      case 2:
        return (
          <Chart height={400} data={dv4} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Legend
              position="top"
              type="scroll"
              offsetY={8}
              // offsetY={-window.innerHeight / 2 + 120}
              // offsetX={-100}
            />
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
        );
      case 3:
        return (
          <Chart height={400} data={dv5} forceFit>
            <Axis name="工作台" />
            <Axis name="任务中心" />
            <Legend
              position="top"
              type="scroll"
              offsetY={8}
              // offsetY={-window.innerHeight / 2 + 120}
              // offsetX={-100}
            />
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
        );
    }
  };

  /** ********************************************************************************************* */
  clickLi = key => {
    this.setState({ clickkey: key });
  };

  render() {
    const { clickkey } = this.state;
    console.log('clickkey', clickkey);
    return (
      <>
        <div>
          <Row>
            <Col span={12}>
              <h2>各职务层次年龄占比情况</h2>
            </Col>

            {clickkey === 1 ? (
              <Col span={8} offset={4}>
                <ul style={{ float: 'right' }}>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#FFD597' }} onClick={() => this.clickLi(1)}>
                      综合
                    </a>
                  </li>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#000000' }} onClick={() => this.clickLi(2)}>
                      警察
                    </a>
                  </li>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#000000' }} onClick={() => this.clickLi(3)}>
                      法检
                    </a>
                  </li>
                </ul>
              </Col>
            ) : clickkey === 2 ? (
              <Col span={8} offset={4}>
                <ul style={{ float: 'right' }}>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#000000' }} onClick={() => this.clickLi(1)}>
                      综合
                    </a>
                  </li>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#FFD597' }} onClick={() => this.clickLi(2)}>
                      警察
                    </a>
                  </li>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#000000' }} onClick={() => this.clickLi(3)}>
                      法检
                    </a>
                  </li>
                </ul>
              </Col>
            ) : (
              <Col span={8} offset={4}>
                <ul style={{ float: 'right' }}>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#000000' }} onClick={() => this.clickLi(1)}>
                      综合
                    </a>
                  </li>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#000000' }} onClick={() => this.clickLi(2)}>
                      警察
                    </a>
                  </li>
                  <li style={{ float: 'left', marginRight: '5px' }}>
                    <a style={{ color: '#FFD597' }} onClick={() => this.clickLi(3)}>
                      法检
                    </a>
                  </li>
                </ul>
              </Col>
            )}
          </Row>
        </div>
        <div>{this.renderHistogram()}</div>
      </>
    );
  }
}

export default Form.create()(StackedHistogram);
