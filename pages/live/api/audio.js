let request = require('../../../utils/request');

let requestApi = {

};

//获取房间信息
requestApi.getRoomInfo = (data, loading = true) => {
	return request({
		url: '/groupCall/roomInfo',
		data,
		voice: true,
		loading,
	});
}

//开麦 闭麦
requestApi.setMaike = (data) => {
	return request({
		url: '/groupCall/closed',
		data,
		voice: true,
		method: 'POST',
	});
}

//禁言
requestApi.setUserSong = (data) => {
	return request({
		url: '/groupCall/taboo',
		data,
		voice: true,
		method: 'POST',
	});
}
//获取有没有直播中
requestApi.getGroupLive = (data) => {
	return request({
		url: '/live/groupLive',
		data,
		voice: true,
		loading: true,
	});
}
//创建直播
requestApi.createLive = (data) => {
	return request({
		url: '/live/createLive',
		method: 'POST',
		data,
		loading: true,
		voice: true,
	});
}


module.exports = requestApi;
