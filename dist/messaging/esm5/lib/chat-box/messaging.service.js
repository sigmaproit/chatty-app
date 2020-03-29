/**
 * @fileoverview added by tsickle
 * Generated from: lib/chat-box/messaging.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { stringify } from 'querystring';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var MessagingService = /** @class */ (function () {
    function MessagingService(http, injector, config) {
        var _this = this;
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
        function (message) {
            if (stringify(message.sender_user_id) in _this.unreadMsgsIdsPairs) {
                if (_this.unreadMsgsIdsPairs[stringify(message.sender_user_id)].indexOf(message.id) > -1) {
                    return;
                }
                _this.unreadMsgsIdsPairs[stringify(message.sender_user_id)].push(message.id);
            }
            else {
                _this.unreadMsgsIdsPairs[stringify(message.sender_user_id)] = [message.id];
            }
            _this.incrementTotalUnReadMsgsCount();
            /** @type {?} */
            var unReadPairsArray = _this.unReadMsgsCountsArraySource.getValue();
            /** @type {?} */
            var matchedPairIndex = unReadPairsArray.findIndex((/**
             * @param {?} el
             * @return {?}
             */
            function (el) { return el.sender_user_id === message.sender_user_id; }));
            if (matchedPairIndex !== -1)
                unReadPairsArray[matchedPairIndex].count += 1;
            else
                unReadPairsArray.push({ sender_user_id: message.sender_user_id, count: 1 });
            _this.unReadMsgsCountsArraySource.next(unReadPairsArray);
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
    MessagingService.prototype.initialize = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        this.configObject = config;
    };
    /**
     * @param {?} newCount
     * @return {?}
     */
    MessagingService.prototype.setTotalUnReadMsgsCount = /**
     * @param {?} newCount
     * @return {?}
     */
    function (newCount) {
        this.totalUnReadMsgsCountSource.next(newCount);
    };
    /**
     * @param {?} pairs
     * @return {?}
     */
    MessagingService.prototype.setUnReadMsgsCountsArray = /**
     * @param {?} pairs
     * @return {?}
     */
    function (pairs) {
        this.unReadMsgsCountsArraySource.next(pairs);
    };
    /**
     * @return {?}
     */
    MessagingService.prototype.incrementTotalUnReadMsgsCount = /**
     * @return {?}
     */
    function () {
        this.totalUnReadMsgsCountSource.next(this.totalUnReadMsgsCountSource.getValue() + 1);
    };
    /**
     * @param {?} offset
     * @param {?=} customer_user_id
     * @return {?}
     */
    MessagingService.prototype.list = /**
     * @param {?} offset
     * @param {?=} customer_user_id
     * @return {?}
     */
    function (offset, customer_user_id) {
        if (customer_user_id === void 0) { customer_user_id = null; }
        /** @type {?} */
        var chatUrl;
        if (customer_user_id)
            chatUrl = "" + this.configObject.messages_url + customer_user_id + "/?limit=" + this.configObject.messages_page_size + "&offset=" + offset;
        else
            chatUrl = this.configObject.messages_url + "?limit=" + this.configObject.messages_page_size + "&offset=" + offset;
        return this.http.get(chatUrl).pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        function (resp) {
            return resp.results;
        })));
    };
    /**
     * @param {?} content
     * @param {?=} customer_user_id
     * @return {?}
     */
    MessagingService.prototype.send_message = /**
     * @param {?} content
     * @param {?=} customer_user_id
     * @return {?}
     */
    function (content, customer_user_id) {
        if (customer_user_id === void 0) { customer_user_id = null; }
        this.ws.send(JSON.stringify({
            content: content,
            user_id: customer_user_id
        }));
    };
    /**
     * @param {?=} onMessageCallback
     * @return {?}
     */
    MessagingService.prototype.startLiveChat = /**
     * @param {?=} onMessageCallback
     * @return {?}
     */
    function (onMessageCallback) {
        var _this = this;
        if (onMessageCallback === void 0) { onMessageCallback = null; }
        this.initializeUnReadMessagesCounts();
        /** @type {?} */
        var notificationCB = (/**
         * @param {?} message
         * @return {?}
         */
        function (message) {
            _this.defaultMsgArrivalCallback(message);
            if (onMessageCallback) {
                onMessageCallback(message);
            }
        });
        /** @type {?} */
        var socketCB = (/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            /** @type {?} */
            var message = JSON.parse(event.data).message;
            notificationCB(message);
        });
        if (!this.ws || this.ws.readyState !== this.ws.OPEN)
            this.initializeAutoReconnectingWebSocket(socketCB);
        else
            this.setWebSocketCallbacks(socketCB);
        if (this.pushService) {
            this.setNotificationCallback(notificationCB);
        }
    };
    /**
     * @param {?} onMessageCB
     * @return {?}
     */
    MessagingService.prototype.initializeAutoReconnectingWebSocket = /**
     * @param {?} onMessageCB
     * @return {?}
     */
    function (onMessageCB) {
        var _this = this;
        this.closeLiveChat();
        if (!this.authService.isAuthenticated()) {
            return;
        }
        /** @type {?} */
        var token = this.authService.getToken();
        this.ws = new WebSocket(this.configObject.socket_url + "?token=" + token);
        this.ws.onopen = (/**
         * @return {?}
         */
        function () { return _this.isWebSocketReconnectingSource.next(false); });
        this.setWebSocketCallbacks(onMessageCB);
    };
    /**
     * @private
     * @param {?} onMessageCB
     * @return {?}
     */
    MessagingService.prototype.setWebSocketCallbacks = /**
     * @private
     * @param {?} onMessageCB
     * @return {?}
     */
    function (onMessageCB) {
        var _this = this;
        this.ws.onmessage = onMessageCB;
        this.ws.onclose = (/**
         * @return {?}
         */
        function () {
            _this.isWebSocketReconnectingSource.next(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.initializeAutoReconnectingWebSocket(onMessageCB);
            }), 1000);
        });
        this.ws.onerror = (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            if (!_this.authService.isAuthenticated()) {
                return;
            }
            _this.ws.close();
        });
    };
    /**
     * @private
     * @return {?}
     */
    MessagingService.prototype.initializeUnReadMessagesCounts = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.http.get(this.configObject.messages_url + "unread_messages_count/")
            .subscribe((/**
         * @param {?} countPairs
         * @return {?}
         */
        function (countPairs) {
            _this.setUnReadMsgsCountsArray(countPairs);
            /** @type {?} */
            var totalCount = 0;
            countPairs.forEach((/**
             * @param {?} pair
             * @return {?}
             */
            function (pair) {
                totalCount += pair.count;
            }));
            _this.setTotalUnReadMsgsCount(totalCount);
        }));
    };
    /**
     * @param {?} onMessageCallback
     * @return {?}
     */
    MessagingService.prototype.setNotificationCallback = /**
     * @param {?} onMessageCallback
     * @return {?}
     */
    function (onMessageCallback) {
        /** @type {?} */
        var notificationCB = (/**
         * @param {?} notification
         * @return {?}
         */
        function (notification) {
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
            var message = notification.additionalData.message_dict;
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
    };
    /**
     * @return {?}
     */
    MessagingService.prototype.removeOnMessageListener = /**
     * @return {?}
     */
    function () {
        if (this.ws) {
            this.ws.onmessage = this.defaultMsgArrivalCallback;
        }
        if (this.pushService) {
            this.pushService.setNotificationCallback(this.defaultMsgArrivalCallback);
        }
    };
    /**
     * @return {?}
     */
    MessagingService.prototype.closeLiveChat = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.ws)
            return;
        this.ws.onclose = (/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            delete _this.ws;
        });
        this.ws.close();
    };
    /**
     * @param {?=} customer_user_id
     * @return {?}
     */
    MessagingService.prototype.readAll = /**
     * @param {?=} customer_user_id
     * @return {?}
     */
    function (customer_user_id) {
        var _this = this;
        if (customer_user_id === void 0) { customer_user_id = null; }
        /** @type {?} */
        var readAllUrl;
        if (customer_user_id)
            readAllUrl = "" + this.configObject.messages_url + customer_user_id + "/read_all/";
        else
            readAllUrl = this.configObject.messages_url + "read_all/";
        return this.http.patch(readAllUrl, {})
            .pipe(tap((/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return _this.setTotalUnReadMsgsCount(0); })));
    };
    /**
     * @param {?} customer_user_id
     * @return {?}
     */
    MessagingService.prototype.unreadLatest = /**
     * @param {?} customer_user_id
     * @return {?}
     */
    function (customer_user_id) {
        return this.http.patch("" + this.configObject.messages_url + customer_user_id + "/unread_latest/", {});
    };
    MessagingService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    MessagingService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: Injector },
        { type: undefined, decorators: [{ type: Inject, args: ['config',] }] }
    ]; };
    /** @nocollapse */ MessagingService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function MessagingService_Factory() { return new MessagingService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject("config")); }, token: MessagingService, providedIn: "root" });
    return MessagingService;
}());
export { MessagingService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jaGF0dHktZnJvbnRlbmQvIiwic291cmNlcyI6WyJsaWIvY2hhdC1ib3gvbWVzc2FnaW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQU8sTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFhLGVBQWUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUMvRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7QUFRdEM7SUF1QkUsMEJBQW9CLElBQWdCLEVBQVcsUUFBa0IsRUFBNEIsTUFBVztRQUF4RyxpQkFNQztRQU5tQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUE0QixXQUFNLEdBQU4sTUFBTSxDQUFLO1FBYmhHLCtCQUEwQixHQUFHLElBQUksZUFBZSxDQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFELHlCQUFvQixHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVyRSxnQ0FBMkIsR0FBRyxJQUFJLGVBQWUsQ0FBTSxFQUFFLENBQUMsQ0FBQztRQUM1RCwwQkFBcUIsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFdkUsdUJBQWtCLEdBQUcsRUFBRSxDQUFDO1FBRXhCLGtDQUE2QixHQUFHLElBQUksZUFBZSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLDRCQUF1QixHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQWtCM0UsOEJBQXlCOzs7O1FBQUcsVUFBQyxPQUFP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QUFDLEdBQUc7Ozs7UUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBL0IsQ0FBK0IsRUFBQyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7Ozs7SUFFRCx1Q0FBWTs7OztJQUFaLFVBQWEsZ0JBQWdCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksR0FBRyxnQkFBZ0Isb0JBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEcsQ0FBQzs7Z0JBOU1GLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7Z0JBWk8sVUFBVTtnQkFGVSxRQUFRO2dEQW1Da0MsTUFBTSxTQUFDLFFBQVE7OzsyQkFuQ3JGO0NBMk5DLEFBL01ELElBK01DO1NBNU1ZLGdCQUFnQjs7O0lBRTNCLHVDQUFpQjs7SUFDakIsdUNBQWlCOztJQUVqQiw4QkFBYzs7Ozs7SUFFZCxzREFBaUU7O0lBQ2pFLGdEQUE2RTs7Ozs7SUFFN0UsdURBQW1FOztJQUNuRSxpREFBK0U7Ozs7O0lBRS9FLDhDQUFnQzs7Ozs7SUFFaEMseURBQTRFOztJQUM1RSxtREFBbUY7O0lBRW5GLDREQUErQzs7SUFVL0Msd0NBQWtCOzs7OztJQU1sQixxREFrQkU7Ozs7O0lBaENVLGdDQUF3Qjs7Ozs7SUFBRSxvQ0FBMkI7Ozs7O0lBQUUsa0NBQXFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIEluamVjdG9yLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge3RhcCwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge3N0cmluZ2lmeX0gZnJvbSAncXVlcnlzdHJpbmcnO1xuXG5cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBNZXNzYWdpbmdBdXRoU2VydmljZSB7XG59XG5cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBNZXNzYWdpbmdQdXNoU2VydmljZSB7XG59XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdpbmdTZXJ2aWNlIHtcblxuICBhdXRoU2VydmljZTogYW55O1xuICBwdXNoU2VydmljZTogYW55O1xuXG4gIHdzOiBXZWJTb2NrZXQ7XG5cbiAgcHJpdmF0ZSB0b3RhbFVuUmVhZE1zZ3NDb3VudFNvdXJjZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PigwKTtcbiAgcHVibGljIHRvdGFsVW5SZWFkTXNnc0NvdW50ID0gdGhpcy50b3RhbFVuUmVhZE1zZ3NDb3VudFNvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICBwcml2YXRlIHVuUmVhZE1zZ3NDb3VudHNBcnJheVNvdXJjZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihbXSk7XG4gIHB1YmxpYyB1blJlYWRNc2dzQ291bnRzQXJyYXkgPSB0aGlzLnVuUmVhZE1zZ3NDb3VudHNBcnJheVNvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICBwcml2YXRlIHVucmVhZE1zZ3NJZHNQYWlycyA9IHt9O1xuXG4gIHByaXZhdGUgaXNXZWJTb2NrZXRSZWNvbm5lY3RpbmdTb3VyY2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGlzV2ViU29ja2V0UmVjb25uZWN0aW5nID0gdGhpcy5pc1dlYlNvY2tldFJlY29ubmVjdGluZ1NvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICBub3RpZmljYXRpb25DYWxsYmFja1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSAgaW5qZWN0b3I6IEluamVjdG9yLCBASW5qZWN0KCdjb25maWcnKSBwcml2YXRlIGNvbmZpZzogYW55KSB7XG4gICAgdGhpcy5jb25maWdPYmplY3QgPSBjb25maWc7XG4gICAgdGhpcy5hdXRoU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0PE1lc3NhZ2luZ0F1dGhTZXJ2aWNlPihjb25maWcuYXV0aCBhcyBUeXBlPE1lc3NhZ2luZ0F1dGhTZXJ2aWNlPik7XG4gICAgaWYgKGNvbmZpZy5wdXNoKSB7XG4gICAgICB0aGlzLnB1c2hTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQ8TWVzc2FnaW5nUHVzaFNlcnZpY2U+KGNvbmZpZy5wdXNoIGFzIFR5cGU8TWVzc2FnaW5nUHVzaFNlcnZpY2U+KTtcbiAgICB9XG4gIH1cblxuICBjb25maWdPYmplY3Q6IGFueTtcblxuICBpbml0aWFsaXplKGNvbmZpZykge1xuICAgIHRoaXMuY29uZmlnT2JqZWN0ID0gY29uZmlnO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWZhdWx0TXNnQXJyaXZhbENhbGxiYWNrID0gKG1lc3NhZ2UpID0+IHtcbiAgICBpZiAoc3RyaW5naWZ5KG1lc3NhZ2Uuc2VuZGVyX3VzZXJfaWQpIGluIHRoaXMudW5yZWFkTXNnc0lkc1BhaXJzKSB7XG4gICAgICBpZiAodGhpcy51bnJlYWRNc2dzSWRzUGFpcnNbc3RyaW5naWZ5KG1lc3NhZ2Uuc2VuZGVyX3VzZXJfaWQpXS5pbmRleE9mKG1lc3NhZ2UuaWQpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy51bnJlYWRNc2dzSWRzUGFpcnNbc3RyaW5naWZ5KG1lc3NhZ2Uuc2VuZGVyX3VzZXJfaWQpXS5wdXNoKG1lc3NhZ2UuaWQpO1xuICAgIH0gZWxzZSB7IHRoaXMudW5yZWFkTXNnc0lkc1BhaXJzW3N0cmluZ2lmeShtZXNzYWdlLnNlbmRlcl91c2VyX2lkKV0gPSBbbWVzc2FnZS5pZF07IH1cblxuICAgIHRoaXMuaW5jcmVtZW50VG90YWxVblJlYWRNc2dzQ291bnQoKTtcbiAgICBsZXQgdW5SZWFkUGFpcnNBcnJheTogQXJyYXk8YW55PiA9IHRoaXMudW5SZWFkTXNnc0NvdW50c0FycmF5U291cmNlLmdldFZhbHVlKCk7XG4gICAgY29uc3QgbWF0Y2hlZFBhaXJJbmRleCA9IHVuUmVhZFBhaXJzQXJyYXkuZmluZEluZGV4KGVsID0+IGVsLnNlbmRlcl91c2VyX2lkID09PSBtZXNzYWdlLnNlbmRlcl91c2VyX2lkKTtcbiAgICBpZihtYXRjaGVkUGFpckluZGV4ICE9PSAtMSlcbiAgICAgIHVuUmVhZFBhaXJzQXJyYXlbbWF0Y2hlZFBhaXJJbmRleF0uY291bnQgKz0gMTtcbiAgICBlbHNlXG4gICAgICB1blJlYWRQYWlyc0FycmF5LnB1c2goe3NlbmRlcl91c2VyX2lkOiBtZXNzYWdlLnNlbmRlcl91c2VyX2lkLCBjb3VudDogMX0pO1xuXG4gICAgdGhpcy51blJlYWRNc2dzQ291bnRzQXJyYXlTb3VyY2UubmV4dCh1blJlYWRQYWlyc0FycmF5KTtcbiAgICBjb25zb2xlLmxvZyh1blJlYWRQYWlyc0FycmF5KTtcbiAgfTtcbiAgc2V0VG90YWxVblJlYWRNc2dzQ291bnQobmV3Q291bnQpIHtcbiAgICB0aGlzLnRvdGFsVW5SZWFkTXNnc0NvdW50U291cmNlLm5leHQobmV3Q291bnQpO1xuICB9XG5cbiAgc2V0VW5SZWFkTXNnc0NvdW50c0FycmF5KHBhaXJzKSB7XG4gICAgdGhpcy51blJlYWRNc2dzQ291bnRzQXJyYXlTb3VyY2UubmV4dChwYWlycyk7XG4gIH1cblxuICBpbmNyZW1lbnRUb3RhbFVuUmVhZE1zZ3NDb3VudCgpIHtcbiAgICB0aGlzLnRvdGFsVW5SZWFkTXNnc0NvdW50U291cmNlLm5leHQodGhpcy50b3RhbFVuUmVhZE1zZ3NDb3VudFNvdXJjZS5nZXRWYWx1ZSgpKzEpO1xuICB9XG5cbiAgbGlzdChvZmZzZXQsIGN1c3RvbWVyX3VzZXJfaWQ9bnVsbCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgbGV0IGNoYXRVcmw7XG4gICAgaWYoY3VzdG9tZXJfdXNlcl9pZClcbiAgICAgIGNoYXRVcmwgPSBgJHt0aGlzLmNvbmZpZ09iamVjdC5tZXNzYWdlc191cmx9JHtjdXN0b21lcl91c2VyX2lkfS8/bGltaXQ9JHt0aGlzLmNvbmZpZ09iamVjdC5tZXNzYWdlc19wYWdlX3NpemV9Jm9mZnNldD0ke29mZnNldH1gO1xuICAgIGVsc2VcbiAgICAgIGNoYXRVcmwgPSBgJHt0aGlzLmNvbmZpZ09iamVjdC5tZXNzYWdlc191cmx9P2xpbWl0PSR7dGhpcy5jb25maWdPYmplY3QubWVzc2FnZXNfcGFnZV9zaXplfSZvZmZzZXQ9JHtvZmZzZXR9YDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChjaGF0VXJsKS5waXBlKG1hcCgocmVzcDogYW55KSA9PiB7XG4gICAgICByZXR1cm4gcmVzcC5yZXN1bHRzO1xuICAgIH0pKVxuICB9XG5cbiAgc2VuZF9tZXNzYWdlKGNvbnRlbnQsIGN1c3RvbWVyX3VzZXJfaWQ9bnVsbCkge1xuICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBjb250ZW50OmNvbnRlbnQsXG4gICAgICB1c2VyX2lkOiBjdXN0b21lcl91c2VyX2lkXG4gICAgfSkpO1xuICB9XG5cbiAgc3RhcnRMaXZlQ2hhdChvbk1lc3NhZ2VDYWxsYmFjaz1udWxsKSB7XG4gICAgdGhpcy5pbml0aWFsaXplVW5SZWFkTWVzc2FnZXNDb3VudHMoKTtcbiAgICBjb25zdCBub3RpZmljYXRpb25DQiA9IChtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLmRlZmF1bHRNc2dBcnJpdmFsQ2FsbGJhY2sobWVzc2FnZSk7XG4gICAgICBpZiAob25NZXNzYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgb25NZXNzYWdlQ2FsbGJhY2sobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBzb2NrZXRDQiA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkubWVzc2FnZTtcbiAgICAgIG5vdGlmaWNhdGlvbkNCKG1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICBpZighdGhpcy53cyB8fCB0aGlzLndzLnJlYWR5U3RhdGUgIT09IHRoaXMud3MuT1BFTilcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUF1dG9SZWNvbm5lY3RpbmdXZWJTb2NrZXQoc29ja2V0Q0IpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2V0V2ViU29ja2V0Q2FsbGJhY2tzKHNvY2tldENCKTtcblxuICAgIGlmICh0aGlzLnB1c2hTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnNldE5vdGlmaWNhdGlvbkNhbGxiYWNrKG5vdGlmaWNhdGlvbkNCKTtcbiAgICB9XG5cbiAgfVxuXG4gIGluaXRpYWxpemVBdXRvUmVjb25uZWN0aW5nV2ViU29ja2V0KG9uTWVzc2FnZUNCKSB7XG4gICAgdGhpcy5jbG9zZUxpdmVDaGF0KCk7XG4gICAgaWYgKCF0aGlzLmF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5hdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KGAke3RoaXMuY29uZmlnT2JqZWN0LnNvY2tldF91cmx9P3Rva2VuPSR7dG9rZW59YCk7XG4gICAgdGhpcy53cy5vbm9wZW4gPSAoKSA9PiB0aGlzLmlzV2ViU29ja2V0UmVjb25uZWN0aW5nU291cmNlLm5leHQoZmFsc2UpO1xuICAgIHRoaXMuc2V0V2ViU29ja2V0Q2FsbGJhY2tzKG9uTWVzc2FnZUNCKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0V2ViU29ja2V0Q2FsbGJhY2tzKG9uTWVzc2FnZUNCKSB7XG4gICAgdGhpcy53cy5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2VDQjtcbiAgICB0aGlzLndzLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzV2ViU29ja2V0UmVjb25uZWN0aW5nU291cmNlLm5leHQodHJ1ZSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQXV0b1JlY29ubmVjdGluZ1dlYlNvY2tldChvbk1lc3NhZ2VDQik7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9O1xuICAgIHRoaXMud3Mub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgaWYgKCF0aGlzLmF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplVW5SZWFkTWVzc2FnZXNDb3VudHMoKSB7XG4gICAgdGhpcy5odHRwLmdldChgJHt0aGlzLmNvbmZpZ09iamVjdC5tZXNzYWdlc191cmx9dW5yZWFkX21lc3NhZ2VzX2NvdW50L2ApXG4gICAgICAuc3Vic2NyaWJlKChjb3VudFBhaXJzOiBhbnlbXSkgPT4ge1xuICAgICAgICB0aGlzLnNldFVuUmVhZE1zZ3NDb3VudHNBcnJheShjb3VudFBhaXJzKTtcbiAgICAgICAgbGV0IHRvdGFsQ291bnQgPSAwO1xuICAgICAgICBjb3VudFBhaXJzLmZvckVhY2goKHBhaXIpID0+IHtcbiAgICAgICAgICB0b3RhbENvdW50ICs9IHBhaXIuY291bnQ7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNldFRvdGFsVW5SZWFkTXNnc0NvdW50KHRvdGFsQ291bnQpO1xuICAgICAgfSk7XG4gIH1cblxuICBzZXROb3RpZmljYXRpb25DYWxsYmFjayhvbk1lc3NhZ2VDYWxsYmFjaykge1xuICAgIGNvbnN0IG5vdGlmaWNhdGlvbkNCID0gKG5vdGlmaWNhdGlvbikgPT4ge1xuICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb21tZW50ZWQgY29kZSB3YXMgY29tbWVudGVkIGFzIHRoZSB3cy5yZWFkeXN0YXRlIGluIG1vc3QgdGltZXMgd2hpbGUgYXBwIGluIGJhY2tncm91bmQgZG9lc24ndFxuICAgICAgLy8gZGV0ZWN0IHRoYXQgc29ja2V0IGlzIG5vdCBhY3RpdmUgYW55bW9yZSEgU28gdGhlIGlmIHN0YXRlbWVudCB3b3VsZCBiZSB0cnVlIGFuZCBub3RpZmljYXRpb24gaGFuZGxlciByZXR1cm5zXG4gICAgICAvLyB3aXRob3V0IGRvaW5nIGFueXRoaW5nLCBhbHRob3VnaCB0aGUgc29ja2V0IGlzIG5vdCBkb2luZyBpdHMgam9iISBXZSBtb3ZlZCBhdm9pZGluZyBkdXBsaWNhdGlvbiB0byB0aGVcbiAgICAgIC8vIGNvbXBvbmVudCBjYWxsYmFjayBpdHNlbGYgdXNpbmcgbWVzc2FnZSBpZFxuXG4gICAgICAvLyBpZih0aGlzLndzLnJlYWR5U3RhdGUgPT09IHRoaXMud3MuT1BFTilcbiAgICAgIC8vICAgcmV0dXJuO1xuXG4gICAgICBjb25zdCBtZXNzYWdlID0gbm90aWZpY2F0aW9uLmFkZGl0aW9uYWxEYXRhLm1lc3NhZ2VfZGljdDtcbiAgICAgIGlmKG1lc3NhZ2UpXG4gICAgICAgIG9uTWVzc2FnZUNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICAvLyBXZSBjb21tZW50ZWQgdGhlIGZvbGxvd2luZyBjb2RlIGFuZCBpbnN0ZWFkIHNldCBkaXJlY3RseSBub3RpZmljYXRpb24gY2FsbGJhY2sgYW5kIGNoZWNrIGluc2lkZSBpdCB3aGlsZSB0aGVcbiAgICAvLyB3ZWJzb2NrZXQgaXMgY2xvc2VkIG9yIG5vdCwgYXMgc29tZXRpbWVzIChpbiBpT1MpIG9uY2xvc2UgaXMgbm90IGNhbGxlZCB3aGVuIHRoZSBzb2NrZXQgaXMgZG93biBpbiBiYWNrZ3JvdW5kIGFwcFxuICAgIC8vIG1vZGUsIHNvIGlzV2ViU29ja2V0UmVjb25uZWN0aW5nIHdpbGwgbm90IHVwZGF0ZVxuXG4gICAgLy8gbGV0IHNlbGYgPSB0aGlzO1xuICAgIC8vIHRoaXMubm90aWZpY2F0aW9uQ2FsbGJhY2tTdWJzY3JpcHRpb24gPSB0aGlzLmlzV2ViU29ja2V0UmVjb25uZWN0aW5nLnN1YnNjcmliZSh7XG4gICAgLy8gICBuZXh0KGlzQ2xvc2VkKSB7XG4gICAgLy8gICAgIGlmKGlzQ2xvc2VkKVxuICAgIC8vICAgICAgIHNlbGYucHVzaFNlcnZpY2Uuc2V0Tm90aWZpY2F0aW9uQ2FsbGJhY2sobm90aWZpY2F0aW9uQ0IpO1xuICAgIC8vICAgICBlbHNlIHNlbGYucHVzaFNlcnZpY2UucmVtb3ZlTm90aWZpY2F0aW9uQ2FsbGJhY2sobm90aWZpY2F0aW9uQ0IpO1xuICAgIC8vICAgfSxcbiAgICAvLyB9KTtcbiAgICB0aGlzLnB1c2hTZXJ2aWNlLnNldE5vdGlmaWNhdGlvbkNhbGxiYWNrKG5vdGlmaWNhdGlvbkNCKTtcbiAgfVxuXG4gIHJlbW92ZU9uTWVzc2FnZUxpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLndzKSB7XG4gICAgICB0aGlzLndzLm9ubWVzc2FnZSA9IHRoaXMuZGVmYXVsdE1zZ0Fycml2YWxDYWxsYmFjaztcbiAgICB9XG4gICAgaWYgKHRoaXMucHVzaFNlcnZpY2UpIHtcbiAgICAgIHRoaXMucHVzaFNlcnZpY2Uuc2V0Tm90aWZpY2F0aW9uQ2FsbGJhY2sodGhpcy5kZWZhdWx0TXNnQXJyaXZhbENhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZUxpdmVDaGF0KCkge1xuICAgIGlmKCF0aGlzLndzKSByZXR1cm47XG4gICAgdGhpcy53cy5vbmNsb3NlID0gKGV2ZW50KSA9PiB7XG4gICAgICBkZWxldGUgdGhpcy53cztcbiAgICB9O1xuICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgfVxuXG4gIHJlYWRBbGwoY3VzdG9tZXJfdXNlcl9pZD1udWxsKSB7XG4gICAgbGV0IHJlYWRBbGxVcmw7XG4gICAgaWYoY3VzdG9tZXJfdXNlcl9pZCkgcmVhZEFsbFVybCA9IGAke3RoaXMuY29uZmlnT2JqZWN0Lm1lc3NhZ2VzX3VybH0ke2N1c3RvbWVyX3VzZXJfaWR9L3JlYWRfYWxsL2A7XG4gICAgZWxzZSByZWFkQWxsVXJsID0gYCR7dGhpcy5jb25maWdPYmplY3QubWVzc2FnZXNfdXJsfXJlYWRfYWxsL2A7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wYXRjaChyZWFkQWxsVXJsLCB7fSlcbiAgICAgIC5waXBlKHRhcChldmVudCA9PiB0aGlzLnNldFRvdGFsVW5SZWFkTXNnc0NvdW50KDApKSk7XG4gIH1cblxuICB1bnJlYWRMYXRlc3QoY3VzdG9tZXJfdXNlcl9pZCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAucGF0Y2goYCR7dGhpcy5jb25maWdPYmplY3QubWVzc2FnZXNfdXJsfSR7Y3VzdG9tZXJfdXNlcl9pZH0vdW5yZWFkX2xhdGVzdC9gLCB7fSk7XG4gIH1cbn1cbiJdfQ==