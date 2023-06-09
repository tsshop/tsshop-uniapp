<template>
	<image :src="src" :style="imageStyle" :mode="mode" :lazy-load="true"></image>
</template>

<script>
	export default {
		props: {
			url: {
				type: String,
				default: ''
			},
			fileMd5: {
				type: String,
				default: ''
			},
			imageStyle: {
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'aspectFill'
			}
		},
		data() {
			return {
				src: '', // 图片地址
				downloadTask: '', //下载任务
			}
		},
		watch: {
			// 监听头像md5值的变化
			url(val) {
				// 查找获取图片缓存
				this.getImageCache();
			}
		},
		created() {
			// 查找获取图片缓存
			this.getImageCache()
		},
		destroyed() {
			// if (this.downloadTask) {
			// 	this.downloadTask.abort();
			// }
			if (getApp().globalData.cacheImage) {
				delete getApp().globalData.cacheImage[this.url];
			}
		},
		methods: {
			// 查找获取图片缓存
			async getImageCache() {

				// console.log('sss');
				if (!this.url) return;
				if (String(this.url).indexOf('http') == -1) {
					this.src = this.url;
					return;
				}
				// #ifndef APP-PLUS
				this.src = this.url;
				return;
				// #endif
				// 图片缓存key值
				let storageKey = 'IMAGE_CACHE_INFO_' + this.url;
				// uni.setStorageSync(storageKey, '');
				// 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
				const cacheFileInfo = uni.getStorageSync(storageKey)
				if (cacheFileInfo) {
					
					uni.getSavedFileInfo({
						filePath: cacheFileInfo, //仅做示例用，非真正的文件路径
						success: () => {
							// console.log("已缓存为：" + cacheFileInfo)
							this.src = cacheFileInfo;

						},
						fail: () => {
							uni.setStorageSync(storageKey, '');
							this.getImageCache();
						}
					});

					return;
				} else {

					// 如果没有，执行下载，并存储起来后
					if (!getApp().globalData.cacheImage) {
						getApp().globalData.cacheImage = {};
					}
					//

					let emitid = String(new Date().getTime());
					if (getApp().globalData.cacheImage[this.url]) {
						//其他地方正在下载
						emitid = getApp().globalData.cacheImage[this.url];
						uni.$once(String(getApp().globalData.cacheImage[this.url]), (url) => {
							this.src = url;
						})
					} else {
						//下载
						// console.log("未缓存,进行下载保存")

						getApp().globalData.cacheImage[this.url] = emitid;
						// console.log('getApp().globalData.cacheImage', JSON
						// 	.stringify(getApp().globalData.cacheImage));
						this.downloadTask = uni.downloadFile({
							url: this.url,
							success: (res) => {
								if (res.statusCode === 200) {
									// console.log('下载成功');
									// 再进行本地保存
									uni.saveFile({
										tempFilePath: res.tempFilePath,
										success: (res2) => {
											// console.log(res2.savedFilePath)
											uni.setStorageSync(storageKey, res2.savedFilePath)
											this.src = res2.savedFilePath;

											this.downloadTask = null;
											// console.log('getApp().globalData.cacheImage', JSON
											// 	.stringify(getApp().globalData.cacheImage));

											uni.$emit(emitid, res2.savedFilePath);

											delete getApp().globalData.cacheImage[this.url];
										},
										fail: (res2) => {
											delete getApp().globalData.cacheImage[this.url];
										}
									})
								} else {
									// console.log('下载临时文件失败')
									delete getApp().globalData.cacheImage[this.url];
								}
							},
							fail: (res) => {
								// console.log('下载失败', res)
								delete getApp().globalData.cacheImage[this.url];
								uni.$emit(emitid, this.url);
							}
						})

					}

				}


			}
		}
	}
</script>

<style>
	.qq-image {
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		line-height: 0rpx;
		font-size: 0rpx;
		width: 100%;
	}
</style>
