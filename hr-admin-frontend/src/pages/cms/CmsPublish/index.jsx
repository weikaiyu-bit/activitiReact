/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Switch, Tag, Icon } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import CmsPublishAddModal from './components/addModal';
import CmsPublishEditModal from './components/editModal';
import CmsPublishViewDrawer from './components/viewDrawer';
import CmsPublishSearchBar from './components/searchBar';
import CategoryTreeView from '@/pages/cms/components/CategoryTreeView';
import CmsPublishViewInformation from './components/viewInformation';

// const getParentKey = (key, tree) => {
//   let parentKey;
//   for (let i = 0; i < tree.length; i += 1) {
//     const node = tree[i];
//     if (node.children) {
//       if (node.children.some(item => item.id == key)) {
//         parentKey = node.id.toString();
//       } else if (getParentKey(key, node.children)) {
//         parentKey = getParentKey(key, node.children);
//       }
//     }
//   }
//   return parentKey;
// };

@connect(({ cmsPublishModel, loading }) => ({
  cmsPublishModel,
  loading: loading.models.fetch,
}))
class CmsPublishIndex extends Component {
  modelName = 'cmsPublishModel';

  state = {
    expandList: true, // 默认展开栏目列表
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
    viewInformationData: {
      visible: false,
      record: {},
    },
    selectedKeys: [],
  };

