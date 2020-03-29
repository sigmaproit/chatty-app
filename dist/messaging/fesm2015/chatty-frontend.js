import { Injectable, Injector, Inject, ɵɵdefineInjectable, ɵɵinject, INJECTOR, Component, ViewChildren, ViewChild, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { stringify } from 'querystring';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule, MatDialogModule, MatCardModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule, MatCheckboxModule, MatAutocompleteModule, MatNativeDateModule, MatPaginatorModule, MatSidenavModule, MatListModule, NativeDateModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatRippleModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/chat-box/messaging.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MessagingService {
    /**
     * @param {?} http
     * @param {?} injector
     * @param {?} config
     */
    constructor(http, injector, config) {
        this.http = http;
        this.injector = injector;
        this.config = config;
        this.totalUnReadMsgsCountSource = new BehaviorSubject(0);
        this.totalUnReadMsgsCount = this.totalUnReadMsgsCountSource.asObservable();
        this.unReadMsgsCountsArraySource = new BehaviorSubject([]);
        this.unReadMsgsCountsArray = this.unReadMsgsCountsArraySource.asObservable();
        this.unreadMsgsIdsPairs = {};
        this.isWebSocketReconnectingSource = new BehaviorSubject(false);
        this.isWebSocketReconnecting = this.isWebSocketReconnectingSource.asObservable();
        this.defaultMsgArrivalCallback = (/**
         * @param {?} message
         * @return {?}
         */
        (message) => {
            if (stringify(message.sender_user_id) in this.unreadMsgsIdsPairs) {
                if (this.unreadMsgsIdsPairs[stringify(message.sender_user_id)].indexOf(message.id) > -1) {
                    return;
                }
                this.unreadMsgsIdsPairs[stringify(message.sender_user_id)].push(message.id);
            }
            else {
                this.unreadMsgsIdsPairs[stringify(message.sender_user_id)] = [message.id];
            }
            this.incrementTotalUnReadMsgsCount();
            /** @type {?} */
            let unReadPairsArray = this.unReadMsgsCountsArraySource.getValue();
            /** @type {?} */
            const matchedPairIndex = unReadPairsArray.findIndex((/**
             * @param {?} el
             * @return {?}
             */
            el => el.sender_user_id === message.sender_user_id));
            if (matchedPairIndex !== -1)
                unReadPairsArray[matchedPairIndex].count += 1;
            else
                unReadPairsArray.push({ sender_user_id: message.sender_user_id, count: 1 });
            this.unReadMsgsCountsArraySource.next(unReadPairsArray);
            console.log(unReadPairsArray);
        });
        this.configObject = config;
        this.authService = this.injector.get((/** @type {?} */ (config.auth)));
        if (config.push) {
            this.pushService = this.injector.get((/** @type {?} */ (config.push)));
        }
    }
    /**
     * @param {?} config
     * @return {?}
     */
    initialize(config) {
        this.configObject = config;
    }
    /**
     * @param {?} newCount
     * @return {?}
     */
    setTotalUnReadMsgsCount(newCount) {
        this.totalUnReadMsgsCountSource.next(newCount);
    }
    /**
     * @param {?} pairs
     * @return {?}
     */
    setUnReadMsgsCountsArray(pairs) {
        this.unReadMsgsCountsArraySource.next(pairs);
    }
    /**
     * @return {?}
     */
    incrementTotalUnReadMsgsCount() {
        this.totalUnReadMsgsCountSource.next(this.totalUnReadMsgsCountSource.getValue() + 1);
    }
    /**
     * @param {?} offset
     * @param {?=} customer_user_id
     * @return {?}
     */
    list(offset, customer_user_id = null) {
        /** @type {?} */
        let chatUrl;
        if (customer_user_id)
            chatUrl = `${this.configObject.messages_url}${customer_user_id}/?limit=${this.configObject.messages_page_size}&offset=${offset}`;
        else
            chatUrl = `${this.configObject.messages_url}?limit=${this.configObject.messages_page_size}&offset=${offset}`;
        return this.http.get(chatUrl).pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        (resp) => {
            return resp.results;
        })));
    }
    /**
     * @param {?} content
     * @param {?=} customer_user_id
     * @return {?}
     */
    send_message(content, customer_user_id = null) {
        this.ws.send(JSON.stringify({
            content: content,
            user_id: customer_user_id
        }));
    }
    /**
     * @param {?=} onMessageCallback
     * @return {?}
     */
    startLiveChat(onMessageCallback = null) {
        this.initializeUnReadMessagesCounts();
        /** @type {?} */
        const notificationCB = (/**
         * @param {?} message
         * @return {?}
         */
        (message) => {
            this.defaultMsgArrivalCallback(message);
            if (onMessageCallback) {
                onMessageCallback(message);
            }
        });
        /** @type {?} */
        const socketCB = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            /** @type {?} */
            const message = JSON.parse(event.data).message;
            notificationCB(message);
        });
        if (!this.ws || this.ws.readyState !== this.ws.OPEN)
            this.initializeAutoReconnectingWebSocket(socketCB);
        else
            this.setWebSocketCallbacks(socketCB);
        if (this.pushService) {
            this.setNotificationCallback(notificationCB);
        }
    }
    /**
     * @param {?} onMessageCB
     * @return {?}
     */
    initializeAutoReconnectingWebSocket(onMessageCB) {
        this.closeLiveChat();
        if (!this.authService.isAuthenticated()) {
            return;
        }
        /** @type {?} */
        const token = this.authService.getToken();
        this.ws = new WebSocket(`${this.configObject.socket_url}?token=${token}`);
        this.ws.onopen = (/**
         * @return {?}
         */
        () => this.isWebSocketReconnectingSource.next(false));
        this.setWebSocketCallbacks(onMessageCB);
    }
    /**
     * @private
     * @param {?} onMessageCB
     * @return {?}
     */
    setWebSocketCallbacks(onMessageCB) {
        this.ws.onmessage = onMessageCB;
        this.ws.onclose = (/**
         * @return {?}
         */
        () => {
            this.isWebSocketReconnectingSource.next(true);
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.initializeAutoReconnectingWebSocket(onMessageCB);
            }), 1000);
        });
        this.ws.onerror = (/**
         * @param {?} error
         * @return {?}
         */
        (error) => {
            if (!this.authService.isAuthenticated()) {
                return;
            }
            this.ws.close();
        });
    }
    /**
     * @private
     * @return {?}
     */
    initializeUnReadMessagesCounts() {
        this.http.get(`${this.configObject.messages_url}unread_messages_count/`)
            .subscribe((/**
         * @param {?} countPairs
         * @return {?}
         */
        (countPairs) => {
            this.setUnReadMsgsCountsArray(countPairs);
            /** @type {?} */
            let totalCount = 0;
            countPairs.forEach((/**
             * @param {?} pair
             * @return {?}
             */
            (pair) => {
                totalCount += pair.count;
            }));
            this.setTotalUnReadMsgsCount(totalCount);
        }));
    }
    /**
     * @param {?} onMessageCallback
     * @return {?}
     */
    setNotificationCallback(onMessageCallback) {
        /** @type {?} */
        const notificationCB = (/**
         * @param {?} notification
         * @return {?}
         */
        (notification) => {
            // The following commented code was commented as the ws.readystate in most times while app in background doesn't
            // detect that socket is not active anymore! So the if statement would be true and notification handler returns
            // without doing anything, although the socket is not doing its job! We moved avoiding duplication to the
            // component callback itself using message id
            // The following commented code was commented as the ws.readystate in most times while app in background doesn't
            // detect that socket is not active anymore! So the if statement would be true and notification handler returns
            // without doing anything, although the socket is not doing its job! We moved avoiding duplication to the
            // component callback itself using message id
            // if(this.ws.readyState === this.ws.OPEN)
            //   return;
            /** @type {?} */
            const message = notification.additionalData.message_dict;
            if (message)
                onMessageCallback(message);
        });
        // We commented the following code and instead set directly notification callback and check inside it while the
        // websocket is closed or not, as sometimes (in iOS) onclose is not called when the socket is down in background app
        // mode, so isWebSocketReconnecting will not update
        // let self = this;
        // this.notificationCallbackSubscription = this.isWebSocketReconnecting.subscribe({
        //   next(isClosed) {
        //     if(isClosed)
        //       self.pushService.setNotificationCallback(notificationCB);
        //     else self.pushService.removeNotificationCallback(notificationCB);
        //   },
        // });
        this.pushService.setNotificationCallback(notificationCB);
    }
    /**
     * @return {?}
     */
    removeOnMessageListener() {
        if (this.ws) {
            this.ws.onmessage = this.defaultMsgArrivalCallback;
        }
        if (this.pushService) {
            this.pushService.setNotificationCallback(this.defaultMsgArrivalCallback);
        }
    }
    /**
     * @return {?}
     */
    closeLiveChat() {
        if (!this.ws)
            return;
        this.ws.onclose = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            delete this.ws;
        });
        this.ws.close();
    }
    /**
     * @param {?=} customer_user_id
     * @return {?}
     */
    readAll(customer_user_id = null) {
        /** @type {?} */
        let readAllUrl;
        if (customer_user_id)
            readAllUrl = `${this.configObject.messages_url}${customer_user_id}/read_all/`;
        else
            readAllUrl = `${this.configObject.messages_url}read_all/`;
        return this.http.patch(readAllUrl, {})
            .pipe(tap((/**
         * @param {?} event
         * @return {?}
         */
        event => this.setTotalUnReadMsgsCount(0))));
    }
    /**
     * @param {?} customer_user_id
     * @return {?}
     */
    unreadLatest(customer_user_id) {
        return this.http.patch(`${this.configObject.messages_url}${customer_user_id}/unread_latest/`, {});
    }
}
MessagingService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
MessagingService.ctorParameters = () => [
    { type: HttpClient },
    { type: Injector },
    { type: undefined, decorators: [{ type: Inject, args: ['config',] }] }
];
/** @nocollapse */ MessagingService.ngInjectableDef = ɵɵdefineInjectable({ factory: function MessagingService_Factory() { return new MessagingService(ɵɵinject(HttpClient), ɵɵinject(INJECTOR), ɵɵinject("config")); }, token: MessagingService, providedIn: "root" });
if (false) {
    /** @type {?} */
    MessagingService.prototype.authService;
    /** @type {?} */
    MessagingService.prototype.pushService;
    /** @type {?} */
    MessagingService.prototype.ws;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.totalUnReadMsgsCountSource;
    /** @type {?} */
    MessagingService.prototype.totalUnReadMsgsCount;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.unReadMsgsCountsArraySource;
    /** @type {?} */
    MessagingService.prototype.unReadMsgsCountsArray;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.unreadMsgsIdsPairs;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.isWebSocketReconnectingSource;
    /** @type {?} */
    MessagingService.prototype.isWebSocketReconnecting;
    /** @type {?} */
    MessagingService.prototype.notificationCallbackSubscription;
    /** @type {?} */
    MessagingService.prototype.configObject;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.defaultMsgArrivalCallback;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.injector;
    /**
     * @type {?}
     * @private
     */
    MessagingService.prototype.config;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/chat-box/chat-box.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ChatBoxComponent {
    /**
     * @param {?} messagingService
     */
    constructor(messagingService) {
        this.messagingService = messagingService;
        this.messageList = [];
        this.groupedMessageList = [];
        this.GROUP_MIN_RANGE_IN_MINUTES = 20;
        this.isFullScreenMode = false;
        this.showSenderName = true;
        this.replyContent = '';
        this.isFullScreenMode = this.messagingService.configObject.full_screen_mode;
        if (this.isFullScreenMode) {
            document.documentElement.style
                .setProperty('--window-width', '100%');
        }
        if ('show_sender_name' in this.messagingService.configObject) {
            this.showSenderName = this.messagingService.configObject.show_sender_name;
        }
        // https://stackoverflow.com/a/48216423
        this.isLoading = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // customer_user_id used only if it's staff view
        if (!this.is_customer_view) {
            this.customer_user_id = parseInt(this.recipient_user_id);
        }
        /** @type {?} */
        const readAllRequest = this.messagingService.readAll(this.customer_user_id);
        readAllRequest.subscribe();
        /** @type {?} */
        const loadMessagesRequest = this.loadMessages(0);
        loadMessagesRequest.subscribe((/**
         * @param {?} list
         * @return {?}
         */
        (list) => {
            this.messageList = list;
            this.addNewMessagesPage(list);
        }));
        forkJoin(readAllRequest, loadMessagesRequest).subscribe((/**
         * @return {?}
         */
        () => this.isLoading = false));
        /** @type {?} */
        const onMessageCallback = (/**
         * @param {?} message
         * @return {?}
         */
        (message) => {
            if (this.messageList.some((/**
             * @param {?} el
             * @return {?}
             */
            el => el.id === message.id))) {
                return;
            }
            if (!this.recipient_user_id || (parseInt(message.sender_user_id) === parseInt(this.recipient_user_id))
                || (parseInt(message.recipient_user_id) === parseInt(this.recipient_user_id))) {
                this.addNewMessage(Object.assign({ id: message.id, content: message.content, created_at: message.created_at, is_self_message: message.sender_user_id === this.sender_user_id }, this.showSenderName && { sender_display_name: this.sender_display_name }));
                this.messageList.push(message);
                // TODO: read this message not all!
                this.messagingService.readAll(this.customer_user_id)
                    .subscribe();
            }
        });
        this.messagingService.startLiveChat(onMessageCallback);
    }
    /**
     * @return {?}
     */
    loadMore() {
        this.isLoading = true;
        /** @type {?} */
        const loadingSubscription = this.loadMessages(this.messageList.length)
            .subscribe((/**
         * @param {?} list
         * @return {?}
         */
        (list) => {
            this.messageList = list.concat(this.messageList);
            this.addNewMessagesPage(list);
            this.isLoading = false;
            loadingSubscription.unsubscribe();
        }));
    }
    /**
     * @param {?} offset
     * @return {?}
     */
    loadMessages(offset) {
        /** @type {?} */
        const self = this;
        return this.messagingService.list(offset, this.customer_user_id)
            .pipe(map((/**
         * @param {?} list
         * @return {?}
         */
        (list) => {
            list.reverse();
            return list.map((/**
             * @param {?} message
             * @return {?}
             */
            message => {
                return {
                    id: message.id,
                    content: message.content,
                    created_at: message.created_at,
                    is_self_message: message.sender === parseInt(self.sender_user_id),
                    sender_display_name: message.sender_display_name
                };
            }));
        })));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.msgDivs && this.msgDivs.last) {
            this.msgDivs.last.nativeElement.focus();
        }
        this.msgDivs.changes.subscribe((/**
         * @return {?}
         */
        () => {
            if (this.msgDivs && this.msgDivs.last) {
                this.msgDivs.last.nativeElement.focus();
            }
        }));
    }
    /**
     * @param {?} msg
     * @return {?}
     */
    addNewMessage(msg) {
        if (this.latestMsgDatetime && (new Date(msg.created_at.toString()).getTime()
            - this.latestMsgDatetime.getTime()) / 60000 < this.GROUP_MIN_RANGE_IN_MINUTES) {
            this.groupedMessageList[this.groupedMessageList.length - 1].push(msg);
        }
        else {
            this.groupedMessageList.push([msg]);
        }
        this.latestMsgDatetime = new Date(msg.created_at.toString());
    }
    /**
     * @param {?} msgList
     * @return {?}
     */
    addNewMessagesPage(msgList) {
        if (this.msgDivs && this.msgDivs.first) {
            /** @type {?} */
            const firstDiv = this.msgDivs.first;
            /** @type {?} */
            const onNewPageAdded = (/**
             * @return {?}
             */
            () => {
                firstDiv.nativeElement.scrollIntoView(true);
                this.msgsContainer.nativeElement.scrollBy(0, -90);
            });
            this.msgsContainer.nativeElement.addEventListener('DOMNodeInserted', onNewPageAdded, false);
            setTimeout((/**
             * @return {?}
             */
            () => this.msgsContainer.nativeElement.removeEventListener('DOMNodeInserted', onNewPageAdded, false)));
        }
        /** @type {?} */
        const groupingObj = this.groupByTime(msgList);
        if (groupingObj) {
            this.groupedMessageList = groupingObj.groupedList.concat(this.groupedMessageList);
            this.latestMsgDatetime = groupingObj.latestMsgDatetime;
        }
    }
    /**
     * @param {?} msgList
     * @return {?}
     */
    groupByTime(msgList) {
        if (!msgList.length) {
            return;
        }
        /** @type {?} */
        let groupedList = [];
        /** @type {?} */
        let adjacentList = [];
        /** @type {?} */
        let latestMsgDatetime = new Date(msgList[0].created_at.toString());
        msgList.forEach((/**
         * @param {?} message
         * @return {?}
         */
        (message) => {
            if ((new Date(message.created_at.toString()).getTime() - latestMsgDatetime.getTime()) / 60000 < this.GROUP_MIN_RANGE_IN_MINUTES) {
                adjacentList.push(message);
                latestMsgDatetime = new Date(message.created_at.toString());
            }
            else {
                groupedList.push(adjacentList);
                adjacentList = [message];
                latestMsgDatetime = new Date(message.created_at.toString());
            }
        }));
        groupedList.push(adjacentList);
        return {
            groupedList,
            latestMsgDatetime
        };
    }
    /**
     * @return {?}
     */
    reply() {
        this.messagingService.send_message(this.replyContent, this.recipient_user_id);
        this.replyContent = '';
        this.msgInput.nativeElement.addEventListener('focusout', this.focusOnInputAgain.bind(this));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    focusOnInputAgain(event) {
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.msgInput.nativeElement.focus();
            this.msgInput.nativeElement.removeEventListener('focusout', this.focusOnInputAgain.bind(this));
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onScroll(event) {
        if (event.target.scrollTop === 0) {
            this.loadMore();
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isToday(date) {
        date = new Date(date.toString());
        /** @type {?} */
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isYesterday(date) {
        date = new Date(date.toString());
        /** @type {?} */
        let toBeYesterday = new Date();
        toBeYesterday.setDate(toBeYesterday.getDate() - 1);
        /** @type {?} */
        const yesterday = toBeYesterday;
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isWeekDay(date) {
        if (this.isToday(date) || this.isYesterday(date)) {
            return false;
        }
        /** @type {?} */
        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(date.toString()) > weekAgo;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayName(date) {
        return new Date(date.toString()).toLocaleString('en-us', { weekday: 'short' });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.messagingService.removeOnMessageListener();
    }
}
ChatBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'chatty-chat-box',
                template: "<div class=\"chatbox\">\n\n  <div *ngIf=\"recipient_display_name && !isFullScreenMode\" class=\"chat-header\">\n    <span class=\"avatar\">\n        <mat-icon *ngIf=\"!recipient_avatar_src\" class=\"avatar__icon\">person</mat-icon>\n        <img *ngIf=\"recipient_avatar_src\" [src]=\"recipient_avatar_src\" class=\"avatar__img\">\n    </span>\n    <span class=\"name\">\n      {{recipient_display_name}}\n    </span>\n  </div>\n\n  <div class=\"messages\" #msgsContainer (scroll)=\"onScroll($event)\">\n    <div *ngFor=\"let group of groupedMessageList\">\n      <div class=\"messages-group\">\n        <div class=\"messages-group-label\">\n          <div class=\"hr-sect\" *ngIf=\"isToday(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\">{{group[0]?.created_at | date: 'shortTime'}}</span>\n          </div>\n          <div class=\"hr-sect\" *ngIf=\"isYesterday(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\">Yesterday {{group[0]?.created_at | date: 'shortTime'}}</span>\n          </div>\n          <div class=\"hr-sect\" *ngIf=\"isWeekDay(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\">{{group[0]?.created_at | date: 'EEEE'}} {{group[0]?.created_at | date: 'shortTime'}}</span>\n          </div>\n          <div class=\"hr-sect\" *ngIf=\"!isToday(group[0]?.created_at) &&\n                    !isYesterday(group[0]?.created_at) &&\n                    !isWeekDay(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\"> {{group[0]?.created_at | date: 'MMM d, y, h:mm a'}}</span>\n          </div>\n        </div>\n        <div tabindex=\"1\" class=\"message-div\" #msgDiv *ngFor=\"let message of group\">\n          <div class=\"text-icon\" [class.self-messages]=\"message.is_self_message\">\n        <span class=\"avatar\" *ngIf=\"!message.is_self_message\">\n        <mat-icon class=\"avatar__icon\">person</mat-icon>\n        <img *ngIf=\"recipient_avatar_src\" [src]=\"recipient_avatar_src\" class=\"avatar__img\">\n      </span>\n            <div>\n              <div class=\"sender-name\" *ngIf=\"message.is_self_message && this.showSenderName\">\n                {{message.sender_display_name}}\n              </div>\n              <p class=\"message-item\">\n                {{message.content}}\n              </p>\n            </div>\n            <span class=\"avatar\" style=\"vertical-align: middle;\" *ngIf=\"message.is_self_message\">\n          <mat-icon>person</mat-icon>\n          <img *ngIf=\"sender_avatar_src\" [src]=\"sender_avatar_src\" class=\"avatar__img\">\n      </span>\n\n            <!--<div class=\"timeform\">-->\n            <!--<mat-icon>date</mat-icon> <span class=\"timestamp\">at {{message.created_at | date : 'dd/MM/yyyy' }}</span>-->\n            <!--</div>-->\n          </div>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <div class=\"input-container\">\n    <mat-form-field>\n    <textarea #msgInput matInput\n              cdkTextareaAutosize\n              #autosize=\"cdkTextareaAutosize\"\n              cdkAutosizeMinRows=\"2\"\n              cdkAutosizeMaxRows=\"5\"\n              (keyup.enter)=\"reply()\" placeholder=\"Type a message..\" [(ngModel)]=\"replyContent\">\n    </textarea>\n    </mat-form-field>\n\n    <div class=\"button-wrap\">\n      <button mat-raised-button\n              color=\"primary\"\n              class=\"replyBtn\"\n              (click)=\"reply()\">\n        Send\n      </button>\n    </div>\n  </div>\n\n</div>\n",
                styles: [":root{--theme-color:#3498db;--window-width:90%;--height:calc(100vh - 500px)}.chatbox{height:var(--height);width:var(--window-width,90%);display:flex;flex-direction:column;margin:0 auto;border-radius:5px 5px 0 0;background-color:#fff;box-shadow:0 2px 4px 0 rgba(0,0,0,.2)}.chatbox .chat-header{height:120px;padding:20px;text-align:center;border-radius:5px 5px 0 0;background:var(--theme-color,#3498db);color:#fff}.chatbox .chat-header .avatar{margin:0 0 10px;width:55px;min-width:55px;height:55px;min-height:55px;text-align:center!important;background-color:#fff!important;vertical-align:middle;color:#000!important}.chatbox .chat-header .name{font-size:20px;font-style:oblique;font-weight:700;display:block}.chatbox .messages{flex:1;overflow:auto;padding:50px 16px 6px;background-color:#fafafa;box-shadow:inset 0 2px 2px rgba(0,0,0,.1)}.chatbox .messages .messages-group{margin-bottom:10px}.chatbox .messages .messages-group .messages-group-label{text-align:center;margin-bottom:10px}.chatbox .messages .messages-group .messages-group-label .hr-sect{display:flex;flex-basis:100%;align-items:center;margin:8px 0}.chatbox .messages .messages-group .messages-group-label .hr-sect::after,.chatbox .messages .messages-group .messages-group-label .hr-sect::before{content:\"\";flex-grow:1;background:rgba(0,0,0,.1);height:1.5px;font-size:0;line-height:0;margin:0 8px}.chatbox .messages .messages-group .message-div{padding:1px;outline:0}.chatbox .messages .message-item{background-color:#ccc;padding:8px;border-radius:14px;margin-top:0;margin-bottom:0}.chatbox .messages .text-icon{display:flex;flex-direction:row;justify-content:flex-start}.chatbox .messages .self-messages{justify-content:flex-end}.chatbox .messages .self-messages .sender-name{font-size:14px;font-weight:700;margin:2px 5px;text-align:right}.chatbox .messages .self-messages p{color:#fff;background-color:var(--theme-color,#3498db);white-space:pre-line}.chatbox .messages .avatar{margin:0 5px;width:25px;min-width:25px;height:25px;min-height:25px;text-align:center!important;background-color:#fff!important;vertical-align:middle;color:#000!important}.chatbox .input-container{display:flex;flex-direction:row;align-items:center;width:100%;margin:0 auto;background-color:#fff;box-shadow:0 2px 4px 0 rgba(0,0,0,.2);border-radius:0 0 5px 5px;padding:8px;vertical-align:middle;border-top:1px solid #ebebeb}.chatbox .input-container mat-form-field{flex:1}.chatbox .input-container mat-form-field textarea{width:100%}.chatbox .input-container .button-wrap{margin:4px}.chatbox .input-container .button-wrap button{width:70px;margin-left:20px}"]
            }] }
];
/** @nocollapse */
ChatBoxComponent.ctorParameters = () => [
    { type: MessagingService }
];
ChatBoxComponent.propDecorators = {
    msgDivs: [{ type: ViewChildren, args: ['msgDiv',] }],
    msgsContainer: [{ type: ViewChild, args: ['msgsContainer', { static: false },] }],
    sender_avatar_src: [{ type: Input }],
    recipient_avatar_src: [{ type: Input }],
    sender_display_name: [{ type: Input }],
    recipient_display_name: [{ type: Input }],
    sender_user_id: [{ type: Input }],
    recipient_user_id: [{ type: Input }],
    is_customer_view: [{ type: Input }],
    height: [{ type: Input }],
    msgInput: [{ type: ViewChild, args: ['msgInput', { static: false },] }]
};
if (false) {
    /** @type {?} */
    ChatBoxComponent.prototype.msgDivs;
    /** @type {?} */
    ChatBoxComponent.prototype.msgsContainer;
    /** @type {?} */
    ChatBoxComponent.prototype.sender_avatar_src;
    /** @type {?} */
    ChatBoxComponent.prototype.recipient_avatar_src;
    /** @type {?} */
    ChatBoxComponent.prototype.sender_display_name;
    /** @type {?} */
    ChatBoxComponent.prototype.recipient_display_name;
    /** @type {?} */
    ChatBoxComponent.prototype.sender_user_id;
    /** @type {?} */
    ChatBoxComponent.prototype.recipient_user_id;
    /** @type {?} */
    ChatBoxComponent.prototype.is_customer_view;
    /** @type {?} */
    ChatBoxComponent.prototype.height;
    /** @type {?} */
    ChatBoxComponent.prototype.customer_user_id;
    /** @type {?} */
    ChatBoxComponent.prototype.messageList;
    /** @type {?} */
    ChatBoxComponent.prototype.groupedMessageList;
    /** @type {?} */
    ChatBoxComponent.prototype.latestMsgDatetime;
    /** @type {?} */
    ChatBoxComponent.prototype.GROUP_MIN_RANGE_IN_MINUTES;
    /** @type {?} */
    ChatBoxComponent.prototype.isFullScreenMode;
    /** @type {?} */
    ChatBoxComponent.prototype.showSenderName;
    /** @type {?} */
    ChatBoxComponent.prototype.isLoading;
    /** @type {?} */
    ChatBoxComponent.prototype.replyContent;
    /** @type {?} */
    ChatBoxComponent.prototype.msgInput;
    /**
     * @type {?}
     * @private
     */
    ChatBoxComponent.prototype.messagingService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/material-imports/material-imports.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
class MaterialImportsModule {
}
MaterialImportsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    MatDatepickerModule,
                    MatDialogModule,
                    FlexLayoutModule,
                    CommonModule,
                    MatCardModule,
                    MatProgressSpinnerModule,
                    MatMenuModule,
                    MatIconModule,
                    MatToolbarModule,
                    MatButtonModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                    MatSortModule,
                    MatTableModule,
                    MatCheckboxModule,
                    MatAutocompleteModule,
                    MatNativeDateModule,
                    MatPaginatorModule,
                    MatSidenavModule,
                    MatListModule,
                    MatRippleModule,
                    BrowserModule,
                    BrowserAnimationsModule,
                    MatCardModule,
                    MatDialogModule,
                    MatButtonModule
                ],
                exports: [
                    MatDatepickerModule,
                    MatDialogModule,
                    FlexLayoutModule,
                    MatCardModule,
                    MatProgressSpinnerModule,
                    MatMenuModule,
                    MatIconModule,
                    MatToolbarModule,
                    MatButtonModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                    MatSortModule,
                    MatTableModule,
                    MatCheckboxModule,
                    MatAutocompleteModule,
                    MatNativeDateModule,
                    MatPaginatorModule,
                    MatSidenavModule,
                    MatListModule,
                    MatRippleModule,
                    MatDatepickerModule,
                    NativeDateModule
                ],
                declarations: [],
                providers: [
                    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
                    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/messaging.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MessagingModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: MessagingModule,
            providers: [MessagingService, { provide: 'config', useValue: config }]
        };
    }
}
MessagingModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ChatBoxComponent],
                imports: [
                    CommonModule,
                    BrowserModule,
                    MaterialImportsModule,
                    FormsModule
                ],
                exports: [ChatBoxComponent],
                providers: []
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: chatty-frontend.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { ChatBoxComponent, MessagingModule, MessagingService, MY_FORMATS as ɵa, MaterialImportsModule as ɵb };
//# sourceMappingURL=chatty-frontend.js.map
