import React, { Component } from 'react';
import { Drawer, Row, Col, Descriptions } from 'antd';


class PPassportSearchViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="证件信息预览">
        <Descriptions title="出入境证件信息" column={4} bordered>
          <Descriptions.Item label="证件编号">{data.certificateCode}</Descriptions.Item>
          <Descriptions.Item label="证件类型">{data.certificateType}</Descriptions.Item>
          <Descriptions.Item label="证件名称">{data.certificateName}</Descriptions.Item>
          <Descriptions.Item label="证件状态">{data.state}</Descriptions.Item>
          <Descriptions.Item label="持有人">{data.owner}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{data.idCard}</Descriptions.Item>
          <Descriptions.Item label="所在单位">{data.ownerOrgName}</Descriptions.Item>
          <Descriptions.Item label="编制类型">{data.posistionCategory}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{data.remark}</Descriptions.Item>
          <Descriptions.Item label="保管人">{data.keeper}</Descriptions.Item>
          <Descriptions.Item label="登记时间">{data.registrationTime}</Descriptions.Item>
        </Descriptions>

      </Drawer>
    )
  }
}

export default PPassportSearchViewDrawer;
