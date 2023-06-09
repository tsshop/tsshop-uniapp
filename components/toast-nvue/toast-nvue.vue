<template>
	<view>
		<uni-popup ref="toast" type="center">
			<view style="width: 580rpx;background-color: #191621;border-radius: 20rpx;">
				<view style="padding-top: 60rpx;padding-bottom: 20rpx;">
					<text style="text-align: center;font-size: 34rpx;"
						class="color-ffffff fs-32">{{config.title}}</text>
				</view>

				<view class="flex flex-y fs-28 color-666666"
					style="text-align: left;line-height: 60rpx;padding-left: 50rpx;padding-right: 50rpx;">
					<view class="text" style="word-break: break-all;">
						<text class="fs-30 color-ffffff">{{config.desc}}</text>
					</view>
				</view>

				<slot name="center"></slot>

				<view style="padding-top:60rpx;padding-bottom: 53rpx;" v-if="showBtn">

					<view class="flex" style="justify-content: center;">
						<view v-if="config.left" @tap.stop="close_toast(false)" class="toast-cancle-btn">
							<text style="color: #FFFFFF;font-size: 28rpx;">{{config.left}}</text>
						</view>
						<view @tap.stop="close_toast(true)" class="toast-sure-btn">
							<text style="color: #FFFFFF;font-size: 28rpx;">{{config.right}}</text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "toastNvue",
		data() {
			return {



				old_config: {
					title: '提示',
					left: '取消', //左侧文本 不屑就隐藏
					right: '确定', //右侧文本
					success: null,
					fail: null,
					desc: '', //提示内容
				},
				config: {},
				show: false,
			};
		},
		props: {
			close: {
				type: Boolean,
				default: false,
			},
			showBtn: {
				type: Boolean,
				default: true,
			}
		},
		methods: {
			aa() {

			},
			open(config = {}) {

				this.config = {
					...this.old_config,
					...config
				};
				this.$refs.toast.open();
				// this.show = true;
			},
			close_toast(status) {
				console.log('status', status)
				this.$refs.toast.close();
				// this.show = false;
				if (status) {
					this.config.success?.();
				} else {
					this.config.fail?.();
				}
			}
		}
	}
</script>

<style lang="scss">
	.color-666666 {
		color: #666666;
	}

	.flex {
		display: flex;
		flex-direction: row;

	}

	.flex-x-y {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.flex-y {
		flex-direction: column;
	}

	.fixed-box {
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 999999;
	}
	
	.toast-cancle-btn {
		height: 70rpx;
		width: 212rpx;
		justify-content: center;
		align-items: center;
		background-color: #D14636;
		border-radius: 10rpx;
		transition: background-color 0.3s;
		margin-right: 35rpx;
	}
	.toast-cancle-btn:active {
		background-color: rgba(209,70,54, 0.9);
	}

	.toast-sure-btn {
		height: 70rpx;
		width: 212rpx;
		justify-content: center;
		align-items: center;
		background-color: #F8791A;
		border-radius: 10rpx;
		transition: background-color 0.3s;
	}

	.toast-sure-btn:active {
		background-color: rgba(248, 121, 26, 0.9);
	}
</style>