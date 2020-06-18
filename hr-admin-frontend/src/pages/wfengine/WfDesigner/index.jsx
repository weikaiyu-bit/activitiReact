import React, { Component } from 'react';
import { connect } from 'dva';
import * as service from './service';
import {Spin} from 'antd'
import Designer from '@/components/wfdesigner'


class WFDesigner extends React.PureComponent{
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      busy: false,
      curr: {}
    }
  }

  componentDidMount() {
    console.log('componentDidMount',this.props.location.query);

    const {id} = this.props.location.query;

    const thiz = this;
    service.get({id}).then(res=>{
      console.log('res=', res);
      if (res.data.flowJson) {
        const ccc = Designer.decode(res.data.flowJson);
        thiz.setState({
          loading: false,
          curr: {
            ...res.data,
            content: ccc
          }
        })
      }
    })
  }


  __save(v){
    console.log(v);

    return console.log(Designer.encode(v));
    const {id} = this.props.location.query;
    const {curr} = this.state;
    service.save({
      ...curr,
      flowJson: Designer.encode(v)
    })
  }

  render(){
    const {loading,curr,busy} = this.state;

    return (
      <React.Fragment>
        {true  == loading ? <Spin/>:<Designer busy={busy} data={this.state.curr} onSave={this.__save.bind(this)} />}
      </React.Fragment>
    )
  }
}

export default connect(({}) => (
  {}
))(WFDesigner)
