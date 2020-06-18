/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Descriptions, Upload, Avatar, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
// import styles from '../style.less'

const { TextArea } = Input;
class TalentReviewAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
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

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, record } = this.props;
    const {
      name, sex, birth, national, nativePlace, workTime,
      maritalStatus, health, education, educationMajor,
      orgName, positionName, politicalOrientation, phone,
      workExperience, reason, recommenderOpinion, recommenderId,
      recommender, recommendedTime, photoUrl, remark, state, creatorId,
      createTime } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler} >
            <table align="center" valign="center" border="true">
              <tr>
                <td rowSpan="2">被推荐人姓名</td>
                <td rowSpan="2">
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)
                  }
                </td>
                <td>性别</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
                <td>出生年月</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
                <td rowSpan="3">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    style={{ width: '100%' }}
                  >
                    {imageUrl ? uploadButton : <Avatar shape="square" size={90} src={photoUrl} />}
                  </Upload>
                </td>
              </tr>
              <tr>
                <td>民族</td>
                <td>
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)
                  }
                </td>
                <td>贯籍</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
              </tr>
              <tr>
                <td>参加工作时间</td>
                <td>
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)
                  }
                </td>
                <td>婚姻状况</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
                <td>健康状况</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
              </tr>
              {/* 第三行 */}
              <tr>
                <td>推荐单位及职务</td>
                <td colSpan="2">
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)
                  }
                </td>
                <td>政治面貌</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
                <td>联系电话</td>
                <td>{
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }</td>
              </tr>
              <tr>
                <td>主要工作经历</td>
                <td colSpan="6">
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)
                  }
                </td>
              </tr>
              <tr>
                <td><span>推荐理由（包括被推荐<br />人的表现、突出特点）</span></td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
              <tr>
                <td>推荐意见</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
            </table>

          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(TalentReviewAddModal);
