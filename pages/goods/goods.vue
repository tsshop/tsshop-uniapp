<template>
	<view>
		<custom height="0" :mode="1" :backColor="backColor" :titleColor="titleColor" :background="background"
			fixed="fixed">
			<view v-if="hasSearch" slot="center" class="flex" style="width: 650rpx;">
				<view class="flex-1" style="margin-right: 20rpx;">

					<search placeholder="家用双开门电冰箱" @search="search"></search>
				</view>
			</view>
		</custom>
		<view style="position: fixed;width: 100vw;z-index: 100;"
			:style="{top: customBar  + 'px',background:background,display:hasSearch?'block':'none'}">
			<view class="flex flex-x-y">
				<tabs height="100rpx" ref="tabs" @change="tab_change" :scroll="true" :list="tabs_list"></tabs>
			</view>
		</view>
		<!-- <view class="">
			<vear-carousel :img-list="banner" url-key="url"></vear-carousel>
		</view> -->
		<banner class="s-goods" :goods="{banner}"></banner>
		<view class="miaosha" v-if="goods.seckillSatus != 0 && !liveId">
			<image src="../../static/tsshop/miaosha.png"
				style="width: 128rpx; height: 32rpx;background-position: center;" mode=""></image>
			<view class="flex" v-if="goods.seckillSatus == 2">
				<view class="">
					距离结束
				</view>
				<view class="flex flex-x-y ml-10">
					<time1 :time="goods.seckillTime" :index="1"></time1>
				</view>
			</view>
			<view class="" v-else>
				活动尚未开始
			</view>
		</view>
		<view v-if="goods.price" class="goods-title">

			<view class="flex flex-y-center">
				<price :price="goods.price"></price>
				<view class="ml-20 color-808080 fs-18 flex" style="text-decoration: line-through;"
					v-if="goods.scribingPrice">
					<view class="">
						￥
					</view>
					<view class="">
						{{goods.scribingPrice}}
					</view>
				</view>
				<!-- <view class="fs-28" style="color:#9FA9A7;">432人已买</view> -->
			</view>
			<view class="flex  mt-20">
				<view class=" flex1 fs-28 over-line2" style="color:#3B4644;">{{goods.name || ''}}</view>
				<view @tap.stop="collect" class="flex ml-20" v-if="!liveId"
					style="width: 50rpx; flex-direction: column;align-items: center; justify-content: space-around;">
					<image :src="isCollect?'../../static/tsshop/shoucang.png':'../../static/tsshop/weishoucang.png'"
						mode="" style="width: 36rpx;height: 36rpx;"></image>
					<view class="nowrap color-646464 fs-24">
						收藏
					</view>

				</view>
			</view>

		</view>
		<view class="pl-20 pr-20">
			<view class="service color-646464 fs-26">
				<!-- <view class="flex">
					<view class="mr-20">送至</view>
					<view class="iconfont icon-dingwei mr-20" style="color: #FF882F;">
						
					</view>
					<view class="flex1">浙江省杭州市滨江区航海路<view class="">
						23:00前下单，预计明天（08月08日
					</view></view>
					<view class="iconfont icon-jinru"></view>
				</view> -->
				<view>

					<view class="color-666666 fs-26 flex flex-y-center">
						<image src="../../static/images/huo.png" mode=""
							style="width: 24rpx;height: 24rpx;margin-right: 10rpx;"></image>
						享好物 速发货
					</view>
					<view class="color-666666 fs-26  over-line1 flex flex-y-center mt-10">
						<image src="../../static/images/huo.png" mode=""
							style="width: 24rpx;height: 24rpx;margin-right: 10rpx;"></image>
						好物集市 · 精选精品 · 极速发货
					</view>

				</view>
				<!-- <view class="flex">
					<view class="mr-20">服务</view>
					<view class="flex1 color-323232">假一赔十·坏单包退·退货运费险·极速退款</view>
					<view class="iconfont icon-jinru"></view>
				</view>
				<view class="flex mt-20">
					<view class="mr-20">参数</view>
					<view class="flex1 color-323232">品牌 产地 重量 包装方式 储存温度</view>
					<view class="iconfont icon-jinru"></view>
				</view> -->
			</view>



			<!-- 评论 -->
			<view class="comment-area s-goods-connent">
				<view class="flex flex-x-b flex-y-c fs-26 color-646464">
					<view class="flex">
						<view class="color-323232 blod mr-10">
							评价
						</view>
						<view class="">
							({{comments}})
						</view>
					</view>
					<view class="flex flex-y-center" @tap.stop="toPage('/pages/comment/comment?id='+id)">
						<view>查看更多</view>
						<view class="iconfont icon-jinru ml-10" style="font-size: 24rpx;"></view>
					</view>
				</view>
				<comment :list="commentList.slice(0, 4)"></comment>
			</view>
			<!-- 店铺 -->
			<!-- <view class="">
				<shop></shop>
			</view> -->

			<view class="s-goods-detail"></view>
			<view class="content-box ">
				<goods-title title="商品详情"></goods-title>
				<view class="detail" style="white-space: pre-line;">
					<!-- {{goods.detail || ''}} -->
					<jyf-parser :html="goods.detail"></jyf-parser>
				</view>
			</view>
		</view>



		<view style="height: 140rpx;">
			<view style="position: fixed;bottom: 0;width: 100vw;">
				<view class="flex flex-x-y bg-FFFFFF" style="height: 140rpx;padding:0 40rpx;">

					<view v-if="!liveId" @tap.stop="toPage('/pages/cart/cart','4')" class="flex flex-x-y flex-y"
						style="white-space: nowrap;padding:0 20rpx;">
						<view style="width: 40rpx;height: 40rpx;background-color: rgba(0,0,0,0);"
							class="flex flex-x-y color-323232 fs-36">
							<view class="iconfont icon-gouwuche"></view>
						</view>
						<view class="fs-24 color-323232">购物车</view>
					</view>

					<view @tap.stop="add_cart" v-if="!liveId"
						style="width: 670rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90deg, #FFA600 0%, #FF6D00 100%);"
						class="color-ffffff fs-32 flex flex-x-y mr-20">
						加入购物车
					</view>
					<view @tap.stop="buy"
						style="width: 670rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90deg, #FF534E 0%, #FF2020 100%);"
						class="color-ffffff fs-32 flex flex-x-y">
						立即购买
					</view>
				</view>
			</view>


		</view>





		<view class="s-goods-top"></view>



		<sku ref="sku" :mode="mode" :goods="goods" :showBtn="false" @buy_now_fail="buy_now_fail" bottom="130rpx"></sku>

	</view>
