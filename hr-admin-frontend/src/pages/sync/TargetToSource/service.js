import request from '@/utils/request';

const prefix = '/api/oa/sync/admin/v1/datasync';

export async function list(params) {
  return request(`${prefix}/search`, {
    method: 'POST',
    data: params,
  });
}

export async function add(params) {
  params.id = 0;
  return request(`${prefix}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}


export async function pfilepersonnel(params) {
  return request(`${prefix}/pfilepersonnel`, {
    method: 'POST',
    data: params,
  });
}

export async function pfilepositionlevel(params) {
  return request(`${prefix}/pfilepositionlevel`, {
    method: 'POST',
    data: params,
  });
}

export async function pfilerewardspunishments(params) {
  return request(`${prefix}/pfilerewardspunishments`, {
    method: 'POST',
    data: params,
  });
}

export async function pfileprofessionaltechnicalqualification(params) {
  return request(`${prefix}/pfileprofessionaltechnicalqualification`, {
    method: 'POST',
    data: params,
  });
}

export async function pfilefamilyrelations(params) {
  return request(`${prefix}/pfilefamilyrelations`, {
    method: 'POST',
    data: params,
  });
}
export async function pfileexit(params) {
  return request(`${prefix}/pfileexit`, {
    method: 'POST',
    data: params,
  });
}
export async function pfileannualappraisalnarrative(params) {
  return request(`${prefix}/pfileannualappraisalnarrative`, {
    method: 'POST',
    data: params,
  });
}


export async function pfilepoliticalstatus(params) {
  return request(`${prefix}/pfilepoliticalstatus`, {
    method: 'POST',
    data: params,
  });
}

export async function pfileeducational(params) {
  return request(`${prefix}/pfileeducational`, {
    method: 'POST',
    data: params,
  });
}

export async function a01(params) {
  return request(`${prefix}/a01`, {
    method: 'POST',
    data: params,
  });
}
export async function a05(params) {
  return request(`${prefix}/a05`, {
    method: 'POST',
    data: params,
  });
}
export async function a14(params) {
  return request(`${prefix}/a14`, {
    method: 'POST',
    data: params,
  });
}
export async function a06(params) {
  return request(`${prefix}/a06`, {
    method: 'POST',
    data: params,
  });
}
export async function a36(params) {
  return request(`${prefix}/a36`, {
    method: 'POST',
    data: params,
  });
}
export async function a30(params) {
  return request(`${prefix}/a30`, {
    method: 'POST',
    data: params,
  });
}
export async function a08(params) {
  return request(`${prefix}/a08`, {
    method: 'POST',
    data: params,
  });
}
export async function a15(params) {
  return request(`${prefix}/a15`, {
    method: 'POST',
    data: params,
  });
}
export async function backup(params) {
  return request(`${prefix}/backup`, {
    method: 'POST',
    /*data: {
    ip: "10.168.1.39",
    port: "3306",
    userName: "root",
    password: "Abcd@1234",
    databaseName: "dtsea_personner_gov",
    fileName: "111",
    defaultCharacterSet: "utf8",
    isCompact: 1,
    isComments: 0,
    isCompleteInsert: 0,
    isLockTables: 0,
    isNoCreateDb: 0,
    isForce: 1,
    isAddDropDatabase: 1,
    isAddDropTable: 1,
    isSpecifyTable: 0
    },*/
    data: params
  });
}
export async function recover(params) {
  return request(`${prefix}/recover`, {
    method: 'POST',
    data: {
      ip: "10.168.1.49",
      port: "45017",
      userName: "root",
      password: "abcd1234",
      databaseName: "zwhzyq",
      dumpId:2
    },
  });
}

export async function deleteData(params) {
  return request(`${prefix}/deleteData`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 用于demo演示效果
 * @param params
 * @returns {Promise<any>}
 */
export async function recoverName(params) {
  return request(`${prefix}/recoverName`, {
    method: 'POST',
    data: params,
  });
}
