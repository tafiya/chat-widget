(function () {
  class MyWidget {
    constructor(options = {}) {
      this.userID = options.userId || "687f180b3c54c79b362fa409";
      this.sessionID = options.sessionId || "301613e3322c979773ef4638fcad7548";
      this.baseUrl = options.baseUrl || "http://localhost:5000/api";
      this.socketUrl = options.socketUrl || "http://localhost:5000";
    }

    async init() {
      this.injectHTML();
      this.addEventListeners();
      await this.initChatLogic();
    }

    injectHTML() {
      const container = document.createElement("div");
      container.innerHTML = `
        <!-- welcome div -->
        <div id="welcomeDiv" style="display:none; position:absolute; right:20px;">
            <div
                style="background:#03a84e; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 15px rgba(0,0,0,0.3); overflow:hidden; border-radius:16px; width:500px; height:578px;">
                <div
                    style="display:flex; flex-direction:column; align-items:center; row-gap:12px; padding-top:16px; padding-left:24px; padding-right:24px;">
                    <svg width="32" height="32" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 2C7 2 2 6 2 11c0 5.25 5.5 10 10 10s10-4.75 10-10c0-5-5-9-10-9zm1 14H11v-2h2v2zm0-4H11V7h2v5z" />
                    </svg>
                    <h2 style="font-size:30px; text-align:center; color:white; font-weight:600;">Welcome to tawk.to</h2>
                    <p style="font-size:18px; color:white;">Search our KB or start a chat. We're here to help 24x7.</p>
                    <div id="chatBtn"
                        style="background:white; cursor:pointer; color:black; height:80px; border-radius:12px; display:flex; padding-left:16px; padding-right:16px; justify-content:space-between; align-items:center; width:100%;">
                        <div>
                            <h2 style="font-size:18px; font-weight:700;">New Conversation</h2>
                            <p style="font-size:14px; color:#6b7280;">We typically reply in a few minutes</p>
                        </div>
                        <button style="cursor:pointer;">
                            <svg width="24" height="24" fill="#16a34a" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M3.4 20.4L20.9 12 3.4 3.6v5.7L14.4 12l-11 2.7v5.7z" />
                            </svg>
                        </button>
                    </div>
                    <!-- help center -->
                    <div
                        style="background:white; color:black; height:128px; border-radius:12px; padding:16px; width:100%;">
                        <h2 style="font-size:18px; font-weight:700;">Help Center</h2>
                        <div style="position:relative;">
                            <input
                                style="appearance:none; border:1px solid #d1d5db; padding-left:40px; border-radius:6px; width:100%; padding-top:16px; padding-bottom:16px; padding-left:12px; padding-right:12px; color:#374151; font-size:16px;"
                                type="text" placeholder="Search KB for answer" />
                            <div
                                style="position:absolute; right:10px; top:0; bottom:0; display:flex; align-items:center;">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    style="width:20px; height:20px; margin-left:12px; color:#9ca3af;" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style="background:white; height:48px; display:flex; justify-content:space-around; padding-left:40px; padding-right:40px; padding-top:12px; padding-bottom:12px; border-bottom-left-radius:12px; border-bottom-right-radius:12px;">
                    <button style="cursor:pointer;" id="welcomeBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25"
                            viewBox="0 0 50 50">
                            <path
                                d="M 24.962891 1.0546875 A 1.0001 1.0001 0 0 0 24.384766 1.2636719 L 1.3847656 19.210938 A 1.0005659 1.0005659 0 0 0 2.6152344 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.384766 20.789062 A 1.0005657 1.0005657 0 1 0 48.615234 19.210938 L 41 13.269531 L 41 6 L 35 6 L 35 8.5859375 L 25.615234 1.2636719 A 1.0001 1.0001 0 0 0 24.962891 1.0546875 z M 25 3.3222656 L 44 18.148438 L 44 45 L 32 45 L 32 26 L 18 26 L 18 45 L 6 45 L 6 18.148438 L 25 3.3222656 z M 37 8 L 39 8 L 39 11.708984 L 37 10.146484 L 37 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z">
                            </path>
                        </svg>
                    </button>
                    <button style="cursor:pointer;" id="messageBtn">
                        <img width="25" height="25" src="https://img.icons8.com/ios/50/chat-message--v1.png"
                            alt="chat-message--v1" />
                    </button>
                </div>
            </div>
        </div>

        <!-- message page -->
        <div id="messageDiv" style="display:none; position:absolute; right:20px;">
            <div
                style="width:500px; height:578px; display:flex; flex-direction:column; background:white; border-radius:16px; box-shadow:0 10px 15px rgba(0,0,0,0.3); overflow:hidden;">
                <!-- Header -->
                <div
                    style="background:#16a34a; color:white; display:flex; align-items:center; gap:32px; padding-left:16px; padding-right:16px; padding-top:12px; padding-bottom:12px;">
                    <button style="font-size:20px;" id="backBtn"><svg width="24" height="24" fill="white"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M15.5 19l-7-7 7-7" />
                        </svg></button>


                    <h2 style="font-size:20px; font-weight:600; color:white;">Messages</h2>
                </div>
                <!-- Content Area -->
                <div style="flex:1; padding:16px; display:flex; flex-direction:column; row-gap:16px;">
                    <h2 style="font-size:20px; font-weight:600; color:black;">Start a new chat</h2>
                    <div id="chatBtn2"
                        style="background:white; border:1px solid #e5e7eb; color:black; height:80px; border-radius:12px; display:flex; padding-left:16px; padding-right:16px; justify-content:space-between; align-items:center; width:100%; cursor:pointer;">
                        <div>
                            <h2 style="font-size:18px; font-weight:700;">New Conversation</h2>
                            <p style="font-size:14px; color:#6b7280;">We typically reply in a few minutes</p>
                        </div>
                        <button style="cursor:pointer;">
                            <svg width="24" height="24" fill="#16a34a" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M3.4 20.4L20.9 12 3.4 3.6v5.7L14.4 12l-11 2.7v5.7z" />
                            </svg>
                        </button>
                    </div>
                    <h2 style="font-size:20px; font-weight:600; color:black;">Recent</h2>
                    <div>
                        <p style="font-size:16px; color:#6b7280; text-align:center;">No recent conversations</p>
                    </div>
                </div>
                <div
                    style="background:white; height:48px; position:relative; box-shadow:0 2px 10px rgba(0,0,0,0.1); display:flex; justify-content:space-around; padding-left:40px; padding-right:40px; padding-top:12px; padding-bottom:12px; border-bottom-left-radius:12px; border-bottom-right-radius:12px;">
                    <button style="cursor:pointer;" id="welcomeBtn2">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25"
                            viewBox="0 0 50 50">
                            <path
                                d="M 24.962891 1.0546875 A 1.0001 1.0001 0 0 0 24.384766 1.2636719 L 1.3847656 19.210938 A 1.0005659 1.0005659 0 0 0 2.6152344 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.384766 20.789062 A 1.0005657 1.0005657 0 1 0 48.615234 19.210938 L 41 13.269531 L 41 6 L 35 6 L 35 8.5859375 L 25.615234 1.2636719 A 1.0001 1.0001 0 0 0 24.962891 1.0546875 z M 25 3.3222656 L 44 18.148438 L 44 45 L 32 45 L 32 26 L 18 26 L 18 45 L 6 45 L 6 18.148438 L 25 3.3222656 z M 37 8 L 39 8 L 39 11.708984 L 37 10.146484 L 37 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z">
                            </path>
                        </svg>
                        <!-- 
                        <img src="home.png" alt=""> -->
                    </button>
                    <button style="cursor:pointer;" id="messageBtn2">
                        <img width="25" height="25" src="https://img.icons8.com/ios/50/chat-message--v1.png"
                            alt="chat-message--v1" />
                    </button>
                </div>
            </div>
        </div>

        <!-- chat form -->
        <div id="chatDiv" style="display:none; position:absolute; right:20px;">
            <div
                style="width:500px; height:578px; display:flex; flex-direction:column; background:white; border-radius:16px; box-shadow:0 10px 15px rgba(0,0,0,0.3); overflow:hidden;">

                <!-- Header -->
                <div
                    style="background:#16a34a; color:white; display:flex; justify-content:space-between; align-items:center; padding:12px 16px;">
                    <button style="font-size:20px; cursor:pointer;" id="chatBackBtn">
                        <svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M15.5 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button style="font-size:20px;">&#9776;</button>
                </div>

                <!-- Chat Messages (fills remaining space) -->
                <div id="messages"
                    style="flex:1; overflow-y:auto; border:1px solid #e5e7eb; padding:16px; display:flex; flex-direction:column; row-gap:8px; box-sizing:border-box;">
                </div>

                <!-- Input Area -->
                <div style="display:flex; align-items:center; padding:8px 16px;">
                    <input id="messageInput" type="text" placeholder="Type a message..."
                        style="flex:1; padding:8px 12px; border-radius:8px; outline:none;" />
                    <div style="display:flex; column-gap:12px; margin-left:8px; color:#6b7280; font-size:18px;">
                        <button style="font-size:20px;">
                            <img width="20" height="20" src="https://img.icons8.com/sf-regular/48/link.png"
                                alt="link" />
                        </button>
                        <button style="font-size:20px;">
                            <img width="20" height="20"
                                src="https://img.icons8.com/material-outlined/50/facebook-like.png"
                                alt="facebook-like" />
                        </button>
                        <button style="font-size:20px;">
                            <img width="20" height="20" src="https://img.icons8.com/fluency/48/happy.png" alt="happy" />
                        </button>
                        <button id="sendBtn" style="font-size:20px; cursor:pointer;">
                            <svg width="24" height="24" fill="#16a34a" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M3.4 20.4L20.9 12 3.4 3.6v5.7L14.4 12l-11 2.7v5.7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
        <!-- Open chat button -->
        <div style="position:fixed; bottom:0; right:0; margin:8px;">
            <button id="openChatBtn"
                style="background:#16a34a; padding:10px; border-radius:50%; transition:all 0.3s ease;">
                <div id="openID">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30"
                        viewBox="0,0,256,256">
                        <g fill="#f8f8f8" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                            font-family="none" font-weight="none" font-size="none" text-anchor="none"
                            style="mix-blend-mode: normal">
                            <g transform="scale(5.12,5.12)">
                                <path
                                    d="M25,4c-12.68359,0 -23,8.97266 -23,20c0,6.1875 3.33594,12.06641 8.94922,15.83984c-0.13281,1.05078 -0.66406,3.60156 -2.76562,6.58594l-1.10547,1.56641l1.97656,0.00781c5.42969,0 9.10156,-3.32812 10.30859,-4.60547c1.83203,0.40234 3.72656,0.60547 5.63672,0.60547c12.68359,0 23,-8.97266 23,-20c0,-11.02734 -10.31641,-20 -23,-20z">
                                </path>
                            </g>
                        </g>
                    </svg>
                </div>
                <div id="closeID" style="display: none;">
                    <svg width="30" height="30" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 26L32 38L44 26" stroke="white" stroke-width="6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>

                </div>

                <!-- <img id="chatIcon" src="close.png" alt="Open chat" style="width:24px; height:24px;" /> -->
            </button>
        </div>
      `;
      document.body.appendChild(container);
    }

    addEventListeners() {
      const welcomeDiv = document.getElementById("welcomeDiv");
      const messageDiv = document.getElementById("messageDiv");
      const chatDiv = document.getElementById("chatDiv");
      const openChatBtn = document.getElementById("openChatBtn");
      const chatIcon = document.getElementById("chatIcon");
      const openToggleDiv = document.getElementById("openID");
      const closeToggleDiv = document.getElementById("closeID");

      openChatBtn.addEventListener("click", () => {
        console.log("hi");
        const isAnyOpen =
          welcomeDiv.style.display !== "none" ||
          messageDiv.style.display !== "none" ||
          chatDiv.style.display !== "none";

        if (isAnyOpen) {
          welcomeDiv.style.display = "none";
          messageDiv.style.display = "none";
          chatDiv.style.display = "none";
          openToggleDiv.style.display = "block";
          closeToggleDiv.style.display = "none";
        } else {
          welcomeDiv.style.display = "block";
          openToggleDiv.style.display = "none";
          closeToggleDiv.style.display = "block";
        }
      });

      document.getElementById("messageBtn").addEventListener("click", () => {
        welcomeDiv.style.display = "none";
        messageDiv.style.display = "block";
      });
      document.getElementById("messageBtn2").addEventListener("click", () => {
        welcomeDiv.style.display = "none";
        messageDiv.style.display = "block";
      });
      document.getElementById("welcomeBtn").addEventListener("click", () => {
        messageDiv.style.display = "none";
        welcomeDiv.style.display = "block";
      });
      document.getElementById("welcomeBtn2").addEventListener("click", () => {
        messageDiv.style.display = "none";
        welcomeDiv.style.display = "block";
      });
      document.getElementById("backBtn").addEventListener("click", () => {
        messageDiv.style.display = "none";
        welcomeDiv.style.display = "block";
      });

      document.getElementById("chatBtn").addEventListener("click", () => {
        welcomeDiv.style.display = "none";
        messageDiv.style.display = "none";
        chatDiv.style.display = "flex";
      });
      document.getElementById("chatBtn2").addEventListener("click", () => {
        welcomeDiv.style.display = "none";
        messageDiv.style.display = "none";
        chatDiv.style.display = "flex";
      });
      document.getElementById("chatBackBtn").addEventListener("click", () => {
        chatDiv.style.display = "none";
        welcomeDiv.style.display = "block";
      });
    }

    async initChatLogic() {
      const messagesDiv = document.getElementById("messages");
      const input = document.getElementById("messageInput");
      const sendBtn = document.getElementById("sendBtn");
      const socket = io(this.socketUrl);
      let sessionId = this.sessionID; // FIXED
      const userId = this.userID;
      const BASE_URL = this.baseUrl;

      async function getSingleUser(userId) {
        const res = await fetch(`${BASE_URL}/users/singleUser/${userId}`);
        return res.json();
      }

      async function getConversation(sessionId) {
        const res = await fetch(
          `${BASE_URL}/conversation/singleConversation/${sessionId}`
        );
        return res.json();
      }

      async function sendMessageAPI(data) {
        const res = await fetch(`${BASE_URL}/conversation/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return res.json();
      }

      // Load user & session
      const userData = await getSingleUser(userId);
      if (userData.user) sessionId = userData.user.sessionId;

      // Load existing conversation
      const convData = await getConversation(sessionId);
      if (convData.conversation) {
        convData.conversation.messages.forEach((msg) => appendMessage(msg));
      }

      socket.emit("join", sessionId);

      socket.on("admin-reply", (data) => {
        if (data.sessionId === sessionId)
          appendMessage({ sender: "admin", text: data.text });
      });

      socket.on("admin-status", (data) => {
        appendMessage({ sender: "status", text: data.message });
      });

      const sendMessage = async () => {
        const message = input.value.trim();
        if (!message) return;

        appendMessage({ sender: "user", text: message });
        const res = await sendMessageAPI({ sessionId, userId, message });

        if (res.status === "bot_replied") {
          appendMessage({ sender: "bot", text: res.reply });
        }
        input.value = "";
      };

      sendBtn.addEventListener("click", sendMessage);
      input.addEventListener(
        "keypress",
        (e) => e.key === "Enter" && sendMessage()
      );

      function appendMessage(msg) {
        const div = document.createElement("div");
        if (msg.sender === "status") {
          div.style.textAlign = "center";
          div.style.fontWeight = "500";
          div.style.color = msg.text.includes("online") ? "green" : "red";
          div.innerText = msg.text;
        } else {
          const isOwn = msg.sender === "user";
          div.style.padding = "8px";
          div.style.borderRadius = "8px";
          div.style.maxWidth = "70%";
          div.style.marginTop = "4px";
          div.style.marginBottom = "4px";
          if (isOwn) {
            div.style.background = "#cffafe";
            div.style.marginLeft = "auto";
            div.style.textAlign = "right";
          } else {
            div.style.background = "#ecfccb";
            div.style.marginRight = "auto";
            div.style.textAlign = "left";
          }
          div.innerHTML = `<strong>${msg.sender}</strong>: ${msg.text}`;
        }
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }
  }

  window.MyWidget = MyWidget;
})();
