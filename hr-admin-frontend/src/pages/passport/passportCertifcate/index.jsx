import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Avatar, Tag } from 'antd';

import moment from 'moment';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import PassportCertificateAddModal from './components/addModal';
import PassportCertificateEditModal from './components/editModal';
import PassportCertificateViewDrawer from './components/viewDrawer';
import PassportCertificateSearchBar from './components/searchBar';

@connect(({ passportCertificateModel, loading }) => ({
  passportCertificateModel,
  loading: loading.models.fetch,
}))
class PassportCertificateIndex extends Component {
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
    documentsTypeDictData: [],
    posistionCategoryDictData: [],
  };

  columns = [
    {
       title: '证件编号',
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
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '持有人',
      dataIndex: 'owner',
    },
    {
      title: '持有人所在单位',
      dataIndex: 'ownerOrgName',
    },
    {
       title: '编制类型',
       dataIndex: 'posistionCategory',
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
       title: '保管人',
       dataIndex: 'keeper',
    },
    {
      title: '登记时间',
      dataIndex: 'registrationTime',
      render(val) {
        if (val != null) {
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        }
        return null;
      },
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
          <Popconfirm title="您确认删除出入境证件信息吗？" onConfirm={() => this.delete([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);
    this.findDictData({
      dataIds: [101, 102],
    }, response => {
      if (response.code === ErrorCode.SUCCESS) {
        const documentsType = []; // 证件类型
        const posistionCategory = []; // 编制类型
        response.data.forEach(item => {
          switch (item.dataId) {
            case 101: // 机构级别
            documentsType.push(item);
              break;
            case 102: // 健康状况
            posistionCategory.push(item);
              break;
            default:
              break;
          }
        });
        this.setState({
          documentsTypeDictData: documentsType,
          posistionCategoryDictData: posistionCategory,
        });
      }
    });
  }

  findDictData = (filter, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bamDictDataModel/fetch',
      payload: {
        ...filter,
      },
      callback: response => {
        if (callback) callback(response);
      },
    });
  };

  /** **************************************************************************************** */
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
    const { posistionCategoryDictData } = this.state;
    this.setState({
      addData: {
        headTitle: '新建出入境证件信息',
        visible: true,
        confirmLoading: false,
        record: {},
        posistionCategoryDictData,
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
    const { documentsTypeDictData, posistionCategoryDictData } = this.state;
    this.setState({
      editData: {
        dispatch,
        headTitle: '编辑出入境证件信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
        documentsTypeDictData,
        posistionCategoryDictData,
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
  /** ******************************************************************************* */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'passportCertificateModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    dispatch({
      type: 'passportCertificateModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建出入境证件信息成功！');
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
      type: 'passportCertificateModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改出入境证件信息成功！');
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
      type: 'passportCertificateModel/remove',
      payload: ids,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除出入境证件信息成功！');
            this.setState({
              selectedRowKeys: [],
            });
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除出入境证件信息失败！');
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
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      passportCertificateModel: { data = [], total },
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
              <PassportCertificateSearchBar form={form} pagination={paginationProps}
              data={this.state.posistionCategoryDictData} onFind={this.findPage} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除出入境证件信息吗？" onConfirm={() => this.delete(selectedRowKeys)}>
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

          <PassportCertificateViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <PassportCertificateAddModal {...addData} />}
          {editData.visible && <PassportCertificateEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(PassportCertificateIndex);
