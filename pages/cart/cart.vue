<template>
	<view>

		<custom title=" " fixed="fixed" mode="2" titleColor="#323232" background="#F5F6F7" :hiddenBtn="true">
			<view slot="left" class="fs-36" style="white-space: nowrap;transform: translateX(20rpx);">
				购物车
			</view>
			<view slot="right" @tap.stop="edit = !edit" class="color-323232 fs-28"
				style="white-space: nowrap;transform: translateX(-10rpx);">
				{{edit?'完成':'编辑'}}
			</view>
		</custom>

		<!-- 购物车列表 -->
		<view style="margin-bottom: 20rpx;" class="fs-32">
			<view v-for="(item,index) in cart_list" :key="index" style="margin-top: 20rpx;">
				<view class="flex flex-y-center ml-20 cart-item-1" style="width: 710rpx;">
					<!-- 复选按钮 -->
					<view class="flex flex-y flex-x-y color-all" style="overflow: hidden;transition: width 0.3s;"
						:style="{'width':show_edit?'60rpx':'0rpx'}">
						<view class="iconfont icon-xuanzhong" :style="item.status != 0 ?'color:#989898;':'#C4C4C4'"
							@tap.stop="check_one(item,item.status)" v-if="item.is_sel == 1">
						</view>
						<view class="iconfont icon-weixuanzhong" :style="item.status != 0 ?'color:#989898;':'#C4C4C4'"
							@tap.stop="check_one(item,item.status)" v-if="item.is_sel == 2"></view>
					</view>


					<!-- 商品信息面板 -->
					<view class="cart-item flex-1 flex">
						<!-- 图片 -->
						<view style="">
							<image :src="item.img" mode="aspectFill"
								style="width: 160rpx;height: 160rpx;border-radius: 16rpx;"
								@tap.stop="toPage('/pages/goods/goods?id='+item.goodsId)">
							</image>
						</view>
						<view style="overflow: hidden;margin-left: 20rpx;" class="flex-1 color-000000">
							<view class="flex flex-y-center">
								<!-- 商品名 -->
								<view @tap.stop="toPage('/pages/goods/goods?id='+item.goodsId)"
									class="text-hidden fs-28 flex-1 color-333333">
									{{item.name || ''}}
								</view>
								<!-- 删除按钮 -->
								<!-- <view @tap.stop="del_cart(index)" class="iconfont icon-cuo pl-10"
									style="color: #646464;"></view> -->
							</view>
							<!-- 商品规格 -->
							<view style="height: 44rpx;display: inline-block;min-width: 200rpx;max-width: 430rpx;">
								<view v-if="item.properties" class="item-sku flex flex-y-center"
									style="margin-top: 16rpx;"
									@tap.stop="get_attr(item.goodsId,item.skuId,index,item.num)">
									<view class="fs-24 flex-1 text-hidden">
										<template>
											<text>{{item.properties}}</text>
										</template>
									</view>
									<view class="iconfont icon-jinru-copy color-333333"
										style="font-size: 24rpx;padding-right: 14rpx;"></view>
								</view>
							</view>

							<!-- 商品价格和添加数量 -->
							<view v-if="item.status == 0" class="flex flex-y-center flex-x-b"
								style="margin-top: 26rpx;">
								<view class="color-333333" style="color: #FD4F4C;">
									<!-- ￥{{item.price}} -->
									<price :price="item.price"></price>
								</view>

								<view class="flex flex-y-center color-646464"
									style="height: 40rpx;border-radius: 30rpx;border:1rpx solid #C0C0C0;padding:0 12rpx;">
									<view class="iconfont icon-jianhao" :style="item.num==1?'color:#eeeeee;':''"
										style="font-size: 28rpx;" @tap.stop="reduce(item)"></view>
									<view class="fs-28"
										style="text-align: center;margin:0 10rpx;min-width: 60rpx;padding: 0 14rpx;height: 100%;line-height: 40rpx;border-right: 1rpx solid #C0C0C0;border-left: 1rpx solid #C0C0C0;">
										{{item.num}}
									</view>
									<view class="iconfont icon-zengjia"
										style="font-size: 26rpx;height: 100%;transform: scale(0.9);"
										:style="item.num>=item.max_num?'color:#eeeeee;':''" @tap.stop="add(item)">
									</view>

								</view>
							</view>
							<!-- 描述 -->
							<view class="" v-if="item.status != 0"
								style="font-size: 26rpx;color: #FD4F4C;margin-top: 30rpx;">

								<view class="pr">
									<text v-if="item.status == 1">商品已下架</text>
									<text v-if="item.status == 2">商品已被抢光</text>
									<text v-if="item.status == 3">库存不足，请选择其他规格</text>

								</view>
							</view>

						</view>
					</view>

				</view>
			</view>

		</view>

		<!-- 操作条 -->
		<view style="height: 100rpx;" v-if="cart_list.length > 0">
			<view class="cart-bar flex flex-x-b flex-y-center color-all">
				<!-- 快捷操作 -->
				<view class="flex flex-y-center color-all">

					<!-- 未选中 -->
					<view v-if="check_status == 1" @tap.stop="check_all(true)" class="iconfont icon-weixuanzhong p-20">
					</view>
					<!-- 个别选中 -->
					<view v-else-if="check_status == 2" @tap.stop="check_all(true)"
						class="iconfont icon-weixuanzhong pr p-20  fs-32">
					</view>
					<!-- 已全选中 -->
					<view v-else class="iconfont icon-xuanzhong p-20 fs-32" @tap.stop="check_all(false)"></view>
					<view class="fs-28 color-808080">全选</view>
				</view>
				<view v-if="!edit" class="flex-1 flex flex-x-end flex-y-center" style="padding-right: 28rpx;">
					<view class="color-646464 fs-28">合计:</view>
					<view class=" ml-20" style="color: #FD4F4C;">
						<text>
							<price :price="price_count"></price>
						</text>
					</view>
				</view>

				<!-- 结算按钮 -->
				<view v-if="edit" @tap.stop="del_cart" class="flex flex-x-center flex-y-center cart-submit"
					style="background: linear-gradient(90deg, #FF715B 0%, #FF3333 100%);">删除</view>
				<view v-if="!edit" @tap.stop="to_submit" class="flex flex-x-center flex-y-center cart-submit">去结算</view>
			</view>
		</view>



		<!-- 商品规格选择器 -->
		<sku ref="sku" :showBtn="true" @sure="attr_sure" :goods="goods" bottom="100rpx"></sku>



		<toast ref="toast"></toast>

		<qq-footer :show="cart_list.length == 0" :list="cart_list"></qq-footer>
		
		
		<common></common>
		<fixed-line></fixed-line>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods: {},
				cart_list: [

				],
				edit: false,
				show_edit: true,
				all_price: '0',
				attr_list: {},
				edit_index: -1,
				is_null: false,

			}
		},
		computed: {
			check_status() {
				// 1 全部未选中  2 部分选中  3 已全部选中
				let is_sel_arr = this.cart_list.filter(val => val.status == 0);
				if (is_sel_arr.length == 0)
					return 1;
				let check_arr = is_sel_arr.filter(val => val.is_sel == 1);
				if (check_arr.length == 0)
					return 1;
				if (check_arr.length < is_sel_arr.length)
					return 2;
				if (check_arr.length == is_sel_arr.length)
					return 3;
			},
			price_count() {
				let price = 0;
				this.cart_list.forEach(val => {

					(val.is_sel == 1) && (val.status == 0) && (price = price + (parseFloat(val.price) *
						parseInt(val.num)));
				})

				return Number(this.xs(price, 2));
			},
		},
		onLoad() {
			// this.get_list()
			getApp().globalData.sel_obj = {};
		},
		onShow() {
			this.login();
			this.page = 1;
			this.get_list();
		},
		onReachBottom() {
			this.get_list();
		},
		components: {

		},
		methods: {
			open_sku() {
				this.$refs.sku.open();
			},
			get_list() {
				let page = this.page || 1;
				this.page = page;

				this.request({
					url: '/shopCart/getList',
				}).then(res => {
					if (res.status == 200) {
						console.log(res, 'res')


						res.data.forEach(val => {
							val.is_sel = getApp().globalData.sel_obj[val.id] == 2 ? 2 : 1;
							val.num = val.purchaseQuantity;

							if (val.sstocks != null) {
								if (val.status == 0 && val.num > val.sstocks) {
									val.num = 1;
									//请选择其他规格
									val.status = 3;
								}
							}
							if (val.sstocks == null) {
								if (val.status == 0 && val.num > val.gstocks) {
									val.num = 1;
									//请选择其他规格
									val.status = 3;
								}
							}
						})
						this.cart_list = this.handleImg(res.data, 'img');

						this.vuexSet('cart_num', this.cart_list.length, true);

						if (res.data.length == 0) {
							this.is_null = true;
						}
					}
				});
			},
			add(item) {
				let max = item.sstocks != null ? item.sstocks : item.gstocks;
				if (item.num >= max) {
					this.showToast(`最多购买${max}件`);
					return;
				}
				console.log('item.num', item.num, max)
				let data = {
					id: item.id,
					skuId: item.skuId,
					purchaseQuantity: item.num + 1,
					amt: item.amt,
					// is_sel: item.is_sel,
				}
				this.update(data, () => {
					// this.showToast('')
					console.log('+1 成功');
					item.num = item.num + 1;
					this.cart_list = this.clone(this.cart_list);
				})
			},
			reduce(item) {
				if (item.num == 1) {
					return;
				}
				let data = {
					id: item.id,
					skuId: item.skuId,
					purchaseQuantity: item.num - 1,
					amt: item.amt,
					// is_sel: item.is_sel,
				}
				this.update(data, () => {
					// this.showToast('')
					console.log('-1 成功');
					item.num = item.num - 1;
					this.cart_list = this.clone(this.cart_list);
				})
			},
			update(data, fn, url = "") {
				this.request({
					url: url ? url : '/shopCart/update',
					method: 'POST',
					loading: true,
					data,

				}).then(res => {
					if (res.status == 200) {
						fn && fn();
					}
				});
			},
			get_attr(id, sku, index, num) {
				console.log('sku', sku)

				this.edit_index = index;


				if (this.attr_list[id]) {
					let sku_list = this.attr_list[id].sku_list || [];
					let attr_group_list = this.attr_list[id].attr_group_list || {};
					let goods = this.attr_list[id].goods || [];
					//初始化规格选择器
					this.goods = goods;
					this.$refs.sku.init(attr_group_list, sku_list, '', sku, num);
					this.$refs.sku.open();
					return;
				}



				this.request({
					url: '/goods/getSku',
					data: {
						id: id
					},
					loading: true,

				}).then(res => {
					if (res.status == 200 && res.data) {
						this.attr_list[id] = res.data;
						let sku_list = res.data.sku_list || [];
						let attr_group_list = res.data.attr_group_list || {};

						this.goods = {
							// ...res.data,
							...this.cart_list[index],
							banner: [],
							headPortrait: '',
						};
						
						this.goods.skuList = res.data.filter(val => val.properties);
						if (this.goods.skuList) {
							this.init_sku(this.goods.skuList, sku, num, id);
						}




					}
				});
			},
			init_sku(sku_list = [], sku, num, id) {

				let attr_group_list_obj = {

				};
				sku_list.forEach(val => {

					let attr_arr = val.properties.split(';').map(attrs => {
						return attrs.split(':');
					})
					let attr_list = [];
					attr_arr.forEach(attr => {
						attr_list.push({
							attr_group_name: attr[0],
							attr_name: attr[1]
						})
						if (attr_group_list_obj[attr[0]] === undefined) {
							attr_group_list_obj[attr[0]] = []
						}
						if (attr_group_list_obj[attr[0]].indexOf(attr[1]) == -1) {
							attr_group_list_obj[attr[0]].push(attr[1])
						}
					})
					val.attr_list = attr_list;
					val.num = val.stocks || 0;
					val.sku = val.skuId;

				})
				let attr_group_list = {}

				Object.keys(attr_group_list_obj).forEach(key => {
					attr_group_list[key] = {};
					attr_group_list[key].attr_group_name = key

					attr_group_list[key].attr_list = attr_group_list_obj[key].map(val => {
						return {
							attr_name: val
						}
					});

				})

				//初始化规格选择器
				this.$nextTick(() => {
					this.$refs.sku.init(attr_group_list, sku_list, '', sku, num);
					this.$refs.sku.open();
					this.attr_list[id].goods = this.goods;
					this.attr_list[id].attr_group_list = attr_group_list;
					this.attr_list[id].sku_list = sku_list;
				});


			},
			//选择规格成功
			attr_sure(data) {
				let sku_item = data.goods;
				let num = data.num;


				console.log('sku_item', data);

				let data1 = {
					amt: this.cart_list[this.edit_index].amt,
					purchaseQuantity: num,
					skuId: sku_item.sku,
					id: this.cart_list[this.edit_index].id,
				}
				this.update(data1, () => {
					this.get_list();
				}, '');


			},
			check_all(type) {
				if (type) {
					this.cart_list.forEach(val => {
						val.is_sel = 1;
						getApp().globalData.sel_obj[val.id] = 1;
					})
				} else {
					this.cart_list.forEach(val => {
						val.is_sel = 2;
						getApp().globalData.sel_obj[val.id] = 2;
					})
				}
				this.cart_list = this.clone(this.cart_list);
			},
			check_one(item, status) {
				// if (status != 0)
				// 	return;
				let new_item = this.clone(item);
				new_item.is_sel = new_item.is_sel == 1 ? 2 : 1;
				getApp().globalData.sel_obj[item.id] = new_item.is_sel;
				item.is_sel = item.is_sel == 1 ? 2 : 1;
				this.cart_list = this.clone(this.cart_list);

			},
			to_submit() {
				let goods_list = [];
				this.cart_list.forEach(val => {
					if (val.is_sel == 1 && val.status == 0) {
						goods_list.push({
							goodsId: val.goodsId,
							skuId: val.skuId,
							from: 1,
							id: val.id,
							num: val.num
						})
					}
				});
				if (goods_list.length == 0) {
					this.showToast('未选择任何商品', 3000);
					return;
				}
				getApp().globalData.cart_list = goods_list;
				console.log(getApp().globalData.cart_list, 'getApp().globalData.cart_list')
				this.toPage('/pages/goods/submit?cart=1')
			},

			del_cart() {
				let arr = []
				for(let i = 0; i < this.cart_list.length; i++) {
					if(this.cart_list[i].is_sel == 1) {
						arr.push(this.cart_list[i].id)
					}
				}
				
				console.log(arr, 'aa')
				this.$refs.toast.open({
					desc: '是否从购物车移除该商品',
					success: () => {
						this.request({
							url: '/shopCart/del',
							loading: true,
							// method:'POST',
							data: {
								ids: arr
							},
				
						}).then(res => {
							if (res.status == 200) {
								this.showToast('移除成功', 3000);
								// this.cart_list.splice(index, 1);
								this.get_list();
								this.vuexSet('cart_num', this.cart_list.length, true);
							}
						});
					}
				});

			}



		},
		onPullDownRefresh() {
			// setTimeout(() => {

			// }, 1);
			uni.stopPullDownRefresh();
			this.page = 1;
			this.get_list();
		},
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.cart-item-1 {
		background-color: #FFFFFF;
		border-radius: 8rpx;
	}

	.cart-item {
		/* height: 220rpx; */
		overflow: hidden;
		/* box-shadow: 0px 0px 6rpx 4rpx rgba(240, 240, 240, 1); */
		/* background-color: #FFFFFF; */
		/* background-color: blue; */
		padding: 20rpx 20rpx 20rpx 0rpx;
		/* background-color: #FD4F4C; */
	}

	.item-sku {
		/* 	min-width: 260rpx;
		max-width: 440rpx; */
		width: 100%;
		height: 100%;
		border-radius: 22rpx;
		background-color: #EEEEEE;
		overflow: hidden;
		padding-left: 16rpx;
		color: #646464;
		font-size: 28rpx;
	}

	.cart-bar {
		position: fixed;
		z-index: 90;
		width: 750rpx;
		height: 100rpx;

		bottom: 0;
		/* #ifdef H5 */
		bottom: 114rpx;
		/* #endif */
		box-shadow: 0px 0rpx 4rpx 0px rgba(152, 152, 152, 0.3);
		background-color: #FFFFFF;
		color: #333333;

	}

	.icon-weigouxuan-ban::after {
		content: "";
		width: 16rpx;
		height: 2rpx;
		border-radius: 2rpx;
		background-color: #2F95FD;
		position: absolute;
		z-index: 2;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.cart-submit {
		width: 180rpx;
		height: 74rpx;
		border-radius: 38rpx;
		color: #FFFFFF;
		margin-right: 20rpx;
		font-size: 28rpx;
		background: $smallBtnColor;
	}

	.to-po {
		position: absolute;
		top: -60rpx;
		right: 68rpx;
		z-index: 4;
	}
</style>
