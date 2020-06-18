import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Row, Col, Table, Button, Checkbox, Card, Tree, Icon } from 'antd';
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// const FormItem = Form.Item;
const { TreeNode } = Tree;
@connect(({ pPersonnelFilesModel, loading }) => ({
  pPersonnelFilesModel,
  loading: loading.models.fetch,
}))
class PPersonnelFilesSearchOrgModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      selectedRowKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      expandedKeys: [],
      searchValue: '',
    };
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
          <TreeNode title={title} key={item.id} dataRef={item} icon={<Icon type="border-left" />}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id} dataRef={item} icon={<Icon type="border-left" />}/>;
    });
    return newTree;
  };

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

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  // 选中左侧树状菜单,展示数据并存储集团ID
  onSelect = (selectedKeys, info) => {
    this.setState(
      {
        selectedKeys,
        pageNumber: 1,
      },
      () => {
        const { pageNumber, pageSize } = this.state;
        const { id, pid, type } = info.node.props.dataRef;
        const orgs = {};
        if (info.selected) {
          // 判断是集团还是公司，来决定设置参数
          if (pid === 0 && type === 'GROUP') {
            orgs.groupId = id;
            const groupId = id;
            this.findPage(pageNumber, pageSize, { groupId });
          } else if (type === 'COMPANY' && pid !== 0) {
            orgs.groupId = pid;
            orgs.unitId = id;
            const unitId = id;
            this.findPage(pageNumber, pageSize, { unitId });
          } else if (type === 'COMPANY' && pid === 0) {
            orgs.unitId = id;
            const unitId = id;
            this.findPage(pageNumber, pageSize, { unitId });
          } else if (type === 'DEPARTMENT') {
            const groupId = this.getRoot(pid);
            if (groupId !== 0) {
              orgs.groupId = groupId;
              orgs.unitId = pid;
              orgs.deptId = id;
              const deptId = id;
              this.findPage(pageNumber, pageSize, { deptId });
            } else {
              orgs.unitId = pid;
              orgs.deptId = id;
              const deptId = id;
              this.findPage(pageNumber, pageSize, { deptId });
            }
          }
          // 根据集团ID查询人员状态信息,如果存在集团id，根据集团id查状态码，否则按照公司id查状态码
          if (orgs.groupId) {
            this.findStatus(orgs.groupId);
          } else {
            this.findStatus(orgs.unitId);
          }
          // 取消选择
        } else {
          this.findPage(pageNumber, pageSize, { unitId: -1 });
          this.findStatus();
        }
        this.props.form.resetFields('statusCode');
      },
    );
  };

  renderOrg() {
    let catgPer = {};
    const tree = this.props.data;
    if (tree != undefined) {
      catgPer = (
        <div>
          <Tree
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
            showIcon="true"
          >
            {this.renderTreeNodes(tree)}
          </Tree>
        </div>
      );
    }
    return catgPer;
  }

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
          width={500}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Card style={{ marginTop: '20px' }}>
            <Col span={8}>
              <Checkbox>连续选择</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox>包含下级</Checkbox>
            </Col>
          </Card>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
            <Col>
              <Card onTabChange={this.handleOrgChange}>
                <div>{this.renderOrg()}</div>
              </Card>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PPersonnelFilesSearchOrgModal);
