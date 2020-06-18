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
      title: '奖罚名称代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '奖罚名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '收惩罚时职务层次',
      dataIndex: 'position_level',
      key: 'position_level',
    },
    {
      title: '批准机关级别',
      key: 'approval_authority_level',
      dataIndex: 'approval_authority_level',
    },
    {
      title: '批准机关',
      key: 'approval_authority',
      dataIndex: 'approval_authority',
    },

    {
      title: '批准日期',
      key: 'approval_time',
      dataIndex: 'approval_time',
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
      key: '1',
      code: '授予荣誉称号',
      name: '授予荣誉称号',
      position_level: '试用期人员',
      approval_authority_level: '中央，国家级',
      approval_authority: '中国统计局广西调查总队',
      approval_time: '2020-02-20'
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
                  <Descriptions.Item label="奖惩描述">
                    {
                      getFieldDecorator('reward', {
                        initialValue: '',
                      })(<TextArea rows={5} onDoubleClick={this.onDoubleClick} />)
                    }
                  </Descriptions.Item>
                </Descriptions>
                <Table title={() => <div><Row><Col span={2} offset={21}><Button type="primary" ghost>追加当前条</Button></Col></Row></div>} bordered columns={this.columns} dataSource={this.data} size="small" pagination={false} />
              </Col>
              <Col span={5} offset={1}>
                <div className="addModalForm">
                  <FormItem label="惩罚名称代码">
                    <InputGroup compact>
                      <Select defaultValue="Option1-1">
                        <Option value="Option1-1">Option1-</Option>
                        <Option value="Option1-2">Option1-2</Option>
                      </Select>
                    </InputGroup>
                    </FormItem>
                    <FormItem label="奖罚名称">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                    <FormItem label="受奖罚时职务层次">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>

                    <FormItem label="批准机关级别">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                    <FormItem label="批准机关性质">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                    <FormItem label="批准机关">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                    <FormItem label="批准日期">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                    <FormItem label="撤销日期">
                      <InputGroup compact>
                        <Select defaultValue="Option1-1">
                          <Option value="Option1-1">Option1-</Option>
                          <Option value="Option1-2">Option1-2</Option>
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
