<template>
	<view>
		<custom title="收银台" fixed="fixed" :hiddenBtn="true"></custom>





		<view v-if="orderId" class="flex flex-y flex-x-y">


			<view class="color-333333" style="margin-top: 200rpx;">

				<view style="font-size: 60rpx;">￥ {{price}}</view>
			</view>







			<view style="width: 100vw;position: fixed;bottom: 100rpx;left: 0;" class="flex flex-x-y">
				<view @tap.stop="pay" style="width: 600rpx;background: #07C160;" class="default-btn">支付</view>
			</view>

		</view>

		<view v-if="success" class="flex flex-y flex-x-y">
			<view style="font-size: 60rpx;margin-top: 200rpx;">￥ {{price}}</view>
			<view style="margin-top: 100rpx;font-size: 60rpx;color:#07C160;">支付成功</view>

			<view style="width: 100vw;position: fixed;bottom: 100rpx;left: 0;" class="flex flex-x-y">
				<view @tap.stop="exit()" style="width: 600rpx;background: #07C160;" class="default-btn">确定</view>
			</view>
		</view>






	</view>
</template>

<script>
	
	export default {

		data() {
			return {
				orderId: [],
				price: '',
				success: false,
				payType: '',
				payThoroughfareId: '',
			};
		},


		onLoad(e) {
			
			if (e.price) {
				this.price = this.xs(e.price, 2);
			}
			if (e.payType) {
				this.payType = e.payType;
			}
			if (e.payThoroughfareId) {
				this.payThoroughfareId = e.payThoroughfareId;
			}
			if (e.orderId) {
				this.orderId = e.orderId.split(',')
				this.pay();
			}


		},

		methods: {
			async pay() {
				console.log('TSSHOP......');
				if (this.payData) {
					this.to_pay(this.payData);
					return;
				}
				let codeData = await uni.login();

				if (codeData.length != 2 || !codeData[1].code) {
					this.showToast('登录失败');
				}

				if(!Array.isArray(this.orderId)) {
					this.orderId = this.orderId.split(',')
				}
				console.log('payData',this.orderId);
				this.request({
					url:  '/pay',
					method: 'POST',
					data: {
						// id: this.orderId,
						// payType: 1,
						code: codeData[1].code,
						orderId: this.orderId,
						payType: this.payType,
						payThoroughfareId: this.payThoroughfareId
					},
					login: false,
				}).then(res => {
					if (res.status == 200 && res.data) {
						this.payData = res.data;
						this.to_pay(res.data);
					}
				});


			},
			to_pay(data) {
				uni.requestPayment({
					provider: "wxpay",
					...data,
					success: () => {
						// this.showToast('支付成功');
						this.success = true;
						this.orderId = '';
					},
					fail: () => {

						this.showToast('取消支付');
					}
				})
			},
			exit() {
				//关闭小程序
				uni.exitMiniProgram();
			},
		},

	}
</script>

<style lang="scss">
</style>