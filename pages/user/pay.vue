<template>
	<view>
		<custom backColor="#FFFFFF" background="rgba(0,0,0,0)"></custom>
		<view class="body">

			<view class="title">
				设置支付密码
			</view>
			<view style="height: 40rpx;"></view>
			<form class="form">
				<view class="loginModule">
					<view class="loginkey">手机号</view>
					<view class="separation"></view>
					<input name='phone' v-model="phoneNum" placeholder="输入手机号码" class="input"
						placeholder-class="placeholderClass" disabled :adjust-position="false" />
					<!-- <view class="more">获得验证码</view> -->
				</view>

				<view class="loginModule">
					<view class="loginkey" style="width: 150rpx;white-space: nowrap;">图片验证码</view>
					<view class="separation"></view>
					<input class="input" name='code' v-model="imgcode" placeholder="输入图片验证码"
						placeholder-class="placeholderClass" :adjust-position="false" />
					<image @tap="get_code" :src="img" mode="" style="width: 200rpx;height: 80rpx;"></image>
					<!-- <view @tap="get_code" :style="{'background':'url('+img+') left top / 100% 100% no-repeat'}" mode="" style="width: 200rpx;height: 80rpx;"></view> -->
				</view>

				<view class="loginModule">
					<view class="loginkey">验证码</view>
					<view class="separation"></view>
					<input class="input" name='code' v-model="verify" type="number" placeholder="输入验证码"
						placeholder-class="placeholderClass" :adjust-position="false" />
					<view class="more color-blue" @click="sendRegistCode">{{time}}</view>
				</view>

				<view class="loginModule">
					<view class="loginkey">密码</view>
					<view class="separation"></view>
					<input name='phone' type="number" :maxlength="6" v-model="password" placeholder="输入密码" class="input"
						placeholder-class="placeholderClass" :adjust-position="false" />
					<!-- <view class="more">获得验证码</view> -->
				</view>

				<button @tap="logIn" class="login bg-FFFFFF" :class="get_pass()?'':'hui'">确定</button>
			</form>





		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				currentTime: 60,
				time: "发送验证码",
				disabled: "",
				phoneNum: "",
				verify: '',
				password: '',

				img: "", //验证码图片
				uuid: '',
				imgcode: '',
			};
		},
		mounted() {
			if (this.user_info && this.user_info.phone) {
				this.phoneNum = this.user_info.phone;
			}
		},
		onLoad() {
			this.get_code();
		},
		methods: {
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
			//value为1为选中协议
			radioChange: function(e) {
				console.log(e)
				this.value = 1 + '';
			},
			//验证手机号码
			inputPhone: function(e) {
				console.log(e)
				this.phoneNum = e.detail.value
				if (!(/^1[3456789]\d{9}$/.test(this
						.phoneNum))) {
					if (this.phoneNum.length >= 11) {
						uni.showToast({
							title: '手机号有误',
							icon: 'none',
							duration: 2000
						})
					}
				}

				console.log(this.phoneNum, typeof(this.phoneNum))
			},

			//获取验证码
			sendRegistCode: function(e) {

				if (this.imgcode == '') {
					this.showToast('请输入图片验证码');
					return;
				}

				if (this.time != '发送验证码') {
					this.showToast('请稍等');
					return;
				}

				this.less(() => {


					let that = this;
					console.log(that.phoneNum, "111")
					var reg =
						/^1[3456789]\d{9}$/; //11位手机号码正则
					if (that.phoneNum.length == 0) {
						uni.showToast({
							title: '请输入手机号',
							icon: "none"
						})
					} else if (reg.test(that.phoneNum) == true) {
						// let currentTime = that.currentTime;
						let interval;
						this.request({
							url: '/wechatLogin/getCode',
							data: {
								phone: this.phoneNum,
								uuid: this.uuid,
								code: this.imgcode
							},
							loading: true,
						}).then(res => {
							if (res.status == 200) {
								this.showToast('验证码已发送，请注意查收', 3000);
								that.time = that.currentTime + 's后重新获取';
								that.disabled = true;
								interval = setInterval(function() {
									that.time = that.currentTime - 1 + 's后重新获取';
									that.currentTime--;
									if (that.currentTime <= 0) {
										clearInterval(interval)
										that.time = '发送验证码',
											that.currentTime = 60,
											that.disabled = false
									}
								}, 1000)
							}
						})
					} else {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: "none"
						})
					}


				})
			},

			//密码登录
			logIn: function(e) {

				let that = this;


				if (this.phoneNum == "") {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
					})
					return;
				}
				if (this.verify == "") {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
					})
					return;
				}


				if (this.password == "") {
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
					})
					return;
				}

				if (this.password.length != 6) {
					uni.showToast({
						title: '密码为六位数字',
						icon: 'none',
					})
					return;
				}



				this.less(() => {
					this.request({
						url: '/wjuser/user/updatePayPassword',
						method: 'PUT',
						data: {
							code: this.verify,
							id: this.user_info.id,
							payPassword: this.password,
							// conformPassword: this.password,
							// newPassword: this.password,
							// phone: this.phoneNum
						},
						loading: true,
					}).then(res => {
						if (res.status == 200) {
							this.showToast('修改成功');

							setTimeout(() => {
								this.uniBack();
							}, 500);
						} else {
							this.get_code();
						}
					});
				})


			},

			close_toast() {
				this.$refs.popup.close();
			},
			open_toast() {
				this.$refs.popup.open();
			},
			get_pass() {

				if (!(/^1[3456789]\d{9}$/.test(this
						.phoneNum))) {
					return false;
				}
				if (this.verify == "") {
					return false;
				}
				if (this.password == "") {
					return false;
				}
				return true;
			},

		}
	}
