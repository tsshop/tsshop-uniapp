<template>
	<view>
		<custom fixed="fixed" title="填写订单" :titleBold="false"></custom>

		<view style="padding:20rpx;">
			<view @tap="toPage('/pages/address/list?choose=1')"
				class="flex flex-y-center  bg-FFFFFF fs-32 color-333333 box-show"
				style="padding:40rpx;border-radius: 10rpx;min-height: 176rpx;">
				<image src="../../static/tsshop/dingwei.png" mode="aspectFill" style="width: 40rpx;height: 40rpx;">
				</image>
				<view class="flex-1 fs-28" style="padding-left: 40rpx;padding-right:20rpx;" v-if="!address.id">请选择收货地址
				</view>
				<view class="flex-1 fs-32" style="padding-left: 40rpx;padding-right:20rpx;" v-else>
					<view style="color:#323232;line-height: 44rpx;">
						{{address.provinceName}}{{address.cityName}}{{address.areaName}}{{address.detailAddr}}
					</view>
					<view class="fs-24" style="color:#646464;margin-top: 14rpx;">{{address.name}} {{address.phone}}
					</view>
				</view>
				<view class="iconfont icon-jinru  blod w-20" style="font-size: 30rpx;color: #AFBAB8;">
				</view>
			</view>


			<view v-if="list" class="goods" v-for="(item, index) in list" :key="index">
				<view>
					<view class="flex">
						<view>
							<image :src="item.pic || item.headPortrait || item.img" mode="aspectFill"
								style="width: 160rpx;height: 160rpx;border-radius: 8rpx;"></image>
						</view>
						<view class="pl-22">
							<view class="flex flex-y-start">
								<view style="line-height: 36rpx;height: 72rpx;" class="flex-1 over-line2 text fs-28">
									{{item.prodName || item.name}}
								</view>

							</view>
							<view v-if="item.properties" class="flex-1 flex flex-y-center flex-wrap">
								<view class="attr-item mt-10 over-line1" style="max-width: 480rpx;">
									{{item.properties}}
								</view>
							</view>
						</view>

					</view>
					<view class=" flex ">
						<view style="width: 160rpx;"></view>
						<view class="fs-32 flex1  flex flex-x-b ml-20">
							<view class="">
								<price :price="money.price || item.price"></price>
							</view>
							<view class="ml-20 flex flex-x-y">
								<uni-number-box v-if="!cart" :min="1" @change="number_change" v-model="number" />
								<view v-else>
									x{{ item.purchaseQuantity}}
								</view>
							</view>
						</view>
					</view>

				</view>


			</view>
			<view class="goods color-323232 fs-28">
				<view class="flex flex-x-b">
					<view class="">
						商品金额
					</view>
					<view class="flex">
						<view class="">
							￥
						</view>
						<view class="">
							{{money.amount || money.total}}
						</view>
					</view>
				</view>
				<view class="flex flex-x-b mt-20" v-if="!money.freight">
					<view class="">
						运费
					</view>
					<view class="">
						免运费
					</view>
				</view>
				<view class="flex flex-x-b mt-20" v-else>
					<view class="">
						运费
					</view>
					<view class="">
						<view class="">
							￥{{money.freight}}
						</view>
						<view class="">

						</view>
					</view>
				</view>
				<view class="flex flex-x-b mt-20">
					<view class="">
						合计
					</view>
					<view>
						<price :price="money.totalAmount || money.allMoney"></price>
					</view>
				</view>
			</view>


		</view>


		<view class="center color-999999 fs-26" style="margin-top: 200rpx;">
			声明：发票由杭州xx科技有限公司开具
		</view>



		<view>
			<fixed-bottom height="128rpx" bStyle="background:#FFFFFF;">
				<view style="height: 128rpx;padding-right: 42rpx;" class="flex flex-y-center flex-x-end">
					<view class="fs-28" style="color: #3B4644;">合计：</view>
					<view class="pr-20">
						<price :price="money.totalAmount || money.allMoney || '0'"></price>
					</view>
					<view @tap.stop="to_submit" class="submit-btn flex flex-x-y bg-all color-ffffff fs-32">提交订单
					</view>
				</view>
			</fixed-bottom>
		</view>

		<toast ref="toast"></toast>
		<qq-pay ref="pay"></qq-pay>
		<lw-pay-list ref="payList"></lw-pay-list>

	</view>
