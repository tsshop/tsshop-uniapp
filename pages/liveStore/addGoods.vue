<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="添加商品" :titleBold="false"></custom>

        <view class="" style="padding:20rpx;">
            <search :radius="10" placeholder="搜索产品" @search="onSearch"></search>
            <view class="" v-for="(item,index) in list" :key="index">
                <goods-list-item :goods="item" :mode="1" @changeCheck="changeCheck"></goods-list-item>
            </view>
        </view>
        <qq-footer :show="is_null" :list="list"></qq-footer>
        <fixed-bottom>
            <view class="bottom-box" style="padding:30rpx;">
                <view class="flex flex-x-b flex-y-center">
                    <view class="flex">
                        <!-- <view class="flex flex-y-center mr-30" @tap.stop="changeCheck">
                            <view v-if="check" class="current flex flex-x-y" style="border-color:#F46656;">
                                <view class="current-item"></view>
                            </view>
                            <view v-else class="current"></view>
                            <view class="ml-20 fs-30">全选</view>
                        </view> -->
                        <view class="fs-30" style="color:#F46656;">已选：{{total}}</view>
                    </view>
                    <view class="xj-btn flex flex-x-y" style="background:#F8791A;" @tap.stop="onSubmit">确认添加</view>
                </view>
            </view>
        </fixed-bottom>

        
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappGoodsList',

    data() {
        return {
            customBar: getApp().globalData.customBar + 'px',
            tabs: [
                {
                    name:'已上架'
                },
                {
                    name:'未上架'
                }
            ],
            list:[], //商城列表
            page:1,
            keyword:'',
            is_null: false,
            active:0,
            mode:2,
            currentIds:[]
        };
    },
    computed: {
        
        total() {
            return this.currentIds.length
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
        changeCheck(goods) {
            console.log('goods',goods);
            let check = goods.check
            if(check) {
                this.currentIds.push(goods.id)
            } else {
                this.currentIds = this.currentIds.filter(item => item !== goods.id)
            }
        },
        onSearch(keyword) {
            this.keyword = keyword
            this.init()
        },
        onSubmit() {
            if(this.total === 0) return this.showToast('请选择要添加的商品')
            this.request({
                url: '/liveStoreGoods/addGoods',
                method: 'post',
                data: {
                    goodsIds:this.currentIds
                }
            }).then(res => {
                if (res.status === 200) {
                    this.showToast('添加成功')
                    this.uniBack()
                    uni.$emit('update_goods')
                }
            });
        },
        changeTab(index) {
            this.active = index
            this.mode = [2,1][index]
        },
        getList() {
            this.request({
                url: '/goods/liveStore/getList',
                method: 'post',
                data: {
                    keyword: this.keyword,
                    pageNumber: this.page,
                    pageSize: 10
                }
            }).then(res => {
                if (res.status === 200) {
                    let list = res.data.list.map(item => {
                        if(this.currentIds.includes(item.id)) {
                            return {
                                ...item,
                                check:true
                            }
                        } else {
                            return {
                                ...item,
                                check:false
                            }
                        }
                        
                    })
                    this.list = [...this.list, ...list]
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
.bottom-box {
    background-color: #fff;
    height:168rpx;
}
.current {
    width: 31rpx;
    height:31rpx;
    border-radius: 50%;
    border: 1px solid #999999;
    .current-item {
        width: 20rpx;
        height:20rpx;
        background-color: #F8791A;
        border-radius: 50%;
    }
}
.sj-btn {
    width: 200rpx;
    height: 74rpx;
    background: #F8791A;
    border-radius: 15rpx;
    color:#fff;
}
.xj-btn {
    width: 180rpx;
    height: 74rpx;
    background: #F46656;
    border-radius: 15rpx;
    color:#fff;
}
</style>