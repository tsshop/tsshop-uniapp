<template>
    <view class="">
        <custom fixed="fixed" background="#ffffff" mode="2" title="编辑直播商品" :titleBold="false"></custom>
        <view class="" style="padding:30rpx">
            <view class="content-box">
                <view class="form-item flex flex-x-b">
                    <view class="flex">
                        <view class="fs-26 blod">商品主图</view>
                    </view>
                    <view class="" style="width:137rpx;height:137rpx;">
                        <image :src="getImg(goodInfo.headPortrait)" style="width:137rpx;height:137rpx;" mode=""></image>
                    </view>
                </view>
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod" style="margin-right:100rpx;">商品名称</view>
                    <view class="flex-1 fs-26">{{ goodInfo.name }}</view>
                </view>
               <!-- <view class="form-item flex-x-b flex-y-center">
                    <view class="flex flex-y-center">
                        <view class="fs-26 blod">商品排序</view>
                    </view>
                    <view class="flex flex-x-end">
                        <uni-number-box v-model="goodInfo.orderBy"></uni-number-box>
                    </view>
                </view> -->
                <view class="form-item flex flex-x-b">
                    <view class="fs-26 blod mr-30" style="margin-right:100rpx;">商品规格</view>
                    <view class="flex-1 flex" style="flex-wrap:wrap;">
                        <view class="no-check-type flex flex-x-y fs-26" :class="{'check-type':true}" v-for="(item,index) in goodInfo.liveStoreGoodsSkus" :key="index" >{{ item.skuName }}</view>
                        <!-- @tap.stop="changeCheck(item)" -->
                    </view>
                </view>
                
                
            </view>
            <view class="content-box mt-30" v-for="(item,index) in currentSku" :key="index">
                <view class="flex flex-x-b mb-30">
                    <view class="fs-36 blod">{{ item.skuName }}</view>
                    <!-- <view class="iconfont icon-cuo" @tap.stop="onDel(item)"></view> -->
                </view>
                <view class="form-item flex-x-b flex-y-center">
                    <view class="flex flex-y-center">
                        <view class="fs-26 blod">商品原价</view>
                    </view>
                    <view class="flex flex-x-end">
                        <lw-num-input align="right" numType="zd2" placeholder="请输入原价" :value.sync="item.oriPrice"></lw-num-input>
                    </view>
                </view>
                <view class="form-item flex-x-b flex-y-center">
                    <view class="flex flex-y-center">
                        <view class="fs-26 blod">商品现价</view>
                    </view>
                    <view class="flex flex-x-end">
                        <lw-num-input align="right" numType="zd2" placeholder="请输入现价" :value.sync="item.price"></lw-num-input>
                    </view>
                </view>
                <!-- <view class="form-item flex-x-b flex-y-center">
                    <view class="flex flex-y-center">
                        <view class="fs-26 blod">商品库存</view>
                    </view>
                    <view class="flex flex-x-end">
                        <input type="name" placeholder="请输入库存" placeholder-style="color:#999999;" style="name-align:right;font-size:26rpx;">
                    </view>
                </view> -->
            </view>

            
        </view>
        <view class="" style="padding:30rpx;">
            <view class="store-btn flex flex-x-y blod fs-28" @tap.stop="onSubmit">完成</view>
            <view class="" style="height:50rpx;"></view>
        </view>
    </view>
</template>

<script>
import LwNumInput from '../../components/lw-num-input/lw-num-input.vue';
import datePicker from '../../uni_modules/buuug7-simple-datetime-picker/components/buuug7-simple-datetime-picker/buuug7-simple-datetime-picker.vue'
export default {
    name: 'TsshopUniappPrepare',
    components:{ datePicker, LwNumInput },
    data() {
        return {
            goodInfo: {
                id:'',
                headPortrait:"",
                name:'',
                orderBy:0,
                liveStoreGoodsSkus:[]
            },
            goodsId:null,
            editSkuList:[],
            skuMap:new Map()
        };
    },
    onLoad({goodsId}) {
		if(getApp().globalData.toEditLiveGoods){
			this.goodsId = getApp().globalData.toEditLiveGoods.id;
		}
        // this.goodsId = goodsId
        this.getInfo(this.goodsId)
    },
    computed: {
        currentSku() {
            return this.goodInfo.liveStoreGoodsSkus
        }
    },
    methods: {
        getImg(imgs) {
            return imgs?.split(',')[0] || ''
        },
        onSubmit() {
            let isValid = true
            this.goodInfo.liveStoreGoodsSkus.forEach(item => {
                if(item.price > item.oriPrice) {
                    isValid = false
                }
            })
			// console.log('this.goodInfo',this.goodInfo);
			uni.$emit('editLiveGoodsSuccess',this.clone(this.goodInfo));
			this.uniBack();
			return ;
            if(!isValid && this.currentSku.length > 0) return this.showToast('商品的现价不能大于原价')
            this.request({
                url: '/liveStoreGoods/editGoods',
                method: 'post',
                data: this.goodInfo
            }).then(res => {
                if(res.status !== 200) return
                this.showToast('编辑完成')
                this.uniBack()
            })
        },
        // changeCheck(sku) {
        //     sku.editFlag = 1
        //     this.skuMap.set(sku.skuId, sku)
        // },
        // onDel(sku) {
            
        //     this.goodInfo.liveStoreGoodsSkus.forEach(item => {
        //         if(item.skuId == sku.skuId) {
        //             item = this.skuMap.get(sku.skuId)
        //             item.editFlag = 0
        //         }
                
        //     })
        // },
        // 获取商品信息
        getInfo() {
           this.goodInfo = this.clone(getApp().globalData.toEditLiveGoods);
		   getApp().globalData.toEditLiveGoods = null;
        }
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
        .name-box {
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