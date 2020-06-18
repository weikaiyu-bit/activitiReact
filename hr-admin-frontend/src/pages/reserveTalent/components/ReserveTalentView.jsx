/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and availabel online at */
import React, { Component } from 'react';
import { Button, Tabs, Row, Col, Form, Descriptions, Upload, Select, Divider, Input, DatePicker, BackTop, Avatar, Timeline } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'dva';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY年MM月DD日';
const { TabPane } = Tabs;
const FormItem = Form.Item;


@connect(({ rtPerformanceModel, loading }) => ({
  rtPerformanceModel,
  loading: loading.models.fetch,
}))
class ReserveTalentView extends Component {
  state = {
    showApplication: false,
    showProject: false,
    tabKey: '1',
  };

  renderPersonInfo = data => {
    const {
      positionLevelData,
      educationalData,
      familyRelationsData,
      rewardsPunishmentsData,
      annualAppraisalNarrativeData,
    } = this.props;

    return (
      <div style={{ width: 1024, margin: '0 auto' }}>
        <Divider orientation="left">基础信息</Divider>
        <Row>
          <Col>
            <Row>
              <Col span={16} >
                <h2><strong>{data.name}</strong></h2>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;男，汉族，1962年12月生，海南人，于1992
                  年10月加入中国共产党，1985年07月参加工作，过东升供销学校计划统计专业毕业。
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现任国家统计局广西调查总队党组纪检组组长。
                </p>
              </Col>
              <Col span={6} >
                <img style={{ marginLeft: 30 }} width="150" height="212" alt="example" src={data.photoUrl} />
              </Col>
            </Row>
            <Row style={{ marginTop: '32px' }}>
              <Col span={12}>
                <span><strong>国家级正职：</strong></span>
                {data.workName}
              </Col>
              <Col span={12}>
                <span><strong>健康状况：</strong></span>
                {data.health}
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col span={12}>
                <span><strong>专业技术职务：</strong></span>
                {data.professionalTitles}
              </Col>
              <Col span={12}>
                <span><strong>熟悉专业有何特长：</strong></span>
                {data.speciality}
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider orientation="left">简历信息</Divider>
        <Row>
          <Col>
            <Timeline>
              <Timeline.Item>
                <div>广东供销学校计划统计专业中专学习</div>
                <div style={{ color: '#999' }}>1983.09--1985.07</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南行政区统计局试用期</div>
                <div style={{ color: '#999' }}>1985.07--1986.07</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南行政区统计局办事员</div>
                <div style={{ color: '#999' }}>1986.07--1988.04</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南省统计局科员</div>
                <div style={{ color: '#999' }}>1990.11--1994.04 （期间：1991.04--1992.07中国人民大学经济管理专业在职大专学习）</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南省统计局办公室副主任科员</div>
                <div style={{ color: '#999' }}>1994.04--1996.07</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南省统计局办公室主任科员</div>
                <div style={{ color: '#999' }}>1996.07--1999.01</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南省企业调查队组织指导处副处长</div>
                <div style={{ color: '#999' }}>1999.01--2003.09</div>
              </Timeline.Item>
              <Timeline.Item>
                <div>海南省企业调查队组织指导处处长</div>
                <div style={{ color: '#999' }}>2003.09--2006.04（期间：2003.08--2005.12 中央党校函授学院国民经济管理专业在职本科学习）</div>
              </Timeline.Item>
            </Timeline>
          </Col>
        </Row>
        <Divider orientation="left">职务信息</Divider>
          国家统计局广西调查总队党组纪检组组长
        <Row>
          <Col span={2}>
            {data.rankTime}
          </Col>
          <Col span={2}>
            {data.positionLevel}
          </Col>
          <Col span={2}>
            {data.rank}
          </Col>
        </Row>
        <Divider orientation="left">学历信息</Divider>
        <Row>
          <Col span={4}>
            <strong>类别：</strong>
            全日制教育
          </Col>
          <Col span={6}>
            <strong>学历/学位：</strong>
            中专
          </Col>
          <Col span={13}>
            <strong>毕业院校及专业：</strong>
            广东省供销学校计划统计专业
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <strong>类别：</strong>
            在职教育
          </Col>
          <Col span={6}>
            <strong>学历/学位：</strong>
            中央党校大学
          </Col>
          <Col span={13}>
            <strong>毕业院校及专业：</strong>
            中央党校函授学院国民经济管理专业
          </Col>
        </Row>
        <Divider orientation="left">考核信息</Divider>
        <Timeline>
          <Timeline.Item>2006.01--2006.12 年度考核称职</Timeline.Item>
          <Timeline.Item>2007.01--2007.12 年度考核称职</Timeline.Item>
          <Timeline.Item>2008.01--2008.12 年度考核称职</Timeline.Item>
          <Timeline.Item>2009.01--2009.12 年度考核称职</Timeline.Item>
          <Timeline.Item>2010.01--2010.12 年度考核称职</Timeline.Item>
          <Timeline.Item>2011.01--2011.12 年度考核称职</Timeline.Item>
          <Timeline.Item>2012.01--2012.12 年度考核称职</Timeline.Item>
        </Timeline>
        <Row>
          <Col>
            {annualAppraisalNarrativeData ? (
              annualAppraisalNarrativeData.map(item =>
                <Row>{item.conclusion}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
        </Row>
        <Divider orientation="left">奖惩信息</Divider>
        <Timeline>
          <Timeline.Item>2006.06--2006.12  省直机关精神文明建设先进工作者</Timeline.Item>
        </Timeline>
        <Row>
          <Col>
            {rewardsPunishmentsData ? (
              rewardsPunishmentsData.map(item =>
                <Row>{item.description}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
        </Row>
        <Divider orientation="left">家庭成员</Divider>
        <Row>
          <Col span={2}>
            <Row>
              <strong>
                姓名
              </strong>
            </Row>
            <Row>潘红连</Row>
            <Row>吴晓婷</Row>
            {familyRelationsData ? (
              familyRelationsData.map(item =>
                <Row>{item.name}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
          <Col span={2}>
            <Row>
              <strong>
                称谓
              </strong>
            </Row>
            <Row>妻子</Row>
            <Row>女儿</Row>
            {familyRelationsData ? (
              familyRelationsData.map(item =>
                <Row>{item.appellation}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
          <Col span={3}>
            <Row>
              <strong>
                出生日期
              </strong>
            </Row>
            <Row>1970.07</Row>
            <Row>1995.07</Row>
            {familyRelationsData ? (
              familyRelationsData.map(item =>
                <Row>{item.birthday}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
          <Col span={3}>
            <Row>
              <strong>
                政治面貌
              </strong>
            </Row>
            <Row>群众</Row>
            <Row>共青团员</Row>
            {familyRelationsData ? (
              familyRelationsData.map(item =>
                <Row>{item.politicalStatus}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
          <Col span={14}>
            <Row>
              <strong>
                工作单位及职务
              </strong>
            </Row>
            <Row>海南省海口市美兰区塔市海鲜第一家服务员</Row>
            <Row>江西省南昌大学中文系大学生</Row>
            {familyRelationsData ? (
              familyRelationsData.map(item =>
                <Row>{item.companyPosition}</Row>,
              )
            ) : (
                <Row></Row>
              )}
          </Col>
        </Row>
        <Row>
        </Row>
      </div>
    );
  };

  renderPerformance = data => {
    // const { title, visible, record } = this.props;
    const { id, categoryId, fileId, name, sex, birth, national,
      nativePlace, workTime, maritalStatus, health, education,
      educationMajor, orgName, positionName, politicalOrientation,
      phone, performanceProfile, leaderEvaluation, reason,
      recommenderOpinion, recommenderId, recommender,
      recommendedTime, resume, photoUrl, remark,
      voteCount, state, creatorId, createTime } = data;
    const { getFieldDecorator } = this.props.form;

    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className={styles.addModal} >
        <Form horizontal="true" onSubmit={this.okHandler} >
          <div className={styles.addModal} style={{ textAlign: 'center' }}>
            <Form horizontal="true" onSubmit={this.okHandler} >
              <table align="center" valign="center" border="true" style={{ width: '100%' }}>
                <tr>
                  <td rowSpan="2">被推荐人姓名</td>
                  <td rowSpan="2" style={{ padding: 0, margin: 0 }} >
                    {name}
                  </td>
                  <td>性别</td>
                  <td>{sex}</td>
                  <td>出生年月</td>
                  <td>{birth}</td>
                  <td rowSpan="3" style={{ padding: 0, margin: 0 }}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                      style={{ width: '100%' }}
                    >
                      {imageUrl ? <Avatar shape="square" size={90} src={imageUrl} /> : uploadButton}
                    </Upload>
                  </td>
                </tr>
                <tr>
                  <td>民族</td>
                  <td>{national}
                  </td>
                  <td>籍贯</td>
                  <td>{nativePlace}</td>
                </tr>
                <tr>
                  <td>婚姻状况</td>
                  <td>{maritalStatus}</td>
                  <td>健康状况</td>
                  <td>{health}</td>
                  <td>政治面貌</td>
                  <td>{politicalOrientation}</td>
                </tr>
                {/* 第三行 */}
                <tr>
                  <td>参加工作时间</td>
                  <td> {workTime}</td>
                  <td>所在单位</td>
                  <td colSpan="2"> {orgName} </td>
                  <td>联系电话</td>
                  <td>{phone}</td>
                </tr>
                <tr>
                  <td>业绩简介</td>
                  <td colSpan="6" style={{ height: '200px' }}>{performanceProfile}</td>
                </tr>
                <tr>
                  <td>推荐人意见</td>
                  <td colSpan="6" style={{ height: '200px' }}>{recommenderOpinion} </td>
                </tr>
                <tr>
                  <td>推荐理由</td>
                  <td colSpan="6" style={{ height: '200px' }}> {reason} </td>
                </tr>
                <tr>
                  <td>领导评价</td>
                  <td colSpan="6" style={{ height: '200px' }}>{leaderEvaluation}</td>
                </tr>
              </table>
            </Form>
          </div>
        </Form>
      </div>
    );
  }

  renderRecommendationForm = data => {
    // const { title, visible, record } = this.props;
    const datas = [];

    const { id, categoryId, fileId, name, sex, birth, national,
      nativePlace, workTime, maritalStatus, health, education,
      educationMajor, orgName, positionName, politicalOrientation,
      phone, performanceProfile, leaderEvaluation, reason,
      recommenderOpinion, recommenderId, recommender,
      recommendedTime, resume, photoUrl, remark,
      voteCount, state, creatorId, createTime } = data;
    const { getFieldDecorator } = this.props.form;

    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className={styles.addModal} >
        <Form horizontal="true" onSubmit={this.okHandler} >
          <div className={styles.addModal} style={{ textAlign: 'center' }}>
            <Form horizontal="true" onSubmit={this.okHandler} >
              <table align="center" valign="center" border="true" style={{ width: '100%' }}>
                <tr>
                  <td rowSpan="2">被推荐人姓名</td>
                  <td rowSpan="2" style={{ padding: 0, margin: 0 }} >
                    {name}
                  </td>
                  <td>性别</td>
                  <td>{sex}</td>
                  <td>出生年月</td>
                  <td>{birth}</td>
                  <td rowSpan="3" style={{ padding: 0, margin: 0 }}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                      style={{ width: '100%' }}
                    >
                      {imageUrl ? <Avatar shape="square" size={90} src={imageUrl} /> : uploadButton}
                    </Upload>
                  </td>
                </tr>
                <tr>
                  <td>民族</td>
                  <td>{national}
                  </td>
                  <td>籍贯</td>
                  <td>{nativePlace}</td>
                </tr>
                <tr>
                  <td>婚姻状况</td>
                  <td>{maritalStatus}</td>
                  <td>健康状况</td>
                  <td>{health}</td>
                  <td>政治面貌</td>
                  <td>{politicalOrientation}</td>
                </tr>
                {/* 第三行 */}
                <tr>
                  <td>参加工作时间</td>
                  <td> {workTime}</td>
                  <td>所在单位</td>
                  <td colSpan="2"> {orgName} </td>
                  <td>联系电话</td>
                  <td>{phone}</td>
                </tr>
                <tr>
                  <td>业绩简介</td>
                  <td colSpan="6" style={{ height: '200px' }}>{performanceProfile}</td>
                </tr>
                <tr>
                  <td>推荐人意见</td>
                  <td colSpan="6" style={{ height: '200px' }}>{recommenderOpinion} </td>
                </tr>
                <tr>
                  <td>推荐理由</td>
                  <td colSpan="6" style={{ height: '200px' }}> {reason} </td>
                </tr>
                <tr>
                  <td>领导评价</td>
                  <td colSpan="6" style={{ height: '200px' }}>{leaderEvaluation}</td>
                </tr>
              </table>
            </Form>
          </div>
        </Form>
      </div>
    );
  }

  // 切换面板发送请求
  onChangeTab = key => {
    const { dispatch } = this.props
    switch (key) {
      case '1':
        console.log("1")
        break;
      case '2':
        break;
      case '3':
        console.log("3")
        break;
      default:
        console.log("1")
    }
  }

  render() {
    const { data } = this.props;
    if (!data) return;

    return (
      <div style={{ margin: '0 auto' }}>
        <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
          <TabPane tab="人员信息" key="1">
            {this.renderPersonInfo(data)}
          </TabPane>
          <TabPane tab="个人业绩展示" key="2">
            {this.renderPerformance(data)}
          </TabPane>
          <TabPane tab="后备人才推荐" key="3">
            {this.renderRecommendationForm(data)}
          </TabPane>
        </Tabs>
      </div >
    );
  }
}

export default Form.create()(ReserveTalentView);
