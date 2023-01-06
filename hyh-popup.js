let stop = true,
    headerIsHidden = false

const hideHeaderText = "hide header",
      showHeaderText = "show header",
      unavailableText = "unavailable"

const btn = document.getElementById("hyh-btn"),
      setBtnText = (text) => btn.textContent = text

function sendMessageToContent(msgObj) {
  chrome.tabs.query(
    // condition: current active tab
    { active: true, currentWindow: true },

    // callback with tabs array param
    (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, msgObj)
      })
    }
  )
}

function onBtnClick() {
  sendMessageToContent({ hideHeader: !headerIsHidden })
  setBtnText(headerIsHidden ? hideHeaderText : showHeaderText)
  headerIsHidden = !headerIsHidden
}

// request content state on popup open and sync with it
sendMessageToContent({ sync: true })

// messages from content
chrome.runtime.onMessage.addListener(msg => {
  if (msg.headerIsHidden === true) {
    headerIsHidden = true
    setBtnText(showHeaderText)

  } else if (msg.headerIsHidden === false) {
    headerIsHidden = false
    setBtnText(hideHeaderText)
  }

  if (msg.stop === false) {
    stop = false
    setBtnText(headerIsHidden ? showHeaderText : hideHeaderText)
    btn.addEventListener("click", onBtnClick)

  } else if (msg.stop === true) {
    stop = true
    setBtnText(unavailableText)
    btn.removeEventListener("click", onBtnClick)
  }
})