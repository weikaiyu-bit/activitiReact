import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Checkbox, Tabs, message, Collapse, Upload, Table, Icon, Divider, Popconfirm, Tag, DatePicker, Switch, Button, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva';
import EditableCell from '@/pages/components/editableCell';
import DictionaryTree from '../../../components/dictionaryTree';
import WorkRecord from './archivesOtherInformation/workRecord';
import PositionLevel from './archivesOtherInformation/positionLevel';
import Rewards from './archivesOtherInformation/rewards';
import Education from './archivesOtherInformation/education';
import AnnualAppraisal from './archivesOtherInformation/annualAppraisal';
import PoliticalStatus from './archivesOtherInformation/politicalStatus';
import FamilyRelations from './archivesOtherInformation/familyRelations';
import Technical from './archivesOtherInformation/technical';
import Exit from './archivesOtherInformation/exit';
import styles from '../css/editModal.less';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const EditableContext = React.createContext();
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

@connect(({ pPersonnelFilesModel, loading }) => ({
  pPersonnelFilesModel,
  loading,
}))
class PPersonnelFilesEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    photoUrlTemp: null,
    uploading: false,
    editingKey: '',
    workRecordColumn: [],
    positionLevelColumn: [],
    rewardsColumn: [],
    educationalColumn: [],
    annualAppraisalColumn: [],
    politicalStatusColumn: [],
    familyRelationsColumn: [],
    technicalColumn: [],
    findExitColumn: [],
    rsOrg: {},
    checkFlag: false,
  };

  jobInfoSubColumns = [
    {
      title: '任职机构',
      dataIndex: 'afterOrgName',
      width: 150,
      ellipsis: true,
      editable: true,
      inputType: 'cascade',
      inputData: this.props.organizationData,
      fieldNames: { label: 'orgName', value: 'orgName', children: 'children' },
    },
    {
      title: '职务名称',
      dataIndex: 'afterPositionName',
      width: 150,
      ellipsis: true,
      editable: true,
    },
    {
      title: '是否领导职务',
      dataIndex: 'isLeader',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '是否领导成员',
      dataIndex: 'isLeaderMember',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '成员类别',
      dataIndex: 'memberCategory',
      width: 80,
      ellipsis: true,
      editable: true,
    },
    {
      title: '职务排序',
      dataIndex: 'sortNo',
      width: 80,
      ellipsis: true,
      editable: true,
    },
    {
      title: '集体内排序',
      dataIndex: 'inSortNo',
      width: 90,
      ellipsis: true,
      editable: true,
    },
    {
      title: '任职时间',
      dataIndex: 'afterServicedTime',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '任职文号',
      dataIndex: 'docNo',
      width: 80,
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a
                  onClick={() => this.saveEdit(form, record.id)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="取消后编辑内容将不会被保存" onConfirm={this.cancelEditRow}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
            <a disabled={editingKey !== ''} onClick={() => this.editRow(record.id)}>
              编辑
            </a>
          );
      },
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
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a
                  onClick={() => this.saveEdit(form, record.id)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="取消后编辑内容将不会被保存" onConfirm={this.cancelEditRow}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
            <>
              <a disabled={editingKey !== ''} onClick={() => this.editRow(record.id)}>
                编辑
            </a>
              <Divider type="vertical" />
              <Popconfirm title="您确认删除职务信息子集吗？" onConfirm={() => this.delete(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </>
          );
      },
    },
  ];
  academicDegreeCollectionColumns = [
    {
      title: '输出标识',
      dataIndex: 'outMark',
      ellipsis: true,
    },
    {
      title: '学历名称',
      dataIndex: 'educationName',
      ellipsis: true,
    },
    {
      title: '学历代码',
      dataIndex: 'educationCode',
      ellipsis: true,
    },
    {
      title: '学位名称',
      dataIndex: 'degreeName',
      ellipsis: true,
    },
    {
      title: '学位代码',
      dataIndex: 'degreeCode',
      ellipsis: true,
    },
    {
      title: '入学时间',
      dataIndex: 'enrollmentTime',
      ellipsis: true,
    },
    {
      title: '毕（肄）业时间',
      dataIndex: 'graduationTime',
      ellipsis: true,
    },
    {
      title: '学位授予时间',
      dataIndex: 'degreeTime',
      ellipsis: true,
    },
    {
      title: '学校（单位）名称',
      dataIndex: 'schoolName',
      ellipsis: true,
    },
    {
      title: '所学专业名称',
      dataIndex: 'majorName',
      ellipsis: true,
    },
    {
      title: '所学专业类别',
      dataIndex: 'majorCategory',
      ellipsis: true,
    },
    {
      title: '教育类别',
      dataIndex: 'educationCategory',
      ellipsis: true,
    },
    {
      title: '学制年限',
      dataIndex: 'schooling',
      ellipsis: true,
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
        console.log("valuesvaluesvaluesvalues", values)
        onOk({
          ...record,
          ...values,
          is2yearGrassroots: values.is2yearGrassroots.toString(),
          isExamination: values.isExamination.toString(),
          isRetainTreatment: values.isRetainTreatment.toString(),
          isSelectedGraduates: values.isSelectedGraduates.toString(),
          birth: values.birth ? moment(values.birth).format('YYYY-MM-DD HH:mm:ss') : '',
          partyTime: values.partyTime ? moment(values.partyTime).format('YYYY-MM-DD HH:mm:ss') : '',
          positionLevelTime: values.positionLevelTime ? moment(values.positionLevelTime).format('YYYY-MM-DD HH:mm:ss') : '',
          rankTime: values.rankTime ? moment(values.rankTime).format('YYYY-MM-DD HH:mm:ss') : '',
          serviceTime: values.serviceTime ? moment(values.serviceTime).format('YYYY-MM-DD HH:mm:ss') : '',
          workTime: values.workTime ? moment(values.workTime).format('YYYY-MM-DD HH:mm:ss') : '',
          health: values.health.label,
          healthId: values.health.value,
          level: values.level.label,
          rsOrgId: values.rsOrgName.value,
          rsOrgName: values.rsOrgName.lavbel,
          levelId: values.level.value,
          orgId: values.orgName.value,
          orgName: values.orgName.label,
          positionLevel: values.positionLevel.label,
          positionLevelId: values.positionLevel.values,
          professionalTitles: values.professionalTitles.label,
          professionalTitlesId: values.professionalTitles.value,
          rank: values.rank.label,
          rankId: values.rank.value,
          personnelCategory: values.personnelCategory.label,
          personnelCategoryId: values.personnelCategory.value,
          photoUrl: typeof values.photoUrl === 'string' ? values.photoUrl : values.photoUrl.file.response.data
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  setEditModalState = object => {
    this.setState(object);
  };

  TabsOnChange = activeKey => {
    const {
      findWorkRecord,
      record,
      findPositionLevel,
      findTechnicalQualification,
      findEducational,
      findRewardsPunishments,
      findAnnualAppraisalNarrative,
      findExitInfo,
      findPoliticalStatus,
      findFamilyRelations,
    } = this.props;
    this.setState({ editingKey: '' })
    switch (activeKey) {
      case '2':
        findWorkRecord({ fileId: record.id, outMark: '1' }, response => {
          this.setState({ workRecordColumn: response.data });
        });
        break;
      case '3':
        findPositionLevel({ fileId: record.id }, response => {
          this.setState({ positionLevelColumn: response.data });
        });
        break;
      case '4':
        findTechnicalQualification({ fileId: record.id }, response => {
          this.setState({ technicalColumn: response.data })
        });
        break;
      case '5':
        findEducational({ fileId: record.id }, response => {
          this.setState({ educationalColumn: response.data });
        });
        break;
      case '6':
        findRewardsPunishments({ fileId: record.id }, response => {
          this.setState({ rewardsColumn: response.data });
        });
        break;
      case '7':
        findAnnualAppraisalNarrative({ fileId: record.id }, response => {
          this.setState({ annualAppraisalColumn: response.data });
        });
        break;
      case '8':
        findExitInfo({ fileId: record.id }, response => {
          this.setState({ findExitColumn: response.data });
        });
        break;
      case '9':
        findFamilyRelations({ fileId: record.id }, response => {
          this.setState({ familyRelationsColumn: response.data });
        });
        break;
      case '10':
        findPoliticalStatus({ fileId: record.id }, response => {
          this.setState({ politicalStatusColumn: response.data });
        });
        break;
      default:
        break;
    }
  };

  handleUploadChange = info => {
    if (info.file.status === 'uploading') {
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

  isEditing = record => record.id === this.state.editingKey;

  editRow = key => {
    this.setState({ editingKey: key });
  };

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

  onchangeOrganization = item => {
    const {  orgData } = this.props;
    let FilterId = this.findOrg(item, orgData, "value");
    let rsOrg = this.findOrgs(FilterId, orgData, "pid");
    this.setState({ rsOrg })
    this.props.form.setFieldsValue({ 'rsOrgName': { ...rsOrg } })
  }

  findOrg = (item, tree, key) => {
    let data = [];
    for (let i = 0; i < tree.length; i++) {
      if (item[key] == tree[i].id) {
        return tree[i];
      }
    }
  }

  findOrgs = (item, tree, key) => {

    let data = {};
    for (let i = 0; i < tree.length; i++) {
      if (item[key] == tree[i].id) {
        data = { label: tree[i].orgName, value: tree[i].id };
        return data;
      } else {
        data = { label: item.orgName, value: item.id }
      }
    }
    return data;
  }

  renderState = state => {
    switch (state) {
      case '未入职':
        return <Tag color="orange">{state}</Tag>;
      case '入职':
        return <Tag style={{ width: '100%' }} color="#2db7f5">{state}</Tag>;
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
  };

  renderPersonnelBaseInfo = () => {
    const {
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
      rsOrgName,
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
      levelId,
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
      professionalTitlesId,
      civilServantQualification,
      speciality,
      isExamination,
      isSelectedGraduates,
      is2yearGrassroots,
      isRetainTreatment,
      manageCategory,
      personnelCategory,
      personnelCategoryId,
      posistionCategory,
      health,
      healthId,
      state,
      resume,
      photoUrl,
      remark,
      nationalId,
      rankId,
      orgName
    } = record;

    const { checkFlag } = this.state;
    return (
      <>
        <Collapse
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        >
          <Panel header="基础信息" key="1">
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
                <FormItem label="状态" {...formItemLayout}>
                  {
                    getFieldDecorator('state', {
                      initialValue: state || '',
                    })(this.renderState(state))
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
                    })(<DatePicker style={{ width: '100%' }} />)
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
                <FormItem label="民族" {...formItemLayout}>
                  {
                    getFieldDecorator('national', {
                      initialValue: national || '',
                    })(<DictionaryTree tree={nationDictData} type="list" />)
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
                    })(<DatePicker style={{ width: '100%' }} />)
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
                    })(<DatePicker style={{ width: '100%' }} />)
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
                    })(<DatePicker style={{ width: '100%' }} />)
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

          </Panel>
          <Divider />

          <Panel header="单位信息" key="2">
            <Row>
              <Col span={12}>
                <FormItem label="所在单位" {...formItemLayout}>
                  {
                    getFieldDecorator('orgName', {
                      initialValue: { label: record['orgName'] || '', value: record['orgId'] | '' }
                    })(<DictionaryTree tree={organizationData} type="tree" dataName="orgName" labelInValue="1" onChange={this.onchangeOrganization} />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="统计关系所在单位" {...formItemLayout}>
                  {
                    getFieldDecorator('rsOrgName', {
                      initialValue: { label: record['rsOrgName'] || '', value: record['rsOrgId'] | '' }
                    })(<DictionaryTree width="91%" tree={organizationData} type="tree" disabled={!checkFlag} dataName="orgName" labelInValue='1' />)
                  }
                  <Checkbox defaultChecked={false} className={styles.Checkbox} onChange={params => { this.setState({ checkFlag: params.target.checked }) }} />
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
                      initialValue: { label: record['level'] || '', value: record['levelId'] | '' }
                    })(<DictionaryTree tree={organizationLevelDictData} type="list" labelInValue='1' />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="现职级" {...formItemLayout}>
                  {
                    getFieldDecorator('rank', {
                      initialValue: { label: record['rank'] || '', value: record['rankId'] | '' }
                    })(<DictionaryTree tree={currentRankDictData} type="disableParent" labelInValue='1' />)
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
                    })(<DatePicker style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="现职务层次" {...formItemLayout}>
                  {
                    getFieldDecorator('positionLevel', {
                      initialValue: { label: record['positionLevel'] || '', value: record['positionLevelId'] | '' }
                    })(<DictionaryTree tree={preJobLevelDictData} type="disableParent" labelInValue="1" />)
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
                    })(<DatePicker style={{ width: '100%' }} />)
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

          </Panel>
          <Divider />

          <Panel header="学籍信息" key="3">
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
          </Panel>
          <Divider />

          <Panel header="其他信息" key="4">
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
                <FormItem label="管理类别" {...formItemLayout}>
                  {
                    getFieldDecorator('manageCategory', {
                      initialValue: manageCategory || '',
                    })(<Input />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="专业技术职称" {...formItemLayout}>
                  {
                    getFieldDecorator('professionalTitles', {
                      initialValue: { label: record['professionalTitles'] || '', value: record['professionalTitlesId'] || '' }
                    })(<DictionaryTree tree={professionalAndTechnicalTitleDictData} type="disableParent" labelInValue="1" />)
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
                    })(<Switch defaultChecked={isExamination === 'true' ? true : false} />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="是否选调生" {...formItemLayout}>
                  {
                    getFieldDecorator('isSelectedGraduates', {
                      initialValue: isSelectedGraduates || '',
                    })(<Switch defaultChecked={isSelectedGraduates === 'true' ? true : false} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="具有两年以上基层工作经历" {...formItemLayout}>
                  {
                    getFieldDecorator('is2yearGrassroots', {
                      initialValue: is2yearGrassroots || '',
                    })(<Switch defaultChecked={is2yearGrassroots === 'true' ? true : false} />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="保留待遇" {...formItemLayout}>
                  {
                    getFieldDecorator('isRetainTreatment', {
                      initialValue: isRetainTreatment || '',
                    })(<Switch defaultChecked={isRetainTreatment === 'true' ? true : false} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="人员类别" {...formItemLayout}>
                  {
                    getFieldDecorator('personnelCategory', {
                      initialValue: { label: record['personnelCategory'] || '', value: record['personnelCategoryId'] || '' }
                    })(<DictionaryTree tree={categoryDictData} type="list" labelInValue="1" />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="健康状况" {...formItemLayout}>
                  {
                    getFieldDecorator('health', {
                      initialValue: { label: record['health'] || '', value: record['healthId'] || '' }
                    })(<DictionaryTree tree={healthDictData} type="list" labelInValue='1' />)
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
          </Panel>
        </Collapse>,
      </>
    )
  };


  render() {
    const { editingKey, workRecordColumn, positionLevelColumn, rewardsColumn, educationalColumn,
      annualAppraisalColumn, politicalStatusColumn, familyRelationsColumn, technicalColumn, findExitColumn } = this.state;
    const {
      pPersonnelFilesModel: {
        listTechnicalQualificationData, listEducationalData, rewardsPunishmentsData,
        annualAppraisalNarrativeData, listExitData, listPoliticalStatusData, familyRelationsData,
      },
      loading: { effects },
      title,
      visible,
      organizationData,
      findWorkRecord,
      findPositionLevel,
      findRewardsPunishments,
      findEducational,
      findAnnualAppraisalNarrative,
      record,
      rewardPunishmentCodeDictData,
      natureAgencyDictData,
      preJobLevelDictData,
      currentRankDictData,
      organizationLevelDictData,
      educationCategoryDictData,
      educationCodeDictData,
      degreeCodeDictData,
      majorCategoryDictData,
      assessmentConclusionDictData,
      findPoliticalStatus,
      findFamilyRelations,
      findTechnicalQualification,
      professionalAndTechnicalTitleDictData,
      accessQualificationDictData,
      findExitInfo,
      exitModeDictData,
      categoryDictData,
      memberCategoryData,
      appellationDictData,
      politicalOutlookDictData
    } = this.props;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const workRecordData = {
      components,
      editingKey,
      workRecordColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      organizationData,
      findWorkRecord,
      personnelInfo: record,
      categoryDictData,
      memberCategoryData
    };

    const PositionLevelData = {
      components,
      editingKey,
      positionLevelColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findPositionLevel,
      personnelInfo: record,
      preJobLevelDictData,
      currentRankDictData
    };

    const rewardsData = {
      components,
      editingKey,
      rewardsColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findRewardsPunishments,
      personnelInfo: record,
      rewardPunishmentCodeDictData,// 奖惩名称代码
      natureAgencyDictData, //机关性质
      preJobLevelDictData, //现职务层次
      organizationLevelDictData,//机构级别
    }

    const timeData = [
      { id: '2010', dataName: '2010' },
      { id: '2011', dataName: '2011' },
      { id: '2012', dataName: '2012' },
      { id: '2013', dataName: '2013' },
      { id: '2014', dataName: '2014' },
      { id: '2015', dataName: '2015' },
      { id: '2016', dataName: '2016' },
      { id: '2017', dataName: '2017' },
      { id: '2018', dataName: '2018' },
      { id: '2019', dataName: '2019' },
      { id: '2020', dataName: '2020' },
      { id: '2021', dataName: '2021' },
      { id: '2022', dataName: '2022' },
      { id: '2023', dataName: '2023' },
      { id: '2024', dataName: '2024' },
      { id: '2025', dataName: '2025' },
      { id: '2026', dataName: '2026' },
      { id: '2027', dataName: '2027' },
      { id: '2028', dataName: '2028' },
      { id: '2029', dataName: '2029' },
      { id: '2030', dataName: '2030' },
    ];

    // 
    const politicalStatusData = {
      components,
      editingKey,
      politicalStatusColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findPoliticalStatus,
      personnelInfo: record,
      politicalOutlookDictData
    }

    const annualAppraisalData = {
      components,
      editingKey,
      annualAppraisalColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findAnnualAppraisalNarrative,
      personnelInfo: record,
      timeData: timeData,
      assessmentConclusionDictData,//考核结论
    }


    const educationData = {
      components,
      editingKey,
      educationalColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findEducational,
      personnelInfo: record,
      educationCategoryDictData,
      educationCodeDictData,
      degreeCodeDictData,
      majorCategoryDictData,
    }

    const findFamilyRelationsData = {
      components,
      editingKey,
      familyRelationsColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findFamilyRelations,
      personnelInfo: record,
      appellationDictData
    }

    const technicalData = {
      components,
      editingKey,
      technicalColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findTechnicalQualification,
      personnelInfo: record,
      professionalAndTechnicalTitleDictData,
      accessQualificationDictData
    }
    const exitData = {
      components,
      editingKey,
      findExitColumn,
      setEditModalState: this.setEditModalState,
      isEditing: this.isEditing,
      editRow: this.editRow,
      findExitInfo,
      personnelInfo: record,
      exitModeDictData
    }
    return (
      <>
        <Modal
          title={title}
          width={1100}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <Tabs defaultActiveKey="1" onChange={this.TabsOnChange}>
              <TabPane tab="基础信息" key="1">
                {this.renderPersonnelBaseInfo()}
              </TabPane>
              <TabPane tab="职务信息" key="2">
                <WorkRecord {...workRecordData} />
              </TabPane>
              <TabPane tab="职务层次与职级信息" key="3">
                <PositionLevel {...PositionLevelData} />
              </TabPane>
              <TabPane tab="专业技术任职资格信息" key="4">
                <Technical {...technicalData} />
              </TabPane>
              <TabPane tab="学历学位" key="5">
                <Education {...educationData} />
              </TabPane>
              <TabPane tab="奖惩信息" key="6">
                <Rewards {...rewardsData} />
              </TabPane>
              <TabPane tab="考核信息" key="7">
                <AnnualAppraisal {...annualAppraisalData} />
              </TabPane>
              <TabPane tab="退出信息" key="8">
                <Exit {...exitData} />
              </TabPane>
              <TabPane tab="家庭成员及社会关系信息" key="9">
                <FamilyRelations {...findFamilyRelationsData} />
              </TabPane>
              <TabPane tab="政治面貌" key="10">
                <PoliticalStatus {...politicalStatusData} />
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PPersonnelFilesEditModal);
