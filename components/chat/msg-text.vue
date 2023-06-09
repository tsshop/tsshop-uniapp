<template>
	<view class="flex flex-y-start" :class="!info.mine?'msg-left':'msg-right'" style="padding:32rpx 28rpx 0 28rpx;"
		:style="info.mine?'flex-direction: row-reverse;':''">
		<!-- 头像 -->
		<view class="msg-image-box" @tap.stop="to_detail" :style="info.mine?'border-radius:50%;':''">
			<!-- <image :lazy-load="true" :src="info.avatarUrl" mode="aspectFill"></image> -->
			<qq-image :url="info.avatarUrl" imageStyle="width: 100%;height: 100%;"></qq-image>
		</view>
		<!-- 头像 -->
		<!-- 内容 -->
		<view style="max-width: 452rpx;">
			<view v-if="!info.mine && chatType!='one'" @tap.stop="to_detail" class="msg-nickname">
				{{remark_obj[info.id] || remark_obj[info.fromid] || info.name}}
			</view>
			<view class="msg-content pr" style="display: inline-block;">
				<view style="display: inline-block;">
					<text :selectable="true" style="">{{info.content}}</text>
				</view>
			</view>
		</view>
		<!-- 内容 -->
	</view>
</template>

<script>
	export default {
		name: "msgText",
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
			to_detail() {
				return;
				if (this.info.mine) {
					this.toPage('/pages/chat/user?mine=true');
				} else {
					this.$emit('show', this.info);
				}
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
			
		}
	}

	.msg-nickname {
		margin-bottom: 20rpx;
		font-size: 26rpx;
		color: #323232;
		line-height: 28rpx;
	}

	.msg-content {
		background-color: #FFFFFF;
		padding: 16rpx 20rpx;
		// text-align: justify;
		font-size: 28srpx;
		color: #3B4644;
		white-space: pre-line;
		// word-break: break-all;
		word-break: break-word;
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
			background-color: #46D9C5;
			color: #FFFFFF;
		}


	}
</style>
