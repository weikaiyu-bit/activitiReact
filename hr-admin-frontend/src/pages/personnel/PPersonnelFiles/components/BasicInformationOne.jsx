import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, DatePicker, Select, Avatar, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import '@/assets/css/style.css'
import styles from '../css/style.less';
import DictionaryTree from '../../../components/dictionaryTree';

const { TextArea } = Input;
const { Option } = Select;


class BasicInformationOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      // imageUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2268196029,3623117752&fm=26&gp=0.jpg',
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
    const { record, getFieldDecorator, nationData } = this.props;
    const {
      name,
      birth,
      sex,
      national,
      nativePlace,
      birthplace,
      partyTime,
      workTime,
      health,
      speciality,
      resume,
      professionalTitles,
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

    const nation = {
      tree: nationData,
      type: 'list',
      labelInValue: true,
    };
    return (
      <>
        {/* right 可以选择 */}
        <table align="center" valign="center" border="true" className={styles.AntInput} style={{ width: '100%' }}>
          <tr>
            <td><span style={{ color: 'red' }}>*</span>姓名</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('name', {
                    initialValue: name || '',
                    rules: [{
                      required: true,
                      message: <span>
                        <Tooltip visible placement="top" title="请输入姓名">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td><span style={{ color: 'red' }}>*</span>性别</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('sex', {
                    initialValue: sex || '',
                    rules: [{
                      required: true,
                      message: <span>
                        <Tooltip visible placement="top" title="请选择性别">
                        </Tooltip>
                      </span>,
                    }],
                  })(
                    <Select style={{ width: '100%' }} bordered={false}>
                      <Option value="0">男</Option>
                      <Option value="1">女</Option>
                    </Select>,
                  )
                }
              </Form.Item>
            </td>
            <td><span style={{ color: 'red' }}>*</span>出生年月</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('birth', {
                    initialValue: birth || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请填写出生日期">
                        </Tooltip>
                      </span>,
                    }],
                  })(
                    <DatePicker bordered={false} />,
                  )
                }
              </Form.Item>
            </td>
            <td rowSpan="4">
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
            <td><span style={{ color: 'red' }}>*</span>民族</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('national', {
                    initialValue: national || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择名族">
                        </Tooltip>
                      </span>,
                    }],
                  })(<DictionaryTree {...nation} />)
                }
              </Form.Item>
            </td>
            <td><span style={{ color: 'red' }}>*</span>籍贯</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('nativePlace', {
                    initialValue: nativePlace || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择籍贯">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td><span style={{ color: 'red' }}>*</span>出生地</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('birthplace', {
                    initialValue: birthplace || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请输入出生地">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
          </tr>
          <tr>
            <td><span style={{ color: 'red' }}>*</span>入党时间</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('partyTime', {
                    initialValue: partyTime || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择入党时间">
                        </Tooltip>
                      </span>,
                    }],
                  })(
                    <DatePicker bordered={false} />,
                  )
                }
              </Form.Item>
            </td>
            <td><span style={{ color: 'red' }}>*</span>参加工作时间</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('workTime', {
                    initialValue: workTime || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择入工作时间">
                        </Tooltip>
                      </span>,
                    }],
                  })(
                    <DatePicker bordered={false} />,
                  )
                }
              </Form.Item>
            </td>
            <td><span style={{ color: 'red' }}>*</span>健康状况</td>
            <td>
              <Form.Item>
                {
                  getFieldDecorator('health', {
                    initialValue: health || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择健康状况">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
          </tr>
          <tr>
            <td><span style={{ color: 'red' }}>*</span>专业技术职务</td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('professionalTitles', {
                    initialValue: professionalTitles || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择专业技术职务">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td >熟悉专业有何特长</td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('speciality', {
                    initialValue: speciality || '',
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
          </tr>


          <tr>
            <td rowSpan="4">学历学位</td>
            <td rowSpan="2">全日制教育</td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('health', {
                    initialValue: health || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择健康状况">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td rowSpan="2">毕业院校系及专业</td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('health', {
                    initialValue: health || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择健康状况">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            {/* <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('professionalTitles', {
                    initialValue: professionalTitles || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择专业技术职务">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td> */}

          </tr>

          <tr>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('professionalTitles', {
                    initialValue: professionalTitles || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择专业技术职务">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('professionalTitles', {
                    initialValue: professionalTitles || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择专业技术职务">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
          </tr>


          <tr>
            <td rowSpan="2">在职教育</td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('speciality', {
                    initialValue: speciality || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择健康状况">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td rowSpan="2">毕业院校系及专业</td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('speciality', {
                    initialValue: speciality || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择健康状况">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>

          </tr>


          <tr>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('professionalTitles', {
                    initialValue: professionalTitles || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择专业技术职务">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
            <td colSpan="2">
              <Form.Item>
                {
                  getFieldDecorator('professionalTitles', {
                    initialValue: professionalTitles || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="top" title="请选择专业技术职务">
                        </Tooltip>
                      </span>,
                    }],
                  })(<Input />)
                }
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td><span style={{ color: 'red' }}>*</span>工作单位及职务</td>
            <td colSpan="6" style={{ height: '120px' }}>
              <Form.Item>
                {
                  getFieldDecorator('work', {
                    initialValue: resume || '',
                    rules: [{
                      required: true,
                      message: < span >
                        <Tooltip visible placement="rightBottom" title="请选择健康状况">
                        </Tooltip>
                      </span>,
                    }],
                  })(<TextArea rows={5} />)
                }
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td>简历</td>
            <td colSpan="6" style={{ height: '295px' }}>
              <Form.Item>
                {
                  getFieldDecorator('resume', {
                    initialValue: resume || '',
                  })(<TextArea rows={5} />)
                }
              </Form.Item>
            </td>
          </tr>
        </table>
      </>
    );
  }
}

export default (BasicInformationOne);
