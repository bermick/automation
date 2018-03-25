<template>
</template>
<script>

import { setIdToken, setAccessToken, setUserInfo } from '../../utils/auth';
import { validateExistingUser } from '../../utils/devices-api';
import Router from '../router';

export default {
  name: 'callback',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      setUserInfo()
      .then(userData => validateExistingUser(userData))
      .then(() => {
        Router.push('/devices');
      });
    });
  },
};
</script>
