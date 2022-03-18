import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login/index.vue';
import Register from '../views/Register/index.vue';
import ForgetPassword from '../views/ForgetPassword/index.vue';
import Layout from '../views/Layout/index.vue';
import swiper from '../views/Layout/swiper.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Home/Message',
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/ForgetPassword',
    name: 'ForgetPassword',
    component: ForgetPassword,
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'Home',
        name: 'Home',
        component: () =>
          import(/* webpackChunkName: "home" */ '../views/Home/index.vue'),
        children: [
          {
            path: 'Message',
            name: 'Message',
            component: () =>
              import(
                /* webpackChunkName: "message" */ '../views/Home/message.vue'
              ),
          },
          {
            path: 'Contacts',
            name: 'Contacts',
            component: () =>
              import(
                /* webpackChunkName: "contacts" */ '../views/Home/contacts.vue'
              ),
          },
          {
            path: 'AddContact',
            name: 'AddContact',
            component: () =>
              import(
                /* webpackChunkName: "addContact" */ '../views/Home/addContact.vue'
              ),
          },
          {
            path: 'Blacklist',
            name: 'Blacklist',
            component: () =>
              import(
                /* webpackChunkName: "blacklist" */ '../views/Home/blacklist.vue'
              ),
          },
          {
            path: 'Group',
            name: 'Group',
            component: () =>
              import(/* webpackChunkName: "group" */ '../views/Home/group.vue'),
          },
        ],
      },
      {
        path: 'Setting',
        name: 'Setting',
        component: () =>
          import(
            /* webpackChunkName: "setting" */ '../views/Setting/index.vue'
          ),
      },
      {
        path: 'Setting/edit',
        name: 'SettingEdit',
        component: () =>
          import(
            /* webpackChunkName: "SettingEdit" */ '../views/Setting/edit.vue'
          ),
      },
      {
        path: 'Setting/changeLang',
        name: 'ChangeLang',
        component: () =>
          import(
            /* webpackChunkName: "changeLang" */ '../views/Setting/changeLang.vue'
          ),
      },
      {
        path: 'Setting/notice',
        name: 'notice',
        component: () =>
          import(
            /* webpackChunkName: "notice" */ '../views/Setting/notice.vue'
          ),
      },
      {
        path: 'Setting/security',
        name: 'security',
        component: () =>
          import(
            /* webpackChunkName: "security" */ '../views/Setting/security.vue'
          ),
      },
      {
        path: 'Setting/invitation',
        name: 'invitation',
        component: () =>
          import(
            /* webpackChunkName: "invitation" */ '../views/Setting/invitation.vue'
          ),
      },
      {
        path: 'Setting/findMe',
        name: 'findMe',
        component: () =>
          import(
            /* webpackChunkName: "findMe" */ '../views/Setting/findMe.vue'
          ),
      },
      {
        path: 'Setting/feedback',
        name: 'feedback',
        component: () =>
          import(
            /* webpackChunkName: "feedback" */ '../views/Setting/feedback.vue'
          ),
      },
      {
        path: 'Home/addGroup',
        name: 'addGroup',
        component: () =>
          import(
            /* webpackChunkName: "addGroup" */ '../views/Home/addGroup.vue'
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
