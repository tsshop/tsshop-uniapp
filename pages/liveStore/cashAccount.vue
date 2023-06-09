<template>
	<view>
		<custom title="添加账户" fixed="fixed"></custom>
		<view class="" style="padding:30rpx">
			<view class="record-list">
				<view class="list-item flex flex-x-b">
					<view class="flex-y flex-x-center flex-y-start">
						<view class="fs-26 blod">账户类型</view>
					</view>
					<view class="flex-y flex-x-center">
						<view class="flex flex-y-center" @tap.stop="openChoose" style="position:relative;">
							<view class="mr-10 fs-26" style="width:100rpx;text-align:center;">{{ showValue }}</view>
							<view class="iconfont icon-zuojiantoubeifen-copy fs-26 current" :class="{isCurrent:isOpen}" style=""></view>
							<view class="year-list" :class="{'active-list': isOpen}">
								<view class="year-item fs-26" v-for="(item,index) in cashType" :key="index" :style="{color:form.accountType === item.type ? '#fb6b3a' : ''}" @tap.stop="changeActive(item.type)">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="list-item flex flex-x-b">
					<view class="flex-y flex-x-center flex-y-start">
						<view class="fs-26 blod">{{ cashName }}账号</view>
					</view>
					<view class="flex-y flex-x-center">
						<input type="text" v-model="form.accountNumber" style="font-size:26rpx;text-align:right;" :placeholder="placeholderValue">
					</view>
				</view>
				<view class="list-item flex flex-x-b">
					<view class="flex-y flex-x-center flex-y-start">
						<view class="fs-26 blod">姓名</view>
					</view>
					<view class="flex-y flex-x-center">
						<input type="text" v-model="form.fullName" style="font-size:26rpx;text-align:right;" placeholder="请输入真实姓名">
					</view>
				</view>
				<view class="list-item flex flex-x-b">
					<view class="flex-y flex-x-center flex-y-start">
						<view class="fs-26 blod">手机号</view>
					</view>
					<view class="flex-y flex-x-center fs-26">{{ live_store_info.storePhone }}</view>
				</view>
				<view class="list-item flex flex-x-b flex-y-center">
					<view class="flex-y flex-x-center flex-y-start">
						<view class="fs-26 blod">验证码</view>
					</view>
					<view class="flex flex-x-end flex-y-center flex-1">
						<input @confirm="login_by_phone" class="" style="font-size:26rpx;text-align:right;" name='code' type="number" v-model="form.code"
							placeholder="输入验证码" placeholder-class="placeholderClass font"
							:adjust-position="false" />
						<view class="ml-20 mr-20" style="height:37rpx;width:2rpx;background:#DCDCDC;"></view>
						<verify :phone="live_store_info.storePhone" :url="'/liveStoreWithdrawalsAccount/getCode'" :sendMethod="'GET'" color="#F8791A"></verify>
					</view>
				</view>
				
			</view>
		</view>
		<fixed-bottom height="200rpx">
			<view class="" style="padding:30rpx;background:#f4f6f8;">
				<view class="store-btn flex flex-x-y blod" @tap.stop="save">完成
				</view>
			</view>
		</fixed-bottom>

	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				fullName:null,
				code:null,
				accountType:null,
				accountNumber:null
			},
			cashType:[],
			isOpen:false,
		}
	},
	onLoad() {
		this.getCashType()
	},
	computed: {
		cashName() {
			return this.cashType.find(item => item.type === this.form.accountType)?.name || ''
		},
		showValue() {
			return this.cashName || '请选择'
		},
		placeholderValue() {
			let name = this.cashName || '提现'
			return `请输入${name}账号`
		}
	},
	methods: {
		getCashType() {
			this.request({
				url:'/liveStoreWithdrawalsAccount/accountType'
			}).then(res => {
				if(res.status !== 200) return
				console.log('res',res);
				this.cashType = res.data
			})
		},
		openChoose() {
			this.isOpen = !this.isOpen
		},
		changeActive(type) {
			this.form.accountType = type
			this.openChoose()
		},
		save() {
			const {accountType, code, fullName, accountNumber } = this.form
			if(!accountType) return this.showToast('请选择账户类型')
			if(!accountNumber) return this.showToast('请输入账号')
			if(!fullName) return this.showToast('请输入真实姓名')
			if(!code) return this.showToast('请输入验证码')
			console.log('form', this.form);
			this.request({
				url:'/liveStoreWithdrawalsAccount/create',
				method:'post',
				data:this.form
			}).then(res => {
				if(res.status !== 200) return
				this.showToast('添加成功！')
				this.uniBack()
				uni.$emit('update_account_list')
			})
		}
	}
}
</script>

<style lang="scss">
page {
    background-color: #f6f6f6;
}


.record-list {
	width: 100%;
	background-color: #fff;
	border-radius: 30rpx;
}

.list-item {
	padding: 30rpx;
	border-bottom: 0.5px solid #efefef;
	white-space: nowrap;
	&:nth-last-child(1) {
		border: 0;
	}
}
.current {
    transition: all 0.5s;
    transform-origin: 14rpx 16rpx;
}
.isCurrent {
    transform: rotate(-180deg);
    
}
.store-btn {
    width: 100%;
    height:84rpx;
    background-color: #F8791A;
    color: #ffffff;
    border-radius: 15rpx;
    font-size: 28rpx;
}
.year-list {
    position: absolute;
    width: 150rpx;
    top: 50rpx;
    left:50%;
	z-index: 300;
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
    opacity: 1;
}
.year-item {
    height:50rpx;
    text-align: center;
    line-height: 60rpx;
}

</style>
