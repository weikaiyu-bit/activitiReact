import React, { Component } from 'react';
import { Modal, Form, Table, Popconfirm, Tag } from 'antd';
import { connect } from 'dva';

@connect(({ pfileWorkRecordModel, loading }) => ({
  pfileWorkRecordModel,
  loading,
}))
class Dismissal extends Component {
  state = {
    filter: {
      fileId: this.props.record.id,
      approvedState: '已批准',
      pageNumber: 1,
      pageSize: 10,
    },
  };

  okHandler = () => {
    const { onClose } = this.props;
    onClose();
  }

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: text => <a>{text}</a>,
    },
    {
      title: '任职单位',
      dataIndex: 'b4OrgName',
      key: 'b4OrgName',
    },
    {
      title: '职务名称',
      dataIndex: 'b4PositionName',
      key: 'b4PositionName',
    },
    {
      title: '任职状态',
      dataIndex: 'changeCode',
      key: 'changeCode',
      width: 80,
      render: changeCode => {
        switch (changeCode) {
          case 'true':
            return <Tag style={{ width: '64px' }} color="lime">在职</Tag>;
          case 'false':
            return <Tag style={{ width: '64px' }} color="orange">已辞退</Tag>;
          default:
            return <Tag style={{ width: '64px' }} >未知 </Tag>;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Popconfirm title="您确定要辞退该人员吗?" onConfirm={() => this.remove([record.id])}>
            {record.changeCode === 'true' ? <a>辞退</a> : ''}
          </Popconfirm>
        </>
      ),
      ellipsis: true,
      width: 80,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findPage(pageNumber, pageSize, filter); // 页面加载查询职务信息表
  }

  findPage = (pageNumber, pageSize, fileId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/fetch',
      payload: {
        ...fileId,
        pageNumber,
        pageSize,
      },
    });
  }

  render() {
    const { record, title, visible, pfileWorkRecordModel: { data, total }, loading: { effects } } = this.props;
    const { pageNumber, pageSize } = this.state;
    const position = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSizeOptions: ['10'],
      defaultPageSize: 10,
      hideOnSinglePage: true,
      pageSize,
      total,
    }

    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >

          <Table
            bordered
            loading={effects['pfileWorkRecordModel/fetch']}
            onChange={this.handleTableChange}
            size="middle"
            pagination={position}
            columns={this.columns}
            dataSource={data} />
        </Modal>
      </>
    );
  }
}

export default Form.create()(Dismissal);
