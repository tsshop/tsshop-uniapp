<template>
	<view class="flex flex-y-start" :class="!info.mine?'msg-left':'msg-right'" style="padding:32rpx 28rpx 0 28rpx;"
		:style="info.mine?'flex-direction: row-reverse;':''">
		<!-- 头像 -->
		<view class="msg-image-box" @tap.stop="to_detail">
			<!-- <image :src="info.avatarUrl" mode="aspectFill"></image> -->
			<qq-image :url="info.avatarUrl" class="avatar-image"></qq-image>
		</view>
		<!-- 头像 -->
		<!-- 内容 -->
		<view style="overflow: hidden;max-width: 300rpx;">
			<view v-if="!info.mine && chatType!='one'" class="msg-nickname" @tap.stop="to_detail">
				{{remark_obj[info.id] || remark_obj[info.fromid] || info.name}}
			</view>
			<view class="msg-content">
				<view style="overflow: hidden;" @longpress="shoucang(info.content)">
					<!-- <image  :lazy-load="true" @tap.stop="preview_img(info.content)"
						:src="info.content" mode="widthFix"
						style="width: auto;border-radius: 8rpx;height: auto;max-height: 800rpx;max-width: 100%;min-width: 300rpx;max-width: 400rpx;">
					</image> -->
					<!-- <image  :lazy-load="true" @longpress="shoucang(info.content)" :src="info.content"
						mode="widthFix"
						style="width: auto;border-radius: 8rpx;height: auto;max-height: 800rpx;max-width: 100%;min-width: 200rpx;max-width: 400rpx;">
					</image> -->
					<qq-image  :url="info.content" mode="widthFix"
						imageStyle="width: auto;border-radius: 8rpx;height: auto;max-height: 800rpx;max-width: 100%;min-width: 200rpx;max-width: 400rpx;">
					</qq-image>
				</view>
			</view>
		</view>
		<!-- 内容 -->
	</view>
</template>

<script>
	export default {
		name: "msgEmoji",
		props: {
			info: {
				type: Object,
				default: () => {},
			},
			chatType: {
				type: String,
				default: '',
			},

		},
		data() {
			return {

			};
		},
		watch: {


		},
		methods: {
			preview_img(img) {
				uni.previewImage({
					urls: [img],
					current: img
				})
			},
			to_detail() {
				return;
				if (this.info.mine) {
					this.toPage('/pages/chat/user?mine=true');
				} else {
					this.$emit('show', this.info);
				}
			},
			shoucang(url) {
				uni.showActionSheet({
					itemList: ['收藏'],
					success: (res) => {
						if (res.tapIndex == 0) {
							this.request({
								url: '/chat/emoticon/save',
								method: 'POST',
								chat: true,
								loading: true,
								data: {
									url,
								}
							}).then(res => {
								getApp().globalData.bqb = '';
								//重新获取
								uni.$emit('refresh_bqb');
							});

						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.msg-image-box {
		width: 68rpx;
		height: 68rpx;
		border-radius: 16rpx;
		// background-color: rgba(255, 255, 255, 0.65);
		overflow: hidden;

		.avatar-image {
			width: 100%;
			height: 100%;
		}
	}

	.msg-nickname {
		margin-bottom: 20rpx;
		font-size: 26rpx;
		color: #323232;
		line-height: 28rpx;
	}

	.msg-content {
		// background-color: #2D2E30;
		text-align: justify;
		font-size: 32rpx;
		color: #fff;
	}

	.msg-left {
		.msg-image-box {
			margin-right: 20rpx;
		}

		.msg-content {
			border-radius: 8rpx 16rpx 16rpx 16rpx;
		}
	}

	.msg-right {
		.msg-image-box {
			margin-left: 20rpx;
		}

		.msg-content {
			border-radius: 16rpx 8rpx 16rpx 16rpx;
		}
	}
</style>
