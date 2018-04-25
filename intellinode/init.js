load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_rpc.js');

let button = Cfg.get('pins.button');
let topic = '/devices/' + Cfg.get('device.id') + '/events';

let led = 14;
print('LED GPIO:', led, 'button GPIO:', button);
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
GPIO.write(led, 0);

GPIO.set_mode(led, GPIO.MODE_OUTPUT);

MQTT.sub('device/staged', function(conn, topic, msg) {
  GPIO.write(led, 1);
  Timer.set(5000, 0, function() {
    let value = GPIO.write(led, 0);
  }, null);
  print('Topic:', topic, 'message:', msg);
}, null);

GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 600, function() {
  RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function(resp, ud) {
    let res = MQTT.pub('device/stage', JSON.stringify({ mac: resp.mac, type: "luz" }), 1);
    print('Published:', res ? 'yes' : 'no');
  });
}, null);