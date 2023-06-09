<template>
	<view>
		<custom title="设置密码" background="rgba(0,0,0,0)"></custom>




		<view class="flex bg-FFFFFF">
			<view class="flex-1 ml-20">
				<view class="input-box">
					<view class="input-title">手机号</view>
					<input class="font" placeholder-class="font" v-model="phoneNum" disabled=""
						placeholder="请填写你的手机号" />
				</view>
				

				<view class="input-box">
					<view class="input-title">验证码</view>
					<input class="font" type="number" v-model="verify" placeholder-class="font" placeholder="请输入验证码" />
					<view class="fs-30 color">
						<verify sendMethod="GET" :phone="phoneNum"></verify>
					</view>
				</view>
				
				<view class="input-box">
					<view class="input-title">密码</view>
					<input class="font" v-model="password" type="safe-password" placeholder-class="font" placeholder="请输入密码" />
				</view>
			</view>
		</view>
		
		<view style="margin-top: 104rpx;" class="flex felx-x-y">
			<view @tap.stop="logIn" :class="get_pass()?'':'hui'"
				class="ml-20 mr-20 flex flex-x-y fs-32 bg-all color-ffffff"
				style="height: 80rpx;flex:1;border-radius: 40rpx;transition: all 0.5s;">确认</view>
		</view>


		

		<toast ref="toast"></toast>


	</view>

</template>

<script>
	export default {
		data() {
			return {

				currentTime: 60,
				time: "获取验证码",
				disabled: "",
				phoneNum: "",
				verify: '',
				password: '',
				password2: '',

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
			// this.get_code();
		},
		methods: {
			get_code() {
				return;
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

			//密码登录
			logIn(e) {

				let that = this;


				if (this.phoneNum == "") {
					this.showToast('请输入手机号');
					return;
				}
				if (this.password == "") {
					this.showToast('请输入密码');
					return;
				}
				if (this.verify == "") {
					this.showToast('请输入验证码');
					return;
				}



				// const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
				const regPwd = /^[0-9A-Za-z]{6,20}$/;
				let regPwdRes = regPwd.test(this.password);
				if (!regPwdRes) {
					this.showToast('密码格式为6~20位数字和字母组合');
					return;
				}
				// if (this.password != this.password2) {
				// 	this.showToast('两次密码不一致');
				// 	return;
				// }


				this.less(() => {
					this.request({
						url: '/user/updatePassword',
						method: 'POST',
						data: {
							code: this.verify,
							password: this.password,
							phone: this.phoneNum
						},
						loading: true,
					}).then(res => {
						if (res.status == 200) {
							this.$refs.toast.open({
								desc: '修改成功',
								left: '',
								success: () => {
									this.uniBack();
								}
							});

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

		background-color: $pageColor;
	}

	.input-box {
		height: 88rpx;
		border-bottom: 1rpx solid #EEEEEE;
		display: flex;
		align-items: center;
		color: #3B4644;
		font-size: 30rpx;
		padding-right: 40rpx;
	}

	.input-box .input-title {
		width: 170rpx;
		white-space: nowrap;
	}

	.input-box .input-title.require::after {
		content: '*';
		color: #FA4A4A;
	}

	.input-box input {
		line-height: 80rpx;
		height: 80rpx;
		flex: 1;
		font-size: 30rpx;
	}

	.hui {
		opacity: 0.6;
	}
</style>
