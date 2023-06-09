<template>
	<view>
		<uni-popup ref="pay" type="bottom">
			<view
				style="width: 100vw;background-color: #FFFFFF;border-radius: 20rpx 20rpx 0 0;padding:0 40rpx;overflow: hidden;">
				<view class="fs-40 color-333333 center" style="margin-top: 50rpx;margin-bottom: 40rpx;">选择支付方式</view>
				<view class="flex flex-x-y fs-40 color-all mt-20">
					<view class="numberfont" v-if="price">¥{{price}}</view>
				</view>
				<view style="padding: 40rpx 0 40rpx 0rpx;">
					<view @tap="choose_pay(index)" v-for="(item,index) in pay_arr" :key="index"
						class="flex flex-y-center" style="height: 90rpx;">
					
						<qq-image mode="" :url="item.logo" imageStyle="width: 44rpx;height: 44rpx;"></qq-image>

						<view class="pl-24 fs-28 color-333333">{{item.name}}</view>
						<view class="flex-1 flex flex-x-end fs-40">
							<view v-if="!item.checked" style="width: 36rpx;height: 36rpx;"
								class="iconfont icon-weixuanzhong"></view>
							<view v-else style="width: 36rpx;height: 36rpx;" class="iconfont icon-xuanzhong color-all">
							</view>
						</view>
					</view>
				</view>
				<view class="pay-btn-sure bg-blue bg-all" @tap.stop="to_pay">确定</view>
				<view :style="{height:safeArea}" class="mt-20"></view>
			</view>
		</uni-popup>
		<toast ref="toast"></toast>
		
		<pay @success="success_pw" ref="topay" bottom="100rpx"></pay>
	</view>
</template>

<script>
	export default {
		name: "paylist",
		props: {


		},
		data() {

			return {
				safeArea: getApp().globalData.safeArea + 'px',
				pay_arr: [
					// 	{
					// 	id: 1,
					// 	isUse: true,
					// 	logo: "https://fgxfile.oss-cn-hangzhou.aliyuncs.com/filedir/1681117536476.png?Expires=1996477529&OSSAccessKeyId=LTAI5tR12EubGc1x6FkuhJdM&Signature=6FebJ2iQlVGL3u6miRSBqiAqhdU%3D",
					// 	name: "支付宝",
					// 	param: null,
					// 	payId: 0,
					// 	remark: "1",
					// },
				],
				price: '',
			};
		},
		created() {
			// console.log('this.CONFIG.APP_PAY_TYPE', this.CONFIG.APP_PAY_TYPE);
			let environmentVariable = 'APP_PLUS'
			// #ifdef MP-WEIXIN
			 environmentVariable = 'MP_WEIXIN' //小程序上会执行
		    // #endif
			// #ifdef H5
			environmentVariable = 'H5' //H5上会执行
		    // #endif
			console.log('environmentVariable',environmentVariable);
			this.request({
				url: '/pay/getPayTypeList',
				data: {
					environmentVariable
				}
			}).then(res => {
				if (res.status != 200) return;
				if (res.data.length > 0) {
					res.data.forEach(val=>{
						val.id = val.payId;
					});
					res.data[0].checked = true;
					this.pay_arr = res.data;
					console.log('pay_arr',this.pay_arr);
				}
			});
		},
		methods: {
			open(obj = {}) {
				if(this.pay_arr.length === 0) return this.showToast('没有配置该环境的支付方式，无法支付！')
				// if(!obj.price) return
				this.price = obj.price || '';
				this.obj = obj;
				this.$refs.pay.open();
			},
			close() {
				this.$refs.pay.close();
			},
			choose_pay(index) {
				this.pay_arr.forEach((val, ind) => {
					if (index == ind) {
						val.checked = true;
					} else {
						val.checked = false;
					}
				});
				this.pay_arr = this.clone(this.pay_arr);
			},
			to_pay(pw = '') {
				let pay_id = this.pay_arr.find(val => val.checked) || {};
				this.close();
				this.obj.success & this.obj.success(pay_id.payThoroughfareId, Number(this.price), pay_id);
			},
			success_pw(pw) {
				this.to_pay(pw);
			},
			
		},

	}
</script>

<style lang="scss">
	.pay-btn-sure {
		margin: 20rpx auto 40rpx auto;
		width: 500rpx;
		height: 88rpx;
		border-radius: 44rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 34rpx;
	}
</style>