<template>
	<view class="fs-26" @tap.stop="sendRegistCode" style="display: inline-block;" :style="{color:color}">
		{{time}}
	</view>
</template>

<script>
	export default {
		name: "verify",
		props: {
			phone: {
				type: [String, Number],
				default: ''
			},
			url: {
				type: String,
				default: '/login/getCode',
			},
			sendKey: {
				type: String,
				default: 'phone'
			},
			sendMethod: {
				type: String,
				default: 'POST'
			},
			sendOther: {
				type: Object,
				defalt: () => ({})
			},
			check: {
				type: Boolean,
				default: true,
			},
			color: {
				type:String,
				default:''
			}
		},
		data() {
			return {
				time: '获取验证码',
			};
		},
		methods: {
			sendRegistCode() {

				if (this.time != '获取验证码') {
					this.showToast('请稍等');
					return;
				}

				this.less(() => {


					let that = this;
					console.log(that.phone, "111")
					var reg =
						/^1[3456789]\d{9}$/; //11位手机号码正则
					if (that.phone.length == 0) {
						this.showToast('请输入手机号');
					} else if (reg.test(that.phone) == true || this.check == false) {
						// let currentTime = that.currentTime;
						let interval;
						let data = {
							...this.sendOther,
						};
						data[this.sendKey] = this.phone;
						this.request({
							url: this.url,
							data: data,
							method: this.sendMethod,
							loading: true,
						}).then(res => {
							if (res.status == 200) {
								this.showToast('验证码已发送', 3000);
								clearInterval(this.timer_verify);
								let time = 59;
								this.time = time + 's后重新获取';
								this.timer_verify = setInterval(() => {
									if (time == 1) {
										clearInterval(this.timer_verify);
										this.time = '获取验证码';
										return;
									}
									time--;
									this.time = time + 's后重新获取';


								}, 1000);

							}
						})
					} else {
						this.showToast('请输入正确的手机号');
					}


				})

			},
		}
	}
</script>

<style>

</style>
