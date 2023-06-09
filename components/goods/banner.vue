<template>
	<view class="banner-box pr">
		

		<swiper @change="change" :circular="true" class="banner-swiper" :indicator-dots="false" :autoplay="autoplay"
			:interval="4000" :duration="500">
	
			<!-- 图片 -->
			<template v-if="goods.banner && goods.banner.length > 0">
				<swiper-item v-for="(item,index) in goods.banner" :key="index">
					<view class="swiper-item pr">
						<image @tap.stop="preview_img(item)" :show-menu-by-longpress="true" :lazy-load="true" class="banner-image" :src="item"
							mode="aspectFill"></image>
						<!-- 商品已抢光蒙版 -->
						<!-- <view v-if="goods && goods.goods_num == 0"
							style="width: 750rpx;height: 750rpx;z-index: 2;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.6);">
							<view class="sold-out">
								<view class="line1">已抢光</view>
								<view class="line3"></view>
								<view class="line2">sold out</view>
							</view>
						</view> -->
					</view>
				</swiper-item>
			</template>
		</swiper>



		<!-- 轮播指示点 -->
		<!-- <template v-if="true">
			<view v-if="goods.banner && goods.banner.length>0"
				style="position: absolute;right: 30rpx;bottom: 30rpx;z-index: 3;">
				<view class="swiper-index">
					{{swiper_index + 1}}/{{ goods.video ?  goods.banner.length + 1 : goods.banner.length}}
				</view>
			</view>
		</template> -->



		
		

	</view>
</template>

<script>
	export default {
		name: 'banner',
		data() {
			return {
				swiper_index: 0,
				play: false,
				autoplay: true,
				muted: true,
			}
		},
		watch: {
			goods(new_value, old_value) {
				if (new_value.video) {
					this.autoplay = false;
				}
			},
		},
		computed: {
			show_tips() {
				if(this.goods.video && this.swiper_index == 0){
					return false;
				}
				if (!this.play)
					return true;
				if (this.swiper_index > 0)
					return true;
				return false;
			},
		},
		props: {
			goods: {
				type: Object,
				default: () => {
					return {
						banner: [
							
						],
						video: ''
					}
				}
			}
		},
		methods: {
			change(e) {
				this.swiper_index = e.detail.current;
				if (e.detail.current != 0) {
					this.autoplay = true;
				}
			},
			preview_img(item) {
				uni.previewImage({
					current: item,
					urls: this.goods.banner
				})
			},
			video_play() {
				this.play = true;
				this.autoplay = false;
			},
			video_pause() {
				this.autoplay = true;
			},
			loadedmetadata(e) {
				console.log('viewo', e)
				this.autoplay = false;
				this.play = true;
				// let video = uni.createVideoContext('videobanner');
				// setTimeout(()=>{
				// 	video.play();
				// },100)

			},
			fullscreenchange() {
				this.muted = false;
			},
		}
	}
</script>

<style>
	.banner-box {
		width: 750rpx;
		height: 750rpx;
		overflow: hidden;
		background-color: #F4F4F4;
	}

	.banner-swiper {
		width: 750rpx;
		height: 750rpx;
	}

	.swiper-item {
		width: 750rpx;
		height: 750rpx;
		overflow: hidden;
	}

	.banner-video {
		width: 750rpx;
		height: 750rpx;
	}

	.banner-image {
		width: 750rpx;
		height: 750rpx;
	}

	.swiper-index {
		min-width: 76rpx;
		height: 46rpx;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 28rpx;
		padding: 0 10rpx;
	}

	.bottom-image {
		width: 750rpx;
		height: 96rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.bottom-text {
		position: relative;
		z-index: 6;
		height: 96rpx;
		margin-right: 28rpx;
		color: #FFFFFF;
		font-size: 30rpx;

	}

	.sold-out {
		position: absolute;
		top: 250rpx;
		left: 275rpx;

		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		background: rgba(38, 38, 38, 0.3);
		z-index: 2;
		color: #FFFFFF;
		text-align: center;
		display: flex;
		align-items: center;
		flex-flow: column nowrap;
		justify-content: center;
	}

	.sold-out .line1 {
		font-size: 40rpx;
		font-weight: 550;

	}

	.sold-out .line3 {
		width: 134rpx;
		height: 2rpx;
		background-color: #FFFFFF;
		margin-top: 12rpx;
	}

	.sold-out .line2 {
		font-size: 30rpx;
		margin-top: 6rpx;
	}
</style>
