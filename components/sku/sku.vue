<template>
	<view @touchmove.stop.prevent="clear">
		<!-- 选择商品规格组件LQQ -->
		<view class="flex flex-y-end" v-if="show" @tap="close()"
			style="position: fixed;z-index: 9999;width: 750rpx;height: 100vh;background-color: rgba(0,0,0,0.5);overflow: hidden;"
			:style="{'bottom':bottom}">
			<view @tap.stop="clear" style="width: 750rpx;background-color: #FFFFFF;border-radius: 16rpx 16rpx 0 0;"
				class="show-top">
				<!-- s商品图片，规格 -->
				<view v-if="sku_list.length>0">
					<view class="flex flex-y-center pr" style="padding-top: 42rpx;">
						<!-- sku图片 -->
						<view
							style="height: 160rpx;height: 160rpx;overflow: hidden;margin-left: 32rpx;border-radius: 8rpx;">
							<image @tap.stop="preview_img(image || sku_list[checked_index].pic || goods.headPortrait)"
								style="width: 160rpx;height: 160rpx;" mode="aspectFill"
								:src=" image || sku_list[checked_index].pic || goods.headPortrait"></image>
						</view>

						<view class="flex flex-1 pr-31" style="padding-left: 25rpx;">
							<!-- sku价格 -->
							<view class="flex-1">
								<view class="flex flex-y-center">
									<view  class="fs-48 bold color-all ">￥{{sku_list[checked_index].price}}
									</view>
									<view  class="fs-30 color-808080 ml-40" style="line-height: 30rpx;text-decoration: line-through;">
										￥{{sku_list[checked_index].oriPrice}}
									</view>
							
								</view>
							</view>
							<!-- 关闭按钮 -->

							<view class="flex flex-x-y pa"
								style="border-radius: 50%;width:48rpx;height:48rpx;right: 20rpx;top: 20rpx;"
								>

								<view class="iconfont icon-cuo bold"  @tap.stop="close()"
									style="color: #989898;font-size: 36rpx;">
								</view>
							</view>

						</view>
					</view>


					<!-- 规格列表 -->
					<scroll-view
						style="padding:40rpx 0rpx 0rpx 36rpx;width: 100%;min-height: 100rpx;max-height: 600rpx;"
						:scroll-y="true">
						<view>
							<view v-for="(item,key,index) in attr_group_list" :key="index" class="sku-list">
								<!-- 规格名 -->
								<view class="fs-30 color-333333 bold">{{key || '规格'}}</view>
								<!-- 规格属性 -->
								<view>
									<view class="sku-list-item" @tap.stop="choose(key,attr_index,attr.is_null)"
										:class="{'sku-list-item-disable':attr.is_null,'sku-list-item-checked':attr.checked}"
										v-for="(attr,attr_index) in attr_group_list[key].attr_list" :key="attr_index">
										{{attr.attr_name || ''}}
									</view>
								</view>
							</view>
						</view>
						<view style="height: 40rpx;"></view>
					</scroll-view>

					<!-- 数量 -->
					<view v-if="showNum" class="pr flex flex-x-b flex-y-center"
						style="padding:10rpx 36rpx 80rpx 36rpx;z-index: 3;background-color: #FFFFFF;"> 
						<view class="color-333333 fs-30 bold">购买数量</view>

						<view class="flex flex-y-center color-333333">
							<!-- <text class="iconfont icon-jian fs-50" :style="num == 1?'color:#E8E8E8;':''"
								@tap.stop="reduce"></text>
							<text class="fs-30 bold" style="padding: 0 18rpx;">{{num}}</text>
							<text class="iconfont icon-jia fs-50" @tap.stop="add"></text> -->
								<uni-number-box :min="1" v-model="num"  />
						</view>
					</view>
					<view v-else style="height: 100rpx;"></view>

				</view>
				
				<!-- 确定按钮 -->

				
				<view v-if="showBtn" @tap.stop="sure" class="sku-sure bg-all">确定</view>

				<view v-if="showAddcart" @tap.stop="add_cart" class="sku-sure" style="background: linear-gradient(90deg, #FFA600 0%, #FF6D00 100%);">加入购物车</view>
				
				
			</view>
		</view>
		<!-- <toast ref="toast"></toast> -->


	</view>
