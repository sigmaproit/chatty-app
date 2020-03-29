export interface ServerMessage {
    id: number;
    content: string;
    created_at: Date;
    sender?: any;
    sender_user_id?: number;
    recipient?: any;
    recipient_user_id?: number;
    sender_display_name?: string;
}
export interface PreviewMessage {
    id: number;
    content: string;
    created_at: Date;
    is_self_message: boolean;
    sender_display_name?: string;
}
