export interface GmailMessage {
    id: string;
    threadId: string;
    labelIds?: string[];
    snippet?: string;
    historyId?: string;
    internalDate?: string;
    payload?: MessagePart;
    sizeEstimate?: number;
    raw?: string;
    classificationLabelValues?: ClassificationLabelValue[];
  }
  
  export interface MessagePart {
    partId?: string;
    mimeType?: string;
    filename?: string;
    headers?: MessagePartHeader[];
    body?: MessagePartBody;
    parts?: MessagePart[]; // Recursivo (aninhado)
  }
  
  export interface MessagePartHeader {
    name?: string;
    value?: string;
  }
  
  export interface MessagePartBody {
    attachmentId?: string;
    size?: number;
    data?: string; // Base64url encoded
  }
  
  export interface ClassificationLabelValue {
    name?: string;
    value?: string;
  }

  export interface ListMessagesResponse {
  messages?: GmailMessage[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
}