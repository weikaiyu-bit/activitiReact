import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Divider, Form, message, Tree, Tag } from 'antd';

import moment from 'moment'
import ErrorCode from '../../../dtsea/common/ErrorCode';
import PPersonnelFilesViewDrawer from './components/viewDrawer';
import PPersonnelFilesSearchBar from './components/searchBar';
import PPersonnelFilesSearchNameOrIdCardModal from './components/searchNameOrIdCardModal';
import PPersonnelFilesSearchOrgModal from './components/searchOrgModal';
import PersonnelSummaryCard from '../components/personnelSummaryCard';
import ApplyTransfer from './components/applyTransfer';
import ApplyPositionChange from './components/applyPositionChange';
import ApplyPromotion from './components/applyPromotion';
import ApplyRecommend from './components/applyRecommend';
import Dismissal from './components/dismissal';

import styles from './css/index.less'

const { TreeNode } = Tree;

@connect(({ personnelTransferModal, pfileWorkRecordModel, loading }) => ({
  personnelTransferModal,
  pfileWorkRecordModel,
  loading,
}))
class PersonnelTransferIndex extends Component {
  state = {
    expandList: false,
    tabKey: 'byList',
    // orgKey: 'byOrg',
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 20,
    viewData: {},
    applyTransfer: {
      visible: false,
      record: {},
    },
    applyPromotion: {
      visible: false,
      record: {},
    },
    recommendData: {
      visible: false,
      record: {},
    },

    positionData: {
      visible: false,
      record: {},
    },

    dismissalData: {
      visible: false,
      record: {},
    },

    // expandedKeys: [],
    searchValue: '',
    // autoExpandParent: true,
    selectedKeys: [],
    SICvisible: false,
    SOrgvisible: false,
    // SOTvisible: false,
    // SCSMvisible: false,
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
      width: 250,
      render: (text, record) => {
        const { personnelTransferModal: { orgData } } = this.props;
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
      width: 130,
    },
    {
      title: '统计关系所在单位',
      dataIndex: 'rsOrgId',
      ellipsis: true,
      width: 180,
      render: text => {
        const { personnelTransferModal: { orgData } } = this.props;
        if (orgData != null) {
          for (let i = 0; i < orgData.length; i += 1) {
            if (orgData[i].id === text) {
              return <>{orgData[i].orgName}</>;
            }
          }
        }
        return { text }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 350,
      render: (text, record) => (
        <>
          <a onClick={() => this.applyRecommend(record)}>推荐晋升</a>
          <Divider type="vertical" />
          <a onClick={() => this.applyPositionChange(record)}>职务变动</a>
          <Divider type="vertical" />
          <a onClick={() => this.applyTransfer(record)}>调动</a>
          <Divider type="vertical" />
          <a onClick={() => this.applyPromotion(record)}>提拔</a>
          <Divider type="vertical" />
          <a onClick={() => this.dismissal(record)}>辞退</a>
          <Divider type="vertical" />
          <a onClick={() => this.dismissal(record)}>辞职</a>
        </>
      ),
    },
  ];

  componentDidMount() {
    this.findOrg({ tenantId: 5 });
    // 97:民族   级别:16   现职级:96  先职务层次: 95  专业技术职称:29   人员类别: 99  健康状况: 28
    this.findDictData({
      dataIds: [99, 97, 96, 95, 29, 28, 16],
    }, response => {
      console.log('response------------------', response);
    });
  }

  renderDate = text => ((text) ? moment(text).format('YYYY年MM月DD日') : '')

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

  // 获取人员状态信息
  findStatus = groupId => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchStatus`,
      payload: { groupId },
    });
  };

  findOrg = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelTransferModal/fetchOrg',
      payload: {
        ...filter,
      },
    });
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelTransferModal/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelTransferModal/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建人事档案信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
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

  update = (id, values) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'personnelTransferModal/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改人事档案信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
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
      type: 'personnelTransferModal/remove',
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

  // ////////////////////////////////////////////////////////////////////////////////////

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

  // 辞退
  dismissal = record => {
    this.setState({
      dismissalData: {
        title: '人员辞退',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.add,
        onClose: this.hideDismissal,
      },
    })
  };


  hideDismissal = () => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      dismissalData: {
        visible: false,
      },
    });
  };

  applyRecommend = record => {
    this.setState({
      recommendData: {
        title: '推荐晋升',
        visible: true,
        confirmLoading: false,
        record,
        onClose: this.hideApplyRecommend,
      },
    })
  }

  hideApplyRecommend = () => {
    this.setState({
      recommendData: {
        visible: false,
        onClose: this.hideDismissal,
      },
    })
  }

  // 职务变动
  applyPositionChange = record => {
    this.setState({
      positionData: {
        title: '职务变动',
        visible: true,
        confirmLoading: false,
        record,
        onClose: this.hideApplyPositionChange,
      },
    })
  }

  hideApplyPositionChange = () => {
    this.setState({
      positionData: {
        visible: false,
        onClose: this.hideDismissal,
      },
    })
  }

  // showSearchModal(e) {
  //   switch (e) {
  //     case 'SIC':
  //       this.setState({
  //         SICvisible: true,
  //       });
  //       break;
  //     case 'SOrg':
  //       this.setState({
  //         SOrgvisible: true,
  //       });
  //       break;
  //     case 'SOT':
  //       this.setState({
  //         SOTvisible: true,
  //       });
  //       break;
  //     case 'SCSM':
  //       this.setState({
  //         SCSMvisible: true,
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // closeSearchModal = e => {
  //   switch (e) {
  //     case 'SIC':
  //       this.setState({
  //         SICvisible: false,
  //       });
  //       break;
  //     case 'SOrg':
  //       this.setState({
  //         SOrgvisible: false,
  //       });
  //       break;
  //     case 'SOT':
  //       this.setState({
  //         SOTvisible: false,
  //       });
  //       break;
  //     case 'SCSM':
  //       this.setState({
  //         SCSMvisible: false,
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  applyTransfer = record => {
    this.setState({
      applyTransfer: {
        title: '申请调动',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.add,
        onClose: this.hideApplyTransfer,
      },
    });
  };

  hideApplyTransfer = () => {
    this.setState({
      applyTransfer: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  applyPromotion = record => {
    this.setState({
      applyPromotion: {
        title: '申请提拔',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.add,
        onClose: this.hideApplyPromotion,
      },
    });
  };

  hideApplyPromotion = () => {
    this.setState({
      applyPromotion: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  // showEditModal = record => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     editData: {
  //       dispatch,
  //       title: '编辑人事档案信息',
  //       visible: true,
  //       confirmLoading: false,
  //       record,
  //       onOk: this.update,
  //       onClose: this.hideEditModal,
  //     },
  //   });
  // };

  // hideEditModal = () => {
  //   this.setState({
  //     editData: {
  //       visible: false,
  //       confirmLoading: false,
  //       record: {},
  //       onOk: null,
  //     },
  //   });
  // };

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

  // onExpand = expandedKeys => {
  //   this.setState({
  //     expandedKeys,
  //     autoExpandParent: false,
  //   });
  // };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  // 获取集团ID
  getRoot = pid => {
    const { data } = this.props.personnelTransferModal;
    for (let i = 0; i < data.length; i += 1) {
      if (pid === data[i].id) {
        return data[i].pid;
      }
    }
    return null;
  };

  // 选中左侧树状菜单,展示数据并存储集团ID
  onSelect = (selectedKeys, info) => {
    this.setState(
      {
        selectedKeys,
        pageNumber: 1,
      },
      () => {
        const { pageNumber, pageSize } = this.state;
        const { id } = info.node.props.dataRef;
        const orgId = id;
        this.findPage(pageNumber, pageSize, { orgId });
        this.props.form.resetFields('statusCode');
      },
    );
  };


  handleTabChange = tabKey => {
    this.setState({
      tabKey,
    });
  };

  // handleOrgChange = orgKey => {
  //   this.setState({
  //     orgKey,
  //   });
  // };

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
          <TreeNode title={title} key={item.id} dataRef={item}>
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
      personnelTransferModal: { tree },
    } = this.props;

    return (
      <Tree
        onExpand={this.onExpand}
        onCheck={this.onCheck}
        checkable
        defaultExpandParent

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
      personnelTransferModal: { data = [], total },
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
          loading={effects['personnelTransferModal/fetch']}
          columns={this.columns}
          dataSource={data}
          pagination={paginationProps}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          bordered
          size="middle"
          scroll={{ x: 1300, y: 650 }}
        />
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
    const { pageNumber, pageSize } = this.state;
    const {
      form,
      personnelTransferModal: { total },
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
      toggleForms: this.toggleForm,
      findDictData: this.findDictData,
    };

    return (
      <Card>
        <div>
          <div style={{ marginBottom: '8px' }}>
            <PPersonnelFilesSearchBar {...DictData} />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>
              <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
            </span>
          </div>

          {this.renderPersonnelFiles()}
        </div>
      </Card>
    );
  }

  renderSimpleList() {
    const { pageNumber, pageSize } = this.state;
    const {
      form,
      personnelTransferModal: { total },
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
      toggleForms: this.toggleForm,
      findDictData: this.findDictData,
    };

    return (
      <>
        <div style={{ width: '15%', height: 863, float: 'left', marginRight: '1%' }}>
          <Card style={{ height: 863, overflow: 'auto' }}>
            {this.renderOrganizationTree()}
          </Card>
        </div>
        <div style={{ width: '84%', height: 863, float: 'left' }}>
          <Card style={{ height: 863, overflow: 'auto' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <PPersonnelFilesSearchBar {...DictData} />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span>
                  <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
                </span>
              </div>
              {this.renderPersonnelFiles()}
            </div>
          </Card>
        </div>
      </ >
    );
  }

  render() {
    const {
      expandList, applyPromotion, applyTransfer, dismissalData, recommendData, positionData
    } = this.state;
    const {
      personnelTransferModal: { tree },
      // loading: { effects }
    } = this.props;
    return (
      <>
        <div className={styles.tree}>
          {expandList ? this.renderAdvancedList() : this.renderSimpleList()}
          <PPersonnelFilesSearchNameOrIdCardModal visible={this.state.SICvisible}
            onClose={() => this.closeSearchModal('SIC')} />
          <PPersonnelFilesSearchOrgModal visible={this.state.SOrgvisible} onClose={() => this.closeSearchModal('SOrg')}
            data={tree} />
          <PPersonnelFilesViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {positionData.visible ? <ApplyPositionChange {...positionData} /> : ''}
          {applyTransfer.visible ? <ApplyTransfer {...applyTransfer} /> : ''}
          {applyPromotion.visible ? <ApplyPromotion {...applyPromotion} /> : ''}
          {dismissalData.visible ? <Dismissal {...dismissalData} /> : ''}
          {recommendData.visible ? <ApplyRecommend {...recommendData} /> : ''}
        </div>
      </>
    );
  }
}

export default Form.create()(PersonnelTransferIndex);
