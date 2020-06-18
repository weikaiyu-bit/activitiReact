import React from 'react';
import { Form, Input, Col, Select, TreeSelect, DatePicker, Row, Table } from 'antd';
import moment from 'moment';
import DictionaryTree from '../../../components/dictionaryTree';
import indexStyles from './index.less';

import styles from '@/dtsea/common/styles/style.less';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { Option } = Select;

@Form.create()
class LegalEntitiesModal extends React.PureComponent {
  countColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '正职领导',
      dataIndex: 'shouldLeadershipCount',
      key: 'shouldLeadershipCount',
    },
    {
      title: '副职领导',
      dataIndex: 'shouldLeadershipNumber',
      key: 'shouldLeadershipNumber',
    },
  ];

  numberColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '行政编制',
      dataIndex: 'adminNumber',
      key: 'adminNumber',
    },
    {
      title: '参照公务员法管理事业编制',
      dataIndex: 'careerParticipationNumber',
      key: 'careerParticipationNumber',
    },
    {
      title: '其他事业编制',
      dataIndex: 'careerNoparticipationNumber',
      key: 'careerNoparticipationNumber',
    },
    {
      title: '工勤编制',
      dataIndex: 'workNumber',
      key: 'workNumber',
    },
    {
      title: '其他编制',
      dataIndex: 'otherNumber',
      key: 'otherNumber',
    },
  ];

  inCountColumns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '领导职数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '正职',
      dataIndex: 'shouldLeadershipCount',
      key: 'shouldLeadershipCount',
    },
    {
      title: '副职',
      dataIndex: 'shouldLeadershipNumber',
      key: 'shouldLeadershipNumber',
    },
  ];

  componentDidMount() {
    this.props.onRefChild(this)
  }

  childMethodsOne = () => {
    const { okHandler } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 调用父类方法进行保存关闭窗口

        values.jgclpzDate = values.createTime
          ? moment(values.jgclpzDate).format('YYYY-MM-DD 00:00:00')
          : values.jgclpzDate
        values.czgyyfglsqDate = values.createTime
          ? moment(values.czgyyfglsqDate).format('YYYY-MM-DD 00:00:00')
          : values.czgyyfglsqDate
        values.czgyyglfspDate = values.createTime
          ? moment(values.czgyyglfspDate).format('YYYY-MM-DD 00:00:00')
          : values.czgyyglfspDate
        okHandler({ ...values })
      }
    })
  }

  areaTreeNodes = tree => {
    if (!tree) return '';
    const newTree = tree.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.areaName} value={item.areaName} key={item.id} dataRef={item}>
            {this.areaTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode title={item.areaName} value={item.areaName} key={item.id} disabled="false" dataRef={item}>
          {this.areaTreeNodes(item.children)}
        </TreeNode>
      );
    });
    return newTree;
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 3 },
      wrapperCol: { span: 24 },
    };
    const { record, areaTree, area, orgCategoryTree, orgLevel, SubjectionTree } = this.props;
    console.log("1111111111",area)
    console.log("122222222222",orgLevel)
    console.log("3333333333333333333",SubjectionTree)
    console.log("444444444444",orgCategoryTree)
    const { orgName, orgShortName, level, category, subordination, gclpzDate,
      czgyyglfspDate, czgyyfglsqDate, czgyyglfspNo, remark } = record;
    const { getFieldDecorator } = this.props.form;
    const dataSource1 = [
      {
        key: '1',
        title: '应配职数',
        shouldLeadershipCount: 2,
        shouldLeadershipNumber: 1,
        adminNumber: 2,
        careerParticipationNumber: 1,
        count: 2,
      },
      {
        key: '2',
        title: '实配职数',
        adminNumber: 2,
        careerParticipationNumber: 1,
        count: 1,
      },
    ];

    const dataSource2 = [
      {
        key: '1',
        title: '编制数',
        adminNumber: 2,
        careerParticipationNumber: 1,
        careerNoparticipationNumber: 0,
        workNumber: 0,
        otherNumber: 0,
      },
      {
        key: '2',
        title: '实有人数',
        shouldLeadershipCount: 2,
        shouldLeadershipNumber: 1,
      },
    ];

    const areaData = {
      tree: area ? [area] : [],
      type: 'tree',
      dataName: 'areaName',
    };
    const orgData = {
      tree: orgCategoryTree,
      type: 'disableParent',
      dataName: 'dataName',
    };

    const datas = {
      tree: orgLevel,
      type: 'list',
      dataName: 'dataName',
    };
    const subjectionData = {
      tree: SubjectionTree,
      type: 'list',
      dataName: 'dataName',
    }
    return (
      <div className={styles.tableListForm}>
        <Form horizontal="true" onSubmit={this.childMethods}>
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="机构名称" {...formItemLayout}>
                {getFieldDecorator('orgName', {
                  rules: [
                    {
                      required: true,
                      message: '机构名称不能为空',
                    },
                  ],
                  initialValue: orgName || '',
                })(<Input placeholder="请输入组织名称" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="机构简称" {...formItemLayout}>
                {getFieldDecorator('orgShortName', {
                  rules: [
                    {
                      required: true,
                      message: '机构名称不能为空',
                    },
                  ],
                  initialValue: orgShortName || '',
                })(<Input placeholder="请输入机构简称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="所在政区" {...formItemLayout}>
                {getFieldDecorator('areaId')(
                  <DictionaryTree {...areaData} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="机构级别" {...formItemLayout}>
                {getFieldDecorator('level')(
                  <DictionaryTree {...datas} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>

              <FormItem label="机构类别" {...formItemLayout}>
                {getFieldDecorator('orgCategory')(
                  <DictionaryTree {...orgData} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="隶属关系" {...formItemLayout}>
                {getFieldDecorator('affiliation')(
                  <DictionaryTree {...subjectionData} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: 24 }}>
            <Col span={12}>
              <FormItem label="机构成立批准日期" {...formItemLayout}>
                {getFieldDecorator('jgclpzDate')(<DatePicker format="YYYY-MM-DD" style={{
                  width: '100%',
                }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="机构成立批准文号" {...formItemLayout}>
                {getFieldDecorator('czgyyfglsqDate')(<Input placeholder="请输入机构简称" style={{
                  width: '100%',
                }} />)}
              </FormItem>
            </Col>
            <div className={indexStyles.labelCustom}>
              <Col span={12}>
                <FormItem label="参照公务员法管理申请日期" {...formItemLayout}>
                  {getFieldDecorator('czgyyglfspDate')(<DatePicker format="YYYY-MM-DD" style={{
                    width: '100%',
                  }} />)}
                </FormItem>
              </Col>
            </div>
            <div className={indexStyles.labelCustom}>
              <Col span={12}>
                <FormItem label="参照公务员管理法申请文号" {...formItemLayout}>
                  {getFieldDecorator('czgyyglfspNo', {
                    rules: [],
                    initialValue: orgName || '',
                  })(<Input placeholder="参照公务员管理法申请文号" />)}
                </FormItem>
              </Col>
            </div>
            <div className={indexStyles.labelCustom}>
              <Col span={12}>
                <FormItem label="参照公务员管理法审批日期" {...formItemLayout}>
                  {getFieldDecorator('czgyyglfspDate')(<DatePicker format="YYYY-MM-DD" style={{
                    width: '100%',
                  }} />)}
                </FormItem>
              </Col>
            </div>
            <div className={indexStyles.labelCustom}>
              <Col span={12}>
                <FormItem label="参照公务员管理法审批文号" {...formItemLayout}>
                  {getFieldDecorator('czgyyglfspNo', {
                    rules: [],
                    initialValue: czgyyglfspNo || '',
                  })(<Input placeholder="请输入机构简称" />)}
                </FormItem>
              </Col>
            </div>
          </Row>
          <Row style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Table columns={this.countColumns} dataSource={dataSource1} size="small" pagination={false} />
            </Col>
            <Col span={1}>
            </Col>
            <Col span={17} >
              <Table columns={this.numberColumns} dataSource={dataSource2} size="small" pagination={false} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Table columns={this.inCountColumns} dataSource={dataSource1} size="small" pagination={false} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 24 }}>
            <Col md={24} sm={24}>
              <FormItem label="备注" {...rekex}>
                {getFieldDecorator('remark', {
                  rules: [],
                  initialValue: remark || '',
                })(<TextArea placeholder="请输入机构简称" style={{ height: '62px' }} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default LegalEntitiesModal;