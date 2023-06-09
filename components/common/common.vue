<template>
	<view class="common">
		<!-- 登陆开始 -->
		<!-- <login :route="route"></login> -->
		<!-- 登陆结束 -->
		<!-- 检测粘贴板开始 -->
		<!-- <link1></link1> -->
		<!-- 检测粘贴板结束 -->

		<!-- 进入店铺提示开始 -->
		<!-- <shop></shop> -->
		<!-- 进入店铺提示结束 -->
		<!-- 非会员添加店主 -->
		<!-- <addMch></addMch> -->
		<!-- 非会员添加店主 -->
		<!-- 鉴品师身份发生改变 -->
		<!-- <join></join> -->
		<!-- <group></group> -->
		<!-- #ifdef APP-PLUS -->

		<update></update>
		<!-- #endif -->

	</view>
</template>

<script>
	// import login from './login.vue'
	// import join from './join.vue'
	// import group from './group.vue'
	// import link1 from './link.vue'
	// import shop from './shop.vue'
	// import addMch from '@/components/index/addMch.vue'
	import update from '../app-update/app-update.vue'
	export default {
		name: 'common',
		data() {
			return {

			}
		},
		components: {
			// login,
			// join,
			// group
			update
		},
		props: {
			route: '',
		}
	}
</script>

<style>

</style>