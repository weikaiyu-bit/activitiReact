import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';
import { connect } from 'dva'
import PersonnelFileView from '../../components/personnelFileView';

@connect(({ pPersonnelFilesModel, loading }) => ({
  pPersonnelFilesModel,
  loading: loading.models.fetch,
}))
class PPersonnelFilesViewDrawer extends Component {
  state = {
    pageNumber: 1,
    pageSize: 20,
    filter: {}
  };
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  afterVisibleChange = flag => {
    console.log("flag", flag)
    if (flag) {
      const { record = {} } = this.props;
      const { pageNumber, pageSize, filter } = this.state;
      this.child.findPageRecord(pageNumber, pageSize, { fileId: record.id });    // 查询简历信息
      this.child.findPageFamliy(pageNumber, pageSize, { fileId: record.id })//查询家庭成员信息
      this.child.appraisal(pageNumber, pageSize, { fileId: record.id });    // 考核信息
      this.child.rewards(pageNumber, pageSize, { fileId: record.id });    // 奖惩信息
      // this.child.rewards(pageNumber, pageSize, { fileId: record.id, outMark: "1" });    // 奖惩信息(是否输出)
      this.child.fetchChangeCode(pageNumber, pageSize, { fileId: record.id, changeCode: "true" });    // 职务信息
      this.child.findEducational(pageNumber, pageSize, { fileId: record.id })//学历信息
      this.child.findEducational(1, 3, { educationCategory: '全日制', outMark: '1', fileId: record.id })
      this.child.findEducational(1, 3, { educationCategory: '在职', outMark: '1', fileId: record.id })
      // this.findPositionLevel({ fileId: data.id });
      // this.findEducational({ fileId: data.id });
      // this.findAnnualAppraisalNarrative({ fileId: data.id });
      // this.findRewardsPunishments({ fileId: data.id });
      // this.findFamilyRelations({ fileId: data.id });
    }
  };
  onRef = (ref) => {
    this.child = ref
  }
  render() {
    const { record = {}, visible, pPersonnelFilesModel } = this.props;
    const {
      positionLevelData,
      educationalData,
      familyRelationsData,
      rewardsPunishmentsData,
      annualAppraisalNarrativeData,
    } = pPersonnelFilesModel;
    const dataSource = {
      record,
      positionLevelData,
      educationalData,
      familyRelationsData,
      rewardsPunishmentsData,
      annualAppraisalNarrativeData,
    };

    return (
      <Drawer width="960px" visible={visible} onClose={this.close} title="人事档案" afterVisibleChange={this.afterVisibleChange}>
        <PersonnelFileView {...dataSource} onRef={this.onRef} />
      </Drawer>
    )
  }
}

export default PPersonnelFilesViewDrawer;
