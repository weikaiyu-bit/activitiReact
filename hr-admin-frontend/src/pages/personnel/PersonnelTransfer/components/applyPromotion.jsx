import React, { Component } from 'react';
import { Modal, Form, Input, Tree, Table, Cascader, Card, TreeSelect, Icon, TimePicker, DatePicker, Tag, Divider, Button, Row, Select, Col, Descriptions } from 'antd';
import applyTransferStyle from '../css/applyTransfer.less'
import { connect } from 'dva';
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '所属调查队',
    dataIndex: 'team',
    key: 'team',
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职务',
    dataIndex: 'duty',
    key: 'duty',
  },
];

const tabList = [
  {
    key: 'position',
    tab: '职务变动',
  },
  {
    key: 'rank',
    tab: '职级变动',
  },
];

const data = [
  {
    key: '1',
    name: '张三',
    team: '国家统计局调查总队',
    department: '办公室',
    duty: '科室主任',
  },
];

@connect(({ personnelTransferModal, loading }) => ({
  personnelTransferModal,
  loading: loading.models.fetch,
}))
class ApplyPromotion extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    value: '',
    searchValue: '',
    key: 'position',
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  /** ****************************************************************************************** */

  okHandler = () => {
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  renderOrganizationTree = () => {
    const {
      personnelTransferModal: { tree },
    } = this.props;
    return (
      <>
        {
          this.renderTreeNodes(tree)
        }
      </>
    );
  }

  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.orgName.indexOf(searchValue);
      const beforeStr = item.orgName.substr(0, index);
      const afterStr = item.orgName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.orgName}</span>
          );
      if (item.children) {
        return (
          <TreeNode value={item.id} title={title} key={item.id} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={title} key={item.id} />;
    });
    return newTree;
  };

  // 选择调入的部门
  onChangeTree = (value, query, item) => {
    console.log(item)
    this.setState({ value });
  }

  // TransferDepartment() {
  //   const {
  //     personnelTransferModal: { tree },
  //   } = this.props;
  // }

  renderPersonnelFiles() {
    const { key } = this.state;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
    const { getFieldDecorator } = this.props.form;
    let catgPer = {};
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择调入的部门' }],
    };
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    // const {
    //   // loading: { effects },
    //   pPersonnelFilesModel: { data, total },
    // } = this.props;
    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   current: pageNumber,
    //   pageSize,
    //   total,
    // };
    if (key === 'position') {
      catgPer = (
        <Form className="login-form" layout="horizontal">
          <Form.Item label="变动文号" {...formItemLayout}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入变动文号' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入变动文号"
              />,
            )}
          </Form.Item>
          <Form.Item label="调入部门" placeholder="请选择调入的部门" {...formItemLayout}>
            {getFieldDecorator('value', {
              initialValue: this.state.value,
              rules: [{ required: true, message: '请选择调入的部门' }],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
                placeholder="请选择调入的部门"
                allowClear
                onChange={this.onChangeTree}
              >
                {this.renderOrganizationTree()}
              </TreeSelect>,
            )}
          </Form.Item>

          <Form.Item label="调入职务" {...formItemLayout}>
            {getFieldDecorator('duty', {
              rules: [{ required: true, message: '请选择调动后的职务' }],
            })(
              <Input
                prefix={<Icon type="stock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请选择调动后的职务"
              />,
            )}
          </Form.Item>
          <Form.Item className={applyTransferStyle.applyTransfer} label="调入开始至结束时间" {...formItemLayout}>
            {getFieldDecorator('range-time-picker', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
            )}
          </Form.Item>
          <Form.Item label="变动原因" {...formItemLayout}>
            <TextArea rows={4} placeholder="请输入调动原因" />
          </Form.Item>
        </Form>
      );
    }
    if (key === 'rank') {
      catgPer = (
        <Form className="login-form" layout="horizontal">
          <Form.Item label="变动文号" {...formItemLayout}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入变动文号' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入变动文号"
              />,
            )}
          </Form.Item>
          <Form.Item label="调入部门" placeholder="请选择调入的部门" {...formItemLayout}>
            {getFieldDecorator('value', {
              initialValue: this.state.value,
              rules: [{ required: true, message: '请选择调入的部门' }],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
                placeholder="请选择调入的部门"
                allowClear
                onChange={this.onChangeTree}
              >
                {this.renderOrganizationTree()}
              </TreeSelect>,
            )}
          </Form.Item>

          <Form.Item label="调入职务" {...formItemLayout}>
            {getFieldDecorator('duty', {
              rules: [{ required: true, message: '请选择调动后的职务' }],
            })(
              <Input
                prefix={<Icon type="stock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请选择调动后的职务"
              />,
            )}
          </Form.Item>
          <Form.Item className={applyTransferStyle.applyTransfer} label="调入开始至结束时间" {...formItemLayout}>
            {getFieldDecorator('range-time-picker', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
            )}
          </Form.Item>
          <Form.Item label="变动原因" {...formItemLayout}>
            <TextArea rows={4} placeholder="请输入调动原因" />
          </Form.Item>
        </Form>
      );
    }
    return catgPer;
  }

  render() {
    const { title, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择调入的部门' }],
    };
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
          okText="提拔"
        >
          <Card>
            <Table bordered pagination={false} columns={columns} dataSource={data} />
          </Card>
          <Card
            // tabList={tabList}
            // activeTabKey={this.state.key}
            // onTabChange={key => {
            //   this.onTabChange(key, 'key');
            // }}
          >
            {/* {this.renderPersonnelFiles()} */}

            <Form className="login-form" layout="horizontal">
              <Form.Item label="变动文号" {...formItemLayout}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入变动文号' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入变动文号"
                  />,
                )}
              </Form.Item>
              <Form.Item label="调入部门" placeholder="请选择调入的部门" {...formItemLayout}>
                {getFieldDecorator('value', {
                  initialValue: this.state.value,
                  rules: [{ required: true, message: '请选择调入的部门' }],
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
                    placeholder="请选择调入的部门"
                    allowClear
                    onChange={this.onChangeTree}
                  >
                    {this.renderOrganizationTree()}
                  </TreeSelect>,
                )}
              </Form.Item>

              <Form.Item label="调入职务" {...formItemLayout}>
                {getFieldDecorator('duty', {
                  rules: [{ required: true, message: '请选择调动后的职务' }],
                })(
                  <Input
                    prefix={<Icon type="stock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请选择调动后的职务"
                  />,
                )}
              </Form.Item>
              <Form.Item className={applyTransferStyle.applyTransfer} label="调入开始至结束时间" {...formItemLayout}>
                {getFieldDecorator('range-time-picker', rangeConfig)(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item>
              <Form.Item label="变动原因" {...formItemLayout}>
                <TextArea rows={4} placeholder="请输入调动原因" />
              </Form.Item>
            </Form>
          </Card>
        </Modal >
        {/* {visible ? this.TransferDepartment : ''} */}
      </>
    );
  }
}

export default Form.create()(ApplyPromotion);
