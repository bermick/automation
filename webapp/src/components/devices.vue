<template>
  <div>
    <app-nav></app-nav>
    <div class="jumbotron text-center" v-if="isLoggedIn()">
      <div>
        <button class="btn btn-success" @click="handleAdd()">+ Add</button>
      </div>
      <h3 class="text-center">Your devices:</h3>
      <hr/>
      
      <div class="col-sm-4" v-for="device in devices">
        <div class="panel panel-danger">
          <div class="panel-heading">
            <h3 class="panel-title"> {{ device.name }} </h3>
          </div>
          <div class="panel-body">
            <p><span class="badge alert-info"> Esado: </span> {{ device.estado }} </p>
          </div>
        </div>
      </div>
    </div>
    <div class="jumbotron text-center" v-else>
        <h2>To be able to see you devices please Log In</h2>
    </div>
    <modal name="devicesModal">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Add Device</h4>
      </div>
      <div class="modal-body">
        <p>Enter the device's ID</p>
        <input v-model="deviceID" placeholder="device id">
        <rotate-square2 v-if="isAdding"></rotate-square2>
      </div>
      <div class="modal-footer">
        <div>{{ status }}</div>
        <button type="button" class="btn btn-default" @click="closeModal()">Close</button>
        <button type="button" class="btn btn-primary" @click="validateDeviceID()">Validate</button>
      </div>
    </modal>
  </div>
</template>
<script>
import { RotateSquare2 } from 'vue-loading-spinner';
import AppNav from './AppNav';
import { isLoggedIn, getInfo } from '../../utils/auth';
import { getPrivateDevices, validateDeviceID } from '../../utils/devices-api';

export default {
  name: 'devices',
  components: {
    AppNav,
    RotateSquare2,
  },
  data() {
    return {
      isAdding: false,
      devices: '',
      deviceID: '',
      status: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    closeModal() {
      this.$modal.hide('devicesModal');
    },
    validateDeviceID() {
      this.isAdding = true;
      this.status = 'Adding Device';
      getInfo();
      const deviceToInsert = {
        key: this.deviceID,
        mac_address: '01-11-22-33-',
        user_id: '2',
      };
      validateDeviceID(deviceToInsert).then((response) => {
        this.status = response;
      })
      .finally(() => {
        this.isAdding = false;
      });
    },
    handleAdd() {
      this.$modal.show('devicesModal');
    },
    getPrivateDevices() {
      getPrivateDevices().then((devicesFromServer) => {
        this.devices = devicesFromServer;
      });
    },
  },
  mounted() {
    this.getPrivateDevices();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
