import React from 'react';
import GGEditor, {CanvasPanel, DetailPanel, EdgePanel, Flow, GroupPanel, MultiPanel, NodePanel} from 'gg-editor';
import NodeDetail from "@/components/wfdesigner/detail/node";
import EdgeDetail from "@/components/wfdesigner/detail/edge";
import CanvasDetail from "@/components/wfdesigner/detail/canvas";

const viewer = {
  width: '500px',
  minHeight: '480px',
  background: 'white',
}
GGEditor.setTrackable(false);
export default class FlowViewer extends React.PureComponent {
  render() {
    const { data } = this.props;
    return (
      <GGEditor >
        <Flow style={viewer} data={data.content} />
        <DetailPanel>
          <NodePanel>
            <NodeDetail/>
          </NodePanel>
          <EdgePanel >
            <EdgeDetail/>
          </EdgePanel>
          <GroupPanel />
        </DetailPanel>
      </GGEditor>
    )
  }
}
