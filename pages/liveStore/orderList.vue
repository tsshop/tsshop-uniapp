<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="订单列表" :titleBold="false"></custom>
        <view class="tab fixed" :style="{top:customBar}">
            <qq-tabs :list="tabs" :mode="2" @change="changeTab"></qq-tabs>
        </view>

        <view class="" style="padding:20rpx;">
            <search :radius="10" placeholder="搜索订单" @search="onSearch"></search>
            <view class="" v-for="(item,index) in list" :key="index">
                <view class="order-item">
                    <view class="flex flex-x-b">
                        <view class="fs-28 color-999999">订单号：{{ item.orderNo }} </view>
                        <view class="fs-28" :style="{color: item.orderStatus === 3 ? '#999999' : '#FD7747'}">{{ tabs[item.orderStatus].name }}</view>
                    </view>
                    <view class="flex flex-x-b mt-30">
                        <view class="mr-30">
                            <image :src="item.src" style="width:153rpx;height:153rpx;broder-radius:10rpx;background-color: #f4f4f4;" mode=""></image>
                        </view>
                        <view class="flex-y flex-x-b">
                            <view class="flex">
                                <view class="fs-26 ellipsis">{{ item.goodsName }}</view>
                                <view class="fs-26 blod ml-20">￥{{ item.price }}</view>
                            </view>
                            <view class="flex flex-x-b flex-y-center">
                                <view class="sku fs-26 flex flex-x-y color-999999">{{ item.sku }}</view>
                                <view class="flex flex-x-y">
                                    <view class="iconfont icon-cuo fs-26 blod color-666666" style="transform:scale(0.8)"></view>
                                    <view class="fs-26 blod color-666666">{{ item.quantity }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="flex flex-x-b flex-y-center mt-30">
                        <view class="fs-26">{{ dateFormat('YYYY-mm-dd HH:MM:SS',new Date(item.createTime)) }}</view>
                        <view class="fs-28 blod" style="color:#F8791A;">金额：{{ item.totalAmount }}</view>
                    </view>
                </view>
            </view>
        </view>
        <qq-footer :show="is_null" :list="list"></qq-footer>
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappOrderList',

    data() {
        return {
            customBar: getApp().globalData.customBar + 'px',
            tabs: [
                {
                    name:'待付款'
                },
                {
                    name:'待发货'
                },
                {
                    name:'待收货'
                },
                {
                    name:'已完成'
                },
                // {
                //     name:'已退款'
                // }
            ],
            active:0,
            list:[], //商城列表
            page:1,
            keyword:'',
            is_null: false,
        };
    },
    onLoad() {
        this.getList()
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
    methods: {
        onSearch(keyword) {
            this.keyword = keyword
            this.init()
        },
        changeTab(index) {
            this.active = index
            this.init()
        },
        getList() {
            this.request({
                url: '/liveStore/orderList',
                method: 'post',
                data: {
                    keyword: this.keyword,
                    pageNumber: this.page,
                    pageSize: 10,
                    orderStatus: this.active
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
page{
    background-color: $livePage;
}
.tab {
    background-color: #fff;
    padding: 0 20rpx;
    padding-left: 30rpx;
}
.order-item {
    background: #FFFFFF;
    border-radius: 15rpx;
    padding: 20rpx;
    margin-top: 20rpx;
}
.sku {
    height: 47rpx;
    background: #F4F4F4;
    border-radius: 24rpx;
    padding: 10rpx 20rpx;
}

</style>