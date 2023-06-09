<template>
	<view>
		<custom fixed="fixed" mode="2" :title="protocal_info.privacyTitle"></custom>
		<view>
			<view class="w-688 ml-31 text fs-28 color-333333"
				style="line-height: 50rpx;padding-top: 20rpx;padding-bottom: 100rpx;white-space: pre-line;">
				<rich-text :nodes="protocal_info.privacyAgreement"></rich-text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0
			}
		},
		onLoad(option) {
			console.log(option)
			this.type = option.type
			console.log('protocal_info', this.protocal_info);
		},
		methods: {

		}
	}
</script>

<style>

</style>
