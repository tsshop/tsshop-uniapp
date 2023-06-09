<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="我的礼物" :titleBold="false">
            <template #right>
                <view class="" style="position:relative">
                    <view class="top-value fs-26 flex flex-x-end" @tap.stop="toPage('/pages/liveGift/record','',true)">购买记录</view>
                </view>
            </template>
        </custom>
        <view class="" style="padding:20rpx;">
            <view class="list-item flex flex-x-b" v-for="(item,index) in list" :key="index">
                <view class="flex">
                    <view class="img-box flex flex-x-y">
                        <image :src="item.front" style="width:112rpx;height:112rpx;" mode=""></image>
                    </view>
                    <view class="flex-y flex-x-b ml-20">
                        <view class="fs-30 blod">{{ item.giftName }}</view>
                        <view class="fs-28" style="color:#F8791A;">{{ item.unitPrice }}信币</view>
                    </view>
                </view>
                <view class="flex-y flex-x-b flex-y-end">
                    <view class="fs-30">x{{ item.giftNum }}</view>
                    <view class="buy-btn fs-26 flex flex-x-y" v-if="!item.shelves" @tap.stop="gift_pay(item)">购买礼物</view>
                </view>
            </view>
        </view>
        <qq-footer :show="is_null" :list="list"></qq-footer>
        <gift-pay-list ref="giftPay"></gift-pay-list>
    </view>
</template>

<script>
import {start_pay} from '../../utils/pay'
export default {
    name: 'TsshopUniappMy',

    data() {
        return {
            list:[], //商城列表
            page:1,
            is_null: false,
			source:'',
        };
    },

    onPullDownRefresh() {
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 200);
		this.init();
	},
	onReachBottom() {
        if(this.is_null) return
		this.getList();
	},
    onLoad(e) {
		if(e.source){
			this.source = e.source;
		}
        this.getList()
    },

    methods: {
        gift_pay(item) {
            console.log(1);
            this.$refs.giftPay.open({
                gift_goods: item,
                success: (goodsId, price, detail, quantity) => {
						start_pay({
							pay: detail,
							price: Number(price),
                            order_id:'',
							params: {
                                url:'/order/create',
				                method: 'POST',
				                data: {
				                	goodsId,
				                	quantity,
				                	orderType:1 //0商品 1礼物
				                }
                            },
							success: () => {
								this.showToast('支付成功');
								this.pay_after(goodsId,quantity);
								if(this.source == 'live') uni.$emit('refresh_gift_list');
							},
							fail: () => {
								this.showToast('支付失败');
							}
						});
					}
            })
        },
        // 支付后事件
		pay_after(goodsId, quantity) {
            console.log('quantity',quantity);
            this.list.forEach(item => {
                if(item.id === goodsId) {
                    item.giftNum += quantity
                }
            })
            
		},
        getList() {
            this.request({
                url: '/liveGift/userGift',
                method: 'post',
                data: {
                    pageNumber: this.page,
                    pageSize: 10
                }
            }).then(res => {
                if (res.status === 200) {
                    this.list = [...this.list, ...res.data.list]
                    if(res.data.list.length < 10) {
                        this.is_null = true
                    } else {
                        this.page++
                    }
                }
            });
        },
        init() {
            this.setData({
                list:[],
                page:1,
                is_null: false
            })
            this.getList()
        },
    },
};
</script>

<style lang="scss">
page {
    background-color: #f4f6f8;
}
.top-value {
    position: absolute;
    width: 140rpx;
    top:-20rpx;
    right:-40rpx;
    color:#F8791A;
}
.list-item {
    background-color: #fff;
    border-radius: 20rpx;
    margin-top: 20rpx;
    padding: 20rpx;
    .img-box {
        width: 146rpx;
        height:146rpx;
        border-radius: 20rpx;
        background-color: #f4f6f8;
    }
    .buy-btn {
        width:140rpx;
        height:46rpx;
        background-color: #f8791a;
        border-radius: 7rpx;
        color:#fff;
    }
}
</style>