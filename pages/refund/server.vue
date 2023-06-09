<template>
	<view>
		<common></common>
		<custom backColor="#000000" :title="true" fixed="fixed" title="选择售后方式" background="rgba(0,0,0,0)"
			titleColor="#000000"></custom>

		<view v-if="goods" style="padding:20rpx 40rpx;background-color: #FFFFFF;border-radius: 10rpx;">
			<view style="" class="flex">
				<image mode="aspectFill" :src="goods.src"
					style="width: 132rpx;height: 132rpx;background-color: #F4F4F4;border-radius: 10rpx;"></image>
				<view style="margin-left: 24rpx;" class="flex-1 hidden color-000000 flex flex-y ">
					<view class="flex flex hidden">
						<view class="flex-1 fs-28  text-hidden color-323232">
							{{goods.goodsName}}
						</view>

					</view>
					<view class="flex flex-y-center">
						<view class="flex-1 fs-28  text-hidden color-808080">{{goods.sku}}</view>
						<!-- <text class="fs-28 ml-20">x 1</text> -->
					</view>


				</view>
			</view>
		</view>

		<view class="color-323232 fs-30 pl-20 pr-20">

			<view class="flex flex-y-center refund-server-box" @tap.stop="choose_after">

				<view class="flex-1 hidden ">
					<view class="fs-30 ">仅退款</view>
					<view class="text-hidden fs-26 color-646464" style="margin-top: 12rpx;">未收到货或者与商家沟通后无需退货</view>
				</view>
				<view class="ml-20 iconfont icon-jinru" style="font-size: 32rpx;width:24rpx;"></view>
			</view>
			<view @tap.stop="to_refund" class="flex flex-y-center refund-server-box">

				<view class="flex-1 hidden ">
					<view class="fs-30 ">退货退款</view>
					<view class="text-hidden fs-26 color-646464" style="margin-top: 12rpx;">未收到货或者与商家沟通后无需退货</view>
				</view>
				<view class="ml-20 iconfont icon-jinru" style="font-size: 32rpx;width:24rpx;"></view>
			</view>
		</view>



		<qq-select @sure="sure" ref="select"></qq-select>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods: null,
				id: '',
			}
		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id
				console.log(this.id,'iddddd')
			}
			this.get_detail()


		},
		onReady() {

		},
		methods: {
			get_detail() {
				this.request({
					url: '/order/detail',
					data: {
						orderId: this.id
					}
				}).then(res => {
					if (res.status != 200) return
					this.goods = res.data
					console.log(this.goods, 'goods')
				})
			},
			choose_after() {
				let arr = ["没有收到货", "已收到货"];
				this.$refs.select.open(arr, 0);
			},
			to_refund() {
				this.toPage('/pages/refund/refund?type=3' + '&o_id=' + this.id, '3');
			},
			sure(data) {
				console.log('以选择', data);
				if (data.index == 0) {
					this.toPage('/pages/refund/refund?type=1' +
						'&o_id=' + this.goods.id, '3');
				} else if (data.index == 1) {
					this.toPage('/pages/refund/refund?type=2' + '&o_id=' + this.goods.id, '3');
				}
			},
			connect_server() {
				if (this.o_id) {
					this.mycopy(this.o_id, '订单号复制成功');
				}
				return;
				this.$refs.server.open();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.refund-server-box {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-top: 20rpx;
	}
</style>
