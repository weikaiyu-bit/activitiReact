import { CanvasMenu, ContextMenu, EdgeMenu, GroupMenu, MultiMenu, NodeMenu } from 'gg-editor';
import React from 'react';
import MenuItem from './MenuItem';
import styles from './index.less';

const FlowContextMenu = () => (
  <ContextMenu className={styles.contextMenu}>
    <NodeMenu>
      <MenuItem command="copy" text="复制"/>
      <MenuItem command="delete" text="删除"/>
    </NodeMenu>
    <EdgeMenu>
      <MenuItem command="delete" text="删除"/>
    </EdgeMenu>
    <GroupMenu>
      <MenuItem command="copy" text="复制"/>
      <MenuItem command="delete" text="删除"/>
      <MenuItem command="unGroup" icon="ungroup" text="取消分组" />
    </GroupMenu>
    <MultiMenu>
      <MenuItem command="copy" text="复制"/>
      <MenuItem command="paste" text="粘贴"/>
      <MenuItem command="addGroup" icon="group" text="添加分组" />
      <MenuItem command="delete" text="删除"/>
    </MultiMenu>
    <CanvasMenu>
      <MenuItem command="undo" text="撤销"/>
      <MenuItem command="redo" text="恢复"/>
      <MenuItem command="pasteHere" icon="paste" text="粘贴在这里" />
    </CanvasMenu>
  </ContextMenu>
);

export default FlowContextMenu;
