<template>
	<view style="position: fixed;bottom: 0;right: 0;z-index: 4;" v-if="user_info.isShop == 1">
		<view class="flex flex-y" style="margin-right: 24rpx" :style="{'marginBottom':bottom}">
			<image @tap.stop="to_add" src="../../static/zhoudao/fabu.png" mode="" class="add-avit-btn"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "add-active",
		props: {
			//来自某个页面
			from: {
				type: String,
				default: '',
			},
			bottom: {
				type: String,
				default: '240rpx',
			}
		},
		data() {
			return {

			};
		},
		methods: {
			to_add() {
				this.toPage('/pages/store/add-active', '', true);
			},
		}
	}
</script>

<style>
	.add-avit-btn {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}
</style>
