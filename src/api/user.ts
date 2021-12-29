import { initStore } from '@/store';
import { setStorage } from '@/utils/utils';
import { Store } from 'vuex';

// 更新个人信息
const upDateUser = async (store: Store<initStore>) => {
  const info = store.state.userInfo;
  const res = {
    uid: info.uid,
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1011,
    encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
    auth: true,
  });

  const userDetailInfo = data.body.userDetailInfo;
  const userInfo = data.body.userDetailInfo.userInfo;

  store.commit('SET_USERDETAILINFO', userDetailInfo);
  store.commit('SET_USERINFO', userInfo);

  setStorage('userDetailInfo', JSON.stringify(userDetailInfo));
  setStorage('userInfo', JSON.stringify(userInfo));
};

export { upDateUser };
