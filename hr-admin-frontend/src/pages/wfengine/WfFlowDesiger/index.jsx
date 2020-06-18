import React from 'react';
import FlowsIndex from '../flowdesign/index'
import * as service from './service';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { message, Spin } from 'antd';
import Designer from "@/components/wfdesigner";

class WfFlowDesiger extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      record: {},
      nodesData: [],
      loading: true,
    }
  }

  componentDidMount() {
    console.log(this.props.history)
   // console.log('componentDidMount',this.props.location.query);
    const { id, catgId } = this.props.location.query;
    service.get({ id }).then(res => {
     // console.log('res', res)
     // console.log(JSON.parse(res.data.flowJson))
      this._callback(res, (() => { this.setState({ loading: false }) }));

      const Json = res.data.flowJson
      this.setState({
        record: {
          ...res.data,
        },
        data: this.isJson(Json) ? JSON.parse(Json) : {},
      })
    })
    // 查找节点
    if (catgId !== 'null') {
      service.findNodeTemplate({ catgId }).then(res => {
        // console.log(JSON.parse(res.data.flowJson))
        this.setState({
          nodesData: res.data,
        })
      })
    }
  }

  /**
   * 判断是否json
   * @param $string
   * @returns {boolean}
   */
   isJson = ($string) => {
     if (typeof $string === 'string') {
       try {
         const obj = JSON.parse($string);
         if (typeof obj === 'object' && obj) {
           return true;
         } return false;
       } catch (e) {
       //  console.log('error：'+str+'!!!'+e);
         return false;
       }
     } return false;
  }

  // 流程保存
  handleSaveFlowClick = (nodes, v) => {
    const { record } = this.state;
    // 数据保存
    if (!v) return;
    // flow_json  转化成数据库对应字段
    service.save({ ...record, flowJson: v }).then(res => {
      this._callback(res, '保存流程成功')
    });
 //   console.log(JSON.parse(v).nodes);
    service.addNodes({ flowId: record.id,
      nodesVo: nodes }).then();
  }

  _callback = (response, txt) => {
    switch (response.code) {
      case ErrorCode.SUCCESS:
        if (typeof txt === 'function') { // 是函数    其中 FunName 为函数名称
          txt()
        } else { // 不是函数
          message.success(txt);
        }
        break;
      case ErrorCode.FAILURE:
        message.error(response.msg);
        break;
      default:
        this.callbackDefault(response);
        break;
    }
  }

  callbackDefault = response => {
    const msg = (response.msg) ? response.msg : '发生未知错误！';
    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        // routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  render() {
    const { nodesData, loading } = this.state
    return (
      <>
       <Spin spinning={loading}>
         <FlowsIndex onSave={this.handleSaveFlowClick}
                  data={this.state.data}
                  record={this.state.record}
                  nodesData={nodesData}
                  props={this.props.history}>
         </FlowsIndex>
       </Spin>
      </>
    )
  }
}
export default WfFlowDesiger;