</template>

<script>
	export default {
		name: "sku",
		data() {
			return {
				show: false,
				sku_list: [],
				attr_group_list: {},
				type: 1, //1默认 2只能选择一个商品
				num: 1,
				checked_index: 0,
				choose_sku: null,
				image: '', //
				
			};
		},
		props: {
			bottom: {
				type: String,
				default: '0'
			},
			showBtn: {
				type: Boolean,
				default: false,
			},
			showAddcart: {
				type: Boolean,
				default: false,
			},
			showNum: {
				type: Boolean,
				default: true,
			},
			goods: {
				type: Object,
				default: () => {
					return {

					}
				}
			},
			mode: {
				type: [String, Number],
				default: '0'
			}
		},
		methods: {
			show_detail() {
				// this.$emit('buy_now_fail');
			},
			//关闭
			close() {
				this.show = false;

				this.$emit('close');

			},
			open() {

				// if (this.sku_list.length == 0) {
				// 	// this.showToast('没有规格可以选择哦');
				// 	return;
				// }
				this.show = true;
			},
			init(attr_group_list = {}, sku_list = [], type = "", sku = "", num = "") {
				console.log('attr_group_list222222222', attr_group_list);
				console.log('sku_list222222222', sku_list,sku_list.length);

				this.setData({
					sku_list: [],
					attr_group_list: {},
					type: 1, //1默认 2只能选择一个商品
					num: 1,
					checked_index: 0,
					choose_sku: null,
					image: "",
				})
				this.attr_group_list = attr_group_list;
				this.sku_list = sku_list;

				if (num) {
					console.log('num', num)
					this.num = num;
				}
				this.refresh_attr();

				//只有一个规格时默认选择
				if (this.sku_list.length == 1 && this.sku_list[0].num > 0) {
					this.choose_one();
				}

				if (sku) {
					this.choose_by_sku(sku);
				}



			},
			//更新更新规格选中器样式
			refresh_attr() {
				let attr_group_list = this.attr_group_list;
				let sku_list = this.sku_list;
				let check_arr = this.get_checked_arr(attr_group_list);
				console.log('check_arr', check_arr);
				let index = 0;
				for (let key in attr_group_list) {
					let checked_name = "NULL";
					attr_group_list[key].attr_list.forEach(val => {
						let new_arr = this.clone(check_arr);
						new_arr[index] = val.attr_name;
						val.is_null = !this.have(new_arr)
					})
					index++;
				}
				this.attr_group_list = attr_group_list;

			},
			//判断属性组合是否存在
			have(arr) {
				//判断是否有库存

				let have_ = false;
				let null_length = arr.filter(val => val == 'NULL').length;
				this.sku_list.some(val => {

					let has_length = arr.length - null_length;
					val.attr_list.forEach(attr => {
						if (arr.includes(attr.attr_name)) {
							has_length--;
						}
					})
					if (has_length == 0 && val.num > 0) {

						have_ = true;

						return true;
					}
					return false;
				})


				return have_;
			},
			//获取已选中的属性值素组，一维数组
			get_checked_arr(attr_group_list) {
				let checked_arr = []; //['蓝色','M']
				for (let key in attr_group_list) {
					let checked_name = "NULL";
					attr_group_list[key].attr_list.some(val => {
						if (val.checked == true) {
							checked_name = val.attr_name;
							return true;
						}
						return false;
					})
					checked_arr.push(checked_name);
				}
				return checked_arr;
			},
			//只选择唯一一个
			choose_one() {
				let attr_group_list = this.attr_group_list;
				for (let key in attr_group_list) {
					attr_group_list[key].attr_list[0].checked = true;
				}
				this.checked_index = 0;
				this.choose_sku = this.sku_list[0].skuId;
			},
			choose(key1, index, is_null) {
				if (is_null) {
					console.log('库存不足')
					this.showToast('库存不足');
					return;

				}
				let attr_group_list = this.attr_group_list;



				for (let key in attr_group_list) {
					attr_group_list[key].attr_list.forEach((val, ind) => {
						if (key == key1) {
							if (ind == index) {
								if (val.checked == true) {
									val.checked = !val.checked;

								} else
									val.checked = true;
							} else {
								val.checked = false;
							}
						}


					})
				}
				this.attr_group_list = this.clone(attr_group_list);
				this.refresh_attr();

				let checked_index = this.get_checked_index();
				if (checked_index > -1) {
					this.checked_index = checked_index;
					if (this.num > this.sku_list[checked_index].num)
						this.num = parseInt(this.sku_list[checked_index].num);
					this.choose_sku = this.sku_list[checked_index].skuId;
					this.image = "";
					this.$emit('change', {
						num: this.num,
						goods: this.clone(this.sku_list[this.checked_index])
					})
				} else {
					//未定位到所选 sku ，这里用第一属性定位图片
					console.log('规格未选择完整，采用第一属性图片')
					let key_arr = Object.keys(this.attr_group_list);
					if (this.attr_group_list[key_arr[0]]) {
						let attr_name = '';
						this.attr_group_list[key_arr[0]].attr_list.forEach(val => {
							if (val.checked == true) {
								attr_name = val.attr_name;
							}
						})
						console.log('attr_name', attr_name)
						this.sku_list.some(val => {
							if (val.attr_list.some(attr => {
									if (attr.attr_name == attr_name) {
										this.image = val.pic;
										return true;
									}
									return false;
								}))
								return false;
						})
					}
				}
			},
			get_checked_index() {
				let arr = this.get_checked_arr(this.attr_group_list);

				let checked_index = -1;

				this.sku_list.some((val, index) => {
					let has_length = arr.length;
					val.attr_list.forEach(attr => {
						if (arr.includes(attr.attr_name)) {
							has_length--;
						}
					})
					if (has_length == 0) {
						checked_index = index;

						return true;
					}
					return false;
				})

				console.log('已选中', checked_index);
				return checked_index;
			},
			reduce() {
				if (this.num > 1) {
					this.num = this.num - 1;
				}
			},
			add() {
				if (this.goods.g_status == 1) {
					this.showToast("一次只能购买一件哦");
					return;
				}

				if (this.choose_sku) {
					let sku_num = this.sku_list[this.checked_index].num;
					if (this.num < sku_num)
						this.num = this.num + 1;
					else {
						this.showToast('不能再买啦，商品库存不足');
					}
				} else {
					this.num = this.num + 1;
				}
			},
			//通过sku来选择
			choose_by_sku(sku) {
				let obj = {};
				this.sku_list.some((val, index) => {

					if (val.skuId == sku && val.num > 0) {
						this.checked_index = index;
						this.choose_sku = val.skuId;
						val.attr_list.forEach(attr => {
							obj[attr.attr_group_name] = attr.attr_name;
						})
						return true;
					}
					return false;
				})
				let attr_group_list = this.attr_group_list;
				for (let key in attr_group_list) {
					attr_group_list[key].attr_list.forEach((val, ind) => {
						if (val.attr_name == obj[key]) {
							val.checked = true;
						} else {
							val.checked = false;
						}
					})
				}
				this.attr_group_list = this.clone(attr_group_list);
				this.refresh_attr();

			},
			//检查有哪些未选中
			check_attr() {
				if (this.show == false) {
					this.show = true;
					console.log('sss')
					return false;
				}
				
				let attr_group_list = this.attr_group_list;
				for (let key in attr_group_list) {
					if (!attr_group_list[key].attr_list.some(val => val.checked)) {
						this.showToast('请选择' + key, 2500);
						this.show = true;
						return false;

					}
				}
				return true;
			},
			add_cart() {
				if (this.login())
					return;
				if(!this.sku_list.length) {
					this.add_cart_request()
					return
				}else {
					if(!this.show) {
						this.show = true
						return
					}
				}
				if (this.check_attr()) {
					console.log('adddddddddddddddddddddd')
					this.less(() => {
						this.add_cart_request()
					});
				}
			},
			add_cart_request() {
				this.request({
					url: '/shopCart/addCart',
					method: 'POST',
					data: {
						goodsId: this.goods.id,
						skuId: this.choose_sku || '',
						purchaseQuantity: this.num,
						
					},
					loading:true,
				}).then(res => {
					if(res.status != 200) return
					console.log('chengg')
					if (res.status == 200) {
						//更新购物车
						this.show = false;
						// this.$store.dispatch('refresh');
						this.showToast('添加成功', 2500);
					}
				});
			},
			buy_now() {
				if (this.login())
					return;

				if (this.show == false) {
					this.open();
					return;
				}

				// if ((this.goods.g_status == 8 || this.goods.g_status == 10) && this.num > 1) {
				// 	this.showToast('只能拼一件商品哦');
				// 	return;
				// }

				// if (this.goods.g_status == 1 && (this.user_info.status < 1 || this.user_info.integral < 500)) {
				// 	this.close();
				// 	this.$emit('buy_now_fail');
				// 	return;
				// }

				if (this.check_attr()) {
					this.less(() => {
						this.show = false;
						// this.$emit('close');
						// let goods_list = [{
						// 	goods_id: this.sku_list[this.checked_index].goods_id,
						// 	cart_id: "",
						// 	num: this.num,
						// 	sku: this.choose_sku,
						// 	from: 1,
						// 	// group_buy_parent_id: group_buy_parent_id || '',
						// }]
						// let group_buy_parent_id = this.goods.group_buy_parent_id || '';
						// if (this.goods.is_success) {
						// 	group_buy_parent_id = 0
						// }
						// this.toPage('/pages/submit/submit?goods_list=' + JSON.stringify(goods_list) +
						// 	'&group_buy_parent_id=' + group_buy_parent_id);
						
						if(this.sku_list[this.checked_index].liveId){
							//直播商品
							let skuInfo = this.sku_list[this.checked_index];
							this.toPage(`/pages/goods/submit?id=${this.goods.id}&num=${this.num}&sku=${skuInfo.skuId}&liveId=${skuInfo.liveId}&liveStoreId=${skuInfo.liveStoreId}`)
							this.close();
							return ;
						}
						this.toPage('/pages/goods/submit?id=' + this.goods.id + '&type=' + this.mode + '&num=' +
							this.num + '&sku=' + this.sku_list[this.checked_index].skuId);
						this.close();

					});
				}
			},
			sure() {
				if (!this.check_attr())
					return;
				this.show = false;
				this.$emit('sure', {
					num: this.num,
					goods: this.clone(this.sku_list[this.checked_index])
				})
			},
			preview_img(img) {
				console.log('img', img)
				// let arr = this.sku_list.map(val => val.pic);
				// arr = Array.from(new Set(arr));
				uni.previewImage({
					current: img,
					urls: [img]
				})
			},
			//不拼团单独购买
			buy_now_myself() {
				if (this.login())
					return;

				if (this.show == false) {
					this.open();
					return;
				}

				if (this.goods.g_status == 1 && this.user_info.status == 0) {
					this.close();
					this.$emit('buy_now_fail');
					return;

				}

				if (this.check_attr()) {
					this.less(() => {
						this.show = false;
						let goods_list = [{
							goods_id: this.sku_list[this.checked_index].goods_id,
							cart_id: "",
							num: this.num,
							sku: this.choose_sku,
							from: 1,
							// group_buy_parent_id: group_buy_parent_id || '',
						}]
						let group_buy_parent_id = this.goods.group_buy_parent_id || '';
						this.toPage('/pages/submit/submit?goods_list=' + JSON.stringify(goods_list) +
							'&group_buy_parent_id=' + group_buy_parent_id + '&is_direct_buy_group=1');

					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sku-sure {
		width: 710rpx;
		height: 84rpx;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-weight: 550;
		font-size: 30rpx;
		z-index: 2;
		position: relative;
		margin: 20rpx;
	}

	.sku-list-item {
		display: inline-block;
		height: 60rpx;
		line-height: 34rpx;
		border-radius: 30rpx;
		color: #333333;
		font-size: 26rpx;
		margin-top: 32rpx;
		margin-right: 24rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		border: 1px solid #F5F6F7;
		background-color: #F5F6F7;
		
	}

	.sku-list-item-disable {

		opacity: 0.35;
		height: 60rpx;
	}

	.sku-list-item-checked {
		background-color: #fff;
		color: $color;
		height: 60rpx;
		border: 1px solid $color;
	}

	.show-top {
		animation: totop 0.4s;
	}

	@keyframes totop {
		from {
			transform: translateY(500rpx);
		}

		to {
			transform: translateY(0rpx);
		}
	}

	.sku-list+.sku-list {
		margin-top: 40rpx;
	}
</style>
