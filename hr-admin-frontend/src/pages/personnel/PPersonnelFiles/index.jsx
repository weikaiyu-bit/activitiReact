import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Icon, Tree, Dropdown, Tag, Menu } from 'antd';

import moment from 'moment'
import {
  DownOutlined,
} from '@ant-design/icons';
import utils from '@/dtsea/common/utils';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import PPersonnelFilesViewDrawer from './components/viewDrawer';
import PPersonnelFilesSearchBar from './components/searchBar';
import PPersonnelFilesSearchNameOrIdCardModal from './components/searchNameOrIdCardModal';
import PPersonnelFilesSearchOrgModal from './components/searchOrgModal';
import PersonnelSummaryCard from '../components/personnelSummaryCard';
import AddModal from './components/addModal'
import EditModal from './components/editModal'
import styles from './css/index.less'

const { TreeNode } = Tree;
const batchMenu = (
  <Menu>
    <Menu.Item>
      <a>
        任免审批表
      </a>
    </Menu.Item>
    <Menu.Item>
      <a>
        公务员职级套转表
      </a>
    </Menu.Item>
    <Menu.Item>
      <a>
        参公人员职级套转表
      </a>
    </Menu.Item>
    <Menu.Item>
      <a>
        公务员职级晋升表
      </a>
    </Menu.Item>
  </Menu>
);
@connect(({ pPersonnelFilesModel, loading }) => ({
  pPersonnelFilesModel,
  loading,
}))
class PPersonnelFilesIndex extends Component {
  state = {
    expandList: true,
    tabKey: 'byList',
    // orgKey: 'byOrg',
    selectedRowKeys: [],
    filter: {},
    orgs: {},
    pageNumber: 1,
    orgNames: '', // 所在单位
    pageSize: 20,
    viewData: {},
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
      data: {},
    },
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
    SICvisible: false,
    SOrgvisible: false,
    // SOTvisible: false,
    // SCSMvisible: false,
    organizationLevelDictData: [],
    healthDictData: [],
    professionalAndTechnicalTitleDictData: [],
    preJobLevelDictData: [],
    currentRankDictData: [],
    nationDictData: [],
    categoryDictData: [],
    organizationData: [],
    accessQualificationDictData: [],
    educationCodeDictData: [],
    degreeCodeDictData: [],
    educationCategoryDictData: [],
    rewardPunishmentCodeDictData: [],
    natureAgencyDictData: [],
    assessmentConclusionDictData: [],
    exitModeDictData: [],
    appellationDictData: [],
    politicalOutlookDictData: [],
    majorCategoryDictData: [],
    // descriptionData: [],//在任免审批表（该数据在无拟任免中使用）  奖惩描述
    memberCategoryData: []
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      ellipsis: true,
      align: 'center',
      width: 60,
      fixed: 'left',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      align: 'center',
      width: 40,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      ellipsis: true,
      width: 130,
      align: 'center',
    },
    {
      title: '民族',
      dataIndex: 'national',
      ellipsis: true,
      align: 'center',
      width: 50,
    },
    {
      title: '所在单位',
      dataIndex: 'orgId',
      ellipsis: true,
      width: 200,
      render: (text, record) => {
        const { pPersonnelFilesModel: { orgData } } = this.props;
        if (orgData != null) {
          for (let i = 0; i < orgData.length; i += 1) {
            if (orgData[i].id === text) {
              for (let j = 0; j < orgData.length; j += 1) {
                if (orgData[j].id === record.rsOrgId && orgData[j].id !== orgData[i].id) {
                  return <>{orgData[j].orgName}{orgData[i].orgName}</>;
                }
                if (orgData[j].id === orgData[i].id) {
                  return <>{orgData[i].orgName}</>;
                }
              }
            }
          }
        }
      },
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
      ellipsis: true,
      align: 'center',
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '籍贯',
      dataIndex: 'nativePlace',
      ellipsis: true,
      width: 130,
    },
    {
      title: '出生地',
      dataIndex: 'birthplace',
      ellipsis: true,
      width: 130,
    },
    {
      title: '参加工作时间',
      dataIndex: 'workTime',
      ellipsis: true,
      align: 'center',
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '入党时间',
      dataIndex: 'partyTime',
      ellipsis: true,
      width: 120,
      align: 'center',
      render: text => this.renderDate(text),
    },
    {
      title: '公务员登记时间',
      dataIndex: 'serviceTime',
      ellipsis: true,
      width: 120,
      align: 'center',
      render: text => this.renderDate(text),
    },
    {
      title: '人员状态',
      dataIndex: 'state',
      ellipsis: true,
      width: 80,
      align: 'center',
      render: (text, data) => {
        switch (data.state) {
          case '未入职':
            return <Tag style={{ width: '64px' }} color="orange">{data.state}</Tag>;
          case '入职':
            return <Tag style={{ width: '64px' }} color="lime">{data.state}</Tag>;
          case '在职':
            return <Tag style={{ width: '64px' }} color="cyan">{data.state}</Tag>;
          case '职位变动':
            return <Tag style={{ width: '64px' }} color="hotpink">{data.state}</Tag>;
          case '提拔':
            return <Tag style={{ width: '64px' }} color="blue">{data.state}</Tag>;
          case '退休':
            return <Tag style={{ width: '64px' }} color="magenta">{data.state}</Tag>;
          case '调动':
            return <Tag style={{ width: '64px' }} color="hotpink">{data.state}</Tag>;
          case '辞职':
            return <Tag style={{ width: '64px' }} color="magenta">{data.state}</Tag>;
          case '辞退':
            return <Tag style={{ width: '64px' }} color="red">{data.state}</Tag>;
          case '现职人员':
            return <Tag style={{ width: '64px' }} color="purple">{data.state}</Tag>;
          default:
            return <Tag style={{ width: '64px' }} >{text}</Tag>;
        }
      },
    },
    {
      title: '最高学历',
      dataIndex: 'heducation',
      ellipsis: true,
      width: 70,
      align: 'center',
    },
    {
      title: '专业技术类公务员任职资格',
      dataIndex: 'civilServantQualification',
      ellipsis: true,
      width: 100,
      align: 'center',
    },
    {
      title: '专长',
      dataIndex: 'speciality',
      ellipsis: true,
      width: 80,
      align: 'center',
    },
    {
      title: '健康状况',
      dataIndex: 'health',
      ellipsis: true,
      align: 'center',
      width: 70,
    },
    {
      title: '管理类别',
      dataIndex: 'manageCategory',
      ellipsis: true,
      width: 100,
      align: 'center',
    },
    {
      title: '人员类别',
      dataIndex: 'personnelCategory',
      ellipsis: true,
      width: 150,
    },
    {
      title: '编制类型',
      dataIndex: 'posistionCategory',
      ellipsis: true,
      width: 150,
    },
    {
      title: '统计关系所在单位',
      dataIndex: 'rsOrgId',
      ellipsis: true,
      width: 180,
      render: text => {
        const { pPersonnelFilesModel: { orgData } } = this.props;
        if (orgData != null) {
          for (let i = 0; i < orgData.length; i += 1) {
            if (orgData[i].id === text) {
              return <>{orgData[i].orgName}</>;
            }
          }
        }
        return '';
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除人事档案信息吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
      ellipsis: true,
      width: 100,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    this.findOrg({
      tenantId: 5,
    }, response => {
      if (response.code === ErrorCode.SUCCESS) {
        this.setState({
          organizationData: utils.dataToTree(response.data),
        });
      }
    });
    // 人员类别:99 民族:97 专业技术职称:29 健康状况:28 先职务层次:95 现职级:96 机构级别:16  获取资格途径:88 学历代码:90 学位代码:91 教育类别:89
    // 奖惩名称代码:94  受惩罚时职务层次：95 机关性质:109  考核结论:110  退出方式:111  称谓:98 政治面貌:100
    // 教育类别：89     专业代码 92   获得资格途径：88   成员类别：112
    this.findDictData({
      dataIds: [16, 28, 29, 88, 89, 90, 91, 92, 94, 95, 96, 97, 98, 99, 100, 109, 110, 111, 112],
    }, response => {
      if (response.code === ErrorCode.SUCCESS) {
        const organizationLevel = [];
        const health = [];
        const professionalAndTechnicalTitle = [];
        const preJobLevel = [];
        const currentRank = [];
        const nation = [];
        const category = [];
        const accessQualification = [];
        const educationCode = [];
        const degreeCode = [];
        const educationCategory = [];
        const rewardPunishmentCode = [];
        const natureAgency = [];
        const assessmentConclusion = [];
        const exitMode = [];
        const appellation = [];
        const politicalOutlook = [];
        const majorCategory = [];
        const memberCategory = [];
        response.data.forEach(item => {
          switch (item.dataId) {
            case 16: // 机构级别
              organizationLevel.push(item);
              break;
            case 28: // 健康状况
              health.push(item);
              break;
            case 29: // 专业技术职称
              professionalAndTechnicalTitle.push(item);
              break;
            case 95: // 现职务层次
              preJobLevel.push(item);
              break;
            case 96: // 现职级
              currentRank.push(item);
              break;
            case 97: // 民族
              nation.push(item);
              break;
            case 99: // 人员类别
              category.push(item);
              break;
            case 88: // 获取资格途径
              accessQualification.push(item);
              break;
            case 90: // 学历代码
              educationCode.push(item);
              break;
            case 91: // 学位代码
              degreeCode.push(item);
              break;
            case 92: // 专业类别
              majorCategory.push(item);
              break;
            case 89: // 教育类别
              educationCategory.push(item);
              break;
            case 94: // 奖惩名称代码
              rewardPunishmentCode.push(item);
              break;
            case 109: // 机关性质
              natureAgency.push(item);
              break;
            case 110: // 考核结论
              assessmentConclusion.push(item);
              break;
            case 111: // 退出方式
              exitMode.push(item);
              break;
            case 98: // 称谓
              appellation.push(item);
              break;
            case 100: // 政治面貌
              politicalOutlook.push(item);
              break;
            case 112: // 政治面貌
              memberCategory.push(item);
              break;
            default:
              break;
          }
        });
        this.setState({
          organizationLevelDictData: organizationLevel,
          healthDictData: health,
          professionalAndTechnicalTitleDictData: utils.dataToTree(professionalAndTechnicalTitle),
          preJobLevelDictData: utils.dataToTree(preJobLevel),
          currentRankDictData: utils.dataToTree(currentRank),
          nationDictData: nation,
          categoryDictData: category,
          accessQualificationDictData: accessQualification,
          educationCodeDictData: utils.dataToTree(educationCode),
          degreeCodeDictData: utils.dataToTree(degreeCode),
          educationCategoryDictData: educationCategory,
          rewardPunishmentCodeDictData: utils.dataToTree(rewardPunishmentCode),
          natureAgencyDictData: utils.dataToTree(natureAgency),
          assessmentConclusionDictData: utils.dataToTree(assessmentConclusion),
          exitModeDictData: exitMode,
          appellationDictData: appellation,
          politicalOutlookDictData: politicalOutlook,
          majorCategoryDictData: utils.dataToTree(majorCategory),
          memberCategoryData: memberCategory
        });
      }
    });
  }

  renderDate = text => ((text) ? moment(text).format('YYYY年MM月DD日') : '');

  // 获取人员状态信息
  findStatus = groupId => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchStatus`,
      payload: { groupId },
    });
  };

  findOrg = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchOrg',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findDictData = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamDictDataModel/fetch',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findWorkRecord = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchListWorkRecord',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findPositionLevel = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchListPositionLevel',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findTechnicalQualification = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchTechnicalQualification',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findEducational = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchEducationalByPage',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      }
    });
  };

  findRewardsPunishments = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchRewardsPunishments',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  findAnnualAppraisalNarrative = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchAnnualAppraisalNarrative',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      }
    });
  };

  findExitInfo = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchExit',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      }
    });
  };

  findPoliticalStatus = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchPoliticalStatus',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response)
      }
    });
  };

  findFamilyRelations = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchFamilyRelations',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response)
      }
    });
  };

  showAddModal = () => {
    const {
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
      // 单位列表
      organizationData,
      // 获取资格途径
      accessQualificationDictData,
      // 学历代码
      educationCodeDictData,
      // 学位代码
      degreeCodeDictData,
      // 教育类别
      educationCategoryDictData,
      // 奖惩名称代码
      rewardPunishmentCodeDictData,
      // 机关性质
      natureAgencyDictData,
      // 考核结论
      assessmentConclusionDictData,
      // 退出方式
      exitModeDictData,
      // 称谓
      appellationDictData,
      // 政治面貌
      politicalOutlookDictData,
      // 成员类别
      memberCategoryData,
      majorCategoryDictData,
    } = this.state;
    const {
      pPersonnelFilesModel: { tree, orgData },
    } = this.props;

    this.setState({
      addData: {
        title: '新建人事档案信息',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.update,
        onClose: this.hideAddModal,
        findWorkRecord: this.findWorkRecord,
        findPositionLevel: this.findPositionLevel,
        findTechnicalQualification: this.findTechnicalQualification,
        findEducational: this.findEducational,
        findRewardsPunishments: this.findRewardsPunishments,
        findAnnualAppraisalNarrative: this.findAnnualAppraisalNarrative,
        findExitInfo: this.findExitInfo,
        findPoliticalStatus: this.findPoliticalStatus,
        findFamilyRelations: this.findFamilyRelations,
        tree,
        orgData,
        organizationLevelDictData,
        healthDictData,
        professionalAndTechnicalTitleDictData,
        preJobLevelDictData,
        currentRankDictData,
        nationDictData,
        categoryDictData,
        organizationData,
        accessQualificationDictData,
        educationCodeDictData,
        degreeCodeDictData,
        educationCategoryDictData,
        rewardPunishmentCodeDictData,
        natureAgencyDictData,
        assessmentConclusionDictData,
        exitModeDictData,
        appellationDictData,
        politicalOutlookDictData,
        majorCategoryDictData,
        memberCategoryData
      },
    });
  };

  showEditModal = record => {
    const {
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
      // 单位列表
      organizationData,
      // 获取资格途径
      accessQualificationDictData,
      // 学历代码
      educationCodeDictData,
      // 学位代码
      degreeCodeDictData,
      // 教育类别
      educationCategoryDictData,
      // 奖惩名称代码
      rewardPunishmentCodeDictData,
      // 机关性质
      natureAgencyDictData,
      // 考核结论
      assessmentConclusionDictData,
      // 退出方式
      exitModeDictData,
      // 称谓
      appellationDictData,
      // 政治面貌
      politicalOutlookDictData,
      // 成员类别
      memberCategoryData,
      majorCategoryDictData,
    } = this.state;
    const {
      pPersonnelFilesModel: { tree, orgData },
    } = this.props;

    this.setState({
      editData: {
        title: '编辑人事档案信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
        findWorkRecord: this.findWorkRecord,
        findPositionLevel: this.findPositionLevel,
        findTechnicalQualification: this.findTechnicalQualification,
        findEducational: this.findEducational,
        findRewardsPunishments: this.findRewardsPunishments,
        findAnnualAppraisalNarrative: this.findAnnualAppraisalNarrative,
        findExitInfo: this.findExitInfo,
        findPoliticalStatus: this.findPoliticalStatus,
        findFamilyRelations: this.findFamilyRelations,
        tree,
        orgData,
        organizationLevelDictData,
        healthDictData,
        professionalAndTechnicalTitleDictData,
        preJobLevelDictData,
        currentRankDictData,
        nationDictData,
        categoryDictData,
        organizationData,
        accessQualificationDictData,
        educationCodeDictData,
        degreeCodeDictData,
        educationCategoryDictData,
        rewardPunishmentCodeDictData,
        natureAgencyDictData,
        assessmentConclusionDictData,
        exitModeDictData,
        appellationDictData,
        politicalOutlookDictData,
        majorCategoryDictData,
        memberCategoryData
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
  /** ****************************************************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    const { orgNames } = this.state;
    dispatch({
      type: 'pPersonnelFilesModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
        orgNames,
      },
      callback: response => {
      }
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/add',
      payload: values,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建人事档案信息成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  update = (values) => {
    const { dispatch } = this.props;
    const payload = { ...values };
    dispatch({
      type: 'pPersonnelFilesModel/update',
      payload,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改人事档案信息成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  delete = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除人事档案信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除人事档案信息失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
    });
    console.log("record", record)
  };

  hideDrawer = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  showSearchModal = e => {
    switch (e) {
      case 'SIC':
        this.setState({
          SICvisible: true,
        });
        break;
      case 'SOrg':
        this.setState({
          SOrgvisible: true,
        });
        break;
      // case 'SOT':
      //   this.setState({
      //     SOTvisible: true,
      //   });
      //   break;
      // case 'SCSM':
      //   this.setState({
      //     SCSMvisible: true,
      //   });
      //   break;
      default:
        break;
    }
  }

  closeSearchModal = e => {
    switch (e) {
      case 'SIC':
        this.setState({
          SICvisible: false,
        });
        break;
      case 'SOrg':
        this.setState({
          SOrgvisible: false,
        });
        break;
      // case 'SOT':
      //   this.setState({
      //     SOTvisible: false,
      //   });
      //   break;
      // case 'SCSM':
      //   this.setState({
      //     SCSMvisible: false,
      //   });
      //   break;
      default:
        break;
    }
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

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys, selectedKeys: [] });
    if (checkedKeys.length !== 0) {
      const { pageNumber, pageSize } = this.state;
      let orgIds = [];
      checkedKeys.map(item => {
        orgIds.push(Number(item));
      })
      this.findPage(pageNumber, pageSize, { orgIds });
    }
  };

  // 获取集团ID
  getRoot = pid => {
    const { data } = this.props.pPersonnelFilesModel;
    for (let i = 0; i < data.length; i += 1) {
      if (pid === data[i].id) {
        return data[i].pid;
      }
    }
    return null;
  };

  // 选中左侧树状菜单,展示数据并存储集团ID
  onSelect = (selectedKeys, info) => {
    const dataRef = info.node.props.dataRef;
    // let orgIds = []; //点击结构树目录查询自身以及底下所有人员 暂存
    // this.ergodicTree(dataRef, orgIds); //点击结构树目录查询自身以及底下所有人员 暂存
    this.setState(
      {
        selectedKeys,
        pageNumber: 1,
        // orgNames,
        checkedKeys: [],
      },
      () => {
        const { pageNumber, pageSize } = this.state;
        if (info.selected) {
          this.findPage(pageNumber, pageSize, { orgIds: [dataRef.id] });
        } else {
          this.setState({
          })
          this.findPage(pageNumber, pageSize, { orgIds: [dataRef.id] });
        }
      },
    );
  };

  // ergodicTree = (dataRef, orgIds) => { //点击结构树目录查询自身以及底下所有人员 暂存
  //   orgIds.push(dataRef.id)
  //   if (dataRef.children) {
  //     dataRef.children.map(item => {
  //       this.ergodicTree(item, orgIds);
  //     })
  //   }
  // };
  handleTabChange = tabKey => {
    this.setState({
      tabKey,
    });
  };

  // //////////////////////////////////////////////////////////////////////////////////

  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.orgName.indexOf(searchValue);
      const beforeStr = item.orgName.substr(0, index);
      const afterStr = item.orgName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.orgName}</span>
          );
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id} dataRef={item} />;
    });
    return newTree;
  };

  renderOrganizationTree() {
    const {
      pPersonnelFilesModel: { tree },
    } = this.props;
    return (
      <Tree
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkable
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
        {this.renderTreeNodes(tree)}
      </Tree>
    );
  }

  renderPersonnelFiles() {
    const { pageNumber, pageSize, selectedRowKeys, tabKey } = this.state;
    let catgPer = {};
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading: { effects },
      pPersonnelFilesModel: { data, total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    if (tabKey === 'byList') {
      catgPer = (
        <Table
          rowKey="id"
          loading={effects['pPersonnelFilesModel/fetch']}
          columns={this.columns}
          dataSource={data}
          pagination={paginationProps}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          bordered
          size="middle"
          scroll={{ x: 1300, y: 650 }}
        />
        // </div>
      );
    }
    if (tabKey === 'byCard') {
      catgPer = (
        <PersonnelSummaryCard dataSource={data} />
      );
    }
    return catgPer;
  }

  renderAdvancedList() {
    const { pageNumber, pageSize, expandList, selectedRowKeys, addData, editData } = this.state;
    const {
      form,
      pPersonnelFilesModel: { total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const DictData = {
      form,
      pagination: paginationProps,
      onFind: this.findPage,
      findDictData: this.findDictData,
      toggleForms: this.toggleForm,
      expandList,
    };

    return (
      <>
        <div style={{ width: '15%', height: 863, float: 'left', marginRight: '1%' }} >
          <Card style={{ height: 863, overflow: 'hidden', textOverflow: 'ellipsis' }} hoverable>
            {this.renderOrganizationTree()}
          </Card>
        </div>
        <div style={{ width: '84%', height: 863, float: 'left' }}>
          <Card style={{ height: 863, overflow: 'auto' }} hoverable>
            <div>
              <div style={{ marginBottom: '2px' }}>
                <PPersonnelFilesSearchBar {...DictData} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ marginBottom: '2px', marginRight: '8px' }}>
                  <Button icon="plus" type="primary" onClick={this.showAddModal} style={{ marginRight: '8px' }}>
                    新建档案
                  </Button>
                  <Button style={{ marginRight: 12 }}>人员查重</Button>
                  <Button style={{ marginRight: 12 }}>数据校核</Button>
                  <Button icon="import" style={{ marginRight: 12 }}>导入</Button>
                  <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
                </span>
                <span style={{ float: 'right' }}>
                  <Button type="link" icon="ordered-list" style={{ marginRight: 12 }} onClick={() => this.handleTabChange('byList')}>按列表</Button>
                  <Button type="link" icon="idcard" style={{ marginRight: 12 }} onClick={() => this.handleTabChange('byCard')}>按卡片</Button>
                </span>
                {selectedRowKeys.length > 0 ? (
                  <>
                    <span>
                      <Popconfirm title="您确认需要批量删除人事档案信息吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                        <Button icon="delete">批量删除</Button>
                      </Popconfirm>
                    </span>
                    <span style={{ marginLeft: '16px' }}>
                      <Dropdown overlay={batchMenu}>
                        <Button>
                          批处理 <DownOutlined />
                        </Button>
                      </Dropdown>
                    </span>
                  </>
                ) : (
                    ''
                  )}
              </div>
              {this.renderPersonnelFiles()}
            </div>
          </Card>

        </div>
      </ >
    );
  }

  renderSimpleList() {
    const { pageNumber, pageSize, selectedRowKeys } = this.state;
    const {
      form,
      pPersonnelFilesModel: { total, tree },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      pageSizeOptions: 20,
      defaultPageSize: 20,
      total,
    };
    const DictData = {
      form,
      pagination: paginationProps,
      onFind: this.findPage,
      findDictData: this.findDictData,
      toggleForms: this.toggleForm,
    };

    return (
      <Card>
        <div>
          <div style={{ marginBottom: '8px' }}>
            <PPersonnelFilesSearchBar {...DictData} />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ marginBottom: '8px', marginRight: '8px' }}>
              <Button icon="plus" type="primary" onClick={this.showAddModal} style={{ marginRight: '8px' }}>
                新建档案
              </Button>
              <Button style={{ marginRight: '8px' }}>人员查重</Button>
              <Button style={{ marginRight: '8px' }}>数据校核</Button>
              <Button icon="import" style={{ marginRight: 12 }}>导入</Button>
              <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
            </span>
            {selectedRowKeys.length > 0 ? (
              <>
                <span>
                  <Popconfirm title="您确认需要批量删除人事档案信息吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete">批量删除</Button>
                  </Popconfirm>
                </span>
                <span style={{ marginLeft: '16px' }}>
                  <Dropdown overlay={batchMenu}>
                    <Button>
                      批处理 <DownOutlined />
                    </Button>
                  </Dropdown>
                </span>
              </>
            ) : (
                ''
              )}
          </div>
          {this.renderPersonnelFiles()}
        </div>
      </Card>
    );
  }

  render() {
    const {
      organizationLevelDictData,
      healthDictData,
      professionalAndTechnicalTitleDictData,
      preJobLevelDictData,
      currentRankDictData,
      nationDictData,
      categoryDictData,
      organizationData,
      accessQualificationDictData,
      educationCodeDictData,
      degreeCodeDictData,
      educationCategoryDictData,
      rewardPunishmentCodeDictData,
      natureAgencyDictData,
      assessmentConclusionDictData,
      exitModeDictData,
      appellationDictData,
      politicalOutlookDictData,
      majorCategoryDictData,
      expandList,
      addData,
      editData,
      tabKey
    } = this.state;

    const bamData = {
      organizationLevelDictData,
      healthDictData,
      professionalAndTechnicalTitleDictData,
      preJobLevelDictData,
      currentRankDictData,
      nationDictData,
      categoryDictData,
      organizationData,
      accessQualificationDictData,
      educationCodeDictData,
      degreeCodeDictData,
      educationCategoryDictData,
      rewardPunishmentCodeDictData,
      natureAgencyDictData,
      assessmentConclusionDictData,
      exitModeDictData,
      appellationDictData,
      politicalOutlookDictData,
      majorCategoryDictData,
    }
    const { pPersonnelFilesModel: { tree }, loading: { effects } } = this.props;
    return (
      <>
        <div className={styles.index}>
          {expandList ? this.renderAdvancedList() : this.renderSimpleList()}
          <PPersonnelFilesSearchNameOrIdCardModal visible={this.state.SICvisible}
            onClose={() => this.closeSearchModal('SIC')} />
          <PPersonnelFilesSearchOrgModal visible={this.state.SOrgvisible} onClose={() => this.closeSearchModal('SOrg')}
            data={tree} />
          <PPersonnelFilesViewDrawer
            visible={this.state.viewVisible}
            record={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <AddModal {...addData} {...bamData} />}
          {editData.visible && <EditModal {...editData} {...bamData} />}
        </div>
      </>
    );
  }
}

export default Form.create()(PPersonnelFilesIndex);
