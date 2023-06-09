<template>
	<view>
		<uni-popup ref="pay" type="bottom">
			<view
				style="width: 100vw;background-color: #FFFFFF;border-radius: 20rpx 20rpx 0 0;overflow: hidden;">
				<view class="flex flex-x-b" style="padding:20rpx;">
                    <view class="fs-34 blod">礼物购买</view>
                    <view class="fs-28 iconfont icon-cuo" @tap.stop="close"></view>
                </view>


                <view class="content-box" style="padding:30rpx;">
                    <!-- 选择购买的礼物 -->
                    <view class="flex flex-x-b">
                        <view class="flex">
                            <view class="img-box flex flex-x-y">
                                <image :src="gift_goods.front" style="width:112rpx;height:112rpx;" mode=""></image>
                            </view>
                            <view class="flex-y flex-x-b ml-20 pt-20 pb-20">
                                <view class="fs-30 blod">{{ gift_goods.giftName }}</view>
                                <view class="fs-28" style="color:#F8791A;">{{ gift_goods.unitPrice }} 信币</view>
                            </view>
                        </view>
                        <view class="flex flex-x-y">
                            <uni-number-box v-model="num"></uni-number-box>
                        </view>
                    </view>
                    <view class="flex flex-x-b mt-30">
                        <view class="fs-30 blod">选择支付方式</view>
                        <view class="fs-28 color-999999">1信币=1元人民币</view>
                    </view>

                    <view class="flex flex-x-b" style="flex-wrap:wrap;">
                        <view @tap="choose_pay(index)" class="pay-way flex flex-x-start flex-y-center mt-20" style="padding-left:80rpx;" :style="{border: active === index ? '2rpx solid #f8791a' : '2rpx solid #ebebeb'}" v-for="(item,index) in pay_arr" :key="index">
                            <image :src="item.logo" style="width:51rpx;height:51rpx;" mode=""></image>
                            <view class="fs-30 ml-20" :style="{color: active === index ? '2rpx solid #f8791a' : '2rpx solid #ebebeb'}">{{ item.name }}</view>
                        </view>
                    </view>

                    <!-- <view class="flex flex-y-center mt-40 mb-30">
                        <view v-if="current" class="current-box flex flex-x-y" style="background:#F8791A;" @tap.stop="changeCurrent">
                            <image src="../../static/images/dui.png" style="width:18rpx;height:13rpx;" mode=""></image>
                        </view>
                        <view v-else class="current-box" @tap.stop="changeCurrent"></view>
                        <view class="fs-26" @tap.stop="changeCurrent">同意</view>
                        <view class="fs-26" style="color:#F8791A;">《付费内容购买协议》</view>
                    </view> -->
					<view class="" style="height:70rpx;"></view>
                    <view class="pay-btn-sure bg-blue"  @tap.stop="to_pay">支付{{ total ? '￥' + total : '' }}</view>
                    <!-- <view v-if="!current" class="pay-btn-sure bg-blue" style="background-color:#dadce0;" @tap.stop="to_pay">支付{{ total ? '￥' + total : '' }}</view> -->
                    <view :style="{height:safeArea}" class="mt-20"></view>
                </view>

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
                gift_goods:{},
				price: '',
                active: 0,
                current: false,
                num:1
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
			console.log('111');
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
					// res.data[0].checked = true;
					this.pay_arr = res.data;
				}
			});
		},
        computed: {
            total() {
                return this.gift_goods.unitPrice * this.num || ''
            }
        },
		methods: {
			open(obj = {}) {
				if(this.pay_arr.length === 0) return this.showToast('没有配置该环境的支付方式，无法支付！')
				// if(!obj.price) return
				// this.price = obj.price || '';
				this.obj = obj;
                this.gift_goods = obj.gift_goods || {}
				this.num = 1
				this.$refs.pay.open();
			},
			close() {
				this.$refs.pay.close();
			},
			choose_pay(index) {
                this.active = index
				this.pay_arr = this.clone(this.pay_arr);
			},
			to_pay(pw = '') {
                // if(!this.current) return this.showToast('请勾选付费内容购买协议后再支付')
				let pay_id = this.pay_arr[this.active]
				this.close();
				console.log('pay_id', pay_id);
				this.obj.success & this.obj.success(this.gift_goods.id, Number(this.total), pay_id, this.num);
			},
			success_pw(pw) {
				this.to_pay(pw);
			},
            changeCurrent() {
                this.current = !this.current
            }
			
		},

	}
</script>

<style lang="scss">
	.pay-btn-sure {
		margin: 20rpx auto 40rpx auto;
		height: 88rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 34rpx;
	}
    .img-box {
        width: 146rpx;
        height:146rpx;
        border-radius: 20rpx;
        background-color: #f4f6f8;
    }
    .pay-way {
        width: 320rpx;
        height:87rpx;
        border: 10rpx;
        border-radius: 10rpx;
    }
    .current-box {
        width: 24rpx;
        height: 24rpx;
        border-radius: 5rpx;
        margin-right: 20rpx;
        background-color: #eff1f4;
    }
</style>