<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="礼物记录" :titleBold="false"></custom>
        <view class="tab fixed" :style="{top:customBar}">
            <qq-tabs :list="tabs" :mode="2" @change="changeTab"></qq-tabs>
        </view>
        <view class="" style="padding:30rpx">
            <view class="record-list">
                <view class="list-item flex flex-x-b" v-for="(item,index) in list" :key="index">
                    <view class="flex-y flex-x-center flex-y-start">
                        <view class="fs-30 blod">{{ item.giftName }}</view>
                        <view class="fs-26 color-999999" v-if="active === 0">{{ item.buyTime }}</view>
                        <view class="fs-26 color-999999" v-if="active === 0">订单号：{{ item.orderNo }}</view>
                        <view class="fs-26 color-999999" v-if="active === 1">{{ item.createTime }}</view>
                    </view>
                    <view class="flex-y flex-x-b flex-y-end" v-if="active === 0">
                        <view class="fs-26">x{{ item.quantity }}</view>
                        <view class="fs-38 blod" style="color:#FD7747;">￥ {{ item.totalAmount }}</view>
                    </view>
                    <view class="fs-38 blod flex flex-x-y" style="color:#FD7747;" v-else>-{{ item.number }}</view>
                </view>
            </view>
        </view>
        <qq-footer :show="is_null" :list="list"></qq-footer>
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappRecord',

    data() {
        return {
            customBar: getApp().globalData.customBar + 'px',
            tabs: [
                {
                    name:'购买礼物',
                    api:'/liveGift/buyRecord'
                },
                {
                    name:'使用记录',
                    api:'/liveGiftDetail/list'
                }
            ],
            active:0,
            list:[], 
            page:1,
            is_null: false,
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
    onLoad() {
        this.getList()
    },

    methods: {
        changeTab(index) {
            this.active = index
            this.init()
        },
        getList() {
            this.request({
                url: this.tabs[this.active].api,
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
    background-color: #f6f6f6;
}
.tab {
    background-color: #fff;
    padding: 0 150rpx;
}
.record-list {
    width: 100%;
    background-color: #fff;
    border-radius: 30rpx;
}
.list-item {
    padding: 30rpx;
    border-bottom: 0.5px solid #efefef;
    &:nth-last-child(1) {
        border:0
    }
}
</style>