<template>
	<view class="flex flex-y-start" :class="!info.mine?'msg-left':'msg-right'" style="padding:32rpx 28rpx 0 28rpx;"
		:style="info.mine?'flex-direction: row-reverse;':''">
		<!-- 头像 -->
		<view class="msg-image-box" @tap.stop="to_detail">
			<!-- <image :lazy-load="true" :src="info.avatarUrl" mode="aspectFill"></image> -->
			<qq-image :url="info.avatarUrl" class="avatar-image"></qq-image>
		</view>
		<!-- 头像 -->
		<!-- 内容 -->
		<view style="max-width: 452rpx;">
			<view v-if="!info.mine && chatType!='one'" @tap.stop="to_detail" class="msg-nickname">
				{{remark_obj[info.id] || remark_obj[info.fromid] || info.name}}
			</view>
			<view class="msg-content pr" style="display: inline-block;">
				<view style="display: inline-block;transition: color 0.5s;"
					:style="voice_src == src?'color:#D93025;':''" @tap.stop="to_play">
					<text v-if="info.mine" style="display: inline-block;" :style="{'padding-right':width+'rpx'}"></text>
					<text class="iconfont icon-shengbo" style="font-size: 28rpx;"></text>
					<view style="display: inline-block;"></view>
					<text style="margin-left: 20rpx;">{{time}}″</text>
					<text v-if="!info.mine" :style="{'padding-right':width+'rpx'}"></text>
				</view>
			</view>
		</view>
		<!-- 内容 -->
	</view>
</template>

<script>
	export default {
		name: "msgVoice",
		props: {
			info: {
				type: Object,
				default: () => {},
			},
			chatType: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				time: '0',
				width: 0,
				src: '',
			};
		},
		computed: {
			voice_src() {
				return this.$store.state.voice_src;
			}
		},
		watch: {
			info() {
				this.set_style();
			}
		},
		created() {
			this.set_style();
		},
		methods: {
			to_play() {

				if (!getApp().globalData.voice) {
					getApp().globalData.voice = uni.createInnerAudioContext();
					getApp().globalData.voice.sessionCategory = 'ambient';

					getApp().globalData.voice.onEnded(() => {
						this.vuexSet('voice_src', '');
					});
				}
				if (getApp().globalData.voice.src != this.src) {
					//如果不是当前
					getApp().globalData.voice.src = this.src;
					getApp().globalData.voice.play();
					this.vuexSet('voice_src', this.src);
				} else {
					if (getApp().globalData.voice.paused == false) {
						//如果正在播放
						getApp().globalData.voice.pause();
						this.vuexSet('voice_src', '');

					} else {
						//如果已经暂停
						getApp().globalData.voice.play();
						this.vuexSet('voice_src', this.src);
					}

				}



			},
			set_style() {

				if (this.info.content) {
					let regex = /\[(.+?)\]/g;
					let str_arr = String(this.info.content).match(regex);
					console.log('str_arr', str_arr);
					str_arr.forEach((val, index) => {

						if (index == 0) {
							let time = this.xs(String(val).substr(1, val.length - 2), -1);
							this.time = time;
							let width = (time - 2) * 10;
							if (width > 120) {
								width = 120;
							}
							if (width < 0) {
								width = 0;
							}
							this.width = width;
						}
						if (index == 0) {
							let src = String(this.info.content).substr(0, this.info.content.indexOf('['));
							this.src = src;

						}
					})
				}

			},
			to_detail() {
				return;
				if (this.info.mine) {
					this.toPage('/pages/chat/user?mine=true');
				} else {
					this.$emit('show', this.info);
				}
			},
		}
	}
</script>

<style lang="scss">
	.msg-image-box {
		width: 68rpx;
		height: 68rpx;
		border-radius: 16rpx;
		// background-color: rgba(255, 255, 255, 0.65);
		overflow: hidden;

		.avatar-image {
			width: 100%;
			height: 100%;
		}
	}

	.msg-nickname {
		margin-bottom: 20rpx;
		font-size: 26rpx;
		color: #323232;
		line-height: 28rpx;
	}

	.msg-content {
		background-color: #FFFFFF;
		padding: 18rpx 14rpx 18rpx 22rpx;
		text-align: justify;
		font-size: 28rpx;
		color: #333;
		white-space: pre-line;
		word-break: break-all;
	}

	.msg-left {
		.msg-image-box {
			margin-right: 20rpx;
		}

		.msg-content {
			border-radius: 8rpx 16rpx 16rpx 16rpx;
		}


	}

	.msg-right {
		.msg-image-box {
			margin-left: 20rpx;
		}

		.msg-content {
			border-radius: 16rpx 8rpx 16rpx 16rpx;
			background-color: #6D9EFB;
			padding: 18rpx 14rpx 18rpx 22rpx;
			text-align: right;
			color:#FFFFFF;
		}


	}
</style>
