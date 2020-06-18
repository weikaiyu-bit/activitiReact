import React, { Component } from 'react';
import { Card, Form, Input, Button, Row, Col, Table, Divider, Progress, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import InputColor from 'react-input-color';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { TextArea } = Input;
class ReportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      color: '',
    };
  }

  okHandler = () => {
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, name, age, jigou, pxzt, pxdz, pxnr, pxsj, pfdw } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const columns = [
      {
        title: '处室名称',
        dataIndex: 'name',
        width: 'auto',
      },
      {
        title: '得分（满分五分）',
        dataIndex: 'age',
        width: '130px',
        render: text => <Input defaultValue={text} style={{ width: '100px' }}></Input>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: '220px',
        render: (text, record) => (
          <>
            <Button type="primary">参与评价</Button>
            <Divider type="vertical" />
            <Button type="primary">提交</Button>
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'ms',
      },
    ];
    const data = [
      {
        key: '1',
        name: '办公室',
        age: 32,
        jigou: '广西数航科技有限公司',
        khjd: '2020',
        ms: '已评价',
        gxsj: '2020-1-1',
        tbjd: 50,
      },
      {
        key: '2',
        name: '办公室',
        age: 42,
        jigou: '广西数航科技有限公司',
        khjd: '2020',
        ms: '已评价',
        gxsj: '2020-1-1',
        tbjd: 50,
      },
      {
        key: '3',
        name: '办公室',
        age: 32,
        jigou: '广西数航科技有限公司',
        khjd: '2020',
        ms: '已评价',
        gxsj: '2020-1-1',
        tbjd: 50,
      },
    ];

    return (
      <>
        <Modal
          title={title}
          width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <div style={{ textAlign: 'center', fontSize: '30px', marginBottom: '20px' }}>{name}</div>
          <Table columns={columns} dataSource={data} bordered pagination={false} />
        </Modal>
      </>
    );
  }
}

export default Form.create()(ReportForm);
