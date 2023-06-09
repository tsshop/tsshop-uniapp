<template>
	<view class="flex" style="flex-wrap: wrap;" :style="hidden?'width: 0;height:0;overflow: hidden;':''">

		<!-- 图片列表 -->
		<view :style="{width,height,marginTop,marginRight}" class="upload-img pr" v-for="(item,index) in image_list"
			:key="index">
			<image @tap="preview(index)" :src="item.path || item.src" mode="aspectFill"></image>

			<!-- 删除按钮 -->
			<view class="upload-del" style="">
				<view @tap.stop="del_img(index)" class="iconfont icon-lajitong color-ffffff" style="font-size: 38rpx;">
				</view>

			</view>
			<!-- 删除按钮 -->

			<!-- 上传遮罩 -->
			<view class="upload-box" v-if="!item.src">
				<view>上传中...</view>
			</view>
			<!-- 上传遮罩 -->

		</view>
		<!-- 图片列表 -->

		<!-- 上传图片按钮 -->
		<view v-if="length > image_list.length" :style="{width,height,marginTop,marginRight}" class="upload-btn"
			hover-class="click" @tap="choose_image()">
			<image style="width: 54rpx;height: 48rpx;" src="../../static/zhoudao/xiangji.png">
			</image>
			<view v-if="desc" class="fs-22 color-999999">{{desc}}</view>
		</view>
		<!-- 上传图片按钮 -->
	</view>
</template>

<script>
	export default {
		name: 'upload',
		props: {
			width: {
				type: String,
				default: '145rpx',
			},
			height: {
				type: String,
				default: '145rpx',
			},
			//整个容器宽度
			contentWidth: {
				type: String,
				default: '100%',
			},
			marginRight: {
				type: String,
				default: '20rpx',
			},
			marginTop: {
				type: String,
				default: '20rpx',
			},
			length: {
				type: Number,
				default: 1,
			},
			hidden: {
				type: Boolean,
				default: false,
			},
			//压缩后图片宽度
			imageWidth: {
				type: Number,
				default: 0,
			},
			desc: {
				type: String,
				default: '',
			}
		},
		data() {
			return {
				image_list: [

				],

			}
		},
		methods: {
			choose_image(sourceType = ['album', 'camera']) {

				if (this.length <= this.image_list.length)
					return;
				// #ifdef H5
				sourceType = ['album'];
				// #endif
				uni.chooseImage({
					sourceType: sourceType,
					count: this.length - this.image_list.length,
					success: res => {
						// console.log(res);
						let {
							tempFilePaths = []
						} = res
						tempFilePaths.forEach(val => {
							let id = new Date().getTime().toString();
							this.image_list.push({
								path: val,
								src: '',
								id,
							});
							if (this.imageWidth == 0) {
								this.upload_image(val, id);
							} else {
								// #ifdef H5
								this.upload_image(val, id);
								// #endif
								// #ifndef H5
								uni.compressImage({
									src: val,
									width: this.imageWidth,
									success: img => {
										this.upload_image(img.tempFilePath, id);
									},
									fail: err => {
										console.log('err', err);
									}
								});
								// #endif
							}
						})


					}
				})
			},
			upload_image(url, id) {

				let appUrl = this.ROOT + '/file/uploadFile';
				uni.uploadFile({
					url: appUrl,
					filePath: url,
					data: {
						img: 'file',
						name: 'file'
					},
					name: 'file',
					success: img_data => {
						// console.log('img_Data', img_data);

						if (img_data.statusCode == 200 && img_data.errMsg == 'uploadFile:ok') {
							let data = JSON.parse(img_data.data);
							if (data.status == 200) {
								this.image_list.forEach((val, index) => {
									if (val.id == id) {
										val.src = data.data;
										// val.id = data.data.image_id;

										// console.log('上传成功', id, index, val)
										this.$emit('change', this.image_list);
									}
								})
							} else {
								this.image_list.forEach((val, index) => {
									if (val.id == id) {
										val.id = '';
									}
								});
								this.$emit('change', this.image_list);
							}

						}
					}
				})

			},
			preview(index) {
				uni.previewImage({
					current: index,
					urls: this.image_list.map(val => val.path || val.src)
				})
			},
			del_img(index) {
				this.image_list.splice(index, 1);
				this.$emit('change', this.image_list);
			}
		}
	}
</script>

<style lang="scss">
	.upload-btn {
		// background-color: #FFFFFF;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 2rpx dashed #cdc9c9;
	}

	.upload-img {
		background-color: #FFFFFF;
		border-radius: 8rpx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.upload-del {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
		z-index: 5;
		width: 48rpx;
		height: 48rpx;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0 0 0 10rpx;
	}

	.upload-box {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 24rpx;
		z-index: 4;
	}
</style>
