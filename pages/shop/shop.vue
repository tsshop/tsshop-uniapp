<template>
	<view>
		<custom height="0"	 backColor="#646464" titleColor="rgba(0,0,0,0)" background="rgba(0,0,0,0)">
			<view class="flex fs-40 color-646464" slot="right" style="margin-left: -60rpx;">
				<view class="iconfont icon-sousuo1 mr-20" @tap.stop="toPage('/pages/search/search')"></view>
				<view class="iconfont icon-fenxiang2" @tap.stop="share"></view>
			</view>
		</custom>
		<!-- <banner :goods="{banner}"></banner> -->
		<view class="" style="height: 416rpx;">
			<!-- <image src="../../static/s1.png" mode="" class="wh-100"></image> -->
		</view>
		<view class="shop pr">
			<view class="flex flex-y-center">
				<view class="shop-img flex flex-x-y">
					<image class="" src="../../static/logo.png" mode=""></image>
				</view>
				<view class="flex1 flex flex-x-b color-323232 flex-y-center">
					<view class="fs-28">
						<view class="blod">
							{{shopName}}
						</view>
						<view class="color-all">
							{{shopNum}}款商品
						</view>
					</view>
					<view class="flex fs-28 color-323232" >
						<image class="dingyue-logo" src="../../static/tsshop/dingyue.png" mode=""></image>
						订阅
					</view>
				</view>
			</view>
		</view>
		<view>
			<screen></screen>
		</view>
		<view class="plr-20 mt-20">
			<list :list="list"></list>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="share">
				<view class="flex flex-x-a">
					<view class="share-list" v-for="(item,index) in shareList" :key="index">
						<image :src="item.img" mode=""></image>
						<view class="">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="flex flex-x-y" style="height: 140rpx; margin-top: 20rpx;">
					<view @tap.stop="close" style="width: 670rpx;height: 80rpx;border-radius: 40rpx;background-color: #fff;"
						class="color-323232 fs-32 flex flex-x-y">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import banner from '@/components/goods/banner.vue';
	export default {
		components: {
			banner
		},
		data() {
			return {
			banner: [],
			list: [
			
			],
			shopName:'滴滴店铺',
			shopNum:1202,
			shareList:[
				{
					img:'../../static/tsshop/weixin.png',
					name:'微信好友'
				},
				{
					img:'../../static/tsshop/pyq.png',
					name:'朋友圈'
				},
				{
					img:'../../static/tsshop/qq.png',
					name:'QQ好友'
				},
				{
					img:'../../static/tsshop/fuzhilianjie.png',
					name:'复制链接'
				}
			]
			};
		},
		async onLoad() {
		
			let arr = [];
			
			for (let i = 0; i < 10; i++) {
				
				arr.push({
					headPortrait: 'https://img2.baidu.com/it/u=1655437323,2230558862&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
					price: '1999.33',
					purchaseQuantity: '800',
					name:Math.random()>0.5?'石头扫拖机器人系列全自动家用扫地拖地机器':'石头扫拖机器人系列'
				});
			}
			setTimeout(() => {
				this.list = arr;
			}, 400);
		
		},
		methods: {
			share() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: #F5F6F7;
}
.shop {
	background-color: #fff;
	padding: 20rpx;
	border-radius: 20rpx 20rpx 0 0;
	margin-top: -40rpx;
	.shop-img {
		width: 96rpx;
		height: 96rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	
		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
			
		}
	}
	.dingyue-logo {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	
}
.share {
	background-color: #F5F6F7;
	padding: 20rpx;
	border-radius: 20rpx 20rpx 0 0;
	.share-list {
		padding: 20rpx;
		image {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}
		view {
			margin-top: 20rpx;
		}
	}
}
</style>
