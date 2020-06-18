import React, { Component } from 'react';
import { Form, Table, Avatar, Row, Col, Button, Input } from 'antd';
import { connect } from 'dva';
import { v4 } from 'uuid';

const FormItem = Form.Item;

@Form.create()
@connect(({ jobMembersModel, loading }) => ({
  jobMembersModel,
  loading,
}))
export default class projectMembersSelector extends Component {
  modelName = 'jobMembersModel';

  state = {
    pageNumber: 1,
    pageSize: 10,
    filter: {},
  };

  columns = [
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      render: (text, record) => {
        if (record.avatarUrl) return <Avatar shape="square" src={record.avatarUrl} />;
        return <Avatar shape="square" icon="user" />;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
  ];

  componentDidMount() {
    const {
      data: { projectId },
    } = this.props;
    this.findMembers(1, 10, { projectId });
  }

  findMembers = (pageNumber, pageSize, filter) => {
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
    const { pageSize, filter } = this.state;
    const {
      form: { validateFields },
    } = this.props;
    validateFields((error, values) => {
      if (error) return;
      this.setState({ pageNumber: 1 });
      this.findMembers(1, pageSize, { ...filter, ...values });
    });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findMembers(pagination.current, pagination.pageSize, this.state.filter);
  };

  render() {
    const {
      loading: { effects },
      jobMembersModel: { data, total },
      selectedRowKeys,
      changeSelectedRowKeys,
      form: { getFieldDecorator },
      checkedType,
      selectRow,
      renderTableClass,
    } = this.props;
    const { pageNumber, pageSize } = this.state;
    if (data) {
      data.forEach(item => {
        if (item.userId == null) item.userId = v4();
      });
    }
    const rowSelection = {
      type: checkedType,
      selectedRowKeys,
      onChange: changeSelectedRowKeys,
      getCheckboxProps: record => ({
        disabled: typeof record.userId === 'string',
      }),
    };
    // 表格分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
      showTotal: all => `共 ${all} 条`,
    };
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
    return (
      <>
        <div>
          <Form onSubmit={this.handleSearch} layout="horizontal">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col xl={9} md={12} sm={24}>
                <FormItem label="名称" {...formItemLayout}>
                  {getFieldDecorator('name')(<Input placeholder="请输入名称" />)}
                </FormItem>
              </Col>
              <Col xl={9} md={12} sm={24}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('username')(<Input placeholder="请输入用户名" />)}
                </FormItem>
              </Col>
              <Col xl={6} md={12} sm={24} style={{ marginTop: 3 }}>
                <Button type="primary" htmlType="submit">
                  查找
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey="userId"
          loading={effects[`${this.modelName}/fetch`]}
          columns={this.columns}
          dataSource={data}
          pagination={paginationProps}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          size="small"
          onRow={record => ({
            onClick: () => {
              selectRow(record);
            },
          })}
          rowClassName={renderTableClass}
        />
      </>
    );
  }
}
