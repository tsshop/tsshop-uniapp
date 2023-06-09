<template>
	<view>
		<view class="live-detail-box" :style="{height:screenHeight+'px',width:screenWidth + 'px'}">
			<view :style="{height:statusbar + 'px'}"></view>
			<view style="margin-top: 30rpx;padding-left: 34rpx;">
				<view style="width: 50rpx;height: 50rpx;align-items: center;justify-content: center;">
					<image @tap.stop="to_back" :src="leftImg" mode="aspectFill" style="width: 28rpx;height: 28rpx;">
					</image>
				</view>
			</view>



			<view style="margin-top: 112rpx;">
				<view style="align-items: center;">
					<view>
						<text class="fs-40 color-ffffff">直播已结束</text>
					</view>

					<qq-image imageStyle="width:120rpx;height:120rpx;border-radius:60rpx;margin-top:90rpx;"
						:url="liveData.userAvatarUrl"></qq-image>

					<view>
						<text class="mt-10 color-ffffff fs-28">{{liveData.userName || ''}}</text>
					</view>


				</view>
			</view>


		</view>
	</view>
</template>

<script>
	import leftImg from '@/static/nvue/cuo.png';
	import rightImg from '@/static/nvue/right.png';
	export default {
		name: 'live-end',
		data() {
			return {
				leftImg,
				rightImg,
				statusbar: getApp().globalData.statusBar,
				screenHeight: getApp().globalData.screenHeight,
				screenWidth: getApp().globalData.screenWidth,
				show: true,
				liveData: {},
			}
		},
		methods: {
			to_back() {
				uni.navigateBack({
					delta: 1,
				})
			}
		},
		created() {
			this.liveData = getApp().globalData.liveData || {};
		}
	}
</script>

<style>
	.live-detail-box {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.79);
		/* background-color: red; */
	}
</style>
