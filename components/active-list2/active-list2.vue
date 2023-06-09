<template>
	<view>
		<view class="bg-FFFFFF hidden mt-24" v-for="(item,index) in list" :key="item.activityId"
			style="padding:0 26rpx;" :class="styleType == 1?'style1':'style2'"
			:style="hiddenFirstTop && index == 0 ?'margin-top:0;':''">
			<view class="flex">

				<view class="flex-1">
					<view class="flex flex-y-center mt-30 hidden"
						@tap.stop="toPage('/pages/store/index?id='+item.shopId,'',true)">
						<view
							style="width: 80rpx;height: 80rpx;border-radius: 50%;background-color: #f1f1f1;overflow: hidden;">
							<image :src="item.avatarUrl" :lazy-load="true" style="width: 100%;height: 100%;"
								mode="aspectFill"></image>
						</view>
						<view class="flex-1 hidden" style="margin-left: 16rpx;">
							<view class="over-line1 fs-28 color-333333"
								style="width: 100%;width: 400rpx;line-height: 40rpx;">{{item.shopName}}</view>

							<view class="over-line1 fs-26 color-333333" style="line-height: 40rpx;color: #B6B6B6;">
								<timestamp v-if="item.createTime" :time="item.createTime"></timestamp>
								<view v-else>{{' '}}</view>
							</view>
						</view>
						<view @tap.stop="to_follow(item)" v-if="item.isFollow == 1" class="guanzhu">
							已关注
						</view>
						<view @tap.stop="to_follow(item)" v-if="item.isFollow != 1" class="guanzhu-no">
							<text class="iconfont icon-zengjia" style="font-size: 22rpx;padding-right: 6rpx;"></text>
							<text>关注</text>
						</view>
					</view>

					<view @tap.stop="to_comment(item)" class="fs-28 color-333333 mt-10 over-line4"
						style="line-height: 40rpx;max-height: 200rpx;word-break: break-all;text-align: justify;white-space: pre-line;text-overflow: ellipsis;">
						{{item.activityDetail}}
					</view>

					<!-- 图片 -->
					<view class="flex flex-wrap mt-10" style="" @tap.stop="to_comment(item)"
						v-if="item.image && item.image.length>0 && item.image[0]">
						<!-- 一张图片 -->
						<!-- <image class="" :src="user_info.avatarUrl" mode="aspectFill" style="" :class="styleType ==1 ?'image-big1':'image-big2'"></image> -->
						<!-- 多张图片 -->
						<image @tap.stop="prview_image(item2,item.image)" v-for="(item2,index2) in item.image"
							:lazy-load="true" :src="item2" :key="index2" mode="aspectFill" class="active-images "
							:class="styleType ==1 ?'image-small1':'image-small2'" style="">
						</image>
					</view>
					<view v-else style="height: 30rpx;"></view>
					<!-- 图片 -->

					<!-- 点赞 -->
					<view v-if="bottomStyle == 1" class="flex flex-y-center flex-x-b color-999999 fs-28 iamge-zan"
						@tap.stop="clear"
						style="height: 80rpx;margin-top: 8rpx;border-top: 1rpx solid #f6f6f6;padding:0 14rpx;">
						<view class="flex flex-x-y" @tap.stop="to_like(item)" style="height: 50rpx;">
							<view class="iconfont icon-zan" :style="item.liked?'color: #07ABA1;':''"></view>
							<view class="ml-10" :style="item.liked?'color: #07ABA1;':''">{{item.likes}}</view>
						</view>
						<view class="flex flex-x-y" style="height: 50rpx;" @tap.stop="to_comment(item)">
							<view class="iconfont icon-xiaoxi"></view>
							<view class="ml-10">{{item.activityUserNum}}</view>
						</view>
						<view class="flex flex-x-y pr" style="height: 50rpx;" @tap.stop="clear">
							<view class="iconfont icon-fenxiang1" style="font-size: 20rpx;"></view>
							<view class="ml-10 fs-24">分享</view>
							<button @tap.stop="to_share_app(item)"
								style="width: 100%;height:100%;position: absolute;top: 0;opacity: 0;"
								data-sharetype="active" :data-image="item.image" :data-avatar="item.avatarUrl"
								:data-aid="item.activityId" :data-title="item.activityDetail"
								open-type="share"></button>
						</view>
					</view>
					<view v-if="bottomStyle == 2" class="flex flex-y-center color-999999 fs-28 iamge-zan"
						style="height: 80rpx;margin-top: 8rpx;border-top: 1rpx solid #f6f6f6;" @tap.stop="clear">
						<view class="flex-1">
							<view class="iconfont icon-gengduo color-999999" style="font-size: 60rpx;"></view>
						</view>
						<view class="flex flex-y-center">
							<view class="flex-1 flex flex-x-y fs-24">
								<view class="iconfont icon-zan" style="margin-left: 60rpx;"></view>
								<view class="ml-10" style="">点赞</view>
							</view>
							<view class="flex-1 flex flex-x-y fs-24" @tap.stop="to_comment(item)">
								<view class="iconfont icon-xiaoxi" style="margin-left: 60rpx;"></view>
								<view class="ml-10 fs-24">回复</view>
							</view>
							<view class="flex-1 flex flex-x-y fs-24" style="margin-right: 18rpx;">
								<view class="iconfont icon-fenxiang1" style="margin-left: 60rpx;"></view>
								<view class="ml-10">分享</view>
							</view>
						</view>
					</view>
					<!-- 点赞 -->
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "active-list2",
		props: {
			list: {
				type: Array,
				default: () => []
			},
			styleType: {
				type: String,
				default: '1'
			},
			bottomStyle: {
				type: String,
				default: '1'
			},
			//去除第一个上外边距
			hiddenFirstTop: {
				type: Boolean,
				default: false,
			},

		},
		data() {
			return {

			};
		},
		methods: {
			toJSON() {
				return this;
			},

			prview_image(src, url) {
				uni.previewImage({
					current: src,
					urls: url
				})
			},
			to_comment(item) {
				this.toPage('/pages/store/active?id=' + item.activityId, '', true);
			},
			to_follow(item) {
				if (!this.login()) {
					this.click(() => {
						this.request({
							url: item.isFollow == 1 ? '/shopFollow/cancel' : '/shopFollow/follow',
							data: {
								shopId: item.shopId,
							},
							loading: true,
						}).then(res => {
							if (!this.rsuccess(res)) return;
							// item.isFollow = item.isFollow == 1 ? 0 : 1;
							let ifFollow = item.isFollow == 1 ? 0 : 1;
							this.list.forEach(val => {
								if (item.shopId == val.shopId) {
									val.isFollow = ifFollow;
								}
							});
							this.$emit('changeValue', {
								key: 'list',
								value: this.list
							});

						});
					});
				}
			},
			to_like(item) {

				if (!this.login()) {
					this.click(() => {
						this.request({
							url: !item.liked ? `/zhoudao/zdAActivityUser/addLikes/${item.activityId}` :
								`/zhoudao/zdAActivityUser/delLikes/${item.activityId}`,
							data: {
								// shopId: item.shopId,
							},
							method: 'POST',
						}).then(res => {
							if (!this.rsuccess(res)) return;

							if (item.liked) {
								item.liked = false;

								item.likes = Number(item.likes) - 1;
							} else {
								item.liked = true;

								item.likes = Number(item.likes) + 1;
							}
							this.$emit('changeValue', {
								key: 'list',
								value: this.list
							});

						});
					});
				}
			},
			to_share_app(item) {
				// #ifdef MP-WEIXIN
				return;
				// #endif
				let path = `pages/store/active?id=${item.activityId}`;
				let title = item.activityDetail;
				this.shareApp(path, title);
			}

		}
	}
