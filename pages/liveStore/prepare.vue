<template>
	<view class="">
		<custom fixed="fixed" background="#ffffff" mode="2" :title="title" :titleBold="false"></custom>
		<view class="" style="padding:30rpx">
			<view class="content-box">
				<view class="form-item flex-x-b flex-y-center">
					<view class="flex flex-y-center">
						<view class="fs-26" style="color:red;">*</view>
						<view class="fs-26 blod">直播标题</view>
					</view>
					<view class="flex flex-x-end">
						<input type="text" v-model="liveTitle" placeholder="请输入标题" placeholder-style="color:#999999;"
							style="text-align:right;font-size:26rpx;">
					</view>
				</view>
				<view class="form-item flex-x-b flex-y-center" @tap.stop="chooseGoods">
					<view class="flex flex-y-center">
						<view class="fs-26" style="color:red;">*</view>
						<view class="fs-26 blod">直播商品</view>
					</view>
					<view class="flex flex-x-end flex-y-center">
						<view v-if="checkedGoods.length>0" class="fs-26" style="color:#F8791A">
							已选择{{ checkedGoods.length }}件商品</view>
						<view v-else class="fs-26 color-999999">请选择商品</view>
						<view class="iconfont icon-jinru fs-26 color-999999" style="transform: scale(0.7);"></view>
					</view>
				</view>
				<view class="form-item flex-x-b flex-y-center" v-if="title === '预约直播'" @tap.stop="openTime">
					<view class="flex flex-y-center">
						<view class="fs-26" style="color:red;">*</view>
						<view class="fs-26 blod">直播时间</view>
					</view>
					<view class="flex flex-x-end">
						<view class="fs-26 color-999999">{{ time || '请选择开播时间'}}</view>
						<view class="iconfont icon-jinru fs-26 color-999999" style="transform: scale(0.7);"></view>
					</view>
				</view>
				<view class="form-item flex flex-x-b">
					<view class="flex">
						<view class="fs-26" style="color:red;">*</view>
						<view class="fs-26 blod">直播封面</view>
					</view>
					<view class="" @tap.stop="chooseLiveCover" style="width:137rpx;height:137rpx;">
						<image v-if="cover" :src="cover" style="width:137rpx;height:137rpx;" mode="aspectFill"></image>
						<image v-else src="../../static/liveStore/cover.png" style="width:137rpx;height:137rpx;"
							mode=""></image>
					</view>

				</view>
			</view>
			<view class="content-box mt-30">
				<view class="form-item" style="padding:0">
					<view class="flex">
						<view class="fs-26" style="color:red;">*</view>
						<view class="fs-26 blod">直播描述</view>
					</view>
					<view class="text-box mt-20">
						<textarea v-model="livetext" maxlength="200"
							style="height:150rpx;font-size:26rpx;width:100%;" />
						<view class="fs-26" style="text-align:right;">{{livetext.length}}/200</view>
					</view>

				</view>
			</view>


		</view>
		<fixed-bottom>
			<view class="" style="padding:30rpx;">
				<view class="flex" v-if="live_id">
					<view class="detail-btn flex-1 flex flex-x-y mr-20" @tap.stop="cancelLive">取消预约</view>
					<view class="detail-btn flex-1 flex flex-x-y" style="background: #F8791A;" @tap.stop="createLive">保存
					</view>
				</view>
				<!-- #ifndef MP-WEIXIN -->

				<view v-else class="store-btn flex flex-x-y blod fs-28" @tap.stop="createLive">{{ btn_name }}</view>
				<!-- #endif -->
			</view>
		</fixed-bottom>
		<datePicker ref="timeRef" @submit="getTime"></datePicker>
		<toast ref="toast"></toast>
	</view>
</template>

