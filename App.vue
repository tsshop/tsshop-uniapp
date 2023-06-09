<script>
	let objectToUrlParams = (obj, urlencode) => {
		let str = "";
		for (let key in obj) {
			str += "&" + key + "=" + (urlencode ? encodeURIComponent(obj[key]) : obj[key]);
		}
		return str.substr(1);
	}

	export default {
		onLaunch: function(e) {
			// uni.hideTabBar();
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！');
			console.log('App Launch', e);
			if (e.query.token) {
				uni.setStorageSync('ACCESS_TOKEN', e.query.token);
			}
			// #ifdef APP-PLUS
			// uni.setStorageSync('openid', 'ounkJ5CiIg9ap1nikiiGAO2ariQQ');
			// #endif

			uni.getSystemInfo({
				success: e => {
					this.globalData.statusBar = e.statusBarHeight; //状态栏高度
					let custom = {
						width: 0,
						height: 28,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0
					}; //菜单按钮
					//#ifdef MP-WEIXIN || MP-ALIPAY
					
					custom = uni.getMenuButtonBoundingClientRect(); //菜单按钮
					console.log('custom', custom);
					if (custom.height == 0) {
						custom.height = 40;
						console.log('未获取到custom，手动设置为', custom);
					}
					//#endif
					this.globalData.screenHeight = e.screenHeight;
					this.globalData.screenWidth = e.screenWidth;
					console.log('xxxxxxxxxxxxxxxxxx', e);
					this.globalData.custom = custom;
					
					if (e.safeArea) {
						// #ifdef MP-WEIXIN
						this.globalData.safeArea = e.screenHeight - e.safeArea.bottom
						// #endif
						// #ifndef MP-WEIXIN
						this.globalData.safeArea = e.safeAreaInsets.bottom
						// #endif
					} else {
						this.globalData.safeArea = 0
					}
					this.globalData.customBar = (custom.bottom + custom.top - e.statusBarHeight) > 0 ?
						(custom.bottom + custom.top - e.statusBarHeight) : (custom.height + e
							.statusBarHeight);
					//#ifdef H5 || APP-PLUS
					this.globalData.customBar = 50 + e.statusBarHeight;
					//#endif

					// #ifdef H5

					let url = window.location.href;
					if (url.indexOf('custom=1') > -1) {
						//苹果加状态栏
						this.globalData.statusBar = 44;
						this.globalData.customBar = 50 + 44;
					}
					// #endif

				}
			});


			// #ifdef APP-PLUS
			setTimeout(() => {
				plus.screen.lockOrientation("portrait-primary");
			}, 10)
			// #endif

			// uni.onTabBarMidButtonTap(() => {
			// 	uni.switchTab({
			// 		url: '/pages/game/game'
			// 	})

			// });

			//#ifdef APP
			// plus.push.addEventListener('click', (res) => {
			// 	console.log('click.................');
			// 	if (res.cmd == 2 || res.cmd == 5) {
			// 		uni.reLaunch({
			// 			url: '/pages/chat/notes'
			// 		})
			// 	}
			// 	plus.push.clear();
			// });
			// plus.push.addEventListener('receive', (res) => {
			// 	console.log('receive.................');
			// 	if (res.cmd == 2 || res.cmd == 5) {
			// 		uni.reLaunch({
			// 			url: '/pages/chat/notes'
			// 		})
			// 	}
			// 	plus.push.clear();
			// });
			// uni.onPushMessage((res) => {
			// 	console.log("收到推送消息：....", res) //监听推送消息
			// 	uni.showModal({
			// 		title: JSON.stringify(res),
			// 	});

			// plus.push.createMessage('天哪天哪', {}, {
			// 	cover: true,
			// 	delay: 1,
			// 	icon: '/static/zhoudao/notes2.png',
			// 	sound: 'system',
			// 	title: '马云给你发了一条消息',
			// 	subtitle: '马云'
			// });


			// })
			// #endif









		},
		onShow: function(e) {
			console.log('this.globalData.subscribeEvent', this.globalData.subscribeEvent);
			if (this.globalData.subscribeEvent) {
				//第三方支付回调
				console.log('app页', this.globalData.subscribeEvent.key);
				uni.$emit(this.globalData.subscribeEvent.key, this.globalData.subscribeEvent.orderId);
				console.log('this.globalData.subscribeEvent', this.globalData.subscribeEvent);
				this.globalData.subscribeEvent = null;
			}
			console.log('App show');
			this.globalData.STOPREFRESH = false;
			uni.getSystemInfo({
				success: e => {
					this.globalData.statusBar = e.statusBarHeight; //状态栏高度
					let custom = {
						width: 0,
						height: 28,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0
					}; //菜单按钮
					this.globalData.screenHeight = e.screenHeight;
					this.globalData.screenWidth = e.screenWidth;
					//#ifdef MP-WEIXIN || MP-ALIPAY
					custom = uni.getMenuButtonBoundingClientRect(); //菜单按钮
					console.log('custom', custom);
					if (custom.height == 0) {
						custom.height = 40;
						console.log('未获取到custom，手动设置为', custom);
					}
					//#endif


					this.globalData.custom = custom;
					if (e.safeArea) {
						// #ifdef MP-WEIXIN
						this.globalData.safeArea = e.screenHeight - e.safeArea.bottom
						// #endif
						// #ifndef MP-WEIXIN
						this.globalData.safeArea = e.safeAreaInsets.bottom
						// #endif
					} else {
						this.globalData.safeArea = 0
					}
					this.globalData.customBar = (custom.bottom + custom.top - e.statusBarHeight) > 0 ?
						(custom.bottom + custom.top - e.statusBarHeight) : (custom.height + e
							.statusBarHeight);
					//#ifdef H5 || APP-PLUS
					this.globalData.customBar = 50 + e.statusBarHeight;
					//#endif

					// #ifdef H5

					let url = window.location.href;
					if (url.indexOf('custom=1') > -1) {
						//苹果加状态栏
						this.globalData.statusBar = 44;
						this.globalData.customBar = 50 + 44;
					}
					// #endif

				}
			});

			///打开app携带的参数
			//#ifdef APP-PLUS 
			var args1 = plus.runtime.arguments;
			if (args1) {
				// 处理args参数，如直达到某新页面等  
				//console.log('打开信息',args1)
				// uni.showToast({
				// 	icon: "none",
				// 	title: args1
				// })
				let query_str = args1.split('?');
				if (query_str.length == 2) {
					let arr = query_str[1].split('&').map(val => val.split('='));
					let obj = {};
					arr.forEach(val => {
						obj[val[0]] = val[1];
					})
					if (obj.path) {
						// this.globalData.quer = 

						//有token 直接打开页面
						let path = obj.path;
						delete obj.path
						uni.reLaunch({
							url: path + '?' + objectToUrlParams(obj),
						})

					} else {
						this.globalData.path = obj.path;
						delete obj.path;
						this.globalData.query = obj;
					}


				}
				plus.runtime.arguments = ''
			}
			//#endif

			if (this.globalData.APPHIDE && this.globalData.CHAT) {
				this.globalData.APPHIDE = false;
				// this.globalData.CHAT.init(1);
				this.globalData.CHAT.SENDLINE_2();
				this.globalData.REFRESHNOTES = true;
				// uni.showToast({
				// 	title:'ggg'
				// })
			}


			// 更新小程序...........................
			//#ifdef MP-WEIXIN || MP-ALIPAY
			const updateManager = uni.getUpdateManager();

			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function(res) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否立即体验？',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});

					});

					updateManager.onUpdateFailed(function(res) {
						// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新打开哟~'
						})
					});
				}
			});




			//#endif
			// uni.hideTabBar();
			// setTimeout(() => {
			// 	uni.hideTabBar();
			// }, 500);
		},
		onHide: function() {
			console.log('App Hide');
			this.globalData.APPHIDE = true;
			this.globalData.STOPREFRESH = true;
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	@import "./components/common/common.css";
	@import "./components/common/iconfont.css";
	
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	/* #endif */
	/* #ifdef APP-NVUE */
	@import "./components/common/nvue.css";
	/* #endif */
</style>