import React from 'react';
import { RegisterNode } from 'gg-editor';

class CustomRectNode extends React.PureComponent {
  render() {
    const nodeConfig = {
      draw(item) {
        const group = item.getGraphicGroup();
        const shape = group.get('children')[0];
        const keyShape = this.drawKeyShape(item);
        const model = item.getModel();
     //   console.log(model)
        const width = 120;
        const height = 50;
        const x = -width / 2;
        const y = -height / 2;
        const borderRadius = 4;
        /* const keyShape = group.addShape('rect', {
          attrs: {
            x,
            y,
            width,
            height,
            radius: borderRadius,
            fill: 'white',
            stroke: '#CED4D9',
          },
        }); */
        // 左侧色条
    /*    group.addShape('path', {
          attrs: {
            path: [
              ['M', x, y + borderRadius],
              ['L', x, y + height - borderRadius],
              ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
              ['L', x + borderRadius, y],
              ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius],
            ],
            fill: this.color_type,
          },
        }); */
     //   console.log(this.color_type)
        group.addShape('image', {
          attrs: {
            x: -20,
            y: -30,
            width: 40,
            height: 40,
            img: model.icon,
          },
        });
        // 名称文本
        const label = model.label ? model.label : '模块';
        group.addShape('text', {
          attrs: {
            x: 0,
            y: 0,
            textAlign: 'center',
            textBaseline: 'middle',
            text: label,
            fill: 'rgba(51,51,51,1)',
          //  fontSize: 15,
          //  fontWeight: 600,
          },
        });
        // 绘制标签
        // 绘制标签
     //   this.drawLabel(item);
        return keyShape;
      },
   /*   // 获取样式
      getStyle(item) {
        return {
          fill: '#FDEEF8',
          stroke: '#FB99E2',
        };
      },
      // 激活样式
      getActivedStyle(item) {
        return {
          stroke: '#F36364',
        };
      },
      // 选中样式
      getSelectedStyle(item) {
        return {
          stroke: '#F36364',
          fill: '#F9ACD0',
        };
      }, */
      anchor: [
        [0.5, 0], // 上边中点
        [0.5, 1], // 底边中点
        [0, 0.5], // 左边中点
        [1, 0.5], // 右边中点
      ],
    };
    return (
      <RegisterNode name="customRect" config={nodeConfig} extend="flow-rect"/>
    );
  }
}
export default CustomRectNode;
