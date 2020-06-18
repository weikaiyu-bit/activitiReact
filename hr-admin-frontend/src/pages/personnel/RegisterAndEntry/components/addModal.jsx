import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Tabs, message, Upload, Table, Divider, Popconfirm, Tag, DatePicker, Switch } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DictionaryTree from '../../../components/dictionaryTree';
import moment from 'moment';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 12 },
};
const singleFormItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 21 },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传 JPG/PNG 的格式图片');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class RegisterAndEntryAddModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    photoUrlTemp: null,
    uploading: false,
  };

  jobInfoSubColumns = [
    {
      title: '任职机构',
      dataIndex: 'afterOrgName',
    },
    {
      title: '职务名称',
      dataIndex: 'afterPositionName',
    },
    {
      title: '是否领导职务',
      dataIndex: 'isLeader',
    },
    {
      title: '是否领导成员',
      dataIndex: 'isLeaderMember',
    },
    {
      title: '成员类别',
      dataIndex: 'memberCategory',
    },
    {
      title: '职务排序',
      dataIndex: 'sortNo',
    },
    {
      title: '集体内排序',
      dataIndex: 'inSortNo',
    },
    {
      title: '任职时间',
      dataIndex: 'afterServicedTime',
    },
    {
      title: '任职文号',
      dataIndex: 'docNo',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  jobLevelAndJobLevelInfoSetColumns = [
    {
      title: '类别（ 职务层次、职级标志）',
      dataIndex: 'positionCategory',
    },
    {
      title: '职务层次（职级）',
      dataIndex: 'positionLevel',
    },
    {
      title: '批准日期',
      dataIndex: 'approvalTime',
    },
    {
      title: '批准文号',
      dataIndex: 'approvalNo',
    },
    {
      title: '终止日期',
      dataIndex: 'term',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  proAndTechnicalQualificationsColumns = [
    {
      title: '专业技术资格代码',
      dataIndex: 'ptqCode',
    },
    {
      title: '专业技术资格名称',
      dataIndex: 'ptqName',
    },
    {
      title: '获取资格日期',
      dataIndex: 'ptqTime',
    },
    {
      title: '获取资格途径',
      dataIndex: 'ptFrom',
    },
    {
      title: '评委会或考试名称',
      dataIndex: 'examinationName',
    },
    {
      title: '输出标识',
      dataIndex: 'outputFlag',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  academicDegreeCollectionColumns = [
    {
      title: '输出标识',
      dataIndex: 'outMark',
      ellipsis: true,
      width: 100,
    },
    {
      title: '学历名称',
      dataIndex: 'educationName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '学历代码',
      dataIndex: 'educationCode',
      ellipsis: true,
      width: 100,
    },
    {
      title: '学位名称',
      dataIndex: 'degreeName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '学位代码',
      dataIndex: 'degreeCode',
      ellipsis: true,
      width: 100,
    },
    {
      title: '入学时间',
      dataIndex: 'enrollmentTime',
      ellipsis: true,
      width: 100,
    },
    {
      title: '毕（肄）业时间',
      dataIndex: 'graduationTime',
      ellipsis: true,
      width: 150,
    },
    {
      title: '学位授予时间',
      dataIndex: 'degreeTime',
      ellipsis: true,
      width: 150,
    },
    {
      title: '学校（单位）名称',
      dataIndex: 'schoolName',
      ellipsis: true,
      width: 150,
    },
    {
      title: '所学专业名称',
      dataIndex: 'majorName',
      ellipsis: true,
      width: 150,
    },
    {
      title: '所学专业类别',
      dataIndex: 'majorCategory',
      ellipsis: true,
      width: 150,
    },
    {
      title: '教育类别',
      dataIndex: 'educationCategory',
      ellipsis: true,
      width: 100,
    },
    {
      title: '学制年限',
      dataIndex: 'schooling',
      ellipsis: true,
      width: 100,
    },
    {
      title: '操作',
      ellipsis: true,
      width: 100,
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  rewardAndPunishmentInfoSetColumns = [
    {
      title: '奖惩名称代码',
      dataIndex: 'code',
    },
    {
      title: '奖惩名称',
      dataIndex: 'name',
    },
    {
      title: '批准时间',
      dataIndex: 'approvalTime',
    },
    {
      title: '批准机关',
      dataIndex: 'approvalAuthority',
    },
    {
      title: '批准机关级别',
      dataIndex: 'approvalAuthorityLevel',
    },
    {
      title: '受奖惩时职务层次',
      dataIndex: 'positionLevel',
    },
    {
      title: '撤销日期',
      dataIndex: 'revocationTime',
    },
    {
      title: '批准机关性质',
      dataIndex: 'approvalAuthorityNature',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  appraisalInfoSetColumns = [
    {
      title: '考核结论',
      dataIndex: 'conclusion',
    },
    {
      title: '考核年度',
      dataIndex: 'year',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  exitInfoSetColumns = [
    {
      title: '退出方式',
      dataIndex: 'manner',
    },
    {
      title: '退出时间',
      dataIndex: 'exitTime',
    },
    {
      title: '退出去向',
      dataIndex: 'destination',
    },
    {
      title: '批准单位',
      dataIndex: 'authority',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  familyMembersAndSocialRelationsInfoSetColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '称谓',
      dataIndex: 'appellation',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
    },
    {
      title: '工作单位及职务',
      dataIndex: 'companyPosition',
    },
    {
      title: '政治面貌',
      dataIndex: 'politicalStatus',
    },
    {
      title: '排序号',
      dataIndex: 'sort',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  politicCountenanceColumns = [
    {
      title: '政治面貌',
      dataIndex: 'politicalStatus',
    },
    {
      title: '入党时间',
      dataIndex: 'joinTime',
    },
    {
      title: '第二党派',
      dataIndex: 'secondFaction',
    },
    {
      title: '第三党派',
      dataIndex: 'thirdFaction',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  /** ********************************************************************************************* */

  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log('values.orgId', values.orgId);
        return;
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleUploadChange = info => {
    if (info.file.status === 'uploading') {
      console.log('uploading:', info.file, info.fileList);
      this.setState({ uploading: true });
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 照片上传成功！`);
      getBase64(info.file.originFileObj, photoUrlTemp =>
        this.setState({
          photoUrlTemp,
          uploading: false,
        }),
      );
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 照片上传失败!`);
    }
  };

  getValueObject = value => ({ value });

  /** ********************************************************************************************* */

  renderPhoto = photoUrl => {
    const { photoUrlTemp, uploading } = this.state;

    if (photoUrlTemp) {
      return <img src={photoUrlTemp} alt="avatarUrl" style={{ width: '100%' }} />;
    } if (photoUrl) {
      return <img src={photoUrl} alt="avatarUrl" style={{ width: '100%' }} />;
    }
    return (
      <div>
        {uploading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    )
  };

  renderState = (state) => {
    switch (state) {
      case '未入职':
        return <Tag color="orange">{state}</Tag>;
      case '入职':
        return <Tag color="lime">{state}</Tag>;
      case '在职':
        return <Tag color="cyan">{state}</Tag>;
      case '职位变动':
        return <Tag color="hotpink">{state}</Tag>;
      case '提拔':
        return <Tag color="blue">{state}</Tag>;
      case '退休':
        return <Tag color="magenta">{state}</Tag>;
      case '调动':
        return <Tag color="hotpink">{state}</Tag>;
      case '辞职':
        return <Tag color="magenta">{state}</Tag>;
      case '辞退':
        return <Tag color="red">{state}</Tag>;
      default:
        return <Tag>{state}</Tag>;
    }
  }

  renderPersonnelBaseInfo = () => {
    const {
      title,
      visible,
      record,
      form: { getFieldDecorator },
      //  机构级别
      organizationLevelDictData,
      //  健康状况
      healthDictData,
      //  专业技术职称
      professionalAndTechnicalTitleDictData,
      //  先职务层次
      preJobLevelDictData,
      //  现职级
      currentRankDictData,
      //  民族
      nationDictData,
      //  人员类别
      categoryDictData,
      //  单位列表
      organizationData,
    } = this.props;
    const {
      orgId,
      rsOrgId,
      grewupPlace,
      name,
      idCard,
      sex,
      positionName,
      birth,
      national,
      nativePlace,
      birthplace,
      workName,
      level,
      workShortName,
      positionLevel,
      positionLevelTime,
      rank,
      rankTime,
      heducation,
      heducationMajor,
      hdegree,
      hdegreeMajor,
      fulltimeHeducation,
      fulltimeHeducationMajor,
      fulltimeHdegree,
      fulltimeHdegreeMajor,
      parttimeHeducation,
      parttimeHeducationMajor,
      parttimeHdegree,
      parttimeHdegreeMajor,
      partyTime,
      workTime,
      serviceTime,
      professionalTitles,
      civilServantQualification,
      speciality,
      isExamination,
      isSelectedGraduates,
      is2YearGrassroots,
      isRetainTreatment,
      manageCategory,
      personnelCategory,
      posistionCategory,
      health,
      state,
      resume,
      photoUrl,
      remark,
      nationalId,
      rankId,
    } = record;

    return (
      <>

        <Row>
          <Col span={12}>
            <FormItem label="姓名" {...formItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: name || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="性别" {...formItemLayout}>
              {
                getFieldDecorator('sex', {
                  initialValue: sex || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="民族" {...formItemLayout}>
              {
                getFieldDecorator('national', {
                  initialValue: national || '',
                })(<DictionaryTree tree={nationDictData} type="list" />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="照片" {...formItemLayout}>
              {
                getFieldDecorator('photoUrl', {
                  initialValue: photoUrl || '',
                })(<Upload
                  listType="picture-card"
                  showUploadList={false}
                  action="/api/oa/v1/minio/oss/upload"
                  beforeUpload={beforeUpload}
                  onChange={this.handleUploadChange}
                >
                  {this.renderPhoto(photoUrl)}
                </Upload>)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="出生年月" {...formItemLayout}>
              {
                getFieldDecorator('birth', {
                  initialValue: (birth === undefined || birth === null) ? (
                    birth || ''
                  ) : (moment(birth, 'YYYY-MM-DD') || ''),
                })(<DatePicker />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="身份证号" {...formItemLayout}>
              {
                getFieldDecorator('idCard', {
                  initialValue: idCard || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="籍贯" {...formItemLayout}>
              {
                getFieldDecorator('nativePlace', {
                  initialValue: nativePlace || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="状态" {...formItemLayout}>
              {
                getFieldDecorator('state', {
                  initialValue: state || '',
                })(this.renderState(state))
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="出生地" {...formItemLayout}>
              {
                getFieldDecorator('birthplace', {
                  initialValue: birthplace || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="成长地" {...formItemLayout}>
              {
                getFieldDecorator('grewupPlace', {
                  initialValue: grewupPlace || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="入党时间" {...formItemLayout}>
              {
                getFieldDecorator('partyTime', {
                  initialValue: (partyTime === undefined || partyTime === null) ? (
                    partyTime || ''
                  ) : (moment(partyTime, 'YYYY-MM-DD') || ''),
                })(<DatePicker />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="参加工作时间" {...formItemLayout}>
              {
                getFieldDecorator('workTime', {
                  initialValue: (workTime === undefined || workTime === null) ? (
                    workTime || ''
                  ) : (moment(workTime, 'YYYY-MM-DD') || ''),
                })(<DatePicker />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="公务员登记时间" {...formItemLayout}>
              {
                getFieldDecorator('serviceTime', {
                  initialValue: (serviceTime === undefined || serviceTime === null) ? (
                    serviceTime || ''
                  ) : (moment(serviceTime, 'YYYY-MM-DD') || ''),
                })(<DatePicker />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
        <Row>
          <FormItem label="简介" {...singleFormItemLayout}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<TextArea
                autoSize={{ minRows: 4 }}
              />)
            }
          </FormItem>
        </Row>
        <Divider />
        <Row>
          <Col span={12}>
            <FormItem label="所在单位" {...formItemLayout}>
              {
                getFieldDecorator('orgId', {
                  initialValue: { label: '综合和法规科', value: 39 } || '',
                })(<DictionaryTree tree={organizationData} type="tree" dataName="orgName" labelInValue />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="统计关系所在单位" {...formItemLayout}>
              {
                getFieldDecorator('rsOrgId', {
                  initialValue: rsOrgId || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="职务名称" {...formItemLayout}>
              {
                getFieldDecorator('positionName', {
                  initialValue: positionName || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="级别" {...formItemLayout}>
              {
                getFieldDecorator('level', {
                  initialValue: level || '',
                })(<DictionaryTree tree={organizationLevelDictData} type="list" />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="现职级" {...formItemLayout}>
              {
                getFieldDecorator('rank', {
                  initialValue: rank || '',
                })(<DictionaryTree tree={currentRankDictData} type="disableParent" />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="任现职级时间" {...formItemLayout}>
              {
                getFieldDecorator('rankTime', {
                  initialValue: (rankTime === undefined || rankTime === null) ? (
                    rankTime || ''
                  ) : (moment(rankTime, 'YYYY-MM-DD') || ''),
                })(<DatePicker />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="现职务层次" {...formItemLayout}>
              {
                getFieldDecorator('positionLevel', {
                  initialValue: positionLevel || '',
                })(<DictionaryTree tree={preJobLevelDictData} type="disableParent" />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="任现职务层次时间" {...formItemLayout}>
              {
                getFieldDecorator('positionLevelTime', {
                  initialValue: (positionLevelTime === undefined || positionLevelTime === null) ? (
                    positionLevelTime || ''
                  ) : (moment(positionLevelTime, 'YYYY-MM-DD') || ''),
                })(<DatePicker />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="工作单位及职务" {...formItemLayout}>
              {
                getFieldDecorator('workName', {
                  initialValue: workName || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="工作单位及职务(简称)" {...formItemLayout}>
              {
                getFieldDecorator('workShortName', {
                  initialValue: workShortName || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12}>
            <FormItem label="最高学历" {...formItemLayout}>
              {
                getFieldDecorator('heducation', {
                  initialValue: heducation || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最高学历院校系专业" {...formItemLayout}>
              {
                getFieldDecorator('heducationMajor', {
                  initialValue: heducationMajor || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="最高学位" {...formItemLayout}>
              {
                getFieldDecorator('hdegree', {
                  initialValue: hdegree || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最高学位院校系专业" {...formItemLayout}>
              {
                getFieldDecorator('hdegreeMajor', {
                  initialValue: hdegreeMajor || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="最高全日制学历" {...formItemLayout}>
              {
                getFieldDecorator('fulltimeHeducation', {
                  initialValue: fulltimeHeducation || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最高全日制学历院校系专业" {...formItemLayout}>
              {
                getFieldDecorator('fulltimeHeducationMajor', {
                  initialValue: fulltimeHeducationMajor || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="最高全日制学位" {...formItemLayout}>
              {
                getFieldDecorator('fulltimeHdegree', {
                  initialValue: fulltimeHdegree || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最高全日制学位院校系专业" {...formItemLayout}>
              {
                getFieldDecorator('fulltimeHdegreeMajor', {
                  initialValue: fulltimeHdegreeMajor || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="最高在职学历" {...formItemLayout}>
              {
                getFieldDecorator('parttimeHeducation', {
                  initialValue: parttimeHeducation || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最高在职学历院校系专业" {...formItemLayout}>
              {
                getFieldDecorator('parttimeHeducationMajor', {
                  initialValue: parttimeHeducationMajor || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="最高在职学位" {...formItemLayout}>
              {
                getFieldDecorator('parttimeHdegree', {
                  initialValue: parttimeHdegree || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最高在职学位院校系专业" {...formItemLayout}>
              {
                getFieldDecorator('parttimeHdegreeMajor', {
                  initialValue: parttimeHdegreeMajor || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12}>
            <FormItem label="专业特长" {...formItemLayout}>
              {
                getFieldDecorator('speciality', {
                  initialValue: speciality || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="专业技术职称" {...formItemLayout}>
              {
                getFieldDecorator('professionalTitles', {
                  initialValue: professionalTitles || '',
                })(<DictionaryTree tree={professionalAndTechnicalTitleDictData} type="disableParent" />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="专业技术类公务员任职资格" {...formItemLayout}>
              {
                getFieldDecorator('civilServantQualification', {
                  initialValue: civilServantQualification || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="是否考录" {...formItemLayout}>
              {
                getFieldDecorator('isExamination', {
                  initialValue: isExamination || '',
                })(<Switch />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="是否选调生" {...formItemLayout}>
              {
                getFieldDecorator('isSelectedGraduates', {
                  initialValue: isSelectedGraduates || '',
                })(<Switch />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="具有两年以上基层工作经历" {...formItemLayout}>
              {
                getFieldDecorator('is2YearGrassroots', {
                  initialValue: is2YearGrassroots || '',
                })(<Switch />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="保留待遇" {...formItemLayout}>
              {
                getFieldDecorator('isRetainTreatment', {
                  initialValue: isRetainTreatment || '',
                })(<Switch />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="管理类别" {...formItemLayout}>
              {
                getFieldDecorator('manageCategory', {
                  initialValue: manageCategory || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="人员类别" {...formItemLayout}>
              {
                getFieldDecorator('personnelCategory', {
                  initialValue: personnelCategory || '',
                })(<DictionaryTree tree={categoryDictData} type="list" />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="编制类型" {...formItemLayout}>
              {
                getFieldDecorator('posistionCategory', {
                  initialValue: posistionCategory || '',
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="健康状况" {...formItemLayout}>
              {
                getFieldDecorator('health', {
                  initialValue: health || '',
                })(<DictionaryTree tree={healthDictData} type="list" />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="备注" {...singleFormItemLayout}>
            {
              getFieldDecorator('remark', {
                initialValue: remark || '',
              })(
                <TextArea
                  autoSize={{ minRows: 4 }}
                />)
            }
          </FormItem>
        </Row>
        {
          getFieldDecorator('id', {
            initialValue: record.id || '',
          })(<Input type="hidden" />)
        }
      </>
    )
  }

  render() {
    const {
      title,
      visible,
      record,
    } = this.props;

    return (
      <>
        <Modal
          title={title}
          width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="基础信息" key="1">
                {this.renderPersonnelBaseInfo()}
              </TabPane>
              <TabPane tab="职务信息" key="2">
                <Table
                  rowKey="id"
                  columns={this.jobInfoSubColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="职务层次与职级信息" key="3">
                <Table
                  rowKey="id"
                  columns={this.jobLevelAndJobLevelInfoSetColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="专业技术任职资格信息" key="4">
                <Table
                  rowKey="id"
                  columns={this.proAndTechnicalQualificationsColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="学历学位" key="5">
                <Table
                  rowKey="id"
                  columns={this.academicDegreeCollectionColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="奖惩信息" key="6">
                <Table
                  rowKey="id"
                  columns={this.rewardAndPunishmentInfoSetColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="考核信息" key="7">
                <Table
                  rowKey="id"
                  columns={this.appraisalInfoSetColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="退出信息" key="8">
                <Table
                  rowKey="id"
                  columns={this.exitInfoSetColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="家庭成员及社会关系信息" key="9">
                <Table
                  rowKey="id"
                  columns={this.familyMembersAndSocialRelationsInfoSetColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
              <TabPane tab="政治面貌" key="10">
                <Table
                  rowKey="id"
                  columns={this.politicCountenanceColumns}
                  size="small"
                // dataSource={data}
                />
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(RegisterAndEntryAddModal);
