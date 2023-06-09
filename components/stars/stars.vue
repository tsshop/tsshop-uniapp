<template>
	<view class="flex">
		<view :key="index" v-for="(i, index) in len" @tap.stop="starNum(index)" class="iconfont icon-wujiaoxing- stars"
			:style="{'color': index <= value? '#FF882F':'#DFDFDF'}">
		</view>
	</view>
</template>

<script>
	export default {
		name: "stars",
		data() {
			return {
				
			};
		},
		props: {
			value: {
				default:1,
				type: [String, Number] 
			},
			len: {
				default:5,
				type:  Number 
			},
			disabled:  {
				default:false,
				type:  Boolean 
			},
		},
		methods: {
			starNum(index) {
				if(this.disabled) return
				console.log(index)
				this.$emit('input', index )

			},
		}
	}
</script>

<style>
	.stars {
		font-size: 20rpx;
		padding: 0 8rpx;
		color: #dfdfdf;
	}
</style>
