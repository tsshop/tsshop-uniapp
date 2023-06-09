<template>
	<view>
		<view @tap.stop="to_detail(item)" class="bg-FFFFFF hidden mt-24" v-for="(item,index) in list" :key="item.id"
			style="padding:0 26rpx;" :class="styleType == 1?'style1':'style2'"
			:style="hiddenFirstTop && index == 0 ?'margin-top:0;':''">
			<view class="flex">
				<view v-if="styleType == 2">
					<view style="padding-top: 36rpx;margin-left: 60rpx;margin-right: 22rpx;"
						class="flex flex-y flex-x-y">
						<view class=" color-333333" style="font-size: 48rpx;line-height: 42rpx;">{{item.day}}
						</view>
						<view class="fs-24" style="color: #888888;"><text class="">{{item.month}}</text>月
						</view>
					</view>
				</view>
				<view class="flex-1">
					<view v-if="styleType == 1" class="fs-26 mt-24" style="color: #B6B6B6;">
						<timestamp v-if="item.createTime" timeType="2" :time="item.createTime"></timestamp>
					</view>
					<view style="height: 20rpx;" v-if="styleType == 2"></view>
					<view class="fs-28 color-333333 mt-10"
						style="word-break: break-word;text-align: justify;white-space: pre-line;">
						<text :selectable="true">{{item.detail || ''}}</text>
					</view>

					<!-- 图片 -->
					<view class="flex flex-wrap mt-10" style="" v-if="item.image && item.image.length>0 && item.image[0]">
						<!-- 一张图片 -->

						<template v-if="item.image && item.image.length == 1">
							<image class="" @tap.stop="prview_image(item.image[0],item.image)" :src="item.image[0]"
								mode="aspectFill" style="" :lazy-load="true"
								:class="styleType ==1 ?'image-big1':'image-big2'"></image>
						</template>
						<template v-else>
							<image @tap.stop="prview_image(item2,item.image)" :src="item2"
								v-for="(item2,index2) in item.image" :key="index2" mode="aspectFill"
								class="active-images " :lazy-load="true"
								:class="styleType ==1 ?'image-small1':'image-small2'" style="">
							</image>
						</template>

						<!-- 多张图片 -->
						<!-- <image :src="user_info.avatarUrl" mode="aspectFill" class="active-images "
							:class="styleType ==1 ?'image-small1':'image-small2'" style="">
						</image>
						<image :src="user_info.avatarUrl" mode="aspectFill" class="active-images "
							:class="styleType ==1 ?'image-small1':'image-small2'" style="">
						</image>
						<image :src="user_info.avatarUrl" mode="aspectFill" class="active-images "
							:class="styleType ==1 ?'image-small1':'image-small2'" style="">
						</image> -->
					</view>
					<view v-else style="height: 30rpx;"></view>
					<!-- 图片 -->

					<!-- 点赞 -->
					<view v-if="styleType2 == 1" class="flex flex-y-center color-999999 fs-28 iamge-zan"
						style="height: 80rpx;margin-top: 8rpx;border-top: 1rpx solid #f6f6f6;">
						<view class="flex-1 flex flex-x-y" @tap.stop="to_like(item)">
							<view class="iconfont icon-zan" :style="item.liked?'color: #07ABA1;':''"></view>
							<view class="ml-10" :style="item.liked?'color: #07ABA1;':''">{{item.likes}}</view>
						</view>
						<view class="flex-1 flex flex-x-y" @tap.stop="to_comment(item)">
							<view class="iconfont icon-xiaoxi"></view>
							<view class="ml-10">{{item.comments}}</view>
						</view>
						<view class="flex-1 flex flex-x-y pr" @tap.stop="clear">
							<view class="iconfont icon-fenxiang1"></view>
							<view class="ml-10">分享</view>
							<button @tap.stop="to_share_app(item)"
								style="width: 100%;height:100%;position: absolute;top: 0;opacity: 0;"
								data-sharetype="active" :data-image="item.image" :data-aid="item.id"
								:data-title="item.detail" open-type="share"></button>
						</view>
					</view>
					<view v-if="styleType2 == 2" class="flex flex-y-center color-999999 fs-28 iamge-zan"
						style="height: 80rpx;margin-top: 8rpx;border-top: 1rpx solid #f6f6f6;">
						<view class="flex-1">
							<text @tap.stop="edit_item(item)" v-if="item.shopId == user_info.shopId"
								class="iconfont icon-gengduo color-999999"
								style="font-size: 60rpx;padding:10rpx 10rpx 10rpx 0;"></text>

						</view>
						<view class="flex flex-y-center">
							<view class="flex flex-x-y fs-24" @tap.stop="to_like(item)">
								<view class="iconfont icon-zan" :style="item.liked?'color: #07ABA1;':''"></view>
								<view class="ml-10" :style="item.liked?'color: #07ABA1;':''">{{item.likes}}</view>
							</view>
							<view class="flex flex-x-y fs-24" @tap.stop="to_comment(item)">
								<view class="iconfont icon-xiaoxi" style="margin-left: 60rpx;"></view>
								<view class="ml-10">回复</view>
							</view>
							<view class="flex flex-x-y fs-24 pr" style="margin-right: 18rpx;" @tap.stop="clear">
								<view class="iconfont icon-fenxiang1" style="margin-left: 60rpx;"></view>
								<view class="ml-10">分享</view>
								<button @tap.stop="to_share_app(item)"
									style="width: 100%;height:100%;position: absolute;top: 0;opacity: 0;"
									data-sharetype="active" :data-image="item.image" :data-aid="item.id"
									:data-title="item.detail" open-type="share"></button>
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
		name: "active-list",
		props: {
			list: {
				type: Array,
				default: () => []
			},
			//样式1样式
			styleType: {
				type: String,
				default: '1'
			},
			//样式二样式
			styleType2: {
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
			//点击回复是否跳转页面
			commentType: {
				type: String,
				default: '1'
			},
			hanldeType: {
				type: String,
				default: '1',
			}

		},
		data() {
			return {

			};
		},
		methods: {
			to_detail(item) {
				if (this.hanldeType == 1) {
					this.toPage('/pages/store/active?id=' + item.id, '', true);
				}
				if (this.hanldeType == 2) {
					//不跳转
				}
			},
			prview_image(src, url) {
				uni.previewImage({
					current: src,
					urls: url
				})
			},
			to_comment(item) {
				if (this.commentType == 1) {
					this.toPage('/pages/store/active?id=' + item.id, '', true);
					return;
				}
				if (this.commentType == 2) {
					this.$emit('comment', item);
					return;
				}
				if (this.commentType == 3) {
					// this.$emit('comment', item);
					// return ;
				}


			},
			to_like(item) {

				if (!this.login()) {
					this.click(() => {
						this.request({
							url: !item.liked ? `/zhoudao/zdAActivityUser/addLikes/${item.id}` :
								`/zhoudao/zdAActivityUser/delLikes/${item.id}`,
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
			edit_item(item) {
				let arr = ['置顶', '删除'];
				uni.showActionSheet({
					title: '',
					itemList: arr,
					success: res => {
						if (res.tapIndex == 0) {
							this.to_top(item);
							return;
						}
						if (res.tapIndex == 1) {
							this.del_active(item);
							return;
						}
					}
				})
			},
			del_active(item) {
				this.request({
					url: `/zhoudao/zdAActivity/del/${item.id}`,
					loading: true,
				}).then(res => {
					if (!this.rsuccess(res)) return;
					this.showToast('删除成功');
					uni.$emit('del_active_success', item);
					this.$emit('delActiveSuccess', item);

				});
			},
			to_top(item) {
				this.request({
					url: `/zhoudao/zdAActivity/top/${item.id}/${this.user_info.shopId}`,
					loading: true,

				}).then(res => {
					if (!this.rsuccess(res)) return;
					this.showToast('置顶成功');
					uni.$emit('to_top_succes', item);
				});
			},
			to_share_app(item) {
				// #ifdef MP-WEIXIN
				return;
				// #endif
				let path = `pages/store/active?id=${item.id}`;
				let title = item.detail;
				this.shareApp(path, title);
			}
		}
	}
</script>

<style>
	.active-images {
		/* margin-left: 16rpx; */
		margin-bottom: 14rpx;
		margin-right: 14rpx;
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
</style>
