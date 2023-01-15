let stop = true,
    headerIsHidden = false

const hideIconPath = "icons/hyh-hide.png",
      showIconPath = "icons/hyh-show.png",
      defaultIconPath = "icons/hyh-default.png",
      setIcon = (path) => chrome.action.setIcon({ path })

const hideHeaderTitle = "Hide header",
      showHeaderTitle = "Show header",
      unavailableTitle = "Unavailable on this page",
      setExtensionTitle = (title) => chrome.action.setTitle({ title })

function resetState() {
  stop = true
  setIcon(defaultIconPath)
  setExtensionTitle(unavailableTitle)
}

const sendMessageToPopup = (msgObj) => chrome.runtime.sendMessage(msgObj)

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

function onExtensionClick() {
  sendMessageToContent({ hideHeader: !headerIsHidden })
  setIcon(headerIsHidden ? hideIconPath : showIconPath)
  setExtensionTitle(headerIsHidden ? hideHeaderTitle : showHeaderTitle)
  headerIsHidden = !headerIsHidden
}

// request content state and sync with it
sendMessageToContent({ sync: true })

// reset and sync state on tab change
chrome.tabs.onActivated.addListener(() => {
  resetState()
  sendMessageToContent({ sync: true })
})

// messages from content and popup
chrome.runtime.onMessage.addListener(msg => {
  /* content messages */
  if (msg.headerIsHidden === true) {
    headerIsHidden = true
    setIcon(showIconPath)
    setExtensionTitle(showHeaderTitle)

  } else if (msg.headerIsHidden === false) {
    headerIsHidden = false
    setIcon(hideIconPath)
    setExtensionTitle(hideHeaderTitle)
  }

  if (msg.stop === false) {
    stop = false
    setIcon(headerIsHidden ? showIconPath : hideIconPath)
    setExtensionTitle(headerIsHidden ? showHeaderTitle : hideHeaderTitle)

  } else if (msg.stop === true) resetState()

  /* popup messages */
  if (msg.extensionClick === true) {
    sendMessageToPopup({ extensionClickReceived: true, stop })

    if (!stop) onExtensionClick()
  }
})