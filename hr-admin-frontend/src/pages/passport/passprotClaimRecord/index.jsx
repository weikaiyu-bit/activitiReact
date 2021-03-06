import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag } from 'antd';
import moment from 'moment';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import PassprotClaimRecordAddModal from './components/addModal';
import PassprotClaimRecordEditModal from './components/editModal';
import PassprotClaimRecordViewDrawer from './components/viewDrawer';
import PassprotClaimRecordSearchBar from './components/searchBar';

@connect(({ passprotClaimRecordModel, passportCertificateModel, loading }) => ({
  passprotClaimRecordModel,
  passportCertificateModel,
  loading: loading.models.fetch,
}))
class PassprotClaimRecordIndex extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
    },
  };

  columns = [
    /* {
      title: 'id', // FIXME
      dataIndex: 'id',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    }, */
    {
      title: '证据编号',
      dataIndex: 'certificateCode',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '证件名称',
      dataIndex: 'certificateName',
    },
    {
      title: '证件类型',
      dataIndex: 'certificateType',
    },
    {
      title: '证件状态',
      dataIndex: 'state',
      render: (text, data) => {
        switch (data.state) {
          case '保管中':
            return <Tag color="blue">{data.state}</Tag>;
          case '已领取':
            return <Tag color="magenta">{data.state}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '目的地',
      dataIndex: 'destination',
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      render(value) {
        if (value != null) {
          return <span>{moment(value).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render(value) {
        if (value != null) {
          return <span>{moment(value).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
    },
    {
      title: '申请人所在单位',
      dataIndex: 'applicantOrgName',
    },
    {
      title: '申请时间',
      dataIndex: 'applicationTime',
      render(val) {
        if (val != null) {
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
    },
    {
      title: '申请原因',
      dataIndex: 'reason',
    },
    {
      title: '本部门领导意见',
      dataIndex: 'departmentOpinions',
    },
    {
      title: '人事处意见',
      dataIndex: 'personnelDivisionOpinions',
    },
    {
      title: '单位领导意见',
      dataIndex: 'leadersOpinions',
    },
    {
      title: '保管人',
      dataIndex: 'keeper',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除出入境证件申领记录吗？" onConfirm={() => this.delete([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);
    this.findAllCertificatesRegData();
  }

  /** *************************************************************************************** */
  findAllCertificatesRegData = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'passportCertificateModel/fetchAll',
      });
  }

  findPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize, filter });
      const { dispatch } = this.props;
      dispatch({
        type: 'passprotClaimRecordModel/fetch',
        payload: {
          ...filter,
          pageNumber,
          pageSize,
        },
      });
  };

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
    });
  };

  hideDrawer = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  showAddModal = () => {
    this.setState({
      addData: {
        certificatesRegData: this.findcertificatesRegData,
        headTitle: '新建出入境证件申领记录',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  hideAddModal = () => {
    this.setState({
      addData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        headTitle: '编辑出入境证件申领记录',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
    });
  };

  hideEditModal = () => {
    this.setState({
      editData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /** ******************************************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize });
    this.setState(preState => ({
      filter: { ...preState.filter, ...filter },
    }), () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'passprotClaimRecordModel/fetch',
        payload: {
          ...filter,
          pageNumber,
          pageSize,
        },
      });
    })
  };

  // 重置查询
  resFindPage = (pageNumber, pageSize, filter) => {
    this.setState({ pageNumber, pageSize });
    this.setState({
      selectedRowKeys: [],
    })
    this.setState({ filter }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'passprotClaimRecordModel/fetch',
        payload: {
          ...this.state.filter,
          pageNumber,
          pageSize,
        },
      });
    })
  }

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'passprotClaimRecordModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建出入境证件申领记录成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  update = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    const payload = { id, ...values };
    dispatch({
      type: 'passprotClaimRecordModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改出入境证件申领记录成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  delete = ids => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'passprotClaimRecordModel/remove',
      payload: ids,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除出入境证件申领记录成功！');
            this.setState({
              selectedRowKeys: [],
            });
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除出入境证件申领记录失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  callbackDefault = response => {
    const msg = (response.msg) ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };


  render() {
   // console.log('data:::', this.props.passportCertificateModel.certificatesRegData)
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      passprotClaimRecordModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
      showTotal: all => `共 ${all} 条`,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <PassprotClaimRecordSearchBar form={form} pagination={paginationProps} onFind={this.findPage} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button type="primary" onClick={this.showAddModal}>
                  申请
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除出入境证件申领记录吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete" >批量删除</Button>
                  </Popconfirm>
                </span>
              ) : (
                  ''
                )}
            </div>

            <Table
              rowKey="id"
              loading={loading}
              columns={this.columns}
              dataSource={data}
              size="middle"
              bordered
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <PassprotClaimRecordViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <PassprotClaimRecordAddModal {...addData} passData = {this.props.passportCertificateModel.certificatesRegData} />}
          {editData.visible && <PassprotClaimRecordEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(PassprotClaimRecordIndex);
