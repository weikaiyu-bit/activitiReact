import React, { Component } from 'react';
import { Modal, Form, Input, Table, Tag, Divider, Button, Row, Select, Col, Descriptions } from 'antd';
import '@/assets/css/reward.less'
import '@/assets/css/style.css'

const InputGroup = Input.Group;
const FormItem = Form.Item;
const TextArea = Input;

class Reward extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  columns = [
    {
      title: '年度',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '考核结论',
      dataIndex: 'conclusion',
      key: 'conclusion',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>删除</a>
        </span>
      ),
    },
  ];

  data = [
    {
      key: '100',
      year: '2016',
      conclusion: '称职',
    },
  ];
  render() {
    const { title, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form onSubmit={this.okHandler}>
            <Row>
              <Col span={18}>
                <Descriptions size="middle" bordered column={{ md: 24, xs: 8, sm: 16 }}>
                  <Descriptions.Item label="文字描述">
                    {
                      getFieldDecorator('reward', {
                        initialValue: '',
                      })(<TextArea rows={5} onDoubleClick={this.onDoubleClick} />)
                    }
                  </Descriptions.Item>
                </Descriptions>
                <Table bordered columns={this.columns} dataSource={this.data} size="small" pagination={false} />
              </Col>
              <Col span={5} offset={1}>
                <div className="addModalForm">
                  <FormItem label="考核年度">
                    <InputGroup compact>
                      <Select defaultValue="2016">
                        <Option value="2016">2016</Option>
                        <Option value="2017">2017</Option>
                        <Option value="2018">2018</Option>
                      </Select>
                    </InputGroup>
                    </FormItem>
                    <FormItem label="考核结论">
                      <InputGroup compact>
                      <Select>
                        <Option value="优秀">优秀</Option>
                        <Option value="称职">称职</Option>
                        <Option value="合格">合格</Option>
                        <Option value="基本称职">基本称职</Option>
                        <Option value="基本合格">基本合格</Option>
                        <Option value="不称职">不称职</Option>
                        <Option value="不合格">不合格</Option>
                      </Select>
                      </InputGroup>
                    </FormItem>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal >
      </>
    );
  }
}

export default Form.create()(Reward);
