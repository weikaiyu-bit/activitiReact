/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and availabel online at */
import React, { Component } from 'react';
import { Button, Tabs, Row, Col, Form, Descriptions, Divider, Table, DatePicker, BackTop, Tag, Avatar, Timeline, Icon } from 'antd';
import '../PPersonnelFiles/css/style.css';
import { connect } from 'dva';
import moment from "moment"
import TimeStyle from './css/timeline.less'
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const FormItem = Form.Item;
/**
 * 编辑工作任务
 * @author b__c<br> bc@dtsea.net<br>2020-4-7
 */

@connect((
  {
    pfileWorkRecordModel,
    pfileFamilyRelationsModel,
    pfileAnnualAppraisalNarrativeModel,
    pfileRewardsPunishmentsModel,
    pfileEducationalModel,
    loading
  }) => ({
    pfileWorkRecordModel,
    pfileFamilyRelationsModel,
    pfileAnnualAppraisalNarrativeModel,
    pfileRewardsPunishmentsModel,
    pfileEducationalModel,
    loading,
  }))
export default class PersonnelFileView extends Component {
  state = {
    dateFormat: 'YYYY年MM月DD日',
    showApplication: false,
    showProject: false,
    tabKey: '1',
    pageNumber: 1,
    pageSize: 20,
    filter: {},
    fullTime: [],//全日制
    onTheJob: [],//在职
    rewardsData: [],
  };

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    const { record } = this.props;
    this.props.onRef(this)
  }

  findPageFamliy = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileFamilyRelationsModel/fetch',
      payload: {
        pageNumber,
        pageSize,
        ...filter
      }
    })
  }
  // 考核信息
  appraisal = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileAnnualAppraisalNarrativeModel/fetch',
      payload: {
        pageNumber,
        pageSize,
        ...filter
      }
    })
  }

  findPageRecord = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/fetch',
      payload: {
        pageNumber,
        pageSize,
        ...filter
      }
    })
  }

  // 查询学历学位
  findEducational = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    if (filter.educationCategory == '全日制') {
      dispatch({
        type: 'pfileEducationalModel/fetch',
        payload: {
          pageNumber,
          pageSize,
          ...filter
        },
        callback: response => {
          this.setState({
            fullTime: response.data
          })
        }

      })
    } else if (filter.educationCategory == '在职') {
      dispatch({
        type: 'pfileEducationalModel/fetch',
        payload: {
          pageNumber,
          pageSize,
          ...filter
        },
        callback: response => {
          this.setState({
            onTheJob: response.data
          })
        }
      })
    } else {
      dispatch({
        type: 'pfileEducationalModel/fetch',
        payload: {
          pageNumber,
          pageSize,
          ...filter
        },
      })
    }
  };

  // 查询奖惩信息
  rewards = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileRewardsPunishmentsModel/fetch',
      payload: {
        pageNumber,
        pageSize,
        ...filter
      },
      callback: response => {
        this.setState({
          rewardsData: response.data
        })
      }
    })
  }

  // 职务信息 只查在职
  fetchChangeCode = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/fetchChangeCode',
      payload: {
        pageNumber,
        pageSize,
        ...filter
      }
    })
  }
  afterVisibleChange = visible => {
  };

  renderPersonInfo = params => {
    const {
      positionLevelData,
      familyRelationsData,
      rewardsPunishmentsData,
      pfileWorkRecordModel: { data, changeCodeData },
      pfileFamilyRelationsModel: { fimalyData },
      pfileAnnualAppraisalNarrativeModel: { appraisalData },
      pfileEducationalModel: { educationalData }
    } = this.props;
    const { dateFormat, rewardsData } = this.state;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '称谓',
        dataIndex: 'appellation',
        key: 'appellation',
      },
      {
        title: '出生日期',
        dataIndex: 'birthday',
        key: 'birthday',
        render: text => {
          return <span>{moment(text).format(this.state.dateFormat)}</span>
        }
      },
      {
        title: '政治面貌',
        dataIndex: 'politicalStatus',
        key: 'politicalStatus',
      },
      {
        title: '工作单位及职务',
        dataIndex: 'companyPosition',
        key: 'companyPosition',
      }
    ];
    const educationaColumns = [
      {
        title: '学校名称',
        dataIndex: 'schoolName',
        ellipsis: true,
        align: 'center',
        width: '5px',
      },
      {
        title: '教育类别',
        dataIndex: 'educationCategory',
        ellipsis: true,
        width: '5px',
      },
      {
        title: '所学专业类别',
        dataIndex: 'majorCategory',
        ellipsis: true,
        align: 'center',
        width: '5px',
      },
      {
        title: '所学专业名称',
        dataIndex: 'majorName',
        ellipsis: true,
        width: '5px',
      },
      {
        title: '学制年限（年）',
        dataIndex: 'schooling',
        ellipsis: true,
        align: 'center',
        width: '5px',
      },
      {
        title: '入学时间',
        dataIndex: 'enrollmentTime',
        ellipsis: true,
        align: 'center',
        width: '5px',
      },
      {
        title: '毕业时间',
        dataIndex: 'graduationTime',
        ellipsis: true,
        align: 'center',
        width: '5px',
      }
    ];

    return (
      <div style={{ width: 1024, margin: '0 auto' }} className={TimeStyle.timeline}>
        <Divider orientation="left">基础信息</Divider>
        <Row>
          <Col>
            <Row>
              <Col span={16} >
                <h2><strong>{params.name}</strong></h2>
                <p>
                  {params.resume}
                </p>
                <Row>
                  <Col span={24}>
                    <span><strong>国家级正职：</strong></span>
                    {params.workName}
                  </Col>
                  <Col span={12}>
                    <span><strong>健康状况：</strong></span>
                    {params.health}
                  </Col>
                  <Col span={12}>
                    <span><strong>专业技术职务：</strong></span>
                    {params.professionalTitles}
                  </Col>
                  <Col span={12}>
                    <span><strong>熟悉专业有何特长：</strong></span>
                    {params.speciality}
                  </Col>
                </Row>
              </Col>
              <Col span={6} >
                <img style={{ marginLeft: 30 }} width="150" height="212" alt="example" src={params.photoUrl} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider orientation="left">简历信息</Divider>
        <Row>
          <Col>
            <Timeline>
              {data && data.length !== 0 ? data.map((dt, index) => {
                if (index === data.length - 1) {
                  return <>
                    <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '12px' }} />}>
                      <div> {moment(dt.b4ServicedTime).format(dateFormat)} -- {moment(dt.afterServicedTime).format(dateFormat)} 任职于{dt.afterOrgName}{dt.afterPositionName}</div>
                    </Timeline.Item>
                  </>
                } else if (index === 0) {
                  return <>
                    <Timeline.Item color="red">
                      <div> {moment(dt.b4ServicedTime).format(dateFormat)} -- {moment(dt.afterServicedTime).format(dateFormat)} 任职于{dt.afterOrgName}{dt.afterPositionName}</div>
                    </Timeline.Item>
                  </>
                } else {
                  return <>
                    <Timeline.Item>
                      <div> {moment(dt.b4ServicedTime).format(dateFormat)} -- {moment(dt.afterServicedTime).format(dateFormat)} 任职于{dt.afterOrgName}{dt.afterPositionName}</div>
                    </Timeline.Item>
                  </>
                }

              }) :
                <Timeline.Item color="red">
                  <div>暂无数据</div>
                </Timeline.Item>
              }
            </Timeline>
          </Col>
        </Row>
        <Divider orientation="left">职务信息</Divider>
        {changeCodeData && changeCodeData.length !== 0 ? data.map((changecd, index) => {
          if (index === changeCodeData.length - 1) {
            return <>
              <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '12px' }} />}>
                <div> {moment(changecd.afterServicedTime).format(dateFormat)} 任职于{changecd.afterOrgName}{changecd.afterPositionName}  <Tag color="cyan">{changecd.memberCategory}</Tag></div>
              </Timeline.Item>
            </>
          } else if (index === 0) {
            return <>
              <Timeline.Item color="red">
                <div> {moment(changecd.afterServicedTime).format(dateFormat)} 任职于{changecd.afterOrgName}{changecd.afterPositionName}  <Tag color="cyan">{changecd.memberCategory}</Tag></div>
              </Timeline.Item>
            </>
          } else {
            return <>
              <Timeline.Item>
                <div>{moment(changecd.afterServicedTime).format(dateFormat)} 任职于{changecd.afterOrgName}{changecd.afterPositionName}  <Tag color="cyan">{changecd.memberCategory}</Tag></div>
              </Timeline.Item>
            </>
          }

        }) :
          <Timeline.Item color="red">
            <div>暂无数据</div>
          </Timeline.Item>
        }
        <Divider orientation="left">学历信息</Divider>
        <Table pagination={false} style={{ width: '900px' }} bordered size="small" columns={educationaColumns} dataSource={educationalData} />
        <Divider orientation="left">考核信息</Divider>
        <Timeline>
          {appraisalData && appraisalData.length !== 0 ? appraisalData.map((appr, index) => {
            if (index === appraisalData.length - 1) {
              return <>
                <Timeline.Item color="red">
                  <div>{appr.year}.01--2006.12 年度考核{appr.conclusion}</div>
                </Timeline.Item>
              </>
            } else if (index === 0) {
              return <>
                <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '12px' }} />}>
                  <div>{appr.year}.01--2006.12 年度考核{appr.conclusion}</div>
                </Timeline.Item>
              </>
            } else {
              return <>
                <Timeline.Item>
                  <div>{appr.year}.01--2006.12 年度考核{appr.conclusion}</div>
                </Timeline.Item>
              </>
            }

          }) :
            <Timeline.Item color="red">
              <div>暂无数据</div>
            </Timeline.Item>
          }
        </Timeline>
        <Divider orientation="left">奖惩信息</Divider>
        <Timeline>
          {rewardsData && rewardsData.length !== 0 ? rewardsData.map((item, index) => {
            if (index === rewardsData.length - 1) {
              return <>
                <Timeline.Item color="red">
                  <span> {moment(item.approvalTime).format("YYYY年MM月DD日")}，经{item.approvalAuthorityNature}{item.approvalAuthority}批准，{item.name}。<br /></span>
                </Timeline.Item>
              </>
            } else if (index === 0) {
              return <>
                <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '12px' }} />}>
                  <span> {moment(item.approvalTime).format("YYYY年MM月DD日")}，经{item.approvalAuthorityNature}{item.approvalAuthority}批准，{item.name}。<br /></span>
                </Timeline.Item>
              </>
            } else {
              return <>
                <Timeline.Item>
                  <span> {moment(item.approvalTime).format("YYYY年MM月DD日")}，经{item.approvalAuthorityNature}{item.approvalAuthority}批准，{item.name}。<br /></span>
                </Timeline.Item>
              </>
            }

          }) :
            <Timeline.Item color="red">
              <div>暂无数据</div>
            </Timeline.Item>
          }
        </Timeline>
        <Divider orientation="left">家庭成员</Divider>
        <Table pagination={false} size="small" columns={columns} style={{ width: '900px' }} bordered dataSource={fimalyData} />
        {/* <Row>
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
        </Row> */}
      </div>
    );
  };

  onChangeTab = params => {
    // switch (params) {
    //   case '2':
    //     this.findEducational(1, 2, { educationCategory: '全日制', outMark: '1' })
    //     this.findEducational(1, 2, { educationCategory: '在职', outMark: '1' })
    //     break;
    //   default:
    //     console.log("default")
    //     break;
    // }
  }

  render() {
    const { record, pfileAnnualAppraisalNarrativeModel: { appraisalData }, pfileFamilyRelationsModel: { fimalyData } } = this.props;
    const { fullTime, onTheJob, rewardsData } = this.state;
    if (!record) return;
    return (
      <div style={{ margin: '0 auto' }}>
        <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
          <TabPane tab="人员信息" key="1">
            {this.renderPersonInfo(record)}
          </TabPane>
          <TabPane tab="任免审批表" key="2">
            <Row>
              <table className="table-approval-form">
                <tbody style={{ display: 'block' }}>
                  <tr>
                    <td className="width-100 height-53 table-approval-form-label">姓名</td>
                    <td className="width-130 height-53">{record['name']}</td>
                    <td className="width-100 height-53 table-approval-form-label">性别</td>
                    <td className="width-130 height-53">{record['sex']}</td>
                    <td className="width-100 height-53 table-approval-form-label">出生年月</td>
                    <td className="width-130 height-53">{moment(record['birth']).format("YYYY年MM月DD日")}</td>
                    <td rowSpan={4} className="width-150 height-212">
                      <img width="150px" height="212px" src={record['photoUrl']} alt="example" />
                    </td>
                  </tr>
                  <tr>
                    <td className="width-100 height-53 table-approval-form-label">民族</td>
                    <td className="width-130 height-53">{record['national']}</td>
                    <td className="width-100 height-53 table-approval-form-label">籍贯</td>
                    <td className="width-130 height-53">{record['nativePlace']}</td>
                    <td className="width-100 height-53 table-approval-form-label">出生地</td>
                    <td className="width-130 height-53">{record['birthplace']}</td>
                  </tr>
                  <tr>
                    <td className="width-100 height-53 table-approval-form-label">入党时间</td>
                    <td className="width-130 height-53">{moment(record['partyTime']).format("YYYY年MM月DD日")}</td>
                    <td className="width-100 height-53 table-approval-form-label">参加工作时间</td>
                    <td className="width-130 height-53">{moment(record['workTime']).format("YYYY年MM月DD日")}</td>
                    <td className="width-100 height-53 table-approval-form-label">健康状况</td>
                    <td className="width-130 height-53">{record['health']}</td>
                  </tr>
                  <tr>
                    <td className="width-100 height-53 table-approval-form-label">专业技术职务</td>
                    <td colSpan={2} className="height-53">{record['professionalTitles']}</td>
                    <td className="width-100 height-53 table-approval-form-label">熟悉专业有何特长</td>
                    <td colSpan={2} className="height-53">{record['speciality']}</td>
                  </tr>
                  <tr>
                    <td rowSpan={4} className="table-approval-form-label">
                      <p>学历</p>
                      <p>学位</p>
                    </td>
                    <td rowSpan={2} className="table-approval-form-label">
                      全日制教育
                  </td>
                    <td colSpan={2} className="height-40">
                      {fullTime ? fullTime.map((item, index) => {

                        if (index === fullTime.length - 1) {
                          return <span>{item.educationName}</span>
                        } else {
                          return <span>{item.educationName} ，</span>
                        }
                      }) : ''
                      }
                    </td>
                    <td rowSpan={2} className="table-approval-form-label">
                      毕业院校系及专业
                  </td>
                    <td colSpan={2} className="height-40">
                      {fullTime ? fullTime.map((item, index) => {
                        if (index === 0) {
                          return <span>{item.schoolName}{item.majorName}</span>
                        }
                      }) : ''
                      }
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="height-40">
                      {fullTime ? fullTime.map((item, index) => {
                        if (index === fullTime.length - 1) {
                          return <span>{item.degreeName}</span>
                        } else {
                          return <span>{item.degreeName} ，</span>
                        }
                      }) : ''
                      }
                    </td>
                    <td colSpan={2} className="height-40">
                      {fullTime ? fullTime.map((item, index) => {
                        if (index >= 1) {
                          if (index === fullTime.length - 1) {
                            return <span>{item.schoolName}{item.majorName}</span>
                          } else {
                            return <span>{item.schoolName}{item.majorName}，</span>
                          }
                        }
                      }) : ''
                      }
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={2} className="table-approval-form-label">
                      在职教育
                    </td>
                    <td colSpan={2} className="height-40">
                      {onTheJob ? onTheJob.map((item, index) => {
                        if (index === onTheJob.length - 1) {
                          return <span>{item.educationName}</span>
                        } else {
                          return <span>{item.educationName} ，</span>
                        }
                      }) : ''
                      }
                    </td>
                    <td rowSpan={2} className="table-approval-form-label">
                      毕业院校系及专业
                    </td>
                    <td colSpan={2} className="height-40">
                      {onTheJob ? onTheJob.map((item, index) => {
                        if (index === 0) {
                          return <span>{item.schoolName}{item.majorName}</span>
                        }
                      }) : ''
                      }
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="height-40">
                      {onTheJob ? onTheJob.map((item, index) => {
                        if (index === onTheJob.length - 1) {
                          return <span>{item.degreeName}</span>
                        } else {
                          return <span>{item.degreeName}，</span>
                        }
                      }) : ''
                      }
                    </td>
                    <td colSpan={2} className="height-40">
                      {onTheJob ? onTheJob.map((item, index) => {
                        if (index >= 1) {
                          if (index === onTheJob.length - 1) {
                            return <span>{item.schoolName}{item.majorName}</span>
                          } else {
                            return <span>{item.schoolName}{item.majorName}，</span>
                          }
                        }
                      }) : ''
                      }
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="height-53 table-approval-form-label">
                      工作单位及职务
                    </td>
                    <td colSpan={5}>
                      {record.workName}
                    </td>
                  </tr>
                  <tr>
                    <td className="height-400 table-approval-form-label">
                      简历
                    </td>
                    <td colSpan={6}>
                      {record.resume}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
            <Row style={{ marginTop: 24 }}>
              <Col>
                <Button icon="fileWord" style={{ marginRight: 12 }}>导出</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="任免审批表（无拟任免）" key="3">
            <Row>
              <Col>
                <table className="table-approval-form">
                  <tbody style={{ display: 'block' }}>
                    <tr>
                      <td className="height-53 width-150 table-approval-form-label">奖惩综述</td>
                      <td className="height-53 width-705" colSpan={6}>
                        {rewardsData.map(item => {
                          if (item.outMark === '1') {
                            return <span> {moment(item.approvalTime).format("YYYY年MM月DD日")}，经{item.approvalAuthorityNature}{item.approvalAuthority}批准，{item.name}。<br /></span>
                          }
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="height-53 width-150 table-approval-form-label">
                        年度考核结果综述
                      </td>
                      <td className="height-53 width-705" colSpan={6}>
                        {appraisalData && appraisalData.length !== 0 ? appraisalData.map(item => {
                          return <span> {moment(item.year).format("YYYY年")}，年度考核{item.conclusion}{item.approvalAuthority}。<br /></span>
                        }) : ''}
                      </td>
                    </tr>
                    <tr>
                      <td rowSpan={11} className="table-approval-form-label">
                        家<br />庭<br />主<br />要<br />成<br />员<br />及<br />社<br />会<br />重<br />要<br />关<br />系
                      </td>
                      <td className="width-80 table-approval-form-label">称谓</td>
                      <td className="width-80 table-approval-form-label">姓名</td>
                      <td className="width-80 table-approval-form-label">出生日期</td>
                      <td className="width-80 table-approval-form-label">政治面貌</td>
                      <td className="table-approval-form-label">工作单位及职务</td>
                    </tr>
                    {fimalyData ? fimalyData.map(item => {
                      return (
                        <tr>
                          <td>{item.name}</td>
                          <td>{item.appellation}</td>
                          <td>{moment(item.birthday).format("YYYY年MM月DD日")}</td>
                          <td>{item.politicalStatus}</td>
                          <td>{item.companyPosition}</td>
                        </tr>
                      )
                    }) : ''}
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row style={{ marginTop: 24 }}>
              <Col>
                <Button icon="fileWord" style={{ marginRight: 12 }}>导出</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="其他" key="4">
            <Row>
              <Col>
                <table className="table-approval-form">
                  <tbody style={{ display: 'block' }}>
                    <tr>
                      <td rowSpan={4} className="width-75 table-approval-form-label">
                        其<br />他<br />信<br />息
                    </td>
                      <td className="width-150 height-53 table-approval-form-label">是否考录</td>
                      <td className="width-242 height-53">{record.isExamination}</td>
                      <td className="width-150 height-53 table-approval-form-label">录用时间</td>
                      <td className="width-242 height-53">{record.examinationtime}</td>
                    </tr>
                    <tr>
                      <td className="width-150 height-53 table-approval-form-label">是否选调生</td>
                      <td className="width-242 height-53">{record.isSelectedGraduates}</td>
                      <td className="width-150 height-53 table-approval-form-label">进入选调生时间</td>
                      <td className="width-242 height-53">{record.selectedGraduatesTime}</td>
                    </tr>
                    <tr>
                      <td className="width-150 height-53 table-approval-form-label">成长地</td>
                      <td className="width-242 height-53">{record.birthplace}</td>
                      <td className="width-150 height-53 table-approval-form-label">级别</td>
                      <td className="width-242 height-53">{record.level}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="width-150 height-53 table-approval-form-label">专业技术类公务员任职资格</td>
                      <td className="width-242 height-53" colSpan={2}>
                        {record.civilServantQualification}
                      </td>
                    </tr>
                    <tr>
                      <td className="width-75 height-400 table-approval-form-label">
                        备<br />注
                    </td>
                      <td colSpan={4}>
                        {record.remark}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row style={{ marginTop: 24 }}>
              <Col>
                <Button icon="fileWord" style={{ marginRight: 12 }}>导出</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="公务员职级套转表" key="5">
            <table className="table-approval-form">
              <tbody style={{ display: 'block' }}>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">姓名</td>
                  <td className="width-130 height-53">{record.name}</td>
                  <td className="width-100 height-53 table-approval-form-label">性别</td>
                  <td className="width-130 height-53">{record.sex}</td>
                  <td className="width-100 height-53 table-approval-form-label">出生年月</td>
                  <td className="width-130 height-53">{moment(record.birth).format("YYYY年MM月DD日")}</td>
                  <td colSpan={2} rowSpan={3} className="width-150 height-212">
                    <img width="150px" height="212px" src={record.photoUrl} alt="example" />
                  </td>
                </tr>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">籍贯</td>
                  <td className="width-130 height-53">{record.nativePlace}</td>
                  <td className="width-100 height-53 table-approval-form-label">民族</td>
                  <td className="width-130 height-53">{record.national}</td>
                  <td className="width-100 height-53 table-approval-form-label">政治面貌</td>
                  <td className="width-130 height-53">{record.party}</td>
                </tr>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">身份证号</td>
                  <td colSpan={5} >{record.idCard}</td>

                </tr>
                <tr>
                  <td rowSpan={4} className="table-approval-form-label">
                    <p>学历</p>
                    <p>学位</p>
                  </td>
                  <td rowSpan={2} className="table-approval-form-label">
                    全日制教育
                  </td>
                  <td colSpan={2} className="height-40">
                    {fullTime ? fullTime.map((item, index) => {

                      if (index === fullTime.length - 1) {
                        return <span>{item.educationName}</span>
                      } else {
                        return <span>{item.educationName} ，</span>
                      }
                    }) : ''
                    }
                  </td>
                  <td rowSpan={2} className="table-approval-form-label">
                    毕业院校系及专业
                  </td>
                  <td colSpan={4} className="height-40">
                    {fullTime ? fullTime.map((item, index) => {
                      if (index === 0) {
                        return <span>{item.schoolName}{item.majorName}</span>
                      }
                    }) : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="height-40">
                    {fullTime ? fullTime.map((item, index) => {
                      if (index === fullTime.length - 1) {
                        return <span>{item.degreeName}</span>
                      } else {
                        return <span>{item.degreeName} ，</span>
                      }
                    }) : ''
                    }
                  </td>
                  <td colSpan={4} className="height-40">
                    {fullTime ? fullTime.map((item, index) => {
                      if (index >= 1) {
                        if (index === fullTime.length - 1) {
                          return <span>{item.schoolName}{item.majorName}</span>
                        } else {
                          return <span>{item.schoolName}{item.majorName}，</span>
                        }
                      }
                    }) : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td rowSpan={2} className="table-approval-form-label">
                    在职教育
                    </td>
                  <td colSpan={2} className="height-40">
                    {onTheJob ? onTheJob.map((item, index) => {
                      if (index === onTheJob.length - 1) {
                        return <span>{item.educationName}</span>
                      } else {
                        return <span>{item.educationName} ，</span>
                      }
                    }) : ''
                    }
                  </td>
                  <td rowSpan={2} className="table-approval-form-label">
                    毕业院校系及专业
                    </td>
                  <td colSpan={4} className="height-40">
                    {onTheJob ? onTheJob.map((item, index) => {
                      if (index === 0) {
                        return <span>{item.schoolName}{item.majorName}</span>
                      }
                    }) : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="height-40">
                    {onTheJob ? onTheJob.map((item, index) => {
                      if (index === onTheJob.length - 1) {
                        return <span>{item.degreeName}</span>
                      } else {
                        return <span>{item.degreeName}，</span>
                      }
                    }) : ''
                    }
                  </td>
                  <td colSpan={4} className="height-40">
                    {onTheJob ? onTheJob.map((item, index) => {
                      if (index >= 1) {
                        if (index === onTheJob.length - 1) {
                          return <span>{item.schoolName}{item.majorName}</span>
                        } else {
                          return <span>{item.schoolName}{item.majorName}，</span>
                        }
                      }
                    }) : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td className="height-53 table-approval-form-label">
                    现工作单位及职务
                </td>
                  <td colSpan={5}>{record.workName}</td>
                  <td className="height-53 table-approval-form-label">
                    公务员登记时间
                </td>
                  <td>{moment(record.serviceTime).format("YYYY年MM月DD日")}</td>
                </tr>
                <tr>
                  <td className="height-53 table-approval-form-label">
                    现职务层次
                </td>
                  <td>
                    {record.positionLevel}
                  </td>
                  <td className="height-53 table-approval-form-label">
                    任现职务层次时间
                </td>
                  <td>
                    {moment(record.positionLevelTime).format("YYYY年MM月DD日")}
                  </td>
                  <td className="height-53 table-approval-form-label">
                    县以下机关职级
                </td>
                  <td></td>
                  <td className="width-75 height-53 table-approval-form-label">
                    任县以下机关职级时间
                </td>
                  <td className="width-75"></td>
                </tr>
                <tr>
                  <td className="height-53 table-approval-form-label">套转后职级</td>
                  <td colSpan={3}></td>
                  <td className="height-53 table-approval-form-label">级别</td>
                  <td colSpan={3}>{record.level}</td>
                </tr>
                <tr>
                  <td className="height-212 table-approval-form-label">
                    审<br />核<br />意<br />见
                </td>
                  <td colSpan={3} style={{ textAlign: 'right', paddingTop: 150 }}>
                    年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日（盖章）
                </td>
                  <td className="height-212 table-approval-form-label">
                    审<br />批<br />意<br />见
                </td>
                  <td colSpan={3} style={{ textAlign: 'right', paddingTop: 150 }}>
                    年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日（盖章）
                </td>
                </tr>
                <tr>
                  <td className="height-100 table-approval-form-label">备注</td>
                  <td colSpan={7}>{record.remark}</td>
                </tr>
              </tbody>
            </table>
          </TabPane>
          <TabPane tab="参公人员职级套转表" key="6">
            <Row>
              <Col>
                <table className="table-approval-form">
                  <tbody style={{ display: 'block' }}>
                    <tr>
                      <td className="width-100 height-53 table-approval-form-label">姓名</td>
                      <td className="width-130 height-53">{record.name}</td>
                      <td className="width-100 height-53 table-approval-form-label">性别</td>
                      <td className="width-130 height-53">{record.sex}</td>
                      <td className="width-100 height-53 table-approval-form-label">出生年月</td>
                      <td className="width-130 height-53">{moment(record.birth).format("YYYY年MM月DD日")}</td>
                      <td colSpan={2} rowSpan={3} className="width-150 height-212">
                        <img width="150px" height="212px" src={record.photoUrl} alt="example" />
                      </td>
                    </tr>
                    <tr>
                      <td className="width-100 height-53 table-approval-form-label">籍贯</td>
                      <td className="width-130 height-53">{record.nativePlace}</td>
                      <td className="width-100 height-53 table-approval-form-label">民族</td>
                      <td className="width-130 height-53">{record.national}</td>
                      <td className="width-100 height-53 table-approval-form-label">政治面貌</td>
                      <td className="width-130 height-53">{record.party}</td>
                    </tr>
                    <tr>
                      <td className="width-100 height-53 table-approval-form-label">身份证号</td>
                      <td colSpan={5} >{record.idCard}</td>

                    </tr>
                    <tr>
                      <td rowSpan={4} className="table-approval-form-label">
                        <p>学历</p>
                        <p>学位</p>
                      </td>
                      <td rowSpan={2} className="table-approval-form-label">
                        全日制教育
                  </td>
                      <td colSpan={2} className="height-40">
                        {fullTime ? fullTime.map((item, index) => {

                          if (index === fullTime.length - 1) {
                            return <span>{item.educationName}</span>
                          } else {
                            return <span>{item.educationName} ，</span>
                          }
                        }) : ''
                        }
                      </td>
                      <td rowSpan={2} className="table-approval-form-label">
                        毕业院校系及专业
                  </td>
                      <td colSpan={4} className="height-40">
                        {fullTime ? fullTime.map((item, index) => {
                          if (index === 0) {
                            return <span>{item.schoolName}{item.majorName}</span>
                          }
                        }) : ''
                        }
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="height-40">
                        {fullTime ? fullTime.map((item, index) => {
                          if (index === fullTime.length - 1) {
                            return <span>{item.degreeName}</span>
                          } else {
                            return <span>{item.degreeName} ，</span>
                          }
                        }) : ''
                        }
                      </td>
                      <td colSpan={4} className="height-40">
                        {fullTime ? fullTime.map((item, index) => {
                          if (index >= 1) {
                            if (index === fullTime.length - 1) {
                              return <span>{item.schoolName}{item.majorName}</span>
                            } else {
                              return <span>{item.schoolName}{item.majorName}，</span>
                            }
                          }
                        }) : ''
                        }
                      </td>
                    </tr>
                    <tr>
                      <td rowSpan={2} className="table-approval-form-label">
                        在职教育
                    </td>
                      <td colSpan={2} className="height-40">
                        {onTheJob ? onTheJob.map((item, index) => {
                          if (index === onTheJob.length - 1) {
                            return <span>{item.educationName}</span>
                          } else {
                            return <span>{item.educationName} ，</span>
                          }
                        }) : ''
                        }
                      </td>
                      <td rowSpan={2} className="table-approval-form-label">
                        毕业院校系及专业
                    </td>
                      <td colSpan={4} className="height-40">
                        {onTheJob ? onTheJob.map((item, index) => {
                          if (index === 0) {
                            return <span>{item.schoolName}{item.majorName}</span>
                          }
                        }) : ''
                        }
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="height-40">
                        {onTheJob ? onTheJob.map((item, index) => {
                          if (index === onTheJob.length - 1) {
                            return <span>{item.degreeName}</span>
                          } else {
                            return <span>{item.degreeName}，</span>
                          }
                        }) : ''
                        }
                      </td>
                      <td colSpan={4} className="height-40">
                        {onTheJob ? onTheJob.map((item, index) => {
                          if (index >= 1) {
                            if (index === onTheJob.length - 1) {
                              return <span>{item.schoolName}{item.majorName}</span>
                            } else {
                              return <span>{item.schoolName}{item.majorName}，</span>
                            }
                          }
                        }) : ''
                        }
                      </td>
                    </tr>
                    <tr>
                      <td className="height-53 table-approval-form-label">
                        现工作单位及职务
                </td>
                      <td colSpan={5}>{record.workName}</td>
                      <td className="height-53 table-approval-form-label">
                        公务员登记时间
                </td>
                      <td>{moment(record.serviceTime).format("YYYY年MM月DD日")}</td>
                    </tr>
                    <tr>
                      <td className="height-53 table-approval-form-label">
                        现职务层次
                </td>
                      <td>
                        {record.positionLevel}
                      </td>
                      <td className="height-53 table-approval-form-label">
                        任现职务层次时间
                </td>
                      <td>
                        {moment(record.positionLevelTime).format("YYYY年MM月DD日")}
                      </td>
                      <td className="height-53 table-approval-form-label">
                        县以下机关职级
                </td>
                      <td></td>
                      <td className="width-75 height-53 table-approval-form-label">
                        任县以下机关职级时间
                </td>
                      <td className="width-75"></td>
                    </tr>
                    <tr>
                      <td className="height-53 table-approval-form-label">套转后职级</td>
                      <td colSpan={3}></td>
                      <td className="height-53 table-approval-form-label">级别</td>
                      <td colSpan={3}>{record.level}</td>
                    </tr>
                    <tr>
                      <td className="height-212 table-approval-form-label">
                        审<br />核<br />意<br />见
                </td>
                      <td colSpan={3} style={{ textAlign: 'right', paddingTop: 150 }}>
                        年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日（盖章）
                </td>
                      <td className="height-212 table-approval-form-label">
                        审<br />批<br />意<br />见
                </td>
                      <td colSpan={3} style={{ textAlign: 'right', paddingTop: 150 }}>
                        年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日（盖章）
                </td>
                    </tr>
                    <tr>
                      <td className="height-100 table-approval-form-label">备注</td>
                      <td colSpan={7}>{record.remark}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row style={{ marginTop: 24 }}>
              <Col>
                <Button icon="fileWord" style={{ marginRight: 12 }}>导出</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="公务员职级晋升表" key="7">
            <table className="table-approval-form">
              <tbody style={{ display: 'block' }}>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">姓名</td>
                  <td className="width-130 height-53">{record.name}</td>
                  <td className="width-100 height-53 table-approval-form-label">性别</td>
                  <td className="width-130 height-53">{record.sex}</td>
                  <td className="width-100 height-53 table-approval-form-label">出生年月(岁)</td>
                  <td className="width-130 height-53">{moment(record['birth']).format("YYYY年MM月DD日")}({(new Date().getFullYear()) - Number(moment(record['birth']).format("YYYY"))}岁)</td>
                  <td rowSpan={4} className="width-150 height-212">
                    <img width="150px" height="212px" src={record.photoUrl} alt="example" />
                  </td>
                </tr>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">民族</td>
                  <td className="width-130 height-53">汉族</td>
                  <td className="width-100 height-53 table-approval-form-label">籍贯</td>
                  <td className="width-130 height-53">海南海口</td>
                  <td className="width-100 height-53 table-approval-form-label">出生地</td>
                  <td className="width-130 height-53">海南海口</td>
                </tr>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">入党时间</td>
                  <td className="width-130 height-53"></td>
                  <td className="width-100 height-53 table-approval-form-label">参加工作时间</td>
                  <td className="width-130 height-53">1987.08</td>
                  <td className="width-100 height-53 table-approval-form-label">健康状况</td>
                  <td className="width-130 height-53">健康</td>
                </tr>
                <tr>
                  <td className="width-100 height-53 table-approval-form-label">
                    专业技术职务
                </td>
                  <td colSpan={2}></td>
                  <td className="width-100 height-53 table-approval-form-label">
                    熟悉专业有何特长
                </td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td rowSpan={2} className="table-approval-form-label">
                    学历
                  <br />
                  学位
                </td>
                  <td className="table-approval-form-label">
                    全日制教育
                </td>
                  <td colSpan={2} className="height-40">
                    中专
                </td>
                  <td className="table-approval-form-label">
                    毕业院校系及专业
                </td>
                  <td colSpan={3} className="height-40">
                    广东省供销学校计划统计专业
                </td>
                </tr>
                <tr>
                  <td className="table-approval-form-label">
                    在职教育
                </td>
                  <td colSpan={2} className="height-40">
                    中央党校大学
                </td>
                  <td className="table-approval-form-label">
                    毕业院校系及专业
                </td>
                  <td colSpan={3} className="height-40">
                    中央党校函授学院国民经济管理专业
                </td>
                </tr>
                <tr>
                  <td colSpan={2} className="height-53 table-approval-form-label">
                    现任职务
                </td>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <td colSpan={2} className="height-53 table-approval-form-label">
                    拟任职务
                </td>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <td colSpan={2} className="height-53 table-approval-form-label">
                    拟免职务
                </td>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <td className="height-400 table-approval-form-label">
                    简<br />历
                </td>
                  <td colSpan={6} className="table-approval-form-resume">
                    <div>
                      <p>2008.09--2012.07  北京航空航天大学北海学院在校学生</p>
                      <p>2012.07--2012.08  待业</p>
                      <p>2012.08--2015.08  广西南宁市上林县白圩镇高长村党组织书记助理</p>
                      <p>2015.08--2017.01  待业</p>
                      <p>2017.01--2017.07  南宁市西乡塘区华强街道办事处劳动保障事务所会计</p>
                      <p>2017.07--2018.04  国家统计局南宁调查队居民消费价格调查科试用</p>
                      <p>2018.04--2018.08  国家统计局南宁调查队农业调查科科员试用</p>
                      <p>2018.08--         国家统计局南宁调查队农业调查科科员</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </TabPane>
        </Tabs>
      </div >
    );
  }
}
