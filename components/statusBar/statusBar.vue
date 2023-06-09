<template>
	<view :style="{height:statusBar}"></view>
</template>

<script>
	export default {
		name: "statusBar",
		data() {
			return {
				statusBar: getApp().globalData.statusBar + 'px',
			};
		}
	}
</script>

<style>

</style>