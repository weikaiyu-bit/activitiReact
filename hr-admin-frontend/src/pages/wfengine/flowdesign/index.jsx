import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import GGEditor, { Flow } from 'gg-editor';
import { Col, Row } from 'antd';
// import EditorMinimap from './components/EditorMinimap';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';

GGEditor.setTrackable(false);
/**
 *@Author CCMse
 *@create 2020/2/12 13:26
 */
class FlowsIndex extends Component {
  state ={
    NodesAttribute: {},
  }

  onNodeClick=(e) => {
    console.log('点击：', this.props.props)
    const edges = e.item.itemMap._edges;
    const nodeId = e.item.id;
    const entranceNode = [];
    const exitNode = [];
    edges.forEach((item) => {
      if (nodeId === item.target.id) {
        entranceNode.push(item.source.model.label)
      }
      if (nodeId === item.source.id) {
        exitNode.push(item.target.model.label)
      }
    })
    console.log('入口节点：', entranceNode.toString())
    console.log('出节点：', exitNode.toString())
   // console.log(e.item.shapeObj.getStyle())
    this.setState({
      NodesAttribute: {
        entryNodeIds: entranceNode.toString(),
        exitNodeIds: exitNode.toString(),
      },
    })
  }

  open2=(e) => {
    console.log(e)
   // const node = e.shape.getItem().itemMap._nodes;
  //  console.log(node)
    // console.log(e.shape.getItem().getAllAnchors()[1].getItem())
   // console.log(e.shape.getItem().getAllAnchors()[2].getItem())
    // console.log(e.shape.getItem().getAllAnchors()[3].getItem())
    // console.log(e.item.shapeObj.getStyle())

    // 查找出 入节点
  }

  // 更新到 state
  getNode=(e) => {
    // 画布上的全部节点  "changeData" "add"
    if (e.action === 'changeData') {
      this.setState({
        NodesAttribute: {
          Nodes: e.data.nodes,
        },
      })
    } else if (e.action === 'add') {
      const node = e.item.itemMap._nodes
      const dx = []
      node.forEach((val) => {
        dx.push(val.model)
      })
      this.setState({
        NodesAttribute: {
           Nodes: dx,
        },
      })
    }
  }

  _SaveFlowClick = (v) => {
   // 数据保存
    let nodes = JSON.parse(v).nodes;
    let edges = JSON.parse(v).edges
    if (nodes) {
      for (let i = 0; i < nodes.length; i += 1) {
        const entranceNode = [];
        const exitNode = [];
        if (edges) {
        for (let y = 0; y < edges.length; y += 1) {
          // source
          // target
          if (nodes[i].id === edges[y].source) {
            exitNode.push(edges[y].target)
          }
          if (nodes[i].id === edges[y].target) {
            entranceNode.push(edges[y].source)
          }

          if (y + 1 === edges.length) {
            nodes[i].entryNodeIds = entranceNode.toString(),
              nodes[i].exitNodeIds = exitNode.toString()
          }
        }
        }
      }
      console.log(nodes)
      const { onSave } = this.props
      onSave(nodes, v);
    }
  }

  render() {
    const { NodesAttribute } = this.state
    const { data, record } = this.props;
    return (
      <PageHeaderWrapper title={false}>
        <GGEditor className={styles.editor}>
          <Row type="flex" className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar getFlowCallback ={this._SaveFlowClick} props={this.props.props}/>
            </Col>
          </Row>
          <Row type="flex" className={styles.editorBd}>
            <Col span={4} className={styles.editorSidebar}>
              <FlowItemPanel nodesData={this.props.nodesData}/>
            </Col>
            <Col span={16} className={styles.editorContent}>
              <Flow className={styles.flow} onNodeClick={this.onNodeClick}
                    onAfterChange={this.getNode}
                    onAnchorDrop={this.open2}
                    grid={{
                cell: 14,
              }} data={data}/>
            </Col>
            <Col span={4} className={styles.editorSidebar}>
              <FlowDetailPanel NodesAttribute={NodesAttribute} record={record}/>
              {/* <EditorMinimap /> */}
            </Col>
          </Row>
          <FlowContextMenu />
        </GGEditor>
      </PageHeaderWrapper>
    )
  }
}
export default FlowsIndex;
