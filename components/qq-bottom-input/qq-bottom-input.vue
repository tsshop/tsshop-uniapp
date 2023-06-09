<template>
	<view>
		<view v-if="show" @tap="close(true)"
			style="position: fixed;bottom: 0;background-color: rgba(0,0,0,0);left:0;z-index: 100;flex-direction: row;align-items: flex-end;"
			:style="{height:screenHeight,width:screenWidth}">
			<view :style="{transform: `translateY(-${getHeight()}px)`,width:screenWidth}" @touchstart.prevent="clear"
				style="padding: 20rpx 0 20rpx 20rpx;background-color: #FFFFFF;box-shadow: 0px 0px 12rpx 3rpx rgba(178,178,178,0.1);transition: all 0.2s;flex-direction: row;align-items: center;transition: transform 0.2s;">
				<textarea :auto-focus="true" :adjust-position="false" @keyboardheightchange="keyboardheightchange"
					v-model="text" placeholder="请输入" :auto-height="false" class="input-textarea color-333333 fs-28"
					placeholder-style="line-height:40rpx;">
				</textarea>



				<view @touchstart.prevent="send" style="padding: 0 20rpx;height: 70rpx;">
					<view
						style="width: 102rpx;height: 70rpx;border-radius: 20rpx;justify-content: center;align-items: center;background-color: #F87919;">
						<text class="fs-26 color-ffffff">发送</text>
					</view>
				</view>


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "qq-bottom-input",
		props: {
			roomId: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				show: false,
				config_old: {
					title: '请输入',
				},
				config: {
					title: '请输入',
				},
				height: 0,
				text: '',
				input_height: uni.getStorageSync('input-height') || 0,
				focus: false,
				screenHeight: getApp().globalData.screenHeight + 'px',
				screenWidth: getApp().globalData.screenWidth + 'px',
			};
		},
		created() {
			uni.$on('showBottomInput', (c) => {
				this.open(c);
			});
		},
		methods: {
			clear() {},
			send() {
				if (!String(this.text).trim()) {
					this.showToast('评论不能为空');
					return;
				}
				let text = String(this.text);
				// this.config.success && this.config.success(String(this.text));
				this.text = '';
				this.close();

				//发送
				getApp().globalData.CHAT.SEND({
					cmd: 605,
					message: {
						roomId: this.roomId,
						content: text,
					},
				});

			},
			getHeight() {
				if (this.height == 0) return 0;
				let safeHeight = getApp().globalData.safeArea || 0;
				let page = getCurrentPages();
				let route = "";
				// #ifdef H5
				return 0;
				// #endif
				if (page.length > 0) {
					let self = page[page.length - 1]
					//#ifdef MP-WEIXIN || APP-PLUS
					self = page[page.length - 1].$vm;
					//#endif
					route = self.route;

					//#ifdef APP-PLUS
					route = page[page.length - 1].route;
					//#endif
					console.log('route', route);
					if (route == 'pages/friend/friend') {
						return this.height - 60 - safeHeight;
					} else {
						return this.height;
					}
				}
				return this.height;

			},
			close() {
				this.show = false;
				this.focus = false;
				uni.hideKeyboard();
			},
			open(config) {
				this.config = {
					...this.config_old,
					...config,
				};
				this.show = true;
				setTimeout(() => {
					this.focus = true;
					if (this.input_height > 0) {
						this.height = this.input_height
					}

				}, 100);
			},
			keyboardheightchange(e) {
				let height = e.detail.height;
				if (height > 0) {
					this.input_height = height;
					this.height = height;
					uni.setStorageSync('input-height', height);
				} else {
					this.height = 0;
					this.show = false;

				}
			},
			showToast(title = "", duration = 2000, icon = "none") {

				// #ifdef APP-PLUS || APP-NVUE
				plus.nativeUI.toast(title);
				// #endif

				// #ifndef APP-PLUS || APP-NVUE
				uni.showToast({
					title,
					icon,
					duration
				})
				// #endif

			},
		},
	}
</script>

<style>
	.input-textarea {
		background-color: #f6f6f6;
		border-radius: 20rpx;
		flex: 1;
		padding: 16rpx 24rpx;
		height: 80rpx;
	}
</style>