</script>

<style lang="scss">
	page {
		background: #191a1b url(../../static/erqi/logo-bg2.png) left top / 100% 100% no-repeat;
		overflow-y: hidden;
		height: 100vh;

	}

	.body {
		padding: 140rpx 40rpx;
		box-sizing: border-box;



		.title {
			font-size: 48rpx;
			font-weight: 500;
			color: #ffffff;
			line-height: 66rpx;
		}

		.subhead {
			margin-top: 20rpx;
			font-size: 28rpx;
			font-weight: 400;
			// text-align: right;
			color: #EBD448;
			line-height: 28rpx;
			margin-bottom: 14rpx;
		}

		.loginModule {
			display: flex;
			border-bottom: 2rpx solid #eeeeee;
			align-items: center;
			padding-bottom: 18rpx;
			margin-top: 52rpx;

			.loginkey {
				width: 90rpx;
				height: 42rpx;
				font-size: 30rpx;
				font-weight: 400;
				text-align: left;
				color: #ffffff;
				line-height: 42rpx;
			}

			.separation {
				// width: 1px;
				height: 16rpx;
				width: 2rpx;
				background-color: #a9a9a9;
				margin: 0 18rpx;
			}

			input {
				flex: 1;
				color: #fff;
			}

			.placeholderClass {
				color: #999990;
			}

			.more {
				font-size: 30rpx;
				font-weight: 400;
				text-align: left;
		
				line-height: 42rpx;
			}
		}

		.agreement {
			display: flex;
			align-items: center;
			margin-top: 64rpx;

			image {
				width: 26rpx;
				height: 26rpx;
				background: #ffffff;
				margin-right: 8rpx;
			}

			.agreementview {
				font-size: 26rpx;
				font-weight: 400;
				text-align: center;
				color: #888888;
				line-height: 36rpx;

				.color {
					color: #ebd448;
				}
			}

		}

		.login {
			height: 96rpx;
	
			border-radius: 44rpx;
			text-align: center;
			line-height: 96rpx;
			font-size: 36rpx;
			font-weight: 500;
			text-align: center;
			color: #333333;
			margin-top: 40rpx;
		}

		.mode {
			margin-top: 44rpx;
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;
			font-weight: 400;
			text-align: center;
			color: #999999;
			line-height: 36rpx;
		}
	}

	.hui {
		opacity: 0.6;
	}
</style>
