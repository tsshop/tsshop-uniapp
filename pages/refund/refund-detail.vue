<template>
	<view>

		<custom :title="true" fixed="fixed" title="售后详情" background="rgba(0,0,0,0)"></custom>

		<block v-if="info">
			<!-- 退货状态 -->
			<view class="pl-20 pr-20 mt-20 color-323232">
				<view style="height: 128rpx;" class="flex flex-y-center p-20 br-10 bg-FFFFFF" @tap.stop="to_detail()">
					<view class="iconfont icon-wancheng" style="font-size: 48rpx;"></view>
					<view class="flex-1 pl-20" style="font-size: 34rpx;font-weight: 550;">
						{{status_text || ''}}
					</view>
					<view class="iconfont icon-jinru color-323232" style="width: 20rpx;font-size: 30rpx;"></view>
				</view>
				
			</view>
			
			<view class="pl-20 pr-20 mt-20 color-323232">
				<view  class="color-323232 fs-28 p-20 bg-FFFFFF br-10">
					<view class="fs-30">
						售后商品
					</view>
					<view style="background-color: #FFFFFF;">
						<view style="padding:20rpx 0rpx 0 0rpx;" class="flex">
							<image  mode="aspectFill" :src="info.src"
								style="width: 132rpx;height: 132rpx;background-color: #F4F4F4;border-radius: 10rpx;"></image>
							<view style="margin-left: 24rpx;" class="flex-1 hidden color-000000 flex flex-y">
								<view class="flex flex hidden">
									<view class="flex-1 fs-30  text-hidden">
										{{info.goodsName}}
									</view>
									<text class="fs-28 ml-20 ">￥{{info.price}}</text>
								</view>
								<view class="flex flex-y-center">
									<view class="flex-1 fs-24  text-hidden color-646464">
										{{info.sku}}
									</view>
									<text class="fs-28 ml-20">x {{info.quantity}}</text>
								</view>
								
								
							</view>
						</view>
					</view>
					<view class="refund-item flex-x-b" v-if="info && info.refund.returnReason">
						<view>售后原因</view>
						<view class="flex flex-y-center ">
							{{info.refund.returnReason || ''}}
						</view>
					</view>
				
					<view class="refund-item flex-x-b">
						<view>退款金额</view>
						<view class="flex flex-y-center " style="color: #FD4F4C;">
							¥ {{info.refund.returnAmt}}
						</view>
					</view>
					<view class="refund-item flex-x-b" v-if="info.refund.reallyAmt && info.refund.reallyAmt != info.refund.returnAmt">
						<view>实际退款</view>
						<view class="flex flex-y-center " style="color: #FD4F4C;">
							¥ {{info.refund.reallyAmt}}
						</view>
					</view>
				
					<view class="refund-item" v-if="info && info.refund.returnDetail">
						<view>原因描述</view>
						<view class="flex flex-y-center " style="margin-left: 40rpx;">
							{{info.refund.returnDetail || ''}}
						</view>
					</view>
				
				
				
					<view class="refund-item" style="height: auto;" v-if="image_list.length > 0">
						<image v-for="(item,index) in image_list" :key="index"
							style="margin-right: 12rpx;width: 160rpx;height: 160rpx;border-radius: 16rpx;"
							mode="aspectFill" :src="item" @tap.stop="preview_img(item,image_list)">
						</image>
					</view>
				
					<view class="refund-item" v-if="info.refund.expressName">
						<view>物流名称</view>
						<view class="flex flex-y-center " style="margin-left: 40rpx;">
							{{info.refund.expressName || ''}}
						</view>
					</view>
					<view class="refund-item" v-if="info.refund.expressNo">
						<view>物流单号</view>
						<view class="flex flex-y-center " style="margin-left: 40rpx;">
							{{info.refund.expressNo || ''}}
						</view>
					</view>
				
					<view class="refund-item" v-if="info.refund.refuseDetail">
						<view>售后备注</view>
						<view class="flex flex-y-center " style="margin-left: 40rpx;">
							{{info.refund.refuseDetail || ''}}
						</view>
					</view>
				
				
				</view>
			</view>

			

			

			<view style="height: 194rpx;" v-if="info.refund.status == 2">
				<view style="width: 100vw;position: fixed;left: 0;bottom: 60rpx;z-index: 6;padding:0 36rpx;"
					class="flex">
					<view @tap.stop="refund_again" hover-class="click1"
						class="flex-1 bg-blue flex-1 bg-all color-ffffff flex flex-x-y"
						style="height: 88rpx;border-radius: 44rpx;">
						重新申请售后
					</view>
				</view>
			</view>


		</block>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				info:null,
				image_list: [],
				status_text: '',
			}
		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id;
				this.get_info();
			}


		},
		onShow() {
			this.get_info();
		},
		methods: {
			to_detail(item) {
				if (this.info.refund.status == 4)
					this.toPage('/pages/refund/refund-progress?status=' + this.info.refund.status + '&id=' + this.id);
			},
			get_info() {

				this.request({
					url: '/returnOrder/detail',
					data: {
						returnId: this.id
					}
				}).then(res => {
					if (!this.rsuccess(res, true)) return;

					if (res.data.returnOrder.returnImg) {
						this.image_list = res.data.returnOrder.returnImg.split(',');
					}
					let status = res.data.returnOrder.status;
					switch (status) {
						case 1:
							this.status_text = '申请已提交，等待后台审核';
							break;
						case 2:
							this.status_text = '商家拒绝';
							break;
						case 3:
							this.status_text = '申请成功，已退款';
							break;
						case 4:
							this.status_text = '等待寄回，填写物流单号';
							break;
						case 5:
							this.status_text = '已寄回，待审核';
							break;
					}
					this.info = {
						...res.data.order.goodsDto,
						...res.data.order,
						refund: res.data.returnOrder,

					};
					
					console.log('this.info', this.info);
				});
			},
			preview_img(item, arr) {
				uni.previewImage({
					current: item,
					urls: arr
				})
			},
			connect_server() {
				if (this.info.info.order_no) {
					this.mycopy(this.info.info.order_no, '订单号已复制');
				}
				// this.$refs.server.open();
			},
			refund_cancel() {

				uni.showModal({
					title: '确定撤销申请',
					success: res => {
						if (res.confirm == true) {
							this.less1(() => {
								this.getApp().request({
									url: '/refund/cancel',
									data: {
										id: this.id,
									},
									success: res => {
										this.uniBack();
									}
								});
							});
						}
					}
				})

			},
			refund_again() {
				// let goods_str = JSON.stringify(goods);
				this.toPage(`/pages/refund/server?id=${this.info.id}`, '3');
				
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.refund-item {
		height: 40rpx;
		margin-top: 36rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		font-size: 28rpx;
	}

	.label1 {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #FD4F4C;
		font-weight: 550;
		width: 128rpx;
		height: 34rpx;
		border-radius: 17rpx;
		background: rgba(253, 79, 76, 0.38);
		margin-right: 15rpx;

	}

	.label2 {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #FC9E2B;
		font-weight: 550;
		width: 94rpx;
		height: 34rpx;
		border-radius: 17rpx;
		background: rgba(255, 200, 32, 0.38);
		margin-right: 15rpx;
	}
</style>
