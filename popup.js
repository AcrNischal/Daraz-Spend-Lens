
// Enhanced URL validation
function isDarazWebsite(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.endsWith('daraz.com') || 
           hostname.endsWith('daraz.com.np'); // Add other Daraz domains if needed
  } catch {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const isValid = tab.url && isDarazWebsite(tab.url);

    // Hide all sections initially
    document.getElementById('scan-section').style.display = 'none';
    document.getElementById('not-daraz-section').style.display = 'none';
    document.getElementById('login-daraz-section').style.display = 'none';

    if (!isValid) {
      document.getElementById('not-daraz-section').style.display = 'block';
      return;
    }

    // If we're on Daraz, check login status
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["login_detect.js"]
    });

    // Send message to content script to check login status
    const response = await chrome.tabs.sendMessage(tab.id, { action: "checkLogin" });
    
    if (response && response.loggedIn) {
      document.getElementById('scan-section').style.display = 'block';
    } else {
      document.getElementById('login-daraz-section').style.display = 'block';
    }

  } catch (error) {
    console.error('Extension error:', error);
    // If we can't communicate with content script, show login section
    if (isValid) {
      document.getElementById('login-daraz-section').style.display = 'block';
    } else {
      document.getElementById('not-daraz-section').style.display = 'block';
    }
  }
});

// Scan button handler
// document.getElementById("start-scan").addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["content.js"],
//   });
// });

document.getElementById("start-scan").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // First script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["nagivate_order.js"], 
  });

  // Wait for 5 seconds before executing the second
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"], 
    });
  }, 4000);
});

