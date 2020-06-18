/* eslint-disable eqeqeq */
/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Tree, Input } from 'antd';

const { TreeNode } = Tree;
const { Search } = Input;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id == key)) {
        parentKey = node.id.toString();
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

/**
 * 网站栏目树
 * @author b__c<br> bc@dsea.net<br>2018-11-30 17:22:57
 */
export default class CategoryTreeView extends PureComponent {
  treeData = [];

  listData = [];

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
  };

  componentWillMount() {
    const { tree, data } = this.props;
    this.treeData = tree;
    this.listData = data;
  }

  setSelectKey = selectedKeys => {
    this.setState({
      selectedKeys,
    });
    console.log('selectedKeys', selectedKeys);
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    console.log('onChange:', e);
    const expandedKeys = this.listData
      .map(item => {
        if (item.categoryName.indexOf(value) > -1) {
          return getParentKey(item.id, this.treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  getCategoryIds = (list, childrens) => {
    for (let i = 0; i < childrens.length; i += 1) {
      list.push(childrens[i].key);
      if (childrens[i].props.children) {
        this.getCategoryIds(list, childrens[i].props.children);
      }
    }
  };

  // 选中左侧树状菜单,展示数据并存储ID
  onSelect = (categoryIds, info) => {
    const { onFind, pageSize, filter, setSelectedKeys } = this.props;
    const list = [];
    if (info.selected) {
      this.setState({ selectedKeys: categoryIds });
      setSelectedKeys(categoryIds);
      list.push(categoryIds[0]);
      if (info.selectedNodes[0].props.children) {
        this.getCategoryIds(list, info.selectedNodes[0].props.children);
      }
    } else {
      this.setState({ selectedKeys: [] });
      setSelectedKeys([]);
    }
    onFind(1, pageSize, { ...filter, categoryIds: list });
  };

  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.categoryName.indexOf(searchValue);
      const beforeStr = item.categoryName.substr(0, index);
      const afterStr = item.categoryName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.categoryName}</span>
        );
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id} dataRef={item} />;
    });
    return newTree;
  };

  render() {
    const { expandedKeys, autoExpandParent } = this.state;
    const { tree, data } = this.props;
    this.treeData = tree;
    this.listData = data;
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="请输入栏目名称" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(this.treeData)}
        </Tree>
      </div>
    );
  }
}
