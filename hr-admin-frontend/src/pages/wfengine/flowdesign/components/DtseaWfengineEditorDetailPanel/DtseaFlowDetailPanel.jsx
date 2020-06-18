import { CanvasPanel, DetailPanel, EdgePanel, GroupPanel, MultiPanel, NodePanel } from 'gg-editor';
import { Card } from 'antd';
import React from 'react';
import DetailForm from './DtseaDetailForm';
import styles from './index.less';

const DtseaFlowDetailPanel = () => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DetailForm type="node" />
    </NodePanel>
    <EdgePanel>
      <DetailForm type="edge" />
    </EdgePanel>
    <GroupPanel>
      <DetailForm type="group" />
    </GroupPanel>
    <MultiPanel>
      <Card type="inner" size="small" title="Multi Select" bordered={false} />
    </MultiPanel>
    <CanvasPanel>
      <Card type="inner" size="small" title="流程信息" bordered={false} />
    </CanvasPanel>
  </DetailPanel>
);

export default DtseaFlowDetailPanel;
