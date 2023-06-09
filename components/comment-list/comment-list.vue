<template>
	<view>
		<!-- 列表 -->
		<view v-for="(item,index) in list" :key="index" class="w-all ml-30">
			<view class="flex"
				style="padding-top: 18rpx;margin-bottom: 12rpx;border-bottom: 1rpx solid #f8f8f8;padding-bottom: 39rpx;">
				<!-- 头像 -->
				<image :src="item.userAvatarUrl" mode="aspectFill" class="br-50" style="width: 80rpx;height: 80rpx;"
					:lazy-load="true"></image>
				<!-- 头像 -->
				<!-- 右侧内容 -->
				<view class="flex-1 ml-30">
					<view class="flex flex-y-center fs-28 color-333333">
						<view class="flex flex-y-center flex-1">
							<view>
								<text>{{item.userName}}</text>
								<text style="" class="shagnjia" v-if="item.userIsShop">商家</text>
							</view>
							<view class="ml-20 fs-24" style="color: #cccccc;line-height: 24rpx;">
								<timestamp :time="item.createTime"></timestamp>
							</view>
						</view>

						<view @tap="to_like(item)" class="flex flex-y-center flex-x-end" style="color: #888888;"
							:style="item.liked == 1?'color: #07ABA1;':''">
							<view class="iconfont icon-zan" style="font-size: 28rpx;"></view>
							<view class="fs-28 ml-10">{{item.likes}}</view>
						</view>

					</view>

					<!-- 一级评论 -->
					<view @tap.stop="to_comment_one(item,index,0,item.id)"
						style="margin-top: 6rpx;word-break: break-word;" class="fs-28 color-333333">
						{{item.detail || ' '}}
					</view>
					<!-- 一级评论 -->
					<!-- 二级评论 -->
					<view class="br-16" v-if="item.sonList && item.sonList.length >0"
						style="margin-top: 13rpx;background: rgba(72,217,208,0.10);padding:10rpx 20rpx 24rpx 20rpx;">

						<view @tap.stop="to_comment_one(item2,index,index2,item.id)"
							v-for="(item2,index2) in item.sonList" :key="index2" style="margin-top: 14rpx;"
							class="fs-26 color-999999">
							<!-- 姓名 -->
							<text>{{item2.userName}}</text>
							<!-- 姓名 -->
							<!-- 商家标识 -->
							<text style="" class="shagnjia" v-if="item2.userIsShop">商家</text>
							<!-- 商家标识 -->
							<!-- @@@@ -->
							<text class="color-333333" v-if="item2.toId && item2.toName && (user_info.id != item.userId)">@{{item2.toName}}</text>
							<!-- @@@@ -->
							<!-- 评论内容 -->
							<text class="color-666666" style="white-space: pre-line;
		text-align: justify;word-break: break-word;">：{{item2.detail}}</text>
							<!-- 评论内容 -->
							<!-- 时间 -->
							<!-- <view class="fs-26 color-999999 flex flex-x-start">
								<timestamp :time="item.createTime"></timestamp>
							</view> -->
							<!-- 时间 -->
						</view>



						<view @tap.stop="show_more(item)" class="fs-24" style="color: #07ABA1;margin-top: 14rpx;"
							v-if="item.sonNum >3 && !item.show_more">
							展开全部{{item.sonNum}}评论
						</view>

					</view>
					<!-- 二级评论 -->


				</view>
				<!-- 右侧内容 -->
			</view>
		</view>
		<!-- 列表 -->
	</view>
</template>

<script>
	export default {
		name: "comment-list",
		props: {
			list: {
				type: Array,
				default: () => []
			},
			shopId: {
				type: [String, Number],
				default: -1
			}
		},
		data() {
			return {
				aid: '',
			};
		},
		methods: {
			// @tap="to_like(item)"
			to_like(item) {

				if (!this.login() && !item.liked) {
					this.click(() => {
						this.request({
							url: `/zhoudao/zdAActivityUser/addUserLikes/${item.id}`,
							data: {
								// shopId: item.shopId,
							},
							method: 'POST',
						}).then(res => {
							if (!this.rsuccess(res)) return;
							item.liked = true;

							item.likes = Number(item.likes) + 1;
							this.$emit('changeValue', {
								key: 'comment_list',
								value: this.list
							});

						});
					});
				}
			},
			to_comment_one(item, index1, index2, imId) {
				if (this.login()) return;
				// if (item.userId == this.user_info.id) return;
				let item1 = this.clone(item);
				item1.id = imId;
				this.$emit('toOne', {
					item: item1,
					index1,
					index2
				});
			},
			show_more(item) {
				//获取二级评论
				this.request({
					url: '/zhoudao/zdAActivityUser/oneList',
					loading: true,
					data: {
						pageSize: 300,
						pageNumber: 1,
						activityId: this.aid,
						imId: item.id,
					},
					loading: true,
				}).then(res => {
					if (!this.rsuccess(res, true)) return;
					item.show_more = true;
					item.sonList = res.data;

					this.$emit('changeValue', {
						key: 'comment_list',
						value: this.list
					});
				});
			},
		}
	}
</script>

<style>
	.shagnjia {
		/* display: inline-block; */
		font-size: 24rpx;

		font-size: 24rpx;
		color: #07aba1;
		line-height: 34rpx;
		/* white-space: nowrap; */
		text-align: center;
		border: 1rpx solid #07aba1;
		border-radius: 4rpx;
		margin-left: 10rpx;
		margin-right: 6rpx;
		padding: 0 10rpx;
	}
</style>
