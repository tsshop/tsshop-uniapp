let {
	mqroot
} = require('../siteinfo');
import store from '../store/index.js';
const MQTT_USERNAME = 'admin' //mqtt用户名
const MQTT_PASSWORD = 'admin' //密码


export const MQTT_OPTIONS = {
	connectTimeout: 5000,
	clientId: '',
	username: MQTT_USERNAME,
	password: MQTT_PASSWORD,
	// clean: false
}
var mqtt = require('mqtt/dist/mqtt.js');
// var mqtt = require('./mq.js');



let topic = ''; //监听主题
let topic_fall = ''; //监听防跌倒

let client = '';


let connect = () => {

	var that = this
	// #ifdef H5
	client = mqtt.connect(mqroot, MQTT_OPTIONS)
	// #endif
	// #ifdef MP-WEIXIN||APP-PLUS

	client = mqtt.connect(mqroot.replace('ws', 'wx'), MQTT_OPTIONS)
	// #endif
	client.on('connect', function() {
		console.log('连接成功')
		client.subscribe(topic, function(err) {
			if (!err) {
				console.log('订阅首页数据成功')
			}
		})
		if (topic_fall) {
			client.subscribe(topic_fall, function(err) {
				if (!err) {
					console.log('订阅防跌倒数据成功')
				}
			})
		}
	}).on('reconnect', function(error) {
		console.log('正在重连...', topic)
	}).on('error', function(error) {
		console.log('连接失败...', error)
	}).on('end', function() {
		console.log('连接断开')
	}).on('message', function(topic, message) {
		console.log('接收推送信息：', JSON.parse(message.toString()), topic)
		if(topic == topic_fall){
			//防跌倒
			handleData(JSON.parse(message.toString()), '', 'fall');
			return ;
		}
		let topType = topic.substr(topic.lastIndexOf('/')).substr(1);
		handleData(JSON.parse(message.toString()), topType);
	})


}

function handleData(obj, topType, t = '') {
	// t = fall 防跌倒

	let data = {};
	if (t == 'fall') {

		data.fall_info = obj || null;
	} else if (topType == 'bloodPressure') {
		data.bloodPressure = {
			bpSp: obj.bpSp,
			bpDp: obj.bpDp
		}
	} else if (topType == 'bodyFat') {
		data.body = {
			fatFate: obj.bfFatFate,
			weight: obj.bfWeight,
		}
	} else if (topType == 'bloodOxygen') {
		data.bloodOxygen = obj.measureData;
	} else if (topType == 'uricAcid') {
		data.uricAcid = obj.measureData;
	} else if (topType == 'cholesterol') {
		data.cholesterol = obj.measureData;
	} else if (topType == 'temperature') {
		data.temperature = obj.temperature;
	} else if (topType == 'sugar') {
		data.bloodSugar = obj.measureData;
	} else if (topType == 'ecg') {
		data.ecg = obj.measureData;
	} else if (topType == 'sleep') {
		// data.ecg = obj.measureData;
		data.sleep = {
			status: obj.status, // 0, // 设备状态 0：离线 1：在线 2：故障
			inbedStatus: obj.inbed_status, //  离床状态 0：在床 1：离床 ※1
			sleepStage: obj.sleep_stage, // 0, 睡眠状态 1：清醒 2：浅睡 3：中睡 4：深睡 ※1
			sleepStageChanged: obj.sleep_stage_changed, // 时间戳, 睡眠状态变更时间 ※1
			breath: obj.breath, // 0, 呼吸率(次/分钟) ※1
			heart: obj.heart, // 0,  心率(次/分钟) ※1
		}
	}
	uni.$emit('refre_index', data);
}
let close = () => {

	if (client && client.end && typeof client.end == 'function') {
		// console.log('关闭');
		client.end();
	}
}
let obj = {
	init: () => {
		if (store.state.checked_user.userId) {
			topic = `data/${store.state.checked_user.userId}/#`;
			if (store.state.fall_checked_uid) {
				topic_fall = `data/fall/${store.state.fall_checked_uid}`;

			}
			MQTT_OPTIONS.clientId = 'sub' + (store.state.checked_user.userId);
			// #ifdef MP-WEIXIN
			MQTT_OPTIONS.clientId = 'subwx' + (store.state.checked_user.userId);
			// #endif
			// #ifdef H5
			MQTT_OPTIONS.clientId = 'subweb' + (store.state.checked_user.userId);
			// #endif
			console.log('topic.........................', topic);
			close();

			setTimeout(() => {
				connect();
			}, 200);
		}

	}
};
setTimeout(() => {
	getApp().globalData.mqtt = obj;
	// getApp().globalData.mqtt.init();
}, 1300);

module.exports = obj;
