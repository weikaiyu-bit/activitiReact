import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Icon, Tree, Dropdown, Tag, Radio } from 'antd';

import moment from 'moment'
import ErrorCode from '../../../dtsea/common/ErrorCode';
import PPersonnelFilesViewDrawer from './components/viewDrawer';
import ResgisterAndEntrySearchBar from './components/searchBar';
import PersonnelSummaryCard from '../components/personnelSummaryCard';
import AddModal from './components/addModal'
import EditModal from './components/editModal'


@connect(({ registerAndEntryModal, loading }) => ({
  registerAndEntryModal,
  loading,
}))
class RegisterAndEntryIndex extends Component {
  state = {
    expandList: false,
    tabKey: 'byList',
    orgKey: 'byOrg',
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
      data: {},
    },
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
    SICvisible: false,
    SOrgvisible: false,
    SOTvisible: false,
    SCSMvisible: false,
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      ellipsis: true,
      width: 100,
    },
    {
      title: '入职单位',
      dataIndex: 'orgId',
      ellipsis: true,
      width: 150,
    },
    {
      title: '入职职务',
      dataIndex: 'positionLevel',
      ellipsis: true,
      width: 100,
    },
    {
      title: '入职职级',
      dataIndex: 'rank',
      ellipsis: true,
      width: 100,
    },
    {
      title: '人员状态',
      dataIndex: 'state',
      ellipsis: true,
      width: 100,
      render: (text, data) => {
        switch (data.state) {
          case '未入职':
            return <Tag color="orange">{data.state}</Tag>;
          case '入职':
            return <Tag color="lime">{data.state}</Tag>;
          case '在职':
            return <Tag color="cyan">{data.state}</Tag>;
          case '职位变动':
            return <Tag color="hotpink">{data.state}</Tag>;
          case '提拔':
            return <Tag color="blue">{data.state}</Tag>;
          case '退休':
            return <Tag color="magenta">{data.state}</Tag>;
          case '调动':
            return <Tag color="hotpink">{data.state}</Tag>;
          case '辞职':
            return <Tag color="magenta">{data.state}</Tag>;
          case '辞退':
            return <Tag color="red">{data.state}</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      width: 60,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      ellipsis: true,
      width: 180,
    },
    {
      title: '出生年月',
      dataIndex: 'birth',
      ellipsis: true,
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '民族',
      dataIndex: 'national',
      ellipsis: true,
      width: 100,
    },
    {
      title: '籍贯',
      dataIndex: 'nativePlace',
      ellipsis: true,
      width: 150,
    },
    {
      title: '出生地',
      dataIndex: 'birthplace',
      ellipsis: true,
      width: 150,
    },
    {
      title: '参加工作时间',
      dataIndex: 'workTime',
      ellipsis: true,
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '入党时间',
      dataIndex: 'partyTime',
      ellipsis: true,
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '公务员登记时间',
      dataIndex: 'serviceTime',
      ellipsis: true,
      width: 120,
      render: text => this.renderDate(text),
    },
    {
      title: '专业技术类公务员任职资格',
      dataIndex: 'civilServantQualification',
      ellipsis: true,
      width: 100,
    },
    {
      title: '专长',
      dataIndex: 'speciality',
      ellipsis: true,
      width: 100,
    },
    {
      title: '健康状况',
      dataIndex: 'health',
      ellipsis: true,
      width: 80,
    },
    {
      title: '管理类别',
      dataIndex: 'manageCategory',
      ellipsis: true,
      width: 100,
    },
    {
      title: '人员类别',
      dataIndex: 'personnelCategory',
      ellipsis: true,
      width: 100,
    },
    {
      title: '编制类型',
      dataIndex: 'establishmentCategory',
      ellipsis: true,
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical"/>
          <Popconfirm title="您确认删除人事档案信息吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
      ellipsis: true,
      width: 100,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);
    // 97:民族   级别:16   现职级:96  先职务层次: 95  专业技术职称:29   人员类别: 99  健康状况: 28
    this.findDictData({
      dataIds: [99, 97, 96, 95, 29, 28, 16],
    }, response => {
      console.log('response------------------', response);
    });
  }

  renderDate = text => ((text) ? moment(text).format('YYYY年MM月DD日') : '');
  // ////////////////////////////////////////////////////////////////////////////////////

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

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'registerAndEntryModal/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'registerAndEntryModal/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建人事档案信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
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
    const payload = { id, ...values };
    dispatch({
      type: 'registerAndEntryModal/update',
      payload,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改人事档案信息成功！');
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
    dispatch({
      type: 'registerAndEntryModal/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除人事档案信息成功！');
            // eslint-disable-next-line no-case-declarations
            const { pageNumber, pageSize, filter } = this.state;
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('删除人事档案信息失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  // ////////////////////////////////////////////////////////////////////////////////////

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
        title: '新建人事档案信息',
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
        title: '编辑人事档案信息',
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

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // //////////////////////////////////////////////////////////////////////////////////

  renderPersonnelFiles() {
    const { pageNumber, pageSize, selectedRowKeys, tabKey } = this.state;
    let catgPer = {};
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      registerAndEntryModal: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };

    if (tabKey === 'byList') {
      catgPer = (
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={data}
          pagination={paginationProps}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          bordered
          size="middle"
          scroll={{ x: 1300 }}
        />
      );
    }
    if (tabKey === 'byCard') {
      catgPer = (
        <PersonnelSummaryCard dataSource={data}/>
      );
    }
    return catgPer;
  }

  renderAdvancedList() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const {
      form,
      registerAndEntryModal: { total, tree },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const DictData = {
      form,
      pagination: paginationProps,
      onFind: this.findPage,
      findDictData: this.findDictData,
    };

    return (
      <Card>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <ResgisterAndEntrySearchBar {...DictData}/>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginBottom: '16px', marginRight: '8px' }}>
              <Button icon="plus" type="primary" onClick={this.showAddModal} style={{ marginRight: '8px' }}>
                新建档案
              </Button>
              <Button style={{ marginRight: '8px' }}>人员查重</Button>
              <Button style={{ marginRight: '8px' }}>数据校核</Button>
              <Button icon="import" style={{ marginRight: 12 }}>导入</Button>
              <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
            </span>
            {selectedRowKeys.length > 0 ? (
              <>
                <span>
                  <Popconfirm title="您确认需要批量删除人事档案信息吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete">批量删除</Button>
                  </Popconfirm>
                </span>
              </>
            ) : (
              ''
            )}
          </div>
          {this.renderPersonnelFiles()}
        </div>
      </Card>
    );
  }

  renderSimpleList() {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const {
      form,
      registerAndEntryModal: { total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    const DictData = {
      form,
      pagination: paginationProps,
      onFind: this.findPage,
      findDictData: this.findDictData,
    };

    return (
      <Card style={{ height: 900, overflow: 'auto' }}>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <ResgisterAndEntrySearchBar {...DictData}/>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginBottom: '16px', marginRight: '8px' }}>
              <Button icon="plus" type="primary" onClick={this.showAddModal} style={{ marginRight: '8px' }}>
                新建档案
            </Button>
              <Button icon="import" style={{ marginRight: 12 }}>导入</Button>
              <Button icon="export" style={{ marginRight: 12 }}>导出</Button>
            </span>
            {selectedRowKeys.length > 0 ? (
              <>
                <span>
                  <Popconfirm title="您确认需要批量删除人事档案信息吗？" onConfirm={() => this.delete(selectedRowKeys)}>
                    <Button icon="delete">批量删除</Button>
                  </Popconfirm>
                </span>
              </>
            ) : (
              ''
            )}
          </div>
          {this.renderPersonnelFiles()}
        </div>
      </Card>

    );
  }

  render() {
    const { expandList, addData, editData, tabKey } = this.state;
    const { registerAndEntryModal: { tree } } = this.props;

    return (
      <>
        {expandList ? this.renderAdvancedList() : this.renderSimpleList()}

        <PPersonnelFilesViewDrawer
          visible={this.state.viewVisible}
          data={this.state.viewData}
          onClose={this.hideDrawer}
        />
        {addData.visible && <AddModal {...addData} />}
        {editData.visible && <EditModal {...editData} />}
      </>
    );
  }
}

export default Form.create()(RegisterAndEntryIndex);