</script>

<style>
	.active-images {
		/* margin-left: 16rpx; */
		margin-bottom: 16rpx;
		margin-right: 16rpx;
	}

	.active-images:nth-of-type(3n) {
		/* margin-left: 40rpx; */
		margin-right: 0;
	}

	.iamge-zan .iconfont {
		font-size: 30rpx !important;
	}

	.style1 {
		box-shadow: 0px 2rpx 2rpx 0px #f6f6f6 inset;
		border-radius: 16rpx;
	}

	.image-big1 {
		width: 438rpx;
		height: 324rpx;
		border-radius: 8rpx;
	}

	.image-small1 {
		width: 202rpx;
		height: 202rpx;
		border-radius: 8rpx;
	}





	.style2 {
		/* box-shadow: 0px 2rpx 2rpx 0px #f6f6f6 inset;
		border-radius: 16rpx; */
	}

	.image-big2 {
		width: 250rpx;
		height: 184rpx;
		border-radius: 8rpx;
	}

	.image-small2 {
		width: 180rpx;
		height: 180rpx;
		border-radius: 8rpx;
	}

	.guanzhu {
		width: 124rpx;
		height: 52rpx;
		background: rgba(7, 171, 161, 0.10);
		border-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #07ABA1;
	}

	.guanzhu-no {
		width: 124rpx;
		height: 52rpx;
		border: 2rpx solid #07aba1;
		border-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #07ABA1;
	}
</style>
