<template>
	<view style="width: 100%;">
		<swiper class="banner-box" :circular="true" :interval="3000" :autoplay="true">
			<swiper-item @change="banner_change" v-for="(item,index) in banner" :key="index" style="width: 100%;height: 100%;">
				<image @tap.stop="to_url(item)" style="width: 100%;height: 100%;" :src="item.imgUrl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "index-banber",
		data() {
			return {
				banner:[],
				banner_index:0
			};
		},
		mounted() {
			this.get_banner()
		},
		methods: {
			refresh(){
				this.get_banner()
			},
			get_banner() {
				this.request({
					url: "/banner",
				}).then(res => {
					if (res.status == 200) {
						this.banner = res.data || this.banner;
			
					}
				});
			},
			banner_change(index) {
			
				this.banner_index = index.detail.current;
			
			},
			//轮播跳转
			to_url(item) {
				if (!item.linkedUrl)
					return;
				if (item.linkedUrl.indexOf('/pages/') > -1) {
					this.toPage(item.linkedUrl);
					//app页面
				} else {
					if (String(item.linkedUrl).trim().length > 0) {
						this.toPage(`/pages/h5/h5?url=${item.linkedUrl}`);
					}
			
				}
			},
		}
	}
</script>

<style lang="scss">
	.banner-box {
		width: 100%;
		height: 274rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		overflow: hidden;
	}
</style>
