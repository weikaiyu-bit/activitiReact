/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Table,
  Card,
  Button,
  Icon,
  Divider,
  Tag,
  Popconfirm,
  Form,
  message,
  Row,
  Col,
  Input,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditModal from './components/editModal';
import ViewDrawer from './components/viewDrawer';
import styles from '../../list/table-list/style.less';

const FormItem = Form.Item;

@connect(({ serverModel, loading }) => ({
  serverModel,
  loading: loading.models.fetch,
}))
class Server extends Component {
  modelName = 'serverModel';

  state = {
    selectedRowKeys: [],
    formValues: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
  };

  columns = [
    {
      title: '序号',
      key: 'order',
      render: (text, record, index) => index + 1,
    },
    {
      title: '服务器名称',
      dataIndex: 'serverName',
      key: 'serverName',
    },
    {
      title: '服务器路径',
      dataIndex: 'serverUrl',
      key: 'serverUrl',
      render: (text, record) => <a onClick={() => this.showView(record)}>{text}</a>,
    },
    {
      title: '服务器端口',
      dataIndex: 'serverPort',
      key: 'serverPort',
    },
    {
      title: '服务器状态',
      dataIndex: 'serverStatus',
      key: 'serverStatus',
      render(text, record) {
        let color = '';
        switch (text) {
          case '正常':
            color = 'green';
            break;
          case '宕机':
            color = 'red';
            break;
          default:
            color = '';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remake',
      key: 'remake',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <>
          <EditModal title="修改" record={record} onOk={this.update}>
            <a>编辑</a>
          </EditModal>
          <Divider type="vertical" />
          <Popconfirm title="确认删除吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, formValues } = this.state;
    this.findPage(pageNumber, pageSize, formValues);
  }

  showView = record => {
    console.log('record', record);
    this.setState({
      viewVisible: true,
      viewData: record,
    });
  };

  closeView = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  onSelectChange = (currySelectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys changed: ', currySelectedRowKeys);
    // console.log(selectedRows);
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  findPage = (pageNumber, pageSize, formValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        pageNumber,
        pageSize,
        ...formValues,
      },
    });
  };

  handleTableChange = (pagination, ...rest) => {
    // console.log('handleTableChange', { pagination, ...rest });
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.formValues);
  };

  cb = response => {
    switch (response.code) {
      case 0:
        // 成功
        message.success(response.msg);
        break;
      case -1:
        // 未登录
        routerRedux.push('/user/login');
        break;
      case 1:
        // 失败
        message.error(response.msg);
        break;
      default:
        break;
    }
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: this.cb,
    });
  };

  update = (id, values) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    // console.log('payload', payload);
    dispatch({
      type: `${this.modelName}/update`,
      payload,
      callback: this.cb,
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { id },
      callback: this.cb,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pageNumber = 1;
      this.setState({
        pageNumber,
        formValues: fieldsValue,
      });
      this.findPage(pageNumber, this.state.pageSize, fieldsValue);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="服务器路径">
              {getFieldDecorator('serverUrl')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <a
                style={{
                  marginLeft: 8,
                }}
                onClick={this.toggleForm}
              >
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="服务器端口">
              {getFieldDecorator('serverUrl')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="服务器状态">
              {getFieldDecorator('serverStatus')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <a
                style={{
                  marginLeft: 8,
                }}
                onClick={this.toggleForm}
              >
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { selectedRowKeys, pageNumber, pageSize } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      serverModel: { data = [], total },
    } = this.props;
    // console.log(this);
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <EditModal title="添加" record={{}} onOk={this.add}>
                <Button icon="plus" type="primary">
                  添加
                </Button>
              </EditModal>
            </div>
            <Table
              rowKey="id"
              columns={this.columns}
              // rowSelection={rowSelection}// 注释则不显示勾选
              dataSource={data}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              loading={loading}
            />
          </div>
          <ViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.closeView}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Server);
