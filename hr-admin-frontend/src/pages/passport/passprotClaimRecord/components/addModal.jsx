import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker, Select } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import moment from 'moment';
import { connect } from 'dva';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ organizationGovModel, bamDictDataModel, loading }) => ({
  organizationGovModel,
  bamDictDataModel,
  loading: loading.models.fetch,
}))
class PassprotClaimRecordAddModal extends Component {
  modelName = 'organizationGovModel';

  modeDict = 'bamDictDataModel';

  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      previewVisible: false,
    };
  }

  componentDidMount() {
    const { filter } = this.state;
    this.findByFilter(filter);
    // 数字字典证件类型查询
    this.findDictAll();
  }

  findDictAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modeDict}/fetch`,
      payload: {
        dataId: 101,
      },
    });
  };

  findByFilter = filter => {
    const { dispatch } = this.props;
    this.setState({
      filter,
    });
    dispatch({
      type: `${this.modelName}/fetchByFilter`,
      payload: {
        ...filter,
      },
    });
  };

  okHandler = () => {
    const { onOk, record, passData } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let certificateType = '';
        let certificateName = '';
        values.beginTime = values.beginTime
          ? moment(values.beginTime).format('YYYY-MM-DD 00:00:00')
          : values.beginTime;// 开始时间
        values.endTime = values.endTime
          ? moment(values.endTime).format('YYYY-MM-DD 00:00:00')
          : values.endTime; // 结束时间
        values.applicationTime = values.applicationTime
          ? moment(values.applicationTime).format('YYYY-MM-DD 00:00:00')
          : values.applicationTime; // 申请时间
        if (values.applicantOrgName) {
          values.applicantOrgId = values.applicantOrgName.value
          values.applicantOrgName = values.applicantOrgName.label
        }
        // if (values.certificateType) {
        //   values.certificateTypeId = values.certificateType.key
        //   values.certificateType = values.certificateType.label
        // }
        if (values.certificateCode) {
          values.certificateCodeId = values.certificateCode.key
          values.certificateCode = values.certificateCode.label
        }
        for (let i = 0; i < passData.length; i += 1) {
          if (passData[i].certificateCode === values.certificateCode) {
            certificateType = passData[i].certificateType;
            certificateName = passData[i].certificateName;
            break;
          }
        }
        onOk(record.id, { ...values, state: '审核中', certificateType, certificateName })
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { headTitle, visible, record, passData } = this.props;
    const { certificateCode, certificateName, certificateType } = passData;
    // certificateCode, certificateName, certificateType,
    const { id, fileId,
      state, destination, beginTime, endTime, applicantId, applicant,
      applicantOrgId, applicantOrgName, applicationTime,
      reason, departmentOpinions, personnelDivisionOpinions,
      leadersOpinions, keeper, remark, creatorId, creator, createTime } = record;
    const {
      loading,
      form,
      organizationGovModel: { tree = [], bamTree, orgLevel, area, orgCategoryTree, SubjectionTree },
    } = this.props;
    const {
      bamDictDataModel,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24 },
    };
    return (
      <>
        <Modal
          title={headTitle}
          width={960}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <div className={styles.tableListForm}>
            <Form horizontal="true" onSubmit={this.okHandler}>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="证件编号" {...formItemLayout}>
                    {
                      getFieldDecorator('certificateCode', {
                        initialValue: certificateCode || '',
                      })(<DictionaryTree dataName="certificateCode" labelInValue tree={passData} type="list" />)
                    }
                    {/* {
                    getFieldDecorator('certificateCode', {
                      initialValue: certificateCode || '',
                      rules: [{ required: true, message: '请输入证件编号！' }],
                    })(<Input />)
                  } */}
                  </FormItem>
                </Col>
                {/* <Col md={10} sm={24}>
                <FormItem label="证件名称" {...formItemLayout} >
                  {
                    getFieldDecorator('certificateName', {
                      initialValue: certificateName || '',
                    })(<Input />)
                  }
                </FormItem>
              </Col> */}

                <Col md={10} sm={24}>
                  <FormItem label="证件状态" {...formItemLayout}>
                    {
                      <Input defaultValue="审核中" disabled={true} />
                    }
                  </FormItem>
                </Col>
              </Row>
                <Row>
                  {/* <Col md={10} sm={24}>
                <FormItem label="证件类型" {...formItemLayout}>
                  {
                    getFieldDecorator('certificateType', {
                      initialValue: certificateType || '',
                    })(<Select
                      showSearch
                      dropdownMatchSelectWidth={false}
                      optionLabelProp="label"
                      placeholder="请选择节点模板"
                      labelInValue
                    >
                      {bamDictDataModel.data !== undefined ? (bamDictDataModel.data.map(item =>
                        <Option value={item.id} key={item.id}
                                label={item.dataName} >{item.dataName}</Option>,
                      )) : (<Option value=""></Option>)
                      }
                    </Select>)
                  }
                </FormItem>
              </Col> */}

                </Row>
                <Row>
                  <Col md={10} sm={24}>
                    <FormItem label="开始时间" {...formItemLayout}>
                      {getFieldDecorator('beginTime')(<DatePicker format="YYYY-MM-DD" style={{
                        width: '100%',
                      }} />)}
                    </FormItem>
                  </Col>
                  <Col md={10} sm={24}>
                    <FormItem label="结束时间" {...formItemLayout}>
                      {getFieldDecorator('endTime')(<DatePicker format="YYYY-MM-DD" style={{
                        width: '100%',
                      }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={10} sm={24}>
                    <FormItem label="申请人" {...formItemLayout}>
                      {
                        getFieldDecorator('applicant', {
                          initialValue: applicant || '',
                          rules: [{ required: true, message: '请填写申请人!' }],
                        })(<Input />)
                      }
                    </FormItem>

                  </Col>
                  <Col md={10} sm={24}>
                    <FormItem label="申请时间" {...formItemLayout}>
                      {getFieldDecorator('applicationTime')(<DatePicker format="YYYY-MM-DD" style={{
                        width: '100%',
                      }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={10} sm={24}>
                    <FormItem label="申请人所在单位" {...formItemLayout}>
                      {
                        getFieldDecorator('applicantOrgName', {
                          initialValue: applicantOrgName || '',
                        })(<DictionaryTree dataName="orgName" labelInValue tree={tree} type="tree" />)
                      }
                    </FormItem>
                  </Col>
                  <Col md={10} sm={24}>
                    <FormItem label="保管人" {...formItemLayout}>
                      {
                        getFieldDecorator('keeper', {
                          initialValue: keeper || '',
                        })(<Input />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={20} sm={20}>
                    <FormItem label="目的地" {...rekex}>
                      {
                        getFieldDecorator('destination', {
                          initialValue: destination || '',
                        })(<Input />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={20} sm={20}>
                    <FormItem label="申请原因" {...rekex}>
                      {
                        getFieldDecorator('reason', {
                          initialValue: reason || '',
                          rules: [{ required: true, message: '请填写申请原因!' }],
                        },
                        )(<TextArea />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={20} sm={20}>
                    <FormItem label="人事处意见" {...rekex}>
                      {
                        getFieldDecorator('personnelDivisionOpinions', {
                          initialValue: personnelDivisionOpinions || '',
                        })(<TextArea />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={20} sm={20}>
                    <FormItem label="本部门领导意见" {...rekex}>
                      {
                        getFieldDecorator('departmentOpinions', {
                          initialValue: departmentOpinions || '',
                        })(<TextArea />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={20} sm={20}>
                    <FormItem label="单位领导意见" {...rekex}>
                      {
                        getFieldDecorator('leadersOpinions', {
                          initialValue: leadersOpinions || '',
                        })(<TextArea />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col md={20} sm={20}>
                    <FormItem label="备注" {...rekex}>
                      {
                        getFieldDecorator('remark', {
                          initialValue: remark || '',
                        })(<TextArea />)
                      }
                    </FormItem>
                  </Col>
                </Row>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PassprotClaimRecordAddModal);
