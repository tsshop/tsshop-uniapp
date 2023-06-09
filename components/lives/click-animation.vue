<template>
	<view :style="{transform:transform}" style="transition: transform 0.3s" @tap="clickItem">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'click-animation',
		data() {
			return {
				transform: 'scale(1)',
			}
		},
		methods: {
			clickItem() {
				this.$emit('click');
				this.transform = 'scale(0.9)';
				clearTimeout(this.clearTransform);
				this.clearTransform = setTimeout(() => {
					this.transform = 'scale(1)';
				}, 320);
			}
		}
	}
</script>

<style>
</style>