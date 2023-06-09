<template>
	<view style="display: inline-block;">
		<view :style="get_style" style="display: inline-block;" class="iconfont" :class="iClass + ' ' + icon">

		</view>
	</view>
</template>

<script>
	export default {
		name: "qq-icon",
		props: {
			iClass: {
				type: String,
				default: '',
			},
			color: {
				type: String,
				default: '#AFBAB8',
			},
			icon: {
				type: String,
				default: ''
			},
			size: {
				type: String,
				default: '30rpx'
			},
			iStyle: {
				type: Object,
				default: () => {},
			},
		},
		computed: {
			get_style() {
				let obj = {
					color: this.color,
					fontSize: this.size,
					...this.iStyle
				}
				let str = ''
				for (let key in obj) {
					str += key;
					str += (':') + obj[key];
					str += ';';
				}
			
				return str;
			}
		},
		data() {
			return {

			};
		},

	}
</script>

<style>

</style>
