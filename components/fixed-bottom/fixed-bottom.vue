<template>
	<view>
		<view :style="{height}">

		</view>
		<view :style="{height:safeArea}"></view>

		<view class="fixed-bottom-box" :style="bStyle + 'bottom:'+bottom+';'">
			<view>
				<slot></slot>
			</view>
			<view :style="{height:safeArea}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "fixed-bottom",
		props: {
			height: {
				type: String,
				default: '0'
			},


			bStyle: {
				type: [String, Object],
				default: ''
			},
			bottom: {
				type: [String,Number],
				default: '0',
			}
		},
		data() {
			return {
				safeArea: getApp().globalData.safeArea + 'px',
			};
		},
		created() {

		},
	}
</script>

<style>
	.fixed-bottom-box {
		position: fixed;
		width: 100vw;
		bottom: 0;
	}
</style>
