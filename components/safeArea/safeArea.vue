<template>
	<view :style="{height:safeArea}">

	</view>
</template>

<script>
	export default {
		name: "safeArea",
		data() {
			return {
				safeArea: getApp().globalData.safeArea + 'px',
			};
		}
	}
</script>

<style>

</style>