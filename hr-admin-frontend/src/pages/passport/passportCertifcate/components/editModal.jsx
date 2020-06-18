import React, { Component } from 'react';
import { Modal, Form, Input, Col, Row, DatePicker, Select } from 'antd';
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
class PassportCertificateEditModal extends Component {
  modeDict = 'bamDictDataModel';

  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ***************************************************************************************** */
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
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
          .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
          registrationTime: values.registrationTime ? moment(values.registrationTime)
          .format('YYYY-MM-DD HH:mm:ss') : values.registrationTime,
          posistionCategoryId: values.posistionCategory.value,
          posistionCategory: values.posistionCategory.label,
          certificateTypeId: values.certificateType.value,
          certificateType: values.certificateType.label,
          ownerOrgNameId: values.ownerOrgName.value,
          ownerOrgName: values.ownerOrgName.label,
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
    const { headTitle, visible, record, posistionCategoryDictData } = this.props;
   const { id, fileId, title, certificateCode,
     certificateName, certificateType, certificateTypeId, idCard,
     posistionCategory, ownerId, owner, posistionCategoryId,
     ownerOrgName, ownerOrgNameId, state, keeper, registrationTime,
     remark, creatorId, createTime } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24 },
    };
    const certificateTypeObj = {
      key: certificateTypeId,
      label: certificateType,
    };
    const {
      bamDictDataModel, organizationGovModel: { tree = [] },
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
            <Form onSubmit={this.okHandler} horizontal="true" {...formItemLayout}>
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
                  <FormItem label="证件类型" {...formItemLayout}>
                  {
                      getFieldDecorator('certificateType', {
                        initialValue: certificateTypeObj || '',
                      })(<Select
                        showSearch
                        dropdownMatchSelectWidth={false}
                        optionLabelProp="label"
                        labelInValue
                      >
                        {bamDictDataModel.data !== undefined ? (bamDictDataModel.data.map(item =>
                          <Option value={item.id} key={item.id} label={item.dataName} >{item.dataName}</Option>,
                        )) : (<Option value=""></Option>)
                        }
                      </Select>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="证件名称" {...formItemLayout} >
                    {
                      getFieldDecorator('certificateName', {
                        initialValue: certificateName || '',
                      })(<Input />)
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
                      </Select>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="持有人" {...formItemLayout}>
                    {
                      getFieldDecorator('owner', {
                        initialValue: owner || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="编制类型" {...formItemLayout}>
                    {
                      getFieldDecorator('posistionCategory', {
                        initialValue: { key: posistionCategoryId, label: posistionCategory } || '',
                      })(
                      <DictionaryTree type="list" tree={posistionCategoryDictData} labelInValue />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="持有人所在单位" {...formItemLayout}>
                    {/* {
                      getFieldDecorator('ownerOrgName', {
                        initialValue: ownerOrgName || '',
                      })(<Input />)
                    } */}
                    {
                      getFieldDecorator('ownerOrgName', {
                        initialValue: { key: ownerOrgNameId, label: ownerOrgName } || '' })(<DictionaryTree dataName="orgName" labelInValue tree={tree} type="tree" />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="身份证号" {...formItemLayout}>
                    {
                      getFieldDecorator('idCard', {
                        initialValue: idCard || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="保管人" {...formItemLayout}>
                    {
                      getFieldDecorator('keeper', {
                        initialValue: keeper || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="登记时间" {...formItemLayout}>
                    {
                      getFieldDecorator('registrationTime', {
                        initialValue: registrationTime ? moment(registrationTime, 'YYYY-MM-DD HH:mm:ss') : '',
                      })(
                        <DatePicker bordered={false} style={{ width: '100%' }}/>,
                      )
                    // getFieldDecorator('registrationTime')(<DatePicker format="YYYY-MM-DD" style={{
                    //   width: '100%',
                    // }}/>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="备注" {...rekex}>
                    {getFieldDecorator('remark', {
                      rules: [],
                      initialValue: remark || '',
                    })(<TextArea placeholder="请输入机构简称" style={{ height: '62px' }}/>)}
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

export default Form.create()(PassportCertificateEditModal);
