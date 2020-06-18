import React, { Component } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  Typography,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Tabs,
  Select,
  Slider,
  Dropdown,
  Tag,
  Menu,
} from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import InputColor from 'react-input-color';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { Title } = Typography;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
class ProjectAttributeView extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    tagsValus: '',
    tagsVisible: false,
    tags: '',
  };

  componentDidMount() {
    const { tags } = this.props.record;
    this.setState({ tags });
  }

  /** ********************************************************************************************* */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          logoColor: values.logoColor.hex,
          planBeginDate: values.planBeginDate
            ? moment(values.planBeginDate).format('YYYY-MM-DD HH:mm:ss')
            : values.planBeginDate,
          planEndDate: values.planEndDate
            ? moment(values.planEndDate).format('YYYY-MM-DD HH:mm:ss')
            : values.planEndDate,
          beginDate: values.beginDate
            ? moment(values.beginDate).format('YYYY-MM-DD HH:mm:ss')
            : values.beginDate,
          endDate: values.endDate
            ? moment(values.endDate).format('YYYY-MM-DD HH:mm:ss')
            : values.endDate,
          updateTime: values.updateTime
            ? moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : values.updateTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  // 移除标签
  removeTags = index => {
    const { tags } = this.state;
    const words = tags.split(',');
    words.splice(index, 1);
    const word = `${words.toString()}`;
    this.setState({ tags: word });
  };

  // 增加标签
  addTags = value => {
    const { tags } = this.state;
    this.setState({
      tags: tags === null || tags === undefined || tags.length === 0 ? value : `${tags},${value}`,
    });
  };

  setTagsInput = () => {
    const { tagsVisible } = this.state;
    this.setState({ tagsVisible: !tagsVisible });
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  handleInputChange = e => {
    this.setState({ tagsValus: e.target.value });
  };

  // 增加自定义标签
  customizeTags = e => {
    this.setState({ tagsValus: '' });
    const { value } = e.target;
    const { tags } = this.state;
    this.setState({
      tags: tags === null || tags === undefined || tags.length === 0 ? value : `${tags},${value}`,
    });
  };

  renderTagsColor = item => {
    switch (item) {
      case '日常任务':
        return 'orange';
      case '重要任务':
        return 'lime';
      case '学习发展':
        return 'blue';
      default:
        return '#b53fa1';
    }
  };

  renderTags = tags => {
    if (!tags) return false;
    const words = tags.split(',');
    const loop = words =>
      words.map((item, index) => (
        <Tag
          key={item}
          color={this.renderTagsColor(item)}
          closable
          onClose={() => this.removeTags(tags, index)}
        >
          {item}
        </Tag>
      ));
    return <span>{loop(words)}</span>;
  };

  /** ********************************************************************************************* */
  // 项目详情页面
  JobProject = values => {
    const { projectData, treeData, jobProductsModel } = this.props;
    const { findData } = jobProductsModel;
    const {
      productId,
      tenantId,
      categoryId,
      projectCode,
      projectName,
      projectLogo,
      logoColor,
      taskName,
      description,
      priority,
      reward,
      pageUrl,
      taskStatus,
      progress,
      reason,
      rescue,
      planBeginDate,
      planEndDate,
      beginDate,
      endDate,
      planWorkload,
      workload,
      workloadUnits,
      duration,
      taskType,
      longitude,
      latitude,
      executorId,
      executorName,
      memberIds,
      memberNames,
      memberType,
      runId,
      currentNodeId,
      createTime,
      creatorUid,
      updateTime,
      updaterUid,
    } = values;
    const { tagsVisible, tagsValus, tags } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Tag className="site-tag-plus" color="orange" onClick={() => this.addTags('日常任务')}>
            日常任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="1">
          <Tag className="site-tag-plus" color="lime" onClick={() => this.addTags('重要任务')}>
            重要任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="2">
          <Tag className="site-tag-plus" color="cyan" onClick={() => this.addTags('紧急任务')}>
            紧急任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="3">
          <Tag className="site-tag-plus" color="blue" onClick={() => this.addTags('学习发展')}>
            学习发展
          </Tag>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
          {tagsVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={tagsValus}
              onChange={this.handleInputChange}
              onBlur={this.setTagsInput}
              onPressEnter={this.customizeTags}
            />
          ) : (
            <Tag className="site-tag-plus" color="#b53fa1" onClick={this.setTagsInput}>
              自定义
            </Tag>
          )}
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Form horizontal="true" onSubmit={this.okHandler}>
          <Row>
            <Col span={12}>
              <FormItem label="项目类别" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('categoryId', {
                  initialValue: categoryId || '',
                })(
                  <Select
                    showSearch
                    style={{ width: 248 }}
                    optionFilterProp="children"
                    dropdownMatchSelectWidth={false}
                    optionLabelProp="label"
                  >
                    {treeData !== undefined ? (
                      treeData.map(item => (
                        <Option value={item.id} key={item.id} label={item.categoryName}>
                          {item.categoryName}
                        </Option>
                      ))
                    ) : (
                      <Option value=""></Option>
                    )}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="项目编码" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('projectCode', {
                  initialValue: projectCode || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="任务名称" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('taskName', {
                  initialValue: taskName || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="优先级" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('priority', {
                  initialValue: priority || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem label="任务悬赏" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('reward', {
                  initialValue: reward || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="任务进度" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('progress', {
                  initialValue: progress || '0',
                })(
                  <Slider
                    min={0}
                    max={100}
                    tipFormatter={value => `${value}%`}
                    marks={{ 0: '0%', 100: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="计划开始时间"
                {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('planBeginDate', {
                  initialValue:
                    planBeginDate === undefined || planBeginDate === null
                      ? planBeginDate || ''
                      : moment(planBeginDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
            <Col span={12} pull={1}>
              <FormItem
                label="计划完成时间"
                {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('planEndDate', {
                  initialValue:
                    planEndDate === null || planEndDate === undefined
                      ? planEndDate || ''
                      : moment(planEndDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem label="开始时间" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('beginDate', {
                  initialValue:
                    beginDate === null || beginDate === undefined
                      ? beginDate || ''
                      : moment(beginDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="结束时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('endDate', {
                  initialValue:
                    endDate === null || endDate === undefined
                      ? endDate || ''
                      : moment(endDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                label="计划工作量"
                {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('planWorkload', {
                  initialValue: planWorkload || '0',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="实际工作量" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('workload', {
                  initialValue: workload || '0',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="工作量单位"
                {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('workloadUnits', {
                  initialValue: workloadUnits || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="任务时长" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('duration', {
                  initialValue: duration || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="流程ID" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('runId', {
                  initialValue: runId || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="当前节点" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('currentNodeId', {
                  initialValue: currentNodeId || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem label="关联表单" {...formItemLayout}>
            {getFieldDecorator('pageUrl', {
              initialValue: pageUrl || '',
            })(<Input />)}
          </FormItem>

          <FormItem label="未完成原因" {...formItemLayout}>
            {getFieldDecorator('reason', {
              initialValue: reason || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="补救措施" {...formItemLayout}>
            {getFieldDecorator('rescue', {
              initialValue: rescue || '',
            })(<Input />)}
          </FormItem>

          <FormItem label="任务类型" {...formItemLayout}>
            {getFieldDecorator('taskType', {
              initialValue: taskType || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="执行人id" {...formItemLayout}>
            {getFieldDecorator('executorId', {
              initialValue: executorId || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="责任人" {...formItemLayout}>
            {getFieldDecorator('executorName', {
              initialValue: executorName || '',
            })(<Input />)}
          </FormItem>
          {getFieldDecorator('id', {
            initialValue: values.id || '',
          })(<Input type="hidden" />)}
        </Form>
      </div>
    );
  };

  render() {
    const { title, visible, record } = this.props;
    console.log('进来了');
    return (
      <>
        <Modal
          title={title}
          width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="任务详情" key="1">
              {this.JobProject(record)}
            </TabPane>
            <TabPane tab="项目成员" key="2">
              项目成员
            </TabPane>
            <TabPane tab="工作流程" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Modal>
      </>
    );
  }
}

export default Form.create()(ProjectAttributeView);
