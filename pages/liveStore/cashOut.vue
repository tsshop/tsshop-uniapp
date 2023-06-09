<template>
  <view class="">
    <custom fixed="fixed" background="#ffffff" mode="2" title="提现" :titleBold="false">
        <template #right>
            
            <view class="" style="position:relative">
                <view class="top-value fs-26 flex flex-x-end" @tap.stop="toPage('/pages/liveStore/cashRecord','',true)">提现记录</view>
            </view>
        </template>
    </custom>

    <view class="" style="padding:30rpx;">
        <view class="fs-30">可提现金额（元）</view>
        <view class="flex flex-y-end" style="height:90rpx;">
            <view class="blod" style="font-size:40rpx;height: 40rpx;line-height:40rpx;">￥</view>
            <view class="blod" style="font-size:70rpx;height:56rpx;line-height:57rpx;"> {{ live_store_info.amt }}</view>
        </view>

        <view class="card mt-40 flex-y flex-x-b">
            <view class="fs-30">提现金额</view>
            <view class="flex flex-x-b flex-y-end" style="padding-bottom:20rpx;border-bottom:0.5px solid #efefef;">
                <view class="blod" style="font-size:60rpx;height:60rpx;line-height:44rpx;">￥</view>
                <view class="flex-1">
                    <input type="number" v-model="form.cashWithdrawalAmount" style="font-size:60rpx;height:60rpx;line-height:60rpx;">
                </view>
                <view class="fs-26" style="color:#FD7747;height:50rpx;" @tap.stop="allCashOut">全部提现</view>
            </view>
        </view>

        <view class="flex flex-y-center" style="margin-top:80rpx;">
            <view class="mr-20" style="width: 8rpx;height:32rpx;background: #FD7747;"></view>
            <view class="fs-34 blod">请选择提现方式</view>
        </view>

        <view class="flex flex-x-b" :class="{'flex-x-start': pay_arr.length < 3}" style="flex-wrap:wrap;">
            <view @tap.stop="changeActive(index)" class="pay-item flex flex-x-y mt-30 mr-10" :class="{active: active === index}" v-for="(item,index) in pay_arr" :key="index">
                <view class="current">
                    <view class="current-item">
                        <image src="../../static/images/dui.png" style="width:100%;height:100%;" mode=""></image>
                    </view>
                </view>
                <image :src="item.logo" style="width:46rpx;height:46rpx;" mode=""></image>
                <view class="fs-28 blod ml-10">{{ item.name }}</view>
            </view>
        </view>

        <view class="flex flex-y-center" style="margin-top:50rpx;">
            <view class="mr-20" style="width: 8rpx;height:32rpx;background: #FD7747;"></view>
            <view class="fs-34 blod">请选择提现账户</view>
        </view>
        <view class="" v-if="cashAccountList.length >0">
            <view class="account-item flex flex-x-b flex-y-center mt-30" v-for="(item,index) in cashAccountList" :key="index" @tap.stop="onChange(index)">
                <view class="">
                    <view class="fs-32 blod">{{ item.fullName }}</view>
                    <view class="mt-10 fs-26 color-999999">账户类型：{{ item.accountType }}</view>
                    <view class="mt-5 fs-26 color-999999">提现账号：{{ item.accountNumber }}</view>
                </view>
                <view class=""  >
                    <view v-if="currentIndex === index" class="cuurent-1"></view>
                    <view v-else class="no-current"></view>
                </view>
            </view>
        </view>
        <view class="flex flex-x-b flex-y-center mt-30" style="padding:30rpx;background:#ffffff;border-radius:20rpx;" @tap.stop="toPage('/pages/liveStore/cashAccount','',true)" v-else>
            <view class="fs-28 blod">收款账户</view>
            <view class="iconfont icon-jinru fs-28"></view>
        </view>
        



    </view>
    <view class="" style="height:150rpx;"></view>
    <fixed-bottom>
        <view class="" style="padding:30rpx 60rpx;">
            <view class="store-btn flex flex-x-y blod" @tap.stop="onSave">提现</view>
        </view>
    </fixed-bottom>
    <toast ref="toast"></toast>
  </view>
