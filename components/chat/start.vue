<template>
	<view :class="startClass" :start="start"></view>
</template>

<script>
	export default {
		name: 'startClass',
		data() {
			return {

			}
		},
		props: {
			startClass: {
				type: String,
				default: '',
			},
			start: {
				type: String,
				default: '',
			}
		},
		mounted() {
			if (this.start && this.start == this.startClass) {

				uni.pageScrollTo({
					duration: 0,
					selector: '.' + this.startClass,
				});

			}
		}
	}
</script>

<style>
</style>
