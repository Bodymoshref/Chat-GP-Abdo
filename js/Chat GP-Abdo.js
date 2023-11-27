const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");


let userText = null;
const API_KEY = "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"
const initialHeight = chatInput.scrollHeight

const loadDataFromLocalstorage = () => {
    const defaultText = `<div class="default-text">
                            <h1>Chat GP- Abdo</h1>
                            <p>Start A Conversation And Explore The Power Of AI. <br> Your Chat History Will Be Displayed Here.</p>
                        </div>`
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText
    chatContainer.scrollTo(0 , chatContainer.scrollHeight)
}

loadDataFromLocalstorage()

const createElement = (html , className) => {
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat" , className)
    chatDiv.innerHTML = html
    return chatDiv
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions"
    const pElement = document.createElement("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    try {
        const response = await (await fetch(API_URL , requestOptions)).json()
        pElement.textContent = response.choices[0].text.trim()
    } catch(error) {
        pElement.textContent = "Oops! Something Went Wrong While Retrieving The Response. Please Try Again."
    }

    incomingChatDiv.querySelector(".typing-animation").remove()
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement)
    chatContainer.scrollTo(0 , chatContainer.scrollHeight)
    localStorage.setItem("all-chats" , chatContainer.innerHTML)
}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p")
    navigator.clipboard.writeText(responseTextElement.textContent)
    setTimeout(() => copyBtn.textContent = "copied!" , 500)
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                    <img src="./imgs/chatgp- Abdo-logo.jpg" alt="logo" style="border-radius: 50%;">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s;"></div>
                            <div class="typing-dot" style="--delay: 0.3s;"></div>
                            <div class="typing-dot" style="--delay: 0.4s;"></div>
                        </div>
                    </div>
                    <i onclick="copyResponse(this)" class="fa-sharp fa-regular fa-copy fa-lg"></i>
                </div>`
    const incomingChatDiv = createElement(html , "incoming")
    chatContainer.appendChild(incomingChatDiv)
    chatContainer.scrollTo(0 , chatContainer.scrollHeight)
    getChatResponse(incomingChatDiv)
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return
    
    chatInput.value = ""
    chatInput.style.height = `${initialHeight}px`
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./imgs/user_1.png" alt="user-img">
                        <p></p>
                    </div>
                </div>`
    const outgoingChatDiv = createElement(html , "outgoing")
    outgoingChatDiv.querySelector("p").textContent = userText
    document.querySelector(".default-text")?.remove()
    chatContainer.appendChild(outgoingChatDiv)
    chatContainer.scrollTo(0 , chatContainer.scrollHeight)
    setTimeout(showTypingAnimation , 500)
}

themeButton.addEventListener("click" , () => {
    document.body.classList.toggle("light-mode")
    localStorage.setItem("theme-color" , themeButton.innerText)
    if (document.body.classList.contains("light-mode")) {
        themeButton.classList.add("fa-moon")
    } else {
        themeButton.classList.remove("fa-moon")
    }
})

deleteButton.addEventListener("click" , () => {
    if (confirm("Are You Sure... You Want To Delete All Chats...?")) {
        localStorage.removeItem("all-chats")
        loadDataFromLocalstorage()
    }
})

chatInput.addEventListener("input" , () => {
    chatInput.style.height = `${initialHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown" , () => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault()
        handleOutgoingChat()
    }
})

sendButton.addEventListener("click" , handleOutgoingChat)