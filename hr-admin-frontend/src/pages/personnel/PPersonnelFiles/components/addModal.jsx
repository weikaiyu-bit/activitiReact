import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Tabs } from 'antd';
import '@/assets/css/style.css'

import { connect } from 'dva';
import styles from '../css/style.less';
import BasicInformationOne from './BasicInformationOne'
import BasicInformationTwo from './BasicInformationTwo'
import BasicInformationThree from './BasicInformationThree'

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ rtRecommendationFormModel }) => ({
  rtRecommendationFormModel,
}))
class PPersonnelFilesAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      console.log("valuesvalues", values)
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

  onChange = (key) => {
    console.log("keyyyy", key);
  }


  componentDidMount() {

    this.findNation({ dataId: 97 });
  }

  // 民族
  findNation = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rtRecommendationFormModel/fetchNation',
      payload: {
        ...filter,
      },
    });
  };

  render() {
    const { title, visible, record, rtRecommendationFormModel: { nationData } } = this.props;
    const {
      rsOrgId,
      idCard,
      posistionCategory,
      manageCategory,
      personnelCategory,
      serviceTime,
      rank,
    } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const BasicInformationOneData = {
      record,
      nationData,
      getFieldDecorator,
    }

    return (
      <>
        <Modal
          className="add-personnel-modal"
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" className={styles.formControl} onSubmit={this.okHandler} initialValues={{ remember: true }}>
            <Row>
              <Col span={18}>
                <Tabs defaultActiveKey="1-1" onChange={this.onChange}>
                  <TabPane tab="任免审批表（一）" key="1-1">
                    <BasicInformationOne {...BasicInformationOneData} />
                  </TabPane>
                  <TabPane tab="任免审批表（二）" key="1-2">
                    <BasicInformationTwo {...BasicInformationOneData} />
                  </TabPane>
                  <TabPane tab="其他信息" key="1-3">
                    <BasicInformationThree {...BasicInformationOneData} />
                  </TabPane>
                </Tabs>

              </Col>
              <Col span={5} offset={1}>
                <div className="addModalForm">
                  <span style={{ marginBottom: '10px' }}>现职人员</span>
                  <FormItem label="统计关系所在单位" >
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                        rules: [{ required: true, message: 'Please input your username!' }],
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="身份证号">
                    {
                      getFieldDecorator('idCard', {
                        initialValue: idCard || '',
                        rules: [{ required: true, message: 'Please input your username!' }],
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="管理类别">
                    {
                      getFieldDecorator('manageCategory', {
                        initialValue: manageCategory || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="人员类别">
                    {
                      getFieldDecorator('personnelCategory', {
                        initialValue: personnelCategory || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="编制类型">
                    {
                      getFieldDecorator('posistionCategory', {
                        initialValue: posistionCategory || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="职位类别">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="现领导职务">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="现领导职务事件">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="现职级">
                    {
                      getFieldDecorator('rank', {
                        initialValue: rank || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="任现职级事件">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="任相当层次职务职级事件">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="公务员登记时间">
                    {
                      getFieldDecorator('serviceTime', {
                        initialValue: serviceTime || '',
                      })(<Input />)
                    }
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PPersonnelFilesAddModal);
