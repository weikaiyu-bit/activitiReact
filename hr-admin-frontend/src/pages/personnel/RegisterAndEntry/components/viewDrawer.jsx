import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';
import { connect } from 'dva'
import PersonnelFileView from '../../components/personnelFileView';

@connect(({ pPersonnelFilesModel, loading }) => ({
  pPersonnelFilesModel,
  loading: loading.models.fetch,
}))
class PPersonnelFilesViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  afterVisibleChange = flag => {
/*    if (flag) {
      const { data = {} } = this.props;
      this.findPositionLevel({ fileId: data.id });
      this.findEducational({ fileId: data.id });
      this.findAnnualAppraisalNarrative({ fileId: data.id });
      this.findRewardsPunishments({ fileId: data.id });
      this.findFamilyRelations({ fileId: data.id });
    } */
  };

  // 查询植物信息
  findPositionLevel = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchPositionLevel',
      payload: {
        ...filter,
      },
    });
  };

  // 查询学历学位
  findEducational = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchEducational',
      payload: {
        ...filter,
      },
    });
  };

  // 查询考核信息
  findAnnualAppraisalNarrative = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchAnnualAppraisalNarrative',
      payload: {
        ...filter,
      },
    });
  };

  // 查询奖惩信息
  findRewardsPunishments = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchRewardsPunishments',
      payload: {
        ...filter,
      },
    });
  };

  // 查询家庭成员
  findFamilyRelations = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/fetchFamilyRelations',
      payload: {
        ...filter,
      },
    });
  };

  render () {
    const { data = {}, visible, pPersonnelFilesModel } = this.props;
    const {
      positionLevelData,
      educationalData,
      familyRelationsData,
      rewardsPunishmentsData,
      annualAppraisalNarrativeData,
    } = pPersonnelFilesModel;
    const dataSource = {
      data,
      positionLevelData,
      educationalData,
      familyRelationsData,
      rewardsPunishmentsData,
      annualAppraisalNarrativeData,
    };

    return (
      <Drawer width="960px" visible={visible} onClose={this.close} title="人事档案" afterVisibleChange={this.afterVisibleChange}>
        <PersonnelFileView {...dataSource} />
      </Drawer>
    )
  }
}

export default PPersonnelFilesViewDrawer;
