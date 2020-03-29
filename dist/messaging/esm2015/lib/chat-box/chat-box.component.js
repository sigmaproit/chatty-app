/**
 * @fileoverview added by tsickle
 * Generated from: lib/chat-box/chat-box.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MessagingService } from './messaging.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
export class ChatBoxComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1ib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2hhdHR5LWZyb250ZW5kLyIsInNvdXJjZXMiOlsibGliL2NoYXQtYm94L2NoYXQtYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVFuQyxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBK0IzQixZQUFvQixnQkFBa0M7UUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQWZ0RCxnQkFBVyxHQUFxQixFQUFFLENBQUM7UUFFbkMsdUJBQWtCLEdBQXVCLEVBQUUsQ0FBQztRQUc1QywrQkFBMEIsR0FBRyxFQUFFLENBQUM7UUFDaEMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBSXRCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBS2hCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDO1FBQzVFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSztpQkFDM0IsV0FBVyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzVDO1FBRUQsSUFBSSxrQkFBa0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFO1lBQzVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQztTQUMzRTtRQUVELHVDQUF1QztRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLGdEQUFnRDtRQUNoRCxJQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDMUQ7O2NBQ0ssY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQzNFLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Y0FFckIsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDaEQsbUJBQW1CLENBQUMsU0FBUzs7OztRQUFDLENBQUMsSUFBc0IsRUFBRSxFQUFFO1lBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssRUFBQyxDQUFDOztjQUVoRixpQkFBaUI7Ozs7UUFBRyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJOzs7O1lBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxFQUFFLEVBQUMsRUFBRTtnQkFDckQsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO21CQUNqRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtnQkFDL0UsSUFBSSxDQUFDLGFBQWEsaUJBQ2hCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUNkLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUN4QixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFDOUIsZUFBZSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLGNBQWMsSUFDNUQsSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBQyxFQUN6RSxDQUFDO2dCQUNILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMvQixtQ0FBbUM7Z0JBQ25DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO3FCQUNqRCxTQUFTLEVBQUUsQ0FBQzthQUNoQjtRQUNILENBQUMsQ0FBQTtRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN6RCxDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztjQUNoQixtQkFBbUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2FBQ25FLFNBQVM7Ozs7UUFBQyxDQUFDLElBQXNCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQyxDQUFDLEVBQUM7SUFDTixDQUFDOzs7OztJQUVELFlBQVksQ0FBQyxNQUFNOztjQUNYLElBQUksR0FBRyxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2FBQzdELElBQUksQ0FBQyxHQUFHOzs7O1FBQUMsQ0FBQyxJQUFxQixFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRzs7OztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN0QixPQUFPO29CQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtvQkFDZCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87b0JBQ3hCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtvQkFDOUIsZUFBZSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7b0JBQ2pFLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxtQkFBbUI7aUJBQ2pELENBQUM7WUFDSixDQUFDLEVBQ0YsQ0FBQztRQUNKLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7O0lBR0QsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDekM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDekM7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRUQsYUFBYSxDQUFDLEdBQUc7UUFDZixJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUU7Y0FDeEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRTtZQUMvRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkU7YUFBTTtZQUNMLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDOzs7OztJQUVELGtCQUFrQixDQUFDLE9BQXlCO1FBQzFDLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTs7a0JBQ2hDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7O2tCQUM3QixjQUFjOzs7WUFBRyxHQUFHLEVBQUU7Z0JBQzFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFBO1lBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVGLFVBQVU7OztZQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsRUFBQyxDQUFDO1NBQ2xIOztjQUVLLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUM3QyxJQUFJLFdBQVcsRUFBRTtZQUNmLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDO1NBQ3hEO0lBRUgsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsT0FBeUI7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbkIsT0FBTztTQUNSOztZQUNHLFdBQVcsR0FBRyxFQUFFOztZQUNoQixZQUFZLEdBQUcsRUFBRTs7WUFDakIsaUJBQWlCLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsRSxPQUFPLENBQUMsT0FBTzs7OztRQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7Z0JBQy9ILFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNCLGlCQUFpQixHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUM3RDtpQkFBTTtnQkFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMvQixZQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekIsaUJBQWlCLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQzdEO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRS9CLE9BQU87WUFDTCxXQUFXO1lBQ1gsaUJBQWlCO1NBQ2xCLENBQUM7SUFDSixDQUFDOzs7O0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlGLENBQUM7Ozs7O0lBRUQsaUJBQWlCLENBQUMsS0FBSztRQUNyQixVQUFVOzs7UUFBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxRQUFRLENBQUMsS0FBVTtRQUNqQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDOzs7OztJQUVELE9BQU8sQ0FBQyxJQUFJO1FBQ1YsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOztjQUMzQixLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDeEIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUN2QyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNwQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLElBQUk7UUFDZCxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7O1lBQzdCLGFBQWEsR0FBRyxJQUFJLElBQUksRUFBRTtRQUM5QixhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7Y0FDN0MsU0FBUyxHQUFHLGFBQWE7UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUN4QyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ25ELENBQUM7Ozs7O0lBRUQsU0FBUyxDQUFDLElBQUk7UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoRCxPQUFPLEtBQUssQ0FBQztTQUNkOztZQUNHLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN4QixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3QyxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxJQUFJO1FBQ2IsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDaEYsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNsRCxDQUFDOzs7WUE1T0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLG83R0FBd0M7O2FBRXpDOzs7O1lBVE8sZ0JBQWdCOzs7c0JBWXJCLFlBQVksU0FBQyxRQUFROzRCQUNyQixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQztnQ0FFMUMsS0FBSzttQ0FDTCxLQUFLO2tDQUNMLEtBQUs7cUNBQ0wsS0FBSzs2QkFDTCxLQUFLO2dDQUNMLEtBQUs7K0JBQ0wsS0FBSztxQkFDTCxLQUFLO3VCQWlCTCxTQUFTLFNBQUMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs7OztJQTNCdEMsbUNBQXVEOztJQUN2RCx5Q0FBdUU7O0lBRXZFLDZDQUFtQzs7SUFDbkMsZ0RBQXNDOztJQUN0QywrQ0FBcUM7O0lBQ3JDLGtEQUF3Qzs7SUFDeEMsMENBQWdDOztJQUNoQyw2Q0FBbUM7O0lBQ25DLDRDQUFtQzs7SUFDbkMsa0NBQXdCOztJQUV4Qiw0Q0FBeUI7O0lBRXpCLHVDQUFtQzs7SUFFbkMsOENBQTRDOztJQUM1Qyw2Q0FBd0I7O0lBRXhCLHNEQUFnQzs7SUFDaEMsNENBQXlCOztJQUN6QiwwQ0FBc0I7O0lBRXRCLHFDQUFVOztJQUVWLHdDQUFrQjs7SUFFbEIsb0NBQTZEOzs7OztJQUVqRCw0Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgUXVlcnlMaXN0LFxuICBPbkluaXQsIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UHJldmlld01lc3NhZ2V9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQge01lc3NhZ2luZ1NlcnZpY2V9IGZyb20gJy4vbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHtmb3JrSm9pbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTZXJ2ZXJNZXNzYWdlfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjaGF0dHktY2hhdC1ib3gnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2hhdC1ib3guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jaGF0LWJveC5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIENoYXRCb3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgQFZpZXdDaGlsZHJlbignbXNnRGl2JykgbXNnRGl2czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAVmlld0NoaWxkKCdtc2dzQ29udGFpbmVyJywge3N0YXRpYzogZmFsc2V9KSBtc2dzQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIHNlbmRlcl9hdmF0YXJfc3JjOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJlY2lwaWVudF9hdmF0YXJfc3JjOiBudW1iZXI7XG4gIEBJbnB1dCgpIHNlbmRlcl9kaXNwbGF5X25hbWU6IHN0cmluZztcbiAgQElucHV0KCkgcmVjaXBpZW50X2Rpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBzZW5kZXJfdXNlcl9pZDogc3RyaW5nO1xuICBASW5wdXQoKSByZWNpcGllbnRfdXNlcl9pZDogc3RyaW5nO1xuICBASW5wdXQoKSBpc19jdXN0b21lcl92aWV3OiBib29sZWFuO1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZztcblxuICBjdXN0b21lcl91c2VyX2lkOiBudW1iZXI7XG5cbiAgbWVzc2FnZUxpc3Q6IFByZXZpZXdNZXNzYWdlW10gPSBbXTtcblxuICBncm91cGVkTWVzc2FnZUxpc3Q6IFByZXZpZXdNZXNzYWdlW11bXSA9IFtdO1xuICBsYXRlc3RNc2dEYXRldGltZTogRGF0ZTtcblxuICBHUk9VUF9NSU5fUkFOR0VfSU5fTUlOVVRFUyA9IDIwO1xuICBpc0Z1bGxTY3JlZW5Nb2RlID0gZmFsc2U7XG4gIHNob3dTZW5kZXJOYW1lID0gdHJ1ZTtcblxuICBpc0xvYWRpbmc7XG5cbiAgcmVwbHlDb250ZW50ID0gJyc7XG5cbiAgQFZpZXdDaGlsZCgnbXNnSW5wdXQnLCB7c3RhdGljOiBmYWxzZX0pIG1zZ0lucHV0OiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnaW5nU2VydmljZTogTWVzc2FnaW5nU2VydmljZSkge1xuICAgIHRoaXMuaXNGdWxsU2NyZWVuTW9kZSA9IHRoaXMubWVzc2FnaW5nU2VydmljZS5jb25maWdPYmplY3QuZnVsbF9zY3JlZW5fbW9kZTtcbiAgICBpZiAodGhpcy5pc0Z1bGxTY3JlZW5Nb2RlKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZVxuICAgICAgICAgIC5zZXRQcm9wZXJ0eSgnLS13aW5kb3ctd2lkdGgnLCAnMTAwJScpO1xuICAgIH1cblxuICAgIGlmICgnc2hvd19zZW5kZXJfbmFtZScgaW4gdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLmNvbmZpZ09iamVjdCkge1xuICAgICAgdGhpcy5zaG93U2VuZGVyTmFtZSA9IHRoaXMubWVzc2FnaW5nU2VydmljZS5jb25maWdPYmplY3Quc2hvd19zZW5kZXJfbmFtZTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDgyMTY0MjNcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBjdXN0b21lcl91c2VyX2lkIHVzZWQgb25seSBpZiBpdCdzIHN0YWZmIHZpZXdcbiAgICBpZighdGhpcy5pc19jdXN0b21lcl92aWV3KSB7XG4gICAgICB0aGlzLmN1c3RvbWVyX3VzZXJfaWQgPSBwYXJzZUludCh0aGlzLnJlY2lwaWVudF91c2VyX2lkKTtcbiAgICB9XG4gICAgY29uc3QgcmVhZEFsbFJlcXVlc3QgPSB0aGlzLm1lc3NhZ2luZ1NlcnZpY2UucmVhZEFsbCh0aGlzLmN1c3RvbWVyX3VzZXJfaWQpO1xuICAgIHJlYWRBbGxSZXF1ZXN0LnN1YnNjcmliZSgpO1xuXG4gICAgY29uc3QgbG9hZE1lc3NhZ2VzUmVxdWVzdCA9IHRoaXMubG9hZE1lc3NhZ2VzKDApO1xuICAgIGxvYWRNZXNzYWdlc1JlcXVlc3Quc3Vic2NyaWJlKChsaXN0OiBQcmV2aWV3TWVzc2FnZVtdKSA9PiB7XG4gICAgICB0aGlzLm1lc3NhZ2VMaXN0ID0gbGlzdDtcbiAgICAgIHRoaXMuYWRkTmV3TWVzc2FnZXNQYWdlKGxpc3QpO1xuICAgIH0pO1xuXG4gICAgZm9ya0pvaW4ocmVhZEFsbFJlcXVlc3QsIGxvYWRNZXNzYWdlc1JlcXVlc3QpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlKTtcblxuICAgIGNvbnN0IG9uTWVzc2FnZUNhbGxiYWNrID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmICh0aGlzLm1lc3NhZ2VMaXN0LnNvbWUoZWwgPT4gZWwuaWQgPT09IG1lc3NhZ2UuaWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5yZWNpcGllbnRfdXNlcl9pZCB8fCAocGFyc2VJbnQobWVzc2FnZS5zZW5kZXJfdXNlcl9pZCkgPT09IHBhcnNlSW50KHRoaXMucmVjaXBpZW50X3VzZXJfaWQpKVxuICAgICAgICB8fCAocGFyc2VJbnQobWVzc2FnZS5yZWNpcGllbnRfdXNlcl9pZCkgPT09IHBhcnNlSW50KHRoaXMucmVjaXBpZW50X3VzZXJfaWQpKSkge1xuICAgICAgICB0aGlzLmFkZE5ld01lc3NhZ2Uoe1xuICAgICAgICAgIGlkOiBtZXNzYWdlLmlkLFxuICAgICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2UuY29udGVudCxcbiAgICAgICAgICBjcmVhdGVkX2F0OiBtZXNzYWdlLmNyZWF0ZWRfYXQsXG4gICAgICAgICAgaXNfc2VsZl9tZXNzYWdlOiBtZXNzYWdlLnNlbmRlcl91c2VyX2lkID09PSB0aGlzLnNlbmRlcl91c2VyX2lkLFxuICAgICAgICAgIC4uLnRoaXMuc2hvd1NlbmRlck5hbWUgJiYge3NlbmRlcl9kaXNwbGF5X25hbWU6IHRoaXMuc2VuZGVyX2Rpc3BsYXlfbmFtZX1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWVzc2FnZUxpc3QucHVzaChtZXNzYWdlKTtcbiAgICAgICAgLy8gVE9ETzogcmVhZCB0aGlzIG1lc3NhZ2Ugbm90IGFsbCFcbiAgICAgICAgdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLnJlYWRBbGwodGhpcy5jdXN0b21lcl91c2VyX2lkKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMubWVzc2FnaW5nU2VydmljZS5zdGFydExpdmVDaGF0KG9uTWVzc2FnZUNhbGxiYWNrKTtcbiAgfVxuXG4gIGxvYWRNb3JlKCkge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICBjb25zdCBsb2FkaW5nU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkTWVzc2FnZXModGhpcy5tZXNzYWdlTGlzdC5sZW5ndGgpXG4gICAgICAuc3Vic2NyaWJlKChsaXN0OiBQcmV2aWV3TWVzc2FnZVtdKSA9PiB7XG4gICAgICAgIHRoaXMubWVzc2FnZUxpc3QgPSBsaXN0LmNvbmNhdCh0aGlzLm1lc3NhZ2VMaXN0KTtcbiAgICAgICAgdGhpcy5hZGROZXdNZXNzYWdlc1BhZ2UobGlzdCk7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGxvYWRpbmdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbG9hZE1lc3NhZ2VzKG9mZnNldCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2luZ1NlcnZpY2UubGlzdChvZmZzZXQsIHRoaXMuY3VzdG9tZXJfdXNlcl9pZClcbiAgICAgIC5waXBlKG1hcCgobGlzdDogU2VydmVyTWVzc2FnZVtdKSA9PiB7XG4gICAgICAgIGxpc3QucmV2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gbGlzdC5tYXAobWVzc2FnZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBpZDogbWVzc2FnZS5pZCxcbiAgICAgICAgICAgICAgY29udGVudDogbWVzc2FnZS5jb250ZW50LFxuICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBtZXNzYWdlLmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgIGlzX3NlbGZfbWVzc2FnZTogbWVzc2FnZS5zZW5kZXIgPT09IHBhcnNlSW50KHNlbGYuc2VuZGVyX3VzZXJfaWQpLFxuICAgICAgICAgICAgICBzZW5kZXJfZGlzcGxheV9uYW1lOiBtZXNzYWdlLnNlbmRlcl9kaXNwbGF5X25hbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSkpO1xuICB9XG5cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMubXNnRGl2cyAmJiB0aGlzLm1zZ0RpdnMubGFzdCkge1xuICAgICAgdGhpcy5tc2dEaXZzLmxhc3QubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgICB0aGlzLm1zZ0RpdnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubXNnRGl2cyAmJiB0aGlzLm1zZ0RpdnMubGFzdCkge1xuICAgICAgICB0aGlzLm1zZ0RpdnMubGFzdC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhZGROZXdNZXNzYWdlKG1zZykge1xuICAgIGlmICh0aGlzLmxhdGVzdE1zZ0RhdGV0aW1lICYmIChuZXcgRGF0ZShtc2cuY3JlYXRlZF9hdC50b1N0cmluZygpKS5nZXRUaW1lKClcbiAgICAgIC0gdGhpcy5sYXRlc3RNc2dEYXRldGltZS5nZXRUaW1lKCkpIC8gNjAwMDAgPCB0aGlzLkdST1VQX01JTl9SQU5HRV9JTl9NSU5VVEVTKSB7XG4gICAgICB0aGlzLmdyb3VwZWRNZXNzYWdlTGlzdFt0aGlzLmdyb3VwZWRNZXNzYWdlTGlzdC5sZW5ndGggLSAxXS5wdXNoKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ3JvdXBlZE1lc3NhZ2VMaXN0LnB1c2goW21zZ10pO1xuICAgIH1cbiAgICB0aGlzLmxhdGVzdE1zZ0RhdGV0aW1lID0gbmV3IERhdGUobXNnLmNyZWF0ZWRfYXQudG9TdHJpbmcoKSk7XG4gIH1cblxuICBhZGROZXdNZXNzYWdlc1BhZ2UobXNnTGlzdDogUHJldmlld01lc3NhZ2VbXSkge1xuICAgIGlmICh0aGlzLm1zZ0RpdnMgJiYgdGhpcy5tc2dEaXZzLmZpcnN0KSB7XG4gICAgICBjb25zdCBmaXJzdERpdiA9IHRoaXMubXNnRGl2cy5maXJzdDtcbiAgICAgIGNvbnN0IG9uTmV3UGFnZUFkZGVkID0gKCkgPT4ge1xuICAgICAgICBmaXJzdERpdi5uYXRpdmVFbGVtZW50LnNjcm9sbEludG9WaWV3KHRydWUpO1xuICAgICAgICB0aGlzLm1zZ3NDb250YWluZXIubmF0aXZlRWxlbWVudC5zY3JvbGxCeSgwLCAtOTApO1xuICAgICAgfTtcbiAgICAgIHRoaXMubXNnc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZCcsIG9uTmV3UGFnZUFkZGVkLCBmYWxzZSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMubXNnc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZCcsIG9uTmV3UGFnZUFkZGVkLCBmYWxzZSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VwaW5nT2JqID0gdGhpcy5ncm91cEJ5VGltZShtc2dMaXN0KTtcbiAgICBpZiAoZ3JvdXBpbmdPYmopIHtcbiAgICAgIHRoaXMuZ3JvdXBlZE1lc3NhZ2VMaXN0ID0gZ3JvdXBpbmdPYmouZ3JvdXBlZExpc3QuY29uY2F0KHRoaXMuZ3JvdXBlZE1lc3NhZ2VMaXN0KTtcbiAgICAgIHRoaXMubGF0ZXN0TXNnRGF0ZXRpbWUgPSBncm91cGluZ09iai5sYXRlc3RNc2dEYXRldGltZTtcbiAgICB9XG5cbiAgfVxuXG4gIGdyb3VwQnlUaW1lKG1zZ0xpc3Q6IFByZXZpZXdNZXNzYWdlW10pIHtcbiAgICBpZiAoIW1zZ0xpc3QubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBncm91cGVkTGlzdCA9IFtdO1xuICAgIGxldCBhZGphY2VudExpc3QgPSBbXTtcbiAgICBsZXQgbGF0ZXN0TXNnRGF0ZXRpbWUgPSBuZXcgRGF0ZShtc2dMaXN0WzBdLmNyZWF0ZWRfYXQudG9TdHJpbmcoKSk7XG4gICAgbXNnTGlzdC5mb3JFYWNoKChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoKG5ldyBEYXRlKG1lc3NhZ2UuY3JlYXRlZF9hdC50b1N0cmluZygpKS5nZXRUaW1lKCkgLSBsYXRlc3RNc2dEYXRldGltZS5nZXRUaW1lKCkpIC8gNjAwMDAgPCB0aGlzLkdST1VQX01JTl9SQU5HRV9JTl9NSU5VVEVTKSB7XG4gICAgICAgIGFkamFjZW50TGlzdC5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICBsYXRlc3RNc2dEYXRldGltZSA9IG5ldyBEYXRlKG1lc3NhZ2UuY3JlYXRlZF9hdC50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyb3VwZWRMaXN0LnB1c2goYWRqYWNlbnRMaXN0KTtcbiAgICAgICAgYWRqYWNlbnRMaXN0ID0gW21lc3NhZ2VdO1xuICAgICAgICBsYXRlc3RNc2dEYXRldGltZSA9IG5ldyBEYXRlKG1lc3NhZ2UuY3JlYXRlZF9hdC50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBncm91cGVkTGlzdC5wdXNoKGFkamFjZW50TGlzdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ3JvdXBlZExpc3QsXG4gICAgICBsYXRlc3RNc2dEYXRldGltZVxuICAgIH07XG4gIH1cblxuICByZXBseSgpIHtcbiAgICB0aGlzLm1lc3NhZ2luZ1NlcnZpY2Uuc2VuZF9tZXNzYWdlKHRoaXMucmVwbHlDb250ZW50LCB0aGlzLnJlY2lwaWVudF91c2VyX2lkKTtcbiAgICB0aGlzLnJlcGx5Q29udGVudCA9ICcnO1xuICAgIHRoaXMubXNnSW5wdXQubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMuZm9jdXNPbklucHV0QWdhaW4uYmluZCh0aGlzKSk7XG4gIH1cblxuICBmb2N1c09uSW5wdXRBZ2FpbihldmVudCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5tc2dJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLm1zZ0lucHV0Lm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLmZvY3VzT25JbnB1dEFnYWluLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgb25TY3JvbGwoZXZlbnQ6IGFueSkge1xuICAgIGlmIChldmVudC50YXJnZXQuc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICB0aGlzLmxvYWRNb3JlKCk7XG4gICAgfVxuICB9XG5cbiAgaXNUb2RheShkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiBkYXRlLmdldERhdGUoKSA9PT0gdG9kYXkuZ2V0RGF0ZSgpICYmXG4gICAgICBkYXRlLmdldE1vbnRoKCkgPT09IHRvZGF5LmdldE1vbnRoKCkgJiZcbiAgICAgIGRhdGUuZ2V0RnVsbFllYXIoKSA9PT0gdG9kYXkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuXG4gIGlzWWVzdGVyZGF5KGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZS50b1N0cmluZygpKTtcbiAgICBsZXQgdG9CZVllc3RlcmRheSA9IG5ldyBEYXRlKCk7XG4gICAgdG9CZVllc3RlcmRheS5zZXREYXRlKHRvQmVZZXN0ZXJkYXkuZ2V0RGF0ZSgpIC0gMSk7XG4gICAgY29uc3QgeWVzdGVyZGF5ID0gdG9CZVllc3RlcmRheTtcbiAgICByZXR1cm4gZGF0ZS5nZXREYXRlKCkgPT09IHllc3RlcmRheS5nZXREYXRlKCkgJiZcbiAgICAgIGRhdGUuZ2V0TW9udGgoKSA9PT0geWVzdGVyZGF5LmdldE1vbnRoKCkgJiZcbiAgICAgIGRhdGUuZ2V0RnVsbFllYXIoKSA9PT0geWVzdGVyZGF5LmdldEZ1bGxZZWFyKCk7XG4gIH1cblxuICBpc1dlZWtEYXkoZGF0ZSkge1xuICAgIGlmICh0aGlzLmlzVG9kYXkoZGF0ZSkgfHwgdGhpcy5pc1llc3RlcmRheShkYXRlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgd2Vla0FnbyA9IG5ldyBEYXRlKCk7XG4gICAgd2Vla0Fnby5zZXREYXRlKHdlZWtBZ28uZ2V0RGF0ZSgpIC0gNyk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUudG9TdHJpbmcoKSkgPiB3ZWVrQWdvO1xuICB9XG5cbiAgZ2V0RGF5TmFtZShkYXRlKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUudG9TdHJpbmcoKSkudG9Mb2NhbGVTdHJpbmcoJ2VuLXVzJywge3dlZWtkYXk6ICdzaG9ydCcgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLm1lc3NhZ2luZ1NlcnZpY2UucmVtb3ZlT25NZXNzYWdlTGlzdGVuZXIoKTtcbiAgfVxuXG59XG4iXX0=