</template>

<script>
	import time1 from '@/components/countdown/time.vue';
	import banner from '@/components/goods/banner.vue';
	export default {
		components: {
			banner,
			time1,
		},
		data() {
			return {
				mode: 1,
				id: 0,
				banner: [],
				safeArea: getApp().globalData.safeArea + 'px',
				goods: {},
				hasSearch: false,
				isCollect: '',
				customBar: getApp().globalData.customBar,
				background: 'rgba(0,0,0,0)',
				titleColor: 'rgba(0,0,0,0)',
				backColor: 'rgba(255,255,255)',
				tabs_list: [
					//a
					{
						name: '商品',
						className: '.s-goods',
						top: 0,
					},
					{
						name: '评价',
						className: '.s-goods-connent',
						top: 200,
					},
					{
						name: '详情',
						className: '.s-goods-detail',
						top: 210,
					},
					// {
					// 	name: '推荐',
					// 	className: '.s-goods-top',
					// 	top: 220,
					// }
				],
				skuList: [],
				comments: 0,
				//评论列表
				commentList: [],
				detail_height: 0,
				changeStatus: true,
				liveId: '',
			}
		},
		onShow() {

		},
		onLoad(e) {
			if (e.liveId) {
				this.liveId = e.liveId;
				this.liveStoreId = e.liveStoreId;
				this.id = e.id;
				this.getLiveGoodsDetail();
				return;
			}
			if (e.id) {
				this.id = e.id;
				this.get_detail();
				this.get_sku()
				this.get_commentList()
				if (this.isCollect === '') {
					this.get_collect()
				}

			}
		},
		methods: {
			get_collect() {
				if (this.login(false)) return
				this.request({
					url: '/goodsCollect/getIsCollect',
					data: {
						goodsId: this.id
					}
				}).then(res => {
					if (res.status != 200) return
					this.isCollect = res.data == 1 ? true : false
				})
			},
			tab_change(index) {
				this.changeStatus = false;
				setTimeout(() => {
					this.changeStatus = true;
				}, 100);
				uni.pageScrollTo({
					selector: this.tabs_list[index].className,
					duration: 0,
				})
			},
			buy() {
				// console.log(this.goods.skuList, this.goods.skuList.length,'this.goods.skuList')
				// if (this.goods.skuList && this.goods.skuList.length > 0) {
				// 	this.$refs.sku.buy_now();
				// } else {
				// 	this.toPage('/pages/goods/submit?id=' + this.id, '', true);
				// }
				this.$refs.sku.buy_now();
				// this.$refs.sku.open();
				// this.toPage('/pages/goods/submit?id=' + this.id, '', true);
			},
			sure() {
				this.$refs.buy.close();
				this.toPage('/pages/goods/submit?id=' + this.id, '', true);
			},
			get_detail() {
				this.request({
					url: '/goods/detail',
					data: {
						id: this.id,
					}
				}).then(res => {
					if (!this.rsuccess(res)) return;
					this.banner = res.data.headPortrait.split(',');
					res.data.seckillTime = Math.floor((res.data.seckillTime - Date.now()) / 1000)
					this.goods = res.data;
					// console.log(res.data.seckillTime,Date.now(), this.goods.seckillTime, 'time')
					setTimeout(() => {
						this.get_detail_height();
					}, 300);
				});
			},
			//
			getLiveGoodsDetail() {
				this.request({
					url: '/live/liveGoodsView',
					data: {
						id: this.id,
					}
				}).then(res => {
					if (res.status != 200) return;
					console.log('直播商品详情.....................................',res);
					this.banner = res.data.headPortrait.split(',');
					if (res.data.goodsSkuList.length > 0) {
						let sku = res.data.goodsSkuList.sort((v1, v2) => {
							return v1.price > v2.price ? 1 : -1;
						});
						res.data.scribingPrice = sku[0].oriPrice;
						res.data.price = sku[0].price;
					}
					this.goods = res.data;
					//
					///初始化规格
					this.goods.skuList = res.data.goodsSkuList;
					this.skuList = res.data.goodsSkuList || [];
					this.goods.skuList = this.goods.skuList.filter(val => val.properties);
					if (this.goods.skuList) {
						this.init_sku(this.goods.skuList);
					}
				});
			},
			get_sku() {
				this.request({
					url: '/goods/getSku',
					data: {
						id: this.id
					}
				}).then(res => {
					if (res.status != 200) return
					this.goods.skuList = res.data
					this.skuList = res.data || [];
					this.goods.skuList = this.goods.skuList.filter(val => val.properties);
					if (this.goods.skuList) {
						this.init_sku(this.goods.skuList);
					}
				})
			},
			collect() {
				if (!this.isCollect) {
					this.isCollect = true
					this.request({
						url: '/goodsCollect/add',
						data: {
							goodsId: this.id
						}
					}).then(res => {
						if (res.status != 200) return
						this.showToast('收藏成功');
					})
				} else {
					this.isCollect = false
					this.request({
						url: '/goodsCollect/delete',
						data: {
							goodsIds: [this.id]
						}
					}).then(res => {
						if (res.status != 200) return
						this.showToast('取消收藏');
					})
				}
			},
			search() {
				this.toPage('/pages/search-before/search-before', '', true);
			},
			init_sku(sku_list = []) {
				// sku_list = [
				// 	{
				// 		properties:'颜色:蓝色;尺码:L',
				// 		name:'name1',
				// 	},
				// 	{
				// 		properties:'颜色:黄色;尺码:M',
				// 		name:'name2',
				// 	}
				// ]
				let attr_group_list_obj = {

				};
				sku_list.forEach(val => {

					let attr_arr = val.properties.split(';').map(attrs => {
						return attrs.split(':');
					})
					let attr_list = [];
					attr_arr.forEach(attr => {
						attr_list.push({
							attr_group_name: attr[0],
							attr_name: attr[1]
						})
						if (attr_group_list_obj[attr[0]] === undefined) {
							attr_group_list_obj[attr[0]] = []
						}
						if (attr_group_list_obj[attr[0]].indexOf(attr[1]) == -1) {
							attr_group_list_obj[attr[0]].push(attr[1])
						}
					})
					val.attr_list = attr_list;
					val.num = val.stocks || 0;

				})
				let attr_group_list = {}

				Object.keys(attr_group_list_obj).forEach(key => {
					attr_group_list[key] = {};
					attr_group_list[key].attr_group_name = key

					attr_group_list[key].attr_list = attr_group_list_obj[key].map(val => {
						return {
							attr_name: val
						}
					});

				})
				setTimeout(() => {
					this.$refs.sku.init(attr_group_list, sku_list, '');
					// this.$refs.sku.buy_now();
				}, 300)
				// console.log('sku_list', sku_list);
				// console.log('attr_group_list_obj', attr_group_list_obj)
				// console.log('attr_group_list', attr_group_list)
			},
			buy_now_fail() {},
			// to_comment() {
			// 	this.toPage('/pages/comment');
			// }
			get_detail_height() {
				const query = uni.createSelectorQuery().in(this)
				query
					.select('.detail')
					.boundingClientRect(data => {

						try {
							this.detail_height = data.height || 0;

							this.tabs_list[2].top = this.tabs_list[1].top + this.detail_height - 40;
							// this.tabs_list[3].top = this.tabs_list[2].top + 20;
						} catch {

						}
					})
					.exec();
			},
			get_commentList() {
				this.request({
					url: '/goodsReview/getGoodsReviewList',
					data: {
						goodsId: this.id,
						pageNumber: 1,
						pageSize: 3
					},
					method: 'POST'
				}).then(res => {
					if (res.status != 200) return
					res.data.list.forEach(val => {
						val.imgList = val.imgs.split(",")
						val.time = this.dateFormat('YY-mm-dd', new Date(val.createTime))
					})
					this.commentList = res.data.list
					if (this.commentList.length != 0) {
						this.comments = this.commentList.length
					} else this.comments = 0
				})
			},
			add_cart() {
				this.$refs.sku.add_cart(this.id)

			},
		},
		onPageScroll(e) {


			if (e.scrollTop >= 0 && e.scrollTop < 150) {
				if (e.scrollTop > 20) {
					this.background = `rgba(245,246,247,${e.scrollTop/150})`;

				} else {
					this.background = `rgba(245,246,247,0)`;
				}
			} else {
				this.background = `#F5F6F7`;
			}
			if (e.scrollTop > 100) {
				this.setData({
					titleColor: '#333333',
					backColor: '#333333',
					hasSearch: true,
				});

			} else {
				this.setData({
					titleColor: 'rgba(0,0,0,0)',
					backColor: '#FFFFFF',
					hasSearch: false,
				});
			}


			if (this.hasSearch && this.changeStatus) {
				let index = this.tabs_list.length - 1;
				this.tabs_list.some((val, index1) => {
					if (e.scrollTop <= val.top) {
						index = index1;
						return true;
					}
					return false;
				});
				this.$refs.tabs.setIndex(index);

			}

		}
	}
</script>

<style>
	page {
		background-color: #F5F6F7;
	}

	.content-box {
		min-height: 60vh;
		border-radius: 10rpx 10rpx 0 0;
		margin-top: 20rpx;
		padding: 20rpx 0;
	}

	.content-box .title {
		font-size: 32rpx;
		line-height: 44rpx;
	}

	.content-box .detail {
		/* text-indent: 2em; */
		margin-top: 28rpx;
		font-size: 32rpx;
		line-height: 44rpx;
		color: #787F7D;
	}

	.service {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.comment-area {
		margin-top: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.miaosha {
		margin: -80rpx 20rpx 0 20rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: #FF5959;
		color: #fff;
		position: relative;
		z-index: 1;
		border-radius: 20rpx 20rpx 0 0;
	}

	.goods-title {
		border-radius: 10rpx;
		border-radius: 10rpx;
		padding: 20rpx 40rpx;
		background-color: #FFF;
		margin-top: -10rpx;
		position: relative;
		z-index: 1;

	}
</style>