import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Input, Form, message, Icon, Tag } from 'antd';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import ChgRecordAddModal from './components/addModal';
import ChgRecordEditModal from './components/editModal';
import ChgRecordViewDrawer from './components/viewDrawer';
import ChgRecordSearchBar from './components/searchBar';

@connect(({ chgRecordModel, loading }) => ({
  chgRecordModel,
  loading: loading.models.fetch,
}))
class ChgRecordIndex extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {
      visible: false,
      record: {},
      title: ''
    },
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
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      ellipsis: true,
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      width: 80,
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
      ellipsis: true,
      width: 150,
      render: text => this.renderDate(text),
    },
    {
      title: '参加工作时间',
      dataIndex: 'workTime',
      ellipsis: true,
      width: 150,
      render: text => this.renderDate(text),
    },
    {
      title: '学历',
      dataIndex: 'heducation',
      ellipsis: true,
      width: 80,
    },
    // {
    //   title: '职称(职务)',
    //   ellipsis: true,
    //   width: 120,
    // },
    {
      title: '变动前职务',
      children: [
        {
          title: '单位',
          dataIndex: 'b4OrgName',
          key: 'b4OrgName',
          width: 150,
        },
        {
          title: '职务名称',
          dataIndex: 'b4PositionName',
          key: 'companyNamb4PositionNamee',
          width: 100,
        },
        {
          title: '职级',
          dataIndex: 'b4Level',
          key: 'b4Level',
          width: 100,
        },
        {
          title: '任职时间',
          dataIndex: 'b4ServicedTime',
          key: 'b4ServicedTime',
          width: 150,
          render: text => this.renderDate(text),
        },
        {
          title: '聘任时间',
          dataIndex: 'b4AppointmentTime',
          key: 'b4AppointmentTime',
          width: 150,
          render: text => this.renderDate(text),
        },
      ],
    },

    {
      title: '更变后职务',
      children: [
        {
          title: '单位',
          dataIndex: 'afterOrgName',
          key: 'afterOrgName',
          width: 150,
        },
        {
          title: '职务名称',
          dataIndex: 'afterPositionName',
          key: 'afterPositionName',
          width: 100,
        },
        {
          title: '职级',
          dataIndex: 'afterLevel',
          key: 'afterLevel',
          width: 100,
        },
        {
          title: '任职时间',
          dataIndex: 'afterServicedTime',
          key: 'afterServicedTime',
          width: 150,
          render: text => this.renderDate(text),
        },
        {
          title: '聘任时间',
          dataIndex: 'afterAppointmentTime',
          key: 'afterAppointmentTime',
          width: 150,
          render: text => this.renderDate(text),
        },
      ],
    },
    {
      title: '主管部门意见',
      dataIndex: 'managerReview',
      key: 'managerReview',
      width: 120,
    },
    {
      title: '核准意见',
      dataIndex: 'approvalComments',
      key: 'managerReview',
      width: 100,
      render: text => {
        switch (text) {
          case '同意':
            return <Tag color="cyan">{text}</Tag>;
          case '驳回':
            return <Tag color="magenta">{text}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      }
    },
    {
      title: '变动描述',
      dataIndex: 'reason',
      ellipsis: true,
      width: 200,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'action',
    //   render: (text, record) => (
    //     <>
    //       <a onClick={() => this.showEditModal(record)}>批准</a>
    //       <Divider type="vertical" />
    //       <a onClick={() => this.showEditModal(record)}>驳回</a>
    //     </>
    //   ),
    //   ellipsis: true,
    //   width: 100,
    //   fixed: 'right',
    // },
  ];

  renderDate = (text) => {
    return (text) ? moment(text).format('YYYY年MM月DD日') : '';
  }

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);

  }

  /** ********************************************************************************************* */

  showDrawer = record => {
    this.setState({
      viewData: {
        visible: true,
        record,
        title: '人事异动信息',
        onClose: this.hideDrawer
      },
    });
  };

  hideDrawer = () => {
    this.setState({
      viewData: {
        visible: false,
        record: {},
        title: '人事异动信息'
      },
    });
  };

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建人事异动记录表',
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
        title: '编辑人事异动记录表',
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

  // *********************************************************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'chgRecordModel/fetch',
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
      type: 'chgRecordModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建人事异动记录表成功！');
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
      type: 'chgRecordModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改人事异动记录表成功！');
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
      type: 'chgRecordModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除人事异动记录表成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除人事异动记录表失败！');
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

  // *********************************************************************************************** */

  render() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData, viewVisible, viewData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      chgRecordModel: { data = [], total },
    } = this.props;
    console.log("data=", data)
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
          <div>
            <div style={{ marginBottom: '16px' }}>
              <ChgRecordSearchBar form={form} pagination={paginationProps} onFind={this.findPage} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm title="您确认需要批量删除人事异动记录表吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete">批量删除</Button>
                  </Popconfirm>
                </span>
              ) : (
                  ''
                )}
            </div>

            <Table
              bordered
              rowKey="id"
              loading={loading}
              columns={this.columns}
              dataSource={data}
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
              size="middle"
              scroll={{ x: 1600 }}
            />
          </div>

          <ChgRecordViewDrawer
            {...viewData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <ChgRecordAddModal {...addData} />}
          {editData.visible && <ChgRecordEditModal {...editData} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ChgRecordIndex);
