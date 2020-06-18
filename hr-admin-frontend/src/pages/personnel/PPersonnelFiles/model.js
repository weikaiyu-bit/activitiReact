import {
  list,
  add,
  update,
  remove,
  listOrgOrg,
  listOrg,
  listPositionLevel,
  findEducational,
  findAnnualAppraisalNarrative,
  findRewardsPunishments,
  findFamilyRelations,
  listWorkRecord,
  updateWorkRecord,
  listTechnicalQualification,
  listEducational,
  listExit,
  listPoliticalStatus,
  addWorkRecord,
} from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'pPersonnelFilesModel',
  state: {
    data: [],
    listWorkRecordData: [],
    listJobLevelAndJobLevelInfoData: [],
    listTechnicalQualificationData: [],
    listEducationalData: [],
    rewardsPunishmentsData: [],
    annualAppraisalNarrativeData: [],
    listExitData: [],
    listPoliticalStatusData: [],
    familyRelationsData: [],
    total: 0,
    tree: []
  },


  /** 异步请求 ************************************************************************************* */

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      if (callback) callback(response);
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pPersonnelFilesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      console.log("????????payloadpayload", payload)
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pPersonnelFilesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pPersonnelFilesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchOrgOrg({ payload }, { call, put }) {
      const response = yield call(listOrgOrg, payload);
      yield put({
        type: 'listOrgOrg',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *fetchOrg({ payload, callback }, { call, put }) {
      const response = yield call(listOrg, payload);
      if (callback) callback(response);
      yield put({
        type: 'orgOrg',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *fetchEducational({ payload }, { call, put }) {
      const response = yield call(findEducational, payload);
      yield put({
        type: 'Educational',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *fetchAnnualAppraisalNarrative({ payload, callback }, { call, put }) {
      const response = yield call(findAnnualAppraisalNarrative, payload);
      if (callback) callback(response);
      yield put({
        type: 'AnnualAppraisalNarrative',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *fetchRewardsPunishments({ payload, callback }, { call, put }) {
      const response = yield call(findRewardsPunishments, payload);
      if (callback) callback(response);
      yield put({
        type: 'RewardsPunishments',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *fetchFamilyRelations({ payload, callback }, { call, put }) {
      const response = yield call(findFamilyRelations, payload);
      if (callback) callback(response);
      yield put({
        type: 'FamilyRelations',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    // 职务信息
    *fetchListWorkRecord({ payload, callback }, { call, put }) {
      const response = yield call(listWorkRecord, payload);
      if (callback) callback(response);
      yield put({
        type: 'listWorkRecord',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *updateWorkRecord({ payload, callback }, { call, put, select }) {
      const response = yield call(updateWorkRecord, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pPersonnelFilesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *addWorkRecord({ payload, callback }, { call, put, select }) {
      const response = yield call(addWorkRecord, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pPersonnelFilesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    // 职务层次与职级信息
    *fetchListPositionLevel({ payload, callback }, { call, put }) {
      const response = yield call(listPositionLevel, payload);
      if (callback) callback(response);
      yield put({
        type: 'listPositionLevel',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    // 查询专业技术任职资格信息
    *fetchTechnicalQualification({ payload, callback }, { call, put }) {
      const response = yield call(listTechnicalQualification, payload);
      if (callback) callback(response);
      yield put({
        type: 'listTechnicalQualification',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    // 查询学历学位分页信息
    *fetchEducationalByPage({ payload, callback }, { call, put }) {
      const response = yield call(listEducational, payload);
      if (callback) callback(response);
      yield put({
        type: 'listEducational',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    // 查询退出信息
    *fetchExit({ payload, callback }, { call, put }) {
      const response = yield call(listExit, payload);
      if (callback) callback(response);
      yield put({
        type: 'listExit',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    // 查询政治面貌信息
    *fetchPoliticalStatus({ payload, callback }, { call, put }) {
      const response = yield call(listPoliticalStatus, payload);
      if (callback) callback(response);
      yield put({
        type: 'listPoliticalStatus',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
  },

  /** 同步请求 ************************************************************************************* */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
    save(state, action) {
      const rv = {
        ...state,
        ...action,
      };
      return rv;
    },
    orgOrg(state, action) {
      // 合并state
      const rv = {
        ...state,
        orgData: action.payload.data,
        tree: utils.listToTree(action.payload.data),
        functionsTotal: action.payload.total,
        functionsLimit: action.payload.number,
        functionsParams: action.payload.params,
      };
      return rv;
    },
    Educational(state, action) {
      const rv = {
        ...state,
        educationalData: action.payload.data,
      };
      return rv;
    },
    AnnualAppraisalNarrative(state, action) {
      const rv = {
        ...state,
        annualAppraisalNarrativeData: action.payload.data,
      };
      return rv;
    },
    RewardsPunishments(state, action) {
      action.payload.data.map(item => {
        item.outMark = item.outMark === '1' ? '是' : '否'
      })
      const rv = {
        ...state,
        rewardsPunishmentsData: action.payload.data,
      };
      return rv;
    },
    FamilyRelations(state, action) {
      const rv = {
        ...state,
        familyRelationsData: action.payload.data,
      };
      return rv;
    },
    // 职务
    listWorkRecord(state, action) {
      action.payload.data.map(item => {
        item.isLeaderMember = item.isLeaderMember === '1' ? '是' : '否',
          item.isLeader = item.isLeader === '1' ? '是' : '否'
      })
      const rv = {
        ...state,
        listWorkRecordData: action.payload.data,
      };
      return rv;
    },
    // 职务层次与职级层次
    listPositionLevel(state, action) {
      action.payload.data.map(item => {
        item.positionCategory = item.positionCategory === '1' ? '职级' : '职务'
      })

      const rv = {
        ...state,
        listPositionLevellData: action.payload.data,
      };
      return rv;
    },
    // listJobLevelAndJobLevelInfo(state, action) {
    //   const rv = {
    //     ...state,
    //     listJobLevelAndJobLevelInfoData: action.payload.data,
    //   };
    //   return rv;
    // },
    listTechnicalQualification(state, action) {
      action.payload.data.map(item => {
        item.outputFlag = item.outputFlag === '1' ? '是' : '否'
      })
      const rv = {
        ...state,
        listTechnicalQualificationData: action.payload.data,
      };
      console.log("rvrvrvrvrvrvrv ", rv);
      return rv;
    },
    listEducational(state, action) {
      action.payload.data.map(item => {
        item.outMark = item.outMark === '1' ? '是' : '否'
      })
      const rv = {
        ...state,
        listEducationalData: action.payload.data,
      };
      return rv;
    },
    listExit(state, action) {
      const rv = {
        ...state,
        listExitData: action.payload.data,
      };
      return rv;
    },
    listPoliticalStatus(state, action) {
      const rv = {
        ...state,
        listPoliticalStatusData: action.payload.data,
      };
      return rv;
    },
  },
};


export default Model;
