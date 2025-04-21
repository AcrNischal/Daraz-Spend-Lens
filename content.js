
(async function () {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    
    let totalSpent = 0;
    let currentDisplayed = 0;
    let productImages = [];
    let orderCount = 0;
    let itemCount = 0;
    let pageCount = 1;
    

    // Create popup
    const popup = document.createElement('div');
    popup.id = 'nishchal-popup';
    popup.style = `
        position: fixed;
        z-index: 999999;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.62);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Inter', 'Segoe UI', sans-serif;
        padding: 20px;
        box-sizing: border-box;
        overflow: hidden;
        backdrop-filter: blur(10px);
    `;

    popup.innerHTML = `
        <div style="position: relative; background: #fff; padding: 2rem; border-radius: 1.5rem; max-width: 680px; width: 90%; text-align: center; box-shadow: 0 10px 40px rgba(241,88,41,0.2);">
            <div class="close-btn" style="position: absolute; top: 15px; right: 15px; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.3s ease;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#F15829" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            
            <div id="carousel" style="height: 280px; position: relative; overflow: hidden; border-radius: 12px; margin-bottom: 1.5rem;">
                <div style="position: absolute; inset: 0; background: linear-gradient(45deg, #F15829 0%, #FF6B35 100%); opacity: 0.9;"></div>
                <div id="image-container" style="position: relative; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <img id="active-image" src="" style="max-height: 80%; max-width: 80%; border-radius: 8px; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.5s ease;"/>
                </div>
            </div>

            <div id="scanning-ui">
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="color: #F15829; font-size: 1.8rem; margin: 0 0 0.5rem; font-weight: 700;">
                        <span style="animation: bounce 1s infinite; display: inline-block;">📊</span> 
                        Scanning Your Orders...
                    </h2>
                    <p style="color: #666; margin: 0; font-size: 1rem;">Processing page: <span id="current-page">1</span></p>
                </div>

                <div style="background: #FFF4F1; border-radius: 12px; padding: 1.5rem; position: relative;">
                    <div id="total-price" style="font-size: 2rem; font-weight: 800; color: #F15829;">
                        Rs. 0
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 1rem; color: #888;">
                        <span>Orders: <span id="order-count">0</span></span>
                        <span>Items: <span id="item-count">0</span></span>
                    </div>
                    <div style="height: 4px; background: #FFE5DD; border-radius: 2px; margin-top: 1rem; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: #F15829; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            </div>

            <div id="completed-ui" style="display: none;">
                <div style="margin-bottom: 2rem;">
                    <h2 style="color: #F15829; font-size: 1.8rem; margin: 0 0 1rem; font-weight: 700;">
                        🎉 Congratulations!!! Scan Complete!
                    </h2>
                    <div style="background: #FFF4F1; padding: 1.5rem; border-radius: 12px;">
                        <div style="font-size: 1.5rem; color: #222; margin-bottom: 0.5rem;">
                            Total Spent: <span style="color: #F15829; font-weight: 800;">Rs. 0</span>
                        </div>
                        <div style="color: #666; font-size: 0.9rem;">
                            <div>Orders Processed: <strong>0</strong></div>
                            <div>Items Scanned: <strong>0</strong></div>
                        </div>
                    </div>
                </div>
                <button id="close-btn" style="background: #F15829; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s ease;">
                    Close Summary
                </button>
            </div>

            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .close-btn:hover {
                    background: #FFF4F1;
                    transform: rotate(90deg);
                }
                #close-btn:hover {
                    transform: scale(1.05);
                }
            </style>
        </div>
    `;
    document.body.appendChild(popup);

    // UI Elements
    const scanningUI = popup.querySelector('#scanning-ui');
    const completedUI = popup.querySelector('#completed-ui');
    const currentPageEl = popup.querySelector('#current-page');

    // // Close functionality
    // const closePopup = () => popup.remove();
    // popup.querySelector('.close-btn').addEventListener('click', closePopup);
    // popup.querySelector('#close-btn').addEventListener('click', closePopup);

    const closePopup = () => {
        popup.remove(); // Close the popup first
        window.location.href = "https://www.daraz.com.np"; // Then redirect
    };
    
    popup.querySelector('.close-btn').addEventListener('click', closePopup);
    popup.querySelector('#close-btn').addEventListener('click', closePopup);
    

    // Update counters
    const updateCounters = () => {
        document.getElementById('order-count').textContent = orderCount;
        document.getElementById('item-count').textContent = itemCount;
        currentPageEl.textContent = pageCount;
        document.getElementById('progress-bar').style.width = 
            `${Math.min(100, (pageCount / 50) * 100)}%`;
    };

    const updateTotalAnimated = async (amount) => {
        const totalEl = document.getElementById('total-price');
        const step = Math.ceil((amount - currentDisplayed) / 30);
        while (currentDisplayed < amount) {
            currentDisplayed += step;
            if (currentDisplayed > amount) currentDisplayed = amount;
            totalEl.textContent = `Rs. ${currentDisplayed.toLocaleString()}`;
            await delay(20);
        }
    };

    // Image carousel
    const startImageCarousel = () => {
        const imgEl = document.getElementById('active-image');
        let index = 0;
        
        const updateImage = () => {
            if (productImages.length === 0) return;
            imgEl.style.opacity = 0;
            setTimeout(() => {
                index = (index + 1) % productImages.length;
                imgEl.src = productImages[index];
                imgEl.style.opacity = 1;
            }, 500);
        };

        if (productImages.length > 0) {
            imgEl.src = productImages[0];
            imgEl.style.opacity = 1;
        }
        setInterval(updateImage, 2000);
    };

    // Data extraction
    const extractData = () => {
        const shops = document.querySelectorAll('.shop');
        shops.forEach((shop) => {
            const status = shop.querySelector('.shop-right-status')?.innerText.trim();
            if (status === 'Completed') {
                orderCount++;
                const items = shop.querySelectorAll('.order-item');
                items.forEach((item) => {
                    itemCount++;
                    const priceText = item.querySelector('.item-price')?.innerText || '';
                    const qtyText = item.querySelector('.item-quantity .text:last-child')?.innerText || '1';
                    const img = item.querySelector('img')?.src || '';

                    const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
                    const quantity = parseInt(qtyText.replace(/[^0-9]/g, '')) || 1;
                    totalSpent += price * quantity;

                    if (img) productImages.push(img);
                });
                updateCounters();
            }
        });
    };

    // Start processing
    startImageCarousel();
    let hasMorePages = true;

    while (hasMorePages) {
        window.scrollTo(0, document.body.scrollHeight);
        await delay(1500);
        extractData();
        await updateTotalAnimated(totalSpent);
        
        const nextBtn = document.querySelector('.next-pagination-item.next:not([disabled])');
        if (!nextBtn) {
            hasMorePages = false;
        } else {
            pageCount++;
            nextBtn.click();
            await delay(2500);
        }
    }

    // Show completion UI
    scanningUI.style.display = 'none';
    completedUI.style.display = 'block';
    completedUI.querySelector('span[style*="#F15829"]').textContent = totalSpent.toLocaleString();
    completedUI.querySelectorAll('strong')[0].textContent = orderCount;
    completedUI.querySelectorAll('strong')[1].textContent = itemCount;
    document.querySelector('#active-image').style.opacity = '1';
    await delay(500);
    completedUI.style.opacity = '1';
})();


