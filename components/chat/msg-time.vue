<template>
	<view class="flex flex-x-y" style="margin-top: 32rpx;">
		<view class="time-content" style="color: #999999;">{{info.content}}</view>
	</view>
</template>

<script>
	export default {
		name: "msgText",
		props: {
			info: {
				type: Object,
				default: () => {},
			}
		},
		data() {
			return {

			};
		},
		watch: {


		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.time-content {
		font-size: 22rpx;
		color: #646464;
		line-height: 32rpx;
		padding: 0 12rpx;
		background-color: #FFFFFF;
		border-radius: 4rpx;
	}
</style>
