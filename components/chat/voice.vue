<template>
	<view style="flex:1;width: 100%;" @touchmove.stop.prevent="clear">
		<!-- 下方按钮 -->
		<view class="voice-box flex flex-x-y" :class="'voice-'+status" @touchcancel="touch_end"
			@touchstart="touch_satrt" @touchmove="touch_move" @touchend="touch_end">
			{{status == 0 ?'按住 说话':status == 1 ?'松开 发送':'松开 取消发送'}}
		</view>
		<!-- 下方按钮 -->

		<!-- 正常录音 -->
		<view v-if="status == 1" class="hd-box hd-box-1">
			<view class="hd-time a-show">{{get_time}}</view>
			<view class="iconfont icon-yuyin a-show" style="font-size: 100rpx;"></view>
			<view class="hd-text a-show">松开发送，上滑取消</view>
		</view>
		<!-- 正常录音 -->

		<!-- 取消录音 -->
		<view v-if="status == 2" class="hd-box hd-box-2 ">
			<view class="iconfont icon-chehui a-show"
				style="font-size: 100rpx;flex:1;line-height: 100rpx;transform: translateY(100rpx);"></view>
			<view class="hd-text a-show" style="">松开，取消发送</view>
		</view>
		<!-- 取消录音 -->
	</view>
</template>

<script>
	let envinfo = require('../../siteinfo');
	export default {
		name: 'voice',
		data() {
			return {
				status: 0, // 0 未开始  1已开始录音 2上滑到指定区域(取消)
				start_y: 0, //触摸开始的y
				toush_start_timer: null, //长按开始定时器
				voice_start_time: 0, //录音时间
				voice_start_timer: null, //每秒触发的录音长度
				h: 0, //设备高度

				max_vioce_time: 100, //最大录音长度
			}
		},
		computed: {
			get_time() {
				let str = '';
				if (this.voice_start_time == 0) {
					return '00:00';
				}
				let right = this.voice_start_time % 60;
				if (String(right).length == 1) {
					right = String('0') + String(right);
				}
				let left = parseInt(this.voice_start_time / 60);
				if (String(left).length == 1) {
					left = String('0') + String(left);
				}
				return left + ':' + right;


			},
		},
		created() {
			//获取设备高度
			uni.getSystemInfo({
				success: res => {
					this.h = res.screenHeight;
				}
			})
			this.init();
		},
		methods: {
			//初始化所以参数
			init() {
				this.status = 0;
				clearTimeout(this.toush_start_timer);
				this.voice_start_time = 0;
				clearInterval(this.voice_start_timer);
			},
			//长按开始
			touch_satrt() {
				// if (!this.aaaa) {
				// 	let res = uni.getAppAuthorizeSetting();
				// 	console.log('res', res);
				// 	if (!res.microphoneAuthorized || res.microphoneAuthorized == 'not determined' || res
				// 		.microphoneAuthorized == 'denied') {
				// 		if (res.microphoneAuthorized == 'denied') {
				// 			uni.openAppAuthorizeSetting();
				// 			this.showToast('请前往设置里允许杭州松助养老科技有限责任公司使用麦克风权限');
				// 		} else {
				// 			uni.getRecorderManager();
				// 		}
				// 		return;
				// 	} else {
				// 		this.aaaa = true;
				// 	}
				// }
				//500 毫秒后开始录音
				this.toush_start_timer = setTimeout(() => {
					this.status = 1;
					//开始录音
					this.luyin();
				}, 250);
			},
			touch_move(e) {
				//修改状态
				// console.log('e', this.h);
				// console.log('e.changedTouches[0].clientY',e.changedTouches[0].clientY);
				if (this.h && e.changedTouches && e.changedTouches[0] && this.status > 0) {
					// clientY
					if (this.h - e.changedTouches[0].clientY >= 230) {
						this.status = 2;
						// console.log('2');
					} else {
						this.status = 1;
						// console.log('1');
					}
				}
			},
			touch_end(e) {
				if (this.status == 2 || this.status == 0) {
					//录音取消 或者未开始录音
					this.init();
					return;
				}
				if (this.voice_start_time <= 0) {
					this.showToast('录音时间太短');
					this.init();
					return;
				}
				//上传录音
				if (this.song) {
					this.song.stop();
				}

			},
			//开始录音
			start_voice() {
				clearInterval(this.voice_start_timer);
				this.voice_start_time = 0;
				this.voice_start_timer = setInterval(() => {
					this.voice_start_time += 1;
				}, 1000);
			},
			luyin() {
				// #ifdef APP-PLUS || MP-WEIXIN
				if (!this.song) {
					this.song = uni.getRecorderManager({
						duration: 12000,
						format: 'mp3',
					});
					this.song.onStop((file) => {
						let time = this.voice_start_time; // 录音长度
						this.init();
						this.upload_voice(time, file.tempFilePath);
					});
					this.song.onStart(() => {
						this.start_voice();
					});
				}
				this.song.start();
				// #endif
			},
			upload_voice(time = 0, file) {
				//上传录音
				console.log('time', time);
				console.log('file', file);


				// uni.showLoading({
				// 	title: '上传图片中',
				// 	mask: true,
				// })
				let appUrl = '/upload/image';

				appUrl = envinfo.root + appUrl;


				uni.uploadFile({
					url: appUrl,
					filePath: file,
					data: {
						photo: 'file',
						name: 'file'
					},
					name: 'file',
					header: {
						token: uni.getStorageSync('ACCESS_TOKEN'),
					},
					success: img_data => {
						// uni.hideLoading();
						let data = JSON.parse(img_data.data);
						if (img_data.statusCode == 200 && img_data.errMsg == 'uploadFile:ok') {


							if (data.status == 200 && data.data && data.data) {
								this.$emit('send', {
									msg: `${data.data}[${time}]`,
								})

							}

						}

					}
				});



			},

		}
	}
</script>

<style lang="scss">
	.voice-box {
		min-height: 80rpx;
		background: #FFFFFF;
		height: 80rpx;
		flex: 1;
		display: flex;
		justify-content: center;
		align-content: center;
		font-size: 32rpx;
		line-height: 34rpx;
		border-radius: 20rpx;
	}

	.voice-0 {
		color: #323232;
		background: #FFFFFF;
	}

	.voice-1 {
		color:#FFFFFF;
		background: #6D9EFB;
	}

	.voice-2 {
		color: rgba(255, 255, 255, 0.45);
		background: rgba(248, 88, 66, 0.45);
	}

	.hd-box {
		position: fixed;
		z-index: 10;
		bottom: 230px;
		left: 50%;
		transform: translateX(-50%);
		width: 336rpx;
		height: 336rpx;
		border-radius: 16rpx;
		font-size: 26rpx;
		color: #FFFFFF;

		.hd-text {
			font-size: 26rpx;
			margin-bottom: 40rpx;
		}

		.hd-time {
			margin-top: 36rpx;
			font-size: 30rpx;
		}
	}

	.hd-box-1 {
		background: #6D9EFB;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

	}

	.hd-box-2 {
		background: #f85842;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.a-show {
		animation: show 0.3s;
	}

	@keyframes show {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
