/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Modal, Form, Table, Button, Row, Col } from 'antd';

function postExcellowOrgLeaderPostSet(params, url) {
  // params是post请求需要的参数，url是请求url地址
  const form = document.createElement('form');
  form.style.display = 'none';
  form.action = url;
  form.method = 'post';
  document.body.appendChild(form);

  Object.keys(params).forEach(key => {
    if (params[key]) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }
  })

  form.submit();
  form.remove();
}

class OrgPositionAddModal extends Component {
  columns = [
    {
      title: '各单位领导职数配备情况表',
      dataIndex: 'ggg',
      children: [
        {
          title: '机构名称',
          dataIndex: 'orgName',
        },
        {
          title: '机构级别',
          dataIndex: 'level',
        },
        {
          title: '正职领导职数',
          dataIndex: 'zzz',
          children: [
            {
              title: '应配人数',
              dataIndex: 'principalLeaderPos',
            },
            {
              title: '实配人数',
              dataIndex: 'realPrincipalLeaderPos',
            },
            {
              title: '超配',
              dataIndex: 'ee',
              render: (text, record) => (<>{record.realPrincipalLeaderPos - record.principalLeaderPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'ff',
              render: (text, record) => (<>{record.principalLeaderPos - record.realPrincipalLeaderPos}</>),
            },
          ],
        },
        {
          title: '副职领导职数',
          dataIndex: 'action',
          children: [
            {
              title: '应配人数',
              dataIndex: 'deputyLeaderPos',
            },
            {
              title: '实配人数',
              dataIndex: 'raalDeputyLeaderPos',
            },
            {
              title: '超配',
              dataIndex: 'ii',
              render: (text, record) => (<>{record.raalDeputyLeaderPos - record.deputyLeaderPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'jj',
              render: (text, record) => (<>{record.deputyLeaderPos - record.raalDeputyLeaderPos}</>),
            },
          ],
        },
      ],
    },
  ];

  okHandler = () => {
    // const { onOk, record } = this.props;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    // onOk(record.id, { ...record, ...values });
    const { record } = this.props;
    const exPorts = {};
    exPorts.data = JSON.stringify(record);
    postExcellowOrgLeaderPostSet(exPorts, '/api/oa/admin/v1/OrgOrganization/lowOrgLeaderPostSetExport')
    this.hideModel();
    //   }
    // });
  };

  hideModel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render () {
    const { visible, title, record } = this.props;
    const exPorts = {};
    exPorts.data = JSON.stringify(record);
    return (
      <>
        <Modal
          title={title}
          width={1280}
          visible={visible}
          onOk={this.okHandler}
          okText="导出"
          onCancel={this.hideModel}
        >
          {/* <Row style={{ marginBottom: 20 }}>
            <Col span={2} offset={22}>
              <Button type="primary" onClick={() => postExcellowOrgLeaderPostSet(exPorts, '/api/oa/admin/v1/OrgOrganization/lowOrgLeaderPostSetExport')}>导出</Button>
            </Col>
          </Row> */}
          <div style={{ marginBottom: 20 }}>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={record}
              bordered
              pagination={false}
              size="small"
              align="center"
              // scroll={{ x: 2000, y: 450 }}
            />
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(OrgPositionAddModal);
