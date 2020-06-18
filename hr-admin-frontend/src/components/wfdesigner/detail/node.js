import React from 'react';
import { withPropsAPI } from 'gg-editor';
import { Card, Form, Input, Checkbox, Select, Radio } from 'antd';
import { getPageTitle } from '@ant-design/pro-layout';

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

const options = [
  { label: '开始', value: 0x03 },
  { label: '流转', value: 0x10 },
  { label: '办理', value: 0x11 },
  { label: '拒绝', value: 0x12 },
  { label: '办结', value: 0x13 },
];

class Node extends React.PureComponent {
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

  constructor(props) {
    super(props);

    // console.log(this.item.getModel())
    this.state = {
      dur: '',
    };
  }

  __submit = values => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    const item = getSelected()[0];

    if (!item) {
      return;
    }

    delete values['listen'];
    // return console.log(values)
    executeCommand(() => {
      update(item, {
        ...values,
      });
    });
  };

  getTitle = v => {
    if ('start' == v) {
      return '开始';
    } else if ('normal' == v) {
      return '过程';
    } else if ('decision' == v) {
      return '决策';
    } else if ('end' == v) {
      return '结束';
    } else return 'unkown';
  };

  __change = values => {
    // console.log(values)

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    const item = getSelected()[0];

    if (!item) {
      return;
    }

    let listen = 0;
    values.forEach(item => {
      listen = (1 << (item - 1)) | listen;
    });

    executeCommand(() => {
      update(item, {
        listen,
      });
    });
  };

  __nameChange = v => {
    const { form, propsAPI } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      // console.log(values,this)
      this.__submit(values);
    });
  };

  __durChange = v => {
    const { form, propsAPI } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      this.__submit(values);
    });
  };

  __durTypeChange = v => {
    const { form, propsAPI } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      const dur = values.dur;
      if (parseFloat(dur) > 0) {
        this.__submit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // const label
    // console.log(this.item)

    const { label, type, shape } = this.item.getModel();

    const prefixSelector = getFieldDecorator('durType', {
      initialValue: '1',
    })(
      <Select onChange={this.__durTypeChange} style={{ width: 70 }}>
        <Select.Option value="1">天</Select.Option>
        <Select.Option value="2">小时</Select.Option>
      </Select>,
    );

    return (
      <Card title={this.getTitle(type)}>
        <Form layout="vertical">
          <Form.Item label="名称">
            {getFieldDecorator('label', {
              initialValue: label,
            })(<Input onBlur={this.__nameChange} />)}
          </Form.Item>
          <Form.Item label="事件">
            {getFieldDecorator('listen', { initialValue: [] })(
              <Checkbox.Group options={options} onChange={this.__change} />,
            )}
          </Form.Item>
          {'normal' == type ? (
            <React.Fragment>
              <Form.Item label="办理时间">
                {getFieldDecorator('dur', {
                  initialValue: this.state.dur,
                  rules: [
                    {
                      pattern: /\d+/,
                    },
                  ],
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, '');
                  },
                })(<Input addonAfter={prefixSelector} onBlur={this.__durChange} />)}
              </Form.Item>
              <Form.Item label="完成类型">
                {getFieldDecorator('completeType', {
                  initialValue: '0',
                })(
                  <Radio.Group style={{ width: '100%' }} buttonStyle="solid">
                    <Radio.Button value="0">默认</Radio.Button>
                    <Radio.Button value="1">其一</Radio.Button>
                    <Radio.Button value="2">全部</Radio.Button>
                  </Radio.Group>,
                )}
              </Form.Item>
            </React.Fragment>
          ) : null}
        </Form>
      </Card>
    );
  }
}

export default Form.create()(withPropsAPI(Node));
