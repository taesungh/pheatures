enum MessageType {
  error = "error",
  warning = "warning",
  info = "info",
}

class Message {
  type: MessageType;
  title: string;
  detail: string;

  constructor(type: MessageType, title: string, detail: string) {
    this.type = type;
    this.title = title;
    this.detail = detail;
  }

  static notMinimal(): Message {
    return new Message(MessageType.warning, "Selection is not minimal", "...");
  }

  static redundantSelection(): Message {
    return new Message(MessageType.warning, "Unnecessary features selected", "...");
  }

  static redundantChange(): Message {
    return new Message(MessageType.warning, "A feature change is redundant", "...");
  }

  static dependency(): Message {
    return new Message(MessageType.info, "Additional feature changes added", "...");
  }
}

export default Message;
