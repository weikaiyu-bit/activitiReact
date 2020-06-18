import React, { Component } from 'react';
import { Form, Input, Row, Col, Descriptions, Avatar, Upload, message, Table } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import '../css/formarionTwo.css'
import styles from '@/assets/css/BasicInformationTwo.less'
import TableEdit from './TableEdit'
// eslint-disable-next-line import/no-unresolved
import Reward from './reward'
import Appraisal from './Appraisal'

const { TextArea } = Input;
class BasicInformationOne extends Component {
  state = {
    // eslint-disable-next-line react/no-unused-state
    rewards: {
      visible: false,
      record: {},
    },
    appraisal: {
      visible: false,
      record: {},
    },
  };
  __rewards = () => {
    this.setState({
      rewards: {
        title: '奖罚情况',
        visible: true,
        onClose: this.rewards,
      },
    })
  }
  rewards = () => {
    this.setState({
      rewards: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  __appraisal = () => {
    this.setState({
      appraisal: {
        title: '年度考核',
        visible: true,
        onClose: this.appraisals,
      },
    })
  }
  appraisals = () => {
    this.setState({
      appraisal: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  render() {
    const { record, getFieldDecorator } = this.props;
    const { rewards, appraisal } = this.state;
    const {
      name,
      birth,
      national,
      nativePlace,
      birthplace,
      partyTime,
      workTime,
      health,
      speciality,
      resume,
      yearResult,
      civilServantQualification,
    } = record
    // const { getFieldDecorator } = this.props.form;
    const BasicInformationOneData = {
      record,
      getFieldDecorator,
    }
    return (
      <>
        <Row>
          <Col span={24} className={styles.descripdtions}>
            { /* 奖惩情况 + 年度审核 */}
            <Descriptions size="middle" bordered column={1}>
              <Descriptions.Item label="奖惩描述">
                {
                  getFieldDecorator('reward', {
                    initialValue: name || '',
                  })(<TextArea rows={5} onDoubleClick={this.__rewards} />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="年度审核">
                {
                  getFieldDecorator('yearResult', {
                    initialValue: yearResult || '',
                  })(<TextArea rows={5} onDoubleClick={this.__appraisal} />)
                }
              </Descriptions.Item>
              <Descriptions.Item label={<>家 < br /> 庭 < br /> 主 < br /> 要 < br /> 成< br />员 < br /> 及 < br /> 重 < br /> 要 < br /> 社 < br /> 会 < br /> 关 < br /> 系</>} span={24}>
                <TableEdit {...BasicInformationOneData} />
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {rewards.visible ? <Reward {...rewards} /> : ''}
        {appraisal.visible ? <Appraisal {...appraisal} /> : ''}
      </>
    );
  }
}

export default (BasicInformationOne);
