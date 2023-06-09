export function requestPermision(permision, fn, toast = true){
	if (uni.getSystemInfoSync().platform === 'ios') {
		let photol = permision.judgeIosPermission(permision[1])
		if (photol == false) {
			if (!toast) return;
			uni.showModal({
				title: '提示',
				content: '您已经关闭相关权限,去设置',
				success: (res) => {
					if (res.confirm) {
						plus.runtime.openURL("app-settings:");
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		} else {
			fn && fn();
		}
	} else if (uni.getSystemInfoSync().platform === 'android') {
		// let photol = permision.requestAndroidPermission(permision[0]);

		plus.android.requestPermissions([permision[0]], (resultObj) => {
			var result = 0;
			for (var i = 0; i < resultObj.granted.length; i++) {
				var grantedPermission = resultObj.granted[i];
				console.log('已获取的权限：' + grantedPermission);
				result = 1
			}
			if (result == 1) {
				fn && fn();
			} else {
				if (!toast) return;
				uni.showModal({
					title: '提示',
					content: '您已经关闭相关权限,去设置',
					success: (res) => {
						if (res.confirm) {
							plus.runtime.openURL("app-settings:");
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		});


		// if (photol == false) {
		// 	if (!toast) return;
		// 	uni.showModal({
		// 		title: '提示',
		// 		content: '您已经关闭相关权限,去设置',
		// 		success: (res) => {
		// 			if (res.confirm) {
		// 				plus.runtime.openURL("app-settings:");
		// 			} else if (res.cancel) {
		// 				console.log('用户点击取消');
		// 			}
		// 		}
		// 	});
		// } else {
		// 	fn && fn();
		// }
	}
}