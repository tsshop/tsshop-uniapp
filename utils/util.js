let info = require('../siteinfo');

const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(
		':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

const onBridgeReady = pay => {
	console.log("4", pay);
	wx.requestPayment({
		timeStamp: String(pay.timeStamp),
		//时间戳，自1970年以来的秒数
		nonceStr: pay.nonceStr,
		//随机串
		package: pay.package,
		signType: pay.signType,
		//微信签名方式：
		paySign: pay.paySign,

		//微信签名
		success(res) {
			// 成功后的回调函数
			console.log("456", res);
			uni.showToast({
				title: '您已支付成功！',
				icon: 'success',
				duration: 2000,
				success: () => {
					getApp().post(getApp().api.wxNotify, {
						code: 0,
						orderId: pay.orderId
					}).then(res => {
						console.log(res, 1111111111111);
						wx.redirectTo({
							url: '/pagesA/orderAll/orderAll'
						});
					})

				}
			})

		},

		fail(res) {
			console.log("123", res);
			wx.showToast({
				title: '您已取消支付',
				icon: "none",
				duration: 2000
			});
			getApp().post(getApp().api.wxNotify, {
				code: 1,
				orderId: pay.orderId
			}).then(res => {
				console.log(res, 1111111111111);
				wx.reLaunch({
					url: '/pagesA/orderAll/orderAll'
				});
			})

		}

	});
};



const Base64 = {
	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" // public method for encoding
		,
	encode: function(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = Base64._utf8_encode(input);

			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = (chr1 & 3) << 4 | chr2 >> 4;
				enc3 = (chr2 & 15) << 2 | chr3 >> 6;
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(
					enc3) + this._keyStr.charAt(enc4);
			} // Whend 


			return output;
		} // End Function encode 
		// public method for decoding
		,
	decode: function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));
				chr1 = enc1 << 2 | enc2 >> 4;
				chr2 = (enc2 & 15) << 4 | enc3 >> 2;
				chr3 = (enc3 & 3) << 6 | enc4;
				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}

				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			} // Whend 


			output = Base64._utf8_decode(output);
			return output;
		} // End Function decode 
		// private method for UTF-8 encoding
		,
	_utf8_encode: function(string) {
			var utftext = "";
			string = string.replace(/\r\n/g, "\n");

			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if (c > 127 && c < 2048) {
					utftext += String.fromCharCode(c >> 6 | 192);
					utftext += String.fromCharCode(c & 63 | 128);
				} else {
					utftext += String.fromCharCode(c >> 12 | 224);
					utftext += String.fromCharCode(c >> 6 & 63 | 128);
					utftext += String.fromCharCode(c & 63 | 128);
				}
			} // Next n 


			return utftext;
		} // End Function _utf8_encode 
		// private method for UTF-8 decoding
		,
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c, c1, c2, c3;
		c = c1 = c2 = 0;

		while (i < utftext.length) {
			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if (c > 191 && c < 224) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode((c & 31) << 6 | c2 & 63);
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
				i += 3;
			}
		} // Whend 


		return string;
	}, // End Function _utf8_decode 



}; // console.log(Base64.encode("卢霄霄"))
// console.log(Base64.decode(Base64.encode("卢霄霄")))

// 格式化日期
const timestampToTime = date => {
	let Y = date.getFullYear() + '-';
	let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	let D = date.getDate() + '' < 10 ? '0' + date.getDate() : date.getDate();
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();
	return Y + M + D
}

const download = (url, str = '', str2 = '') => {
	uni.showLoading({
		title: str || '请稍后...',
		mask: true,
	});
	uni.downloadFile({
		url: url,
		success: res => {
			uni.saveImageToPhotosAlbum({
				filePath: res.tempFilePath,
				complete: r => {
					uni.hideLoading();
					uni.showToast({
						title: str2 || '已保存至相册',
						icon: 'none'
					});
				},
			});
		},

		fail: res => {
			console.log('res', res);
			uni.hideLoading();

			uni.showToast({
				title: '下载失败',
				icon: 'none'
			});
		},

	});
};

//上传单张图片 返回图片路径
let upload_one = (fn, crop = {
	quality: 100,
	width: 200,
	height: 200,
	resize: false
}, compress = true, width = 200) => {

	uni.chooseImage({
		count: 1,
		crop: crop,
		success: res => {

			let {
				tempFilePaths = []
			} = res;
			console.log('res', res);
			tempFilePaths.forEach(val => {

				// #ifdef APP-PLUS || MP-WEIXIN
				if (compress) {
					uni.compressImage({
						src: val,
						width: width,
						success: img => {
							upload_image(img.tempFilePath, fn);
							console.log('img.tempFilePath', img.tempFilePath);
						},
						fail: err => {
							console.log('err', err);
						}
					});
				} else {
					upload_image(val, fn);
				}
				// #endif

				// #ifdef H5
				upload_image(val, fn);
				// #endif

			})


		}
	})
}
let upload_image = (url, fn) => {
	uni.showLoading({
		title: '上传图片中',
		mask: true,
	})
	let appUrl = '/file/uploadFile';

	appUrl = info.root + appUrl;


	uni.uploadFile({
		url: appUrl,
		filePath: url,
		data: {
			photo: 'file',
			name: 'file'
		},
		name: 'file',
		header: {
			token: uni.getStorageSync('ACCESS_TOKEN'),
		},
		success: img_data => {
			uni.hideLoading();
			let data = JSON.parse(img_data.data);
			if (img_data.statusCode == 200 && img_data.errMsg == 'uploadFile:ok') {


				if (data.status == 200 && data.data) {
					if (fn) {
						fn(data.data);
					}
				}

			} else {

			}
		}
	})

}


const getImageCache = function(filePath, fileMd5 = '') {
	// 图片缓存key值
	let storageKey = 'IMAGE_CACHE_INFO_' + filePath
	// 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
	const cacheFileInfo = uni.getStorageSync(storageKey)
	if (cacheFileInfo) {
		console.log("已缓存为：" + cacheFileInfo)
		return cacheFileInfo
	} else {
		console.log("未缓存,进行下载保存")
		// 如果没有，执行下载，并存储起来后
		uni.downloadFile({
			url: filePath,
			success: (res) => {
				if (res.statusCode === 200) {
					console.log('下载成功');
					// 再进行本地保存
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: function(res2) {
							console.log(res2.savedFilePath)
							uni.setStorageSync(storageKey, res2.savedFilePath)
							return res2.savedFilePath
						},
						fail: function(res2) {
							return filePath
						}
					})
				} else {
					console.log('下载临时文件失败')
					return filePath
				}
			},
			fail: (res) => {
				console.log(res)
				return filePath
			}
		})
	}
}
let xs = (value, lang, type = 3) => {
	let a = parseFloat(value).toString();

	if (a == '0' || a == 'NaN') a = '0.00000000000';
	if (a.indexOf('.') == -1) a += '.';
	let index = a.indexOf('.');
	a += '00000000000';
	if (type == 3) {
		return a.substr(0, index + 1 + lang);
	} else if (type == 0) {
		return a.substr(0, index + 1 + lang).split('.')[0];
	} else {
		return a.substr(0, index + 1 + lang).split('.')[1];
	}
}



module.exports = {
	formatTime: formatTime,
	onBridgeReady: onBridgeReady,
	Base64,
	timestampToTime,
	download,
	upload_one,
	getImageCache,
	xs
};
