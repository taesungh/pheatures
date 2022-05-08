import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import Message from "pheatures/Message";

import "./Messages.css";

interface MessagesProps {
  messages: Message[];
}

function Messages({ messages }: MessagesProps) {
  return (
    <Stack>
      {messages.map((message, i) => (
        <Alert key={message.title} className="accordion-alert" severity={message.type}>
          <Accordion
            disableGutters
            elevation={0}
            sx={{ background: "none", color: "inherit" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ minHeight: "0", padding: "0" }}
              aria-controls={`panel-content-${i}`}
              id={`panel-header-${i}`}
            >
              {message.title}
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "4px 8px" }}>
              {message.detail}
            </AccordionDetails>
          </Accordion>
        </Alert>
      ))}
    </Stack>
  );
}

export default Messages;
