/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Modal, Form, Table, Button, Row, Col } from 'antd';

function exportXls(params, url) {
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

class Export extends Component {
  okHandler = () => {
    const { record, tableValue } = this.props;
    const exportpost = {};
    exportpost.orgFilter = JSON.stringify(record);
    exportpost.columns = JSON.stringify(tableValue);
    exportXls(exportpost, '/api/oa/admin/v1/OrgOrganization/exportXls')
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
    const { visible, title, record, tableValue } = this.props;
    const exportpost = {};
    exportpost.orgFilter = JSON.stringify(record);
    exportpost.columns = JSON.stringify(tableValue);
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
              <Button type="primary" onClick={() => exportXls(exportpost, '/api/oa/admin/v1/OrgOrganization/exportXls')}>导出</Button>
            </Col>
          </Row> */}
          <div style={{ marginBottom: 20 }}>
            <Table
              rowKey="id"
              columns={tableValue}
              dataSource={record}
              bordered
              pagination={false}
              align="center"
            />
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(Export);
