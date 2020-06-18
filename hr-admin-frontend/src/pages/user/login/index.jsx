import { Alert, Checkbox, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import './css/loginStyle.css';
import orgLogo from './images/org_logo.png';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
    systemType: 'PC', // PC端
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { systemType } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userAndlogin/login',
        payload: {
          ...values,
          systemType,
        },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'userAndlogin/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userAndlogin, submitting } = this.props;
    const { status, type: loginType } = userAndlogin;
    const { type, autoLogin } = this.state;
    return (
      <div className="login">
        <div className="login_main">
          <div className="login_logo">
            <img alt="" src={orgLogo}/>
          </div>
          <div className="login_box">
            <ul>
              <h3>用户登录<span>| Login</span></h3>
              <LoginComponents
                defaultActiveKey={type}
                onTabChange={this.onTabChange}
                onSubmit={this.handleSubmit}
                ref={form => {
                  this.loginForm = form;
                }}
              >
                <UserName
                  className="l_text1"
                  name="userName"
                  placeholder="请输入用户名"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <Password
                  className="l_text2"
                  name="password"
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                  onPressEnter={e => {
                    e.preventDefault();
                    this.loginForm.validateFields(this.handleSubmit);
                  }}
                />
                <Submit className="login_btn" loading={submitting}>登录</Submit>
              </LoginComponents>
            </ul>
          </div>
          <div className="clear"></div>
          <div className="l_footer">
            <p>Copyright 2020 广西数航科技有限公司 All Rights Reserved</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