<script>
	import datePicker from '../../uni_modules/buuug7-simple-datetime-picker/components/buuug7-simple-datetime-picker/buuug7-simple-datetime-picker.vue';
	let utils = require('../../utils/util');
	export default {
		name: 'TsshopUniappPrepare',
		components: {
			datePicker
		},
		data() {
			return {
				title: '立即直播',
				goods_num: 3, //商品数量
				cover: '', //封面
				livetext: '',
				time: '',
				btn_name: '立即开播',
				live_id: null,
				liveTitle: '',
				checkedGoods: [], //已选择的商品
			};
		},
		onLoad({
			title
		}) {
			this.title = title
			if (title === '预约直播') {
				this.btn_name = '预约开播'
			}
			if (getApp().globalData.liveDetail) {
				this.liveDetail = this.clone(getApp().globalData.liveDetail);
				console.log('liveDetail', this.liveDetail);
				this.setData({
					time: this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(this.liveDetail.reckonTime)),
					live_id: this.liveDetail.id,
					liveTitle: this.liveDetail.title,
					cover: this.liveDetail.url,
					livetext: this.liveDetail.describes,
				});
				getApp().globalData.liveDetail = null;
				this.checkedGoods = this.liveDetail.goodsList.map(val => {
					val.id = val.goodsId;
					val.liveStoreGoodsSkus = this.clone(val.goodsSkuList);
					return val;
				});
			}
			uni.$off('chooseLiveGoods');
			uni.$on('chooseLiveGoods', this.chooseLiveGoods);
		},

		methods: {
			chooseGoods() {

				getApp().globalData.checkedIdArr = this.checkedGoods.map(val => val.id);
				let goodsObj = {};
				// console.log('checkedIdArr',getApp().globalData.checkedIdArr);
				this.checkedGoods.forEach(val => {
					goodsObj[val.id] = val.liveStoreGoodsSkus;
				});
				// console.log('goodsObj',goodsObj);
				getApp().globalData.oldSkulistObj = goodsObj;



				this.toPage('/pages/liveStore/goodsList', '', true)
			},
			openTime() {
				this.$refs.timeRef.show()
			},
			getTime({
				year,
				month,
				day,
				hour,
				minute
			}) {
				this.time = `${year}-${month}-${day} ${hour}:${minute}:00`
				console.log('this.time', this.time);
			},
			chooseLiveCover() {
				let crop = {
					quality: 100,
					width: 400,
					height: 400,
					resize: false
				};
				utils.upload_one((url) => {
					this.cover = url;
				}, crop);
			},
			createLive() {
				if (!this.liveTitle) {
					this.showToast('请输入直播标题');
					return;
				}
				if (this.title == '预约直播' && !this.time) {
					this.showToast('请选择预约时间');
					return;
				}
				if (!this.cover) {
					this.showToast('请选择直播封面');
					return;
				}
				if (!this.livetext) {
					this.showToast('请输入直播描述');
					return;
				}

				this.less(() => {
					////////
					this.$refs.toast.open({
						title: '',
						desc: this.title == '预约直播' ? '确定预约直播？' : '确定开始直播？',
						success: () => {
							this.request({
								url: '/live/createLive',
								data: {
									reckonTime: this.title == '预约直播' ? (new Date(this.time)
											.getTime()) : new Date()
										.getTime(),
									title: this.liveTitle,
									url: this.cover,
									describes: this.livetext,
									goodsList: this.filterLiveGoods(this.checkedGoods),
								},
								method: 'POST',
							}).then(res => {
								if (res.status != 200) return;
								if (this.title == '预约直播') {
									this.showToast('预约成功');
									this.uniBack();
								} else {
									this.toPage(
										`/pages/live/live?liveId=${res.data.id}&status=1`,
										'3');
								}

							});
						}
					});
					////////

				});
			},
			cancelLive() {
				this.less(() => {
					this.$refs.toast.open({
						title: '',
						desc: '确定取消预约',
						success: () => {
							this.request({
								url: '/live/updateLive',
								data: {
									id: this.liveDetail.id,
									status: 4,
								},
								method: 'POST',
							}).then(res => {
								if (!this.rsuccess(res)) return;
								this.showToast('取消成功');
								this.uniBack();
							});
						}
					});
				});
			},
			//已选商品
			chooseLiveGoods(goodsArr) {
				this.checkedGoods = goodsArr;
				console.log('已选商品', goodsArr);
			},
			filterLiveGoods(arr) {
				let newArr = [];

				arr.forEach(val => {

					newArr.push({
						goodsId: val.id,
						goodsSkuList: [
							...val.liveStoreGoodsSkus.map(val => val)
						]
					});

				});

				return newArr;
			},
		},

	};
</script>

<style lang="scss">
	page {
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
				border: 0;
			}

			.text-box {
				height: 210rpx;
				background-color: #F5F6F8;
				border-radius: 20rpx;
				padding: 10rpx;
			}
		}
	}

	.store-btn {
		margin-top: 60rpx;
		width: 100%;
		height: 84rpx;
		background-color: #F8791A;
		color: #ffffff;
		border-radius: 15rpx;
		font-size: 28rpx;
	}

	.detail-btn {
		height: 84rpx;
		background: #F46656;
		border-radius: 15rpx;
		color: #fff;
		font-size: 28rpx;
	}
</style>