</template>

<script>
	import {
		start_pay
	} from '../../utils/pay'
	export default {
		data() {
			return {
				address: {},
				list: [],
				number: 1,
				sku: '',
				money: {},
				cart: '',
				numberArr: []
			}
		},
		computed: {
			total() {
				if (this.info) {
					return this.number * this.info.price
				}
				return 0

			},
			goods_total() {
				if (this.money.totalAmount) {
					return this.xs(this.money.totalAmount - this.money.freight, 2)
				}
				return '0';
			}
		},
		onShow() {
			// this.check_pay_status();
			// this.showToast('onSHow');
			// #ifdef APP-PLUS
			// if (this.disable) {
			// 	let idd = this.pay_arr.filter(val => val.checked)[0].id;
			// 	this.toPage(
			// 		`/pages/pay/pay?status=1&order_id=${this.order_id}&payid=${idd}`,
			// 		'redirect'
			// 	)
			// }
			// #endif

			if (uni.getStorageSync('order_id')) {

				let pay_time = uni.getStorageSync('pay_time');
				if (new Date().getTime() - pay_time < 2000)
					return;

				let order_id = uni.getStorageSync('order_id');
				let pay_id = uni.getStorageSync('pay_id');
				uni.setStorageSync('order_id', '');
				uni.setStorageSync('pay_id', '');
				this.toPage(
					`/pages/pay/pay?status=1&order_id=${order_id}&payid=${pay_id}`,
					'redirect'
				)
			}



		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id;

			}
			if (e.sku) {
				this.sku = e.sku
			}
			if (e.num) {
				this.number = e.num
			}

			if (e.cart) {
				this.cart = e.cart
				let cart_list = getApp().globalData.cart_list
				// cart_list.forEach(val => {
				// 	this.get_detail(val.goodsId, val.skuId)
				// })
				// this.numberArr = cart_list.map(val => val.num)
				this.get_allMoney()
			}
			uni.$on('choose_address', address => {
				this.address = address;
			});
			if (e.liveStoreId) {
				this.liveStoreId = e.liveStoreId;
				this.liveId = e.liveId;
				this.getLiveGoodsDetail();
				this.get_defaultAddress()
				return;
			} else {
				this.get_detail(this.id);
			}

			//选择收获地址
			// this.get_address_list();
			this.get_defaultAddress()

			
			if (this.cart) {
				this.get_allMoney()
			} else {
				this.get_money();
			}
			// this.order_id = 276;
		},
		onUnload() {
			if (uni) {
				uni.$off('choose_address');
			}
		},
		methods: {
			get_defaultAddress() {
				this.request({
					url: '/address/getDefault'
				}).then(res => {
					if (res.status != 200) return
					if (res.data) {
						this.address = res.data || {}
						if (this.cart) {
							this.get_allMoney()
						} else {
							this.get_money();
						}
					}
				})
			},
			get_sku(id) {
				this.request({
					url: '/goods/getSku',
					data: {
						id: id
					}
				}).then(res => {
					if (res.status != 200) return
					if (this.sku) {
						let skuPrice = res.data.filter(item => item.skuId == this.sku)
						this.list = skuPrice
					}
					if (this.cart) {
						this.list.push(res.data[0])


					}
				})
			},
			get_detail(id, skuId) {
				this.request({
					url: '/goods/detail',
					data: {
						id: id
					}
				}).then(res => {
					if (!this.rsuccess(res)) return;
					res.data.headPortrait = res.data.headPortrait.split(',')[0] || "";
					if (this.sku) {
						this.get_sku(id)
					}

					if (skuId) {
						this.get_sku(id)
						return
					}
					this.list.push(res.data);
				});
			},
			getLiveGoodsDetail() {
				this.request({
					url: '/live/liveGoodsView',
					data: {
						id: this.id,
					}
				}).then(res => {
					if (res.status != 200) return;
					res.data.headPortrait = res.data.headPortrait.split(',')[0] || "";
					if (this.sku) {
						let skuPrice = res.data.goodsSkuList.filter(item => item.skuId == this.sku)
						this.list = skuPrice
					}
					this.liveGoodsId = this.list[0].goodsId;
					console.log('this.liveGoodsId', this.liveGoodsId);
					this.get_money();
				});
			},
			get_money() {
				let query = {
					goodsId: this.id,
					quantity: this.number,
					skuId: this.sku,
					addressId: this.address.id || '',
					orderType: 0,
				};
				if (this.liveId) {
					query.goodsId = this.list[0].goodsId;
					query.orderType = 3;
					query.liveId = this.liveId;
					query.liveStoreId = this.liveStoreId;

				}
				this.request({
					url: '/order/allMoney',
					data: query,
					method: 'POST'
				}).then(res => {
					if (res.status != 200) return
					this.money = res.data;
				})
			},
			// 支付
			to_submit() {
				if (this.disablePage) return;
				if (!this.address || !this.address.id) {
					this.showToast('请选择收货地址');
					return;
				}
				let totalPrice = this.money.totalAmount || this.money.allMoney || '0'
				// this.less(() => {
				let params = {
					url: '/order/create',
					method: 'POST',
					data: {
						goodsId: this.id,
						addressId: this.address.id,
						quantity: this.number,
						skuId: this.sku,
					}
				}
				if (this.liveId) {
					params.data.liveId = this.liveId;
					params.data.liveStoreId = this.liveStoreId;
					params.data.orderType = 3;
					params.data.goodsId = this.list[0].goodsId;

				}
				if (this.cart) {
					let ids = getApp().globalData.cart_list.map(val => val.id)
					params = {
						url: '/shopCart/createOrder',
						method: 'POST',
						data: {
							ids,
							addressId: this.address.id,
							isPass: 0
						},
					}
				}
				this.$refs.payList.open({
					price: Number(totalPrice),
					success: (id, price, detail) => {
						/////////
						// this.less(() => {
						start_pay({
							pay: detail,
							order_id: this.order_id ? [this.order_id] : '',
							price: Number(totalPrice),
							params,
							success: () => {
								this.showToast('支付成功');
								this.pay_after(1)
							},
							fail: () => {
								this.showToast('支付失败');
								this.pay_after(2)
							}
						});
						// });
					}
					// })
				});
			},
			// 支付后事件
			pay_after(status) {
				// if(this.cart) {
				// 		this.toPage(`/pages/order/order?index=1`,'redirect');
				// } else {
				getApp().globalData.payOrderId = this.order_id;
				this.toPage(`/pages/pay/pay?status=${status}`, 'redirect')
				// }
			},
			get_address_list() {
				this.request({
					url: '/userAddress/get',
					data: {
						// pages: page,
					}
				}).then(res => {

					if (res.status == 200) {
						if (res.data && res.data.length > 0) {

							let arr = res.data.filter(val => val.defaultCargo == 1);
							if (arr.length > 0) {
								this.address = arr[0];
							} else {
								this.address = res.data[0];
							}
						}
					}
				});
			},
			get_allMoney() {
				let ids = getApp().globalData.cart_list.map(val => val.id)
				this.request({
					url: '/shopCart/settle',
					method: 'POST',
					data: {
						ids: ids,
						addressId: this.address.id || '',
					}
				}).then(res => {
					if (res.status != 200) return
					this.money = res.data
					this.list = this.money.goodsList
				})
			},
			number_change() {

				setTimeout(() => {
					if (this.cart) {
						this.get_allMoney()
					} else {
						this.get_money();
					}

				}, 100);
			},
		}
	}
</script>

<style>
	page {
		background-color: #F2F6F5;
	}

	.goods {
		background-color: #fff;
		padding: 20rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}

	.submit-btn {
		width: 240rpx;
		height: 76rpx;
		border-radius: 40rpx;
	}

	.attr-item {
		background-color: #EEEEEE;
		color: #646464;
		padding-left: 20rpx;
		padding-right: 20rpx;
		font-size: 28rpx;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 24rpx;
	}
</style>