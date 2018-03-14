import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import Devices from '@/components/devices';
import Callback from '@/components/callback';
import { requireAuth } from '../../utils/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/devices',
      name: 'Devices',
      beforeEnter: requireAuth,
      component: Devices,
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback,
    },
  ],
});
