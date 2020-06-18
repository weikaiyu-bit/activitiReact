import React from 'react';

import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';

// 不同的全局 layout
export default props => {
  if (/^\/user\//i.test(props.location.pathname)) {
    return <UserLayout {...props} />;
  }
  return <BasicLayout {...props} />;
};