</template>

<script>
export default {
    data() {
        return {
            pay_arr:[],
            active:0,
            codeImg:'',
            form: {
                cashWithdrawalAmount:'',
                withdrawalsAccountId:null,
                payType:null,
                payThoroughfareId:null
            },
            cashAccountList:[],
            currentIndex: 0
        };
    },
    created() {
        
    },
    computed: {
        accountType() {
            return this.pay_arr[this.active]?.type || ''
        }
    },
    onLoad() {
        uni.$off('update_account_list')
        uni.$on('update_account_list',this.getCashType)
        this.getCashType()
        
    },
    methods: {
        onSave() {
            if(!this.form.cashWithdrawalAmount) return this.showToast('请输入正确的提现金额')
            if(this.form.cashWithdrawalAmount > this.live_store_info.amt) return this.showToast('提现金额不能大于可提现金额')
            if(!this.form.withdrawalsAccountId) return this.showToast('请选择提现账户')
            this.$refs.toast.open({
					desc: '确定进行提现操作吗？',
					left: '我再想想',
					right: '提现',
					success: () => {
						this.less(() => {
							this.request({
								url: '/liveStore/cashOut',
                                method: 'post',
                                data:this.form
							}).then(res => {
                                if(res.status !== 200) return
                                this.showToast('提现成功')
                                this.form.cashWithdrawalAmount = null
                                this.$nextTick(() => {
                                    this.$store.dispatch('refresh_live_stroe_info')
                                });
							});
						})
					}
				});
        },
        onChange(index) {
            this.currentIndex = index
            let { payThoroughfareId, type } = this.pay_arr[this.active]
            let withdrawalsAccountId = this.cashAccountList[index].id
            this.form = {
                ...this.form,
                withdrawalsAccountId,
                payType: type,
                payThoroughfareId
            }
        },
        allCashOut() {
            this.form.cashWithdrawalAmount = this.live_store_info.amt
        },
        getCashType() {
			this.request({
				url:'/liveStoreWithdrawalsAccount/accountType'
			}).then(res => {
				if(res.status !== 200) return
				console.log('res',res);
				this.pay_arr = res.data
                this.getList()
			})
		},
        changeActive(index) {
            if(this.active === index) return 
            this.active = index
            this.accountType = this.pay_arr[index].type
            this.currentIndex = 0
        },
        getList() {
            this.request({
                url:'/liveStoreWithdrawalsAccount/getAccount',
                data: {
                    accountType: this.accountType
                }
            }).then(res => {
                if(res.status !== 200) return
                this.cashAccountList = res.data
                this.onChange(this.currentIndex)
            })

        }
        
    },
    
}
</script>

<style lang="scss">
page {
    background-color:#F8F8F8;
}
.top-value {
    position: absolute;
    width: 140rpx;
    top:-20rpx;
    right:-40rpx;
}
.card {
    height:300rpx;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 30rpx 30rpx 50rpx 30rpx;
    box-shadow: 0rpx 0rpx 9rpx 1rpx rgba(0,0,0,0.03);
}
.pay-item {
    padding:10rpx 40rpx;
    background: #FFFFFF;
    border: 1px solid #CECECE;
    border-radius: 10rpx;
}
.active {
    border: 1px solid #FD7747;
    position: relative;
    overflow: hidden;
}
.current {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 19rpx solid transparent;
    border-bottom: 19rpx solid transparent;
    border-top: 19rpx solid #FD7747;
    border-right: 19rpx solid #FD7747;
    right:0;
    top: 0;
    .current-item {
        position: absolute;
        width: 14rpx;
        height: 10rpx;
        right:-15rpx;
        top:-15rpx;
        z-index: 999;
    }
}

.account-item {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
}
.cuurent-1 {
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
.store-btn {
    margin-top: 60rpx;
    width: 100%;
    height:84rpx;
    background-color: #F8791A;
    color: #ffffff;
    border-radius: 84rpx;
    font-size: 28rpx;
    
}
</style>