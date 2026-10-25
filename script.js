const chatForm = document.querySelector("#chat-form");
const messageInput = document.querySelector("#message-input");
const chatMessages = document.querySelector("#chat-messages");

const responses = [
  {
    matches: ["right now", "immediate", "danger", "unsafe", "follow", "threat", "emergency"],
    reply: "If you may be in immediate danger, move toward a staffed or public place if you can, and contact your local emergency services or someone you trust. If speaking isn’t safe, consider texting a trusted person with your location. Only do what feels safe for you."
  },
  {
    matches: ["plan", "prepare", "safety"],
    reply: "A safety plan can be small and personal: choose a trusted contact and a code word, identify a place you could go, keep essentials accessible if safe, and consider how to protect your privacy on shared devices. You’re in control of what steps feel right."
  },
  {
    matches: ["friend", "someone", "support"],
    reply: "Listen without judgment, believe them, and ask what kind of support they want. Avoid making decisions for them; you could offer to stay with them, help find a trusted local service, or agree on a check-in plan. If there’s immediate danger, contact local emergency services."
  },
  {
    matches: ["report", "police", "legal"],
    reply: "You deserve to choose what happens next. If you want to report, a local support organization may explain your options and help you plan for safety. If you’re in immediate danger, contact your local emergency services."
  },
  {
    matches: ["talk", "sad", "scared", "feel", "anxious", "listen"],
    reply: "I’m sorry this feels difficult. You don’t have to figure everything out at once. Is there someone you trust who could be with you or check in? If you’d like, tell me what kind of support would help right now—only share what feels safe."
  }
];

function addMessage(text, sender) {
  const article = document.createElement("article");
  article.className = `message ${sender}-message`;

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "S";
    article.append(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  const time = document.createElement("time");
  time.dateTime = new Date().toISOString();
  time.textContent = "Just now";

  content.append(paragraph, time);
  article.append(content);
  chatMessages.append(article);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getResponse(message) {
  const normalizedMessage = message.toLowerCase();
  const match = responses.find(({ matches }) =>
    matches.some((keyword) => normalizedMessage.includes(keyword))
  );

  return match?.reply
    ?? "Thanks for sharing that with me. I can help with immediate safety, making a plan, supporting a friend, or finding a next step. What would feel most useful?";
}

function sendMessage(message) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return;

  addMessage(trimmedMessage, "user");
  messageInput.value = "";

  window.setTimeout(() => {
    addMessage(getResponse(trimmedMessage), "bot");
  }, 250);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
  messageInput.focus();
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.message);
    messageInput.focus();
  });
});
