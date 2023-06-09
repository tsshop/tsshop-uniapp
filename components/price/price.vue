<template>
	<view style="display: inline-block;">
		<view class="flex flex-y-end color-all bold">
			<view style="font-size: 22rpx;line-height: 29rpx;vertical-align: bottom;">¥</view>
			<view style="font-size: 32rpx;line-height: 32rpx;vertical-align: bottom;">{{xs(price,2,0)}}</view>
			<view style="font-size: 28rpx;line-height: 29rpx;vertical-align: bottom;">.{{xs(price,2,1)}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "price",
		props: {
			price: {
				type: [String, Number],
				default: '0',
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
