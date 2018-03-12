<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">To start please login -></h3>
    <hr/>
  </div>
</template>

<script>
import AppNav from './AppNav';

export default {
  name: 'home',
  components: {
    AppNav,
  },
  data() {
    return {
      nothing: '',
    };
  },
  methods: {
  },
  mounted() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
