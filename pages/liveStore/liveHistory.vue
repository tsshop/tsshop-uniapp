<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="直播历史" :titleBold="false"></custom>
        <view class="" style="padding:30rpx">
            
            <!-- 直播统计 -->
            <view class="mt-30 flex flex-x-b flex-y-center">
                <view class="fs-36 blod">直播统计</view>
                <view class="">
                    <lw-live-date @onSubmit="onSubmit1"></lw-live-date>
                </view>
            </view>

            <view class="mt-30 flex flex-x-b flex-y-center">
                <view class="card-2 flex-y flex-x-a">
                    <image src="../../static/liveStore/gift1.png" style="width:42rpx;height:42rpx;" mode="aspectFill"></image>
                    <view class="fs-28 color-999999">直播统计(场)</view>
                    <!-- <view class="blod" style="font-size:56rpx;">4601</view> -->
                    <countUp :num="info.sessionCount" height="60" width="35" fontSize='56'></countUp>
                </view>
                <view class="card-2 flex-y flex-x-a">
                    <image src="../../static/liveStore/order1.png" style="width:42rpx;height:42rpx;" mode="aspectFill"></image>
                    <view class="fs-28 color-999999">直播订单(单)</view>
                    <!-- <view class="blod" style="font-size:56rpx;">15680</view> -->
                    <countUp :num="info.orderCount" height="60" width="35" fontSize='56'></countUp>

                </view>
            </view>

            <!-- 直播历史 -->
            <view class="mt-30 flex flex-x-b flex-y-center">
                <view class="fs-36 blod">直播历史</view>
                <view class="">
                    <lw-live-date @onSubmit="onSubmit2"></lw-live-date>
                </view>
            </view>

            <view class="list-item mt-30 flex" v-for="(item,index) in list" :key="index" @tap.stop="toPage('/pages/liveStore/liveDetail?id=' + item.id,'',true)">
                <view class="" style="width:155rpx;height:155rpx;border-radius:20rpx;">
                    <image :src="item.url" style="width:100%;height:100%;border-radius:10rpx;"  mode="aspectFill"></image>
                </view>
                <view class="flex-y flex-x-b ml-20 flex-1">
                    <view class="">
                        <view class="fs-30 blod ellipsis-1">{{ item.title }}</view>
                        <view class="fs-24 color-999999 ellipsis">{{ item.describes }}</view>
                    </view>
                    <view class="fs-26 color-999999">{{ item.between }}</view>
                </view>
            </view>
            <qq-footer :show="is_null" :list="list"></qq-footer>
        </view>
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappIncome',

    data() {
        return {
            list:[],
            page:1,
            is_null: false,
            listDate:{
                month:0,
                year:2023
            },
            infoDate: {
                month:0,
                year:2023
            },
            info: {
                orderCount:0,
                sessionCount:0
            }
        };
    },

    onLoad() {
        // this.getList()
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
        getOrderType(type= 0) {
            return [{name:"礼物收益",img:require('../../static/liveStore/gift2.png')},{name:"订单收益", img:require('../../static/liveStore/order2.png')}][type]
        },
        onSubmit1(e) {
            this.infoDate = e
            this.getInfo()
        },
        onSubmit2(e) {
            this.listDate = e
            this.init()
        }, 
        getInfo() {
            this.request({
                url: '/live/myLiveLogStatistics',
                data: {
                    month: this.infoDate.month,
                    year: this.infoDate.year
                }
            }).then(res => {
                if(res.status!==200) return
                if(res.data) {
                    this.info = res.data
                }
            })
        },
        getList() {
            this.request({
                url: '/live/myLiveLogList',
                data: {
                    page: this.page,
                    size: 10,
                    month: this.listDate.month,
                    year: this.listDate.year
                }
            }).then(res => {
                if (res.status === 200) {
                    this.list = [...this.list, ...res.data.records]
                    if(res.data.records.length < 10) {
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
.card-1 {
    height: 181rpx;
    background: linear-gradient(108deg, #F9FAFB 0%, #FFFFFF 100%);
    box-shadow: 11rpx 10rpx 9rpx 1rpx rgba(50,71,93,0.04);
    border-radius: 30rpx;
    padding: 30rpx;
    .btn {
        width: 130rpx;
        height: 50rpx;
        background: #F8791A;
        border-radius: 21rpx;
        color:#fff;
    }
}
.card-2 {
    width: 334rpx;
    height: 241rpx;
    background: linear-gradient(108deg, #F9FAFB 0%, #FFFFFF 100%);
    box-shadow: 11rpx 10rpx 9rpx 1rpx rgba(50,71,93,0.04);
    border-radius: 30rpx;
    padding: 30rpx;
}

.list-item {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
}
.ellipsis-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1; /* 显示2行文本 */
}
</style>