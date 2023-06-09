<template>
	<view>
		<custom :hiddenBtn="true" title=" " background="rgba(0,0,0,0)"></custom>
		<template>
			<view v-if="type === 3" class="avater-box">
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" mode="scaleToFill" :src="avatarUrl"></image>
				</button>
				<text>头像</text>
				<view class="weui-input-box mt20">
					<input type="nickname" class="nick-input"  placeholder="请输入昵称" v-model="name"
						@blur="onNickName" />
				</view>
				<button class="default-btn mt20" @tap.stop="login_wx">进入程序</button>
				<text style="color:#999;">您可以选择使用微信头像或名称，也可直接进入程序。</text>
			</view>
			<view v-else style="padding:0 40rpx;">
				<view class="flex flex-x-y">
					<image src="../../static/logo.png" mode="aspectFill"
						style="width: 122rpx;height: 122rpx;border-radius: 10rpx;margin-top: 120rpx;"></image>
				</view>
				<view v-if="openid.length > 0 && loginType">
					<button open-type="getPhoneNumber"  @getphonenumber="onGetPhoneNumber"
						class="iconfont icon-weixin1 default-btn wechat-btn" style="transition: all 0.3;background: #07c160;"
						>
						<view class="ml-10">微信一键授权登录</view>
					</button>
					<view class="other-type" @tap.stop="changloginType">其他登录方式</view>
				</view>
				<view v-else>
					<!-- 手机号 -->
					<view class="input-login" style="margin-top: 68rpx;">
						<input name='phone' type="number" maxlength="11" placeholder="输入手机号" class="font"
							placeholder-class="placeholderClass font" v-model="phoneNum" />
					</view>
					<!-- 手机号 -->


					<!-- 密码 -->
					<view class="" v-if='type==2'>
						<view class="input-login">
							<input @confirm="login_by_phone" name='phone' v-model="password" :password="true"
								placeholder="输入密码" class="" placeholder-class="font placeholderClass font"
								:adjust-position="false" />
						</view>
					</view>
					<!-- 密码 -->

					<!-- 验证码 -->
					<view class="" v-if='type==1'>
						<view class="input-login">
							<input @confirm="login_by_phone" class="" name='code' type="number" v-model="verify"
								placeholder="输入验证码" placeholder-class="placeholderClass font"
								:adjust-position="false" />
							<view class="color">
								<verify :phone="phoneNum" :url="'/login/getCode'" :sendMethod="'GET'"></verify>
							</view>
						</view>
					</view>
					<!-- 验证码 -->

					<view class="flex flex-y-center fs-28 color-black" style="margin-top: 20rpx;">
						<view v-if='type==1' @click="authCode">账号密码登录</view>
						<view v-if='type==2' @click="cipher">验证码登录</view>
						<view v-if="openid.length > 0" class="ml-10" @click="changloginType"> | 微信一键登录</view>
					</view>


					<view class="flex flex-y-center fs-28" style="margin-top: 80rpx;">
						<view class="iconfont icon-weixuanzhong color-black" style="font-size: 36rpx;" v-if="value != 1"
							@tap="choose_value(1)"></view>
						<view class="iconfont icon-xuanzhong color-all" style="font-size: 36rpx;" v-else
							@tap="choose_value(0)">
						</view>
						<view class="flex flex-x-y color-black" style="margin-left: 14rpx;">
							<text @tap="choose_value(value == 1 ? 0 : 1)">我已阅读并同意</text>
							<!-- <text class="color-all" @tap="toPage('/pages/protocol/protocol')">《用户协议》</text>
							<text>和</text> -->
							<text class="color-all" @tap="toPage('/pages/privacy/privacy')">《{{ protocal_info.privacyTitle }}》</text>
						</view>
					</view>

					<view @tap.stop="login_by_phone" class="default-btn mt-20" style="transition: all 0.3;"
						:style="get_pass()?'':'background:#DCE1E0;'">登录
					</view>
				</view>
			</view>
			

			<view style="height: 60rpx;"></view>
		</template>




		<view style="position: fixed;bottom: 0;width: 100vw;bottom: 106rpx;left: 0;color: #888888;"
			class="flex flex-x-y">

		</view>




	</view>
</template>

