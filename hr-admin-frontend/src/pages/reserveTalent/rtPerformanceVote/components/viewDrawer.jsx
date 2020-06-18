import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';
import { connect } from 'dva'
import ReserveTalentView from '../../components/ReserveTalentView';

@connect(({ pPersonnelFilesModel, loading }) => ({
  pPersonnelFilesModel,
  loading: loading.models.fetch,
}))
class RtPerformanceVoteViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
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
      <Drawer width="50%" visible={visible} onClose={this.close} title="详细信息">
        <ReserveTalentView {...dataSource} />
      </Drawer>
    )
  }
}

export default RtPerformanceVoteViewDrawer;
