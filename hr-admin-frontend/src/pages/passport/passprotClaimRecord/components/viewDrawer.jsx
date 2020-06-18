import React, { Component } from 'react';
import { Drawer, Row, Col, Descriptions } from 'antd';


class PassprotClaimRecordViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="申请预览">
        <Descriptions title="因私出国（境）申请表" column={4} bordered>
          <Descriptions.Item label="证件编号">{data.certificateCode}</Descriptions.Item>
          <Descriptions.Item label="证件类型">{data.certificateType}</Descriptions.Item>
          <Descriptions.Item label="证件名称">{data.certificateName}</Descriptions.Item>
          <Descriptions.Item label="证件状态">{data.state}</Descriptions.Item>
          <Descriptions.Item label="目的地" span={2}>{data.destination}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{data.beginTime}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{data.endTime}</Descriptions.Item>
          <Descriptions.Item label="申请人">{data.applicant}</Descriptions.Item>
          <Descriptions.Item label="所在单位" span={2}>{data.applicantOrgId}</Descriptions.Item>
          <Descriptions.Item label="申请时间" span={2}>{data.applicationTime}</Descriptions.Item>
          <Descriptions.Item label="申请原因" span={3}>{data.reason}</Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>{data.remark}</Descriptions.Item>
          <Descriptions.Item label="本部门领导意见" span={3}>{data.departmentOpinions}</Descriptions.Item>
          <Descriptions.Item label="人事处意见" span={3}>{data.personnelDivisionOpinions}</Descriptions.Item>
          <Descriptions.Item label="单位领导意见" span={3}>{data.leadersOpinions}</Descriptions.Item>
          <Descriptions.Item label="保管人">{data.keeper}</Descriptions.Item>
        </Descriptions>

      </Drawer>
    )
  }
}

export default PassprotClaimRecordViewDrawer;