<script>
	import loginVue from './login.vue';
	let utils = require('../../utils/util');
	export default {
		data() {
			return {
				type: 1, // 1验证码登录，2密码登录
				value: 0 + '',
				currentTime: 60,
				time: "获取验证码",
				disabled: "",
				phoneNum: "", //手机号
				password: '', //密码
				verify: '', //验证码
				invite: '',
				img: "", //验证码图片
				uuid: '',
				imgcode: '',
				openid: '', //openid，小程序openid直接登录 手动退出登录会清除缓存的openid
				loginType: true,
				after: false,
				key: '',
				appType: 'yong', //非老人端
				name: '',
				avatarUrl: '',
				wxphone:'',

			};
		},
		mounted() {
			let phone = uni.getStorageSync('phone');
			if (phone) {
				this.phoneNum = phone;
			}
		},
		onLoad(e) {
			if (e.invite) {
				this.invite = e.invite;
			}
			// this.get_code();

			if (e.guoqi) {
				// setTimeout(() => {
				// 	this.showToast('身份已过期，请重新登录', 3000);
				// }, 400)

			}
			this.vuexSet('checked_user', {}, true);
			this.vuexSet('user_list', [], true);

			// #ifdef MP-WEIXIN
			this.get_weixincode();
			// #endif
			// #ifdef APP-PLUS || H5
			this.after = true;
			// #endif


		},

		methods: {
			onChooseAvatar(e) {
				this.avatarUrl = e.detail.avatarUrl
			},
			onNickName(e) {
				this.name = e.detail.value
			},
			// 切换登录方式
			changloginType() {
				this.loginType = !this.loginType
			},
			// 获取微信用户的手机号
			onGetPhoneNumber(e) {
				const { errMsg, code } = e.detail
				if(errMsg !== 'getPhoneNumber:ok') {
					return
				}
				this.code = code
				this.type = 3
				this.request({
					url:'/login/getPhone',
					method: 'get',
					data: {
						code,
					}
				}).then(res => {
					this.wxphone = res.data
				})
				return
			},
			// 微信直接登录
			login_wx() {
				this.request({
					url: '/login/loginByScenario',
					data: {
						scenario: 'login_wx',
						openId: this.openid,
						phone: this.wxphone,
						name: this.name,
						avatarUrl: this.avatarUrl,
					},
					method: 'POST',
					loading: true,
				}).then(res => {
					if (res.status == 200 && res.data) {
						//登录成功
						this.vuexSet('user_info', res.data.user, true);
						uni.setStorageSync('appType', this.appType);
						uni.setStorageSync('ACCESS_TOKEN', res.data.Authorization);
				
						this.showToast('登录成功');
						this.login_after();
						setTimeout(() => {
						}, 1000);
						setTimeout(() => {
							this.uniBack();
						}, 200);
					}
				});
			},

			get_code() {
				this.request({
					url: '/wechatLogin/code',

				}).then(res => {
					if (res.status == 200 && res.img) {
						this.$nextTick(() => {
							this.img = res.img;
							this.uuid = res.uuid;
							this.imgcode = '';
						})
					}
				});
			},
			authCode() {
				this.type = 2

			},
			cipher() {
				this.type = 1
			},
			changeType(e) {
				this.appType = e.detail.value ? 'yong' : 'old';
			},

			//验证手机号码
			inputPhone() {
				console.log(e)
				this.phoneNum = e.detail.value
				if (!(/^1[3456789]\d{9}$/.test(this
						.phoneNum))) {
					if (this.phoneNum.length >= 11) {
						this.showToast('手机号有误');
					}
				}

			},
			//获取验证码
			sendRegistCode() {

				// if (this.imgcode == '') {
				// 	this.showToast('请输入图片验证码');
				// 	return;
				// }

				if (this.time != '获取验证码') {
					this.showToast('请稍等');
					return;
				}

				this.less(() => {


					let that = this;
					console.log(that.phoneNum, "111")
					var reg =
						/^1[3456789]\d{9}$/; //11位手机号码正则
					if (that.phoneNum.length == 0) {
						this.showToast('请输入手机号');
					} else if (reg.test(that.phoneNum) == true) {
						// let currentTime = that.currentTime;
						let interval;
						this.request({
							url: '/login/getCode',
							data: {
								phone: this.phoneNum,
								// uuid: this.uuid,
								// code: this.imgcode
							},
							loading: true,
						}).then(res => {
							if (res.status == 200) {
								this.showToast('验证码已发送', 3000);
								that.time = that.currentTime + 's后重新获取';
								that.disabled = true;
								interval = setInterval(function() {
									that.time = that.currentTime - 1 + 's后重新获取';
									that.currentTime--;
									if (that.currentTime <= 0) {
										clearInterval(interval)
										that.time = '获取验证码',
											that.currentTime = 60,
											that.disabled = false
									}
								}, 1000)
							} else {
								// this.get_code();
							}
						})
					} else {
						this.showToast('请输入正确的手机号');
					}


				})

			},

			//密码登录
			choose_value(val) {
				this.value = val;
			},
			logIn: function(e) {
				console.log(e)
				let that = this;
				if (this.value != 1 + '') {
					this.showToast('请阅读协议');
					return;
				}
				// console.log(e.detail.value.code, 11111111111)
				if (this.phoneNum == "") {
					this.showToast('请输入手机号');
					return;
				}
				if (this.type == 1 && this.verify == "") {
					this.showToast('请输入验证码');
					return;
				}
				if (this.type == 2 && this.password == "") {
					this.showToast('请输入密码');
					return;
				}

				this.to_login();


			},

			close_toast() {
				this.$refs.popup.close();
			},
			open_toast() {
				this.$refs.popup.open();
			},
			get_pass() {
				if (this.value != 1) {
					return false;
				}
				if (!(/^1[3456789]\d{9}$/.test(this
						.phoneNum))) {
					return false;
				}
				if (this.type == 1 && this.verify == "") {
					return false;
				}
				if (this.type == 2 && this.password == "") {
					return false;
				}
				return true;
			},
			
			to_login() {
				this.less(() => {
					//////////////
					this.request({
						url: '/login/loginByScenario',
						method: 'POST',
						loading: true,
						data: {
							msgCode: this.verify,
							password: this.password,
							phone: this.phoneNum,
							parentUserId: this.invite,
							scenario: this.type == 1 ? 'login_app_code' : 'login_app_password',
						}
					}).then(res => {
						if (res.status == 200) {
							uni.setStorageSync('phone', this.phoneNum);
							uni.setStorageSync('ACCESS_TOKEN', res.data.token);


							this.vuexSet('user_info', res.data.user, true);


							// uni.preloadPage({
							// 	url: '/pages/user/user',

							// });

							// uni.preloadPage({
							// 	url: '/pages/game/game',
							// });
							//更新用户信息
							// this.$store.dispatch('refresh_user');

							setTimeout(() => {
								uni.reLaunch({
									url: "/pages/find/find"
								})
							}, 100);
						}
					});
					//////////////
				})
			},
			//openid 登录
			login_by_openid() {
				this.request({
					url: '/wechatLogin/loginByScenario',
					data: {
						scenario: 'login_openId',
						openId: this.openid,
					},
					method: 'POST',
					loading: true,
					toast: false,
				}).then(res => {
					if (res.status == 200 && res.data) {
						//登录成功
						this.vuexSet('user_info', res.data.user, true);
						uni.setStorageSync('ACCESS_TOKEN', res.data.Authorization);
						this.showToast('登录成功');
						this.login_after();
						setTimeout(() => {
							this.uniBack();
						}, 200);
					}
				});
			},
			//获取openid
			get_openid_by_code() {
				// #ifdef MP-WEIXIN
				this.request({
					url: '',
					toast: false,
					login: false,
					data: {},
				}).then(res => {
					if (!res.status || !res.data) return;

				});
				// #endif
			},

			change_after() {
				this.after = true;
			},
			async login_quick(e) {
				// #ifdef MP-WEIXIN
				this.phone_res = e;
				if (this.wx_status === undefined || this.wx_status == 2) {
					this.wx_status = 1;
					return;
				} else if (this.wx_status != 1) {
					return;
				}

				this.click(async () => {
					if (!this.openid) {
						await this.get_weixincode();
					}

					if (e.detail.code) {
						let phone_res = await this.request({
							url: '/wechatLogin/getPhone',
							data: {
								code: e.detail.code
							}
						});
						console.log('phone_res', phone_res);


						if (!this.rsuccess(phone_res, true)) return;
						this.phoneNum = phone_res.data;


						this.request({
							url: '/wechatLogin/loginByScenario',
							data: {
								scenario: 'login_wx',
								openId: this.openid,
								avatarUrl: this.avatarUrl || '',
								name: this.nickname || '',
								phone: this.phoneNum,
							},
							method: 'POST',
							loading: true,
						}).then(res => {
							if (res.status == 200 && res.data) {
								//登录成功
								this.vuexSet('user_info', res.data.user, true);
								uni.setStorageSync('ACCESS_TOKEN', res.data.Authorization);
								this.showToast('登录成功');
								this.login_after();
								setTimeout(() => {
									this.uniBack();
								}, 200);
							}
						});
					} else {
						this.showToast('请使用手机号登录');
						this.wx_status = undefined;
					}

				});
				this.wx_status == 2;

				// #endif
			},
			async get_weixincode() {
				let opid = uni.getStorageSync('openid');
				this.openid = opid;
				if (opid) return;
				let aaa = await uni.login();
				console.log('aaa', aaa)
				if (aaa.length == 2 && aaa[1].code) {
					this.request({
						url: '/login/getOpenId',
						data: {
							code: aaa[1].code,
						}
					}).then(res => {
						if (res.status == 200 && res.data && res.data.openid) {
							this.openid = res.data.openid;
							uni.setStorage({
								key: 'openid',
								data: res.data.openid
							});
						}
					});

				}

			},
			async login_by_phone() {
				if(this.type !== 3) {
					if (this.value != 1) {
						this.showToast('请先阅读并勾选用户协议和政策');
						return;
					}
					if (!(/^1[3456789]\d{9}$/.test(this.phoneNum))) {
						this.showToast("请输入正确的手机号");
						return;
					}
					if (this.type == 1) {
						//验证码登录
					
						if (!this.verify) {
							this.showToast('请输入验证码');
							return;
						}
					}
					if (this.type == 2) {
						if (!this.password) {
							this.showToast('请输入密码');
							return;
						}
					}
				}


				this.click(async () => {


					// #ifdef  MP-WEIXIN
					if (!this.openid) {
						await this.get_weixincode();
					}
					// #endif

					let scenario = '';

					// #ifdef MP-WEIXIN
					scenario = this.type == 1 ? 'login_wx_code' : 'login_wx_password';


					// #endif

					// #ifndef MP-WEIXIN
					scenario = this.type == 1 ? 'login_app_code' : 'login_app_password';
					// #endif




					this.request({
						url: '/login/loginByScenario',
						data: {
							scenario: scenario,
							openId: this.openid,
							// avatarUrl: '',
							// name: '',
							phone: this.phoneNum,
							code: this.verify,
							password: this.password,
							// name: this.name,
							// avatarUrl: this.avatarUrl,
							// type: 0,
						},
						method: 'POST',
						loading: true,
					}).then(res => {
						if (res.status == 200 && res.data) {
							//登录成功
							this.vuexSet('user_info', res.data.user, true);
							uni.setStorageSync('appType', this.appType);
							uni.setStorageSync('ACCESS_TOKEN', res.data.Authorization);

							this.showToast('登录成功');
							this.login_after();

							// this.$store.dispatch('refresh_user_list');
							setTimeout(() => {

								// getApp().globalData.mqtt.init();
							}, 1000);
							setTimeout(() => {
								this.uniBack();
								// uni.reLaunch({
								// 	url: '/pages/index/index'
								// });

							}, 200);

						}
					});
				});


			},
			login_after() {
				if (getApp().globalData.CHAT && getApp().globalData.CHAT.CLOSE) {
					getApp().globalData.CHAT.CLOSE();
				}
				getApp().globalData.CHAT.init(1);

				// this.$store.dispatch('refresh_friend');
				// this.$store.dispatch('refresh_group');
				// this.$store.dispatch('refresh_pushid');
			},
			async getUserInfo() {
				let userinfo = await uni.getUserProfile({
					desc: '获取用户昵称和头像',
				});
				console.log('userinfo', userinfo);


				if (userinfo && userinfo[1] && userinfo[1].userInfo) {
					this.avatarUrl = userinfo[1].userInfo.avatarUrl;
					this.name = userinfo[1].userInfo.nickName;
				}


				if (this.wx_status === undefined || this.wx_status == 2) {
					this.wx_status = 1;
					return;
				} else if (this.wx_status != 1) {
					return;
				}
				await this.login_quick(this.phone_res);
				this.wx_status == 2
			},
		}
	}
