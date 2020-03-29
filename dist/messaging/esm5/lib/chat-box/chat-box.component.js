/**
 * @fileoverview added by tsickle
 * Generated from: lib/chat-box/chat-box.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MessagingService } from './messaging.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
var ChatBoxComponent = /** @class */ (function () {
    function ChatBoxComponent(messagingService) {
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
    ChatBoxComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // customer_user_id used only if it's staff view
        if (!this.is_customer_view) {
            this.customer_user_id = parseInt(this.recipient_user_id);
        }
        /** @type {?} */
        var readAllRequest = this.messagingService.readAll(this.customer_user_id);
        readAllRequest.subscribe();
        /** @type {?} */
        var loadMessagesRequest = this.loadMessages(0);
        loadMessagesRequest.subscribe((/**
         * @param {?} list
         * @return {?}
         */
        function (list) {
            _this.messageList = list;
            _this.addNewMessagesPage(list);
        }));
        forkJoin(readAllRequest, loadMessagesRequest).subscribe((/**
         * @return {?}
         */
        function () { return _this.isLoading = false; }));
        /** @type {?} */
        var onMessageCallback = (/**
         * @param {?} message
         * @return {?}
         */
        function (message) {
            if (_this.messageList.some((/**
             * @param {?} el
             * @return {?}
             */
            function (el) { return el.id === message.id; }))) {
                return;
            }
            if (!_this.recipient_user_id || (parseInt(message.sender_user_id) === parseInt(_this.recipient_user_id))
                || (parseInt(message.recipient_user_id) === parseInt(_this.recipient_user_id))) {
                _this.addNewMessage(tslib_1.__assign({ id: message.id, content: message.content, created_at: message.created_at, is_self_message: message.sender_user_id === _this.sender_user_id }, _this.showSenderName && { sender_display_name: _this.sender_display_name }));
                _this.messageList.push(message);
                // TODO: read this message not all!
                _this.messagingService.readAll(_this.customer_user_id)
                    .subscribe();
            }
        });
        this.messagingService.startLiveChat(onMessageCallback);
    };
    /**
     * @return {?}
     */
    ChatBoxComponent.prototype.loadMore = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.isLoading = true;
        /** @type {?} */
        var loadingSubscription = this.loadMessages(this.messageList.length)
            .subscribe((/**
         * @param {?} list
         * @return {?}
         */
        function (list) {
            _this.messageList = list.concat(_this.messageList);
            _this.addNewMessagesPage(list);
            _this.isLoading = false;
            loadingSubscription.unsubscribe();
        }));
    };
    /**
     * @param {?} offset
     * @return {?}
     */
    ChatBoxComponent.prototype.loadMessages = /**
     * @param {?} offset
     * @return {?}
     */
    function (offset) {
        /** @type {?} */
        var self = this;
        return this.messagingService.list(offset, this.customer_user_id)
            .pipe(map((/**
         * @param {?} list
         * @return {?}
         */
        function (list) {
            list.reverse();
            return list.map((/**
             * @param {?} message
             * @return {?}
             */
            function (message) {
                return {
                    id: message.id,
                    content: message.content,
                    created_at: message.created_at,
                    is_self_message: message.sender === parseInt(self.sender_user_id),
                    sender_display_name: message.sender_display_name
                };
            }));
        })));
    };
    /**
     * @return {?}
     */
    ChatBoxComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.msgDivs && this.msgDivs.last) {
            this.msgDivs.last.nativeElement.focus();
        }
        this.msgDivs.changes.subscribe((/**
         * @return {?}
         */
        function () {
            if (_this.msgDivs && _this.msgDivs.last) {
                _this.msgDivs.last.nativeElement.focus();
            }
        }));
    };
    /**
     * @param {?} msg
     * @return {?}
     */
    ChatBoxComponent.prototype.addNewMessage = /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) {
        if (this.latestMsgDatetime && (new Date(msg.created_at.toString()).getTime()
            - this.latestMsgDatetime.getTime()) / 60000 < this.GROUP_MIN_RANGE_IN_MINUTES) {
            this.groupedMessageList[this.groupedMessageList.length - 1].push(msg);
        }
        else {
            this.groupedMessageList.push([msg]);
        }
        this.latestMsgDatetime = new Date(msg.created_at.toString());
    };
    /**
     * @param {?} msgList
     * @return {?}
     */
    ChatBoxComponent.prototype.addNewMessagesPage = /**
     * @param {?} msgList
     * @return {?}
     */
    function (msgList) {
        var _this = this;
        if (this.msgDivs && this.msgDivs.first) {
            /** @type {?} */
            var firstDiv_1 = this.msgDivs.first;
            /** @type {?} */
            var onNewPageAdded_1 = (/**
             * @return {?}
             */
            function () {
                firstDiv_1.nativeElement.scrollIntoView(true);
                _this.msgsContainer.nativeElement.scrollBy(0, -90);
            });
            this.msgsContainer.nativeElement.addEventListener('DOMNodeInserted', onNewPageAdded_1, false);
            setTimeout((/**
             * @return {?}
             */
            function () { return _this.msgsContainer.nativeElement.removeEventListener('DOMNodeInserted', onNewPageAdded_1, false); }));
        }
        /** @type {?} */
        var groupingObj = this.groupByTime(msgList);
        if (groupingObj) {
            this.groupedMessageList = groupingObj.groupedList.concat(this.groupedMessageList);
            this.latestMsgDatetime = groupingObj.latestMsgDatetime;
        }
    };
    /**
     * @param {?} msgList
     * @return {?}
     */
    ChatBoxComponent.prototype.groupByTime = /**
     * @param {?} msgList
     * @return {?}
     */
    function (msgList) {
        var _this = this;
        if (!msgList.length) {
            return;
        }
        /** @type {?} */
        var groupedList = [];
        /** @type {?} */
        var adjacentList = [];
        /** @type {?} */
        var latestMsgDatetime = new Date(msgList[0].created_at.toString());
        msgList.forEach((/**
         * @param {?} message
         * @return {?}
         */
        function (message) {
            if ((new Date(message.created_at.toString()).getTime() - latestMsgDatetime.getTime()) / 60000 < _this.GROUP_MIN_RANGE_IN_MINUTES) {
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
            groupedList: groupedList,
            latestMsgDatetime: latestMsgDatetime
        };
    };
    /**
     * @return {?}
     */
    ChatBoxComponent.prototype.reply = /**
     * @return {?}
     */
    function () {
        this.messagingService.send_message(this.replyContent, this.recipient_user_id);
        this.replyContent = '';
        this.msgInput.nativeElement.addEventListener('focusout', this.focusOnInputAgain.bind(this));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ChatBoxComponent.prototype.focusOnInputAgain = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.msgInput.nativeElement.focus();
            _this.msgInput.nativeElement.removeEventListener('focusout', _this.focusOnInputAgain.bind(_this));
        }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ChatBoxComponent.prototype.onScroll = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.target.scrollTop === 0) {
            this.loadMore();
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    ChatBoxComponent.prototype.isToday = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        date = new Date(date.toString());
        /** @type {?} */
        var today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    ChatBoxComponent.prototype.isYesterday = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        date = new Date(date.toString());
        /** @type {?} */
        var toBeYesterday = new Date();
        toBeYesterday.setDate(toBeYesterday.getDate() - 1);
        /** @type {?} */
        var yesterday = toBeYesterday;
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    ChatBoxComponent.prototype.isWeekDay = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        if (this.isToday(date) || this.isYesterday(date)) {
            return false;
        }
        /** @type {?} */
        var weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(date.toString()) > weekAgo;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    ChatBoxComponent.prototype.getDayName = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return new Date(date.toString()).toLocaleString('en-us', { weekday: 'short' });
    };
    /**
     * @return {?}
     */
    ChatBoxComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.messagingService.removeOnMessageListener();
    };
    ChatBoxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'chatty-chat-box',
                    template: "<div class=\"chatbox\">\n\n  <div *ngIf=\"recipient_display_name && !isFullScreenMode\" class=\"chat-header\">\n    <span class=\"avatar\">\n        <mat-icon *ngIf=\"!recipient_avatar_src\" class=\"avatar__icon\">person</mat-icon>\n        <img *ngIf=\"recipient_avatar_src\" [src]=\"recipient_avatar_src\" class=\"avatar__img\">\n    </span>\n    <span class=\"name\">\n      {{recipient_display_name}}\n    </span>\n  </div>\n\n  <div class=\"messages\" #msgsContainer (scroll)=\"onScroll($event)\">\n    <div *ngFor=\"let group of groupedMessageList\">\n      <div class=\"messages-group\">\n        <div class=\"messages-group-label\">\n          <div class=\"hr-sect\" *ngIf=\"isToday(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\">{{group[0]?.created_at | date: 'shortTime'}}</span>\n          </div>\n          <div class=\"hr-sect\" *ngIf=\"isYesterday(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\">Yesterday {{group[0]?.created_at | date: 'shortTime'}}</span>\n          </div>\n          <div class=\"hr-sect\" *ngIf=\"isWeekDay(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\">{{group[0]?.created_at | date: 'EEEE'}} {{group[0]?.created_at | date: 'shortTime'}}</span>\n          </div>\n          <div class=\"hr-sect\" *ngIf=\"!isToday(group[0]?.created_at) &&\n                    !isYesterday(group[0]?.created_at) &&\n                    !isWeekDay(group[0]?.created_at)\">\n            <span style=\"padding: 0 10px;\"> {{group[0]?.created_at | date: 'MMM d, y, h:mm a'}}</span>\n          </div>\n        </div>\n        <div tabindex=\"1\" class=\"message-div\" #msgDiv *ngFor=\"let message of group\">\n          <div class=\"text-icon\" [class.self-messages]=\"message.is_self_message\">\n        <span class=\"avatar\" *ngIf=\"!message.is_self_message\">\n        <mat-icon class=\"avatar__icon\">person</mat-icon>\n        <img *ngIf=\"recipient_avatar_src\" [src]=\"recipient_avatar_src\" class=\"avatar__img\">\n      </span>\n            <div>\n              <div class=\"sender-name\" *ngIf=\"message.is_self_message && this.showSenderName\">\n                {{message.sender_display_name}}\n              </div>\n              <p class=\"message-item\">\n                {{message.content}}\n              </p>\n            </div>\n            <span class=\"avatar\" style=\"vertical-align: middle;\" *ngIf=\"message.is_self_message\">\n          <mat-icon>person</mat-icon>\n          <img *ngIf=\"sender_avatar_src\" [src]=\"sender_avatar_src\" class=\"avatar__img\">\n      </span>\n\n            <!--<div class=\"timeform\">-->\n            <!--<mat-icon>date</mat-icon> <span class=\"timestamp\">at {{message.created_at | date : 'dd/MM/yyyy' }}</span>-->\n            <!--</div>-->\n          </div>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <div class=\"input-container\">\n    <mat-form-field>\n    <textarea #msgInput matInput\n              cdkTextareaAutosize\n              #autosize=\"cdkTextareaAutosize\"\n              cdkAutosizeMinRows=\"2\"\n              cdkAutosizeMaxRows=\"5\"\n              (keyup.enter)=\"reply()\" placeholder=\"Type a message..\" [(ngModel)]=\"replyContent\">\n    </textarea>\n    </mat-form-field>\n\n    <div class=\"button-wrap\">\n      <button mat-raised-button\n              color=\"primary\"\n              class=\"replyBtn\"\n              (click)=\"reply()\">\n        Send\n      </button>\n    </div>\n  </div>\n\n</div>\n",
                    styles: [":root{--theme-color:#3498db;--window-width:90%;--height:calc(100vh - 500px)}.chatbox{height:var(--height);width:var(--window-width,90%);display:flex;flex-direction:column;margin:0 auto;border-radius:5px 5px 0 0;background-color:#fff;box-shadow:0 2px 4px 0 rgba(0,0,0,.2)}.chatbox .chat-header{height:120px;padding:20px;text-align:center;border-radius:5px 5px 0 0;background:var(--theme-color,#3498db);color:#fff}.chatbox .chat-header .avatar{margin:0 0 10px;width:55px;min-width:55px;height:55px;min-height:55px;text-align:center!important;background-color:#fff!important;vertical-align:middle;color:#000!important}.chatbox .chat-header .name{font-size:20px;font-style:oblique;font-weight:700;display:block}.chatbox .messages{flex:1;overflow:auto;padding:50px 16px 6px;background-color:#fafafa;box-shadow:inset 0 2px 2px rgba(0,0,0,.1)}.chatbox .messages .messages-group{margin-bottom:10px}.chatbox .messages .messages-group .messages-group-label{text-align:center;margin-bottom:10px}.chatbox .messages .messages-group .messages-group-label .hr-sect{display:flex;flex-basis:100%;align-items:center;margin:8px 0}.chatbox .messages .messages-group .messages-group-label .hr-sect::after,.chatbox .messages .messages-group .messages-group-label .hr-sect::before{content:\"\";flex-grow:1;background:rgba(0,0,0,.1);height:1.5px;font-size:0;line-height:0;margin:0 8px}.chatbox .messages .messages-group .message-div{padding:1px;outline:0}.chatbox .messages .message-item{background-color:#ccc;padding:8px;border-radius:14px;margin-top:0;margin-bottom:0}.chatbox .messages .text-icon{display:flex;flex-direction:row;justify-content:flex-start}.chatbox .messages .self-messages{justify-content:flex-end}.chatbox .messages .self-messages .sender-name{font-size:14px;font-weight:700;margin:2px 5px;text-align:right}.chatbox .messages .self-messages p{color:#fff;background-color:var(--theme-color,#3498db);white-space:pre-line}.chatbox .messages .avatar{margin:0 5px;width:25px;min-width:25px;height:25px;min-height:25px;text-align:center!important;background-color:#fff!important;vertical-align:middle;color:#000!important}.chatbox .input-container{display:flex;flex-direction:row;align-items:center;width:100%;margin:0 auto;background-color:#fff;box-shadow:0 2px 4px 0 rgba(0,0,0,.2);border-radius:0 0 5px 5px;padding:8px;vertical-align:middle;border-top:1px solid #ebebeb}.chatbox .input-container mat-form-field{flex:1}.chatbox .input-container mat-form-field textarea{width:100%}.chatbox .input-container .button-wrap{margin:4px}.chatbox .input-container .button-wrap button{width:70px;margin-left:20px}"]
                }] }
    ];
    /** @nocollapse */
    ChatBoxComponent.ctorParameters = function () { return [
        { type: MessagingService }
    ]; };
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
    return ChatBoxComponent;
}());
export { ChatBoxComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1ib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2hhdHR5LWZyb250ZW5kLyIsInNvdXJjZXMiOlsibGliL2NoYXQtYm94L2NoYXQtYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixTQUFTLEVBRVYsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5QixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHbkM7SUFvQ0UsMEJBQW9CLGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBZnRELGdCQUFXLEdBQXFCLEVBQUUsQ0FBQztRQUVuQyx1QkFBa0IsR0FBdUIsRUFBRSxDQUFDO1FBRzVDLCtCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFJdEIsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFLaEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7UUFDNUUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkIsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLO2lCQUMzQixXQUFXLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDNUM7UUFFRCxJQUFJLGtCQUFrQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7WUFDNUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFD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O0lBRW5DLDhDQUE0Qzs7SUFDNUMsNkNBQXdCOztJQUV4QixzREFBZ0M7O0lBQ2hDLDRDQUF5Qjs7SUFDekIsMENBQXNCOztJQUV0QixxQ0FBVTs7SUFFVix3Q0FBa0I7O0lBRWxCLG9DQUE2RDs7Ozs7SUFFakQsNENBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIFF1ZXJ5TGlzdCxcbiAgT25Jbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ByZXZpZXdNZXNzYWdlfSBmcm9tICcuLi9tb2RlbHMnO1xuaW1wb3J0IHtNZXNzYWdpbmdTZXJ2aWNlfSBmcm9tICcuL21lc3NhZ2luZy5zZXJ2aWNlJztcbmltcG9ydCB7Zm9ya0pvaW59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7U2VydmVyTWVzc2FnZX0gZnJvbSAnLi4vbW9kZWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2hhdHR5LWNoYXQtYm94JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NoYXQtYm94LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY2hhdC1ib3guY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDaGF0Qm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBWaWV3Q2hpbGRyZW4oJ21zZ0RpdicpIG1zZ0RpdnM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgQFZpZXdDaGlsZCgnbXNnc0NvbnRhaW5lcicsIHtzdGF0aWM6IGZhbHNlfSkgbXNnc0NvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBzZW5kZXJfYXZhdGFyX3NyYzogc3RyaW5nO1xuICBASW5wdXQoKSByZWNpcGllbnRfYXZhdGFyX3NyYzogbnVtYmVyO1xuICBASW5wdXQoKSBzZW5kZXJfZGlzcGxheV9uYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJlY2lwaWVudF9kaXNwbGF5X25hbWU6IHN0cmluZztcbiAgQElucHV0KCkgc2VuZGVyX3VzZXJfaWQ6IHN0cmluZztcbiAgQElucHV0KCkgcmVjaXBpZW50X3VzZXJfaWQ6IHN0cmluZztcbiAgQElucHV0KCkgaXNfY3VzdG9tZXJfdmlldzogYm9vbGVhbjtcbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmc7XG5cbiAgY3VzdG9tZXJfdXNlcl9pZDogbnVtYmVyO1xuXG4gIG1lc3NhZ2VMaXN0OiBQcmV2aWV3TWVzc2FnZVtdID0gW107XG5cbiAgZ3JvdXBlZE1lc3NhZ2VMaXN0OiBQcmV2aWV3TWVzc2FnZVtdW10gPSBbXTtcbiAgbGF0ZXN0TXNnRGF0ZXRpbWU6IERhdGU7XG5cbiAgR1JPVVBfTUlOX1JBTkdFX0lOX01JTlVURVMgPSAyMDtcbiAgaXNGdWxsU2NyZWVuTW9kZSA9IGZhbHNlO1xuICBzaG93U2VuZGVyTmFtZSA9IHRydWU7XG5cbiAgaXNMb2FkaW5nO1xuXG4gIHJlcGx5Q29udGVudCA9ICcnO1xuXG4gIEBWaWV3Q2hpbGQoJ21zZ0lucHV0Jywge3N0YXRpYzogZmFsc2V9KSBtc2dJbnB1dDogRWxlbWVudFJlZjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2luZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2UpIHtcbiAgICB0aGlzLmlzRnVsbFNjcmVlbk1vZGUgPSB0aGlzLm1lc3NhZ2luZ1NlcnZpY2UuY29uZmlnT2JqZWN0LmZ1bGxfc2NyZWVuX21vZGU7XG4gICAgaWYgKHRoaXMuaXNGdWxsU2NyZWVuTW9kZSkge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGVcbiAgICAgICAgICAuc2V0UHJvcGVydHkoJy0td2luZG93LXdpZHRoJywgJzEwMCUnKTtcbiAgICB9XG5cbiAgICBpZiAoJ3Nob3dfc2VuZGVyX25hbWUnIGluIHRoaXMubWVzc2FnaW5nU2VydmljZS5jb25maWdPYmplY3QpIHtcbiAgICAgIHRoaXMuc2hvd1NlbmRlck5hbWUgPSB0aGlzLm1lc3NhZ2luZ1NlcnZpY2UuY29uZmlnT2JqZWN0LnNob3dfc2VuZGVyX25hbWU7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ4MjE2NDIzXG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gY3VzdG9tZXJfdXNlcl9pZCB1c2VkIG9ubHkgaWYgaXQncyBzdGFmZiB2aWV3XG4gICAgaWYoIXRoaXMuaXNfY3VzdG9tZXJfdmlldykge1xuICAgICAgdGhpcy5jdXN0b21lcl91c2VyX2lkID0gcGFyc2VJbnQodGhpcy5yZWNpcGllbnRfdXNlcl9pZCk7XG4gICAgfVxuICAgIGNvbnN0IHJlYWRBbGxSZXF1ZXN0ID0gdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLnJlYWRBbGwodGhpcy5jdXN0b21lcl91c2VyX2lkKTtcbiAgICByZWFkQWxsUmVxdWVzdC5zdWJzY3JpYmUoKTtcblxuICAgIGNvbnN0IGxvYWRNZXNzYWdlc1JlcXVlc3QgPSB0aGlzLmxvYWRNZXNzYWdlcygwKTtcbiAgICBsb2FkTWVzc2FnZXNSZXF1ZXN0LnN1YnNjcmliZSgobGlzdDogUHJldmlld01lc3NhZ2VbXSkgPT4ge1xuICAgICAgdGhpcy5tZXNzYWdlTGlzdCA9IGxpc3Q7XG4gICAgICB0aGlzLmFkZE5ld01lc3NhZ2VzUGFnZShsaXN0KTtcbiAgICB9KTtcblxuICAgIGZvcmtKb2luKHJlYWRBbGxSZXF1ZXN0LCBsb2FkTWVzc2FnZXNSZXF1ZXN0KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5pc0xvYWRpbmcgPSBmYWxzZSk7XG5cbiAgICBjb25zdCBvbk1lc3NhZ2VDYWxsYmFjayA9IChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAodGhpcy5tZXNzYWdlTGlzdC5zb21lKGVsID0+IGVsLmlkID09PSBtZXNzYWdlLmlkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMucmVjaXBpZW50X3VzZXJfaWQgfHwgKHBhcnNlSW50KG1lc3NhZ2Uuc2VuZGVyX3VzZXJfaWQpID09PSBwYXJzZUludCh0aGlzLnJlY2lwaWVudF91c2VyX2lkKSlcbiAgICAgICAgfHwgKHBhcnNlSW50KG1lc3NhZ2UucmVjaXBpZW50X3VzZXJfaWQpID09PSBwYXJzZUludCh0aGlzLnJlY2lwaWVudF91c2VyX2lkKSkpIHtcbiAgICAgICAgdGhpcy5hZGROZXdNZXNzYWdlKHtcbiAgICAgICAgICBpZDogbWVzc2FnZS5pZCxcbiAgICAgICAgICBjb250ZW50OiBtZXNzYWdlLmNvbnRlbnQsXG4gICAgICAgICAgY3JlYXRlZF9hdDogbWVzc2FnZS5jcmVhdGVkX2F0LFxuICAgICAgICAgIGlzX3NlbGZfbWVzc2FnZTogbWVzc2FnZS5zZW5kZXJfdXNlcl9pZCA9PT0gdGhpcy5zZW5kZXJfdXNlcl9pZCxcbiAgICAgICAgICAuLi50aGlzLnNob3dTZW5kZXJOYW1lICYmIHtzZW5kZXJfZGlzcGxheV9uYW1lOiB0aGlzLnNlbmRlcl9kaXNwbGF5X25hbWV9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1lc3NhZ2VMaXN0LnB1c2gobWVzc2FnZSk7XG4gICAgICAgIC8vIFRPRE86IHJlYWQgdGhpcyBtZXNzYWdlIG5vdCBhbGwhXG4gICAgICAgIHRoaXMubWVzc2FnaW5nU2VydmljZS5yZWFkQWxsKHRoaXMuY3VzdG9tZXJfdXNlcl9pZClcbiAgICAgICAgICAuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLm1lc3NhZ2luZ1NlcnZpY2Uuc3RhcnRMaXZlQ2hhdChvbk1lc3NhZ2VDYWxsYmFjayk7XG4gIH1cblxuICBsb2FkTW9yZSgpIHtcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgY29uc3QgbG9hZGluZ1N1YnNjcmlwdGlvbiA9IHRoaXMubG9hZE1lc3NhZ2VzKHRoaXMubWVzc2FnZUxpc3QubGVuZ3RoKVxuICAgICAgLnN1YnNjcmliZSgobGlzdDogUHJldmlld01lc3NhZ2VbXSkgPT4ge1xuICAgICAgICB0aGlzLm1lc3NhZ2VMaXN0ID0gbGlzdC5jb25jYXQodGhpcy5tZXNzYWdlTGlzdCk7XG4gICAgICAgIHRoaXMuYWRkTmV3TWVzc2FnZXNQYWdlKGxpc3QpO1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBsb2FkaW5nU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGxvYWRNZXNzYWdlcyhvZmZzZXQpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLmxpc3Qob2Zmc2V0LCB0aGlzLmN1c3RvbWVyX3VzZXJfaWQpXG4gICAgICAucGlwZShtYXAoKGxpc3Q6IFNlcnZlck1lc3NhZ2VbXSkgPT4ge1xuICAgICAgICBsaXN0LnJldmVyc2UoKTtcbiAgICAgICAgcmV0dXJuIGxpc3QubWFwKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6IG1lc3NhZ2UuaWQsXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2UuY29udGVudCxcbiAgICAgICAgICAgICAgY3JlYXRlZF9hdDogbWVzc2FnZS5jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICBpc19zZWxmX21lc3NhZ2U6IG1lc3NhZ2Uuc2VuZGVyID09PSBwYXJzZUludChzZWxmLnNlbmRlcl91c2VyX2lkKSxcbiAgICAgICAgICAgICAgc2VuZGVyX2Rpc3BsYXlfbmFtZTogbWVzc2FnZS5zZW5kZXJfZGlzcGxheV9uYW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pKTtcbiAgfVxuXG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLm1zZ0RpdnMgJiYgdGhpcy5tc2dEaXZzLmxhc3QpIHtcbiAgICAgIHRoaXMubXNnRGl2cy5sYXN0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gICAgdGhpcy5tc2dEaXZzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm1zZ0RpdnMgJiYgdGhpcy5tc2dEaXZzLmxhc3QpIHtcbiAgICAgICAgdGhpcy5tc2dEaXZzLmxhc3QubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYWRkTmV3TWVzc2FnZShtc2cpIHtcbiAgICBpZiAodGhpcy5sYXRlc3RNc2dEYXRldGltZSAmJiAobmV3IERhdGUobXNnLmNyZWF0ZWRfYXQudG9TdHJpbmcoKSkuZ2V0VGltZSgpXG4gICAgICAtIHRoaXMubGF0ZXN0TXNnRGF0ZXRpbWUuZ2V0VGltZSgpKSAvIDYwMDAwIDwgdGhpcy5HUk9VUF9NSU5fUkFOR0VfSU5fTUlOVVRFUykge1xuICAgICAgdGhpcy5ncm91cGVkTWVzc2FnZUxpc3RbdGhpcy5ncm91cGVkTWVzc2FnZUxpc3QubGVuZ3RoIC0gMV0ucHVzaChtc2cpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdyb3VwZWRNZXNzYWdlTGlzdC5wdXNoKFttc2ddKTtcbiAgICB9XG4gICAgdGhpcy5sYXRlc3RNc2dEYXRldGltZSA9IG5ldyBEYXRlKG1zZy5jcmVhdGVkX2F0LnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgYWRkTmV3TWVzc2FnZXNQYWdlKG1zZ0xpc3Q6IFByZXZpZXdNZXNzYWdlW10pIHtcbiAgICBpZiAodGhpcy5tc2dEaXZzICYmIHRoaXMubXNnRGl2cy5maXJzdCkge1xuICAgICAgY29uc3QgZmlyc3REaXYgPSB0aGlzLm1zZ0RpdnMuZmlyc3Q7XG4gICAgICBjb25zdCBvbk5ld1BhZ2VBZGRlZCA9ICgpID0+IHtcbiAgICAgICAgZmlyc3REaXYubmF0aXZlRWxlbWVudC5zY3JvbGxJbnRvVmlldyh0cnVlKTtcbiAgICAgICAgdGhpcy5tc2dzQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsQnkoMCwgLTkwKTtcbiAgICAgIH07XG4gICAgICB0aGlzLm1zZ3NDb250YWluZXIubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLCBvbk5ld1BhZ2VBZGRlZCwgZmFsc2UpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm1zZ3NDb250YWluZXIubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLCBvbk5ld1BhZ2VBZGRlZCwgZmFsc2UpKTtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cGluZ09iaiA9IHRoaXMuZ3JvdXBCeVRpbWUobXNnTGlzdCk7XG4gICAgaWYgKGdyb3VwaW5nT2JqKSB7XG4gICAgICB0aGlzLmdyb3VwZWRNZXNzYWdlTGlzdCA9IGdyb3VwaW5nT2JqLmdyb3VwZWRMaXN0LmNvbmNhdCh0aGlzLmdyb3VwZWRNZXNzYWdlTGlzdCk7XG4gICAgICB0aGlzLmxhdGVzdE1zZ0RhdGV0aW1lID0gZ3JvdXBpbmdPYmoubGF0ZXN0TXNnRGF0ZXRpbWU7XG4gICAgfVxuXG4gIH1cblxuICBncm91cEJ5VGltZShtc2dMaXN0OiBQcmV2aWV3TWVzc2FnZVtdKSB7XG4gICAgaWYgKCFtc2dMaXN0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgZ3JvdXBlZExpc3QgPSBbXTtcbiAgICBsZXQgYWRqYWNlbnRMaXN0ID0gW107XG4gICAgbGV0IGxhdGVzdE1zZ0RhdGV0aW1lID0gbmV3IERhdGUobXNnTGlzdFswXS5jcmVhdGVkX2F0LnRvU3RyaW5nKCkpO1xuICAgIG1zZ0xpc3QuZm9yRWFjaCgobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKChuZXcgRGF0ZShtZXNzYWdlLmNyZWF0ZWRfYXQudG9TdHJpbmcoKSkuZ2V0VGltZSgpIC0gbGF0ZXN0TXNnRGF0ZXRpbWUuZ2V0VGltZSgpKSAvIDYwMDAwIDwgdGhpcy5HUk9VUF9NSU5fUkFOR0VfSU5fTUlOVVRFUykge1xuICAgICAgICBhZGphY2VudExpc3QucHVzaChtZXNzYWdlKTtcbiAgICAgICAgbGF0ZXN0TXNnRGF0ZXRpbWUgPSBuZXcgRGF0ZShtZXNzYWdlLmNyZWF0ZWRfYXQudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBncm91cGVkTGlzdC5wdXNoKGFkamFjZW50TGlzdCk7XG4gICAgICAgIGFkamFjZW50TGlzdCA9IFttZXNzYWdlXTtcbiAgICAgICAgbGF0ZXN0TXNnRGF0ZXRpbWUgPSBuZXcgRGF0ZShtZXNzYWdlLmNyZWF0ZWRfYXQudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZ3JvdXBlZExpc3QucHVzaChhZGphY2VudExpc3QpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdyb3VwZWRMaXN0LFxuICAgICAgbGF0ZXN0TXNnRGF0ZXRpbWVcbiAgICB9O1xuICB9XG5cbiAgcmVwbHkoKSB7XG4gICAgdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLnNlbmRfbWVzc2FnZSh0aGlzLnJlcGx5Q29udGVudCwgdGhpcy5yZWNpcGllbnRfdXNlcl9pZCk7XG4gICAgdGhpcy5yZXBseUNvbnRlbnQgPSAnJztcbiAgICB0aGlzLm1zZ0lucHV0Lm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLmZvY3VzT25JbnB1dEFnYWluLmJpbmQodGhpcykpO1xuICB9XG5cbiAgZm9jdXNPbklucHV0QWdhaW4oZXZlbnQpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMubXNnSW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5tc2dJbnB1dC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgdGhpcy5mb2N1c09uSW5wdXRBZ2Fpbi5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uU2Nyb2xsKGV2ZW50OiBhbnkpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnNjcm9sbFRvcCA9PT0gMCkge1xuICAgICAgdGhpcy5sb2FkTW9yZSgpO1xuICAgIH1cbiAgfVxuXG4gIGlzVG9kYXkoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gZGF0ZS5nZXREYXRlKCkgPT09IHRvZGF5LmdldERhdGUoKSAmJlxuICAgICAgZGF0ZS5nZXRNb250aCgpID09PSB0b2RheS5nZXRNb250aCgpICYmXG4gICAgICBkYXRlLmdldEZ1bGxZZWFyKCkgPT09IHRvZGF5LmdldEZ1bGxZZWFyKCk7XG4gIH1cblxuICBpc1llc3RlcmRheShkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUudG9TdHJpbmcoKSk7XG4gICAgbGV0IHRvQmVZZXN0ZXJkYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHRvQmVZZXN0ZXJkYXkuc2V0RGF0ZSh0b0JlWWVzdGVyZGF5LmdldERhdGUoKSAtIDEpO1xuICAgIGNvbnN0IHllc3RlcmRheSA9IHRvQmVZZXN0ZXJkYXk7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF0ZSgpID09PSB5ZXN0ZXJkYXkuZ2V0RGF0ZSgpICYmXG4gICAgICBkYXRlLmdldE1vbnRoKCkgPT09IHllc3RlcmRheS5nZXRNb250aCgpICYmXG4gICAgICBkYXRlLmdldEZ1bGxZZWFyKCkgPT09IHllc3RlcmRheS5nZXRGdWxsWWVhcigpO1xuICB9XG5cbiAgaXNXZWVrRGF5KGRhdGUpIHtcbiAgICBpZiAodGhpcy5pc1RvZGF5KGRhdGUpIHx8IHRoaXMuaXNZZXN0ZXJkYXkoZGF0ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHdlZWtBZ28gPSBuZXcgRGF0ZSgpO1xuICAgIHdlZWtBZ28uc2V0RGF0ZSh3ZWVrQWdvLmdldERhdGUoKSAtIDcpO1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnRvU3RyaW5nKCkpID4gd2Vla0FnbztcbiAgfVxuXG4gIGdldERheU5hbWUoZGF0ZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnRvU3RyaW5nKCkpLnRvTG9jYWxlU3RyaW5nKCdlbi11cycsIHt3ZWVrZGF5OiAnc2hvcnQnIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLnJlbW92ZU9uTWVzc2FnZUxpc3RlbmVyKCk7XG4gIH1cblxufVxuIl19