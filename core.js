import store from './store'
import common from './components/common/common.vue'
import custom from './components/custom/custom.vue'

let CHAT = require('./utils/chat');


const {
	dev,
	root: ROOT,
} = require('./siteinfo.js');
const {
	version
} = require('./version.js');
export default {
	init: (Vue) => {


		//混入公共方法属性
		Vue.mixin({
			methods: {
				setData: function(obj, callback) {
					let that = this;
					const handleData = (tepData, tepKey, afterKey) => {
						tepKey = tepKey.split('.');
						tepKey.forEach(item => {
							if (tepData[item] === null || tepData[item] === undefined) {
								let reg = /^[0-9]+$/;
								tepData[item] = reg.test(afterKey) ? [] : {};
								tepData = tepData[item];
							} else {
								tepData = tepData[item];
							}
						});
						return tepData;
					};
					const isFn = function(value) {
						return typeof value == 'function' || false;
					};
					Object.keys(obj).forEach(function(key) {
						let val = obj[key];
						key = key.replace(/\]/g, '').replace(/\[/g, '.');
						let front, after;
						let index_after = key.lastIndexOf('.');
						if (index_after != -1) {
							after = key.slice(index_after + 1);
							front = handleData(that, key.slice(0, index_after), after);
						} else {
							after = key;
							front = that;
						}
						if (front.$data && front.$data[after] === undefined) {
							Object.defineProperty(front, after, {
								get() {
									return front.$data[after];
								},
								set(newValue) {
									front.$data[after] = newValue;
									that.$forceUpdate();
								},
								enumerable: true,
								configurable: true
							});
							front[after] = val;
						} else {
							that.$set(front, after, val);
						}
					});
					// this.$forceUpdate();
					isFn(callback) && this.$nextTick(callback);
				},
				vuexSet(key, data, state = false) {
					console.log('......chagne store......');
					console.log(key, data, state);
					console.log('......chagne store......');
					store.commit('vuexSet', {
						name: key,
						value: data
					});
					if (state) {
						//自动设置缓存
						uni.setStorageSync(key, data);
					}
				},
				changeValue(obj) {

					if (obj.key) {
						this[obj.key] = obj.value;
					}
					return this;
				},


			},
			computed: {

				protocal_info: function() {
					let that = this;
					return that.$store.state.protocal_info
				},

				live_store_info: function() {
					let that = this;
					return that.$store.state.live_store_info
				},

				pay_order_id: function() {
					let that = this;
					return that.$store.state.pay_order_id
				},

				user_info: function() {
					let that = this;
					return that.$store.state.user_info
				},

				dev: function() {
					return dev;
				},
				ROOT: function() {
					return ROOT;
				},
				CONFIG: function() {
					let that = this;
					return that.$store.state.CONFIG;
				},
				VERSION: function() {
					return version;
				},
				user_list: function() {
					let that = this;
					return that.$store.state.user_list;
				},
				checked_user: function() {
					let that = this;
					return that.$store.state.checked_user;
				},
				fall_list: function() {
					let that = this;
					return that.$store.state.fall_list;
				},
				fall_checked_uid: function() {
					let that = this;
					return that.$store.state.fall_checked_uid;
				},
			},
			onLoad(e) {
				let that = this;
				console.log("我是混入的onLoad", e);
			},
		});

		Vue.prototype.$store = store;


		//获取全局信息，图片等
		if (uni.getStorageSync('ACCESS_TOKEN')) {
			console.log('获取全局数据');
			setTimeout(() => {

				store.dispatch('refresh_user');
				// store.dispatch('refresh_user_list');

			}, 200);
		}
		
		store.dispatch('refresh_protocal_info') //获取用户协议信息

		setTimeout(() => {
			store.dispatch('refresh');
			CHAT.init();
			getApp().globalData.CHAT = CHAT;
		}, 200);
		


		Vue.prototype.pageRoute = () => {
			let page = getCurrentPages();
			var route = '';
			//#ifdef MP-WEIXIN
			route = page[page.length - 1].$vm.__route__;
			//#endif ;
			//#ifdef APP-PLUS || H5
			route = page[page.length - 1].route;
			// TODO
			//#endif
			return route
		}






		let getauth = function(object) {

			uni.getSetting({
				success: (res) => {
					if (typeof res.authSetting[object.author] === 'undefined') {
						uni.authorize({
							scope: object.author,
							success: (res) => {
								if (object.success) {
									object.success(res);
								}
							}
						});
					} else if (res.authSetting[object.author] == false) {
						uni.showModal({
							title: '是否打开设置页面重新授权',
							content: object.content,
							confirmText: '去设置',
							success: (e) => {
								if (e.confirm) {
									uni.openSetting({
										success: (res) => {
											if (object.success) {
												object.success(res);
											}
										},
										fail: (res) => {
											if (object.fail) {
												object.fail(res);
											}
										},
										complete: function(res) {
											if (object.complete) object
												.complete(res);
										}
									});
								} else {
									if (object.cancel) {
										getauth(object);
									}
								}
							}
						});
					} else {
						if (object.success) {
							object.success(res);
						}
					}
				}
			});
		};
		///////////////////////////////////////////////////////////////////////////////////////////


		Vue.component('common', common)
		Vue.component('custom', custom)

		///////////////////////////////////////////////////////////////////////////////////////////

		//返回上一页
		Vue.prototype.uniBack = () => {
			let page = getCurrentPages();
			if (page.length > 1) {
				uni.navigateBack({
					delta: 1
				});
				return;
			}
			uni.reLaunch({
				url: "/pages/index/index",
			})

		}

		//事先登录  未登录返回true 同时显示登录弹窗
		Vue.prototype.login = (type = true) => {
			if (type == false) {
				if (!uni.getStorageSync('ACCESS_TOKEN'))
					return true;
				else return false;
				return false;
			}

			if (!uni.getStorageSync('ACCESS_TOKEN')) {

				Vue.prototype.toPage("/pages/login/login");
				return true;
			}
			return false;
		}

		Vue.prototype.downloadFile = (obj = {}) => {
			let url = obj.url || ''
			url = url.toLowerCase().trim()
			if (url.indexOf('http:') == 0) {
				url = url.replace('http:', 'https:')
			}
			obj.url = url;
			uni.downloadFile(obj)
		}


		//公共复制方法  str：复制内容  notic：成功后提示消息 tiem：消息显示时间
		Vue.prototype.mycopy = (str = "", notice = "", time = 2500, clear = true) => {
			if (!str)
				str = "";
			str = str.replace(/<(p|div)[^>]*>/gi, '\n').replace(/<br\/?>/gi, '\n').replace(/<[^>/]+>/g, '')
				.replace(
					/(\n)?<\/([^>]+)>/g, '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ').replace(
					/<\/?(img)[^>]*>/gi, '').replace(
					/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "\'").replace(
					/&quot;/g, "\"").replace(
					/<\/?.+?>/g, "")
			str = str.trim() || '';
			uni.setClipboardData({
				data: str,
				success: () => {

					uni.hideToast();


					uni.showToast({
						title: notice || '复制成功',
						duration: time,
						icon: 'none'
					})


				}
			});
		}


		//公共节流方法
		let onoff = '';
		Vue.prototype.less = (fn, ...params) => {
			let newTime = new Date().getTime();
			if ((!onoff || (newTime - onoff > 1500)) && fn) {
				onoff = newTime;
				fn(...params);
			} else {
				console.log("请稍后点击")
			}
		}
		let onoff1 = '';
		Vue.prototype.click = (fn, ...params) => {
			let newTime = new Date().getTime();
			if ((!onoff1 || (newTime - onoff1 > 500)) && fn) {
				onoff1 = newTime;
				fn(...params);
			} else {
				console.log("请稍后点击")
			}
		}

		//取小数点，不四舍五入
		Vue.prototype.xs = (value, lang, type = 3) => {
			let a = parseFloat(value).toString();

			if (a == '0' || a == 'NaN') a = '0.00000000000';
			if (a.indexOf('.') == -1) a += '.';
			let index = a.indexOf('.');
			a += '00000000000';
			if (type == 3) {
				return a.substr(0, index + 1 + lang);
			} else if (type == 0) {
				return a.substr(0, index + 1 + lang).split('.')[0];
			} else {
				return a.substr(0, index + 1 + lang).split('.')[1];
			}
		}

		Vue.prototype.toPage = (url, type = 'to', login = false) => {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary");
			uni.showTabBar();
			// #endif
			console.log('type', type);
			console.log('url', url);
			if (login) {
				if (!uni.getStorageSync('ACCESS_TOKEN')) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}
			}!type && (type = 'to');
			switch (type) {
				case 'to':
					return uni.navigateTo({
						url: url
					});
				case 'back':
					return uni.navigateBack({
						delta: 1
					});

				case 'redirect':
					return uni.redirectTo({
						url: url
					})
				case '3':
					return uni.redirectTo({
						url: url
					})
				case 'relaunch':
					return uni.reLaunch({
						url: url
					})
				case 'switch':
					return uni.switchTab({
						url: url
					})
				case '4':
					return uni.switchTab({
						url: url
					})
			}

		}



		//uni.showToast 方法重写  （弹窗内容，显示时间，icon）
		Vue.prototype.showToast = (title = "", duration = 2000, icon = "none") => {
			// #ifdef APP-PLUS
			plus.nativeUI.toast(title);
			// #endif

			// #ifndef APP-PLUS
			uni.showToast({
				title,
				icon,
				duration
			})
			// #endif
		}
		//延时触发函数timeOut
		Vue.prototype.timeOut = (fn, duration = 500, icon = "none") => {
			if (typeof fn == 'function') {
				setTimeout(fn, duration)
			}
		}

		Vue.prototype.getPath = () => {
			let pages = getCurrentPages();
			let self = pages[pages.length - 1];
			//#ifdef MP-WEIXIN || APP-PLUS
			self = pages[pages.length - 1].$vm;
			return self.__route__;
			//#endif
			return self.route;
		}

		Vue.prototype.toApp = (path, appid, self = false, fn) => {
			//本app跳转
			if (self == true) {
				uni.navigateTo({
					url: path
				});
				return;
			}
			appid = appid ? appid : (store.state.init_appid.def_qlm);
			// console.log(store.state.init_appid.def_qlm)
			uni.navigateToMiniProgram({
				// appId: 'wx21bb579824e96e36', 没有的话默认亲联盟
				appId: appid,
				path: path,
				extraData: {
					token: uni.getStorageSync('ACCESS_TOKEN') || '',
					_mchInfo: {
						id: uni.getStorageSync('_mchInfo').id || ""
					},
					mch_id: uni.getStorageSync('_mchInfo').id,
				},
				envVersion: 'trial',
				success: res => {
					if (fn) {
						fn();
					}
				}
			})
		}

		Vue.prototype.PAGE = () => {
			let pages = getCurrentPages();
			let self = pages[pages.length - 1];
			//#ifdef MP-WEIXIN || APP-PLUS
			self = pages[pages.length - 1].$vm;

			//#endif
			return self;
		}

		Vue.prototype.sendEvent = (key = '13', value = {}) => {
			if (wx.aldstat && wx.aldstat.sendEvent) {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent(key, value)
				// #endif
			}

		}

		//绑定request
		let request = require('./utils/request.js');
		Vue.prototype.request = request;
		Vue.prototype.clear = () => {};
		Vue.prototype.get_options = (e) => {
			if (e && e.target && e.target.dataset) {
				return e.target.dataset || {};
			}
			return {};
		};

		Vue.prototype.has = (obj = {}, key = '', is_null = false) => {
			//is_null 允许值为 “” null undfind
			if (key) {
				let have = false;
				let arr = key.split('.');
				let obj_new = obj;
				arr.some((val, index) => {
					if (is_null) {
						if (obj_new && obj_new.hasOwnProperty(val)) {
							obj_new = obj_new[val];
							if ((index + 1) == arr.length) {
								have = true;

							}
							return false;
						}
					} else {
						if (obj_new && obj_new.hasOwnProperty(val) && obj_new[val]) {
							obj_new = obj_new[val];
							if ((index + 1) == arr.length) {
								have = true;

							}
							return false;
						}
					}
					return true;
				});
				return have;
			} else {
				return false;
			}
		};

		Vue.prototype.clone = (obj) => {
			return JSON.parse(JSON.stringify(obj));
		}
		Vue.prototype.requestFullScreen = (id) => {
			let video = uni.createVideoContext(id);
			video.requestFullScreen();
			console.log('video', video, 'id', id);
		}
		Vue.prototype.to_page_by_code = (result, fnObj = {}) => {
			let obj = {};
			if (String(result).indexOf('http') > -1 || String(result).indexOf('?') > -1) {
				//如果有http 链接 需要把 invite (邀请码)取出来
				let str_arr = String(result).split('?');
				if (str_arr.length == 2) {
					let arr = String(str_arr[1]).split('&').map(val => {
						return val.split('=');
					})
					arr.forEach(val => {
						if (val && val.length == 2) {
							obj[val[0]] = val[1];
						}
					});

				}
			}

			console.log('扫码参数', obj);
			if (obj.invite) {
				Vue.prototype.toPage('/pages/login/login?invite=' + obj.invite);
				return;
			}
			if (obj.pay) {
				Vue.prototype.toPage(`/pages/store/pay?id=${obj.pay}&salt=${obj.salt}`);
				return;
			}

			if (obj.group) {
				getApp().globalData.group_code = obj.group;
				Vue.prototype.toPage('/pages/chat/group-code');
				return;
			}
			//核销二维码
			if (obj.coupon) {
				if (fnObj.type == 'writeoff' && fnObj.fn) fnObj.fn(obj.coupon);
				return;
			}
			//店铺二维码
			if (obj.shop) {
				Vue.prototype.toPage(`/pages/store/index?id=${obj.id}`);
				return;
			}
			//用户二维码
			if (obj.user) {
				getApp().globalData.userCode = obj.user;
				Vue.prototype.toPage(`/pages/chat/user`);
			}

		}
		Vue.prototype.dateFormat = (fmt, date) => {
			let ret;
			let opt = {
				"Y+": date.getFullYear().toString(), // 年
				"m+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"H+": date.getHours().toString(), // 时
				"M+": date.getMinutes().toString(), // 分
				"S+": date.getSeconds().toString() // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
						"0")))
				};
			};
			return fmt;
		}


		Vue.prototype.rsuccess = (res, type = false) => {
			if (res && type === false && res.status == 200) return true;
			if (res && type === true && res.status == 200 && res.data) return true;
		}

		Vue.prototype.share = (url, obj = {}, title = "", imageUrl = "") => {

			obj = {
				...obj
			}
			let path = "";
			path = url + '?';
			if (typeof obj == 'object') {
				for (let i in obj) {
					path += (i + '=' + obj[i] + '&');
				}
			}

			let share = {};
			path = path.substring(0, path.length - 1);
			share.path = path;
			if (title) {
				share.title = title;
			}
			if (imageUrl) {
				share.imageUrl = imageUrl;
			}
			console.log('分享链接', share);
			return share;
		}
		Vue.prototype.handleImg = (arr, key = 'src') => {
			return arr.map(val => {
				if (val[key]) {
					val[key] = String(val[key]).split(',')[0];
				}
				return val;
			})
		};
		Vue.prototype.shareApp = (path, title) => {
			if (!uni.getStorageSync('ACCESS_TOKEN')) {
				Vue.prototype.toPage('/pages/login/login');
				return;
			};
			Vue.prototype.request({
				url: '/zhoudao/shop/share',
				data: {
					src: path
				},
				loading: true,
			}).then(res => {
				if (res.status == 200 && res.data) {
					//小程序链接

					// #ifdef APP-PLUS
					// uni.share({
					// 	provider: "weixin",
					// 	scene: "WXSceneSession",
					// 	type: 0,
					// 	href: res.data,
					// 	title: title,
					// 	summary: String(`${title}\n${res.data}`).trim(),
					// 	imageUrl: "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png",
					// 	success: function (res) {
					// 		console.log("success:" + JSON.stringify(res));
					// 	},
					// 	fail: function (err) {
					// 		console.log("fail:" + JSON.stringify(err));
					// 	}
					// });
					// return ;
					plus.share.sendWithSystem({
						// provider: 'weixin',
						type: 'text',
						// href: String(`${title}\n${res.data}`).trim(),
						// summary: String(`${title}\n${res.data}`).trim(),
						// scene: 'WXSceneSession', //WXSceneTimeline朋友圈
						content: String(`${title}\n${res.data}`).trim(),
						// href: res.data, //WXSceneTimeline朋友圈
						success: res => {
							console.log('success', res);
						},
						fail: res => {
							console.log('fail', res);
						}
					})
					// uni.share({
					// 	provider: "weixin",
					// 	// scene: "WXSceneTimeline",
					// 	type: 1,
					// 	summary: String(`${title}\n${res.data}`).trim(),
					// 	success: function(res) {
					// 		console.log("success:" + JSON.stringify(res));
					// 	},
					// 	fail: function(err) {
					// 		console.log("fail:" + JSON.stringify(err));
					// 	}
					// });
					// #endif

					// #ifdef H5
					Vue.prototype.mycopy(`${title}\n${res.data}`, '已复制分享链接,去微信分享把');
					// #endif

				}
			});
		}



	},

}
