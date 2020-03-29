import { Injector } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export declare interface MessagingAuthService {
}
export declare interface MessagingPushService {
}
export declare class MessagingService {
    private http;
    private injector;
    private config;
    authService: any;
    pushService: any;
    ws: WebSocket;
    private totalUnReadMsgsCountSource;
    totalUnReadMsgsCount: Observable<any>;
    private unReadMsgsCountsArraySource;
    unReadMsgsCountsArray: Observable<any>;
    private unreadMsgsIdsPairs;
    private isWebSocketReconnectingSource;
    isWebSocketReconnecting: Observable<boolean>;
    notificationCallbackSubscription: Subscription;
    constructor(http: HttpClient, injector: Injector, config: any);
    configObject: any;
    initialize(config: any): void;
    private defaultMsgArrivalCallback;
    setTotalUnReadMsgsCount(newCount: any): void;
    setUnReadMsgsCountsArray(pairs: any): void;
    incrementTotalUnReadMsgsCount(): void;
    list(offset: any, customer_user_id?: any): Observable<any>;
    send_message(content: any, customer_user_id?: any): void;
    startLiveChat(onMessageCallback?: any): void;
    initializeAutoReconnectingWebSocket(onMessageCB: any): void;
    private setWebSocketCallbacks;
    private initializeUnReadMessagesCounts;
    setNotificationCallback(onMessageCallback: any): void;
    removeOnMessageListener(): void;
    closeLiveChat(): void;
    readAll(customer_user_id?: any): Observable<Object>;
    unreadLatest(customer_user_id: any): Observable<Object>;
}
