import React from 'react';
import GGEditor, {
  Flow,
  Item,
  ItemPanel,
  Command,
  DetailPanel,
  EdgePanel,
  NodePanel,
  GroupPanel,
  MultiPanel,
  CanvasPanel,
} from 'gg-editor';
import { Row, Col, message } from 'antd';
import NodeDetail from './detail/node';
import EdgeDetail from './detail/edge';
import CanvasDetail from './detail/canvas';
import ToolBar from './toolbar';
import Viewer from './viewer';
import styles from './index.less';

GGEditor.setTrackable(false);

const Control = props => {
  return <Item className={styles.control} type="node" {...props} />;
};

const Nodes = {
  starter: {
    type: 'start',
    size: '40*40',
    shape: 'flow-circle',
    color: '#13C2C2',
    label: '开始',
  },
  normal: {
    type: 'normal',
    size: '150*60',
    shape: 'flow-rect',
    color: '#1890FF',
    label: '过程',
  },
  decision: {
    type: 'decision',
    size: '150*60',
    shape: 'flow-rhombus',
    color: '#FA8C16',
    label: '决策',
  },
  ender: {
    type: 'end',
    size: '80*40',
    shape: 'flow-capsule',
    color: '#CC3333',
    label: '结束',
  },
};

class wfdesigner extends React.PureComponent {
  __drop(evt) {}

  __save(v) {
    this.props.onSave && this.props.onSave(v);
  }

  /**
   * 将后端数据转换为ggeditor格式
   * @param {String} v
   */
  static decode(v) {
    const json = JSON.parse(v);
    const nodes = [];
    if (v) return;
    json.nodes.forEach(item => {
      // nodes.push({
      //   ...item,
      //   type:'node',
      //   model:{
      //     label:item.type
      //   }
      // })

      let node = null;

      if (1 == item.type) {
        node = { ...Nodes.starter, ...item, type: Nodes.starter.type };
      } else if (2 == item.type) {
        node = { ...Nodes.normal, ...item, type: Nodes.normal.type };
      } else if (3 == item.type) {
        node = { ...Nodes.decision, ...item, type: Nodes.decision.type };
      } else if (4 == item.type) {
        node = { ...Nodes.ender, ...item, type: Nodes.ender.type };
      } else return;

      // delete item['size'];
      nodes.push(node);
    });

    return { nodes, edges: json.edges };
  }

  /**
   * 将ggeditor数据转换为后端格式
   * @param {Object} v
   */
  static encode(v) {
    const nodes = [];

    v.nodes.forEach(item => {
      const node = {
        id: item.id,
        x: item.x,
        y: item.y,
        index: item.index,
        label: item.label,
        listen: item.listen || 0,
      };

      if (Nodes.starter.type == item.type) {
        node.type = 1;
      } else if (Nodes.normal.type == item.type) {
        node.type = 2;
      } else if (Nodes.decision.type == item.type) {
        node.type = 3;
      } else if (Nodes.ender.type == item.type) {
        node.type = 4;
      } else return;

      nodes.push(node);
    });

    return JSON.stringify({
      nodes,
      edges: v.edges ? v.edges : [],
    });
  }

  render() {
    const { data, busy } = this.props;
    return (
      <React.Fragment>
        <GGEditor>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}>
              <ToolBar busy={busy} onSave={this.__save.bind(this)} />
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <ItemPanel style={{ width: '100px' }}>
              <Control
                size={Nodes.starter.size}
                shape={Nodes.starter.shape}
                model={{
                  color: Nodes.starter.color,
                  label: Nodes.starter.label,
                  type: Nodes.starter.type,
                }}
                src="https://gw.alipayobjects.com/zos/rmsportal/ZnPxbVjKYADMYxkTQXRi.svg"
              />
              <Control
                size={Nodes.normal.size}
                shape={Nodes.normal.shape}
                model={{
                  color: Nodes.normal.color,
                  label: Nodes.normal.label,
                  type: Nodes.normal.type,
                }}
                src="https://gw.alipayobjects.com/zos/rmsportal/wHcJakkCXDrUUlNkNzSy.svg"
              />
              <Control
                size={Nodes.decision.size}
                shape={Nodes.decision.shape}
                model={{
                  color: Nodes.decision.color,
                  label: Nodes.decision.label,
                  type: Nodes.decision.type,
                }}
                src="https://gw.alipayobjects.com/zos/rmsportal/SnWIktArriZRWdGCnGfK.svg"
              />
              <Control
                size={Nodes.ender.size}
                shape={Nodes.ender.shape}
                model={{
                  color: Nodes.ender.color,
                  label: Nodes.ender.label,
                  type: Nodes.ender.type,
                }}
                src="https://gw.alipayobjects.com/zos/rmsportal/rQMUhHHSqwYsPwjXxcfP.svg"
              />
            </ItemPanel>
            <div style={{ flex: 1, height: '1000px', padding: '0 16px' }}>
              <Flow className={styles.canvas} data={data.content} />
            </div>
            <div style={{ width: '296px' }}>
              <DetailPanel>
                <NodePanel>
                  <NodeDetail />
                </NodePanel>
                <EdgePanel>
                  <EdgeDetail />
                </EdgePanel>
                <GroupPanel />
                <MultiPanel />
                <CanvasPanel>
                  <CanvasDetail data={data} />
                </CanvasPanel>
              </DetailPanel>
            </div>
          </Row>
        </GGEditor>
      </React.Fragment>
    );
  }
}

const decode = v => {
  const json = JSON.parse(v);
  const nodes = [];
  json.nodes.forEach(item => {
    // nodes.push({
    //   ...item,
    //   type:'node',
    //   model:{
    //     label:item.type
    //   }
    // })

    let node = null;

    if (1 == item.type) {
      node = { ...Nodes.starter, ...item, type: Nodes.starter.type };
    } else if (2 == item.type) {
      node = { ...Nodes.normal, ...item, type: Nodes.normal.type };
    } else if (3 == item.type) {
      node = { ...Nodes.decision, ...item, type: Nodes.decision.type };
    } else if (4 == item.type) {
      node = { ...Nodes.ender, ...item, type: Nodes.ender.type };
    } else return;

    // delete item['size'];
    nodes.push(node);
  });

  return { nodes, edges: json.edges };
};

wfdesigner.Viewer = Viewer;
export { wfdesigner as default, Viewer };
