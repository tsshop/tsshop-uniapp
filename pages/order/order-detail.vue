<template>
	<view>
		<custom fixed="fixed" :title="goods.orderStatus == -1 ? '已取消' :orderStatus[goods.orderStatus]" mode="1"
			:titleBold="false" background="#F5F6F7"></custom>
		<view style="padding:34rpx 32rpx;">
			<view v-if="goods" style="padding: 30rpx;border-radius: 8rpx;" class="wh-100  cover-view bg-FFFFFF">
				<view class="flex flex-y-center">
					<image src="../../static/tsshop/shangdian.png" mode="" style="width: 30rpx; height: 30rpx;"></image>
					<view class="ml-20">
						TSSHOP
					</view>
				</view>
				<view class="flex  flex-x-b mb-44 mt-20" @tap="toPage('/pages/goods/goods?id='+goods.goodsId)">
					<image class="br-5"
						style="width: 132rpx;height: 132rpx; margin-right:34rpx ;background-color: #f4f4f4;border-radius: 10rpx;"
						:src="goods.src" mode="aspectFill"></image>
					<view class="" style="flex: 1;">
						<view class="flex flex-y-center flex-x-b mb-16 flex-y-start ">
							<view class="flex-1 over-line2">{{goods.goodsName}}</view>
							<view class="ml-10 numberfont flex flex-y-center">
								<view>¥{{goods.price}}</view>

							</view>
						</view>
						<view class="flex-1 flex flex-y-start flex-x-b mb-46">
							<!-- <view class="flex flex-y-center  flex-1">
								<view style="padding: 6rpx 12rpx;" class="mr-20 bg-f5f5f5 fs-22">白色</view>
								<view style="padding: 6rpx 12rpx;" class="mr-20 bg-f5f5f5 fs-22">41码</view>
							</view> -->
							<!-- <view class="flex-1 flex flex-y-start" style="flex-wrap: wrap;">
								<view class="attr-item" v-for="(item,index) in get_pro()" :key="index">{{item}}</view>

							</view> -->
							<view class="fs-28 color-808080">
								{{goods.sku}}
							</view>
							<view class="flex flex-x-end color-999999 ml-20 numberfont">
								共{{goods.quantity}}件
							</view>
						</view>
						<!-- <view class="flex flex-y-center flex-x-b mb-46 mt-10">
							
							<view class="flex-1 flex flex-x-end">{{goods.price}}</view>
						</view> -->
					</view>
				</view>
				<view class="mt-20 flex flex-x-end">
					<view v-if="goods.orderStatus == 1 || goods.orderStatus == 2" class="order-btn"
						@tap.stop="toPage('/pages/refund/server?id='+goods.id)">申请退款</view>
					<view v-if="goods.orderStatus == 3" class="order-btn" @tap.stop="toPage('/pages/refund/server?id='+goods.id)">申请售后</view>
				</view>

				<view class="flex flex-y-center flex-x-b mb-44 mt-40">
					<view class="fs-28 color-333333">实际付款</view>
					<view class="fs-28 flex flex-y-center color-333333 numberfont">

						<price :price="goods.totalAmount"></price>

					</view>

				</view>
				<view class="flex flex-y-center flex-x-b mb-44">
					<view class="fs-28 color-333333">运费</view>
					<view class="fs-28 color-333333 flex">
						<view class="" v-if="goods.freight>0">
							￥
						</view>
						<view class="">
							{{goods.freight>0?goods.freight:'免运费'}}
						</view>
					</view>
				</view>
				<!-- <view class="flex flex-y-center flex-x-b ">
					<view class="fs-28 color-333333">运费险</view>
					<view class="fs-28 color-333333">¥0.00</view>
				</view> -->
				<!-- <view class="mt-56" style="width: 100%;  height: 2rpx;background: rgba(216,216,216,0.50);"></view> -->
				<view class="fs-28 color-323232 flex mt-56">
					<view class="mr-20">收货地址</view>
					<view class="flex-1 color-999999 ta-right">
						<view class="">
							{{address.name}}， {{address.phone}}
						</view>
						<view class="">
							{{address.detailAddr}}
						</view>

					</view>
				</view>
				<view class="fs-28 color-333333 flex flex--justify mt-56 flex-y-center">
					<view class="mr-20">订单编号</view>
					<view class="flex-1 color-323232 ta-right">{{goods.orderNo}}</view>
					<!-- <view class="ml-10" style="width: 2rpx;height: 24rpx;background: #999999;"></view> -->
					<view class="color-333333 ml-24" @tap="mycopy(goods.orderNo)">复制</view>
				</view>
				<!-- <view class="fs-28 color-333333 flex flex--justify mt-56">
					<view class="mr-20">支付交易号</view>
					<view class="flex-1 color-999999 ta-right">{{goods.paymentTransactionNumber}}</view>
				</view> -->
				<view class="fs-28 color-333333 flex flex--justify mt-56" v-if="goods.payTime">
					<view class="mr-20">交易时间</view>
					<view class="flex-1 color-999999 ta-right">{{goods.payTime}}</view>
				</view>
				<view style="height: 30rpx;"></view>

			</view>
		</view>

		<view style="height: 140rpx;" v-if="goods && goods.orderStatus != -1 && goods.orderStatus != 1 && !isReview">
			<view style="position: fixed;z-index: 4;bottom: 0;left: 0;">

				<view class="flex flex-x-end mt-30 flex-y-center"
					style="height: 140rpx;background-color: #FFFFFF;width: 100vw;padding-right: 30rpx;white-space: nowrap;">
					<view v-if="goods.orderStatus == 0" @tap.stop="cancel_order(goods)" class="order-btn">取消订单</view>
					<view v-if="goods.expressNo" @tap.stop="check_wuliu" class="order-btn">
						查看物流
					</view>

					<view v-if="goods.orderStatus == 2" @tap.stop="confirm_receipt(goods)" class="order-btn pay">
						确认收货
					</view>
					<view v-if="goods.orderStatus == 3 && !isReview" @tap.stop="toPage('/pages/evaluate/post-comments?id='+id)"
						class="order-btn pay">
						评价
					</view>
					<view v-if="goods.orderStatus == 0" @tap.stop="to_pay(goods)" class="order-btn pay">
						立即支付
					</view>

				</view>

			</view>

		</view>


		<!-- 推荐商品 -->

		<!-- <goods-title title="推荐商品"></goods-title> -->

		<!-- 推荐商品 -->

		<view style="padding:0 30rpx;">
			<list :list="list"></list>
		</view>

		<view style=""></view>
		<qq-pay ref="pay"></qq-pay>
		<lw-pay-list ref="payList"></lw-pay-list>

	</view>
