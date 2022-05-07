import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Message from "pheatures/Message";

interface MessagesProps {
  messages: Message[];
}

function Messages({ messages }: MessagesProps) {
  return (
    <Stack className="messages">
      {messages.map((message, i) => (
        <Alert key={i} severity={message.type}>
          {message.title}
        </Alert>
      ))}
    </Stack>
  );
}

export default Messages;
