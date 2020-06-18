import React  from 'react';
import { Form, Input, Col, Select, Row } from 'antd';

// import moment from 'moment';

import styles from '@/dtsea/common/styles/style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
// const { Option } = Select;

@Form.create()
class InstitutionalGroupingModal extends React.PureComponent {
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

  childMethodsThere = () => {
    const { okHandler } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 调用父类方法进行保存关闭窗口
        okHandler({ ...values })
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 3 },
      wrapperCol: { span: 24 },
    };
    const { record } = this.props;
    const { orgName, orgShortName, area, level, category, subordination, gclpzDate,
      czgyyglfspDate, czgyyfglsqDate, czgyyglfspNo, remark } = record;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.tableListForm}>
        <Form horizontal="true" onSubmit={this.childMethods}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="备注" {...rekex}>
              {getFieldDecorator('remark', {
                rules: [],
                initialValue: remark || '',
              })(<TextArea placeholder="请输入机构简称" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
      </div>
    );
  }
}
export default InstitutionalGroupingModal;
