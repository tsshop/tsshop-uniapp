let CHAT = {}; //连接对象
let SCOKET = null; //websocket
// getApp().globalData.CHAT = CHAT;
import REQUEST from './request.js';
let LINE = {

};
let timer_line = null; //心跳定时

let ERROR_NUMBER = 0;

let NO_SEND_MSG = null; //未发出的消息

const AudioContext = uni.createInnerAudioContext();
// AudioContext.autoplay = true;
AudioContext.src = '/static/chat/notes.mp3';
// AudioContext.src = '/static/game/bgm.mp3';
AudioContext.onError((err) => {
	console.log('播放出错');
})
AudioContext.onPlay(() => {
	console.log('开始播放');
});

let siteinfo = require('../siteinfo');

// // #ifdef APP-PLUS
// let p = plus.audio.createPlayer("../static/images/dazi.mp3");
// // #endif
let md5key = new Date().getTime();
let isNoticeArr = store.state.chat_groups.filter(val => val.isNotice != 1).map(val => val.id);

let connect_status = true;

import {
	chat
} from '../siteinfo.js';
import store from '../store/index.js';


//初始化
let time = '';
CHAT.init = (type = "") => {
	let new_time = new Date().getTime();
	if (time && (new_time - time) < 1000) {

		return;
	}

	time = new_time;



	if (!uni.getStorageSync('ACCESS_TOKEN')) {
		//未登录 不连接
		return;
	}

	if (!connect_status) {
		return;
	}
	connect_status = false;

	if (SCOKET) {

		clearTimeout(timer_line);
		SCOKET.close();
	}

	if (SCOKET) {

		SCOKET.onMessage = () => {};
	}



	SCOKET = uni.connectSocket({
		url: siteinfo.scoket,
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		success: (res) => {
			// console.log('连接成功', res);
			connect_status = true;
		},
		fail: res => {
			console.log('连接失败xxxxxxxxxxxxxxxxxxx', res);
			ERROR_NUMBER = 1;
			clearTimeout(getApp().globalData.refer_time);
			setTimeout(() => {
				CHAT.REFRESH();
			}, 1000);
		},
		complete: () => {
			connect_status = true;
		}
	});

	SCOKET.onOpen(() => {
		ERROR_NUMBER = 0;
		clearTimeout(getApp().globalData.timer1);

		console.log('上线成功.......................');
		if (!getApp().globalData.history) {
			getApp().globalData.history = {};
		}
		//心跳
		clearInterval(timer_line);
		CHAT.SENDLINE();
		timer_line = setInterval(() => {
			CHAT.SENDLINE_2();
		}, 1000 * 5);


		SCOKET.onMessage(data => {
			CHAT.ONMESSAGE(data);
		});

		SCOKET.onClose((err) => {
			console.log('连接关闭xxxxxxxxxxxxxxxxxxxxxx', err);
			//重新连接
			if (ERROR_NUMBER != 1) {
				ERROR_NUMBER = 1;
				CHAT.REFRESH();
			}

		});

		//挂载对象
		getApp().globalData.CHAT = CHAT;


		///////
		if (type == '1') {
			//重新连接
			ERROR_NUMBER = 0;
			if (NO_SEND_MSG) {
				//消息未发送
				CHAT.SEND(JSON.parse(JSON.stringify(NO_SEND_MSG)));
				NO_SEND_MSG = null;
			}
		}


	});
	SCOKET.onError = (err) => {
		console.log('连接错误', err);
	}
};
CHAT.CLOSE = () => {
	if (SCOKET && SCOKET.close) {
		SCOKET.close();
		clearTimeout(timer_line);
	}
};
// 发送消息
CHAT.SEND = (obj, type = "") => {
	// console.log('SCOKET', SCOKET);
	if (!SCOKET || !SCOKET.send) {
		console.log('还不能发送消息');
		return;
	}

	let data = {
		cmd: obj.cmd,
		message: JSON.stringify(obj.message),
		token: uni.getStorageSync('ACCESS_TOKEN'),
	};
	if (obj.role) {
		data.role = obj.role;
	}
	if (obj.user) {
		data.user = obj.user;
	}


	SCOKET.send({
		data: JSON.stringify(data),
		success: () => {
			// console.log('发送成功', obj, type);
			// console.log('发送成功............' + obj.cmd + '...................');
		},
		fail: () => {
			console.log('发送失败xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
			clearInterval(timer_line);
			if (obj.cmd != 4) {
				//不是心跳 连接后重新发送
				NO_SEND_MSG = obj;
			}

			if (ERROR_NUMBER == 0) {
				// uni.showToast({
				// 	title: '重新连接中...',
				// 	icon: 'none',
				// })

				ERROR_NUMBER = 1;
				// CHAT.init(1);

				clearTimeout(getApp().globalData.timer1);
				CHAT.REFRESH();
			}

		}
	});
};

//心跳60s一次
CHAT.SENDLINE = () => {

	CHAT.SEND({
		cmd: 1,
		message: {
			id: store.state.user_info.id,
			username: store.state.user_info.name,
			name: store.state.user_info.name,
			status: 'online',
			sign: '',
			avatar: store.state.user_info.avatarUrl,
			avatarUrl: store.state.user_info.avatarUrl,
		}
	}, '首次');
};

CHAT.SENDLINE_2 = () => {
	CHAT.SEND({
		cmd: 4,
		message: {
			id: store.state.user_info.id,
			username: store.state.user_info.name,
			name: store.state.user_info.name,
			status: 'online',
			sign: '',
			avatarUrl: store.state.user_info.avatarUrl,
		}
	}, '心跳');
};

//接收到消息
CHAT.ONMESSAGE = (data) => {
	if (!data || !data.data) return;
	data = JSON.parse(data.data);
	console.log('ssssss收到消息ssssssssssssssssssssssssss');
	if (data.cmd == 7) {
		//新通知

		return;
	}
	if (data.cmd == 2) {
		//好友消息
		CHAT.ADD(data);
		return;
	}
	if (data.cmd == 5) {
		//群聊消息
		CHAT.ADD(data);
		return;
	}
	if (data.cmd == 101) {
		// 有新的好友申请
		CHAT.ADD_FRIEND();
		uni.$emit('refresh_new');
		return;
	}
	if (data.cmd == 102) {
		//被好友删除
		CHAT.USER_CHANG(data);
		CHAT.REFRESH_NOTES();
		return;
	}
	if (data.cmd == 103) {
		//好友通过
		CHAT.FRIEND_ADD();
		CHAT.REFRESH_NOTES();
		return;
	}
	if (data.cmd == 201) {
		//新申请
		uni.$emit('refresh_new');
		return;
	}
	if (data.cmd == 202) {
		//被移出群聊
		getApp().globalData.user_id = '';
		CHAT.DEL_GROUP(data);
		CHAT.REFRESH_NOTES();
		return;
	}
	if (data.cmd == 203) {
		//群聊增加
		CHAT.REFRESH_NOTES();
		CHAT.GROUP_ADD();
		return;
	}
	if (data.cmd == 301) {
		CHAT.REFRESH_NOTICE();
		return;
	}

	if (data.cmd == 401) {
		//核销优惠券成功
		uni.$emit('hexiao_success', data);
	}


	if (data.cmd == 501) {
		if (!uni.getStorageSync('ACCESS_TOKEN')) {
			//未登录 不连接
			return;
		}

		//#ifdef H5
		return;
		//#endif
		console.log('xxx501xxxx', data);
		//被邀请语音通话
		if (getApp().globalData.roomId) {
			console.log('33333333333333');
			return; //在房间里了，不接电话了
		}
		//#ifdef H5
		uni.navigateTo({
			url: `/pages/chat/audio?roomId=${data.roomId}&status=2&gid=${data.groupId}`,
		});
		//#endif

		//#ifdef APP-PLUS || APP-NVUE
		uni.navigateTo({
			url: `/pages/chat/audio?roomId=${data.roomId}&status=2&gid=${data.groupId}`,
			// animationType: 'slide-out-bottom',
			// animationDuration: 300,
		});
		//#endif



	}
	if (data.cmd == 502) {
		//进出房间
		console.log('xxx502xxxx', data);
		uni.$emit('refresh_audio_user_list', {
			roomId: data.roomId
		});
		return;
	}


	if (data.cmd == 503) {
		//禁言的
		console.log('xxx503xxxx', data);
		uni.$emit('refresh_audio_user_list', {
			roomId: data.roomId,
			refresh: 'more',
			tabooInfo: data.tabooInfo || {}
		});
		return;
	}

	if (data.cmd == 504) {
		//闭麦状态
		console.log('xxx504xxxx', data);
		uni.$emit('refresh_audio_user_list', {
			refresh: 'one',
			uid: data.userId,
			key: 'closed',
			status: data.status,
			roomId: data.roomId
		});
		return;
	}

	if (data.cmd == 701) {
		//单聊
		if (!uni.getStorageSync('ACCESS_TOKEN')) {
			//未登录 不连接
			return;
		}

		//#ifdef H5
		return;
		//#endif
		console.log('xxx702xxxx', data);
		//被邀请语音通话
		if (getApp().globalData.roomId) {
			return; //在房间里了，不接电话了
		}

		if (data.user) {
			getApp().globalData.roomId = data.roomId;
			getApp().globalData.audioOneUser = {
				avatarUrl: data.user.avatarUrl,
				id: data.user.id,
				name: data.name,
			};
			uni.navigateTo({
				url: `/pages/chat/audio-one?status=2&roomId=${data.roomId}`,
				// animationType: 'slide-out-bottom',
				// animationDuration: 300,
			});
		}



		return;
	}

	if (data.cmd == 702) {
		//结束单聊
		uni.$emit('audio_one_stop', data);
		return;
	}

	if (data.cmd == 703) {
		//单聊拒接
		uni.$emit('audio_one_stop', data);
		return;
	}

	if (data.cmd == 801) {
		//单聊
		if (!uni.getStorageSync('ACCESS_TOKEN')) {
			//未登录 不连接
			return;
		}

		//#ifdef H5
		return;
		//#endif
		console.log('xxx702xxxx', data);
		//被邀请语音通话
		if (getApp().globalData.roomId) {
			return; //在房间里了，不接电话了
		}

		if (data.user) {
			getApp().globalData.roomId = data.roomId;
			getApp().globalData.audioOneUser = {
				avatarUrl: data.user.avatarUrl,
				id: data.user.id,
				name: data.name,
			};
			uni.navigateTo({
				url: `/pages/chat/audio-vioce?status=2&roomId=${data.roomId}`,
				// animationType: 'slide-out-bottom',
				// animationDuration: 300,
			});
		}



		return;
	}

	if (data.cmd == 802) {
		//结束单聊
		uni.$emit('audio_voice_one_stop', data);
		return;
	}

	if (data.cmd == 803) {
		//单聊拒接
		uni.$emit('audio_voice_one_stop', data);
		return;
	}
	if (data.cmd == 14) {
		uni.$emit('refresh_page', data);
		return;
	}

	//客服
	if (data.cmd == 8) {
		CHAT.ADD_2(data);
		return;
	}

	if (data.cmd == 601) {
		//开始直播
		console.log('xxx601xxxx', data);
		uni.$emit('refresh_live', data);
		return;
	}

	if (data.cmd == 602) {
		//结束直播

		console.log('xxx602xxxx', data);
		uni.$emit('refresh_live', data);
		uni.$emit('stop_live', data);

		return;
	}

	if (data.cmd == 603) {
		//赠送礼物
		uni.$emit('send_live_gift', data);
		// console.log('xxx603xxxx', data);
		return;
	}

	if (data.cmd == 604) {
		//观众进房/退房 人数变更
		// uni.$emit('')
		uni.$emit('live_user_change', data);
		uni.$emit('live_room_user_change', data);
		console.log('xxx604xxxx', data);
		return;
	}

	//弹幕
	if (data.cmd == 605) {
		uni.$emit('live_user_message', data);
		// console.log('xxx605xxxx', data);
		return;
	}

	//讲解商品
	if (data.cmd == 606) {

		uni.$emit('takeGoodsLiveHandel', data);
		// console.log('xxx606xxxx', data);
		return;
	}

	//喜欢
	if (data.cmd == 607) {
		uni.$emit('live_like_change', data);
		// console.log('xxx607xxxx', data);
		return;
	}

	//连麦状态改变
	if (data.cmd == 608) {
		uni.$emit('requestLinkChange',data);
		console.log('xxx608xxxx', data);
		return;
	}

	//连麦申请
	if (data.cmd == 609) {
		uni.$emit('requestLink',data);
		console.log('xxx609xxxx', data);
		return;
	}

	//撤回消息
	if (data.cmd == 11) {
		CHAT.WITHDRAW(data);
		return;
	}

	//群主删除消息
	if (data.cmd == 13) {
		CHAT.DELETEMSG(data);
		return;
	}

	//已读消息
	if (data.cmd == 10) {
		CHAT.READUSER(data);
		return;
	}

	//敏感词汇
	if (data.cmd == 12) {
		CHAT.TOAST(data.content);
	}

};

//掉线重连
CHAT.REFRESH = () => {
	if (getApp().globalData.ssssss == true) return;
	clearTimeout(getApp().globalData.refer_time);
	getApp().globalData.refre_time = setTimeout(() => {
		console.log('正在重新连接........' + ERROR_NUMBER + '.............');

		CHAT.init('1');
		// let time = ERROR_NUMBER * * 1000 + 2;
		// if (time >= 10000) {
		// 	time = 6000;
		// }
		let time = 5000;
		if (ERROR_NUMBER == 1) {
			clearTimeout(getApp().globalData.timer1);
			getApp().globalData.timer1 = setTimeout(() => {
				if (ERROR_NUMBER == 1) {
					CHAT.init('1');
					CHAT.REFRESH();
				} else {
					ERROR_NUMBER = 0;
				}

			}, time);
		}
	}, 300);
};

//处理好友消息
CHAT.ADD = (message) => {
	let id = message.mine ? message.toid : message.id;
	if (String(message.id).length > 8) {
		id = message.id;
	}

	CHAT.READ(id);




	if (!getApp().globalData.history[id]) {
		getApp().globalData.history[id] = uni.getStorageSync(`chat_${store.state.user_info.id}_${id}`) || []
	}

	if (getApp().globalData.history[id].length > 0) {
		let val = getApp().globalData.history[id][getApp().globalData.history[id].length - 1];
		if (val.timestamp && message.timestamp && (message.timestamp - val.timestamp) > 600000) {
			getApp().globalData.history[id].push({
				type: 'TIME',
				content: CHAT.DATEFORMAT('HH:MM', new Date(message.timestamp)),
				timestamp: message.timestamp + 'a' + parseInt(Math.random() * 1000),
				md5key: md5key++ + 'b',
			});
		}

	}
	message.md5key = md5key++ + 'b';
	getApp().globalData.history[id].push(message);

	CHAT.VUEXSET('chat_user_list', getApp().globalData.history[id]);
	let arr_length = getApp().globalData.history[id].length;
	if (arr_length > 30) {
		uni.setStorageSync(`chat_${store.state.user_info.id}_${id}`, getApp().globalData.history[id].slice(
			arr_length - 30));
	} else {
		uni.setStorageSync(`chat_${store.state.user_info.id}_${id}`, getApp().globalData.history[id]);
	}


	if (false && message.type == 'IMAGE' || message.type == 'EMOJI') {
		clearTimeout(getApp().globalData.timer_page);
		getApp().globalData.timer_page = setTimeout(() => {
			setTimeout(() => {
				uni.$emit('to_last');
			})
		}, 300);
	} else {
		uni.$emit('to_last');
	}


	//消息列表
	{
		let jieshou = (getApp().globalData.user_id == id) ? true : false; //已在聊天窗口
		let mine = (message.id == store.state.user_info.id || message.fromid == store.state.user_info.id) ? true :
			false;
		let last_num = 0;
		let topId = 0;
		let notes = store.state.chat_notes.filter(val => {
			if (val.uid == id) {
				last_num = val.readNum || 0;
				topId = val.topId;
			}
			return val.uid != id;
		});
		let content = '一条新内容';
		if (message.type == 'TEXT') {
			content = message.content;
		}
		if (message.type == 'IMAGE') {
			content = '[图片]';
		}
		if (message.type == 'EMOJI') {
			content = '[表情]';
		}
		if (message.type == 'SHELL') {
			content = '[红包]';
		}
		if (message.type == 'NOTICE') {
			content = '[公告]';
		}
		if (message.type == 'SOLITAIRE') {
			content = '[接龙]';
		}
		if (message.type == 'CALL') {
			content = '[语音通话]';
		}
		if (message.type == 'VOICE') {
			content = '[语音消息]';
		}
		if (message.type == 'VIDEO_CALL') {
			content = '[视频通话]';
		}
		if (message.type == 'CARD') {
			content = '[名片]';
		}
		if (message.type == 'ADDRESS') {
			content = '[位置]';
		}


		let obj = {
			avatarUrl: message.groupAvatarUrl ? message.groupAvatarUrl : (!mine ? message.avatarUrl :
				message.toAvatarUrl),
			name: message.groupName ? message.groupName : (!mine ? message.name : message.toName),
			// readFlag: (mine || jieshou) ? true : false,
			uid: id,
			content: content,
			sendTime: message.timestamp,
			chatType: message.cmd == 2 ? 'friend' : 'group',
			readNum: (mine || id == getApp().globalData.user_id) ? 0 : (Number(last_num) + 1),
			hui: message.cmd == 5 && isNoticeArr.includes(id),
			notes: true,
			topId,
		};

		notes.unshift(obj);
		CHAT.VUEXSET('chat_notes', notes, true);

		// #ifdef APP-PLUS
		// if (!mine && getApp().globalData.APPHIDE && !jieshou) {
		if (!mine && !message.groupName && !jieshou) {
			plus.push.createMessage(obj.content, obj, {
				// cover: true,
				delay: 0,
				icon: obj.avatarUrl,
				sound: 'system',
				title: obj.name,
				subtitle: content,
			});
		}
		// #endif

		//播放音频
		// if (!mine && AudioContext.play && !message.groupName && !jieshou) {

		// 	AudioContext.play();
		// }
		//播放音频
		// // #ifdef APP-PLUS
		// p.play();
		// // #endif
	}


};

//处理啊客服消息
CHAT.ADD_2 = (message) => {
	message = message.msg;
	// console.log('message',message);
	let mine = message.isFromUser;
	message.mine = mine;
	message.content = String(message.content).trim();
	if (message.messageType !== undefined && message.messageType) {
		message.type = message.messageType;

	}

	// console.log('message', message);




	if (store.state.server_list.length > 0) {
		let val = store.state.server_list[store.state.server_list.length - 1];
		if (val.timestamp && message.timestamp && (message.timestamp - val.timestamp) > 600000) {
			store.state.server_list.push({
				type: 'TIME',
				content: CHAT.DATEFORMAT('HH:MM', new Date(message.timestamp))
			});
		}

	}
	store.state.server_list.push(message);

	CHAT.VUEXSET('server_list', store.state.server_list, false);

	// console.log('store.state.server_list',store.state.server_list);
	if (message.type == 'TEXT') {
		uni.$emit('to_last');
	} else {
		clearTimeout(getApp().globalData.timer_page);
		getApp().globalData.timer_page = setTimeout(() => {
			setTimeout(() => {
				uni.$emit('to_last');
			})
		}, 200);
	}


	//消息列表
	{



		//播放音频
		if (!mine && AudioContext.play) {
			// console.log('AudioContext', AudioContext);
			AudioContext.play();
		}

	}


};
CHAT.ADD_FRIEND = (data) => {
	store.commit('vuexSet', {
		name: 'chat_new_friend',
		value: true,
	});
};
//被移出群聊
CHAT.DEL_GROUP = (data) => {

	uni.$emit('group_del', data.id);

	let groups = store.state.chat_groups.filter(val => val.id != data.id);
	let notes = store.state.chat_notes.filter(val => val.uid != data.id);
	CHAT.VUEXSET('chat_notes', notes, true);
	CHAT.VUEXSET('chat_groups', groups, true);
};
//被好友删除了
CHAT.USER_CHANG = (data) => {
	uni.$emit('user_chang', data.id);
	let friends = store.state.chat_friends.filter(val => val.id != data.id);
	let notes = store.state.chat_notes.filter(val => val.uid != data.id);
	CHAT.VUEXSET('chat_notes', notes, true);
	CHAT.VUEXSET('chat_friends', friends, true);
}
//新增好友
CHAT.FRIEND_ADD = () => {
	store.dispatch('refresh_friend');
};
//新增群聊
CHAT.GROUP_ADD = () => {
	store.dispatch('refresh_group');
};
//刷新回话列表
CHAT.REFRESH_NOTES = () => {
	uni.$emit('refresh_notes');
};
//会计方法
CHAT.VUEXSET = (key, data, state = false) => {
	console.log('......chagne store chat......');
	// console.log(key, data, state);
	// console.log('......chagne store chat......');
	store.commit('vuexSet', {
		name: key,
		value: data
	});
	if (state) {
		uni.setStorageSync(key, data);
	}
}
//刷新公告
CHAT.REFRESH_NOTICE = () => {
	uni.$emit('refresh_notice');
};

//刷新免打扰列表
CHAT.REFRESH_IS_NOTICE = () => {
	isNoticeArr = store.state.chat_groups.filter(val => val.isNotice != 1).map(val => val.id);
};

CHAT.DATEFORMAT = (fmt, date) => {
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

// 阅读消息
CHAT.READ = (id) => {
	if (id != getApp().globalData.user_id) return;
	clearTimeout(getApp().globalData.readtimer);
	getApp().globalData.readtimer = setTimeout(() => {
		REQUEST({
			url: '/friend/read',
			chat: true,
			data: {
				id,
				type: String(id).length > 8 ? 'group' : 'friend',
			},
			toast: false,
			login: false,
		})
	}, 2000);
}

//撤回
CHAT.WITHDRAW = (data) => {

	store.state.chat_user_list.forEach(val => {
		if (val.msgId == data.msgId) {
			val.type = 'WITHDRAW';
		}
	});

	CHAT.VUEXSET('chat_user_list', store.state.chat_user_list);

}

//群主删除消息
CHAT.DELETEMSG = (data) => {

	let arr = store.state.chat_user_list.filter(val => {
		return val.msgId != data.msgId;
	});

	CHAT.VUEXSET('chat_user_list', arr);

}

//已读回执
CHAT.READUSER = (data) => {
	if (store.state.app_chat_type != 'one') {
		return;
	}
	clearTimeout(CHAT.readtimeruser);
	CHAT.readtimeruser = setTimeout(() => {
		store.state.chat_user_list.forEach(val => {
			val.readFlag = true;
		});
		CHAT.VUEXSET('chat_user_list', JSON.parse(JSON.stringify(store.state.chat_user_list)));
	}, 500);


}

CHAT.TOAST = (title = "", duration = 2000, icon = "none") => {
	// #ifdef APP-PLUS
	plus.nativeUI.toast(title, {
		duration: 'long'
	});
	// #endif

	// #ifndef APP-PLUS
	uni.showToast({
		title,
		icon,
		duration
	})
	// #endif

};







module.exports = CHAT;