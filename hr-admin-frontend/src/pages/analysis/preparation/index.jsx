import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Form, Tree } from 'antd';
// import ErrorCode from '../../../dtsea/common/ErrorCode';
const { DirectoryTree } = Tree;
const treeData = [
  {
    title: '参照公务员法管理的事业单位工作人员',
    key: '0-0',
    children: [
      {
        title: '第一表 参照管理人员数量变化情况（一）',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: '第二表 参照管理人员数量变化情况（二）',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
];

// @connect(({ pReparationModel, loading }) => ({
//   pReparationModel,
//   loading: loading.models.fetch,
// }))
class preparationIndex extends Component {
  state = {};

  onSelect = (keys, event) => {
    console.log('Trigger Select', keys, event);
  };

  onExpand = () => {
    console.log('Trigger Expand');
  };

  render() {
    // const { addData, editData } = this.state;
    return (
      <>
        <div style={{ width: '20%', height: 300, float: 'left', marginRight: '1%' }}>
          <Card style={{ height: 900 }}>
            <Card style={{ overflow: 'auto' }}>
              <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                treeData={treeData}
              ></DirectoryTree>
            </Card>
          </Card>
        </div>
        <div style={{ width: '79%', height: 900, float: 'left' }}>
          <Card style={{ height: 900, overflow: 'auto' }}></Card>
        </div>
      </>
    );
  }
}

export default Form.create()(preparationIndex);
