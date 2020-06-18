import React, {Component} from 'react';
import {
  Modal, Form, Input, Row, Col,
  DatePicker, Upload, Avatar, message, Select, Tooltip
} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import moment from 'moment';
import DictionaryTree from '../../../components/dictionaryTree';
import styles from '../css/style.less';
const SelectOption = Select.Option;
const {TextArea} = Input;
const dateFormat = 'YYYY-MM-DD';

class RtRecommendationFormAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      healthArrays: ['健康', '一般', '慢性病'],
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
      this.setState({loading: true});
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
    const {onOk, record} = this.props;
    const {
      name, sex, birth, national, nativePlace, workTime,
      maritalStatus, health, education, educationMajor,
      orgName, positionName, politicalOrientation, phone,
      workExperience, reason, recommenderOpinion, recommenderId,
      recommender, recommendedTime, photoUrl, remark, state, creatorId,
      createTime
    } = record;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          national: values.national.label,
          state: '编辑中',
          workTime: values.workTime === '' ? null : moment(values.workTime).format('YYYY-MM-DD HH:mm:ss'),
          birth: values.birth === '' ? null : moment(values.birth).format('YYYY-MM-DD HH:mm:ss'),
        });
        this.cancelHandel();
      }
    });

  };


  cancelHandel = () => {
    const {onClose} = this.props;
    onClose();
  };

  render() {
    const {title, visible, record, nationData, politicalOrientationData } = this.props;
    const {
      name, sex, birth, national, nativePlace, workTime,
      maritalStatus, health, education, educationMajor,
      orgName, positionName, politicalOrientation, phone,
      workExperience, reason, recommenderOpinion, recommenderId,
      recommender, recommendedTime, photoUrl, remark, state, creatorId,
      createTime
    } = record;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const {imageUrl, healthArrays,} = this.state;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const nation = {
      tree: nationData,
      type: 'list',
      labelInValue: true,
    };
    const politicalOrienta = {
      tree: politicalOrientationData,
      type: 'list',
      labelInValue: true,
    }
    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <table align="center" valign="center" border="true" className={styles.AntInput} style={{ width: '100%' }}>
              <tr>
                <td rowSpan="2"><span style={{color: "red"}}>*</span>被推荐人姓名</td>
                <td rowSpan="2">
                  <Form.Item>
                    {
                      getFieldDecorator('name', {
                        initialValue: name || '',
                        rules: [{required: true, message: <span>
                            <Tooltip visible placement="top" title="请填被推荐人姓名"/>
                          </span>}],
                      })(<Input />)
                    }
                  </Form.Item>
                </td>

                <td><span style={{color:"red"}}>*</span>性别</td>
                <td>
                  <Form.Item>
                    {
                      getFieldDecorator('sex', {
                        initialValue: sex || '',
                        rules: [{
                          required: true,
                          message: <span>
                            <Tooltip visible placement='top' title="请选择性别"/>
                          </span>
                        }]
                      })(<Select placeholder="性别">
                        <SelectOption value="男">男</SelectOption>
                        <SelectOption value="女">女</SelectOption>
                      </Select>)
                    }
                  </Form.Item></td>
                <td><span style={{color: 'red'}}>*</span>出生年月</td>
                <td>
                  <Form.Item>{
                    getFieldDecorator('birth', {
                      initialValue: birth ? moment(birth, 'YYYY-MM-DD') : '',
                      rules: [{
                        required: true,
                        message: < span>
                        <Tooltip visible placement="top" title="请选择出生日期">
                        </Tooltip>
                      </span>,
                      }]
                    })(<DatePicker style={{width: "100%"}} bordered={false}/>)
                  }</Form.Item></td>
                <td rowSpan="3">
                  <Form.Item>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    style={{width: '100%'}}
                  >
                    {imageUrl ? uploadButton : <Avatar shape="square" size={90} src={imageUrl} />}
                  </Upload>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td><span style={{color:"red"}}>*</span>民族</td>
                <td>
                  <Form.Item>
                  {
                    getFieldDecorator('national', {
                      initialValue: national || '',
                      rules:[{
                        required: true,
                        message: <span>
                          <Tooltip visible placement="top" title="请选择民族">
                          </Tooltip>
                        </span>
                      }]
                    })(<DictionaryTree {...nation} />)
                  }
                  </Form.Item>
                </td>
                <td><span style={{color:"red"}}>*</span>籍贯</td>
                <td>
                  <Form.Item>{
                  getFieldDecorator('nativePlace', {
                    initialValue: nativePlace || '',
                    rules:[{
                      required: true,
                      message:
                        <span>
                          <Tooltip visible placement="top" title="请填写籍贯"/>
                        </span>
                    }]
                  })(<Input/>)
                  }</Form.Item>
                </td>
              </tr>
              <tr>
                <td>婚姻状况</td>
                <td>
                  <Form.Item>{
                  getFieldDecorator('maritalStatus', {
                    initialValue: maritalStatus || '',
                  })(<Select>
                    <SelectOption value="已婚">已婚</SelectOption>
                    <SelectOption value="未婚">未婚</SelectOption>
                    <SelectOption value="丧偶">丧偶</SelectOption>
                  </Select>)
                  }</Form.Item></td>
                <td>健康状况</td>
                <td><Form.Item>{
                  getFieldDecorator('health', {
                    initialValue: health || '',
                  })(
                    <Select placeholder="健康状况">
                      {healthArrays.map(healthArray => (
                        <SelectOption value={healthArray}>{healthArray}</SelectOption>
                      ))}
                    </Select>
                  )
                }</Form.Item></td>
                <td><span style={{color:"red"}}>*</span>政治面貌</td>
                <td><Form.Item>{
                  getFieldDecorator('politicalOrientation', {
                    initialValue: politicalOrientation || '',
                    rules:[{
                      required: true,
                      message:
                      <span>
                        <Tooltip visible placement="top" title="请选择政治面貌"/>
                      </span>
                    }]
                  })(<DictionaryTree {...politicalOrienta} />)
                }</Form.Item></td>
              </tr>
              {/* 第三行 */}
              <tr>
                <td><span style={{color: 'red'}}>*</span>参加工作时间</td>
                <td>
                  <Form.Item>
                  {
                    getFieldDecorator('workTime', {
                      initialValue: workTime ? moment(workTime, 'YYYY-MM-DD') : '',
                      rules: [{
                        required: true,
                        message: <span>
                          <Tooltip visible placement="top" title="请填参加工作时间">
                        </Tooltip>
                        </span>
                      }]
                    })(<DatePicker style={{width: "100%"}} bordered={false}/>)
                  }
                  </Form.Item>
                </td>
                <td>所在单位</td>
                <td colSpan="2">
                  <Form.Item>
                  {
                    getFieldDecorator('orgName', {
                      initialValue: orgName || '',
                    })(<Input/>)
                  }
                  </Form.Item>
                </td>
                <td><span style={{color:"red"}}>*</span>联系电话</td>
                <td><Form.Item>{
                  getFieldDecorator('phone', {
                    initialValue: phone || '',
                    rules:[{
                      required: true,
                      message:
                      <span>
                        <Tooltip visible placement="top" title="请输入联系电话"/>
                      </span>
                    }]
                  })(<Input/>)
                }</Form.Item></td>
              </tr>
              <tr>
                <td><span style={{color:"red"}}>*</span>主要工作经历</td>
                <td colSpan="6" style={{height: '200px'}}>
                  <Form.Item>
                  {
                    getFieldDecorator('workExperience', {
                      initialValue: workExperience || '',
                      rules:[{
                        required: true,
                        message:
                        <span>
                          <Tooltip visible placement="top" title="请填写主要工作经历"/>
                        </span>
                      }]
                    })(<TextArea rows={5} />)
                  }
                </Form.Item>
                </td>
              </tr>
              <tr>
                <td><span style={{color:"red"}}>*</span><span>推荐理由（包括被推荐<br/>人的表现、突出特点）</span></td>
                <td colSpan="6" style={{height: '200px'}}>
                  <Form.Item>
                  {
                    getFieldDecorator('reason', {
                      initialValue: reason || '',
                      rules:[{
                        required: true,
                        message:
                        <span>
                          <Tooltip visible placement="top" title="请填写工作经验" />
                        </span>
                      }]
                    })(<TextArea rows={6}/>)
                  }
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td><span style={{color:"red"}}>*</span>推荐意见</td>
                <td colSpan="6" style={{height: '200px'}}>
                  <Form.Item>
                  {
                    getFieldDecorator('recommenderOpinion', {
                      initialValue: recommenderOpinion || '',
                      rules:[{
                        required: true,
                        message:
                        <span>
                          <Tooltip visible placement="top" title="请填写意见"/>
                        </span>
                      }]
                    })(<TextArea rows={5}/>)
                  }
                  </Form.Item>
                </td>
              </tr>
            </table>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(RtRecommendationFormAddModal);
