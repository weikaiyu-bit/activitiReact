/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Modal, Form, Table, Button, Row, Col } from 'antd';
import '@/assets/css/style.css'

function postExcelLotOrgLeaderPostSet(params, url) {
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

class Staffing extends Component {
  columns = [
    {
      title: '各单位编制与人员配备表',
      dataIndex: 'ggg',
      children: [
        {
          title: '机构名称',
          dataIndex: 'orgName',
          width: '200px',
        },
        {
          title: '机构级别',
          dataIndex: 'category',
        },
        {
          title: '行政编制数',
          dataIndex: 'zzz',
          children: [
            {
              title: '应配人数',
              dataIndex: 'administrationPos',
            },
            {
              title: '实配人数',
              dataIndex: 'realAdministrationPos',
            },
            {
              title: '超配',
              dataIndex: 'ee',
              render: (text, record) => (<>{record.realAdministrationPos - record.administrationPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'ff',
              render: (text, record) => (<>{record.administrationPos - record.realAdministrationPos}</>),
            },
          ],
        },
        {
          title: '参照公务员法管理事业编制数',
          dataIndex: 'a',
          children: [
            {
              title: '应配人数',
              dataIndex: 'govServedPos',
            },
            {
              title: '实配人数',
              dataIndex: 'realGovServedPos',
            },
            {
              title: '超配',
              dataIndex: 'ii',
              render: (text, record) => (<>{record.realGovServedPos - record.govServedPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'jj',
              render: (text, record) => (<>{record.govServedPos - record.realGovServedPos}</>),
            },
          ],
        },
        {
          title: '其他事业编制数',
          dataIndex: 'b',
          children: [
            {
              title: '应配人数',
              dataIndex: 'servedPos',
            },
            {
              title: '实配人数',
              dataIndex: 'realServedPos',
            },
            {
              title: '超配',
              dataIndex: 'ii',
              render: (text, record) => (<>{record.realServedPos - record.servedPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'jj',
              render: (text, record) => (<>{record.servedPos - record.realServedPos}</>),
            },
          ],
        },
        {
          title: '工勤编制数',
          dataIndex: 'c',
          children: [
            {
              title: '应配人数',
              dataIndex: 'workersPos',
            },
            {
              title: '实配人数',
              dataIndex: 'realWorkersPos',
            },
            {
              title: '超配',
              dataIndex: 'ii',
              render: (text, record) => (<>{record.realWorkersPos - record.workersPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'jj',
              render: (text, record) => (<>{record.workersPos - record.realWorkersPos}</>),
            },
          ],
        },
        {
          title: '其他编制数',
          dataIndex: 'd',
          children: [
            {
              title: '应配人数',
              dataIndex: 'otherPos',
            },
            {
              title: '实配人数',
              dataIndex: 'realOtherPos',
            },
            {
              title: '超配',
              dataIndex: 'ii',
              render: (text, record) => (<>{record.realOtherPos - record.otherPos}</>),
            },
            {
              title: '缺配',
              dataIndex: 'jj',
              render: (text, record) => (<>{record.otherPos - record.realOtherPos}</>),
            },
          ],
        },
      ],
    },
  ];

  okHandler = () => {
    const { record } = this.props;
    const exportpost = {};
    exportpost.data = JSON.stringify(record);
    postExcelLotOrgLeaderPostSet(exportpost, '/api/oa/admin/v1/OrgOrganization/lotOrgLeaderPostSetExport')
    // const { onOk, record } = this.props;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    // onOk(record.id, { ...record, ...values });
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
    const exportpost = {};
    exportpost.data = JSON.stringify(record);
    console.log(record)
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
              <Button type="primary" onClick={() => postExcelLotOrgLeaderPostSet(exportpost, '/api/oa/admin/v1/OrgOrganization/lotOrgLeaderPostSetExport')}>导出</Button>
            </Col>
          </Row> */}
          <div style={{ marginBottom: 20 }}>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={record}
              bordered
              pagination={false}
              align="center"
              size="small"
              // scroll={{ x: 2000, y: 450 }}
            />
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(Staffing);
