import Vue from 'vue'
import Vuex from 'vuex'
let myRequest = require('../utils/request');
let {
	version
} = require('../version');
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		query: {}, //页面查询参数


		options: {}, // page.onLoad(options)  option参数
		user_info: uni.getStorageSync('user_info') || {}, //用户shuj

		CONFIG: uni.getStorageSync('CONFIG') || {},
		search_records: uni.getStorageSync('search_records') || [], //用户shuj

		pay_order_id: uni.getStorageSync('pay_order_id') || [], // 付款订单id
		
		chat_groups:[],

		live_store_info: uni.getStorageSync('live_store_info') || {}, //直播小店信息

		protocal_info: uni.getStorageSync('protocal_info') || {} //协议信息
	},
	mutations: {
		//赋值
		vuexSet(state, data) {
			state[data.name] = data.value;
			//特别操作 获取用户好友备注
			if (data.name == 'chat_friends') {
				console.log('设置好友备注......................');
				let obj = {};
				data.value.forEach(val => {
					obj[val.id] = val.remark || '';
				})
				state.remark_obj = obj;
				uni.setStorage({
					key: 'remark_obj',
					data: obj,
				});
			}
			if(data.isSave) {
				uni.setStorage(data.name,data.value);
			}
		},

	},
	getters: {

	},
	actions: {
		//更新全局数据
		refresh({
			commit,
			state
		}, obj) {

			myRequest({
				url: '/config/configList',
			}).then(res => {
				if (res.status == 200) {
					console.log('version', version);
					commit('vuexSet', {
						name: 'CONFIG',
						value: res.data || {}
					})
					uni.setStorage({
						key: 'CONFIG',
						data: res.data || {}
					});

					// #ifdef APP-PLUS
					// let phoneType = uni.getSystemInfoSync().platform || '';

					// let URL = phoneType == 'ios' ? res.data.APP_IOS : res.data.APP_ANO;

					// let [v, href] = URL.split('@');
					// if (v != version && href) {
					// 	uni.showModal({
					// 		confirmText: '去更新',
					// 		title: '新版本',
					// 		content: '检测到有新版本',
					// 		success: (e) => {
					// 			if (e.confirm) {
					// 				plus.runtime.openURL(href);
					// 			}
					// 		}
					// 	})

					// }
					// #endif
				}
			})

		},
		//更新用户身份
		refresh_user({
			commit,
			state
		}, obj) {
			if (!uni.getStorageSync('ACCESS_TOKEN')) {
				//未登录 不连接
				return;
			}

			myRequest({
				url: '/login/userInfo',
				toast: false,
			}).then(res => {
				if (res && res.status == 200) {

					commit('vuexSet', {
						name: 'user_info',
						value: res.data
					});
					uni.setStorage({
						key: 'user_info',
						data: res.data || {}
					});

				}
			})
		},
		//更新直播小店信息
		refresh_live_stroe_info({
			commit,
			state
		}, obj) {
			if (!uni.getStorageSync('ACCESS_TOKEN')) {
				//未登录 不连接
				return;
			}

			myRequest({
				url: '/liveStore/info',
				toast: false,
			}).then(res => {
				if (res && res.status == 200) {
					commit('vuexSet', {
						name: 'live_store_info',
						value: res.data.liveStore
					});
					uni.setStorage({
						key: 'live_store_info',
						data: res.data.liveStore || {}
					});

				}
			})
		},
		//获取协议信息
		refresh_protocal_info({
			commit,
			state
		}, obj) {
			// if (!uni.getStorageSync('ACCESS_TOKEN')) {
			// 	//未登录 不连接
			// 	return;
			// }

			myRequest({
				url: '/agreement/info',
				toast: false,
			}).then(res => {
				if (res && res.status == 200) {
					commit('vuexSet', {
						name: 'protocal_info',
						value: res.data
					});
					uni.setStorage({
						key: 'protocal_info',
						data: res.data || {}
					});

				}
			})
		},

	}

})
export default store