  myRef = React.createRef();

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter);
    this.findTree();
  }

  /* ********************************************************************************************** */
  // 修改文章状态
  changeContentStatus = (record, contentStatus, msg) => {
    const { pageNumber, pageSize, filter } = this.state;
    const {
      dispatch,
      cmsPublishModel: { total },
    } = this.props;

    const newTotal = total - 1;
    // 计算更改后页数
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize); // 向下取整

    dispatch({
      type: `${this.modelName}/update`,
      payload: {
        ...record,
        contentStatus,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (totalPage < pageNumber) {
              this.setState({ pageNumber: totalPage });
              this.findPage(totalPage, pageSize, filter);
            } else {
              this.findPage(pageNumber, pageSize, filter);
            }
            message.success(msg || '操作成功！');
            break;
          case ErrorCode.FAILURE:
            message.success('操作失败！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          default:
            message.error(response.msg);
            this.findPage(pageNumber, pageSize, filter);
            break;
        }
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
    const { selectedKeys } = this.state;
    this.setState({
      addData: {
        selectedKey: selectedKeys[0],
        windowTitle: '新建文章内容',
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
        windowTitle: '编辑文章内容',
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

  showInformationModal = record => {
    this.setState({
      viewInformationData: {
        windowTitle: '查看文章信息',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.hideInformationModal,
        onClose: this.hideInformationModal,
      },
    });
  };

  hideInformationModal = () => {
    this.setState({
      viewInformationData: {
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

  /* ********************************************************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    this.setState({ pageNumber, filter });
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  findTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchTree`,
    });
  };

  add = (id, values, msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/add`,
      payload: values,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success(msg || '新建文章内容成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error('请求失败');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  update = (id, values, msg) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: `${this.modelName}/update`,
      payload,
      callback: response => {
        const { pageNumber, pageSize, filter } = this.state;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            this.findPage(pageNumber, pageSize, filter);
            message.success(msg || '修改成功！');
            break;
          case ErrorCode.FAILURE:
            message.error('修改失败！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          default:
            this.callbackDefault(response);
            this.findPage(pageNumber, pageSize, filter);
            break;
        }
      },
    });
  };

  delete = ids => {
    const {
      dispatch,
      cmsPublishModel: { total },
    } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    const newTotal = total - ids.length;
    const totalPage = Math.floor((newTotal + pageSize - 1) / pageSize);
    dispatch({
      type: `${this.modelName}/remove`,
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (totalPage < pageNumber) {
              this.setState({ pageNumber: totalPage });
              this.findPage(totalPage, pageSize, filter);
            } else {
              this.findPage(pageNumber, pageSize, filter);
            }
            message.success('删除文章成功！');
            break;
          case ErrorCode.FAILURE:
            this.findPage(pageNumber, pageSize, filter);
            message.error('删除文章失败！');
            break;
          default:
            this.callbackDefault(response);
            this.findPage(pageNumber, pageSize, filter);
            break;
        }
      },
    });
    this.setState({ selectedRowKeys: [] });
  };

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

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

  recommendOnChange = (checked, record) => {
    record.isGood = checked;
    this.update(record.id, record, checked ? '推荐成功！' : '取消推荐成功！');
  };

  topOnChange = (checked, record) => {
    record.onTop = checked;
    this.update(record.id, record, checked ? '置顶成功！' : '取消置顶成功！');
  };

  allowCommentOnChange = (checked, record) => {
    record.allowComment = checked;
    this.update(record.id, record, checked ? '允许成功！' : '取消允许成功！');
  };

  setSelectedKeys = selectedKeys => {
    this.setState({ selectedKeys });
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '关键字',
      dataIndex: 'keywords',
    },
    {
      title: '来源',
      dataIndex: 'source',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '点击率',
      dataIndex: 'clicks',
    },
    {
      title: '推荐',
      dataIndex: 'isGood',
      render: (text, record) => (
        <Switch
          checked={record.isGood === 'true'}
          onChange={checked => this.recommendOnChange(checked, record)}
        />
      ),
    },
    {
      title: '置顶',
      dataIndex: 'onTop',
      render: (text, record) => (
        <Switch
          checked={record.onTop === 'true'}
          onChange={checked => this.topOnChange(checked, record)}
        />
      ),
    },
    {
      title: '允许评论',
      dataIndex: 'allowComment',
      render: (text, record) => (
        <Switch
          checked={record.allowComment === 'true'}
          onChange={checked => this.allowCommentOnChange(checked, record)}
        />
      ),
    },
    {
      title: '文章状态',
      dataIndex: 'contentStatus',
      align: 'center',
      render(text) {
        switch (text) {
          // 草稿
          case 'DRAFT':
            return <Tag color="orange">草稿</Tag>;
          // 已投稿
          case 'SUBMITTED':
            return <Tag color="cyan">已投稿</Tag>;
          // 已接收
          case 'RECEIVED':
            return <Tag color="magenta">已接收</Tag>;
          // 废稿
          case 'SCRAP':
            return <Tag color="volcano">废稿</Tag>;
          // 已发布
          case 'PUBLISHED':
            return <Tag color="blue">已发布</Tag>;
          default:
            return <Tag color="">未定义</Tag>;
        }
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        const status = record && record.contentStatus ? record.contentStatus : '';
        switch (status) {
          // 草稿
          case 'DRAFT':
            return (
              <>
                <a onClick={() => this.showInformationModal(record)}>属性</a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'SUBMITTED', '投稿成功！')}>
                  投稿
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确认删除文章内容吗？"
                  onConfirm={() => this.delete([record.id])}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          // 已投稿
          case 'SUBMITTED':
            return (
              <>
                <a onClick={() => this.showInformationModal(record)}>属性</a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'RECEIVED', '接收成功！')}>
                  接收
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'DRAFT')}>驳回</a>
              </>
            );
          // 已接收
          case 'RECEIVED':
            return (
              <>
                <a onClick={() => this.showInformationModal(record)}>属性</a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'PUBLISHED', '发布成功！')}>
                  发布
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'SCRAP', '作废成功！')}>作废</a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确认删除文章内容吗？"
                  onConfirm={() => this.delete([record.id])}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          // 废稿
          case 'SCRAP':
            return (
              <>
                <a onClick={() => this.showInformationModal(record)}>属性</a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'RECEIVED', '还原成功！')}>
                  还原
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确认删除文章内容吗？"
                  onConfirm={() => this.delete([record.id])}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          // 已发布
          case 'PUBLISHED':
            return (
              <>
                <a onClick={() => this.showInformationModal(record)}>属性</a>
                <Divider type="vertical" />
                <a onClick={() => this.changeContentStatus(record, 'RECEIVED', '撤下成功！')}>
                  撤下
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确认删除文章内容吗？"
                  onConfirm={() => this.delete([record.id])}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          default:
            return (
              <>
                <a onClick={() => this.showInformationModal(record)}>属性</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确认删除文章内容吗？"
                  onConfirm={() => this.delete([record.id])}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            );
        }
      },
    },
  ];

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList, selectedKeys } = this.state;
    this.setState(
      {
        expandList: !expandList,
      },
      () => {
        if (this.state.expandList) {
          this.myRef.current.setSelectKey(selectedKeys);
        }
      },
    );
  };

  renderSimpleList() {
    const {
      pageNumber,
      pageSize,
      selectedRowKeys,
      addData,
      editData,
      filter,
      viewInformationData,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      cmsPublishModel: { data = [], total, categoryData = [] },
    } = this.props;
    // 表格分页属性
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
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="right-square" />
          </a>

          <div>
            <div style={{ marginBottom: '16px' }}>
              <CmsPublishSearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.findPage}
                filter={filter}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除文章内容吗？"
                    onConfirm={() => this.delete(selectedRowKeys)}
                  >
                    <Button icon="delete">批量删除</Button>
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
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <CmsPublishViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            onClose={this.hideDrawer}
            categoryData={categoryData}
          />
          {addData.visible && <CmsPublishAddModal {...addData} categoryData={categoryData} />}
          {editData.visible && <CmsPublishEditModal {...editData} categoryData={categoryData} />}
          {viewInformationData.visible && (
            <CmsPublishViewInformation {...viewInformationData} categoryData={categoryData} />
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderAdvancedList() {
    const {
      pageNumber,
      pageSize,
      selectedRowKeys,
      addData,
      editData,
      filter,
      viewInformationData,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      cmsPublishModel: { data = [], total, tree, categoryData = [] },
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
        <Card style={{ width: '23%', float: 'left', marginRight: '1%' }}>
          <CategoryTreeView
            tree={tree}
            data={categoryData}
            onFind={this.findPage}
            pageSize={pageSize}
            filter={filter}
            ref={this.myRef}
            setSelectedKeys={this.setSelectedKeys}
          />
        </Card>
        <Card style={{ width: '76%', float: 'left' }}>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="left-square" />
          </a>

          <div>
            <div style={{ marginBottom: '16px' }}>
              <CmsPublishSearchBar
                form={form}
                pagination={paginationProps}
                onFind={this.findPage}
                filter={filter}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ marginBottom: '16px', marginRight: '8px' }}>
                <Button icon="plus" type="primary" onClick={this.showAddModal}>
                  新建
                </Button>
              </span>
              {selectedRowKeys.length > 0 ? (
                <span>
                  <Popconfirm
                    title="您确认需要批量删除文章内容吗？"
                    onConfirm={() => this.delete(selectedRowKeys)}
                  >
                    <Button icon="delete">批量删除</Button>
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
              pagination={paginationProps}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>

          <CmsPublishViewDrawer
            visible={this.state.viewVisible}
            data={this.state.viewData}
            categoryData={categoryData}
            onClose={this.hideDrawer}
          />
          {addData.visible && <CmsPublishAddModal {...addData} categoryData={categoryData} />}
          {editData.visible && <CmsPublishEditModal {...editData} categoryData={categoryData} />}
          {viewInformationData.visible && (
            <CmsPublishViewInformation {...viewInformationData} categoryData={categoryData} />
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }

  render() {
    return this.state.expandList ? this.renderAdvancedList() : this.renderSimpleList();
  }
}

export default Form.create()(CmsPublishIndex);
