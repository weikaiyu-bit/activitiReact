/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Drawer, Row, Col, Descriptions, Button, Tag } from 'antd';


class PPassportApprovalViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

 // 点击事件改变状态
  initStuats = T => {
    const { data, changeStauts } = this.props
   // changeStauts
    if (T === '保管中') {
      data.state = '保管中'
    } else if (T === '已领取') {
      data.state = '已领取'
    }
    changeStauts(data.id, { ...data });
    this.close()
  }

  render() {
    const { data = {}, visible } = this.props;
    let userOperation = null;
    if (data.state !== '已领取') {
      userOperation = (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <span >
              <Button type="danger" shape="round" onClick={e => this.initStuats('保管中')}>
                驳回
              </Button>
              <Button style={{ marginLeft: 32 }} type="primary" shape="round" onClick={e => this.initStuats('已领取')}>
                批准
              </Button>
            </span>
          </Col>
        </Row>
      )
    }
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="证件信息预览">
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Descriptions title="出入境证件信息" column={2} bordered>
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
          </Col>
        </Row>
        {
          userOperation
        }
      </Drawer>
    )
  }
}

export default PPassportApprovalViewDrawer;
