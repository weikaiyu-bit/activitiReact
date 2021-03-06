/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/sort-comp */
/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/a.png';

/**
 * use Authorized check all menu item
 */

const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 广西数航科技有限公司"
    links={[
      {
        key: 'gxnbs-hr',
        title: '国家统计局广西调查总队  人事信息管理系统',
        // href: 'http://demo.dtsea.net/gxnbs-hr',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    routeModel: { data },
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      // dispatch({
      //   type: 'settings/getSetting',
      // });
      dispatch({
        type: 'routeModel/fetch',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          // {
          //   path: '/',
          //   breadcrumbName: '首页',
          // },
          // ...routers,
        ]}
        // itemRender={(route, params, routes, paths) => {
        //   const first = routes.indexOf(route) === 0;
        //   return first ? (
        //     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        //   ) : (
        //       <span>{route.breadcrumbName}</span>
        //     );
        // }}
        // footerRender={footerRender}
        // menuDataRender={menuDataRender}
        menuDataRender={() => data}
        // formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global, settings, routeModel }) => ({
  collapsed: global.collapsed,
  settings,
  routeModel,
}))(BasicLayout);
