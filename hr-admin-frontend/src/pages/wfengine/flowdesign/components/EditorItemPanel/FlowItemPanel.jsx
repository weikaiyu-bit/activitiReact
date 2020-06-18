import { Item, ItemPanel, RegisterNode } from 'gg-editor';
import { Card } from 'antd';
import React from 'react';
import styles from './index.less';
import CustomNode from './CustomNode';
import CustomRectNode from './CustomRectNode'

const circle = {
  width: '120px',
  height: '50px',
  border: '1px solid #1890FF',
  borderRadius: '5px',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: '0.9',
}
const Control = props => <Item type="node" {...props} > <div draggable={false} style={{ ...circle, backgroundColor: props.model.color }}>{props.model.label}</div></Item>

const NODES = [
  {
    type: 0,
    label: "开始",
    color: "#ffc66a",
    name: "start-node"
  }
];

class FlowItemPanel extends React.PureComponent {
  render() {
    const { nodesData } = this.props;
    console.log(nodesData)
    return (
      <ItemPanel className={styles.itemPanel}>
        <Card bordered={false}>
          {/* { nodesData.map((item) =>
            <Control size={item.nodeSize} shape={item.nodeShape}
                     model={{ color: item.nodeColor, label: item.nodeName, type: 'node' }}/>)} */}
          { nodesData.map((item) =>
            <Control size= "120*50" shape="customRect" key={item.id}
                     model={{ color: '#E8F8FF', label: item.templateName, type: 'node' }}/>)}
          <CustomRectNode />
          {/* <RegisterNode
            name="rect-node"
            config={{
              label: "",
              color: "#F5EE01"
            }}
            extend="customRect"
          /> */}
          { nodesData.length === 0 && <Item
            type="node"
            size="120*50"
            shape="customRect"
            model={{
              type: 'node',
              color: 'red',
              label: '节点模板',
            }}
          ><div draggable={false} style={{ ...circle, backgroundColor: '#E8F8FF' }}>节点模板</div></Item>
          }
        </Card>
      </ItemPanel>
    )
  }
}
export default FlowItemPanel;
