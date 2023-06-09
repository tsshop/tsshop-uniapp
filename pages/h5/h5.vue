<template>
	<view>
		<web-view class="webview" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(options) {
			// console.log(options);
			
			if (options.url) {
				uni.setNavigationBarTitle({
					title: options.title
				})
			} 
			let objectToUrlParams = (obj, urlencode) => {
					let str = "";
					for (let key in obj) {
						str += "&" + key + "=" + (urlencode ? encodeURIComponent(obj[key]) : obj[key]);
					}
					return str.substr(1);
				}
			let url = options.url + '?';
			let all = JSON.parse(JSON.stringify(options));
			delete(all.url);
			url = url + objectToUrlParams(all)
			console.log(url)
			this.url = url;

		},
		methods: {

		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
