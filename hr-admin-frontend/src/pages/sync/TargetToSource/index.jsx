import React from 'react';
import { connect } from 'dva';
import * as service from './service';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Divider, Card, Row, Col, Form, Tabs,
  Icon, Input, Button,
  Progress, Select, message,Modal
} from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
@connect(({ syncModal, loading }) => ({
  syncModal,
  loading: loading.models.syncModal,
}))
@Form.create()
class TargetToSourceIndex extends React.PureComponent {
  state = {
    tabKey: "1",
    buttonStuats: false,
    toButtonStuats: false,
    num: 0,
    visible: false
  };

  columns = [
    {
      title: '序号',
      width: '10%',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '表名',
      render: (text) => <span>{text}</span>,
    }, /* {
      title: '出生年月',
      dataIndex: 'birth',
      render: text => (text ? moment(text).format('YYYY年MM月DD日') : ''),
    }, */
    {
      title: '操作',
      dataIndex: 'state',
      render: (data) => (
        <>
          <a onClick={() => this.showEditModal(data)}>初始化</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(data)}>全量同步</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(data)}>增量同步</a>
        </>
      ),
    },
  ];

  componentDidMount() {
    //   this.findPage();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  findPage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'syncModal/fetch',
      payload: {
        condition: 'two',
      },
      /*   JSON.stringify({
         condition: 'two',
       }), */
    });
  };

  synchronousAssistant = () => {
    service.a01({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('人员档案同步成功');
       /* this.setState({
          num: 100,
        })*/
      }else{
        message.error('人员档案同步失败');
      }
    })
    service.a05({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('职务职级同步成功');
        /* this.setState({
           num: 100,
         })*/
      }else{
        message.error('职务职级同步失败');
      }
    })
    service.a14({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('奖惩信息同步成功');
        /* this.setState({
           num: 100,
         })*/
      }else{
        message.error('奖惩信息同步失败');
      }
    })
    service.a06({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('专业技术任职资格信息同步成功');
        /* this.setState({
           num: 100,
         })*/
      }else{
        message.error('专业技术任职资格信息同步失败');
      }
    })
    service.a36({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('家庭成员及社会关系信息同步成功');
        /* this.setState({
           num: 100,
         })*/
      }else{
        message.error('家庭成员及社会关系信息同步失败');
      }
    })
    /*service.a30({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('退出信息同步成功');
        /!* this.setState({
           num: 100,
         })*!/
      }else{
        message.error('退出信息同步失败');
      }
    })*/
    service.a08({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('学历学位同步成功');
        /* this.setState({
           num: 100,
         })*/
      }else{
        message.error('学历学位同步失败');
      }
    })
    service.a15({}).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('年度考核结果综述同步成功');
         this.setState({
           num: 100,
         })
      }else{
        message.error('年度考核结果综述同步失败');
      }
    })

  }

  tosynchronousAssistant = () => {
    service.pfilepersonnel({ tableName: 'a01' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('人员档案同步成功');
      }else{
        message.error('人员档案同步失败');
      }
    })
    service.pfilepositionlevel({ tableName: 'a05' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('职务职级同步成功');
      }else{
        message.error('职务职级同步失败');
      }
    })
    service.pfilerewardspunishments({ tableName: 'a14' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('奖惩信息同步成功');
      }else{
        message.error('奖惩信息同步失败');
      }
    })
    service.pfileprofessionaltechnicalqualification({ tableName: 'a06' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('专业技术任职资格信息同步成功');
      }else{
        message.error('专业技术任职资格信息同步失败');
      }
    })
    service.pfilefamilyrelations({ tableName: 'a36' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('家庭成员及社会关系信息同步成功');
      }else{
        message.error('家庭成员及社会关系信息同步失败');
      }
    })
    service.pfileexit({ tableName: 'a30' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('退出信息同步成功');
      }else{
        message.error('退出信息同步失败');
      }
    })
    service.pfileeducational({ tableName: 'a08' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('学历学位同步成功');
      }else{
        message.error('学历学位同步失败');
      }
    })
    service.pfileannualappraisalnarrative({ tableName: 'a15' }).then(res => {
      //   this._callback(res, (() => { this.setState({ loading: false }) }));
      console.log(res)
      if (res.success) {
        message.success('年度考核结果综述同步成功');
        this.setState({
          num: 100,
        })
      }else{
        message.error('年度考核结果综述同步失败');
      }
    })
  }

  backupData = e =>{
    const data =
      {
        ip: "10.168.1.39",
        port: "3306",
        userName: "root",
        password: "Abcd@1234",
        databaseName: "dtsea_personner_gov",
        fileName: "111",
        defaultCharacterSet: "utf8",
        isCompact: 1,
        isComments: 0,
        isCompleteInsert: 0,
        isLockTables: 0,
        isNoCreateDb: 0,
        isForce: 1,
        isAddDropDatabase: 1,
        isAddDropTable: 1,
        isSpecifyTable: 0

      }
    service.backup({ ...data }).then(res => {
      if (res.success) {
        message.success('备份成功');
        this.setState({
          num: 100,
        })
      }else{
        message.error('备份失败');
      }
    })
  }

  /**
   * demo演示
   * @param e
   */
  backupData1 = e =>{
    const data =
      {
        ip: "10.168.1.49",
        port: "45017",
        userName: "root",
        password: "abcd1234",
        databaseName: "zwhzyq",
        fileName: "111",
        defaultCharacterSet: "utf8",
        isCompact: 1,
        isComments: 0,
        isCompleteInsert: 0,
        isLockTables: 0,
        isNoCreateDb: 0,
        isForce: 1,
        isAddDropDatabase: 1,
        isAddDropTable: 1,
        isSpecifyTable: 0

      }
    service.backup({ ...data }).then(res => {
      if (res.success) {
        message.success('备份成功');
        this.setState({
          num: 100,
        })
      }else{
        message.error('备份失败');
      }
    })
  }

  recoverName = e =>{
    const data =
      {
        ip: "10.168.1.49",
        port: "45017",
        userName: "root",
        password: "abcd1234",
        databaseName: "zwhzyq",
        dumpId:2
      }
    service.recoverName({ ...data }).then(res => {
      if (res.success) {
        message.success('恢复成功');
        this.setState({
          num: 100,
        })
      }else{
        message.error('恢复失败');
      }
    })
  }

  recoverName1 = e =>{
    const data =
      {
        ip: "10.168.1.39",
        port: "3306",
        userName: "root",
        password: "Abcd@1234",
        databaseName: "dtsea_personner_gov",
        dumpId:2

      }
    service.recoverName({ ...data }).then(res => {
      if (res.success) {
        message.success('恢复成功');
        this.setState({
          num: 100,
        })
      }else{
        message.error('恢复失败');
      }
    })
  }

  deleteData = num =>{
    const data =
      {
        tableName:num

      }



    service.deleteData({ ...data }).then(res => {
      if (res.success) {
        message.success('删除成功');
        this.setState({
          num: 100,
        })
      }else{
        message.error('删除失败');
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        message.success('连接成功');
        if (values.system === '1') {
          this.setState({
            buttonStuats: false,
          })
          this.setState({
            toButtonStuats: true,
          })
          this.setState({
            num: 0,
          })
        } else {
          this.setState({
            toButtonStuats: false,
          })
          this.setState({
            buttonStuats: true,
          })
          this.setState({
            num: 0,
          })
        }
      }
    });
  };

  handleTabChange = tabKey => {
    console.log('tabKey=', tabKey);
    this.setState({
      tabKey,
    });
  };

  renderSetting() {
    const { buttonStuats, toButtonStuats } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <>
        <Form onSubmit={this.handleSubmit} className="login-form" {...formItemLayout} >
          <Form.Item label="同步系统" hasFeedback>
            {getFieldDecorator('system', {
              rules: [{ required: true, message: '请选择要同步的系统!' }],
            })(
              <Select placeholder="请选择要同步的系统">
                <Option value="1">全国公务员信息管理系统</Option>
                <Option value="2">国家统计局人事编制管理系统</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="IP地址">
            {getFieldDecorator('ipAddress', {
              rules: [{ required: true, message: '请输入IP地址!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="IP地址"
              />,
            )}
          </Form.Item>
          <Form.Item label="用户名">
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户"
              />,
            )}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item label="数据库" hasFeedback>
            {getFieldDecorator('driver', {
              rules: [{ required: true, message: '请选择数据库驱动!' }],
            })(
              <Select placeholder="请选择数据库驱动">
                <Option value="com.mysql.cj.jdbc.Driver">MySql</Option>
                <Option value="oracle.jdbc.driver.OracleDriver">Oracle</Option>
              </Select>,
            )}
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              连接数据库
            </Button>
            <Button style={{ marginLeft: 8 }}>
              取消
            </Button>
          </div>
        </Form>
      </>
    )
  }

  renderTab() {
    const { buttonStuats, toButtonStuats, tabKey } = this.state;
    console.log('tabKey=', tabKey);

    if (tabKey === '1') {
      return (
        <>
          <Row>
            <Progress percent={this.state.num} />
          </Row>
          <Row style={{ marginTop: 24 }} >
            <Button style={{ marginLeft: 8 }} disabled={toButtonStuats}
              onClick={() => this.synchronousAssistant()}>
              同步到全国公务员信息系统
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }}
              onClick={ ()=>this.backupData1() }
            >
              备份
            </Button>
            <Button style={{ marginLeft: 8 }}
                    onClick={() => this.recoverName()}
            >
              恢复
            </Button>
            <Button type="danger" style={{ marginLeft: 8 }}
              onClick={() => this.deleteData(2)}
            >
              清除
            </Button>
          </Row>
          <Row style={{ marginTop: 24 }} >
            <Button style={{ marginLeft: 8 }} disabled={buttonStuats}
              onClick={() => this.tosynchronousAssistant()}>
              同步到本地
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }}
              onClick={() => this.backupData("1")}
            >
              备份
            </Button>
            <Button style={{ marginLeft: 8 }}
              onClick={() => this.recoverName1()}
            >
              恢复
            </Button>
            <Button type="danger" style={{ marginLeft: 8 }}
                    onClick={() => this.deleteData(1)}>
              清除
            </Button>
          </Row>
        </>
      );
    }
    if (tabKey === '2') {
      return (
        <>
          <Row>
            <Progress percent={this.state.num} />
          </Row>
          <Row style={{ marginTop: 24 }} >
            <Button style={{ marginLeft: 8 }} disabled={toButtonStuats}
              onClick={() => this.tosynchronousAssistant()}>
              同步到国家统计局人事编制管理系统
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }}
                    onClick={()=>this.backupData()}>
              备份
            </Button>
            <Button style={{ marginLeft: 8 }}
                    onClick={() => this.recoverName1()}>
              恢复
            </Button>
            <Button type="danger" style={{ marginLeft: 8 }}
                    onClick={() => this.deleteData(1)}>
              清除
            </Button>
          </Row>
          <Row style={{ marginTop: 24 }} >
            <Button style={{ marginLeft: 8 }} disabled={buttonStuats}
              onClick={() => this.synchronousAssistant()}>
              同步到本地
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }}
              onClick={()=>this.backupData1()}
            >
              备份
            </Button>
            <Button style={{ marginLeft: 8 }}
                    onClick={() => this.recoverName()}>
              恢复
            </Button>
            <Button type="danger" style={{ marginLeft: 8 }}
                    onClick={() => this.deleteData(2)}>
              清除
            </Button>
          </Row>
        </>
      );
    }
    if (tabKey === '3') {
      return (
        this.renderSetting()
      );
    }
  }

  render() {
    const { buttonStuats, toButtonStuats } = this.state;
    const { getFieldDecorator } = this.props.form;

    const tabList = [
      {
        key: '1',
        tab: '全国公务员信息管理系统',
      },
      {
        key: '2',
        tab: '国家统计局人事编制管理系统',
      },
      {
        key: '3',
        tab: '同步配置',
      },
    ];

    return (
      <PageHeaderWrapper
        title="数据同步"
        defaultActiveKey="1"
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <Card>
          {this.renderTab()}
          <Modal
            title="警告"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>{this.state.str}</p>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default TargetToSourceIndex;
