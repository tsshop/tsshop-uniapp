<template>
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="bg-FFFFFF" style="border-radius: 20rpx 20rpx 0 0;">
				<view v-if="config.title" style="padding: 42rpx 40rpx;">
					<view class="fs-26 color-666666" style="white-space: pre-line;text-align: center;">{{config.title}}</view>
					<!-- <view >{{config.content}}</view> -->
				</view>
				<view v-if="config.title" class="" style="width: 750rpx;height: 2rpx;background: #F0F0F0;"></view>
				<view class="fs-30 color-333333">
					<view v-for="(item, index) in config.list" :key="index" @tap.stop="close_toast(true, index)" class="blod" style="text-align: center;border-bottom: 2rpx solid #F0F0F0;padding: 20rpx 0;" :style="{color: item.color}">
						{{item.name}}
					</view>
				</view>
				<view class="" style="width: 750rpx;height: 5rpx;background: #F0F0F0;"></view>
				<view class="fs-30 color-333333" style="padding: 30rpx 40rpx;text-align: center;color:red" @tap.stop="close_toast(false)">{{config.cancel}}</view>
				<view :style="{height: safeArea}">
					
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"action-confirm",
		data() {
			return {
				safeArea: getApp().globalData.safeArea + 'px',
				old_config: {
					title: '',
					cancel: '取消', //左侧文本 不屑就隐藏
					list:[],
					success: null,
					fail: null,
					desc: '', //提示内容
					rightColor: '#FD7747',
					leftColor: '#1F1F1F',
				},
				config: {},
			};
		},
		methods: {
			open(config = {}) {
			
				this.config = {
					...this.old_config,
					...config
				};
				this.$refs.popup.open();
			},
			close_toast(status, index) {
				this.$refs.popup.close();
				if (status) {
					this.config.success?.(index);
				} else {
					this.config.fail?.();
				}
			},
			// handle(item) {
				
			// }
		}
	}
</script>

<style lang="scss">

</style>