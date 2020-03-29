import {
  Component,
  Input,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  OnInit, OnDestroy
} from '@angular/core';
import {PreviewMessage} from '../models';
import {MessagingService} from './messaging.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerMessage} from '../models';

@Component({
  selector: 'chatty-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnDestroy {

  @ViewChildren('msgDiv') msgDivs: QueryList<ElementRef>;
  @ViewChild('msgsContainer', {static: false}) msgsContainer: ElementRef;

  @Input() sender_avatar_src: string;
  @Input() recipient_avatar_src: number;
  @Input() sender_display_name: string;
  @Input() recipient_display_name: string;
  @Input() sender_user_id: string;
  @Input() recipient_user_id: string;
  @Input() is_customer_view: boolean;
  @Input() height: string;

  customer_user_id: number;

  messageList: PreviewMessage[] = [];

  groupedMessageList: PreviewMessage[][] = [];
  latestMsgDatetime: Date;

  GROUP_MIN_RANGE_IN_MINUTES = 20;
  isFullScreenMode = false;
  showSenderName = true;

  isLoading;

  replyContent = '';

  @ViewChild('msgInput', {static: false}) msgInput: ElementRef;

  constructor(private messagingService: MessagingService) {
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

  ngOnInit(): void {
    // customer_user_id used only if it's staff view
    if(!this.is_customer_view) {
      this.customer_user_id = parseInt(this.recipient_user_id);
    }
    const readAllRequest = this.messagingService.readAll(this.customer_user_id);
    readAllRequest.subscribe();

    const loadMessagesRequest = this.loadMessages(0);
    loadMessagesRequest.subscribe((list: PreviewMessage[]) => {
      this.messageList = list;
      this.addNewMessagesPage(list);
    });

    forkJoin(readAllRequest, loadMessagesRequest).subscribe(() => this.isLoading = false);

    const onMessageCallback = (message) => {
      if (this.messageList.some(el => el.id === message.id)) {
        return;
      }
      if (!this.recipient_user_id || (parseInt(message.sender_user_id) === parseInt(this.recipient_user_id))
        || (parseInt(message.recipient_user_id) === parseInt(this.recipient_user_id))) {
        this.addNewMessage({
          id: message.id,
          content: message.content,
          created_at: message.created_at,
          is_self_message: message.sender_user_id === this.sender_user_id,
          ...this.showSenderName && {sender_display_name: this.sender_display_name}
        });
        this.messageList.push(message);
        // TODO: read this message not all!
        this.messagingService.readAll(this.customer_user_id)
          .subscribe();
      }
    };
    this.messagingService.startLiveChat(onMessageCallback);
  }

  loadMore() {
    this.isLoading = true;
    const loadingSubscription = this.loadMessages(this.messageList.length)
      .subscribe((list: PreviewMessage[]) => {
        this.messageList = list.concat(this.messageList);
        this.addNewMessagesPage(list);
        this.isLoading = false;
        loadingSubscription.unsubscribe();
      });
  }

  loadMessages(offset) {
    const self = this;
    return this.messagingService.list(offset, this.customer_user_id)
      .pipe(map((list: ServerMessage[]) => {
        list.reverse();
        return list.map(message => {
            return {
              id: message.id,
              content: message.content,
              created_at: message.created_at,
              is_self_message: message.sender === parseInt(self.sender_user_id),
              sender_display_name: message.sender_display_name
            };
          }
        );
      }));
  }


  ngAfterViewInit() {
    if (this.msgDivs && this.msgDivs.last) {
      this.msgDivs.last.nativeElement.focus();
    }
    this.msgDivs.changes.subscribe(() => {
      if (this.msgDivs && this.msgDivs.last) {
        this.msgDivs.last.nativeElement.focus();
      }
    });
  }

  addNewMessage(msg) {
    if (this.latestMsgDatetime && (new Date(msg.created_at.toString()).getTime()
      - this.latestMsgDatetime.getTime()) / 60000 < this.GROUP_MIN_RANGE_IN_MINUTES) {
      this.groupedMessageList[this.groupedMessageList.length - 1].push(msg);
    } else {
      this.groupedMessageList.push([msg]);
    }
    this.latestMsgDatetime = new Date(msg.created_at.toString());
  }

  addNewMessagesPage(msgList: PreviewMessage[]) {
    if (this.msgDivs && this.msgDivs.first) {
      const firstDiv = this.msgDivs.first;
      const onNewPageAdded = () => {
        firstDiv.nativeElement.scrollIntoView(true);
        this.msgsContainer.nativeElement.scrollBy(0, -90);
      };
      this.msgsContainer.nativeElement.addEventListener('DOMNodeInserted', onNewPageAdded, false);
      setTimeout(() => this.msgsContainer.nativeElement.removeEventListener('DOMNodeInserted', onNewPageAdded, false));
    }

    const groupingObj = this.groupByTime(msgList);
    if (groupingObj) {
      this.groupedMessageList = groupingObj.groupedList.concat(this.groupedMessageList);
      this.latestMsgDatetime = groupingObj.latestMsgDatetime;
    }

  }

  groupByTime(msgList: PreviewMessage[]) {
    if (!msgList.length) {
      return;
    }
    let groupedList = [];
    let adjacentList = [];
    let latestMsgDatetime = new Date(msgList[0].created_at.toString());
    msgList.forEach((message) => {
      if ((new Date(message.created_at.toString()).getTime() - latestMsgDatetime.getTime()) / 60000 < this.GROUP_MIN_RANGE_IN_MINUTES) {
        adjacentList.push(message);
        latestMsgDatetime = new Date(message.created_at.toString());
      } else {
        groupedList.push(adjacentList);
        adjacentList = [message];
        latestMsgDatetime = new Date(message.created_at.toString());
      }
    });
    groupedList.push(adjacentList);

    return {
      groupedList,
      latestMsgDatetime
    };
  }

  reply() {
    this.messagingService.send_message(this.replyContent, this.recipient_user_id);
    this.replyContent = '';
    this.msgInput.nativeElement.addEventListener('focusout', this.focusOnInputAgain.bind(this));
  }

  focusOnInputAgain(event) {
    setTimeout(() => {
      this.msgInput.nativeElement.focus();
      this.msgInput.nativeElement.removeEventListener('focusout', this.focusOnInputAgain.bind(this));
    });
  }

  onScroll(event: any) {
    if (event.target.scrollTop === 0) {
      this.loadMore();
    }
  }

  isToday(date) {
    date = new Date(date.toString());
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  isYesterday(date) {
    date = new Date(date.toString());
    let toBeYesterday = new Date();
    toBeYesterday.setDate(toBeYesterday.getDate() - 1);
    const yesterday = toBeYesterday;
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  }

  isWeekDay(date) {
    if (this.isToday(date) || this.isYesterday(date)) {
      return false;
    }
    let weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(date.toString()) > weekAgo;
  }

  getDayName(date) {
    return new Date(date.toString()).toLocaleString('en-us', {weekday: 'short' });
  }

  ngOnDestroy() {
    this.messagingService.removeOnMessageListener();
  }

}
