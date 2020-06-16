import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import '@ant-design/compatible/assets/index.css';
import { Card, Divider, Popconfirm, Tag, Input, Button } from 'antd';
import { overhaul, register } from '../service';

import MsgNotifyAddModal from './components/addModal';
import MsgNotifyEditModal from './components/editModal';
import MsgNotifyViewDrawer from './components/viewDrawer';

export default () => {
  const [keywords, setKeywords] = useState('');
  const [viewVisible, setViewVisible] = useState(false);
  const [viewData, setViewData] = useState({});
  const [addData, setAddData] = useState(
    {
      visible: false,
      record: {},
    },
  );
  const [editData, setEditData] = useState(
    {
      visible: false,
      record: {},
    },
  );
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState({})

  const showDrawer = record => {
    setViewVisible(true);
    setViewData({ ...record, title: '设备登记信息' })
  };

  const hideDrawer = () => {
    setViewVisible(false);
    setViewData({})
  };

  const showAddModal = () => {
    setAddData(
      {
        title: '新增报废',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: () => { },
        onClose: hideAddModal,
      },
    )
  };

  const hideAddModal = () => {
    setAddData(
      {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    )
  };

  const hideEditModal = () => {
    setEditData(
      {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    )
  };
  const showEditModal = record => {
    setEditData(
      {
        title: '维修登记',
        visible: true,
        confirmLoading: false,
        record,
        onOk: () => { },
        onClose: hideEditModal,
      },
    )
  };
  const columns = [
    {
      title: '设备编号',
      dataIndex: 'maintenanceId',
      valueType: 'text',
      width: 200
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      render: text => {
        switch (text) {
          case "待鉴定":
            return <Tag color="success">{text}</Tag>
            break;
          case "待鉴定":
            return <Tag color="processing">{text}</Tag>
            break;
          case "待鉴定":
            return <Tag color="warning">{text}</Tag>
            break;
          default:
            return <Tag>{text}</Tag>

        }
      }
    },
    {
      title: '规格类型',
      dataIndex: 'faultType',
      valueType: 'text',
    },
    {
      title: '申请科室',
      dataIndex: 'department',
      valueType: 'text',
    },
    {
      title: '报废原因',
      dataIndex: 'faultDescription',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      render: (text, record) => (
        <>
          <a onClick={() => showDrawer(record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除消息通知吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper
      title={false}
    >
      <Card bordered={false}>
        <ProTable
          size="small"
          columns={columns}
          request={params => register(pageNumber, pageSize, filter)}
          rowKey="name"
          params={{ keywords }}
          headerTitle={<Button type="primary" onClick={() => showAddModal()}>新增报废设备</Button>}
          toolBarRender={action => [
            <Input.Search
              style={{
                width: 200,
              }}
              onSearch={value => setKeywords(value)}
            />,
          ]}
          pagination={{
            defaultCurrent: 10,
          }}
          search={
            { resetText: false }
          }
        />
        <MsgNotifyViewDrawer
          visible={viewVisible}
          data={viewData}
          onClose={hideDrawer}
        />
        {addData.visible && <MsgNotifyAddModal {...addData} />}
        {editData.visible && <MsgNotifyEditModal {...editData} />}
      </Card>
    </PageHeaderWrapper>
  );
};
