<template>
	<view>
		<view class="flex flex-x-b" :style="{'margin-top':marginT}">
			<view v-for="(arr,arr_index) in old_list" :key="arr_index" style="width: 50%;" :style="{marginLeft: arr_index ==1? '20rpx':'0'}">
				<view @tap="to_buy(item)" v-for="(item,index) in arr" :key="index">
					<view class="list-item" :style="{height:item.height}" :class="(arr_index == 0 ? 'aa':'bb')">
						<image :lazy-load="true" :src="item.headPortrait" mode="aspectFill" class="goods-img"></image>
				
						<view style="padding:18rpx 20rpx;">
							<view class="fs-26 over-line2 color-323232"
								style="line-height: 36rpx;word-break: break-all;">
								{{item.name || ''}}
							</view>
							
							<template >
								<view class="flex flex-y-end mt-14" >
									<view class="flex-1 flex flex-y-end">
										<price :price="item.price"></price>
									</view>
									<view class="fuku-people fs-20" style="transform: translateY(10rpx);">
										<text class="">{{item.purchaseQuantity || '0'}}</text>
										人付款
									</view>
								</view>
							</template>
						</view>
						
						
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "list",
		props: {
			list: {
				type: Array,
				default: () => []
			},
			marginT: {
				type: String,
				default: '22rpx',
			},
			height: {
				type: Number,
				default: 460
			},
			mode: {
				type: [String, Number],
				default: 1 //1商品  2 换购  3 云仓
			}
		},
		watch: {
			list: {
				handler(newV, oldV = []) {
					// console.log('newV', newV.length);
					// console.log('oldV', this.old_list_length);

					if (newV.length == 0) {
						this.old_list = [
							[],
							[]
						];
						this.old_list_length = 0;
					} else {
						if (newV.length > this.old_list_length) {

							this.push(newV.filter((val, index) => index + 1 > this.old_list_length));
							this.old_list_length = newV.length;
						}
					}
				}
			}
		},
		data() {
			return {
				old_list: [
					[],
					[]
				],
				old_list_length: 0,
			};
		},
		methods: {
			push(arr) {



				try {
					let left_top = 0;
					let right_top = 0;
					var query = uni.createSelectorQuery().in(this)
					query.selectAll(`.aa`).boundingClientRect().exec(res1 => {

						query.selectAll(`.bb`).boundingClientRect().exec(res => {

							// console.log('res',res);

							// left_top = res[0].length > 0 ? res[0].reduce((a, b) => a.height + b.height) :
							// 0;

							// right_top = res[1].length > 0 ? res[1].reduce((a, b) => a.height + b.height) :
							// 	0;
							res[0].forEach(val => {
								left_top += val.height;
							})
							res[1].forEach(val => {
								right_top += val.height;
							})
							// console.log('left', left_top, right_top);


							////////////////

							let new_arr = [
								[],
								[]
							];

							let index_arr = arr.map((val, index) => {
								return index % 2;
							});

							if (left_top > right_top) {
								let cha = parseInt((left_top - right_top) / uni.upx2px(this.height)) + 1;
								for (let i = 0; i < cha; i++) {
									index_arr.unshift(1);
								}
								// console.log('cha', cha);

							} else if (left_top < right_top) {
								let cha = parseInt((right_top - left_top) / uni.upx2px(this.height)) + 0;
								for (let i = 0; i < cha; i++) {
									index_arr.unshift(0);
								}
								// console.log('cha', cha);
							}

							arr.forEach((val, index) => {
								new_arr[index_arr[index]].push(val);
							})
							this.old_list[0] = this.old_list[0].concat(new_arr[0]);
							this.old_list[1] = this.old_list[1].concat(new_arr[1]);
							this.old_list = this.clone(this.old_list);

							////////////////////////////////////////

						});
					});

				} catch {

				}

			},
			to_buy(item) {
				if (this.mode == 3) {

					this.toPage('/pages/yc/detail?id=' + item.id + '&type=' + 3);
					return;
				}
				this.toPage('/pages/goods/goods?id=' + item.id + '&type=' + this.mode);
			}
		}
	}
</script>

<style lang="scss">
	
	.list-item {
		border-radius: 10rpx;
		box-shadow: 0px 4rpx 16rpx 0px rgba(46, 44, 41, 0.05);
		background-color: #FFFFFF;
		margin-bottom: 22rpx;
		width: 100%;

		.goods-img {
			width: 100%;
			height: 344rpx;
			background-color: #EFF0F1;
			border-radius: 10rpx 10rpx 0 0;
			overflow: hidden;
		}
		
		.fuku-people {
			font-size: 18rpx;
			color: #C0C0C0;
			
			text-align: left;
			height: 36rpx;
			font-weight: 400;
		}

	
	}
</style>
