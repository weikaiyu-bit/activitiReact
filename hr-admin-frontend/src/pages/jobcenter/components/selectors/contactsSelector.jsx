import React, { Component } from 'react';
import { Avatar, Table, Form, Row, Col, Input, Button } from 'antd';
import { v4 } from 'uuid';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ myJobsModel, loading }) => ({
  myJobsModel,
  loading,
}))
export default class contactsSelector extends Component {
  modelName = 'myJobsModel';

  state = {
    filter: {},
    pageNumber: 1,
    pageSize: 10,
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
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findContacts(pageNumber, pageSize, filter);
  }

  findContacts = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize, filter });
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchContacts`,
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findContacts(pagination.current, pagination.pageSize, this.state.filter);
  };

  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const { pageSize } = this.state;
    validateFields((error, values) => {
      if (!error) {
        this.findContacts(1, pageSize, { ...values });
      }
    });
  };

  render() {
    const { pageNumber, pageSize } = this.state;
    const {
      selectedRowKeys,
      myJobsModel: { contactsData, contactsTotal },
      changeSelectedRowKeys,
      loading: { effects },
      form: { getFieldDecorator },
      checkedType,
      selectRow,
      renderTableClass,
    } = this.props;
    if (contactsData) {
      contactsData.forEach(item => {
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
      total: contactsTotal,
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
                <FormItem label="备注名" {...formItemLayout}>
                  {getFieldDecorator('remarkName')(<Input placeholder="请输入备注名" />)}
                </FormItem>
              </Col>
              <Col xl={9} md={12} sm={24}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
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
          loading={effects[`${this.modelName}/fetchContacts`]}
          columns={this.columns}
          dataSource={contactsData}
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
