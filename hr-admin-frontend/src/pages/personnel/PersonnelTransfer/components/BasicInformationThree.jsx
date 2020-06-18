import React, { Component } from 'react';
import { Form, Input, Row, Col, Descriptions, Avatar, Upload, message, Table } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import TableEdit from './TableEdit'

const { TextArea } = Input;
class BasicInformationOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  // eslint-disable-next-line react/sort-comp


  render() {
    const { record, getFieldDecorator } = this.props;
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
        <div className="ant-upload-text">Upload</div>
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
          <Col>
            { /* 奖惩情况 + 年度审核 
            数据库缺： 
            录用时间:is_examination_time
            进入选调生时间:is_selected_time

            */}
            <Descriptions bordered column={{ md: 12, xs: 12, sm: 12 }}>
              <Descriptions.Item label="是否考录" span={8}>
                {
                  getFieldDecorator('is_examination', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="录入时间" span={8}>
                {
                  getFieldDecorator('partyTime', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="是否选调生" span={8}>
                {
                  getFieldDecorator('is_selected_graduates', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="进入选调生时间" span={8}>
                {
                  getFieldDecorator('is_selected_time', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="专业技术类公务员任职资格" span={8}>
                {
                  getFieldDecorator('civil_servant_qualification', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="成长地" span={8}>
                {
                  getFieldDecorator('grewup_place', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="级别" span={8}>
                {
                  getFieldDecorator('level', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item span={8}>
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={24}>
                {
                  getFieldDecorator('remark', {
                    initialValue: partyTime || '',
                  })(<TextArea rows={5} style={{ marginTop: '0px', marginBottom: '0px', height: '630px' }} />)
                }
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

      </>
    );
  }
}

export default (BasicInformationOne);
