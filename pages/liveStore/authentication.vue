<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="主播认证" :titleBold="false"></custom>
        <view class="tab fixed" :style="{top:customBar}">
            <qq-tabs :list="tabs" :mode="2" @change="changeTab"></qq-tabs>
        </view>

        <view style="padding:30rpx">
            <view class="form-box">
                <view class="form-item mt-30">
                    <view class="form-item-title fs-28">负责人/经营者姓名</view>
                    <view class="form-input-box mt-20 pb-20 pt-10" style="border-bottom:0.5px solid #efefef;">
                        <input type="text" v-model="form.managerName" placeholder="请输入内容" style="font-size:26rpx;">
                    </view>
                </view>
                <view class="form-item mt-30">
                    <view class="form-item-title fs-28">负责人/经营者手机号</view>
                    <view class="form-input-box mt-20 pb-20 pt-10" style="border-bottom:0.5px solid #efefef;">
                        <lw-num-input :value.sync="form.managerPhone" maxlength="11"></lw-num-input>
                    </view>
                </view>
                <view class="form-item mt-30">
                    <view class="form-item-title fs-28">负责人/经营者身份证号</view>
                    <view class="form-input-box mt-20 pb-20 pt-10" style="border-bottom:0.5px solid #efefef;">
                        <input type="text" v-model="form.managerIdCard"  placeholder="请输入内容" style="font-size:26rpx;">
                    </view>
                </view>

                <view class="form-img-title fs-30 mt-30 blod">上传身份证照片</view>

                <view class="form-img-item flex flex-x-b mt-40">
                    <view class="flex-1">
                        <view class="fs-28">头像面</view>
                        <view class="fs-26 color-999999">请上传身份证头像面</view>
                    </view>
                    <view class="flex-1" @tap.stop="choose_image('idCardObverse')">
                        <image :src="form.idCardObverse" v-if="form.idCardObverse" style="width:367rpx;height:237rpx;;border-radius:10rpx;" mode="aspectFill"></image>
                        <image src="../../static/liveStore/sfz1.png" v-else style="width:367rpx;height:237rpx;;border-radius:10rpx;" mode="aspectFill"></image>
                    </view>
                </view>

                <view class="form-img-item flex flex-x-b mt-40">
                    <view class="flex-1">
                        <view class="fs-28">国徽面</view>
                        <view class="fs-26 color-999999">请上传身份证国徽面</view>
                    </view>
                    <view class="flex-1" @tap.stop="choose_image('idCardReverse')">
                        <image :src="form.idCardReverse" v-if="form.idCardReverse" style="width:367rpx;height:237rpx;;border-radius:10rpx;" mode="aspectFill"></image>
                        <image src="../../static/liveStore/sfz2.png" v-else style="width:367rpx;height:237rpx;border-radius:10rpx;" mode="aspectFill"></image>
                    </view>
                </view>
                <view class="" v-if="form.liveStoreType === 1">
                    <view class="mt-30" style="border-bottom:0.5px solid #efefef;"></view>

                    <view class="form-img-title fs-30 mt-30 blod">上传营业执照照片</view>  

                    <view class="form-img-item flex flex-x-b mt-40">
                        <view class="flex-1">
                            <view class="fs-28">营业执照</view>
                            <view class="fs-26 color-999999">确保图片完整</view>
                        </view>
                        <view class="flex-1" @tap.stop="choose_image('businessLicense')">
                            <image :src="form.businessLicense" v-if="form.businessLicense" style="width:367rpx;height:237rpx;;border-radius:10rpx;" mode="aspectFill"></image>
                            <image src="../../static/liveStore/license.png" v-else style="width:367rpx;height:237rpx;;border-radius:10rpx;" mode="aspectFill"></image>
                        </view>
                    </view>

                    <view class="mt-30" style="border-bottom:0.5px solid #efefef;"></view>

                    <view class="form-item mt-30">
                        <view class="form-item-title fs-28">企业名称</view>
                        <view class="form-input-box mt-20 pb-20 pt-10" style="border-bottom:0.5px solid #efefef;">
                            <input type="text" v-model="form.enterpriseName" placeholder="请输入内容" style="font-size:26rpx;">
                        </view>
                    </view>

                    <view class="form-item mt-30">
                        <view class="form-item-title fs-28">统一社会信用代码</view>
                        <view class="form-input-box mt-20 pb-20 pt-10" style="border-bottom:0.5px solid #efefef;">
                            <input type="text" v-model="form.enterpriseCreditCode" placeholder="请输入内容" style="font-size:26rpx;">
                        </view>
                    </view>
                </view>
            </view>
            <view class="live-form-btn flex flex-x-y blod" @tap.stop="onSubmit">确认提交</view>
        </view>
    </view>
</template>

<script>
import lwNumInput from '../../components/lw-num-input/lw-num-input.vue';
let utils = require('../../utils/util');
export default {
  components: { lwNumInput },
    name: 'TsshopUniappIndex',

    data() {
        return {
            customBar: getApp().globalData.customBar + 'px',
            tabs: [
                {
                    name:'个人认证'
                },
                {
                    name:'商户认证'
                }
            ],
            form: {
                managerName:null,
                managerPhone:null,
                managerIdCard:null,
                liveStoreType: 0,
                idCardObverse:null,
                idCardReverse:null,
                businessLicense:null,
                enterpriseName:null,
                enterpriseCreditCode:null
            },
        };
    },

    mounted() {
        
    },

    methods: {
        TypeInput(e, val) {
				// 只能输入数字的验证;
                const inputType = /[^\d]/g   //想限制什么类型在这里换换正则就可以了
				this.$nextTick(function() {
					this.form.managerPhone = e.target.value.replace(inputType, '');
				})
			},
        choose_image(key) {
			utils.upload_one(url => {
				this.form[key] = url
			},{
                quality: 100,
	            width: 600,
	            height: 600,
	            resize: false
            },false,600);
		},
        changeTab(index) {
            this.form.liveStoreType = index
        },
        onSubmit() {
            let valid = this.validate()
            if(!valid) return this.showToast('请完成表单内容的填写')
            if (!(/^1[3456789]\d{9}$/.test(this.form.managerPhone))) return this.showToast('手机号有误');
            if(this.form.liveStoreType === 0) {
                this.form.businessLicense = null
                this.form.enterpriseName = null
                this.form.enterpriseCreditCode = null
            }
            this.request({
				url: '/liveStoreApply/apply',
				data: this.form,
                method:'post',
				loading: true,
			}).then(res => {
				if (res.status == 200) {
					this.showToast('提交成功！')
                    this.$store.dispatch('refresh_live_stroe_info'); //更新直播小店信息
                    this.uniBack()
				} 
			})
            
        },
        validate() {
            let res = true
            let arr = ['businessLicense','enterpriseName','enterpriseCreditCode','liveStoreType']
            if(this.form.liveStoreType === 1) {
                arr = ['liveStoreType']
            }
            for(let k in this.form) {
                if(!arr.includes(k) && !this.form[k]) {
                    res = false
                }
            }
            return res
        }
    },
};
</script>

<style lang="scss">
page{
    background-color: #f4f6f8;
}
.tab {
    background-color: #fff;
    padding: 0 150rpx;
}
.form-box {
    background-color: #fff;
    border-radius: 15rpx;
    padding: 30rpx;
    
}
.live-form-btn {
    margin-top: 60rpx;
    width: 100%;
    height:84rpx;
    background-color: #F8791A;
    color: #ffffff;
    border-radius: 15rpx;
    font-size: 28rpx;
}
</style>