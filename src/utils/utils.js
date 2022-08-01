import jsMd5 from 'js-md5';
import store from '@/store';
import themeMap from '@/style/theme/index.scss';
import moment from 'moment';
import cnchar from 'cnchar-all';

// md5
export const md5 = (value) => {
  return jsMd5(value).toLowerCase();
};

// 二进制转字符串
export const ab2str = (u) => {
  return new Promise((reslove) => {
    var b = new Blob([u]);
    var r = new FileReader();
    r.readAsText(b, 'utf-8');
    r.onload = function () {
      reslove(r.result);
    };
  });
};

// 获取主题颜色
export const getThemeColor = (color) => {
  const theme = store.state.theme;
  const val = `${theme}-${color}`;
  return themeMap[val] || null;
};

// 存储localstorage
export const setStorage = (key, val) => {
  window.localStorage.setItem(key, val);
};

// 获取localstorage
export const getStorage = (key) => {
  return window.localStorage.getItem(key);
};

// 清空localstorage
export const clearStorage = () => {
  const userList = getStorage('userList');
  const msgList = getStorage('msgList');
  const info = getStorage('info');
  const lang = getStorage('lang');
  const theme = getStorage('theme');
  const rememberPwd = getStorage('rememberPwd');
  window.localStorage.clear();
  setStorage('userList', userList);
  setStorage('msgList', msgList);
  setStorage('info', info);
  setStorage('lang', lang);
  setStorage('theme', theme);
  setStorage('rememberPwd', rememberPwd);
};

// 获取token
export const getToken = () => {
  return getStorage('userLoginToken');
};

// 获取离线时间
export const getTime = (time, t) => {
  const offLineTime = time * 1000;
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 12 * month;
  if (!time) {
    return '';
  }
  if (Date.now() - time * 1000 > year) {
    return moment().diff(moment(offLineTime), 'year') + t('年前');
  } else if (Date.now() - time * 1000 > month) {
    return moment().diff(moment(offLineTime), 'month') + t('个月前');
  } else if (Date.now() - time * 1000 > day) {
    return moment().diff(moment(offLineTime), 'day') + t('天前');
  } else if (Date.now() - time * 1000 > hour) {
    return moment().diff(moment(offLineTime), 'hour') + t('小时前');
  } else if (Date.now() - time * 1000 > minute) {
    return moment().diff(moment(offLineTime), 'minute') + t('分钟前');
  }
  return t('刚刚');
};

// 计算时间显示
export const formateTime = (msgTime, t) => {
  const time = msgTime * 1000;
  const minute = moment().diff(moment(time), 'minute');
  if (minute < 10) {
    return t('刚刚');
  } else if (minute < 3600) {
    if (moment(time).format('DD') === moment().format('DD')) {
      // 今天
      return moment(time).format('HH:mm');
    } else {
      // 昨天
      return t('昨天') + ' ' + moment(time).format('HH:mm');
    }
  }
  return moment(time).format('YYYY/MM/DD HH:mm');
};

// 判断是否是当前聊天
export const isCurrentChat = (msgInfos, yUid, uid) => {
  if (msgInfos.fromId === Number(yUid) && msgInfos.toId === Number(uid)) {
    return true;
  }
  if (msgInfos.fromId === Number(uid) && msgInfos.toId === Number(yUid)) {
    return true;
  }
  return false;
};

// 获取tag
export function getTag(e) {
  try {
    const res = cnchar
      .spell(
        (e.userAttachInfo && e.userAttachInfo.remarkName) ||
          e.nickname ||
          e.groupName,
        'first'
      )
      .substr(0, 1);
    if (res.charCodeAt() >= 65 && res.charCodeAt() <= 122) {
      return res;
    } else {
      return '#';
    }
  } catch (error) {
    return '#';
  }
}

export function getSize(size) {
  if (size < 1024) {
    return parseInt(size) + 'K';
  } else if (size / 1024 < 1024) {
    return parseInt(size / 1024) + 'KB';
  } else if (size / 1024 / 1024 < 1024) {
    return parseInt(size / 1024 / 1024) + 'M';
  } else if (size / 1024 / 1024 / 1024 < 1024) {
    return parseInt(size / 1024 / 1024 / 1024) + 'G';
  } else {
    return parseInt(size / 1024 / 1024 / 1024 / 1024) + 'T';
  }
}

export function getSuffix(url) {
  const urlList = url.split('.');
  const suffix = urlList[urlList.length - 1];
  switch (suffix) {
    case 'pdf':
      return 'iconpdf';
    case 'xlsx':
      return 'iconexcel';
    case 'xls':
      return 'iconexcel';
    case 'doc':
      return 'iconWORD';
    case 'docx':
      return 'iconWORD';
    default:
      return 'iconcopy_icon';
  }
}

export function getMsgList() {
  const userInfo = JSON.parse(getStorage('userInfo'));
  if (!userInfo) return null;
  const uid = userInfo.uid;
  const msgList = JSON.parse(getStorage('msgList')) || {};
  const list = msgList[uid] || {};
  Object.values(list).forEach((v) => {
    const fireMsgIds =
      v.readList ||
      []
        .filter((k) => k.type === 'fireInfo')
        .map((a) => a.msgContent.fireInfo.fireMsgId);
    (v.readList || []).forEach((b) => {
      if (fireMsgIds.includes(b?.msgId?.toString())) {
        b.fire = true;
      }
    });
  });
  return list || null;
}

export function setMsgList(val) {
  const userInfo = JSON.parse(getStorage('userInfo'));
  if (!userInfo || !userInfo.uid) return;
  const uid = userInfo.uid;
  const msgList = JSON.parse(getStorage('msgList')) || {};
  msgList[uid] = val;
  setStorage('msgList', JSON.stringify(msgList));
}

export function getInfo() {
  const userInfo = JSON.parse(getStorage('userInfo'));
  const uid = userInfo.uid;
  const info = JSON.parse(getStorage('info')) || {};
  return info[uid] || null;
}

export function setInfo(val) {
  const userInfo = JSON.parse(getStorage('userInfo'));
  const uid = userInfo.uid;
  const info = JSON.parse(getStorage('info')) || {};
  info[uid] = val;
  setStorage('info', JSON.stringify(info));
}

export function getLang() {
  let lang = window.navigator.language;
  const langToLower = lang.toLocaleLowerCase();
  if (langToLower.includes('en')) {
    return 2;
  } else if (langToLower.includes('tw') || langToLower.includes('zh-tw')) {
    return 1;
  } else if (langToLower.includes('zh') || langToLower.includes('zh-cn')) {
    return 0;
  } else {
    return 2;
  }
}

export function isMacOs() {
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (isMac) {
    return true;
  } else {
    return false;
  }
}
