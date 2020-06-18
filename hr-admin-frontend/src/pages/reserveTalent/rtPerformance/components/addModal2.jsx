import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Descriptions, Upload, Avatar, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../css/style.less';

const { TextArea } = Input;
class RtRecommendationFormAddModal extends Component {
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
    const { id, categoryId, fileId, name, sex, birth, national, nativePlace, workTime, maritalStatus, health, education, educationMajor, orgName, positionName, politicalOrientation, phone, performanceProfile, leaderEvaluation, reason, recommenderOpinion, recommenderId, recommender, recommendedTime, resume, photoUrl, remark, voteCount, state, creatorId, createTime, } = record;
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
          width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <div className={styles.addModal} >
            <Form horizontal="true" onSubmit={this.okHandler} >
              <table align="center" valign="center" border="true">
                <tr>
                  <td>被推荐人姓名</td>
                  <td >
                    {
                      getFieldDecorator('name', {
                        initialValue: name || '',
                      })(<Input />)
                    }
                  </td>
                  <td>性别</td>
                  <td>{
                    getFieldDecorator('sex', {
                      initialValue: sex || '',
                    })(<Input />)
                  }</td>
                  <td>出生年月</td>
                  <td>{
                    getFieldDecorator('birth', {
                      initialValue: birth || '',
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
                      {imageUrl ? <Avatar shape="square" size={90} src={imageUrl} /> : uploadButton}
                    </Upload>
                  </td>
                </tr>
                <tr>
                  <td>民族</td>
                  <td>
                    {
                      getFieldDecorator('national', {
                        initialValue: national || '',
                      })(<Input />)
                    }
                  </td>
                  <td>籍贯</td>
                  <td>{
                    getFieldDecorator('nativePlace', {
                      initialValue: nativePlace || '',
                    })(<Input />)
                  }</td>
                  <td>联系电话</td>
                  <td>{
                    getFieldDecorator('phone', {
                      initialValue: phone || '',
                    })(<Input />)
                  }</td>
                </tr>
                <tr>
                  <td >状态</td>
                  <td>{
                    getFieldDecorator('state', {
                      initialValue: state || '',
                    })(<Input />)
                  }</td>
                  <td>婚姻状况</td>
                  <td>{
                    getFieldDecorator('maritalStatus', {
                      initialValue: maritalStatus || '',
                    })(<Input />)
                  }</td>
                  <td>健康状况</td>
                  <td>{
                    getFieldDecorator('health', {
                      initialValue: health || '',
                    })(<Input />)
                  }</td>
                </tr>
                {/* 第三行 */}
                <tr>
                  <td>学历</td>
                  <td >
                    {
                      getFieldDecorator('education', {
                        initialValue: education || '',
                      })(<Input />)
                    }
                  </td>
                  <td>毕业院校系专业</td>
                  <td>{
                    getFieldDecorator('educationMajor', {
                      initialValue: educationMajor || '',
                    })(<Input />)
                  }</td>
                  <td>所在单位</td>
                  <td colSpan="2">{
                    getFieldDecorator('orgName', {
                      initialValue: orgName || '',
                    })(<Input />)
                  }</td>
                </tr>
                <tr>
                  <td>职务名称</td>
                  <td>{
                    getFieldDecorator('positionName', {
                      initialValue: positionName || '',
                    })(<Input />)
                  }</td>
                  <td>政治面貌</td>
                  <td>{
                    getFieldDecorator('politicalOrientation', {
                      initialValue: politicalOrientation || '',
                    })(<Input />)
                  }</td>
                  <td>业绩简介</td>
                  <td colSpan="2">{
                    getFieldDecorator('performanceProfile', {
                      initialValue: performanceProfile || '',
                    })(<Input />)
                  }</td>
                </tr>
                <tr>
                  <td>参加工作时间</td>
                  <td>
                    {
                      getFieldDecorator('workTime', {
                        initialValue: workTime || '',
                      })(<Input />)
                    }
                  </td>
                  <td>投票计数</td>
                  <td>
                    {
                      getFieldDecorator('voteCount', {
                        initialValue: voteCount || '',
                      })(<Input />)
                    }
                  </td>
                  <td>推荐人</td>
                  <td colSpan="2">{
                    getFieldDecorator('recommender', {
                      initialValue: recommender || '',
                    })(<Input />)
                  }</td>
                </tr>
                <tr>
                  <td>领导评价</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('leaderEvaluation', {
                        initialValue: leaderEvaluation || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>


                <tr>
                  <td>推荐人意见</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('recommenderOpinion', {
                        initialValue: recommenderOpinion || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>
                <tr>
                  <td>推荐理由</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('reason', {
                        initialValue: reason || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>
                <tr>
                  <td>简历</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('resume', {
                        initialValue: resume || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>
              </table>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(RtRecommendationFormAddModal);
