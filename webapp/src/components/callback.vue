<template>
</template>
<script>

import { setIdToken, setAccessToken, getInfo } from '../../utils/auth';

export default {
  name: 'callback',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/devices';
    });
  },
};
</script>
