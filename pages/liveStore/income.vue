<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="我的收益" :titleBold="false"></custom>
        <view class="" style="padding:30rpx">
            <view class="card-1 flex flex-x-b">
                <view class="flex-y flex-x-a">
                    <view class="fs-28 blod">可提现金额</view>
                    <!-- <view class="blod" style="font-size:56rpx;">￥{{incomeInfo.liveStoreIncome}} </view> -->
                    <view class="flex flex-y-center">
                        <view class="blod" style="font-size:56rpx;">￥</view>
                        <countUp :num="live_store_info.amt" height="60" width="35" fontSize='56'></countUp>
                    </view>
                </view>
                <view class="flex flex-y-center">
                    <view class="btn flex flex-x-y fs-26" @tap.stop="toPage('/pages/liveStore/cashOut','',true)">提现</view>
                </view>
            </view>

            <!-- 收益统计 -->
            <view class="mt-30 flex flex-x-b flex-y-center">
                <view class="fs-36 blod">收益统计</view>
                <view class="">
                    <lw-live-date @onSubmit="onSubmit"></lw-live-date>
                </view>
            </view>

            <view class="mt-30 flex flex-x-b flex-y-center">
                <view class="card-2 flex-y flex-x-a">
                    <image src="../../static/liveStore/gift1.png" style="width:42rpx;height:42rpx;" mode=""></image>
                    <view class="fs-28 color-999999">礼物收益(元)</view>
					<countUp :num="incomeInfo.giftIncome" height="60" width="35" fontSize='56'></countUp>
                </view>
                <view class="card-2 flex-y flex-x-a">
                    <image src="../../static/liveStore/order1.png" style="width:42rpx;height:42rpx;" mode=""></image>
                    <view class="fs-28 color-999999">订单收益(元)</view>
                    <countUp :num="incomeInfo.orderIncome" height="60" width="35" fontSize='56'></countUp>
                </view>
            </view>

            <view class="income-list mt-30">
                <view class="list-top flex flex-x-b">
                    <view class="fs-30 blod">收益明细</view>
                    <view class="flex flex-y-center" @tap.stop="openChoose" style="position:relative;">
                        <view class="mr-10 fs-26" style="color:#FD7747">{{ showValue }}</view>
                        <view class="iconfont icon-zuojiantoubeifen-copy fs-26 current" :class="{isCurrent:isOpen}" style="color:#FD7747"></view>
                        <view class="year-list" :class="{'active-list': isOpen}">
                            <view class="year-item" :style="{color:incomeType === null ? '#fb6b3a' : ''}" @tap.stop="changeActive(null)">全部</view>
                            <view class="year-item" :style="{color:incomeType === 0 ? '#fb6b3a' : ''}" @tap.stop="changeActive(0)">礼物</view>
                            <view class="year-item" :style="{color:incomeType === 1 ? '#fb6b3a' : ''}" @tap.stop="changeActive(1)">订单</view>
                        </view>
                    </view>
                </view>
                <view class="flex flex-x-b flex-y-center mt-30" v-for="(item,index) in list" :key="index">
                    <view class="flex flex-y-center">
                        <image :src="getOrderType(item.incomeType).img" style="width:73rpx;height:73rpx;" mode=""></image>
                        <view class="flex-y flex-x-b ml-20" >
                            <view class="fs-28 blod">{{ getOrderType(item.incomeType).name }}</view>
                            <view class="fs-26 color-999999">{{ dateFormat('YY-mm-dd HH:MM', new Date(item.createTime)) }}</view>
                            
                        </view>
                    </view>
                    <view class="fs-32 blod" style="color:#FD7747;">¥{{ item.amt }}</view>
                </view>
                <qq-footer :show="is_null" :list="list"></qq-footer>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappIncome',

    data() {
        return {
            isOpen: false,
            incomeType: null,
            list:[], //商城列表
            page:1,
            is_null: false,
            date:{
                year:null,
                month:0
            },
            incomeInfo:{
                liveStoreIncome:''
            }
        };
    },

    computed: {
        showValue() {
            return { null:'全部','0':'礼物','1':'订单' }[this.incomeType]
        }
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
        changeActive(status) {
            this.openChoose()
            if(this.incomeType === status) return
            this.incomeType = status
            this.init()
        },
        openChoose() {
            this.isOpen = !this.isOpen
        },
        getOrderType(type= 0) {
            return [{name:"礼物收益",img:require('../../static/liveStore/gift2.png')},{name:"订单收益", img:require('../../static/liveStore/order2.png')}][type]
        },
        onSubmit(date) {
            this.date = date
            this.getInfo()
        },
        getInfo() {
            this.request({
                url: '/liveStoreIncome/count',
                method: 'post',
                data: this.date
            }).then(res => {
                if (res.status === 200) {
                    this.incomeInfo = res.data
                }
            });
        },
        getList() {
            this.request({
                url: '/liveStoreIncome/list',
                method: 'post',
                data: {
                    incomeType: this.incomeType,
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
            this.getInfo()
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
.income-list {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    .list-top {
        padding-bottom: 30rpx;
        border-bottom:0.5px solid #efefef;
    }
}
.current {
    transition: all 0.5s;
    transform-origin: 14rpx 16rpx;
}
.isCurrent {
    transform: rotate(-180deg);
    
}
.year-list {
    position: absolute;
    width: 150rpx;
    height: 0;
    top: 50rpx;
    left:50%;
    transform: translateX(-50%);
    border-radius: 20rpx;
    background: linear-gradient(108deg, #F9FAFB 0%, #FFFFFF 100%);
    box-shadow: 11rpx 10rpx 9rpx 1rpx rgba(50,71,93,0.04);
    transition: all 0.2s linear;
    overflow: hidden;
    opacity: 0;
}
.active-list {
    padding: 10rpx;
    height: 180rpx;
    opacity: 1;
}
.year-item {
    height:50rpx;
    text-align: center;
    line-height: 60rpx;
}
</style>