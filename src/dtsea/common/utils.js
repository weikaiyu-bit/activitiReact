/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 数据海公共函数库
 * */
// 列表递归生成树，antd专用
const convertToTree = (pid, data) => {
  const tree = [];
  if (!data) return [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.pid === pid) {
      const children = convertToTree(item.id, data);
      if (children.length > 0) {
        tree.push({
          ...item,
          children,
        });
      } else {
        tree.push({
          ...item,
        });
      }
    }
  }

  return tree;
};

// 递归生成树结构，用于列表树、菜单等 wujian 2019-11-2
const listToTree = data => convertToTree(0, data);

// 生成空的children 用于懒加载树
const effectsTotree = data => {
  const tree = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    const children = [];
    tree.push({
      ...item,
      children,
    })
  }
  // console.log('tree', tree)
  return tree
}
const eTotree = data => effectsTotree(data);

// 解决组织名称查询无法查询子节点。
const toTree = (pid, data, temp) => {
  const tree = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.pid === pid) {
      temp[i] = false;
      const children = toTree(item.id, data, temp);
      if (children.length > 0) {
        tree.push({
          ...item,
          children,
        });
      } else {
        tree.push({
          ...item,
        });
      }
    }
  }
  return tree;
};

const addToTree = data => {
  // 深拷贝防止数据污染
  const temp = JSON.parse(JSON.stringify(data));
  const tree = toTree(0, data, temp);
  for (let i = 0; i < temp.length; i += 1) {
    if (temp[i]) {
      tree.push(temp[i]);
    }
  }
  return tree;
};

const globleData = {};

export function setLoginUser(userInfo) {
  globleData.loginUser = userInfo;
}

export function getLoginUser() {
  // console.log('loginUser=', loginUser);
  return globleData.loginUser;
}

const defaultOmitNameLength = 18;
// 省略名
export function omit(text, maxLen) {
  if (!maxLen) {
    maxLen = defaultOmitNameLength;
  }
  if (text.length > maxLen) {
    return <span title={text}>{text.substring(0, maxLen)}...</span>;
  }
  return text;
}

const gToTree = (pid, data, tree1) => {
  const tree = tree1;
  const children1 = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.pid === pid) {
      const children = gToTree(item.id, data, tree);
      const aa = { ...data[i], children }
      children1.push(aa);
    }
  }
  return children1;
};


const pId = (id, data) => {
  const tree = [];
  data.forEach(element => {
    if (element.id === id) {
      console.log('element', element)
      const children = gToTree(id, data, tree);
      if (children.length > 0) {
        tree.push({
          ...element,
          children,
        });
      } else {
        tree.push({
          ...element,
        });
      }
    }
  });
  return tree;
}

// 递归生成树结构，用于列表树、菜单等 wujian 2019-11-2
const gxToTree = data => pId(450000, data);

const dictToTree = (pid, data) => {
  const tree = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.pid === 0) {
      // console.log('1')
      if (item.pid === pid) {
        const children = dictToTree(item.id, data);
        if (children.length > 0) {
          tree.push({
            ...item,
            children,
          });
        } else {
          tree.push({
            ...item,
          });
        }
      }
    }
  }
  return tree;
};

// 递归生成树结构，用于数据字典
const dictIdToTree = data => dictToTree(0, data);

const dictDataTree = (pid, data, temp) => {
  const tree = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.pid === pid) {
      temp[i] = false;
      const children = dictDataTree(item.id, data, temp);
      if (children.length > 0) {
        tree.push({
          ...item,
          children,
        });
      } else {
        tree.push({
          ...item,
        });
      }
    }
  }
  return tree;
};
// 遍历数据
const dataToTree = data => { // dictDataTree(0, data);
  // 深拷贝防止数据污染
  const temp = JSON.parse(JSON.stringify(data));
  const tree = dictDataTree(0, data, temp);
  for (let i = 0; i < temp.length; i += 1) {
    if (temp[i]) {
      tree.push(temp[i]);
    }
  }
  return tree;
};

const areaDataTree = (pid, data) => {
  const tree = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.pid === pid) {
      const children = dictDataTree(item.id, data);
      if (children.length > 0) {
        tree.push({
          label: item.areaName,
          value: item.id,
          children,
        });
      } else {
        tree.push({
          label: item.areaName,
          value: item.id,
        });
      }
    }
  }
  return tree;
};

// 地区字典转树
const areaToTree = data => areaDataTree(0, data);

export default {
  listToTree,
  addToTree,
  omit,
  eTotree,
  gxToTree,
  dictIdToTree,
  dataToTree,
  areaToTree,
};
