/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import { PureComponent } from 'react';
import { Col, Form, Row } from 'antd';
import { Axis, Chart, Coord, Geom, Legend, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
/**
 * 项目统计
 * @author b__c<br> bc@dsea.net<br>2018-12-08 15:20:05
 */
@Form.create()
export default class ProjectChartView extends PureComponent {
  render() {
    const { treeProjectData } = this.props;
    const { children } = treeProjectData[0];
    if (children === null || children === undefined) {
      return <div>暂无任务数据</div>;
    }
    const { DataView } = DataSet;
    if (children === undefined) {
      return <div>当前项目无任务信息</div>;
    }
    const dv = new DataView();
    dv.source(children).transform({
      type: 'percent',
      field: 'childrenCount',
      dimension: 'title',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = `${val * 100}%`;
          return val;
        },
      },
    };
    const { barChartData } = treeProjectData[0];
    const fields = [];
    if (children !== null && children !== undefined) {
      for (let i = 0; i < children.length; i++) {
        const a = children[i];
        fields.push(a.taskName);
      }
    }
    const ds3 = new DataSet();
    const dv3 = ds3.createView().source(barChartData);
    dv3.transform({
      type: 'fold',
      fields: Array.from(fields),
      // fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
      // 展开字段集
      key: '代维管控',
      // key字段
      value: '巡检管理', // value字段
    });

    const data4 = [
      {
        item: '代维管控',
        岑登山: 70,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '巡检管理',
        岑登山: 60,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '资料库',
        岑登山: 50,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '资源查询',
        岑登山: 40,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '铁塔业务结',
        岑登山: 60,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '统计报表',
        岑登山: 70,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '系统管理',
        岑登山: 50,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '交流平台',
        岑登山: 30,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '代维资质审',
        岑登山: 60,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '故障工单管',
        岑登山: 50,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '月份',
        岑登山: 50,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
      {
        item: '月均降雨量',
        岑登山: 50,
        曾满祥: 40,
        顾盛福: 25,
        颜建毅: 12,
        廖添红: 34,
      },
    ];
    console.log('data4', data4);
    const dv4 = new DataView().source(data4);
    dv4.transform({
      type: 'fold',
      fields: ['岑登山', '曾满祥', '顾盛福', '颜建毅', '廖添红'] /*    */,
      // 展开字段集
      key: 'user',
      // key字段
      value: 'score', // value字段
    });
    const cols4 = {
      score: {
        min: 0,
        max: 80,
      },
    };

    const data5 = [
      {
        item: '代维管控',
        岑登山: 270,
        曾满祥: 440,
        顾盛福: 725,
        颜建毅: 412,
        廖添红: 234,
      },
      {
        item: '巡检管理',
        岑登山: 360,
        曾满祥: 240,
        顾盛福: 525,
        颜建毅: 122,
        廖添红: 234,
      },
      {
        item: '资料库',
        岑登山: 450,
        曾满祥: 140,
        顾盛福: 225,
        颜建毅: 312,
        廖添红: 434,
      },
      {
        item: '资源查询',
        岑登山: 340,
        曾满祥: 240,
        顾盛福: 125,
        颜建毅: 512,
        廖添红: 634,
      },
      {
        item: '铁塔业务结',
        岑登山: 160,
        曾满祥: 240,
        顾盛福: 325,
        颜建毅: 412,
        廖添红: 534,
      },
      {
        item: '统计报表',
        岑登山: 670,
        曾满祥: 140,
        顾盛福: 225,
        颜建毅: 312,
        廖添红: 434,
      },
      {
        item: '系统管理',
        岑登山: 550,
        曾满祥: 640,
        顾盛福: 125,
        颜建毅: 212,
        廖添红: 334,
      },
      {
        item: '交流平台',
        岑登山: 430,
        曾满祥: 540,
        顾盛福: 625,
        颜建毅: 112,
        廖添红: 234,
      },
      {
        item: '代维资质审',
        岑登山: 360,
        曾满祥: 440,
        顾盛福: 525,
        颜建毅: 612,
        廖添红: 134,
      },
      {
        item: '故障工单管',
        岑登山: 250,
        曾满祥: 340,
        顾盛福: 425,
        颜建毅: 512,
        廖添红: 634,
      },
      {
        item: '月份',
        岑登山: 150,
        曾满祥: 240,
        顾盛福: 325,
        颜建毅: 412,
        廖添红: 534,
      },
      {
        item: '月均降雨量',
        岑登山: 650,
        曾满祥: 140,
        顾盛福: 225,
        颜建毅: 312,
        廖添红: 434,
      },
    ];
    const dv5 = new DataView().source(data5);
    dv5.transform({
      type: 'fold',
      fields: ['岑登山', '曾满祥', '顾盛福', '颜建毅', '廖添红'] /*    */,
      // 展开字段集
      key: 'user',
      // key字段
      value: 'score', // value字段
    });
    const cols5 = {
      score: {
        min: 0,
        max: 800,
      },
    };

    const data6 = [
      {
        name: '完成数量',
        岑登山: 18.9,
        曾满祥: 28.8,
        顾盛福: 39.3,
        颜建毅: 81.4,
        廖添红: 47,
      },
      {
        name: '任务数量',
        岑登山: 18.9,
        曾满祥: 28.8,
        顾盛福: 39.3,
        颜建毅: 81.4,
        廖添红: 47,
      },
      {
        name: '完成时长',
        岑登山: 18.9,
        曾满祥: 28.8,
        顾盛福: 39.3,
        颜建毅: 81.4,
        廖添红: 47,
      },
      {
        name: '任务时长',
        岑登山: 18.9,
        曾满祥: 28.8,
        顾盛福: 39.3,
        颜建毅: 81.4,
        廖添红: 47,
      },
    ];
    const ds6 = new DataSet();
    const dv6 = ds6.createView().source(data6);
    dv6.transform({
      type: 'fold',
      fields: ['岑登山', '曾满祥', '顾盛福', '颜建毅', '廖添红'],
      // 展开字段集
      key: '月份',
      // key字段
      value: '月均降雨量', // value字段
    });
    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={24}>
            <Chart
              // height={400}
              data={dv}
              scale={cols}
              padding={[20, 10, 10, 10]}
              forceFit
            >
              <Coord type="theta" radius={0.75} />
              <Axis name="percent" />
              <Legend
                position="top"
                // offsetY={-window.innerHeight / 2 + 120}
                // offsetX={-100}
              />
              <Tooltip
                showTitle
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
              />
              <Geom
                type="intervalStack"
                position="percent"
                color="title"
                tooltip={[
                  'title*percent',
                  (title, percent) => {
                    percent = `${percent * 100}%`;
                    return {
                      name: title,
                      value: percent,
                    };
                  },
                ]}
                style={{
                  lineWidth: 2,
                  stroke: '#fff',
                }}
              >
                {/* <Label */}
                {/* content="percent" */}
                {/* offset={-40} */}
                {/* textStyle={{ */}
                {/* rotate: 0, */}
                {/* textAlign: "left", */}
                {/* shadowBlur: 2, */}
                {/* shadowColor: "rgba(0, 0, 0, .45)" */}
                {/* }} */}
                {/* /> */}
              </Geom>
            </Chart>
            <h3 style={{ textAlign: 'center' }}>任务分配比列（数量）</h3>
          </Col>

          {/* <Col span={12}> */}
          {/* <Chart */}
          {/* // height={400} */}
          {/* data={dv2} */}
          {/* scale={cols} */}
          {/* padding={[20, 10, 10, 10]} */}
          {/* forceFit */}
          {/* > */}
          {/* <Coord type="theta" radius={0.75} /> */}
          {/* <Axis name="percent" /> */}
          {/* <Legend */}
          {/* position="top" */}
          {/* // offsetY={-window.innerHeight / 2 + 120} */}
          {/* // offsetX={-100} */}
          {/* /> */}
          {/* <Tooltip */}
          {/* showTitle */}
          {/* itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>" */}
          {/* /> */}
          {/* <Geom */}
          {/* type="intervalStack" */}
          {/* position="percent" */}
          {/* color="item" */}
          {/* tooltip={[ */}
          {/* 'item*percent', */}
          {/* (item, percent) => { */}
          {/* percent = `${percent * 100}%`; */}
          {/* return { */}
          {/* name: item, */}
          {/* value: percent, */}
          {/* }; */}
          {/* }, */}
          {/* ]} */}
          {/* style={{ */}
          {/* lineWidth: 2, */}
          {/* stroke: '#fff', */}
          {/* }} */}
          {/* > */}
          {/* </Geom> */}
          {/* </Chart> */}
          {/* <h3 style={{ textAlign: 'center' }}>任务分配比列（数量）</h3> */}
          {/* </Col> */}
        </Row>

        <Row type="flex" justify="center">
          <Col span={24}>
            <Chart height={400} data={dv3} forceFit>
              <Axis name="代维管控" />
              <Axis name="巡检管理" />
              <Legend
                position="top"
                // offsetY={-window.innerHeight / 2 + 120}
                // offsetX={-100}
              />
              <Tooltip
                crosshairs={{
                  type: 'y',
                }}
              />
              <Geom
                type="interval"
                position="代维管控*巡检管理"
                color="name"
                adjust={[
                  {
                    type: 'dodge',
                    marginRatio: 1 / 32,
                  },
                ]}
              />
            </Chart>
          </Col>
          <h3 style={{ textAlign: 'center' }}>任务情况</h3>
        </Row>

        <Row type="flex" justify="center">
          <Col span={12}>
            <Chart
              // height={window.innerHeight}
              data={dv4}
              padding={[30, 20, 95, 20]}
              scale={cols4}
              forceFit
            >
              <Coord type="polar" radius={0.8} />
              <Axis
                name="item"
                line={null}
                tickLine={null}
                grid={{
                  lineStyle: {
                    lineDash: null,
                  },
                  hideFirstLine: false,
                }}
              />
              <Tooltip />
              <Legend
                position="top"
                // offsetY={-window.innerHeight / 2 + 120}
                // offsetX={-100}
              />
              <Axis
                name="score"
                line={null}
                tickLine={null}
                grid={{
                  type: 'polygon',
                  lineStyle: {
                    lineDash: null,
                  },
                  alternateColor: 'rgba(0, 0, 0, 0.04)',
                }}
              />
              <Legend name="user" marker="circle" offset={30} />
              <Geom type="line" position="item*score" color="user" size={2} />
              <Geom
                type="point"
                position="item*score"
                color="user"
                shape="circle"
                size={4}
                style={{
                  stroke: '#fff',
                  lineWidth: 1,
                  fillOpacity: 1,
                }}
              />
            </Chart>
            <h3 style={{ textAlign: 'center' }}>个人完成任务（数量）</h3>
          </Col>
          <Col span={12}>
            <Chart
              // height={window.innerHeight}
              data={dv5}
              padding={[30, 20, 95, 20]}
              scale={cols5}
              forceFit
            >
              <Coord type="polar" radius={0.8} />
              <Axis
                name="item"
                line={null}
                tickLine={null}
                grid={{
                  lineStyle: {
                    lineDash: null,
                  },
                  hideFirstLine: false,
                }}
              />
              <Tooltip />
              <Legend
                position="top"
                // offsetY={-window.innerHeight / 2 + 120}
                // offsetX={-100}
              />
              <Axis
                name="score"
                line={null}
                tickLine={null}
                grid={{
                  type: 'polygon',
                  lineStyle: {
                    lineDash: null,
                  },
                  alternateColor: 'rgba(0, 0, 0, 0.04)',
                }}
              />
              <Legend name="user" marker="circle" offset={30} />
              <Geom type="line" position="item*score" color="user" size={2} />
              <Geom
                type="point"
                position="item*score"
                color="user"
                shape="circle"
                size={4}
                style={{
                  stroke: '#fff',
                  lineWidth: 1,
                  fillOpacity: 1,
                }}
              />
            </Chart>
            <h3 style={{ textAlign: 'center' }}>个人完成任务（时长）</h3>
          </Col>
        </Row>

        <Row type="flex" justify="center">
          <Col span={24}>
            <Chart height={520} data={dv6} forceFit>
              <Axis name="月份" />
              <Axis name="月均降雨量" />
              <Legend />
              <Tooltip
                crosshairs={{
                  type: 'y',
                }}
              />
              <Legend
                position="top"
                // offsetY={-400}
                // offsetX={-100}
              />
              <Geom
                type="interval"
                position="月份*月均降雨量"
                color="name"
                adjust={[
                  {
                    type: 'dodge',
                    marginRatio: 1 / 32,
                  },
                ]}
              />
            </Chart>
          </Col>
          <h3 style={{ textAlign: 'center' }}>个人完成任务（情况）</h3>
        </Row>
      </div>
    );
  }
}
