<template>
	<view style="width: 100%;">

		<scroll-view class="bbb" @scroll="scroll_change" :scroll-x="true" style="width: 100%;">
			<view class="flex" style="width: atuo;">
				<view v-for="(item,index) in list" :key="index" class="cats-item flex flex-y flex-x-y"
				@tap.stop="toPage('/pages/search/search?typeId='+item.id)"	>
					<image
						:src="item.avatar"
						style="width: 80rpx;height: 80rpx; border-radius: 10rpx;" mode="aspectFill"></image>
					<view class="cats-text nowrap">{{item.name}}</view>
				</view>

			</view>
		</scroll-view>

		<view class="flex flex-x-center" v-if="cha>0">
			<view class="scroll-bar-box pr">
				<view class="scroll-bar-line" :style="{left:get_left}">

				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "cats",
		props: {

		},
		computed: {
			get_left() {
				// console.log(this.cha, this.scrollTop);
				if (this.scrollTop <= 0) {
					return 0;
				} else {
					return this.scrollTop / this.cha * 50 + '%';
				}
			}
		},
		data() {
			return {
				list: [
					
				],
				cha: 0,
				scrollTop: 0,
			};
		},
		mounted() {

			this.get_list();

		},
		methods: {
			to_detail(index) {
				this.toPage('/pages/search/search?index=' + (index + 1));
			},
			scroll_change(e) {

				this.scrollTop = e.detail.scrollLeft;
			},
			get_list() {
				this.request({
					url:'/goods/getType',
					
				}).then(res => {
					if(res.status != 200) return
					this.list = res.data
					this.init_()
				}) 
			},
			to_category(index) {
				this.toPage('/pages/category/category?index='+index,'4')
			},
			init_() {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.bbb').fields({
						size: true
					});
					query.select('.cats-item').fields({
						size: true
					});
					query.exec((data) => {
						// console.log(data);
						if (this.list.length > 0 && data.length == 2) {
							this.cha = (this.list.length * 2 - 1) * uni.upx2px(32) + this.list.length *
								data[1].width - data[0].width;
						}
					});
				});


			},
		}
	}
</script>

<style lang="scss">
	.cats-item {
		margin: 0 32rpx;

		.cats-text {
			font-size: 28rpx;
			color: #323232;
			line-height: 30rpx;
			margin-top: 20rpx;
		}
	}

	.scroll-bar-box {
		width: 64rpx;
		height: 8rpx;
		border-radius: 4rpx;
		background-color: #D8D8D8;
		margin-top: 14rpx;
		overflow: hidden;
	}

	.scroll-bar-line {
		width: 50%;
		height: 8rpx;
		border-radius: 4rpx;
		background-color: #FFFFFF;
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
