/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, message, Avatar } from 'antd';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

class RtRecommendationFormEditModal extends Component {
  state = {
    selectedRowKeys: [],
    imageUrl: null,
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

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

  /** ********************************************************************************************* */

  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    const {
      name, sex, birth, national, nativePlace, workTime,
      maritalStatus, health, education, educationMajor,
      orgName, positionName, politicalOrientation, phone,
      workExperience, reason, recommenderOpinion, recommenderId,
      recommender, recommendedTime, photoUrl, remark, state, creatorId,
      createTime } = record;
    validateFields((err, values) => {
      if (!err) {
        console.log('values.national :>> ', values.national.label);
        onOk(record.id, {
          ...record,
          ...values,
          national: values.national.label,
          politicalOrientation: values.politicalOrientation.label,
          workTime: values.workTime === '' ? null : moment(values.workTime).format('YYYY-MM-DD HH:mm:ss'),
          birth: values.birth === '' ? null : moment(values.birth).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record, nationData, politicalOrientationData } = this.props;
    const { id, categoryId, fileId, name, sex, birth, national, nativePlace, workTime, maritalStatus, health, education, educationMajor, orgName, positionName, politicalOrientation, phone, workExperience, reason, recommenderOpinion, recommenderId, recommender, recommendedTime, photoUrl, remark, state, creatorId, createTime } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const nation = {
      tree: nationData,
      type: 'list',
      labelInValue: true,
    };
    const politicalOrienta ={
      tree: politicalOrientationData,
      type: 'list',
      labelInValue: true,
    }
    console.log("nationData",nationData)
    console.log("politicalOrientationData",politicalOrientationData)
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
          <Form horizontal="true" onSubmit={this.okHandler}>
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
                  getFieldDecorator('sex', {
                    initialValue: sex || '',
                  })(<Select >
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>)
                }</td>
                <td>出生年月</td>
                <td>{
                  getFieldDecorator('birth', {
                    initialValue: birth ? moment(birth, dateFormat) : '',
                  })(<DatePicker />)
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
                    getFieldDecorator('national', {
                      initialValue: { label: national } || '',
                    })(<DictionaryTree {...nation} />)
                  }
                </td>
                <td>籍贯</td>
                <td>{
                  getFieldDecorator('nativePlace', {
                    initialValue: nativePlace || '',
                  })(<Input />)
                }</td>
              </tr>
              <tr>
                <td>婚姻状况</td>
                <td>{
                  getFieldDecorator('maritalStatus', {
                    initialValue: maritalStatus || '',
                  })(<Select >
                    <Option value="已婚">已婚</Option>
                    <Option value="未婚">未婚</Option>
                    <Option value="丧偶">丧偶</Option>
                  </Select>)
                }</td>
                <td>健康状况</td>
                <td>{
                  getFieldDecorator('health', {
                    initialValue: health || '',
                  })(<Input />)
                }</td>
                <td>政治面貌</td>
                <td>{
                  getFieldDecorator('politicalOrientation', {
                    initialValue: { label: politicalOrientation} || '',
                  })(<DictionaryTree {...politicalOrienta} />)
                }</td>
              </tr>
              {/* 第三行 */}
              <tr>
                <td>参加工作时间</td>
                <td>
                  <FormItem>
                    {
                      getFieldDecorator('workTime', {
                        initialValue: workTime ? moment(workTime, 'YYYY-MM-DD') : '',
                      })(<DatePicker />)
                    }
                  </FormItem>
                </td>
                <td>所在单位</td>
                <td colSpan="2">
                  {
                    getFieldDecorator('orgName', {
                      initialValue: orgName || '',
                    })(<Input />)
                  }
                </td>
                <td>联系电话</td>
                <td>{
                  getFieldDecorator('phone', {
                    initialValue: phone || '',
                  })(<Input />)
                }</td>
              </tr>
              <tr>
                <td>主要工作经历</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('workExperience', {
                      initialValue: workExperience || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
              <tr>
                <td>推荐理由（包括被推荐人德菜表现、突出特点）</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('reason', {
                      initialValue: reason || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
              <tr>
                <td>推荐意见</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('recommenderOpinion', {
                      initialValue: recommenderOpinion || '',
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

export default Form.create()(RtRecommendationFormEditModal);
