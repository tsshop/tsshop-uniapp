<template>
	<view>
		<custom fixed="fixed" background="#F5F6F7" mode="2" title="发表评价" :titleBold="false"></custom>
		<view class="post-comments">
			<view class="order-info">
				<view class="shop flex flex-y-center">
					<image src="../../static/tsshop/shangdian.png" mode=""></image>
					<view class="color-333333 fs-32 over-line1">
						TSSHOP
					</view>
				</view>
				<view class="flex  mt-20">
					<view class="" style="width: 132rpx;height: 132rpx;border-radius: 10rpx;overflow: hidden;">
						<image :src="info.src" mode="aspectFill" class="wh-100"></image>
					</view>
					<view style="line-height: 36rpx;width: 400rpx;" class="over-line2 m-20">
						<view class="over-line1">
							{{info.goodsName}}
						</view>
					</view>
				</view>
				<view class="flex mt-20">
					<view class="fs-28 color-323232">
						商品评价
					</view>
					<view class="flex ml-20">
						<stars v-model="star"></stars>
					</view>

				</view>
			</view>
			<view class="pr">
				<textarea placeholder="请输入您的评价可以帮助更多想购买的人" v-model="remark" :maxlength="200" class="remark-box"></textarea>

				<view class="remark-num">
					{{get_num()}}/200
				</view>
			</view>
			<view class="">
				<upload @change="chang_image" ref="upload" marginRight="14rpx" marginTop="14rpx" :length="8"
					width="160rpx" height="160rpx"></upload>
			</view>
			<view class="flex anonymous flex-y-center">
				<image v-if="!isAnonymous" src="../../static/tsshop/unchecked.png" mode="" @tap.stop="anonymous"></image>
				<image v-else src="../../static/tsshop/checked.png" mode="" @tap.stop="anonymous"></image>
				<view class="">
					匿名发表
				</view>
			</view>
			<view class="flex flex-x-y mt-30">
				<view class="default-submit flex-1" style="transition: all 0.3s;"
					:style="hui?'color:#323232;background: #DFDFDF !important;':''" @tap.stop="submit">提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
				},
				remark: '',
				isAnonymous: 0,
				star:-1,
				id:'',
				img_list: [],
			};
		},
		computed: {
			hui() {
				if (String(this.remark).trim() === '') {
					return true;
				}
				return false;
			}
		},
		onLoad(e) {
			console.log(e)
			if(e.id) {
				this.id = e.id
			}
			this.get_detail()
		},
		methods: {
			get_detail() {
				this.request({
					url: '/order/detail',
					data: {
						orderId: this.id,
					},
					loading: true,
				}).then(res => {
					if (res.status == 200) {
						
						
						res.data.src = res.data.src.split(',')[0]
						this.info = res.data;
						console.log(this.info)
					}
				});
			},
			get_num() {
				let num = String(this.remark).trim().length;
				return num >= 200 ? 200 : num;
			},
			anonymous() {
				
				this.isAnonymous = this.isAnonymous ==1?0:1
			},
			submit() {
			
				this.click(() => {
					if (this.remark.trim().length == 0) {
						this.showToast('请输入评价哦');
						return;
					}
					this.request({
						url: '/goodsReview/review',
						data: {
							orderId:this.id,
							score:this.star + 1,
							review:this.remark,
							imgs: this.img_list.join(','),
							anonymous:this.isAnonymous
			
						},
						method: 'POST',
						loading: true,
					}).then(res => {
						if(res.status != 200) return 
						console.log('success')
						// this.showToast('评价成功')
						
						// this.Page('/pages/evaluate/evaluate?type=1')
						this.showToast('评价成功');
						setTimeout(() => {
							this.uniBack();
						}, 500)
					});
				});
			
			},
			chang_image(list) {
				console.log('ssss', list);
				this.img_list = list.filter(val => val.id).map(val => val.src);
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F6F7;
	}

	.post-comments {
		padding: 20rpx;

		.order-info {
			padding: 20rpx;
			margin-top: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding-bottom: 40rpx;

			.shop {
				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 20rpx;
				}

				view {
					width: 80%;
				}
			}

			.stars {
				font-size: 20rpx;
				padding:0 8rpx;
				color: #dfdfdf;
			}
		}

		.remark-box {
			font-size: 28rpx;
			color: #333;
			width: 100%;
			min-height: 218rpx;
			background-color: #FFFFFF;
			border-radius: 8rpx;
			padding: 24rpx;
			margin-top: 24rpx;
		}

		.remark-num {
			position: absolute;
			z-index: 3;
			right: 32rpx;
			bottom: 24rpx;
			font-size: 28rpx;
			color: #999;
		}

		.anonymous {
			margin-top: 20rpx;

			image {
				width: 36rpx;
				height: 36rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
