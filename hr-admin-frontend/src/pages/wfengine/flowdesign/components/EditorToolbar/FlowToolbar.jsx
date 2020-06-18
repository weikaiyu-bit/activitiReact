import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import { Toolbar, withPropsAPI } from 'gg-editor';
import { ToolbarButton, CustomToolbarButton } from './ToolbarButton';
import styles from './index.less';

class FlowToolbar extends React.PureComponent {
  _save= () => {
    const { propsAPI, getFlowCallback } = this.props;
    getFlowCallback(JSON.stringify(propsAPI.save()))
  }

  goBackPage = () => {
    // window.history.back(); // 返回
    this.props.props.goBack();
   // console.log(this.props.props)
  }

  render() {
    return (
      <>
      <Toolbar className={styles.toolbar}>
        <CustomToolbarButton icon="save" text="保存" _fun={this._save}/>
        <ToolbarButton command="undo" text="撤销"/>
        <ToolbarButton command="redo" text="还原"/>
        <Divider type="vertical" />
        <ToolbarButton command="copy" text="复制"/>
        <ToolbarButton command="paste" text="粘贴"/>
        <ToolbarButton command="delete" text="删除"/>
        <Divider type="vertical" />
        <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
        <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
        <CustomToolbarButton icon="fanhui" text="返回" _fun={this.goBackPage}/>
      </Toolbar></>
    )
  }
}
export default withPropsAPI(FlowToolbar);
