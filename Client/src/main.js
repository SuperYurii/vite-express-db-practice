//The main purpose is to handle the data from the form

//Select the form from the DOM
const guestform = document.getElementById("guestform");

const submithandler = (event) => {
  event.preventDefault();
  const formdata = new FormData(guestform);

  // capture data from the form
  const formValues = Object.fromEntries(formdata);

  fetch("http://localhost:8080/messages", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formValues),
  });
  console.log("Form submitted!", formValues);
  getMessages(); // refresh the message list
  guestform.reset(); // optional: clear the form
};
guestform.addEventListener("submit", submithandler);

//The same way as we fetch the POST route, we also need to fetch the GET route, so we can display the data from the database on the DOM
async function getMessages() {
  const res = await fetch("http://localhost:8080/messages");
  const data = await res.json();
  console.log("Data:", data);
  renderMessages(data);
}

// now we need to show messages on the page
function renderMessages(messages) {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = "";

  if (messages.length === 0) {
    messageContainer.innerHTML = "<p>No messages found.</p>";
    return;
  }

  messages.forEach((msg) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p><strong>${msg.username}</strong> (${msg.email})</p>
      <p>${msg.message}</p>
      <hr/>
      <button class="delete-btn">Delete</button>
    `;
    const button = div.querySelector(".delete-btn");
    button.addEventListener("click", () => {
      deleteMessage(msg.id); // pass message ID
    });
    messageContainer.appendChild(div);
  });
}
getMessages();
// Now we need a button to delete messages
const deleteMessage = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/messages/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete message");

    console.log(`Message ${id} deleted`);
    getMessages(); // refresh the list
  } catch (err) {
    console.error("Delete error:", err);
  }
};
