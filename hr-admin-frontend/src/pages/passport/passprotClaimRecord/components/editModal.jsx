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
class PassprotClaimRecordEditModal extends Component {
  modelName = 'organizationGovModel';

  modeDict = 'bamDictDataModel';

  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

/** ********************************************************************************************* */

  componentDidMount() {
    this.findByFilter({ });
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
    const { onOk, record, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
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
          // applicantOrgName: { value: 111, label: 'xxxxx' }
          values.applicantOrgId = values.applicantOrgName.value;
          values.applicantOrgName = values.applicantOrgName.label;
          // applicantOrgName: 'xxxxx'
        }
        onOk(record.id, {
          ...record,
          ...values,
          certificateTypeId: values.certificateType.key,
          certificateType: values.certificateType.label,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /** *********************************************************************************** */

  render() {
    const { headTitle, visible, record } = this.props;
    const { id, fileId, certificateCode,
      certificateName, certificateType, certificateTypeId, state,
      destination, beginTime, endTime, applicantId,
      applicant, applicantOrgId, applicantOrgName,
      applicationTime, reason, departmentOpinions,
      personnelDivisionOpinions, leadersOpinions, keeper,
      remark, creatorId, creator, createTime } = record
      console.log('applicationTime', applicationTime)
    const { getFieldDecorator } = this.props.form;
    const Tx = {
      label: applicantOrgName,
      value: applicantOrgId,
    }
    const Lx = {
      key: certificateTypeId,
      label: certificateType,
    }
    const {
      organizationGovModel: { tree = [] },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24 },
    };
    const {
      bamDictDataModel,
    } = this.props;
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
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="证件名称" {...formItemLayout}>
                    {
                      getFieldDecorator('certificateName', {
                        initialValue: certificateName || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="证件类型" {...formItemLayout}>
                    {
                      getFieldDecorator('certificateType', {
                        initialValue: Lx || '',
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
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="证件状态" {...formItemLayout}>
                    {
                      getFieldDecorator('state', {
                        initialValue: state || '',
                      })(
                      <Select>
                        <Option value="已领取">已领取</Option>
                        <Option value="保管中">保管中</Option>
                      </Select>,
                        )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="开始时间" {...formItemLayout}>
                    {getFieldDecorator('beginTime',
                    {
                      initialValue: beginTime ? moment(beginTime, 'YYYY-MM-DD') : null,
                    })(<DatePicker format="YYYY-MM-DD" style={{
                      width: '100%',
                    }}/>)}
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="结束时间" {...formItemLayout}>
                    {getFieldDecorator('endTime', {
                      initialValue: endTime ? moment(endTime, 'YYYY-MM-DD') : null,
                    })(<DatePicker format="YYYY-MM-DD" style={{
                      width: '100%',
                    }}/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="申请人" {...formItemLayout}>
                    {
                      getFieldDecorator('applicant', {
                        initialValue: applicant || '',
                      })(<Input />)
                    }
                  </FormItem>

                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="申请时间" {...formItemLayout}>
                    {getFieldDecorator('applicationTime', {
                      initialValue: applicationTime ? moment(applicationTime, 'YYYY-MM-DD') : null,
                    })(<DatePicker format="YYYY-MM-DD" style={{
                      width: '100%',
                    }}/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="申请人所在单位" {...formItemLayout}>
                    {
                      getFieldDecorator('applicantOrgName', {
                        initialValue: Tx,
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
                      })(<TextArea />)
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

export default Form.create()(PassprotClaimRecordEditModal);
