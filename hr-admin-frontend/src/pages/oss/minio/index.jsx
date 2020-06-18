/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Upload,
  Table,
  Card,
  Button,
  Icon,
  Divider,
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

@connect(({ minioModel, loading }) => ({
  minioModel,
  loading: loading.models.fetch,
}))
class Minio extends Component {
  modelName = 'minioModel';

  state = {
    viewModal: false,
    selectedRowKeys: [],
    formValues: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
  };

  columns = [
    {
      title: '应用',
      dataIndex: 'apply',
      key: 'appId',
    },
    {
      title: '目录',
      dataIndex: 'directory',
      key: 'directory',
    },
    {
      title: '原文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text, record) => <a onClick={() => this.showView(record)}>{text}</a>,
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
    },
    {
      title: '文件路径',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (text, record) => `${text} kb`,
    },
    {
      title: '文件状态',
      dataIndex: 'fileStatus',
      key: 'fileStatus',
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
          <Popconfirm title="确认删除吗？" onConfirm={() => this.delete(record.logId)}>
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

  showModal = record => {
    console.log('record', record);
    this.setState({
      viewModal: true,
      viewData: record,
    });
  };

  closeView = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  closeModal = () => {
    this.setState({
      viewModal: false,
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
            <FormItem label="文件名称">
              {getFieldDecorator('fileName')(<Input placeholder="请输入" />)}
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
            <FormItem label="文件名称">
              {getFieldDecorator('fileName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="文件路径">
              {getFieldDecorator('fileUrl')(<Input placeholder="请输入" />)}
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
    const { selectedRowKeys, pageNumber, pageSize, fieldsValue } = this.state;
    const { findPage } = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      minioModel: { data = [], total },
    } = this.props;
    // console.log(this);
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };

    const propsUpload = {
      action: '/api/v1/minio/oss/upload',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <EditModal title="添加" record={{}} onOk={this.addOK}>
              <Button icon="plus" type="primary">
                  上传
              </Button>
            </EditModal> */}
              <Upload {...propsUpload}>
                <Button>
                  <Icon type="upload" />
                  附件上传
                </Button>
              </Upload>
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

export default Form.create()(Minio);
