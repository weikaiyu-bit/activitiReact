import { CanvasPanel, DetailPanel, EdgePanel, GroupPanel, NodePanel } from 'gg-editor';
// import { Card } from 'antd' MultiPanel;
import React from 'react';
import DetailForm from './DetailForm';
// import DtseaNodeDetailPanel from './DtseaNodeDetailPanel'
import DtseaCanvasDetailPanel from './DtseaCanvasDetailPanel'
// import DtseaEdgeDetailPanel from './DtseaEdgeDetailPanel'
import styles from './index.less';

class DtseaFlowDetailPanel extends React.PureComponent {
  render() {
    const { NodesAttribute, record } = this.props
    return (
      <>
        <DetailPanel className={styles.detailPanel}>
          <NodePanel>
            <DetailForm type="node" NodesAttribute={NodesAttribute}/>
          </NodePanel>
          <EdgePanel>
            <DetailForm type="edge" />
          </EdgePanel>
          <GroupPanel>
            <DetailForm type="group" />
          </GroupPanel>
          {/* <MultiPanel>
            <Card type="inner" size="small" title="Multi Select" bordered={false} />
            </MultiPanel>  */}
          <CanvasPanel>
            {/* <Card type="inner" size="small" title="流程信息" bordered={false} /> */}
              <DtseaCanvasDetailPanel type="inner" {...record}></DtseaCanvasDetailPanel>
          </CanvasPanel>
        </DetailPanel>
      </>
    )
  }
}
/* const FlowDetailPanel = () => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DtseaDetailPanel type="node" />
    </NodePanel>
    <EdgePanel>
      <DtseaEdgeDetailPanel type="edge" />
    </EdgePanel>
    <GroupPanel>
      <DetailForm type="group" />
    </GroupPanel>
    {/!* <MultiPanel>
      <Card type="inner" size="small" title="Multi Select" bordered={false} />
    </MultiPanel> *!/}
    <CanvasPanel>
      {/!* <Card type="inner" size="small" title="流程信息" bordered={false} /> *!/}
      <DtseaCanvasDetailPanel type="inner"></DtseaCanvasDetailPanel>
    </CanvasPanel>
  </DetailPanel>
); */

export default DtseaFlowDetailPanel;