</script>

<style lang="scss">
	page {

		background-color: $pageColor;

	}

	.loginkey {
		font-size: 32rpx;
		color: #323232;
		font-weight: bold;
		margin-top: 40rpx;
	}

	.hui {
		background-color: #DCE1E0;
	}

	.input-login {

		height: 100rpx;
		background: #FFFFFF;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		padding: 0 42rpx;
		margin-top: 40rpx;
	}

	.input-login input {
		flex: 1;
		margin-right: 20rpx;
		border: none;

	}

	.placeholderClass {
		color: #646464;
	}

	.login-btn {
		margin-top: 40rpx;
		border-radius: 10rpx;
		height: 80rpx;
		color: #FFFFFF;
		background-color: #46D9C5;
		transition: all 0.5s;
	}

	.wechat-btn {
		margin-top: 180rpx;
		border-radius: 50rpx;
		font-size: 20px;
		background-color: #07c160;
		padding: 0;

	}
	.other-type {
		display: block;
		text-align: center;
		margin-top: 10px;
		color: #0174d1;
	}
	.avater-box {
		padding: 20rpx 40rpx;
		.avatar-wrapper {
			width: 80px;
			height: 80px;
			border-radius: 80px;
			overflow: hidden;
			padding: 0;
			background-color: #999999;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.weui-input-box {
			height: 50px;
			border-radius: 25px;
			background-color: #fefefe;
			padding: 0 20px;
			.nick-input {
				height: 50px;
			}
		}
		text {
			font-size: 14px;
			margin-top: 10px;
			display: block;
			text-align: center;
		}
		.mt20 {
			margin-top: 20px;
		}
		
	}
	
</style>
