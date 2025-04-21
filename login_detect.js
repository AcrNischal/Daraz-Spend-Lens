chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "checkLogin") {
      const el = document.querySelector("#myAccountTrigger");
      const text = el?.textContent?.toLowerCase().trim();
      const isLoggedIn = text?.includes("account") || false;
      sendResponse({ loggedIn: isLoggedIn });
    }
    return true;
  });
  