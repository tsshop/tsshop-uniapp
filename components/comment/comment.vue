<template>
	<view>
		<view class="comment">
			<view class="comment-item" v-for="(item,index) in list" :key="index">
				<view class="flex flex-y-center">
					<image class="userImg"  :src="item.avatar" style="background-color: #F5F6F7;" mode="aspectFill"></image>
					<view class="flex1">
						<view class="flex flex-x-b color-646464 fs-24">
							<view class="">
								{{item.userName}}
							</view>
							<view class="">
								{{item.time}}
							</view>
						</view>
						<view class="flex">
							<stars :disabled="true" :value="item.score - 1"></stars>
						</view>
					</view>
				</view>
				<view class="color-323232 fs-24 mt-20">
					{{item.review}}
				</view>
				<view v-if="item.imgList.length > 0" class="flex mt-20">
					<view class="imglist">
						<image @tap.stop="priview_image(item.imgList,i)" :key="i1"  v-for="(i,i1) in item.imgList" v-if="i" :src="i" mode="aspectFill" class="img-item"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"comment",
		data() {
			return {
				
			}
		},
		props: {
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
		},
		methods: {
			priview_image(list,url){
				uni.previewImage({
					urls:list,
					current:url,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.comment {
		width: 100%;
		padding: 0 20rpx;

		.comment-item {
			width: 100%;
			margin-top: 40rpx;

			.userImg {
				width: 68rpx;
				height: 68rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.img-item {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

		}

	}
</style>
