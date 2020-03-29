import {Inject, Injectable, Injector, Type} from '@angular/core';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap, map} from 'rxjs/operators';
import {stringify} from 'querystring';


export declare interface MessagingAuthService {
}

export declare interface MessagingPushService {
}
@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  authService: any;
  pushService: any;

  ws: WebSocket;

  private totalUnReadMsgsCountSource = new BehaviorSubject<any>(0);
  public totalUnReadMsgsCount = this.totalUnReadMsgsCountSource.asObservable();

  private unReadMsgsCountsArraySource = new BehaviorSubject<any>([]);
  public unReadMsgsCountsArray = this.unReadMsgsCountsArraySource.asObservable();

  private unreadMsgsIdsPairs = {};

  private isWebSocketReconnectingSource = new BehaviorSubject<boolean>(false);
  public isWebSocketReconnecting = this.isWebSocketReconnectingSource.asObservable();

  notificationCallbackSubscription: Subscription;

  constructor(private http: HttpClient, private  injector: Injector, @Inject('config') private config: any) {
    this.configObject = config;
    this.authService = this.injector.get<MessagingAuthService>(config.auth as Type<MessagingAuthService>);
    if (config.push) {
      this.pushService = this.injector.get<MessagingPushService>(config.push as Type<MessagingPushService>);
    }
  }

  configObject: any;

  initialize(config) {
    this.configObject = config;
  }

  private defaultMsgArrivalCallback = (message) => {
    if (stringify(message.sender_user_id) in this.unreadMsgsIdsPairs) {
      if (this.unreadMsgsIdsPairs[stringify(message.sender_user_id)].indexOf(message.id) > -1) {
        return;
      }
      this.unreadMsgsIdsPairs[stringify(message.sender_user_id)].push(message.id);
    } else { this.unreadMsgsIdsPairs[stringify(message.sender_user_id)] = [message.id]; }

    this.incrementTotalUnReadMsgsCount();
    let unReadPairsArray: Array<any> = this.unReadMsgsCountsArraySource.getValue();
    const matchedPairIndex = unReadPairsArray.findIndex(el => el.sender_user_id === message.sender_user_id);
    if(matchedPairIndex !== -1)
      unReadPairsArray[matchedPairIndex].count += 1;
    else
      unReadPairsArray.push({sender_user_id: message.sender_user_id, count: 1});

    this.unReadMsgsCountsArraySource.next(unReadPairsArray);
    console.log(unReadPairsArray);
  };
  setTotalUnReadMsgsCount(newCount) {
    this.totalUnReadMsgsCountSource.next(newCount);
  }

  setUnReadMsgsCountsArray(pairs) {
    this.unReadMsgsCountsArraySource.next(pairs);
  }

  incrementTotalUnReadMsgsCount() {
    this.totalUnReadMsgsCountSource.next(this.totalUnReadMsgsCountSource.getValue()+1);
  }

  list(offset, customer_user_id=null): Observable<any> {
    let chatUrl;
    if(customer_user_id)
      chatUrl = `${this.configObject.messages_url}${customer_user_id}/?limit=${this.configObject.messages_page_size}&offset=${offset}`;
    else
      chatUrl = `${this.configObject.messages_url}?limit=${this.configObject.messages_page_size}&offset=${offset}`;
    return this.http.get(chatUrl).pipe(map((resp: any) => {
      return resp.results;
    }))
  }

  send_message(content, customer_user_id=null) {
    this.ws.send(JSON.stringify({
      content:content,
      user_id: customer_user_id
    }));
  }

  startLiveChat(onMessageCallback=null) {
    this.initializeUnReadMessagesCounts();
    const notificationCB = (message) => {
      this.defaultMsgArrivalCallback(message);
      if (onMessageCallback) {
        onMessageCallback(message);
      }
    };
    const socketCB = (event) => {
      const message = JSON.parse(event.data).message;
      notificationCB(message);
    };

    if(!this.ws || this.ws.readyState !== this.ws.OPEN)
      this.initializeAutoReconnectingWebSocket(socketCB);
    else
      this.setWebSocketCallbacks(socketCB);

    if (this.pushService) {
      this.setNotificationCallback(notificationCB);
    }

  }

  initializeAutoReconnectingWebSocket(onMessageCB) {
    this.closeLiveChat();
    if (!this.authService.isAuthenticated()) {
      return;
    }
    const token = this.authService.getToken();
    this.ws = new WebSocket(`${this.configObject.socket_url}?token=${token}`);
    this.ws.onopen = () => this.isWebSocketReconnectingSource.next(false);
    this.setWebSocketCallbacks(onMessageCB);
  }

  private setWebSocketCallbacks(onMessageCB) {
    this.ws.onmessage = onMessageCB;
    this.ws.onclose = () => {
      this.isWebSocketReconnectingSource.next(true);
      setTimeout(() => {
        this.initializeAutoReconnectingWebSocket(onMessageCB);
      }, 1000);
    };
    this.ws.onerror = (error) => {
      if (!this.authService.isAuthenticated()) {
        return;
      }
      this.ws.close();
    };
  }

  private initializeUnReadMessagesCounts() {
    this.http.get(`${this.configObject.messages_url}unread_messages_count/`)
      .subscribe((countPairs: any[]) => {
        this.setUnReadMsgsCountsArray(countPairs);
        let totalCount = 0;
        countPairs.forEach((pair) => {
          totalCount += pair.count;
        });
        this.setTotalUnReadMsgsCount(totalCount);
      });
  }

  setNotificationCallback(onMessageCallback) {
    const notificationCB = (notification) => {
      // The following commented code was commented as the ws.readystate in most times while app in background doesn't
      // detect that socket is not active anymore! So the if statement would be true and notification handler returns
      // without doing anything, although the socket is not doing its job! We moved avoiding duplication to the
      // component callback itself using message id

      // if(this.ws.readyState === this.ws.OPEN)
      //   return;

      const message = notification.additionalData.message_dict;
      if(message)
        onMessageCallback(message);
    };

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

  removeOnMessageListener() {
    if (this.ws) {
      this.ws.onmessage = this.defaultMsgArrivalCallback;
    }
    if (this.pushService) {
      this.pushService.setNotificationCallback(this.defaultMsgArrivalCallback);
    }
  }

  closeLiveChat() {
    if(!this.ws) return;
    this.ws.onclose = (event) => {
      delete this.ws;
    };
    this.ws.close();
  }

  readAll(customer_user_id=null) {
    let readAllUrl;
    if(customer_user_id) readAllUrl = `${this.configObject.messages_url}${customer_user_id}/read_all/`;
    else readAllUrl = `${this.configObject.messages_url}read_all/`;
    return this.http.patch(readAllUrl, {})
      .pipe(tap(event => this.setTotalUnReadMsgsCount(0)));
  }

  unreadLatest(customer_user_id) {
    return this.http.patch(`${this.configObject.messages_url}${customer_user_id}/unread_latest/`, {});
  }
}
