/***
 * http请求
 * @param args
 */

let envInfo = require('../siteinfo.js')
import store from '../store/index.js';

module.exports = function(object) {
	let page = getCurrentPages();
	let route = "";
	if (page.length > 0) {
		let self = page[page.length - 1]
		//#ifdef MP-WEIXIN || APP-PLUS
		self = page[page.length - 1].$vm;
		//#endif
		route = self.route;
		//#ifdef MP-WEIXIN 
		route = self.__route__;
		//#endif
		//#ifdef APP-PLUS
		route = page[page.length - 1].route;
		//#endif
	}

	if (!object.data) {
		object.data = {};
	}
	if (!object.content_type) {
		object.header = {
			'content-type': 'application/json;charset:utf-8;'
			// 'content-type': 'application/x-www-form-urlencoded'
		};
	} else {
		object.header = {
			'content-type': 'form-data'
		};
	}
	object.header['Accept'] = 'application/vnd.trading.v1+json';


	// 携带用户信息
	let access_token = uni.getStorageSync('ACCESS_TOKEN');
	if (access_token) {
		object.header['token'] = access_token;
		// object.data.token = access_token;
	}
	// 携带鉴品师 id
	// object.header['reviewer-id'] = uni.getStorageSync('REVIEWER_ID');



	//拼接URL
	// object.url = object.static ? (envInfo.root + object.url) : (envInfo.root + object.url);
	// #ifndef H5

	if (object.chat == true) {
		object.url = object.static ? (object.url) : (envInfo.chat + '' + object.url);
	} else {
		object.url = object.static ? (object.url) : (envInfo.root + '' + object.url);
	}
	// #endif

	// #ifdef H5



	if (object.chat == true) {
		object.url = object.static ? (object.url) : (envInfo.chat + '' + object.url);
	} else {
		object.url = object.static ? (object.url) : (envInfo.root + '' + object.url);
		// object.url = object.static ? (object.url) : ('/api' + object.url);
	}

	// #endif

	if (object.loading) {
		uni.showLoading({
			mask: true,
		});
	}
	return uni.request({
		url: object.url,
		header: object.header,
		data: object.data,
		method: object.method || "GET",
		dataType: object.dataType || "json"
	}).then(res => {

		if (object.loading) {
			uni.hideLoading();
		}
		if (res.length == 1) {
			res[1] = {
				data: {}
			}
		}
		res = res[1].data

		if (res.status == '4006' || res.status == 403 || res.status == 401) {

			if (object.login !== false && access_token) {
				uni.setStorageSync('ACCESS_TOKEN', '');
				uni.setStorageSync('user_info', '');
				store.commit('vuexSet', {
					name: 'user_info',
					value: {}
				});
				let pages = getCurrentPages();
				let self = pages[pages.length - 1];
				//#ifdef MP-WEIXIN || APP-PLUS
				self = pages[pages.length - 1].$vm;
				let router = ''
				router = self.__route__;
				//#endif
				router = self.route;
				if (router != 'pages/login/login') {
					uni.navigateTo({
						url: '/pages/login/login?guoqi=guoqi'
					})
				}


			} else {
				return res;
			}
		} else {
			if (res.status != 200 && res.msg && object.toast !== false) {
				// #ifdef APP-PLUS
				plus.nativeUI.toast(res.msg);
				// #endif

				// #ifndef APP-PLUS
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 3000
				});
				// #endif
			}

			return res;
		}

	}).catch(res => {
		uni.hideLoading();
	})

};
