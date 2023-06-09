let {xs} = require('./util');
let testing = {
	//血压检测
	bloodPressure: (arr) => {

		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let bpSp = val.bpDp;
			let bpDp = val.bpSp;
			if (bpDp >= 180 || bpSp >= 110) {
				remark = '重度偏高';
				color = '#E6302E';
			} else if ((bpDp >= 160 && bpDp <= 179) || (bpSp >= 100 && bpSp <= 109)) {
				remark = '中度偏高';
				color = '#E2504D';
			} else if ((bpDp >= 140 && bpDp <= 159) || (bpSp >= 90 && bpSp <= 99)) {
				remark = '轻度偏高';
				color = '#E88989';
			} else if (bpDp < 90 || bpSp < 60) {
				remark = '偏低';
				color = '#E3CA51';
			} else if ((bpDp >= 110 && bpDp <= 139) || (bpSp >= 80 && bpSp <= 89)) {
				remark = '正常高值';
				color = '#54E35A';
			} else if ((bpDp >= 90 && bpDp <= 110) || (bpSp >= 60 && bpSp <= 80)) {
				remark = '正常';
				color = '#54E35A';
			}
			val.data = [bpDp, bpSp];
			val.dataType = 'two';
			val.btnText = remark;
			val.btnColor = color;

		});
		//收缩 舒张

		return arr;
	},
	//心率 心电
	heartRate: (arr, age = 40) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let data = val.measureData;
			if (age <= 60) {
				if (data < 60) {
					remark = '偏慢';
					color = '#E6CA52';
				} else if (data >= 60 && data <= 100) {
					remark = '正常';
					color = '#54E35A';
				} else {
					remark = '偏快';
					color = '#E25353';
				}
			}
			if (age > 60) {
				if (data < 50) {
					remark = '偏慢';
					color = '#E6CA52';
				} else if (data >= 50 && data <= 80) {
					remark = '正常';
					color = '#54E35A';
				} else {
					remark = '偏快';
					color = '#E25353';
				}
			}
			val.data = data;
			val.btnText = remark;
			val.btnColor = color;

		});
		//收缩 舒张

		return arr;
	},
	//血糖
	bloodSugar: (arr) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let data = val.measureData;

			if (val.physicalstate == '0') {
				//空腹
				if (data < 3.9) {
					remark = '偏低';
					color = '#E4C852';
				} else if (data >= 3.9 && data <= 6.1) {
					remark = '正常';
					color = '#54E35A';
				} else if (data >= 6.1 && data < 7.0) {
					remark = '偏高';
					color = '#E45252';
				} else {
					remark = '超标';
					color = '#E72F2F';
				}
			}
			if (val.physicalstate == '1') {
				//餐后
				if (data < 7.8) {
					remark = '正常';
					color = '#54E35A';
				} else if (data >= 7.8 && data < 11.1) {
					remark = '偏高';
					color = '#E45252';
				} else {
					remark = '超标';
					color = '#E72F2F';
				}
			}
			val.data = data;
			val.btnText = remark;
			val.btnColor = color;

		});
		return arr;
	},
	//血氧
	heartRate_2: (arr) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let data = val.measureData;
			
			val.data = Number(xs(data,3)*100);
			data = val.data;
			if (data > 94 && data < 99) {
				remark = '正常';
				color = '#52E459';
			} else if (data >= 90 && data <= 94) {
				remark = '不足';
				color = '#E4C852';
			} else if (data >= 80 && data < 94) {
				remark = '偏低';
				color = '#E4C337';
			} else if (data < 80) {
				remark = '过低';
				color = '#E7BF17';
			}
			// val.data = Number(xs(data,3)*100);
			val.btnText = remark;
			val.btnColor = color;

		});
		return arr;
	},
	//尿酸
	uricAcid: (arr, age, sex) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let data = val.measureData;
			let numbers = [150, 333];
			if (age > 12) {
				if (sex == 1) {
					//男
					numbers = [200, 420];
				} else {
					//非男
					numbers = [140, 360];
				}
			}
			let [min, max] = numbers;
			if (data > max) {
				remark = '偏高';
				color = '#E45252';
			} else if (data >= min && data <= max) {
				remark = '正常';
				color = '#52E459';
			} else if (data < min) {
				remark = '偏低';
				color = '#E4C852';
			}
			val.data = data;
			val.btnText = remark;
			val.btnColor = color;

		});
		return arr;
	},
	//胆固醇
	cholesterol: (arr) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let data = val.measureData;

			if (data < 5.17) {
				remark = '正常';
				color = '#54E35A';
			} else {
				remark = '偏高';
				color = '#E45252';
			}
			val.data = data;
			val.btnText = remark;
			val.btnColor = color;

		});
		return arr;
	},
	//体温
	temperature: (arr) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let data = val.measureData;

			if (data < 36.3) {
				remark = '体温偏低';
				color = '#E4C852';
			} else if (data >= 36.3 && data <= 37.2) {
				remark = '正常';
				color = '#52E459';
			} else if (data >= 37.3 && data <= 38.0) {
				remark = '轻度发烧';
				color = '#E78888';
			} else if (data >= 38.1 && data <= 39.0) {
				remark = '中度发烧';
				color = '#EB6F6F';
			} else if (data >= 39.1 && data <= 41.0) {
				remark = '高热';
				color = '#E45252';
			} else {
				remark = '超高热';
				color = '#E72F2F';
			}
			val.data = data;
			val.btnText = remark;
			val.btnColor = color;

		});
		return arr;
	},
	//体脂体重
	weight: (arr) => {
		arr.forEach(val => {
			val = filterTime(val);
			let remark = '正常';
			let color = '#54E35A';
			let bfFatFate = val.bfFatFate;
			let bfWeight = val.bfWeight;
			console.log('bbbbbbbbbb', bfFatFate)
			if (bfFatFate < 18.5) {
				console.log('ssssssssssss')
				remark = '偏瘦';
				color = '#E4C852';
			} else if (bfFatFate >= 18.5 && bfFatFate <= 23.9) {
				remark = '正常';
				color = '#52E459';
			} else if (bfFatFate == 24) {
				remark = '超重';
				color = '#E78888';
			} else if (bfFatFate > 24 && bfFatFate <= 26.9) {
				remark = '偏胖';
				color = '#EB6F6F';
			} else if (bfFatFate >= 27 && bfFatFate <= 29.9) {
				remark = '肥胖';
				color = '#E45252';
			} else {
				remark = '重度肥胖';
				color = '#E72F2F';
			}
			val.data = [bfFatFate, bfWeight];
			val.dataType = 'two';
			val.btnText = remark;
			val.btnColor = color;

		});
		//收缩 舒张

		return arr;
	}


};

function filterTime(val) {
	if (val.meatime) {
		let time = new Date(val.meatime);
		val.timeStr1 = dateFormat('YYYY/mm/dd', time);
		val.timeStr2 = dateFormat('HH:MM', time);
	} else {
		val.timeStr1 = '';
		val.timeStr2 = '';
	}
	return val;
}


function dateFormat(fmt, date) {
	let ret;
	let opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
				"0")))
		};
	};
	return fmt;
}






module.exports = testing;
