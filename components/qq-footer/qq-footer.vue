<template>
	<view>
		<block v-if="show && list_length > 0">
			<view v-if="text" style="line-height: 100rpx;text-align: center;" class="fs-30 color-999999">{{ text }}
			</view>
		</block>
		<block v-if="show && list_length == 0">
			<view class="flex flex-x-center flex-y flex-y-center">
				<image style="width: 676rpx;height:426rpx;margin: 0rpx auto 0 auto;margin-bottom: 40rpx;"
					:style="{'margin-top':top?top:'180rpx'}" src="../../static/images/null.png">
				</image>
				<view class="fs-29 color-333333" style="color: #666666;margin-top: -20rpx;">暂无数据~</view>
			</view>
			<view v-if="footer" style="line-height: 100rpx;text-align: center;" class="fs-30 color-999999">{{ footer }}
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: "qq-footer",
		data() {
			return {

			};
		},
		computed: {
			list_length() {
				return Object.keys(this.list).length;
			},
		},
		props: {
			show: {
				type: Boolean,
				default: false,
			},
			text: {
				type: String,
				default: '已加载全部',
			},
			list: {
				type: [Object, Array],
				default: () => []
			},
			top: {
				type: String,
				default: ''
			},
			footer: ''
		}
	}
</script>

<style lang="scss">

</style>
