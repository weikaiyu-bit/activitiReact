import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Table, Button } from 'antd';
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

class PPersonnelFilesSearchNameOrIdCardModal extends Component {

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      width: 30,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      width: 31,
    },
    {
      title: '单位职务',
      dataIndex: 'idCard',
      ellipsis: true,
      width: 50,
    },
    {
      title: '人员状态',
      dataIndex: 'orgId',
      ellipsis: true,
      width: 50,
    },
  ]

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      selectedRowKeys: [],
    };
  }

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  render() {
    const { title, record, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    // const [selectionType, setSelectionType] = useState('checkbox');

    const rowSelection = {
      columnWidth: '20px',
      selectedRowKeys,
      onChange: this.onSelectChange,

    };

    return (
      <>
        <Modal
          title={title}
          width={800}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form {...formItemLayout} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
              <Col span={8}>
                <FormItem label="姓名" >
                  {getFieldDecorator('name')(<Input placeholder="姓名" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="身份证号码" >
                  {getFieldDecorator('IdCard')(<Input placeholder="身份证号码" />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24} style={{ color: '#f5222d' }}>
                多个姓名/身份证查
                询，请按逗号隔开。
              </Col>
            </Row>
          </Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: '50px' }}>
            <Col span={10}>
              <Table
                rowKey="id"
                size="small"
                // loading={loading}
                // columns={this.columns}
                // dataSource={data}
                // pagination={paginationProps}
                rowSelection={rowSelection}
                columns={this.columns}
                onChange={this.handleTableChange}
                scroll={{ y: 1200 }}
                bordered="true"
              />
            </Col>
            <Col span={2} layout="horizontal">
              <Button shape="circle" icon="right">
              </Button>
              <Button shape="circle" icon="double-right" style={{ marginTop: '20px' }}>
              </Button>
              <Button shape="circle" icon="left" style={{ marginTop: '20px' }}>
              </Button>
              <Button shape="circle" icon="double-left" style={{ marginTop: '20px' }}>
              </Button>
            </Col>
            <Col span={10}>
              <Table
                rowKey="id"
                size="small"
                // loading={loading}
                // columns={this.columns}
                // dataSource={data}
                // pagination={paginationProps}
                rowSelection={rowSelection}
                columns={this.columns}
                onChange={this.handleTableChange}
                scroll={{ y: 1200 }}
                bordered="true"
              />
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PPersonnelFilesSearchNameOrIdCardModal);
