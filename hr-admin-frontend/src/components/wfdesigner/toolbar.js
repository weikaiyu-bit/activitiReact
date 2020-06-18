import React from 'react';
import { Divider, Tooltip, Button } from 'antd';
import { Toolbar, Command, withPropsAPI } from 'gg-editor';
import upperFirst from 'lodash/upperFirst';
import IconFont from './iconfont';
import styles from './index.less';

const Item = props => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <Tooltip title={text || upperFirst(command)} placement="bottom">
        <IconFont type={`icon-${icon || command}`} />
      </Tooltip>
    </Command>
  );
};

class ToolBar extends React.PureComponent {
  __save() {
    const { propsAPI, onSave } = this.props;

    if (onSave != null) {
      onSave(propsAPI.save());
    }

    // console.log( propsAPI.save());
  }

  render() {
    return (
      <Toolbar className={styles.toolbar}>
        <Tooltip title="保存流程图" placement="bottom">
          <Button type="primary" onClick={this.__save.bind(this)} icon="save" />
        </Tooltip>
        <Divider type="vertical" />
        <Item command="undo" text="不做" />
        <Item command="redo" text="重做" />
        <Divider type="vertical" />
        <Item command="copy" text="复制" />
        <Item command="paste" text="粘贴" />
        <Item command="delete" text="删除" />
        <Divider type="vertical" />
        <Item command="zoomIn" icon="zoom-in" text="放大" />
        <Item command="zoomOut" icon="zoom-out" text="缩小" />
        <Item command="autoZoom" icon="fit-map" text="自动适应" />
        <Item command="resetZoom" icon="actual-size" text="原始大小" />
        <Divider type="vertical" />
        <Item command="toBack" icon="to-back" text="上一步" />
        <Item command="toFront" icon="to-front" text="下一步" />
        <Divider type="vertical" />
        <Item command="multiSelect" icon="multi-select" text="多选" />
        <Item command="addGroup" icon="group" text="组合" />
        <Item command="unGroup" icon="ungroup" text="取消组合" />
      </Toolbar>
    );
  }
}

export default withPropsAPI(ToolBar);
