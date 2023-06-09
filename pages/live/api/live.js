import request from '@/utils/request.js';

//获取直播间详情
export function getLiveDetail(id) {
	return request({
		url: '/live/liveView',
		data: {
			id,
		}
	});
}

//点赞
export function toLivePraise(liveId, number) {
	return request({
		url: '/live/praise',
		data: {
			liveId,
			number
		}
	});
}

//在线用户
export function getRoomUser(roomId) {
	return request({
		url: '/live/iveOnlineUser',
		data: {
			roomId
		}
	});
}

//连麦列表
export function getLinkList(liveId) {
	return request({
		url: '/live/linkList',
		data: {
			liveId
		}
	});
}

//我的礼物
export function getLiveGiftList() {
	return request({
		url: '/liveGift/userGift',
		method: 'POST',
		data: {
			pageNumber: 1,
			pageSize: 100,
		}
	});
}

//赠送礼物
export function brushGifts(giftId, liveId, number) {
	return request({
		url: '/live/brushGifts',
		method: 'POST',
		data: {
			giftId,
			liveId,
			number,
		}
	});
}

//讲解商品
export function explainGoods(liveGoodsId, roomId) {
	return request({
		url: '/live/explainGoods',
		data: {
			liveGoodsId,
			roomId
		}
	});
}

//申请连麦
export function createLink(data) {
	return request({
		url: '/live/createLink',
		method: 'POST',
		data,
	});
}

//连麦
export function openLink(id, status, liveId) {
	return request({
		url: '/live/link',
		method: 'POST',
		data: {
			id,
			status,
			liveId,
		},
	});
}