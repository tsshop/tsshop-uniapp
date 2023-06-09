<template>
	<view class="flex flex-wrap">
		<view @tap.stop="change(index)" v-for="(item,index) in arr" :key="index" class="flex flex-x-y radio-item">
			<qq-icon :color="color" v-if="value == item.id" icon="icon-xuanzhong"></qq-icon>
			<qq-icon :color="defaultColor" v-else icon="icon-weixuanzhong"></qq-icon>
			<view class="ml-10">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "qq-radio",
		props: {
			arr: {
				type: Array,
				default: () => []
			},
			value: {
				type: [String, Number],
				default: '',
			},
			color: {
				type: String,
				default: '#46D9C5'
			},
			defaultColor: {
				type: String,
				default: '#D8D8D8'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			change(index) {
				this.$emit('input', this.arr[index].id);
			}
		}
	}
</script>

<style lang="scss">
	.radio-item+.radio-item {
		margin-left: 70rpx;
	}
</style>
