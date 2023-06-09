<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="直播小店" :titleBold="false"></custom>
        <view class="" style="height:150rpx;"></view>
        <view class="flex-y flex-x-y">
            <image :src="pageInfo.url" style="width:339rpx;height:339rpx;" mode=""></image>
            <view class="fs-40">{{ pageInfo.statusText }}</view>
            <view v-if="status !=2" class="fs-28 color-999999 mt-30">{{ pageInfo.tip }}</view>
            <view v-else class="fs-28 color-999999 mt-30">{{ failReason }}</view>
        </view>
        <fixed-bottom >
            <view class="" style="padding:30rpx;" v-if="pageInfo.open">
                <view class="store-btn flex flex-x-y blod" @tap.stop="toPage('/pages/liveStore/authentication','3')">主播认证</view>
            </view>
        </fixed-bottom>
        
    </view>
</template>

<script>
import fixedBottom from '../../components/fixed-bottom/fixed-bottom.vue';
export default {
  components: { fixedBottom },
    name: 'TsshopUniappFirstEntry',

    data() {
        return {
            types: [
                {
                    url: require('../../static/liveStore/examine1.png'),
                    statusText: '请完成主播认证',
                    tip:'完成主播认证后才可以开播哦',
                    open: true,
                },{
                    url: require('../../static/liveStore/examine2.png'),
                    statusText: '审核中',
                    tip:'主播认证正在审核中',
                    open: false,
                },{
                    url: require('../../static/liveStore/examine3.png'),
                    statusText: '申请失败',
                    tip:'如有疑问请点击意见反馈联系我们',
                    open: true,
                }
            ],
            status: 0,
            failReason:'',
        };
    },

    computed: {
        pageInfo() {
            return this.types[this.status] || {}
        }
    },

    onLoad({status,failReason}) {
        this.status = status
        if(failReason) {
            this.failReason = failReason
        }
        
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="scss">
page {
    background-color: #f4f6f8;
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

</style>