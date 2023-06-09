<template>
	<view class="flex flex-x-y">
		<view class="goods-title-bar"></view>
		<view class="goods-title-bar"></view>
		<view class="goods-title-text">{{title}}</view>
		<view class="goods-title-bar"></view>
		<view class="goods-title-bar"></view>
	</view>
</template>

<script>
	export default {
		name: "goods-title",
		props: {
			title: {
				type: String,
				default: '你可能喜欢'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.goods-title-text {
		font-size: 36rpx;
		color: #646464;
		padding: 0 38rpx;
	}

	.goods-title-bar {
		width: 8rpx;
		height: 28rpx;
		background-color: $bgColor;
		border-radius: 5rpx;
		transform: rotate(45deg);
		margin: 0 6rpx;
	}
</style>
