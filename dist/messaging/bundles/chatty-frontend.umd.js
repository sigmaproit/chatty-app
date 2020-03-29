(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('@angular/common/http'), require('rxjs/operators'), require('querystring'), require('@angular/platform-browser'), require('@angular/platform-browser/animations'), require('@angular/flex-layout'), require('@angular/material'), require('@angular/material-moment-adapter'), require('@angular/material/core'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('chatty-frontend', ['exports', '@angular/core', '@angular/common', 'rxjs', '@angular/common/http', 'rxjs/operators', 'querystring', '@angular/platform-browser', '@angular/platform-browser/animations', '@angular/flex-layout', '@angular/material', '@angular/material-moment-adapter', '@angular/material/core', '@angular/forms'], factory) :
    (global = global || self, factory(global['chatty-frontend'] = {}, global.ng.core, global.ng.common, global.rxjs, global.ng.common.http, global.rxjs.operators, global.querystring, global.ng.platformBrowser, global.ng.platformBrowser.animations, global.ng['flex-layout'], global.ng.material, global.ng['material-moment-adapter'], global.ng.material.core, global.ng.forms));
}(this, (function (exports, core, common, rxjs, http, operators, querystring, platformBrowser, animations, flexLayout, material, materialMomentAdapter, core$1, forms) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/chat-box/messaging.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var MessagingService = /** @class */ (function () {
        function MessagingService(http, injector, config) {
            var _this = this;
            this.http = http;
            this.injector = injector;
            this.config = config;
            this.totalUnReadMsgsCountSource = new rxjs.BehaviorSubject(0);
            this.totalUnReadMsgsCount = this.totalUnReadMsgsCountSource.asObservable();
            this.unReadMsgsCountsArraySource = new rxjs.BehaviorSubject([]);
            this.unReadMsgsCountsArray = this.unReadMsgsCountsArraySource.asObservable();
            this.unreadMsgsIdsPairs = {};
            this.isWebSocketReconnectingSource = new rxjs.BehaviorSubject(false);
            this.isWebSocketReconnecting = this.isWebSocketReconnectingSource.asObservable();
            this.defaultMsgArrivalCallback = (/**
             * @param {?} message
             * @return {?}
             */
            function (message) {
                if (querystring.stringify(message.sender_user_id) in _this.unreadMsgsIdsPairs) {
                    if (_this.unreadMsgsIdsPairs[querystring.stringify(message.sender_user_id)].indexOf(message.id) > -1) {
                        return;
                    }
                    _this.unreadMsgsIdsPairs[querystring.stringify(message.sender_user_id)].push(message.id);
                }
                else {
                    _this.unreadMsgsIdsPairs[querystring.stringify(message.sender_user_id)] = [message.id];
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
            return this.http.get(chatUrl).pipe(operators.map((/**
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
                .pipe(operators.tap((/**
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        MessagingService.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: core.Injector },
            { type: undefined, decorators: [{ type: core.Inject, args: ['config',] }] }
        ]; };
        /** @nocollapse */ MessagingService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function MessagingService_Factory() { return new MessagingService(core.ɵɵinject(http.HttpClient), core.ɵɵinject(core.INJECTOR), core.ɵɵinject("config")); }, token: MessagingService, providedIn: "root" });
        return MessagingService;
    }());
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
            rxjs.forkJoin(readAllRequest, loadMessagesRequest).subscribe((/**
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
                    _this.addNewMessage(__assign({ id: message.id, content: message.content, created_at: message.created_at, is_self_message: message.sender_user_id === _this.sender_user_id }, _this.showSenderName && { sender_display_name: _this.sender_display_name }));
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
                .pipe(operators.map((/**
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
            { type: core.Component, args: [{
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
            msgDivs: [{ type: core.ViewChildren, args: ['msgDiv',] }],
            msgsContainer: [{ type: core.ViewChild, args: ['msgsContainer', { static: false },] }],
            sender_avatar_src: [{ type: core.Input }],
            recipient_avatar_src: [{ type: core.Input }],
            sender_display_name: [{ type: core.Input }],
            recipient_display_name: [{ type: core.Input }],
            sender_user_id: [{ type: core.Input }],
            recipient_user_id: [{ type: core.Input }],
            is_customer_view: [{ type: core.Input }],
            height: [{ type: core.Input }],
            msgInput: [{ type: core.ViewChild, args: ['msgInput', { static: false },] }]
        };
        return ChatBoxComponent;
    }());
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
    var MY_FORMATS = {
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
    var MaterialImportsModule = /** @class */ (function () {
        function MaterialImportsModule() {
        }
        MaterialImportsModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            material.MatDatepickerModule,
                            material.MatDialogModule,
                            flexLayout.FlexLayoutModule,
                            common.CommonModule,
                            material.MatCardModule,
                            material.MatProgressSpinnerModule,
                            material.MatMenuModule,
                            material.MatIconModule,
                            material.MatToolbarModule,
                            material.MatButtonModule,
                            material.MatFormFieldModule,
                            material.MatInputModule,
                            material.MatSelectModule,
                            material.MatSortModule,
                            material.MatTableModule,
                            material.MatCheckboxModule,
                            material.MatAutocompleteModule,
                            material.MatNativeDateModule,
                            material.MatPaginatorModule,
                            material.MatSidenavModule,
                            material.MatListModule,
                            core$1.MatRippleModule,
                            platformBrowser.BrowserModule,
                            animations.BrowserAnimationsModule,
                            material.MatCardModule,
                            material.MatDialogModule,
                            material.MatButtonModule
                        ],
                        exports: [
                            material.MatDatepickerModule,
                            material.MatDialogModule,
                            flexLayout.FlexLayoutModule,
                            material.MatCardModule,
                            material.MatProgressSpinnerModule,
                            material.MatMenuModule,
                            material.MatIconModule,
                            material.MatToolbarModule,
                            material.MatButtonModule,
                            material.MatFormFieldModule,
                            material.MatInputModule,
                            material.MatSelectModule,
                            material.MatSortModule,
                            material.MatTableModule,
                            material.MatCheckboxModule,
                            material.MatAutocompleteModule,
                            material.MatNativeDateModule,
                            material.MatPaginatorModule,
                            material.MatSidenavModule,
                            material.MatListModule,
                            core$1.MatRippleModule,
                            material.MatDatepickerModule,
                            material.NativeDateModule
                        ],
                        declarations: [],
                        providers: [
                            { provide: core$1.DateAdapter, useClass: materialMomentAdapter.MomentDateAdapter, deps: [core$1.MAT_DATE_LOCALE] },
                            { provide: core$1.MAT_DATE_FORMATS, useValue: MY_FORMATS },
                        ]
                    },] }
        ];
        return MaterialImportsModule;
    }());

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/messaging.module.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var MessagingModule = /** @class */ (function () {
        function MessagingModule() {
        }
        /**
         * @param {?} config
         * @return {?}
         */
        MessagingModule.forRoot = /**
         * @param {?} config
         * @return {?}
         */
        function (config) {
            return {
                ngModule: MessagingModule,
                providers: [MessagingService, { provide: 'config', useValue: config }]
            };
        };
        MessagingModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [ChatBoxComponent],
                        imports: [
                            common.CommonModule,
                            platformBrowser.BrowserModule,
                            MaterialImportsModule,
                            forms.FormsModule
                        ],
                        exports: [ChatBoxComponent],
                        providers: []
                    },] }
        ];
        return MessagingModule;
    }());

    exports.ChatBoxComponent = ChatBoxComponent;
    exports.MessagingModule = MessagingModule;
    exports.MessagingService = MessagingService;
    exports.ɵa = MY_FORMATS;
    exports.ɵb = MaterialImportsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=chatty-frontend.umd.js.map
