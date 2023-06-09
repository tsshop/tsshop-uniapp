<template>
	<view>
		<custom :style="show?'':'opacity: 0;'" background="rgba(0,0,0,0)" title=""></custom>

		<view
			style="top:0;position: fixed;width: 100vw;height: 100vh;display: flex;flex-flow: column nowrap;justify-content: center;align-items: center;">

			<view v-if="url" class="code-box flex flex-y flex-x-y">
				<view
					style="width: 120rpx;height: 120rpx;border-radius: 50%;border: 8rpx solid #FFFFFF;overflow: hidden;margin-top: -60rpx;">
					<qq-image :url="user_info.avatarUrl" imageStyle="width:100%;height:100%"></qq-image>
				</view>
				<view class="fs-28 color-black">{{user_info.name}}</view>
				<view class="fs-24 color-999999 pr" style="z-index: 3;">ID: {{user_info.id}}</view>
				<qq-image style="width: 440rpx;height: 440rpx;margin-bottom: 10rpx;margin-top: -20rpx;" :url="url">
				</qq-image>
			</view>

			<view v-if="url" class="flex flex-x-y" :style="show?'':'opacity: 0;'">
				<view @tap.stop="save" class="code-btn">
					<view class="iconfont icon-xiazai-wenjianxiazai-05"></view>
					<view>保存</view>
				</view>


				<view @tap.stop="shaoma" class="code-btn">
					<view class="iconfont icon-saoma"></view>
					<view>扫一扫</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				url: '',
			}
		},
		onLoad() {
			this.get_code();
		},
		methods: {
			get_code() {
				this.request({
					url: '/user/getMyQRCode',

				}).then(res => {

					if (res.status == 200) {

						this.url = res.data;
					}

				});
			},
			save() {
				// #ifdef APP-PLUS

				this.click(() => {
					this.show = false;

					setTimeout(() => {
						let pages = getCurrentPages();
						let page = pages[pages.length - 1];
						let ws = page.$getAppWebview();
						let bitmap = new plus.nativeObj.Bitmap('drawScreen');
						// 将webview内容绘制到Bitmap对象中  
						ws.draw(bitmap, () => {
							// 保存图片到本地  
							bitmap.save("_doc/drawScreen.jpg", {
								overwrite: true
							}, res => {
								console.log(res.target); // 图片地址  
								uni.saveImageToPhotosAlbum({
									filePath: res.target,
									success: () => {
										this.showToast('已保存到相册');
									}
								});


								bitmap.clear(); // 清除Bitmap对象  
							}, error => {
								console.log(JSON.stringify(error)); // 保存失败信息  
								bitmap.clear(); // 清除Bitmap对象  
							});
							this.show = true;
							// bitmap.clear(); // 清除Bitmap对象  
						}, error => {
							console.log(JSON.stringify(error)); // 绘制失败  
							this.show = true;
						}, {
							check: true, // 设置为检测白屏  
						});
					}, 200);
				});
				// #endif

				// #ifdef H5
				this.showToast('请截图哦，亲');
				// #endif

			},
			shaoma() {
				uni.scanCode({
					success: res => {
						let result = res.result || '';
						this.to_page_by_code(result);

					}
				})
			},
		}
	}
</script>

<style>
	page {
		background: #FFFFFF url(../../static/images/code.png) left top / 100% auto no-repeat;
	}

	.code-box {
		background-color: rgba(255, 255, 255, 0.9);
		width: 460rpx;
		border-radius: 20rpx;
	}

	.code-btn {
		margin-top: 34rpx;
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		background-color: #FFFFFF;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		color: #323232;
		font-size: 26rpx;
	}

	.code-btn+.code-btn {
		margin-left: 40rpx;
	}
</style>