</template>

<script>
	import { start_pay } from '../../utils/pay';
	export default {
		data() {
			return {
				id: '',
				title: '买家已付款', //订单id,
				orderStatus: ['待付款', '待发货', '已发货', '已完成'],
				goods: {}, //订单详情
				address: {},
				list: [],
				isReview:false,
			};
		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id;
				this.get_detail();
				// this.get_list();
			}
			if(e.review) {
				this.isReview = e.review === null ?false:true;
			}
		},
		methods: {

			get_detail() {
				this.request({
					url: '/order/detail',
					data: {
						orderId: this.id,
					},
					loading: true,
				}).then(res => {
					if (res.status == 200) {
						res.data = {
							...res.data,
							...res.data.goodsDto,
							quantity: res.data.quantity,
							price: res.data.price,
							src: res.data.src.split(',')[0]
						}
						if(res.data.payTime){
							res.data.payTime = this.dateFormat('YY-mm-dd HH:MM:SS',new Date(res.data.payTime));
						}
						this.goods = res.data;
						console.log(this.goods, 'goods')
						this.address = res.data?.addressOrder || {};
					}
				});
			},
			cancel_order() {

				this.click(() => {
					this.request({
						url: '/order/cancel',
						method: 'POST',
						data: {
							orderId: this.id
						},
						loading: true,
					}).then(res => {
						if (res.status == 200) {
							this.showToast('订单取消成功');
							this.$emit('cancel_order', this.id);
							setTimeout(() => {
								this.uniBack();
							}, 400);
						}
					});
				});
			},
			check_wuliu() {
				this.toPage(
					`/pages/logistics/logistics?express=${this.goods.express}&expressNo=${this.goods.expressNo}&orderNo=${this.goods.orderNo}&detail=${this.address.detailAddr}&order_id=${this.id}&orderStatus=${this.goods.orderStatus}`
				);
				// "express": "string",
				// "expressNo": "string",
				// "orderNo": "string"
			},
			get_pro() {
				if (this.goods && this.goods.properties) {
					return this.goods.properties.split(';');
				}
				return [];
			},
			get_list() {


				this.request({
					url: '/goods/first',
				}).then(res => {

					if (res.status == 200) {

						if (res.data?.content) {
							res.data.content.forEach(val => {
								if (val.headPortrait) {
									val.headPortrait = val.headPortrait.split(',')[0]
								}
							})
						}

						this.list = this.list.concat(res.data?.content || []);


					}
				});
			},
			to_refund() {
				let g = JSON.stringify(this.goods)
				this.toPage('/pages/refund/server?goods=' + g)
			},
			confirm_receipt(item) {
				this.request({
					url: '/order/harvest',
					data: {
						orderId: item.id
					},
					method: 'POST'
				}).then(res => {
					if (res != 200) return

				})
			},
			to_pay() {
				this.$refs.pay.open({
					order_id: [this.goods.id]
				});

			},
			pay_2() {
				this.$refs.payList.open({
					price: this.goods.price, //价格
					success: (id, price, detail) => {
						/////////
						// this.less(() => {
							start_pay({
								pay: detail,
								order_id:[this.goods.id],
								price: Number(this.goods.price),
								success: () => {
									this.showToast('支付成功');
									getApp().globalData.payOrderId = this.goods.id; 
									setTimeout(() => {
										this.toPage(`/pages/pay/pay?status=1`,'redirect');
									}, 600);
								},
								fail: () => {
									this.showToast('支付失败');
									getApp().globalData.payOrderId = this.goods.id; 
									setTimeout(() => {
										this.toPage(`/pages/pay/pay?status=2`,'redirect')
									}, 600);
								}
							});
						// });
						////////
					}
				});
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F6F7;
	}

	.attr-item {
		font-size: 22rpx;
		color: #999999;
		padding: 6rpx 12rpx;
		border-radius: 4rpx;
		background-color: #F5F5F5;
		margin-right: 20rpx;
		line-height: 28rpx;
	}

	.order-btn {
		margin-left: 26rpx;
		height: 68rpx;
		border-radius: 34rpx;
		padding: 0 36rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #333333;
		border: 1rpx solid #979797;
	}

	.pay {
		border-color: #FF882F;
		color: #FF882F;
	}
</style>
