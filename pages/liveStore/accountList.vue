<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="我的账户" :titleBold="false">
            <template #right>
                <view class="" style="position:relative">
                    <view class="top-value fs-26 flex flex-x-end" @tap.stop="changeEdit('')">{{ topValue }}</view>
                </view>
            </template>
        </custom>
        <view class="" style="padding:30rpx">
            <view class="account-item flex flex-x-b flex-y-center mb-30" v-for="(item,index) in list" :key="index" @tap.stop="onChange(item)">
                <view class="">
                    <view class="fs-32 blod">{{ item.fullName }}</view>
                    <view class="mt-10 fs-26 color-999999">账户类型：{{ item.accountType }}</view>
                    <view class="mt-5 fs-26 color-999999">提现账号：{{ item.accountNumber }}</view>
                </view>
                <view class="" v-if="topValue === ''" >
                    <view v-if="item.check" class="cuurent"></view>
                    <view v-else class="no-current"></view>
                </view>
            </view>
			<qq-footer text="" :show="true" :list="list"></qq-footer>
        </view>
        <view class="" style="height:180rpx;"></view>
        <fixed-bottom>
            <view class=""  style="padding:30rpx;background:#f4f6f8;">
                <view v-if="topValue === '编辑'" class="store-btn flex flex-x-y blod fs-28" @tap.stop="toPage('/pages/liveStore/cashAccount','',true)"> + 添加账户</view>
                <view v-else class="flex flex-x-b flex-y-center">
                    <view class="bottom-btn flex flex-x-y" @tap.stop="changeEdit('编辑')">完成</view>
                    <view class="bottom-btn flex flex-x-y" style="background:#ED4529;" @tap.stop="onDel">删除</view>
                </view>
            </view>
        </fixed-bottom>
        <toast ref="toast"></toast>
    </view>
</template>

<script>
export default {
    name: 'cashList',

    data() {
        return {
            topValue:'编辑',
            list:[]
        };
    },

    mounted() {
        
    },
    onLoad() {
        this.getList()  
        uni.$off('update_account_list')
        uni.$on('update_account_list',this.getList)
    },
    computed: {
        ids() {
            return this.list.filter(item => item.check).map(item => item.id) || []
        }
    },

    methods: {
        onDel() {
            if(this.ids.length === 0) return this.showToast('请选择要删除的账户')
            this.$refs.toast.open({
					desc: '确定删除选中账户？',
					left: '我再想想',
					right: '删除',
					success: () => {
						this.less(() => {
							this.request({
								url: '/liveStoreWithdrawalsAccount/del',
                                method: 'post',
                                data: {
                                    ids:this.ids
                                }
							}).then(res => {
                                if(res.status !== 200) return
                                this.showToast('删除成功')
                                this.list = this.list.filter(item => !this.ids.includes(item.id))
							});
						})
					}
				});
        },
        changeEdit(value) {
            this.topValue = value
            this.list.forEach(item => {
                item.check = false
            })
        },
        onChange(item) {
            item.check = !item.check
        },
        getList() {
            this.request({
                url:'/liveStoreWithdrawalsAccount/getAccount'
            }).then(res => {
                if(res.status !== 200) return
                this.list = res.data.map(item => {
                    return {
                        ...item,
                        check:false
                    }
                })
            })

        }
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
.account-item {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
}
.cuurent {
    width: 30rpx;
    height:30rpx;
    border-radius: 50%;
    background-color: #fff;
    border: 8rpx solid #F8791A;
}
.no-current {
    width: 30rpx;
    height:30rpx;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #CFCFCF;
}
.bottom-box {
    background-color: #fff;
    height:168rpx;
}
.store-btn {
    width: 100%;
    height:84rpx;
    background-color: #F8791A;
    color: #ffffff;
    border-radius: 15rpx;
    font-size: 28rpx;
}

.bottom-btn {
    width: 333rpx;
    height: 84rpx;
    background: #FD7747;
    border-radius: 15rpx;
    color:#fff
}
</style>