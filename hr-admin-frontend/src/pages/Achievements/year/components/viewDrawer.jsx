import React, { Component } from 'react';
import { Drawer, Row, Col, Tabs, Timeline, Progress, Tag } from 'antd';

const { TabPane } = Tabs;

class ViewDrawer extends Component {
  state = {
    selectItem: [],
    load: false,
  };

  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  componentDidMount() {}

  render() {
    const { visible } = this.props;
    const { name, age, jigou, pxzt, khjd, ms, gxsj, tbjd } = this.props;
    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="应用信息">
        <div>
          <Row style={{ marginTop: 12 }}>
            <Col>
              <h2>{pxzt}</h2>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>
              <label>名字：</label>
              <label>{name}</label>
            </Col>
            <Col span={12}>
              <label>年龄：</label>
              <label>{age}</label>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>
              <label>机构：</label>
              <label>{jigou}</label>
            </Col>
            <Col span={12}>
              <label>考核季度（年月）：</label>
              <label>{khjd}</label>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>
              <div style={{ float: 'left' }}>
                填报进度：
                <Progress percent={tbjd} style={{ width: '200px' }} />
              </div>
            </Col>
            <Col span={12}>
              <label>更新时间：</label>
              <label>{gxsj}</label>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col>
              <label>描述：</label>
              <p>{ms}</p>
            </Col>
          </Row>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="考勤记录" key="1">
            <Timeline>
              <Timeline.Item color="green">
                <div>
                  2019-1-4
                  <Tag color="green" style={{ marginLeft: '15px' }}>
                    未缺勤
                  </Tag>
                </div>
                1个月前
              </Timeline.Item>
              <Timeline.Item color="red">
                <div>
                  2019-1-3
                  <Tag color="red" style={{ marginLeft: '15px' }}>
                    缺勤
                  </Tag>
                </div>
                1个月前
              </Timeline.Item>
              <Timeline.Item color="green">
                <div>
                  2019-1-2
                  <Tag color="green" style={{ marginLeft: '15px' }}>
                    未缺勤
                  </Tag>
                </div>
                1个月前
              </Timeline.Item>
              <Timeline.Item color="green">
                <div>
                  2019-1-1
                  <Tag color="green" style={{ marginLeft: '15px' }}>
                    未缺勤
                  </Tag>
                </div>
                1个月前
              </Timeline.Item>
            </Timeline>
          </TabPane>
          <TabPane tab="其他" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </Drawer>
    );
  }
}

export default ViewDrawer;
