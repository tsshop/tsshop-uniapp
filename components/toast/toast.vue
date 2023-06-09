<template>
	<view>
		<uni-popup ref="toast" type="center" :maskClick="close">
			<view style="width: 572rpx;background-color: #FFFFFF;border-radius: 16rpx;">
				<view
					style="padding-top: 46rpx;text-align: center;font-size: 30rpx;padding-bottom: 20rpx;color: #1F1F1F;">
					{{config.title}}
				</view>

				<view class="flex flex-y fs-28" style="line-height: 60rpx;padding-left: 50rpx;padding-right: 50rpx;">
					<view class="center" style="word-break: break-all;color:#1F1F1F;max-height: 700rpx;overflow-y: scroll;">
						{{config.desc}}
					</view>

				</view>

				<slot name="center"></slot>

				<view style="padding-top:38rpx" v-if="showBtn">
					<view style="height: 0.5px;background-color: #EEEEEE;"></view>
					<view class="flex">
						<view v-if="config.left" @click="close_toast(false)"
							style="height: 100rpx;border-right: 0.5px solid #EEEEEE;" class="flex-1 flex flex-x-y fs-30"
							:style="{color:config.leftColor}">
							{{config.left}}
						</view>
						<view @click="close_toast(true)" style="height: 100rpx;"
							class="flex-1 flex flex-x-y fs-30" :style="{color:config.rightColor}">
							{{config.right}}
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "toast",
		data() {
			return {
				old_config: {
					title: '提示',
					left: '取消', //左侧文本 不屑就隐藏
					right: '确定', //右侧文本
					success: null,
					fail: null,
					desc: '', //提示内容
					rightColor: '#FF882F',
					leftColor: '#1F1F1F',
				},
				config: {},
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

			open(config = {}) {

				this.config = {
					...this.old_config,
					...config
				};
				this.$refs.toast.open();
			},
			close_toast(status) {
				this.$refs.toast.close();
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

</style>
