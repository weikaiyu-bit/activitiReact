import React, {Component} from 'react';
import {Drawer, Row, Col, Form, Upload, Avatar} from 'antd';
import styles from "@/pages/reserveTalent/rtRecommendationForm/css/style.less";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import moment from "moment";


class TalentReviewViewDrawer extends Component {

  state = {
    imageUrl: '',
  }

  close = () => {
    const {onClose} = this.props;
    if (onClose) onClose();
  };

  renderTalentReviewView = data =>{
    const {
      id, categoryId, fileId, name, sex, birth, national,
      nativePlace, workTime, maritalStatus, health, education,
      educationMajor, orgName, positionName, politicalOrientation,
      phone, performanceProfile, leaderEvaluation, reason,
      recommenderOpinion, recommenderId, recommender,
      recommendedTime, resume, photoUrl, remark,
      voteCount, state, creatorId, createTime
    } = data;
    console.log(data)
    const { imageUrl } = this.state;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className={styles.addModal} >
        <Form horizontal="true" onSubmit={this.okHandler} >
          <div className={styles.addModal} style={{ textAlign: 'center' }}>
            <Form horizontal="true" onSubmit={this.okHandler} >
              <table align="center" valign="center" border="true" style={{ width: '100%' }}>
                <tr>
                  <td rowSpan="2">被推荐人姓名</td>
                  <td rowSpan="2" style={{ padding: 0, margin: 0,}} >
                    {name}
                  </td>
                  <td>性别</td>
                  <td>{sex}</td>
                  <td>出生年月</td>
                  <td>{birth ? moment(birth).format("YYYY年MM月DD日") : birth}</td>
                  <td rowSpan="3" style={{ padding: 0, marginLeft: 0, height: '110px' }}>
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
                  <td>{national}
                  </td>
                  <td>籍贯</td>
                  <td>{nativePlace}</td>
                </tr>
                <tr>
                  <td>婚姻状况</td>
                  <td>{maritalStatus}</td>
                  <td>健康状况</td>
                  <td>{health}</td>
                  <td>政治面貌</td>
                  <td>{politicalOrientation}</td>
                </tr>
                {/* 第三行 */}
                <tr>
                  <td>参加工作时间</td>
                  <td> {workTime ? moment(workTime).format("YYYY年MM月DD日") : workTime}</td>
                  <td>所在单位</td>
                  <td colSpan="2"> {orgName} </td>
                  <td>联系电话</td>
                  <td>{phone}</td>
                </tr>
                <tr>
                  <td>业绩简介</td>
                  <td colSpan="6" style={{ height: '200px' }}>{performanceProfile}</td>
                </tr>
                <tr>
                  <td>推荐人意见</td>
                  <td colSpan="6" style={{ height: '200px' }}>{recommenderOpinion} </td>
                </tr>
                <tr>
                  <td>推荐理由</td>
                  <td colSpan="6" style={{ height: '200px' }}> {reason} </td>
                </tr>
                <tr>
                  <td>领导评价</td>
                  <td colSpan="6" style={{ height: '200px' }}>{leaderEvaluation}</td>
                </tr>
              </table>
            </Form>
          </div>
        </Form>
      </div>
    );
  }

  render() {
    const { data, visible } = this.props;
    return (
      <Drawer width="50%" visible={visible} onClose={this.close} title="详细信息">
        {this.renderTalentReviewView(data)}
      </Drawer>
    )
  }
}

export default TalentReviewViewDrawer;
