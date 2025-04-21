(async function () {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  
    const accountBtn = document.querySelector("#myAccountTrigger");
    if (accountBtn) {
      accountBtn.click();
      await delay(600);
  
      const myOrdersBtn = Array.from(document.querySelectorAll("span.account-icon.test.my-orders"))
        .find(el => el.closest("a"));
  
      if (myOrdersBtn) {
        myOrdersBtn.closest("a").click();
        console.log("🚀 Navigated to My Orders page!");
      } else {
        console.error("😵 Nishchal brooo, 'My Orders' button not found!");
      }
    } else {
      console.error("🥲 '#myAccountTrigger' not found!");
    }
  })();
  