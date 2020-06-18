import React, { Component, Suspense } from 'react';
import { Modal, Form, Tabs } from 'antd';
import LegalEntitiesModal from './legalEntitiesModal';
import InternalInstitutionModal from './internalInstitutionModal';
import InstitutionalGroupingModal from './institutionalGroupingModal';

const { TabPane } = Tabs;

class OrgOrganizationEditModal extends Component {
  countColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '正职领导',
      dataIndex: 'shouldLeadershipCount',
      key: 'shouldLeadershipCount',
    },
    {
      title: '副职领导',
      dataIndex: 'shouldLeadershipNumber',
      key: 'shouldLeadershipNumber',
    },
  ];

  numberColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '行政编制',
      dataIndex: 'adminNumber',
      key: 'adminNumber',
    },
    {
      title: '参照公务员法管理事业编制',
      dataIndex: 'careerParticipationNumber',
      key: 'careerParticipationNumber',
    },
    {
      title: '其他事业编制',
      dataIndex: 'careerNoparticipationNumber',
      key: 'careerNoparticipationNumber',
    },
    {
      title: '工勤编制',
      dataIndex: 'workNumber',
      key: 'workNumber',
    },
    {
      title: '其他编制',
      dataIndex: 'otherNumber',
      key: 'otherNumber',
    },
  ];

  inCountColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '领导职数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '正职',
      dataIndex: 'shouldLeadershipCount',
      key: 'shouldLeadershipCount',
    },
    {
      title: '副职',
      dataIndex: 'shouldLeadershipNumber',
      key: 'shouldLeadershipNumber',
    },
  ];

  state = {
    tabStatus: 'LegalEntities',
    recordOne: null,
    recordTwo: null,
    recordThere: null,
  }

  componentDidMount() {
    this.onXhangeTab();
  }

  onXhangeTab = () => {
    const { record } = this.props;
    if (record.orgType === '法人单位') {
      this.setState({
        tabStatus: 'LegalEntities',
        recordOne: record,
      })
    } else if (record.orgType === '内设机构') {
      this.setState({
        tabStatus: 'InternalInstitution',
        recordTwo: record,
      })
    } else if (record.orgType === '机构分组') {
      this.setState({
        tabStatus: 'InstitutionalGrouping',
        recordThere: record,
      })
    }
  }

  okHandler = (childrenProps) => {
    const { onOk, record } = this.props;
    //  onOk(record, { ...childrenProps });
    // 分类进行保存
    const { tabStatus } = this.state;
    let vx = null
    if (tabStatus === 'LegalEntities') {
      vx = '法人单位'
    } else if (tabStatus === 'InternalInstitution') {
      vx = '内设机构'
    } else if (tabStatus === 'InstitutionalGrouping') {
      vx = '机构分组'
    }
    if (record) {
      onOk(record.id, { ...childrenProps, orgType: vx, pid: record.id });
    } else {
      onOk(record, { ...childrenProps, orgType: vx });
    }
    // LegalEntities  法人单位
    //  orgType
    // createTime: record.createTime,
    // InternalInstitution
    // InstitutionalGrouping
    this.cancelHandel();
    /* this.props.form.validateFields((err, values) => {
       if (!err) {
         if (record) {
           onOk(record.id, {
             ...values,
             pid: record.id,
             areaId: area.areaId,
           });
         } else {
           console.log('record333', record)
           console.log('values333', values)
           console.log('areaId333', area.areaId)
        //   onOk(record, { ...values, areaId: area.areaId });
         }
         this.cancelHandel();
       }
     }); */
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  onChangeTab = tab => {
    this.setState({
      tabStatus: tab,
    })
  }

  onRefChild = (ref) => {
    this.child = ref
  }

  clickParent = () => {
    const { tabStatus } = this.state;
    if (tabStatus === 'LegalEntities') {
      this.child.childMethodsOne()
    } else if (tabStatus === 'InternalInstitution') {
      this.child.childMethodsTwo()
    } else if (tabStatus === 'InstitutionalGrouping') {
      this.child.childMethodsThere()
    }
  }

  render() {
    const { title, visible, record, areaTree, orgLevel, orgCategoryTree, area, SubjectionTree } = this.props;
    const legaData = { orgLevel, orgCategoryTree, area, SubjectionTree }
    const { recordThere, recordOne, recordTwo } = this.state;
    return (
      <>
        <Modal
          title={title}
          width={1024}
          visible={visible}
          onOk={this.clickParent}
          onCancel={this.cancelHandel}
        >
          <Tabs defaultActiveKey={this.state.tabStatus} onChange={this.onChangeTab}>
            <TabPane tab="法人单位" key="LegalEntities">
                <LegalEntitiesModal onRefChild={this.onRefChild}
                  okHandler={this.okHandler}
                  {...legaData}
                  record={record} areaTree={areaTree}
                />
            </TabPane>
            <TabPane tab="内设机构" key="InternalInstitution">
                <InternalInstitutionModal onRefChild={this.onRefChild}
                  okHandler={this.okHandler}
                  record={record} />
            </TabPane>
            <TabPane tab="机构分组" key="InstitutionalGrouping">
                <InstitutionalGroupingModal onRefChild={this.onRefChild}
                  okHandler={this.okHandler}
                  record={record} />
            </TabPane>
          </Tabs>
        </Modal>
      </>
    );
  }
}

export default Form.create()(OrgOrganizationEditModal);
