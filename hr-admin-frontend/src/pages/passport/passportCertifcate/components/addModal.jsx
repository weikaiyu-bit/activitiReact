import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker, Select } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import moment from 'moment';
import { connect } from 'dva';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { Option } = Select;

@connect(({ organizationGovModel, bamDictDataModel, loading }) => ({
  organizationGovModel,
  bamDictDataModel,
  loading: loading.models.fetch,
}))

class PassportCertificateAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }

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
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.registrationTime = values.registrationTime
          ? moment(values.registrationTime).format('YYYY-MM-DD 00:00:00')
          : values.registrationTime;// 开始时间
        onOk(record.id, {
          ...values,
          posistionCategoryId: values.posistionCategory.value,
          posistionCategory: values.posistionCategory.label,
          certificateType: values.certificateType.label,
        });
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { headTitle, visible, record, posistionCategoryDictData } = this.props;
    const { id, fileId, title, certificateCode, certificateName,
      certificateType, certificateTypeId, idCard, posistionCategory, ownerId, owner,
      ownerOrgId, ownerOrgName, state, keeper,
      registrationTime, remark, creatorId, createTime } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24 },
    };
    const Lx = {
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
            <Form onSubmit={this.okHandler} horizontal="true" {...formItemLayout} >
            <Row>
              <Col md={10} sm={24}>
                <FormItem label="证件编号" {...formItemLayout}>
                  {
                    getFieldDecorator('certificateCode', {
                      initialValue: certificateCode || '',
                      rules: [{ required: true, message: '请输入证件编号' }],
                    })(<Input />)
                  }
                </FormItem>
              </Col>
              <Col md={10} sm={24}>
                <FormItem label="证件类型" {...formItemLayout}>
                {
                      getFieldDecorator('certificateType', {
                        initialValue: Lx || '',
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
                    })(<Select>
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
                      initialValue: posistionCategory || '',
                    })(<DictionaryTree type="list" tree={posistionCategoryDictData} labelInValue />)
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
                  getFieldDecorator('applicantOrgName')(<DictionaryTree dataName="orgName" labelInValue tree={tree} type="tree" />)
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
                  {getFieldDecorator('registrationTime')(<DatePicker format="YYYY-MM-DD" style={{
                    width: '100%',
                  }}/>)}
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

export default Form.create()(PassportCertificateAddModal);
