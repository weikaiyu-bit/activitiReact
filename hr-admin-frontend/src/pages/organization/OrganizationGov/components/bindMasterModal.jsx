import React, { Component } from 'react';
import { Modal, Button, Table, Avatar, Tag, Divider, Popconfirm, Form, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;

@Form.create()
@connect(({ orgPersonModel, loading }) => ({
  orgPersonModel,
  loading,
}))
export default class bindMasterModal extends Component {
  modelName = 'orgPersonModel';

  state = {
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '头像',
      dataIndex: 'portraitUrl',
      render: (text, record) => {
        if (record.avatarUrl) return <Avatar shape="square" src={record.avatarUrl} />;
        return <Avatar shape="square" icon="user" />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.onClickUserName(text, record)}>{text}</a>,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '工号',
      dataIndex: 'workNo',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (text, record) => {
        switch (record.sex) {
          case 0:
            return <Tag>未知</Tag>;
          case 1:
            return <Tag color="blue">男</Tag>;
          case 2:
            return <Tag color="hotpink">女</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '出生年月',
      dataIndex: 'birthday',
      render: text => (text ? moment(text).format('YYYY-MM-DD') : ''), // 格式化时间显示
    },
    {
      title: '人员状态',
      dataIndex: 'state',
      render: (text, record) => {
        /* 匹配对应状态码并输出 */
        const { personStatus } = this.props.orgPersonModel;
        if (personStatus != null) {
          for (let i = 0; i < personStatus.length; i += 1) {
            if (personStatus[i].id == record.statusCode) {
              return <Tag color={personStatus[i].statusColor}>{personStatus[i].statusName}</Tag>;
            }
          }
        }
        return <Tag color="red">未定义</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize } = this.state;
    const { record } = this.props;
    let filter = {};
    if (record.type === 'GROUP') {
      filter = { groupId: record.id };
    } else if (record.type === 'COMPANY') {
      filter = { unitId: record.id };
    } else if (record.type === 'DEPARTMENT') {
      filter = { deptId: record.id };
    }
    this.findPage(pageNumber, pageSize, filter);
  }

  onClickUserName = (name, record) => {
    const { onCancel, onOk } = this.props;
    onOk(name, record.id);
    onCancel();
  };

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    this.setState({ filter });
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { pageSize, filter } = this.state;
    this.setState({ pageNumber: 1 });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.findPage(1, pageSize, { ...filter, ...fieldsValue });
    });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  render() {
    const { pageNumber, pageSize } = this.state;
    const {
      visible,
      title,
      orgPersonModel: { personData = [], total },
      onCancel,
      form: { getFieldDecorator },
      loading: { effects },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
      showTotal: all => `共 ${all} 条`,
    };
    const footer = [
      <Button key="back" onClick={onCancel}>
        取消
      </Button>,
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    console.log('person', personData);
    return (
      <Modal
        title={title}
        width={1024}
        visible={visible}
        onCancel={onCancel}
        footer={footer}
      >
        <div style={{ marginBottom: '16px' }}>
          <Form onSubmit={this.handleSearch} layout="horizontal">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <Button type="primary" htmlType="submit" style={{ marginTop: 3 }}>
                  查找
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey="id"
          loading={effects['orgPersonModel/fetch']}
          columns={this.columns}
          dataSource={personData}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </Modal>
    )
  }
}
