import React, { Component } from 'react';
import { Form, Input, Row, Col, Descriptions, Avatar, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import '@/assets/css/style.css'

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
    return (
      <>
        <Row>
          <Col span={21}>
            <Descriptions bordered={true} size="small" column={{ md: 24, xs: 8, sm: 16 }}>
              <Descriptions.Item label="姓名" span={8}>
                {
                  getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="性别" span={8}>
                {
                  getFieldDecorator('birth', {
                    initialValue: birth || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="出生年月" span={8}>
                {
                  getFieldDecorator('birth', {
                    initialValue: birth || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="民族" span={8}>
                {
                  getFieldDecorator('national', {
                    initialValue: national || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="籍贯" span={8}>
                {
                  getFieldDecorator('nativePlace', {
                    initialValue: nativePlace || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="出生地" span={8}>
                {
                  getFieldDecorator('birthplace', {
                    initialValue: birthplace || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="入党时间" span={8}>
                {
                  getFieldDecorator('partyTime', {
                    initialValue: partyTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="参加工作时间" span={8}>
                {
                  getFieldDecorator('workTime', {
                    initialValue: workTime || '',
                  })(<Input />)
                }
              </Descriptions.Item>
              <Descriptions.Item label="健康状况" span={8}>
                {
                  getFieldDecorator('health', {
                    initialValue: health || '',
                  })(<Input />)
                }
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={3}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <Avatar shape="square" size={90} src={imageUrl} /> : uploadButton}
            </Upload>
          </Col>
        </Row>
        <Descriptions bordered column={{ md: 24, xs: 8, sm: 16 }}>
          <Descriptions.Item label="专业技术职务" span={12}>
            {
              getFieldDecorator('civilServantQualification', {
                initialValue: civilServantQualification || '',
              })(<Input />)
            }
          </Descriptions.Item>
          <Descriptions.Item label="熟悉专业有何特长" span={12}>
            {
              getFieldDecorator('speciality', {
                initialValue: speciality || '',
              })(<Input />)
            }
          </Descriptions.Item>

          <Descriptions.Item label="全日制教育" span={12}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<Input />)
            }
          </Descriptions.Item>
          <Descriptions.Item label="毕业院校系及专业" span={12}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<Input />)
            }
          </Descriptions.Item>
          <Descriptions.Item label="在职教育" span={12}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<Input />)
            }
          </Descriptions.Item>
          <Descriptions.Item label="毕业院校系及专业" span={12}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<Input />)
            }
          </Descriptions.Item>
          <Descriptions.Item label="工作单位及职务" span={24}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<Input />)
            }
          </Descriptions.Item>
          <Descriptions.Item label="简历" span={24}>
            {
              getFieldDecorator('resume', {
                initialValue: resume || '',
              })(<Input style={{ height: '300px' }} />)
            }
          </Descriptions.Item>
        </Descriptions>
        {
          getFieldDecorator('id', {
            initialValue: record.id || '',
          })(<Input type="hidden" />)
        }
        {
          getFieldDecorator('photoUrl', {
            initialValue: imageUrl || '',
          })(<Input type="hidden" value={imageUrl} />)
        }

      </>
    );
  }
}

export default (BasicInformationOne);
