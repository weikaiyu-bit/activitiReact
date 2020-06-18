import React, { Component } from 'react';
import { Form, Input, Row, Col, Descriptions, Avatar, Upload, message, Table } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import styles from '@/assets/css/BasicInformationTwo.less'
import TableEdit from './TableEdit'
// eslint-disable-next-line import/no-unresolved
import Reward from './reward'

const { TextArea } = Input;
class BasicInformationOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      addData: {
        visible: false,
        record: {},
      },
    };
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  onDoubleClick = () => {
    this.setState({
      addData: {
        title: '奖罚情况',
        visible: true,
        onClose: this.hideAddModal,
        
      },
    })
  }

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

  render() {
    const { record, getFieldDecorator } = this.props;
    const { addData } = this.state;
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
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const { imageUrl } = this.state;
    const BasicInformationOneData = {
      record,
      getFieldDecorator,
    }
    return (
      <>
        <Row>
          <Col span={24} className={styles.abcd}>
            { /* 奖惩情况 + 年度审核 */}
            <Descriptions size="middle" bordered column={1}>
              <Descriptions.Item label="奖惩描述">
                {
                  getFieldDecorator('reward', {
                    initialValue: name || '',
                  })(<TextArea rows={5} onDoubleClick={this.onDoubleClick} />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="年度审核">
                {
                  getFieldDecorator('yearResult', {
                    initialValue: yearResult || '',
                  })(<TextArea rows={5} />)
                }
              </Descriptions.Item>
              <Descriptions.Item label={<>家 < br /> 庭 < br /> 主 < br /> 要 < br /> 成< br />员 < br /> 及 < br /> 重 < br /> 要 < br /> 社 < br /> 会 < br /> 关 < br /> 系</>} span={24}>
                <TableEdit {...BasicInformationOneData} />
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {addData.visible ? <Reward {...addData} /> : ''}
      </>
    );
  }
}

export default (BasicInformationOne);
