<template>
	<view>
		<custom title="意见反馈" fixed="fixed" background="#F5F6F7"></custom>

		<view class="flex flex-x-y fs-24 color-all">
			<view class="fb-bar"></view>
			<view style="line-height: 34rpx;">欢迎您提供宝贵的意见和建议</view>
			<view class="fb-bar"></view>
		</view>
		<view class="flex mt-20">

			<view class="ml-20 mr-20 flex-1">
				<view style="background-color: #fff;border-radius: 10rpx;padding-bottom: 46rpx;" class="p-20">
					<view>
						<text class="fs-32 color-323232">反馈类型</text>
					</view>

					<view class="flex flex-wrap flex-x-b">
						<view @tap.stop="change_type(index)" class="type-item flex flex-x-y"
							:style="index == feedback_index ?'background-color:#FF882F;border:none;color:#FFFFFF':''"
							v-for="(item,index) in feedback_type" :key="index">{{item}}</view>
					</view>
				</view>

				<!-- <view class="mt-30">
					<text style="color: #FC543B;">*</text>
					<text class="fs-30 color-333333">反馈类型</text>
				</view> -->

				<view class="pr">
					<textarea placeholder="请详细描述反馈理由" v-model="remark" :maxlength="200" class="remark-box"></textarea>

					<view class="remark-num">
						{{get_num()}}/200
					</view>
				</view>


				<view class="mt-30">
					<text class="fs-32 color-323232 ml-20">添加图片 ({{img_list.length}}/8)</text>
				</view>
				<view style="margin-top: 8rpx;"></view>


				<upload @change="chang_image" ref="upload" marginRight="14rpx" marginTop="14rpx" :length="8"
					width="160rpx" height="160rpx"></upload>

				<!-- 	<view class="mt-30 flex flex-y-center"
					style="margin-top: 72rpx;padding-bottom: 30rpx;border-bottom: 2rpx solid #eeeeee;">
					<text style="color: #FC543B;">*</text>
					<text class="fs-30 color-333333">您的姓名</text>
					<input type="text" placeholder="请输入您的姓名" placeholder-class="font" class="fs-32 color-333333 flex-1"
						style="margin-left: 43rpx;" v-model="name" maxlength="10">
				</view> -->
				<!-- <view class="mt-30 flex flex-y-center" style="margin-top: 32rpx;padding-bottom: 30rpx;">
					<text class="fs-30 color-333333">联系方式</text>

				</view>
				<input type="number" placeholder="请填写你的手机号" placeholder-class="font" class="fs-26 color-black flex-1"
					style="margin-left: 0rpx;background-color: #F2F2F3;height: 72rpx;border-radius: 16rpx;padding-left: 20rpx;"
					:maxlength="11" v-model="mobile">
 -->
				<view class="flex flex-x-y mt-30">
					<view class="default-submit flex-1" style="transition: all 0.3s;"
						:style="hui?'color:#323232;background: #DFDFDF !important;':''" @tap.stop="submit">提交</view>
				</view>
				<view style="height: 50rpx;"></view>


			</view>


		</view>
		<toast ref="toast"></toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feedback_type: [
					'服务态度',
					'服务态度',
					'商品劣质',
					'信息虚假',
					'没有保障',
					'其他'
				],
				feedback_index: 0,
				remark: '',
				mobile: '',
				img_list: [],
				name: '',
			}
		},
		computed: {
			hui() {
				if (String(this.remark).trim() === '') {
					return true;
				}
				return false;
			}
		},
		methods: {
			change_type(index) {
				this.feedback_index = index;
			},
			get_num() {
				let num = String(this.remark).trim().length;
				return num >= 200 ? 200 : num;
			},
			chang_image(list) {
				console.log('ssss', list);
				this.img_list = list.filter(val => val.id).map(val => val.src);
			},
			submit() {

				this.click(() => {
					if (this.remark.trim().length == 0) {
						this.showToast('请输入反馈信息哦');
						return;
					}
					this.request({
						url: '/feedback/add',
						data: {
							type: this.feedback_type[this.feedback_index],
							detail: this.remark.trim(),
							image: this.img_list.join(','),
							name:this.user_info.name,
							phone:this.user_info.phone

						},
						method: 'POST',
						loading: true,
					}).then(res => {
						if (!this.rsuccess(res)) return;
						this.$refs.toast.open({
							left: '',
							desc: '反馈成功',
							success: () => {
								this.uniBack();
							}
						});
					});
				});

			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.type-item {
		width: 180rpx;
		height: 60rpx;
		margin-top: 32rpx;
		border-radius: 36rpx;
		font-size: 28rpx;
		white-space: nowrap;
		border: 2rpx solid #EFEFEF;
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

	.fb-bar {
		height: 2rpx;
		background-color: $bgColor;
		width: 100rpx;
		margin: 0 18rpx;
	}
</style>
