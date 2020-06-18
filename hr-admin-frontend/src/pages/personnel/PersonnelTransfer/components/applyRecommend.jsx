import React, { Component } from 'react';
import { Modal, Form, Input, Tree, Radio, Table, message, Checkbox, Cascader, Popconfirm, Card, TreeSelect, Icon, TimePicker, DatePicker, Tag, Divider, Button, Row, Select, Col, Descriptions } from 'antd';
import moment from 'moment'
import { connect } from 'dva';
import applyTransferStyle from '../css/applyTransfer.less'
import DictionaryTree from '../../../components/dictionaryTree';

const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;

@connect(({ personnelTransferModal, pfileWorkRecordModel, loading }) => ({
  personnelTransferModal,
  pfileWorkRecordModel,
  loading,
}))
class applyRecommend extends Component {
  modelName = 'personnelTransferModal';

  state = {
    // eslint-disable-next-line react/no-unused-state
    selectedRowKeys: [],
    filter: {
      fileId: this.props.record.id,
      approvedState: '已批准',
    },
    pageNumber: 1,
    pageSize: 3,
    // eslint-disable-next-line react/no-unused-state
    value: '',
    searchValue: '',
    // eslint-disable-next-line react/no-unused-state
    isMainPosition: '', // 是否主职务
    isLeader: '', // 是否领导职务
    isLeaderMember: '', // 是否领导成员
    isUnconventionallyPromote: '', // 是否破格提拔
    changeCode: 'true',
    changeCodeFlag: true,
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: text => <a>{text}</a>,
    },
    {
      title: '原任职单位',
      dataIndex: 'b4OrgName',
      key: 'b4OrgName',
    },
    {
      title: '原职务名称',
      dataIndex: 'b4PositionName',
      key: 'b4PositionName',
    },
    {
      title: '任职状态',
      dataIndex: 'changeCode',
      key: 'changeCode',
      width: 80,
      render: changeCode => {
        switch (changeCode) {
          case 'true':
            return <Tag style={{ width: '64px' }} color="orange">在职</Tag>;
          case 'false':
            return <Tag style={{ width: '64px' }} color="lime">已辞退</Tag>;
          default:
            return <Tag style={{ width: '64px' }} >未知 </Tag>;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Popconfirm title="您确定要删除往期职务记录吗？" onConfirm={() => this.remove([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
      ellipsis: true,
      width: 80,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter); // 页面加载查询职务信息表
    this.findpromotionAppointment({ dataId: 93 }); // 查询提拔选用方式
    this.findLevel({ dataId: 96 }); // 职级
  }

  // 删除调用记录
  remove = ids => {
    const { pageNumber, pageSize, filter } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/remove',
      payload: { ids },
      callback: res => {
        if (res.code === 'SUCCESS') {
          message.success('删除成功');
          this.findPage(pageNumber, pageSize, filter); // 页面加载查询职务信息表
        } else {
          message.error('删除失败')
        }
      },
    });
  }

  findLevel = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/fetchLevel',
      payload: {
        ...filter,
      },
    });
  }

  findpromotionAppointment = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/fetchOrgCategory',
      payload: {
        ...filter,
      },
    });
  }

  okHandler = () => {
    const {
      record: { workName, rank, rankTime, workTime,
        positionName, id, name, sex, birth, heducation },
    } = this.props;
    const {
      isMainPosition, isLeader, isLeaderMember, isUnconventionallyPromote, changeCode,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values :>> ', values.afterServicedTime);
      if (!err) {
        const {
          afterOrgName, afterPositionName, docNo, memberCategory,
          reason, promotionAppointment, afterLevel, removalTime, removalNo, afterServicedTime,
        } = values;
        let afterOrgNameAdd = '';
        for (let i = 0; i < afterOrgName.length; i += 1) {
          if ((afterOrgName.length - 1) === i) {
            afterOrgNameAdd += `${afterOrgName[i]}`;
          } else {
            afterOrgNameAdd += `${afterOrgName[i]}/`;
          }
        }
        const pfileWorkRecord = {
          fileId: id,
          docNo,
          name,
          sex,
          birth: moment(birth).format('YYYY-MM-DD HH:mm:ss'),
          workTime: moment(workTime).format('YYYY-MM-DD HH:mm:ss'), // 参加工作时间
          heducation, // 最高学历
          b4OrgName: workName, // 原单位
          b4PositionName: positionName, // 职务名称
          b4Level: rank, // 职级
          b4ServicedTime: moment(rankTime).format('YYYY-MM-DD HH:mm:ss'), // 变动前职级时间
          afterOrgName: afterOrgNameAdd, // 新单位
          memberCategory, // 成员类别
          afterPositionName, // 职务名称
          promotionAppointment: promotionAppointment.label, // 选拔任用方式
          reason, // 职务变动原因综述
          afterLevel: afterLevel.label, // 新职级
          // b4AppointmentTime: moment(values['range-time-picker'][0]._d).format('YYYY-MM-DD HH:mm:ss'), //调入开始时间
          // afterservicedTime: moment(values['range-time-picker'][1]._d).format('YYYY-MM-DD HH:mm:ss'), //调入结束时间
          afterServicedTime: moment(afterServicedTime).format('YYYY-MM-DD HH:mm:ss'),
          removalTime: removalTime ? moment(removalTime).format('YYYY-MM-DD HH:mm:ss') : '',
          removalNo,
          isMainPosition, // 是否主职务
          isLeader, // 是否领导职务
          isLeaderMember, // 是否领导成员
          isUnconventionallyPromote, // 是否破格提拔
          changeCode, // 在职或任免
          approvedState: '待审核',
        }
        this.addRecord(pfileWorkRecord);
        this.cancelHandel();
      }
    });
  };


  findPage = (pageNumber, pageSize, fileId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/fetch',
      payload: {
        ...fileId,
        pageNumber,
        pageSize,
      },
      // callback: response => {
      //   message.success('异动申请成功，待审核');
      // }
    });
  }

  addRecord = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelTransferModal/addRecord',
      payload: { ...record },
      callback: response => {
        message.success('异动申请成功，待审核');
      },
    });
  }

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  __TransferDepartment() {
    const {
      personnelTransferModal: { tree },
    } = this.props;
  }

  renderOrganizationTree = () => {
    const {
      personnelTransferModal: { tree },
    } = this.props;
    return (
      <>
        {
          this.renderTreeNodes(tree)
        }
      </>
    );
  }

  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.orgName.indexOf(searchValue);
      const beforeStr = item.orgName.substr(0, index);
      const afterStr = item.orgName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.orgName}</span>
          );
      if (item.children) {
        return (
          <TreeNode value={afterStr} title={title} key={item.id} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={afterStr} title={title} key={item.id} />;
    });
    return newTree;
  };

  // 选择调入的部门
  onChangeTree = (value, query, item) => {
    this.setState({ value });
  }

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  }

  // 是否主职务
  isMainPositionFun = item => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isMainPosition: item.target.checked,
    })
  }

  // 是否领导职务
  isLeaderFun = item => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isLeader: item.target.checked,
    })
  }

  // 是否领导成员
  isLeaderMemberFun = item => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isLeaderMember: item.target.checked,
    })
  }

  // 是否领导成员
  isUnconventionallyPromoteFun = item => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isUnconventionallyPromote: item.target.checked,
    })
  }

  // 异动代码
  changeCodeFun = item => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      changeCode: item.target.checked,
      changeCodeFlag: item.target.value === '在职',
    })
    if (!this.state.changeCodeFlag) {
      this.props.form.resetFields(['removalTime', 'removalNo'])
    }
  }

  render() {
    // const { personnelTransferModal: { tree }} = this.props; 其他单位树数据
    // recordLevelTree职级数据    recordCategoryTree选拔任用方式数据
    // const {  pfileWorkRecordModel: {recordLevelTree,recordCategoryTree } } = this.props;
    const {
      title,
      visible,
      record,
      personnelTransferModal: { tree },
      pfileWorkRecordModel: { data, total, recordCategoryTree, recordLevelTree },
      loading: { effects },
    } = this.props;
    const {
      afterServicedTime,
    } = record;
    const { pageNumber, pageSize, changeCodeFlag } = this.state;
    const { getFieldDecorator } = this.props.form;
    // const rangeConfig = {
    //   rules: [{ type: 'array', required: true, message: '请选择调入的部门' }],
    // };
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }

    const promotionat = {
      tree: recordCategoryTree,
      type: 'disableParent',
      dataName: 'dataName',
      labelInValue: true,
    }

    // const recordLevel = {
    //   tree: recordLevelTree,
    //   type: 'disableParent',
    //   dataName: 'dataName',
    //   labelInValue: true,
    // }

    const position = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSizeOptions: ['3', '6', '9'],
      defaultPageSize: 3,
      hideOnSinglePage: true,
      pageSize,
      total,
    }
    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
          okText="推荐晋升"
        >
          <Card>
            <Table
              bordered
              loading={effects['pfileWorkRecordModel/fetch']}
              onChange={this.handleTableChange}
              size="middle"
              pagination={position}
              columns={this.columns}
              dataSource={data} />
          </Card>
          <Card>
            <Form onSubmit={this.okHandler} name="validate_other">
              <Form.Item label="调入单位" {...formItemLayout}>
                {getFieldDecorator('afterOrgName', {
                  rules: [{ required: true, message: '请输入调入单位' }],
                })(
                  <Cascader
                    fieldNames={{ label: 'orgName', value: 'orgName', children: 'children' }}
                    options={tree}
                    placeholder="请输入调入单位"
                  />,
                )}
              </Form.Item>
              <Form.Item label="调入职务名称" {...formItemLayout}>
                {getFieldDecorator('afterPositionName', {
                  rules: [{ required: true, message: '调入职务名称' }],
                })(
                  <Input
                    placeholder="请输入职务名称"
                  />,
                )}
              </Form.Item>
              <Form.Item label="成员类别" placeholder="请选择成员类别" {...formItemLayout}>
                {getFieldDecorator('memberCategory', {
                  rules: [{ required: true, message: '请选择成员类别' }],
                })(
                  <Select placeholder="请选择成员类别">
                    <Option value="正职">正职</Option>
                    <Option value="副职">副职</Option>
                    <Option value="其他">其他</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="职务状态" {...formItemLayout}>
                <Radio.Group defaultValue="在职">
                  <Radio value="在职" onChange={this.changeCodeFun}>在职</Radio>
                  <Radio value="任免" onChange={this.changeCodeFun} > 任免</Radio>
                </Radio.Group>,
              </Form.Item>
              <Form.Item name="checkbox-group" label="其他选择" {...formItemLayout}>
                <Row>
                  <Col span={24}>
                    <Checkbox value="主职务" onChange={this.isMainPositionFun}>主职务</Checkbox>
                    <Checkbox value="领导职务" onChange={this.isLeaderFun}>领导职务</Checkbox>
                    <Checkbox value="领导成员" onChange={this.isLeaderMemberFun}>领导成员</Checkbox>
                    <Checkbox value="破格提拔" onChange={this.isUnconventionallyPromoteFun}>破格提拔</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item className={applyTransferStyle.applyTransfer} label="调入时间" {...formItemLayout}>
                {getFieldDecorator('afterServicedTime')(
                  <DatePicker />,
                )}
              </Form.Item>
              <Form.Item label="任职文号" {...formItemLayout}>
                {getFieldDecorator('docNo', {
                  rules: [{ required: true, message: '请输入任职文号' }],
                })(
                  <Input
                    placeholder="请输入任职文号"
                  />,
                )}
              </Form.Item>
              <Form.Item className={applyTransferStyle.applyTransfer} label="任免时间" {...formItemLayout}>
                {changeCodeFlag ?
                  getFieldDecorator('removalTime', {
                  })(
                    <DatePicker disabled={changeCodeFlag} />,
                  ) :
                  getFieldDecorator('removalTime', {
                    rules: [{ required: true, message: '请选择任免时间' }],
                    initialValue: '',
                  })(
                    <DatePicker disabled={changeCodeFlag} />,
                  )
                }
              </Form.Item>
              <Form.Item label="免职文号" {...formItemLayout}>
                {changeCodeFlag ?
                  getFieldDecorator('removalNo', {
                    initialValue: '',
                  })(
                    <Input
                      disabled={changeCodeFlag}
                      placeholder="请输入任职文号"
                    />,
                  ) :
                  getFieldDecorator('removalNo', {
                    rules: [{ required: true, message: '请输入免职文号' }],
                  })(
                    <Input
                      disabled={changeCodeFlag}
                      placeholder="请输入任职文号"
                    />,
                  )
                }
              </Form.Item>

              <Form.Item label="选拔任用方式" {...formItemLayout}>
                {getFieldDecorator('promotionAppointment')(
                  <DictionaryTree {...promotionat} />,
                )}
              </Form.Item>

              <Form.Item label="职务变动原因综述" {...formItemLayout}>
                {getFieldDecorator('reason', {
                  rules: [{ required: true, message: '请输入职务变动原因综述' }],
                })(
                  <TextArea rows={4} placeholder="请输入职务变动原因综述" />,
                )}
              </Form.Item>
            </Form>
          </Card>
        </Modal >
        {visible ? this.__TransferDepartment : ''}
      </>
    );
  }
}

export default Form.create()(applyRecommend);
