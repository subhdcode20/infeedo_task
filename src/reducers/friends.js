import {getLSItem, setLSItem} from '../utility'

export default function ng(state = [], action) {

	const tempState = { ...state };
	let friends;
	let newFriendRequests;
	let me;
	let lastChats = {};
	let botChats = {};
	let unreadChatCounts = {};

	switch(action.type) {
		case 'LOADER_FRNDS':
			return { ...tempState, isLoading: true }
			break;
		case 'FRIENDS_LIST':
		console.log('FRIENDS_LIST= ', action.payload);
			let isError = true;
			let isLoading = false;
			// let newFriends = [];
			let invalidAccess = false
			// console.log('!"err" in action.payload ', !"err" in action.payload, action.payload.err);
			if(
				action.payload &&
				action.payload.status &&
				action.payload.data &&
				action.payload.status >= 200 && action.payload.status < 300 &&
				!action.payload.err
			) {
				console.log('FRIENDS_LIST data ok: ');
				isError = false;
				friends = action.payload.data.friends;
				me = action.payload.data.me;
				console.log("me in friends ", friends, me);
				// if(me.channelId) setLSItem(`${LS_URL_CHANNELID}`, me.channelId)
				if(me.channelId) setLSItem(`${LS_CHANNELID}`, me.channelId)

				const goMemories = action.payload.data.goMemories;
				const goChats = action.payload.data.goChats;
				const notifyAgain = action.payload.data.notifyAgain;
				const genericKeys = action.payload.data.keys || [];
				try {
					if (notifyAgain && notifyAgain === 'plzRestoreNotification') {
						localStorage.removeItem(`${LS_APP_PWA_NOTIFICATION}`);
						window.location.reload();
					}
					if (goMemories && goMemories === 'letTheMemoriesGo') {
						localStorage.clear();
						window.location.reload();
					}
					if (genericKeys && genericKeys.length !== 0) {
						genericKeys.forEach(x => localStorage.removeItem(x));
						window.location.reload();
					}
					if (goChats && goChats === 'letTheChatsGo') {
						for (let i in localStorage) {
							if (localStorage.hasOwnProperty(i)) {
								if (i.indexOf('NG_APP_SD_CHAT_') > -1) localStorage.removeItem(i);
							}
						}
						window.location.reload();
					}

				}catch(e){}

				// newFriends = friends

				// let friendsCache = getLSItem(`${LS_APP_PWA_FRIENDSLIST}`)
				// console.log("friendsCache= ", friendsCache, friends);
				// if(friendsCache != null && friendsCache != undefined && friendsCache != []
				// 	&& friends != undefined && friends != null && friends.length > 0) {
				// 	// friendsCache = JSON.parse(friendsCache)
				// 	console.log("friendsCache ok ");
				// 	newFriends = friends.map(friend => {
				// 		console.log("friend= ", friend);
				// 		let foundInCache = false
				// 		friendsCache.friends.forEach(item => {
				// 			if(friend.meetingId == item.meetingId) {
				// 				foundInCache = true
				// 			}
				// 		})
				// 		console.log("foundInCache= ", foundInCache);
				// 		if(foundInCache != true) {
				// 			return {...friend, newfriend: true}
				// 		} else {
				// 			return friend
				// 		}
				// 	})
				// }
				// console.log("newFriends= ", newFriends);
				let unreadChatCounts
				if(getLSItem(`${LS_APP_PWA_UNREADCHATS}`) == null || getLSItem(`${LS_APP_PWA_UNREADCHATS}`) == undefined ) {
					console.log("NG_APP_SD_UNREAD_COUNTS not in localStorage= ", getLSItem(`${LS_APP_PWA_UNREADCHATS}`));
					let friendsUnread = {}
					friends.forEach(item => {
						friendsUnread[item.meetingId] = 0
					})
					console.log('NG_APP_SD_UNREAD_COUNTS new in localStorage= ', friendsUnread);
					setLSItem(`${LS_APP_PWA_UNREADCHATS}`, friendsUnread)
					// localStorage.setItem('NG_APP_SD_UNREAD_COUNTS', JSON.stringify(friendsUnread))
					unreadChatCounts = friendsUnread
				} else {
					unreadChatCounts = getLSItem(`${LS_APP_PWA_UNREADCHATS}`)
					console.log("unreadChatCounts in  localstorage= ", unreadChatCounts);
				}
				// console.log("final new friend= ", newFriends);
				console.log("final new friend= ", friends);
				if(friends && friends.length > 0) setLSItem(`${LS_APP_PWA_FRIENDSLIST}`, action.payload.data)
				// localStorage.setItem('NG_APP_SD_friendsList', JSON.stringify(action.payload.data) );
			} else {
				invalidAccess = true
			}
			console.log("unreadChatCounts in FRIENDS_LIST= ", unreadChatCounts, friends, me, isLoading, invalidAccess);
			// friends: newFriends
			return { ...tempState, friends, me, isLoading, timestamp: Date.now(), noReload: true, invalidAccess, chatReqActionResult: null } //unreadChatCounts
			break;

		case 'NEW_FRIEND_REQUEST_LIST':
			console.log('NEW_FRIEND_REQUEST_LIST= ', action.payload);
			isLoading = false;
			let newFriendRequests = [];
			invalidAccess = false
			let {status, data} = action.payload
			// console.log('!"err" in action.payload ', !"err" in action.payload, action.payload.err);
			if(
				action.payload &&
				status &&
				data &&
				action.payload.status >= 200 && action.payload.status < 300 &&
				!action.payload.err
			) {
				newFriendRequests = data.newRequests || []
				console.log('NEW_FRIEND_REQUEST_LIST data ok ', newFriendRequests);
				if(data.text) tempState["newFriendReqText"] = data.text
				// if(newFriendRequests && newFriendRequests.length > 0)
				setLSItem(`${LS_APP_PWA_NEW_FRIENDS_REQS}`, newFriendRequests)
			} else {
				console.log('NEW_FRIEND_REQUEST_LIST data NOT ok');
				// invalidAccess = true
			}
			return {...tempState, invalidAccess, newFriendRequests, isLoading, chatReqActionResult: null }
			break;

		case 'SENT':
			return { ...tempState }
			break;

		case 'LAST_MSG':
			// console.log('LAST_MSG : ', action.payload);
			lastChats = { ...tempState.lastChats };
			lastChats[action.payload.id] = action.payload.msg;
			console.log("lastChats in LAST_MSG= ", lastChats);
			setLSItem(`${LS_APP_PWA_LASTMSG}`, lastChats);
			// localStorage.setItem('NG_APP_SD_LAST_MSG', JSON.stringify(lastChats));
			return { ...tempState, lastChats }
			break;

		case 'FRIENDS_LIST_CACHE':
			console.log('FRIENDS_LIST_CACHE : ', action.payload, localStorage);
			try {
				const fromCache = getLSItem(`${LS_APP_PWA_FRIENDSLIST}`)
				// localStorage.getItem('NG_APP_SD_friendsList');
				const data = fromCache;
				me = data.me;
				friends = data.friends;
				lastChats = getLSItem(`${LS_APP_PWA_LASTMSG}`)
				botChats = getLSItem(`${LS_APP_PWA_BOT_CHATS}`);
				unreadChatCounts = getLSItem(`${LS_APP_PWA_UNREADCHATS}`)

				// get newFriendRequests
				newFriendRequests = getLSItem(`${LS_APP_PWA_NEW_FRIENDS_REQS}`)
				console.log('newFriendRequests in get cache ', newFriendRequests);
				if (newFriendRequests == null) {
					console.log('newFriendRequests in get cache = []');
					newFriendRequests = []
				}
			}catch(e){
				console.log('error in FRIENDS_LIST_CACHE ', e);
			}
			console.log("unreadChatCounts in FRIENDS_LIST_CACHE= ", newFriendRequests, me, friends, lastChats, botChats, unreadChatCounts);
			return { ...tempState, friends, me, lastChats, botChats, isLoading: false, unreadChatCounts, newFriendRequests }
			break;

		case 'SET_MEETING':
		console.log("SET_MEETING ", action.payload);
			// const friendData = [ ...tempState.friends ];
			// const meetingId = action.payload;
			// const meetingData = friendData.find(friend => friend.meetingId == meetingId);

			if(action.payload == undefined) return {...tempState}

			return { ...tempState, meetingData: action.payload, showChatRequest: false }
			break;

		case 'ADD_CHILD_LISTENER':
			const childListeners = tempState.childListeners ? [...tempState.childListeners] : [];
			if(!childListeners.includes(action.payload)) childListeners.push(action.payload);
			return { ...tempState, childListeners }
			break;

		case 'SET_CHATS':
			console.log("SET_CHATS : ", action.payload);
			const chatMeetingId = action.payload;
			const chats = { ...tempState.chats };
			const triggerStamp = { ...tempState.triggerStamp };
			console.log("last timestamp= ", triggerStamp);
			let pastTrigger = getLSItem(`${LS_APP_PWA_LASTCHAT_TRIGGERSTAMP}${chatMeetingId}`)
			// localStorage.getItem(`CHAT_LAST_TRIGGERSTAMP_${chatMeetingId}`)
			let pastTriggerStamp
			if(pastTrigger != null) {
				pastTriggerStamp = pastTrigger
			} else {
				pastTriggerStamp = 0
			}
			setLSItem(`${LS_APP_PWA_LASTCHAT_TRIGGERSTAMP}${chatMeetingId}`, triggerStamp[chatMeetingId] ? triggerStamp[chatMeetingId] : pastTriggerStamp)
			// localStorage.setItem(`CHAT_LAST_TRIGGERSTAMP_${chatMeetingId}`, triggerStamp[chatMeetingId] ? triggerStamp[chatMeetingId] : pastTriggerStamp )
			triggerStamp[chatMeetingId] = Date.now();
			if(chats[chatMeetingId]) return { ...tempState, triggerStamp };
			let chatsRetrieved = [];
			const checkBotChat = { ...tempState.botChats };
			const myBotChats = checkBotChat[chatMeetingId] || [];
			const cachedChats = getLSItem(`${LS_APP_PWA_CHAT_}${chatMeetingId}`)
			// localStorage.getItem(`NG_APP_SD_CHAT_${chatMeetingId}`);
			if (cachedChats != null && cachedChats.length > 0) {
				chatsRetrieved = cachedChats
				// JSON.parse(cachedChats);
			}
			chats[chatMeetingId] = myBotChats.concat(chatsRetrieved);
			console.log("triggerStamp= ", triggerStamp);
			return { ...tempState, chats, triggerStamp };
			break;

		case 'ADD_CHATS':
			console.log("ADD_CHATS : ", action.payload);
			const myMeetingId = action.payload.meetingId;
			const myMsg = action.payload.msg;
			const allChats = { ...tempState.chats };
			const myChats = allChats[myMeetingId] ? [ ...allChats[myMeetingId] ] : [];
			myChats.push(myMsg);
			allChats[myMeetingId] = myChats;
			return { ...tempState, chats: allChats };
			break;

		case 'SET_ITEMS':
			const { item, id, val } = action.payload;
			const itemData = { ...tempState[item] };
			itemData[id] = val;
			if(item === 'friendsLastSeen') {
				setLSItem(`${LS_APP_PWA_FRIEND_LASTSEEN}`, itemData);
				// localStorage.setItem('NG_APP_SD_FRIEND_LAST_SEEN', JSON.stringify(itemData));
			}
			return { ...tempState, [item]: itemData };
			break;

		case 'BOT_CHAT':
			if(
				action.payload &&
				action.payload.status &&
				action.payload.data &&
				typeof action.payload.data === 'object' &&
				action.payload.status >= 200 && action.payload.status < 300
			) {
				const newChats = action.payload.data;
				const cacheBotChats = getLSItem(`${LS_APP_PWA_BOT_CHATS}`) || {};
				// JSON.parse(localStorage.getItem('NG_APP_SD_BOT_CHATS')) || {};
				botChats = Object.assign(cacheBotChats, newChats);
				setLSItem(`${LS_APP_PWA_BOT_CHATS}`, botChats)
				// localStorage.setItem('NG_APP_SD_BOT_CHATS', JSON.stringify(botChats));
			}
			return { ...tempState, botChats}

			break;

		case 'UNFRIEND':
			if(action.payload.status >= 200 && action.payload.status < 300) {
				window.location.reload();
			} else {
				alert("Something went wrong!");
			}
			return { ...tempState, isLoading: false };
			break;

		case 'SET_UNREAD_CHAT_COUNT':
			console.log('LAST_MSG : ', action.payload, tempState.lastChats);
			let lastChats = { ...tempState.lastChats };
			if(action.payload.msg != undefined && action.payload.msg != null) {

				// lastChats[action.payload.id] = action.payload.msg;
				lastChats[action.payload.meetingId] = action.payload.msg;
				setLSItem(`${LS_APP_PWA_LASTMSG}`, lastChats);
				// localStorage.setItem('NG_APP_SD_LAST_MSG', JSON.stringify(lastChats));
				console.log("LS_APP_PWA_LASTMSG = ", lastChats);
				console.log("SET_UNREAD_CHAT_COUNT = ", action.payload.meetingId, action.payload.count);

			}

			let ucc = tempState.unreadChatCounts ? tempState.unreadChatCounts : {}
			ucc[action.payload.meetingId] = action.payload.count
			console.log("setting NG_APP_SD_UNREAD_COUNTS = ", ucc);
			setLSItem(`${LS_APP_PWA_UNREADCHATS}`, ucc)
			// localStorage.setItem('NG_APP_SD_UNREAD_COUNTS', JSON.stringify(ucc));
			// let {friends} = tempState
			// friends.forEach(item => {
			// 	unreadChatCounts[item.meetingId]
			// })
			return { ...tempState, unreadChatCounts:ucc , lastChats};
			break;
		case "CHAT_REQ_ACTION":
		let {response, actiontype} = action.payload
			console.log('CHAT_REQ_ACTION ', action.payload, response, actiontype);
			// action.payload.data &&
			if(
				response &&
				response.status &&
				response.status >= 200 && response.status < 300 &&
				!response.err
			) {
				console.log('response ok chat req ', {...tempState, chatReqActionResult: false}, actiontype == 'accept' ? true : false);
				return {...tempState, chatReqActionResult: actiontype == 'accept' ? true : false}
				// return {...tempState, chatReqActionResult: false}
			} else {
				console.log('response not ok chat req ', {...tempState, chatReqActionResult: false});
				return {...tempState, chatReqActionResult: false}
			}
			break;

		default:
			return tempState;
	}
}
