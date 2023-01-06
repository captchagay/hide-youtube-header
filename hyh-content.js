const availablePages = ["/watch"]
const initialPageMarginTop = "var(--ytd-masthead-height,var(--ytd-toolbar-height))"

let stop = true,
    headerIsHidden = false

function hideHeader(bool) {
  const header = document.getElementById("masthead-container"),
        page = document.getElementById("page-manager")

  if (bool) {
    header.style.display = "none"
    page.style.marginTop = "0"
    headerIsHidden = true

  } else {
    header.style.display = "unset"
    page.style.marginTop = initialPageMarginTop
    headerIsHidden = false
  }
}

const sendMessageToPopup = (msgObj) => chrome.runtime.sendMessage(msgObj)

function action() {
  if (availablePages.includes(location.pathname))
    stop = false
  else {
    stop = true
    // restore header if page is not available
    if (headerIsHidden) hideHeader(false)
  }

  sendMessageToPopup({ stop, headerIsHidden })

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.sync) sendMessageToPopup({ stop, headerIsHidden })
    if ([true, false].includes(msg.hideHeader)) hideHeader(msg.hideHeader)
  })
}

document.addEventListener("yt-page-type-changed", action)
if (document.body) action()
else document.addEventListener("DOMContentLoaded", action)