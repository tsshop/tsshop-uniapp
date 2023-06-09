<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="直播详情" :titleBold="false"></custom>
        <view class="" style="padding:30rpx">
            <view class="content-box">
                <view class="form-item flex flex-x-b">
                    <view class="flex">
                        <view class="fs-26 blod">直播封面</view>
                    </view>
                    <view class="" style="width:137rpx;height:137rpx;">
                        <image :src="liveInfo.url" style="width:137rpx;height:137rpx;border-radius:10rpx;" mode=""></image>
                    </view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">直播标题</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.title }}</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">直播描述</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.describes }}</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">开播时间</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ dateFormat('YYYY-mm-dd HH:MM:SS',new Date(liveInfo.startTime)) }}</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">直播时长</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.between }}</view>
                </view>
            </view>
            <view class="content-box mt-30">
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">订单数量</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.orderNum || 0 }}  (个)</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">订单收益</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.orderProfit || 0 }}  (元)</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">礼物数量</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.giftNum || 0}}  (个)</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">礼物收益</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.giftProfit || 0 }}  (元)</view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">点赞数量</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.praiseNum || 0 }}  (个)</view>
                </view>
                <!-- <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">连麦数量</view>
                    <view class="flex-1 fs-26" style="text-align:right">{{ liveInfo.linkNum || 0 }}  (个)</view>
                </view> -->
                
            </view>
            <view class="fs-36 blod mt-30 mb-20" v-if="liveInfo.goodsList.length > 0">本场商品</view>

            <view class="" v-for="(item,index) in liveInfo.goodsList" :key="index">
                <goods-list-item :goods="item" :mode="3"></goods-list-item>
            </view>
        </view>
        
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappPrepare',
    data() {
        return {
            id:null,
            liveInfo: {
                goodsList:[]
            },
        };
    },
    onLoad({id}) {
        this.id = id
        this.getInfo()
    },
    
    methods: {
        changeCheck(value) {
            let goods = this.liveInfo.typeList.find(item =>item.id === value.id)
            goods.check = true
        },
        getInfo() {
            this.request({
                url:'/live/liveView',
                methods:'get',
                data: {
                    id:this.id
                }
            }).then(res => {
                if(res.status!== 200) return 
                console.log('res',res);
                this.liveInfo = res.data
            })
        },
    },
};
</script>

<style lang="scss">
page{
    background-color: $livePage;
}
.content-box {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    .form-item {
        padding: 30rpx 0rpx;
        border-bottom: 0.5px solid #efefef;
        &:nth-last-child(1) {
            border:0;
        }
        .text-box {
            height:210rpx;
            background-color: #F5F6F8;
            border-radius: 20rpx;
            padding: 10rpx;
        }
    }
}
.store-btn {
    margin-top: 60rpx;
    width: 100%;
    height:84rpx;
    background-color: #F8791A;
    color: #ffffff;
    border-radius: 15rpx;
    font-size: 28rpx;
}
.no-check-type {
    height: 45rpx;
    background: #F9FAFA;
    border: 1px solid #C9C9C9;
    border-radius: 5rpx;
    padding:10rpx 20rpx;
    margin-right:10rpx;
    margin-bottom: 20rpx;
    color:#999999;
}
.check-type {
    border-color:#FD7747;
    background-color: #FFF8F5;
    color:#F8791A;
}
</style>