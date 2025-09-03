// Update time display
function updateTime() {
    const timeElement = document.querySelector('.time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    timeElement.textContent = timeString;
}

// Helper function to get the highest z-index among visible windows
function getHighestZIndex() {
    const windows = document.querySelectorAll('.app-window, .browser-window, .music-player, .web-browser');
    let highest = 1000;
    windows.forEach(window => {
        if (window.style.display === 'block' || window.style.display === 'flex') {
            const zIndex = parseInt(window.style.zIndex) || 1000;
            if (zIndex > highest) {
                highest = zIndex;
            }
        }
    });
    return highest;
}

// Update time every second
setInterval(updateTime, 1000);
updateTime();

// Auto-open applications when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto-open meme folder when page loads
    setTimeout(() => {
        const memeWindow = document.getElementById('meme-window');
        if (memeWindow) {
            console.log('Auto-opening meme folder...');
            
            memeWindow.style.display = 'block';
            memeWindow.style.zIndex = getHighestZIndex() + 1;
            setupWindowControls(memeWindow);
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('meme-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'meme-window');
            }
            
            console.log('Meme folder auto-opened successfully');
        }
    }, 1500); // Delay to ensure everything is loaded
});

// Add click handlers for desktop icons
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const tooltip = this.getAttribute('data-tooltip');
        console.log(`Clicked: ${tooltip}`);
        
        console.log(`Icon clicked: ${tooltip}`); // Debug log
        // Add a visual feedback effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Handle app window clicks
        const appWindows = {
            'Trading Terminal': 'trading-window',
            'Rug Scanner': 'scanner-window',
            'MSN Messenger': 'messenger-window',
            'Meme Folder': 'meme-window',
            'Media Player': 'media-window',
            'Degen Mode': 'degen-window',
            'Netscape Navigator': 'netscape-window'
        };
        
        if (appWindows[tooltip]) {
            const window = document.getElementById(appWindows[tooltip]);
            if (window) {
                console.log(`Opening window: ${tooltip}`); // Debug log
                
                // Special handling for browser
                if (tooltip === 'Netscape Navigator') {
                    window.style.display = 'flex';
                    window.style.zIndex = getHighestZIndex() + 1;
                    setupWindowControls(window);
                    
                    console.log('Netscape Navigator opened');
                    console.log('Browser element:', window);
                    console.log('Browser display:', window.style.display);
                    console.log('Browser z-index:', window.style.zIndex);
                    
                    // Add to taskbar
                    const appName = getAppNameFromWindowId(appWindows[tooltip]);
                    if (appName) {
                        addTab(appName);
                        openWindows.set(appName, appWindows[tooltip]);
                    }
                    return;
                }
                
                // Check if window is already open
                if (window.style.display === 'block' || window.style.display === 'flex') {
                    // If already open, bring to front
                    window.style.zIndex = getHighestZIndex() + 1;
                    console.log(`Window already open, bringing to front`); // Debug log
                    
                    // Update active tab
                    const appName = getAppNameFromWindowId(appWindows[tooltip]);
                    if (appName) {
                        focusWindow(appName);
                    }
                } else {
                    // If closed, open it
                    if (tooltip === 'Media Player') {
                        window.style.display = 'flex';
                    } else {
                        window.style.display = 'block';
                    }
                    window.style.zIndex = getHighestZIndex() + 1;
                    console.log(`Window opened successfully`); // Debug log
                    
                    // Add to taskbar
                    const appName = getAppNameFromWindowId(appWindows[tooltip]);
                    if (appName) {
                        addTab(appName);
                        openWindows.set(appName, appWindows[tooltip]);
                    }
                    
                    // Initialize Music Player if it's the Media Player
                    if (tooltip === 'Media Player') {
                        // Simple initialization - just make sure it's visible
                        console.log('Media Player opened');
                        console.log('Media Player element:', window);
                        console.log('Media Player display:', window.style.display);
                        console.log('Media Player z-index:', window.style.zIndex);
                    }
                    
                    // Initialize AI Chat Bots if it's MSN Messenger
                    if (tooltip === 'MSN Messenger') {
                        initializeAIChatBots();
                    }
                    
                    // Setup window controls for app windows (but not for music player)
                    if ((window.classList.contains('app-window') || window.classList.contains('browser-window')) && !window.classList.contains('music-player')) {
                        setupWindowControls(window);
                    }
                }
            } else {
                console.log(`Window element not found: ${appWindows[tooltip]}`); // Debug log
            }
        } else if (tooltip === 'Twitter') {
            // Handle Twitter redirect
            const twitterUrl = this.getAttribute('data-url');
            if (twitterUrl) {
                console.log(`Redirecting to Twitter: ${twitterUrl}`);
                window.open(twitterUrl, '_blank');
            } else {
                console.log('No Twitter URL found');
            }
        } else {
            console.log(`No window mapping found for tooltip: ${tooltip}`); // Debug log
        }
    });
});

// Add hover effects for taskbar icons
document.querySelectorAll('.taskbar-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Start button functionality
document.querySelector('.start-button').addEventListener('click', function() {
    console.log('Start button clicked!');
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});



// Function to setup window controls - moved to global scope
function setupWindowControls(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return;
        
        const closeBtn = window.querySelector('.window-btn.close, .browser-btn.close');
        const minimizeBtn = window.querySelector('.window-btn.minimize, .browser-btn.minimize');
        const maximizeBtn = window.querySelector('.window-btn.maximize, .browser-btn.maximize');
        const titleBar = window.querySelector('.window-title-bar, .browser-title-bar');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                window.style.display = 'none';
                // Remove from taskbar
                const appName = getAppNameFromWindowId(windowId);
                if (appName) {
                    removeTab(appName);
                    openWindows.delete(appName);
                }
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function() {
                // Store the original transform for restoration
                const originalTransform = window.style.transform || 'translate(-50%, -50%)';
                window.style.transform = 'translate(-50%, 100%)';
                setTimeout(() => {
                    window.style.display = 'none';
                    window.style.transform = originalTransform;
                }, 300);
            });
        }
        
        if (maximizeBtn) {
            // Disable maximize for media window
            if (windowId === 'media-window') {
                maximizeBtn.style.display = 'none';
                return;
            }
            
            let isMaximized = false;
            maximizeBtn.addEventListener('click', function() {
                if (!isMaximized) {
                    window.style.width = '95%';
                    window.style.height = '90%';
                    window.style.top = '5%';
                    window.style.left = '2.5%';
                    window.style.transform = 'none';
                    isMaximized = true;
                } else {
                    window.style.width = window.classList.contains('browser-window') ? '800px' : '400px';
                    window.style.height = window.classList.contains('browser-window') ? '600px' : '300px';
                    window.style.top = '50%';
                    window.style.left = '50%';
                    window.style.transform = 'translate(-50%, -50%)';
                    isMaximized = false;
                }
            });
        }
        
        // Draggable functionality
        if (titleBar) {
            let isDragging = false;
            let startX;
            let startY;
            let windowStartX;
            let windowStartY;
            
            titleBar.addEventListener('mousedown', function(e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                // Get window's current position
                const rect = window.getBoundingClientRect();
                windowStartX = rect.left;
                windowStartY = rect.top;
                
                titleBar.style.cursor = 'grabbing';
                
                // Bring window to front when clicked
                window.style.zIndex = getHighestZIndex() + 1;
            });
            
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    e.preventDefault();
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    const newX = windowStartX + deltaX;
                    const newY = windowStartY + deltaY;
                    
                    // Update window position using absolute positioning
                    window.style.position = 'absolute';
                    window.style.top = newY + 'px';
                    window.style.left = newX + 'px';
                    window.style.transform = 'none';
                }
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    titleBar.style.cursor = 'grab';
                }
            });
            
            // Add grab cursor to title bar
            titleBar.style.cursor = 'grab';
        }
        
        // Click anywhere on window to bring to front
        window.addEventListener('mousedown', function() {
            window.style.zIndex = getHighestZIndex() + 1;
        });
    }

// App window controls setup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization');
    console.log('This should appear in the browser console');
    
    // Setup controls for all windows
    const allWindows = [
        'trading-window', 'scanner-window', 'messenger-window', 
        'meme-window', 'twitter-window', 'media-window', 'degen-window', 'netscape-window'
    ];
    
    allWindows.forEach(setupWindowControls);
    
    // Global audio enablement on first user interaction
    let audioEnabled = false;
    const enableAudioGlobally = () => {
        if (!audioEnabled) {
            audioEnabled = true;
            const audioPlayer = document.getElementById('audio-player');
            if (audioPlayer) {
                audioPlayer.play().catch(() => {});
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', enableAudioGlobally);
            document.removeEventListener('keydown', enableAudioGlobally);
            document.removeEventListener('touchstart', enableAudioGlobally);
        }
    };
    
    document.addEventListener('click', enableAudioGlobally);
    document.addEventListener('keydown', enableAudioGlobally);
    document.addEventListener('touchstart', enableAudioGlobally);
    
    // Tab switching functionality for browser and twitter
    const browserWindow = document.getElementById('netscape-window');
    const twitterWindow = document.getElementById('twitter-window');
    
    if (browserWindow) {
        const tabs = browserWindow.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Navigation buttons functionality
        const navButtons = browserWindow.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log(`Clicked: ${this.textContent}`);
                // Add visual feedback
                this.style.background = '#d0d0d0';
                setTimeout(() => {
                    this.style.background = '';
                }, 200);
            });
        });
    }
    
    if (twitterWindow) {
        const twitterTabs = twitterWindow.querySelectorAll('.tab');
        twitterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                twitterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Interactive features for other windows
    const degenWindow = document.getElementById('degen-window');
    if (degenWindow) {
        const spinBtn = degenWindow.querySelector('.spin-btn');
        if (spinBtn) {
            spinBtn.addEventListener('click', function() {
                const reels = degenWindow.querySelectorAll('.slot-reel');
                const symbols = ['🎰', '💎', '🚀', '🌙', '💰', '🏆'];
                
                reels.forEach((reel, index) => {
                    setTimeout(() => {
                        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                        reel.textContent = randomSymbol;
                    }, index * 200);
                });
                
                // Update stats
                const stats = degenWindow.querySelectorAll('.stat span');
                if (stats.length >= 3) {
                    const wins = parseInt(stats[0].textContent.split(':')[1]) || 0;
                    const losses = parseInt(stats[1].textContent.split(':')[1]) || 0;
                    
                    if (Math.random() > 0.5) {
                        stats[0].textContent = `Wins: ${wins + 1}`;
                    } else {
                        stats[1].textContent = `Losses: ${losses + 1}`;
                    }
                }
            });
        }
    }
    
    // Media player controls
    const mediaWindow = document.getElementById('media-window');
    if (mediaWindow) {
        const playBtn = mediaWindow.querySelector('.play');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                if (this.textContent === '▶️') {
                    this.textContent = '⏸️';
                } else {
                    this.textContent = '▶️';
                }
            });
        }
    }
    
    // Rug scanner functionality
    const scannerWindow = document.getElementById('scanner-window');
    if (scannerWindow) {
        const scanBtn = scannerWindow.querySelector('.scan-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', function() {
                const input = scannerWindow.querySelector('.scan-input');
                if (input && input.value.trim()) {
                    // Simulate scanning
                    scanBtn.textContent = 'Scanning...';
                    setTimeout(() => {
                        scanBtn.textContent = 'Scan';
                        // Results are already shown in HTML
                    }, 2000);
                }
            });
        }
    }
    
    // Trading Terminal Live Animations
    const tradingWindow = document.getElementById('trading-window');
    if (tradingWindow) {
        let isTradingActive = false;
        
        // Function to generate random price change
        function generatePriceChange(basePrice) {
            const changePercent = (Math.random() - 0.5) * 0.02; // ±1% max change
            const newPrice = basePrice * (1 + changePercent);
            return newPrice.toFixed(6);
        }
        
        // Function to fetch real-time prices
        async function fetchRealPrices() {
            if (!isTradingActive) return;
            
            try {
                // Fetch real prices from CoinGecko API
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
                const data = await response.json();
                
                // Update SOL price
                if (data.solana) {
                    const solPrice = data.solana.usd;
                    const solChange = data.solana.usd_24h_change;
                    const solPriceElement = document.getElementById('sol-price');
                    const solChangeElement = document.getElementById('sol-change');
                    
                    if (solPriceElement && solChangeElement) {
                        solPriceElement.textContent = `$${solPrice.toFixed(2)}`;
                        if (solChange > 0) {
                            solChangeElement.textContent = `↗ ${solChange.toFixed(2)}%`;
                            solChangeElement.className = 'ticker-change positive';
                        } else {
                            solChangeElement.textContent = `↘ ${Math.abs(solChange).toFixed(2)}%`;
                            solChangeElement.className = 'ticker-change negative';
                        }
                    }
                }
                
                // Update BTC price
                if (data.bitcoin) {
                    const btcPrice = data.bitcoin.usd;
                    const btcChange = data.bitcoin.usd_24h_change;
                    const btcPriceElement = document.getElementById('btc-price');
                    const btcChangeElement = document.getElementById('btc-change');
                    
                    if (btcPriceElement && btcChangeElement) {
                        btcPriceElement.textContent = `$${btcPrice.toFixed(2)}`;
                        if (btcChange > 0) {
                            btcChangeElement.textContent = `↗ ${btcChange.toFixed(2)}%`;
                            btcChangeElement.className = 'ticker-change positive';
                        } else {
                            btcChangeElement.textContent = `↘ ${Math.abs(btcChange).toFixed(2)}%`;
                            btcChangeElement.className = 'ticker-change negative';
                        }
                    }
                }
                
                // Update ETH price
                if (data.ethereum) {
                    const ethPrice = data.ethereum.usd;
                    const ethChange = data.ethereum.usd_24h_change;
                    const ethPriceElement = document.getElementById('eth-price');
                    const ethChangeElement = document.getElementById('eth-change');
                    
                    if (ethPriceElement && ethChangeElement) {
                        ethPriceElement.textContent = `$${ethPrice.toFixed(2)}`;
                        if (ethChange > 0) {
                            ethChangeElement.textContent = `↗ ${ethChange.toFixed(2)}%`;
                            ethChangeElement.className = 'ticker-change positive';
                        } else {
                            ethChangeElement.textContent = `↘ ${Math.abs(ethChange).toFixed(2)}%`;
                            ethChangeElement.className = 'ticker-change negative';
                        }
                    }
                }
                
                // For DREAM token (since it's not on CoinGecko, we'll simulate realistic movement)
                const dreamPriceElement = document.getElementById('dream-price');
                const dreamChangeElement = document.getElementById('dream-change');
                if (dreamPriceElement && dreamChangeElement) {
                    const currentDreamPrice = parseFloat(dreamPriceElement.textContent.replace('$', ''));
                    const dreamChange = (Math.random() - 0.5) * 2; // ±1% max change
                    const newDreamPrice = currentDreamPrice * (1 + dreamChange / 100);
                    
                    dreamPriceElement.textContent = `$${newDreamPrice.toFixed(6)}`;
                    if (dreamChange > 0) {
                        dreamChangeElement.textContent = `↗ ${dreamChange.toFixed(2)}%`;
                        dreamChangeElement.className = 'ticker-change positive';
                    } else {
                        dreamChangeElement.textContent = `↘ ${Math.abs(dreamChange).toFixed(2)}%`;
                        dreamChangeElement.className = 'ticker-change negative';
                    }
                }
                
            } catch (error) {
                console.log('Error fetching real prices:', error);
            }
        }
        
        // Function to update ticker prices (fallback)
        function updateTickerPrices() {
            if (!isTradingActive) return;
            
            const tickerItems = tradingWindow.querySelectorAll('.ticker-item');
            tickerItems.forEach(item => {
                const priceElement = item.querySelector('.ticker-price');
                const changeElement = item.querySelector('.ticker-change');
                
                if (priceElement && changeElement) {
                    const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
                    const newPrice = generatePriceChange(currentPrice);
                    const changePercent = ((newPrice - currentPrice) / currentPrice * 100).toFixed(2);
                    
                    // Animate price change
                    priceElement.style.color = '#ffff00';
                    setTimeout(() => {
                        priceElement.textContent = `$${newPrice}`;
                        priceElement.style.color = '#00FF00';
                    }, 100);
                    
                    // Update change indicator
                    if (changePercent > 0) {
                        changeElement.textContent = `↗ ${changePercent}%`;
                        changeElement.className = 'ticker-change positive';
                    } else {
                        changeElement.textContent = `↘ ${Math.abs(changePercent)}%`;
                        changeElement.className = 'ticker-change negative';
                    }
                }
            });
        }
        
        // Function to update order book
        function updateOrderBook() {
            if (!isTradingActive) return;
            
            const orderRows = tradingWindow.querySelectorAll('.order-row');
            orderRows.forEach((row, index) => {
                const priceElement = row.querySelector('.order-price');
                const amountElement = row.querySelector('.order-amount');
                const totalElement = row.querySelector('.order-total');
                
                if (priceElement && amountElement && totalElement) {
                    // Get current SOL price from ticker
                    const solPriceElement = document.getElementById('sol-price');
                    let basePrice = 416.00; // Default fallback
                    
                    if (solPriceElement && solPriceElement.textContent !== 'Loading...') {
                        basePrice = parseFloat(solPriceElement.textContent.replace('$', ''));
                    }
                    
                    // Generate realistic order book prices around current SOL price
                    const priceOffset = (index - 2.5) * 0.1; // Spread orders around current price
                    const newPrice = (basePrice + priceOffset).toFixed(2);
                    const newAmount = Math.floor(Math.random() * 400) + 100; // 100-500 range
                    const newTotal = Math.floor(parseFloat(newPrice) * newAmount);
                    
                    // Animate changes
                    priceElement.style.color = '#ffff00';
                    amountElement.style.color = '#ffff00';
                    totalElement.style.color = '#ffff00';
                    
                    setTimeout(() => {
                        priceElement.textContent = newPrice;
                        amountElement.textContent = newAmount;
                        totalElement.textContent = newTotal;
                        priceElement.style.color = '#00FF00';
                        amountElement.style.color = '#00FF00';
                        totalElement.style.color = '#00FF00';
                    }, 150);
                }
            });
        }
        
        // Function to update portfolio values
        function updatePortfolio() {
            if (!isTradingActive) return;
            
            const portfolioItems = tradingWindow.querySelectorAll('.portfolio-item');
            portfolioItems.forEach(item => {
                const valueElement = item.querySelector('.asset-value');
                const changeElement = item.querySelector('.asset-change');
                
                if (valueElement && changeElement) {
                    const currentValue = parseFloat(valueElement.textContent.replace('$', '').replace(',', ''));
                    const changePercent = (Math.random() - 0.5) * 0.1; // ±5% max change
                    const newValue = currentValue * (1 + changePercent);
                    const newChangePercent = (changePercent * 100).toFixed(1);
                    
                    // Animate value change
                    valueElement.style.color = '#ffff00';
                    setTimeout(() => {
                        valueElement.textContent = `$${newValue.toLocaleString()}`;
                        valueElement.style.color = '#00FF00';
                        
                        if (newChangePercent > 0) {
                            changeElement.textContent = `+${newChangePercent}%`;
                            changeElement.className = 'asset-change positive';
                        } else {
                            changeElement.textContent = `${newChangePercent}%`;
                            changeElement.className = 'asset-change negative';
                        }
                    }, 200);
                }
            });
        }
        
        // Function to add new trades
        function addNewTrade() {
            if (!isTradingActive) return;
            
            const tradesContent = tradingWindow.querySelector('.trades-content');
            if (tradesContent) {
                const tradeTypes = ['BUY', 'SELL'];
                const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
                const amount = Math.floor(Math.random() * 100) + 1;
                const price = (Math.random() * 50 + 400).toFixed(2);
                const value = (amount * parseFloat(price)).toFixed(0);
                const time = new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                const newTrade = document.createElement('div');
                newTrade.className = `trade-item ${tradeType.toLowerCase()}`;
                newTrade.innerHTML = `
                    <span class="trade-action">${tradeType}</span>
                    <span class="trade-details">${amount} @ $${price}</span>
                    <span class="trade-time">${time}</span>
                    <span class="trade-value ${tradeType === 'BUY' ? 'positive' : 'negative'}">${tradeType === 'BUY' ? '+' : '-'}$${value}</span>
                `;
                
                // Add with animation
                newTrade.style.opacity = '0';
                newTrade.style.transform = 'translateY(-10px)';
                tradesContent.insertBefore(newTrade, tradesContent.firstChild);
                
                setTimeout(() => {
                    newTrade.style.transition = 'all 0.3s ease';
                    newTrade.style.opacity = '1';
                    newTrade.style.transform = 'translateY(0)';
                }, 50);
                
                // Remove old trades if too many
                const allTrades = tradesContent.querySelectorAll('.trade-item');
                if (allTrades.length > 8) {
                    allTrades[allTrades.length - 1].remove();
                }
            }
        }
        
        // Function to update chart stats
        function updateChartStats() {
            if (!isTradingActive) return;
            
            const statValues = tradingWindow.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const currentValue = parseFloat(stat.textContent.replace('$', '').replace('M', '000000'));
                const changePercent = (Math.random() - 0.5) * 0.05; // ±2.5% max change
                const newValue = currentValue * (1 + changePercent);
                
                // Animate stat change
                stat.style.color = '#ffff00';
                setTimeout(() => {
                    if (stat.textContent.includes('M')) {
                        stat.textContent = `$${(newValue / 1000000).toFixed(3)}M`;
                    } else {
                        stat.textContent = `$${newValue.toFixed(2)}`;
                    }
                    stat.style.color = '#00FF00';
                }, 300);
            });
        }
        
        // Start live trading when window opens
        let tradingIntervals = [];
        
        // Paper Trading State
        let paperTrading = {
            balance: 10000.00,
            solHoldings: 0.00,
            trades: []
        };

        // Function to update portfolio display
        function updatePortfolioDisplay() {
            const balanceElement = document.getElementById('portfolio-balance');
            const holdingsElement = document.getElementById('sol-holdings');
            
            console.log('Updating portfolio display:', {
                balance: paperTrading.balance,
                solHoldings: paperTrading.solHoldings,
                balanceElement: balanceElement,
                holdingsElement: holdingsElement
            });
            
            if (balanceElement) {
                balanceElement.textContent = `$${paperTrading.balance.toFixed(2)}`;
            }
            if (holdingsElement) {
                holdingsElement.textContent = `${paperTrading.solHoldings.toFixed(4)} SOL`;
            }
        }

        // Function to execute paper trade
        function executePaperTrade(type, amount) {
            const currentPrice = parseFloat(document.getElementById('sol-price').textContent.replace('$', '').replace(',', ''));
            if (isNaN(currentPrice)) return;

            const tradeValue = amount * currentPrice;
            
            if (type === 'buy') {
                if (paperTrading.balance >= tradeValue) {
                    paperTrading.balance -= tradeValue;
                    paperTrading.solHoldings += amount;
                    
                    // Add trade to history
                    paperTrading.trades.push({
                        type: 'BUY',
                        amount: amount,
                        price: currentPrice,
                        value: tradeValue,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    
                    // Show success message
                    showTradeNotification(`Bought ${amount} SOL at $${currentPrice.toFixed(2)}`, 'success');
                } else {
                    showTradeNotification('Insufficient balance!', 'error');
                }
            } else if (type === 'sell') {
                console.log('Sell trade attempt:', {
                    currentHoldings: paperTrading.solHoldings,
                    sellAmount: amount,
                    hasEnough: paperTrading.solHoldings >= amount
                });
                
                if (paperTrading.solHoldings >= amount) {
                    paperTrading.balance += tradeValue;
                    paperTrading.solHoldings -= amount;
                    
                    console.log('After sell:', {
                        newBalance: paperTrading.balance,
                        newHoldings: paperTrading.solHoldings
                    });
                    
                    // Add trade to history
                    paperTrading.trades.push({
                        type: 'SELL',
                        amount: amount,
                        price: currentPrice,
                        value: tradeValue,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    
                    // Show success message
                    showTradeNotification(`Sold ${amount.toFixed(4)} SOL at $${currentPrice.toFixed(2)}`, 'success');
                } else {
                    showTradeNotification('Insufficient SOL holdings!', 'error');
                }
            }
            
            try {
                updatePortfolioDisplay();
                updateTradeHistory();
            } catch (error) {
                console.error('Error updating portfolio display:', error);
            }
        }

        // Function to show trade notifications
        function showTradeNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `trade-notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                background: ${type === 'success' ? '#00ff00' : '#ff0000'};
                color: ${type === 'success' ? '#000' : '#fff'};
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Function to update trade history
        function updateTradeHistory() {
            const tradeHistory = document.getElementById('trade-history');
            if (!tradeHistory) {
                console.log('Trade history element not found - skipping update');
                return;
            }
            
            tradeHistory.innerHTML = '';
            
            // Show last 5 trades
            const recentTrades = paperTrading.trades.slice(-5).reverse();
            recentTrades.forEach(trade => {
                const tradeDiv = document.createElement('div');
                tradeDiv.className = 'trade-item';
                tradeDiv.innerHTML = `
                    <span class="trade-time">${trade.timestamp}</span>
                    <span class="trade-type ${trade.type.toLowerCase()}">${trade.type}</span>
                    <span class="trade-amount">${trade.amount.toFixed(4)} SOL</span>
                    <span class="trade-price">$${trade.price.toFixed(2)}</span>
                `;
                tradeHistory.appendChild(tradeDiv);
            });
        }
        
        // Function to start live trading
        function startLiveTrading() {
            if (!isTradingActive) {
                isTradingActive = true;
                
                // Clear any existing intervals
                tradingIntervals.forEach(interval => clearInterval(interval));
                tradingIntervals = [];
                
                // Setup trade buttons
                setupTradeButtons();
                
                // Initialize portfolio display
                updatePortfolioDisplay();
                
                // Fetch real prices immediately
                fetchRealPrices();
                
                // Start live updates
                tradingIntervals.push(setInterval(fetchRealPrices, 10000)); // Every 10 seconds for real prices
                tradingIntervals.push(setInterval(updateTickerPrices, 3000)); // Every 3 seconds for fallback
                tradingIntervals.push(setInterval(updateOrderBook, 4000)); // Every 4 seconds
                tradingIntervals.push(setInterval(updatePortfolio, 5000)); // Every 5 seconds
                tradingIntervals.push(setInterval(addNewTrade, 6000)); // Every 6 seconds
                tradingIntervals.push(setInterval(updateChartStats, 7000)); // Every 7 seconds
                
                // Initial updates
                setTimeout(updateTickerPrices, 1000);
                setTimeout(updateOrderBook, 1500);
                setTimeout(updatePortfolio, 2000);
                setTimeout(addNewTrade, 2500);
                setTimeout(updateChartStats, 3000);
            }
        }
        
        // Monitor for window display changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (tradingWindow.style.display === 'block' && !isTradingActive) {
                        setTimeout(startLiveTrading, 500); // Start after window is fully visible
                    }
                    
                    // Initialize Degen Mode when window opens
                    const degenWindow = document.getElementById('degen-window');
                    if (degenWindow && degenWindow.style.display === 'block') {
                        setTimeout(initializeDegenMode, 500);
                    }
                    
                    // Initialize Rug Scanner when window opens
                    const scannerWindow = document.getElementById('scanner-window');
                    if (scannerWindow && scannerWindow.style.display === 'block') {
                        setTimeout(initializeRugScanner, 500);
                    }
                }
            });
        });
        
        observer.observe(tradingWindow, { attributes: true });
        
        // Also observe scanner window
        const scannerWindow = document.getElementById('scanner-window');
        if (scannerWindow) {
            observer.observe(scannerWindow, { attributes: true });
        }
        
        // Stop live trading when window closes
        const closeBtn = tradingWindow.querySelector('.window-btn.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                isTradingActive = false;
                // Clear all intervals
                tradingIntervals.forEach(interval => clearInterval(interval));
                tradingIntervals = [];
            });
        }
        
        // Function to setup BUY and SELL buttons
        function setupTradeButtons() {
            const buyBtn = tradingWindow.querySelector('#buy-btn');
            const sellBtn = tradingWindow.querySelector('#sell-btn');
            const percentBtns = tradingWindow.querySelectorAll('.percent-btn');
            
            console.log('Setting up trade buttons...'); // Debug log
            
            // Setup percentage buttons
            let selectedPercent = 25; // Default to 25%
            
            percentBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    percentBtns.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    selectedPercent = parseInt(this.getAttribute('data-percent'));
                    console.log('Selected percentage:', selectedPercent);
                });
            });
            
            // Set default active button
            if (percentBtns[0]) {
                percentBtns[0].classList.add('active');
            }
            
            if (buyBtn) {
                console.log('Buy button found'); // Debug log
                
                buyBtn.style.cursor = 'pointer';
                buyBtn.style.zIndex = '9999';
                buyBtn.addEventListener('click', function(e) {
                    console.log('Buy button clicked'); // Debug log
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get current SOL price
                    const currentPrice = parseFloat(document.getElementById('sol-price').textContent.replace('$', '').replace(',', ''));
                    if (isNaN(currentPrice)) {
                        showTradeNotification('Unable to get current price!', 'error');
                        return;
                    }
                    
                    // Calculate amount based on selected percentage of portfolio balance
                    const amount = (paperTrading.balance * selectedPercent / 100) / currentPrice;
                    
                    console.log('Paper Trade - Amount:', amount.toFixed(4), 'Price:', currentPrice, 'Percent:', selectedPercent);
                    
                    // Visual feedback
                    buyBtn.style.background = '#00ff00';
                    buyBtn.style.color = '#000';
                    buyBtn.textContent = 'BUYING...';
                    
                    // Execute paper trade
                    setTimeout(() => {
                        executePaperTrade('buy', amount);
                        
                        buyBtn.style.background = '#00ff00';
                        buyBtn.style.color = '#000';
                        buyBtn.textContent = 'BUY SUCCESS!';
                        
                        // Reset after 2 seconds
                        setTimeout(() => {
                            buyBtn.style.background = '';
                            buyBtn.style.color = '';
                            buyBtn.textContent = 'BUY';
                        }, 2000);
                    }, 500);
                });
            } else {
                console.log('Buy button not found'); // Debug log
            }
            
            if (sellBtn) {
                console.log('Sell button found'); // Debug log
                
                sellBtn.style.cursor = 'pointer';
                sellBtn.style.zIndex = '9999';
                sellBtn.addEventListener('click', function(e) {
                    console.log('Sell button clicked'); // Debug log
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get current SOL price
                    const currentPrice = parseFloat(document.getElementById('sol-price').textContent.replace('$', '').replace(',', ''));
                    if (isNaN(currentPrice)) {
                        showTradeNotification('Unable to get current price!', 'error');
                        return;
                    }
                    
                    // Calculate amount based on selected percentage of SOL holdings
                    const amount = paperTrading.solHoldings * selectedPercent / 100;
                    
                    console.log('Sell button clicked - Paper Trade details:', {
                        currentHoldings: paperTrading.solHoldings,
                        selectedPercent: selectedPercent,
                        calculatedAmount: amount.toFixed(4),
                        currentPrice: currentPrice
                    });
                    
                    // Visual feedback
                    sellBtn.style.background = '#ff0000';
                    sellBtn.style.color = '#fff';
                    sellBtn.textContent = 'SELLING...';
                    
                    // Execute paper trade
                    setTimeout(() => {
                        executePaperTrade('sell', amount);
                        
                        sellBtn.style.background = '#ff0000';
                        sellBtn.style.color = '#fff';
                        sellBtn.textContent = 'SELL SUCCESS!';
                        
                        // Reset after 2 seconds
                        setTimeout(() => {
                            sellBtn.style.background = '';
                            sellBtn.style.color = '';
                            sellBtn.textContent = 'SELL';
                        }, 2000);
                    }, 500);
                });
            } else {
                console.log('Sell button not found'); // Debug log
            }
        }
        
        // Function to add trade to history
        function addTradeToHistory(action, amount, price, total) {
            const time = new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            // Create trade notification
            const notification = document.createElement('div');
            notification.className = `trade-notification ${action.toLowerCase()}`;
            notification.innerHTML = `
                <span class="trade-action">${action}</span>
                <span class="trade-details">${amount} @ $${price.toFixed(2)}</span>
                <span class="trade-time">${time}</span>
                <span class="trade-value ${action === 'BUY' ? 'positive' : 'negative'}">${action === 'BUY' ? '+' : '-'}$${total.toFixed(0)}</span>
            `;
            
            // Add to terminal header area
            const terminalHeader = tradingWindow.querySelector('.terminal-header');
            if (terminalHeader) {
                terminalHeader.appendChild(notification);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    notification.remove();
                }, 5000);
            }
        }
    }
    
    // Auto-open applications when page loads
    console.log('Starting auto-open sequence');
    console.log('About to start auto-open timeout');
    
    setTimeout(() => {
        console.log('Auto-open timeout triggered');
        
        // Open Media Player (lowest z-index)
        const mediaWindow = document.getElementById('media-window');
        console.log('Media window found:', !!mediaWindow);
        if (mediaWindow) {
            mediaWindow.style.display = 'flex';
            mediaWindow.style.zIndex = getHighestZIndex() + 1;
            // Ensure proper positioning for media player
            mediaWindow.style.top = '50%';
            mediaWindow.style.left = '200px';
            mediaWindow.style.transform = 'translateY(-50%)';
            // Setup media player controls when opened
            setupMediaPlayerControls();
            console.log('Media window opened');
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('media-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'media-window');
                console.log('Media player added to taskbar');
            }
            
            // Auto-play music
            setTimeout(() => {
                const audioPlayer = document.getElementById('audio-player');
                const playBtn = mediaWindow.querySelector('.play-btn');
                const vinylDisc = mediaWindow.querySelector('.vinyl-disc');
                
                console.log('Audio elements found:', {
                    audioPlayer: !!audioPlayer,
                    playBtn: !!playBtn,
                    vinylDisc: !!vinylDisc
                });
                
                if (audioPlayer && playBtn) {
                    // Set volume to a reasonable level
                    audioPlayer.volume = 0.7;
                    
                    // Start playing
                    audioPlayer.play().then(() => {
                        console.log('Media Player auto-started successfully');
                        playBtn.innerHTML = '⏸️';
                        if (vinylDisc) {
                            vinylDisc.style.animationPlayState = 'running';
                        }
                        
                        // Music is now playing
                    }).catch(error => {
                        console.log('Auto-play failed (browser may block autoplay):', error);
                        // If autoplay fails, at least show the play button as ready
                        playBtn.innerHTML = '▶️';
                        
                        // Add click handler to enable audio on first user interaction
                        const enableAudio = () => {
                            audioPlayer.play().then(() => {
                                console.log('Audio enabled by user interaction');
                                playBtn.innerHTML = '⏸️';
                                if (vinylDisc) {
                                    vinylDisc.style.animationPlayState = 'running';
                                }
                                // Remove the click handler after first use
                                mediaWindow.removeEventListener('click', enableAudio);
                            }).catch(err => {
                                console.log('Still failed to play:', err);
                            });
                        };
                        
                        // Add click handler to the entire media player window
                        mediaWindow.addEventListener('click', enableAudio);
                    });
                } else {
                    console.log('Audio elements not found for auto-play');
                }
            }, 0);
        }
        
        // Open Rug Scanner (middle z-index)
        const scannerWindow = document.getElementById('scanner-window');
        console.log('Scanner window found:', !!scannerWindow);
        if (scannerWindow) {
            scannerWindow.style.display = 'block';
            scannerWindow.style.zIndex = getHighestZIndex() + 2;
            setupWindowControls('scanner-window');
            console.log('Scanner window opened');
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('scanner-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'scanner-window');
                console.log('Scanner added to taskbar');
            }
            
            // Initialize Rug Scanner
            console.log('Initializing Rug Scanner...');
            initializeRugScanner();
        }
        
        // Open Browser (highest z-index)
        const browserWindow = document.getElementById('netscape-window');
        console.log('Browser window found:', !!browserWindow);
        if (browserWindow) {
            browserWindow.style.display = 'flex';
            browserWindow.style.zIndex = getHighestZIndex() + 3;
            setupWindowControls('netscape-window');
            console.log('Browser window opened');
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('netscape-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'netscape-window');
                console.log('Browser added to taskbar');
            }
        }
    }, 500);
    
    // Auto-open functionality
    console.log('Starting auto-open sequence');
    console.log('About to start auto-open timeout');
    
    setTimeout(() => {
        console.log('Auto-open timeout triggered');
        
        // Open Media Player (lowest z-index)
        const mediaWindow = document.getElementById('media-window');
        console.log('Media window found:', !!mediaWindow);
        if (mediaWindow) {
            mediaWindow.style.display = 'flex';
            mediaWindow.style.zIndex = getHighestZIndex() + 1;
            // Ensure proper positioning for media player
            mediaWindow.style.top = '50%';
            mediaWindow.style.left = '200px';
            mediaWindow.style.transform = 'translateY(-50%)';
            // Setup media player controls when opened
            setupMediaPlayerControls();
            console.log('Media window opened');
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('media-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'media-window');
                console.log('Media player added to taskbar');
            }
            
            // Auto-play music
            setTimeout(() => {
                const audioPlayer = document.getElementById('audio-player');
                const playBtn = mediaWindow.querySelector('.play-btn');
                const vinylDisc = mediaWindow.querySelector('.vinyl-disc');
                
                console.log('Audio elements found:', {
                    audioPlayer: !!audioPlayer,
                    playBtn: !!playBtn,
                    vinylDisc: !!vinylDisc
                });
                
                if (audioPlayer && playBtn) {
                    // Set volume to a reasonable level
                    audioPlayer.volume = 0.7;
                    
                    // Start playing
                    audioPlayer.play().then(() => {
                        console.log('Media Player auto-started successfully');
                        playBtn.innerHTML = '⏸️';
                        if (vinylDisc) {
                            vinylDisc.style.animationPlayState = 'running';
                        }
                        
                        // Music is now playing
                    }).catch(error => {
                        console.log('Auto-play failed (browser may block autoplay):', error);
                        // If autoplay fails, at least show the play button as ready
                        playBtn.innerHTML = '▶️';
                        
                        // Add click handler to enable audio on first user interaction
                        const enableAudio = () => {
                            audioPlayer.play().then(() => {
                                console.log('Audio enabled by user interaction');
                                playBtn.innerHTML = '⏸️';
                                if (vinylDisc) {
                                    vinylDisc.style.animationPlayState = 'running';
                                }
                                // Remove the click handler after first use
                                mediaWindow.removeEventListener('click', enableAudio);
                            }).catch(err => {
                                console.log('Still failed to play:', err);
                            });
                        };
                        
                        // Add click handler to the entire media player window
                        mediaWindow.addEventListener('click', enableAudio);
                    });
                } else {
                    console.log('Audio elements not found for auto-play');
                }
            }, 0);
        }
        
        // Open Rug Scanner (middle z-index)
        const scannerWindow = document.getElementById('scanner-window');
        console.log('Scanner window found:', !!scannerWindow);
        if (scannerWindow) {
            scannerWindow.style.display = 'block';
            scannerWindow.style.zIndex = getHighestZIndex() + 2;
            setupWindowControls('scanner-window');
            console.log('Scanner window opened');
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('scanner-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'scanner-window');
                console.log('Scanner added to taskbar');
            }
            
            // Initialize Rug Scanner
            console.log('Initializing Rug Scanner...');
            initializeRugScanner();
        }
        
        // Open Netscape Navigator (Internet Explorer) - highest z-index
        const browserWindow = document.getElementById('netscape-window');
        console.log('Browser window found:', !!browserWindow);
        if (browserWindow) {
            browserWindow.style.display = 'flex';
            browserWindow.style.zIndex = getHighestZIndex() + 3;
            setupWindowControls('netscape-window');
            console.log('Browser window opened');
            
            // Add to taskbar
            const appName = getAppNameFromWindowId('netscape-window');
            if (appName) {
                addTab(appName);
                openWindows.set(appName, 'netscape-window');
                console.log('Browser added to taskbar');
            }
        }
    }, 500);
}); 

// Chat functionality for MSN Messenger
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const emojiBtns = document.querySelectorAll('.emoji-btn');
    
    // Crypto-themed usernames for random messages
    const cryptoUsers = [
        'CryptoKing420', 'DiamondHands69', 'MoonBoy2024', 'DegenTrader', 
        'RocketMan', 'HODLQueen', 'SolSurfer', 'LamboLover'
    ];
    
    // Enhanced crypto-themed messages
    const cryptoMessages = [
        'Just bought the dip! 💎',
        'TO THE MOON! 🚀',
        'HODL strong! 💎🙌',
        'When lambo? 🏎️',
        'Number go up! 📈',
        'My portfolio is finally green! 📈',
        'Just bought more Y2K COIN! 🌙',
        'SOL pumping hard! 🚀',
        'Diamond hands forever! 💎',
        'This is the way! 🚀',
        'Ape in! 🦍',
        'WAGMI! 💎',
        'Paper hands get rekt! 💎',
        'Moon mission successful! 🌙',
        'Lambo soon! 🏎️',
        'Y2K COIN to the moon! 🚀',
        'Retro vibes, modern gains! 💎',
        '2000s energy, 2024 profits! 📈',
        'Nostalgia pays off! 💰',
        'Millennium bug = profit bug! 🐛💰',
        'Back to the future gains! ⚡',
        'Y2K COIN breaking resistance! 📊',
        'Chart looking like a time machine! ⏰',
        'This pump is so 2000s! 🎉',
        'Y2K COIN community strong! 💪'
    ];
    
    // Function to add a message to chat
    function addMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <span class="message-time">${time}</span>
            <span class="message-sender">${sender}:</span>
            <span class="message-text">${message}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to send user message
    function sendUserMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage('You', message, true);
            messageInput.value = '';
            
            // Trigger reactions to user message
            addReactionToUserMessage(message);
            
            // Simulate contextual response after 1-3 seconds
            setTimeout(() => {
                const randomUser = cryptoUsers[Math.floor(Math.random() * cryptoUsers.length)];
                const contextualMessages = generateContextualMessage(randomUser);
                const randomMessage = contextualMessages[Math.floor(Math.random() * contextualMessages.length)];
                
                const typingIndicator = simulateTyping(randomUser);
                setTimeout(() => {
                    typingIndicator.remove();
                    addMessage(randomUser, randomMessage);
                }, Math.random() * 2000 + 1000);
            }, Math.random() * 2000 + 1000);
        }
    }
    
    // Send button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendUserMessage);
    }
    
    // Enter key press
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
    
    // Emoji button clicks
    emojiBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const emoji = this.getAttribute('data-emoji');
            if (messageInput) {
                messageInput.value += emoji;
                messageInput.focus();
            }
        });
    });
    
    // Auto-generate random messages every 5-15 seconds
    setInterval(() => {
        const randomUser = cryptoUsers[Math.floor(Math.random() * cryptoUsers.length)];
        const randomMessage = cryptoMessages[Math.floor(Math.random() * cryptoMessages.length)];
        addMessage(randomUser, randomMessage);
    }, Math.random() * 10000 + 5000);
    
    // Simulate typing indicators and more realistic chat behavior
    function simulateTyping(user) {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message typing';
        typingDiv.innerHTML = `
            <span class="message-time">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
            <span class="message-sender">${user}:</span>
            <span class="message-text">typing...</span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
    
    // Enhanced message generation with context awareness
    function generateContextualMessage(user) {
        const now = new Date();
        const hour = now.getHours();
        
        // Time-based messages with Y2K COIN theme
        if (hour >= 9 && hour <= 17) {
            return [
                'Just checked my Y2K COIN portfolio, looking good! 📈',
                'Anyone else watching Y2K COIN right now? 🚀',
                'Market is heating up today! 🔥',
                'Perfect time to buy the Y2K COIN dip! 💎',
                'My Y2K COIN alerts are going crazy! 📊',
                'Y2K COIN breaking out! 🚀',
                'This pump is so 2000s! 🎉',
                'Y2K COIN community strong! 💪'
            ];
        } else if (hour >= 18 && hour <= 23) {
            return [
                'Evening Y2K COIN trading session starting! 🌙',
                'Night owls unite for Y2K COIN! 🦉',
                'Late night Y2K COIN gains incoming! 💰',
                'Who else is still trading Y2K COIN? 🚀',
                'Y2K COIN moon mission continues! 🌙',
                'Retro vibes, modern gains! 💎',
                '2000s energy, 2024 profits! 📈'
            ];
        } else {
            return [
                'Early bird gets the Y2K COIN worm! 🐛',
                'Morning Y2K COIN check! ☀️',
                'New day, new Y2K COIN opportunities! 🌅',
                'Pre-market Y2K COIN analysis time! 📊',
                'Rise and grind for Y2K COIN! 💪',
                'Y2K COIN breaking resistance! 📊',
                'Chart looking like a time machine! ⏰'
            ];
        }
    }
    
    // Simulate realistic chat conversations
    function startConversation() {
        const conversationStarters = [
            'Anyone else seeing this Y2K COIN pump?',
            'What\'s everyone\'s thoughts on Y2K COIN?',
            'Just made some Y2K COIN moves, feeling bullish!',
            'Who else is holding Y2K COIN strong?',
            'Y2K COIN market looking spicy today!',
            'Y2K COIN to the moon! 🚀',
            'This Y2K COIN pump is so 2000s! 🎉',
            'Y2K COIN community strong! 💪',
            'Retro vibes, modern gains with Y2K COIN! 💎',
            '2000s energy, 2024 Y2K COIN profits! 📈'
        ];
        
        const starter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
        const user = cryptoUsers[Math.floor(Math.random() * cryptoUsers.length)];
        
        // Show typing indicator
        const typingIndicator = simulateTyping(user);
        
        // Remove typing indicator after 2-4 seconds and show message
        setTimeout(() => {
            typingIndicator.remove();
            addMessage(user, starter);
            
            // Generate responses from other users
            setTimeout(() => {
                const responses = [
                    'I see it! Y2K COIN looking strong! 💪',
                    'This is the way for Y2K COIN! 🚀',
                    'Y2K COIN HODL gang! 💎',
                    'Y2K COIN moon mission confirmed! 🌙',
                    'Y2K COIN diamond hands only! 💎🙌',
                    'Y2K COIN to the moon! 🚀',
                    'This Y2K COIN pump is so 2000s! 🎉',
                    'Y2K COIN community strong! 💪',
                    'Retro vibes, modern Y2K COIN gains! 💎',
                    '2000s energy, 2024 Y2K COIN profits! 📈'
                ];
                
                const responseUser = cryptoUsers[Math.floor(Math.random() * cryptoUsers.length)];
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                const responseTyping = simulateTyping(responseUser);
                setTimeout(() => {
                    responseTyping.remove();
                    addMessage(responseUser, response);
                }, Math.random() * 2000 + 1000);
            }, Math.random() * 3000 + 2000);
        }, Math.random() * 2000 + 2000);
    }
    
    // Start conversations every 20-40 seconds
    setInterval(startConversation, Math.random() * 20000 + 20000);
    
    // Market sentiment messages (every 45-90 seconds)
    setInterval(() => {
        const sentimentUsers = ['HODLQueen', 'DiamondHands69', 'SolSurfer'];
        const user = sentimentUsers[Math.floor(Math.random() * sentimentUsers.length)];
        
        const sentiments = [
            'Y2K COIN market sentiment looking bullish! 🚀',
            'Y2K COIN fear and greed index showing extreme greed! 😱',
            'Whales are accumulating Y2K COIN! 🐋',
            'Y2K COIN retail FOMO incoming! 🏃‍♂️',
            'Institutional money flowing into Y2K COIN! 💰',
            'Y2K COIN breaking resistance levels! 📊',
            'This Y2K COIN pump is so 2000s! 🎉',
            'Y2K COIN community strong! 💪',
            'Retro vibes, modern Y2K COIN gains! 💎',
            '2000s energy, 2024 Y2K COIN profits! 📈'
        ];
        
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        
        const typingIndicator = simulateTyping(user);
        setTimeout(() => {
            typingIndicator.remove();
            addMessage(user, sentiment);
        }, Math.random() * 2000 + 1000);
    }, Math.random() * 45000 + 45000);
    
    // Technical analysis messages (every 60-120 seconds)
    setInterval(() => {
        const techUsers = ['CryptoKing420', 'DegenTrader'];
        const user = techUsers[Math.floor(Math.random() * techUsers.length)];
        
        const technicalTerms = [
            'Y2K COIN RSI showing oversold conditions! 📊',
            'Y2K COIN MACD crossover incoming! 📈',
            'Y2K COIN support level holding strong! 💪',
            'Y2K COIN resistance about to break! 🚀',
            'Y2K COIN volume increasing significantly! 📊',
            'Y2K COIN golden cross forming! ✨',
            'Y2K COIN Fibonacci retracement at 61.8%! 📐',
            'Y2K COIN breaking resistance levels! 📊',
            'This Y2K COIN pump is so 2000s! 🎉',
            'Y2K COIN community strong! 💪',
            'Retro vibes, modern Y2K COIN gains! 💎'
        ];
        
        const technical = technicalTerms[Math.floor(Math.random() * technicalTerms.length)];
        
        const typingIndicator = simulateTyping(user);
        setTimeout(() => {
            typingIndicator.remove();
            addMessage(user, technical);
        }, Math.random() * 2000 + 1000);
    }, Math.random() * 60000 + 60000);
    
    // Initialize AI chat bots function
    function initializeAIChatBots() {
        // Start the conversation loops
        startConversation();
        
        // Add some initial messages to make the chat feel alive
        setTimeout(() => {
            const welcomeMessages = [
                'Welcome to the Y2K COIN chat room! 🚀',
                'Y2K COIN community is here! 💎',
                'This pump is so 2000s! 🎉',
                'Y2K COIN to the moon! 🌙',
                'Retro vibes, modern gains! 💰'
            ];
            
            const welcomeUser = cryptoUsers[Math.floor(Math.random() * cryptoUsers.length)];
            const welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            
            const typingIndicator = simulateTyping(welcomeUser);
            setTimeout(() => {
                typingIndicator.remove();
                addMessage(welcomeUser, welcomeMessage);
            }, Math.random() * 2000 + 1000);
        }, 2000);
    }
    
    // Make initializeAIChatBots globally available
    window.initializeAIChatBots = initializeAIChatBots;
    
    // ===== DEGEN MODE CASINO FUNCTIONALITY =====
    let degenMode = {
        balance: 1000,
        currentBet: 50,
        wins: 0,
        losses: 0,
        totalWon: 0,
        isSpinning: false,
        jackpot: 50000,
        autoSpin: false,
        autoSpinInterval: null
    };

    // Slot machine symbols
    const symbols = ['🎰', '💰', '💎', '🚀', '🎯', '⭐', '🔥', '💎', '🎰', '💰'];
    
    // Initialize Degen Mode
    function initializeDegenMode() {
        const degenWindow = document.getElementById('degen-window');
        if (!degenWindow) return;
        
        console.log('Initializing Degen Mode...');
        
        // Setup bet buttons
        const betButtons = degenWindow.querySelectorAll('.bet-btn');
        betButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                betButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                degenMode.currentBet = parseInt(this.getAttribute('data-bet'));
                console.log('Bet amount set to:', degenMode.currentBet);
            });
        });
        
        // Set default bet
        const defaultBetBtn = degenWindow.querySelector('.bet-btn[data-bet="50"]');
        if (defaultBetBtn) {
            defaultBetBtn.classList.add('active');
        }
        
        // Setup spin button
        const spinBtn = degenWindow.querySelector('#spin-btn');
        if (spinBtn) {
            spinBtn.addEventListener('click', function() {
                if (!degenMode.isSpinning && degenMode.balance >= degenMode.currentBet) {
                    spinSlotMachine();
                } else if (degenMode.balance < degenMode.currentBet) {
                    showDegenNotification('Insufficient balance!', 'error');
                }
            });
        }
        
        // Setup MAX BET button
        const maxBetBtn = degenWindow.querySelector('#max-bet-btn');
        if (maxBetBtn) {
            maxBetBtn.addEventListener('click', function() {
                const maxBet = Math.min(500, degenMode.balance);
                degenMode.currentBet = maxBet;
                
                // Update active bet button
                betButtons.forEach(b => b.classList.remove('active'));
                const maxBetButton = degenWindow.querySelector(`.bet-btn[data-bet="${maxBet}"]`);
                if (maxBetButton) {
                    maxBetButton.classList.add('active');
                } else {
                    // If max bet is not a preset amount, show notification
                    showDegenNotification(`Max bet set to $${maxBet}`, 'win');
                }
                
                console.log('Max bet set to:', maxBet);
            });
        }
        
        // Setup AUTO SPIN button
        const autoSpinBtn = degenWindow.querySelector('#auto-spin-btn');
        if (autoSpinBtn) {
            autoSpinBtn.addEventListener('click', function() {
                if (degenMode.autoSpin) {
                    // Stop auto spin
                    degenMode.autoSpin = false;
                    if (degenMode.autoSpinInterval) {
                        clearInterval(degenMode.autoSpinInterval);
                        degenMode.autoSpinInterval = null;
                    }
                    this.classList.remove('active');
                    this.textContent = 'AUTO SPIN';
                    showDegenNotification('Auto spin stopped!', 'loss');
                } else {
                    // Start auto spin
                    if (degenMode.balance >= degenMode.currentBet) {
                        degenMode.autoSpin = true;
                        this.classList.add('active');
                        this.textContent = 'STOP AUTO';
                        showDegenNotification('Auto spin started!', 'win');
                        
                        // Start auto spinning
                        degenMode.autoSpinInterval = setInterval(() => {
                            if (degenMode.balance >= degenMode.currentBet && !degenMode.isSpinning) {
                                spinSlotMachine();
                            } else if (degenMode.balance < degenMode.currentBet) {
                                // Stop auto spin if insufficient balance
                                degenMode.autoSpin = false;
                                clearInterval(degenMode.autoSpinInterval);
                                degenMode.autoSpinInterval = null;
                                autoSpinBtn.classList.remove('active');
                                autoSpinBtn.textContent = 'AUTO SPIN';
                                showDegenNotification('Auto spin stopped - insufficient balance!', 'error');
                            }
                        }, 3000); // Auto spin every 3 seconds
                    } else {
                        showDegenNotification('Insufficient balance for auto spin!', 'error');
                    }
                }
            });
        }
        
        // Setup RESET button
        const resetBtn = degenWindow.querySelector('#reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Stop auto spin if running
                if (degenMode.autoSpin) {
                    degenMode.autoSpin = false;
                    if (degenMode.autoSpinInterval) {
                        clearInterval(degenMode.autoSpinInterval);
                        degenMode.autoSpinInterval = null;
                    }
                    autoSpinBtn.classList.remove('active');
                    autoSpinBtn.textContent = 'AUTO SPIN';
                }
                
                // Reset game state
                degenMode.balance = 1000;
                degenMode.currentBet = 50;
                degenMode.wins = 0;
                degenMode.losses = 0;
                degenMode.totalWon = 0;
                degenMode.jackpot = 50000;
                
                // Reset bet selection
                betButtons.forEach(b => b.classList.remove('active'));
                const defaultBetBtn = degenWindow.querySelector('.bet-btn[data-bet="50"]');
                if (defaultBetBtn) {
                    defaultBetBtn.classList.add('active');
                }
                
                // Clear recent wins
                const winsList = degenWindow.querySelector('#wins-list');
                if (winsList) {
                    winsList.innerHTML = '<div class="no-wins">No wins yet... Keep spinning! 🎰</div>';
                }
                
                // Update display
                updateDegenDisplay();
                showDegenNotification('Game reset!', 'win');
                console.log('Game reset');
            });
        }
        
        // Update display
        updateDegenDisplay();
        
        // Start jackpot animation
        startJackpotAnimation();
        
        // Setup window controls
        setupDegenWindowControls();
    }
    
    // Setup Degen Mode window controls
    function setupDegenWindowControls() {
        const degenWindow = document.getElementById('degen-window');
        if (!degenWindow) return;
        
        const closeBtn = degenWindow.querySelector('.window-btn.close');
        const minimizeBtn = degenWindow.querySelector('.window-btn.minimize');
        const maximizeBtn = degenWindow.querySelector('.window-btn.maximize');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                // Stop auto spin if running
                if (degenMode.autoSpin) {
                    degenMode.autoSpin = false;
                    if (degenMode.autoSpinInterval) {
                        clearInterval(degenMode.autoSpinInterval);
                        degenMode.autoSpinInterval = null;
                    }
                }
                degenWindow.style.display = 'none';
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function() {
                degenWindow.style.transform = 'translate(-50%, 100%)';
                setTimeout(() => {
                    degenWindow.style.display = 'none';
                }, 300);
            });
        }
        
        if (maximizeBtn) {
            let isMaximized = false;
            maximizeBtn.addEventListener('click', function() {
                if (!isMaximized) {
                    degenWindow.style.width = '95%';
                    degenWindow.style.height = '90%';
                    degenWindow.style.transform = 'translate(-50%, -50%)';
                    isMaximized = true;
                } else {
                    degenWindow.style.width = '';
                    degenWindow.style.height = '';
                    degenWindow.style.transform = 'translate(-50%, -50%)';
                    isMaximized = false;
                }
            });
        }
    }
    
    // Spin the slot machine
    function spinSlotMachine() {
        if (degenMode.isSpinning) return;
        
        degenMode.isSpinning = true;
        degenMode.balance -= degenMode.currentBet;
        
        const spinBtn = document.getElementById('spin-btn');
        const reels = document.querySelectorAll('.slot-reel');
        const winLine = document.querySelector('.win-line');
        
        // Disable spin button
        spinBtn.disabled = true;
        spinBtn.textContent = '🎰 SPINNING... 🎰';
        
        // Hide win line
        winLine.classList.remove('active');
        
        // Generate final results first
        const finalResults = [];
        reels.forEach(() => {
            finalResults.push(symbols[Math.floor(Math.random() * symbols.length)]);
        });
        
        // Start spinning animation for each reel
        const reelAnimations = [];
        reels.forEach((reel, index) => {
            const reelContent = reel.querySelector('.reel-content');
            let currentSymbolIndex = 0;
            let spinSpeed = 50; // Start fast
            const finalSymbol = finalResults[index];
            
            // Add spinning class for visual effect
            reel.classList.add('spinning');
            
            // Create spinning animation
            const spinInterval = setInterval(() => {
                // Cycle through symbols
                currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
                reelContent.textContent = symbols[currentSymbolIndex];
                
                // Gradually slow down
                if (spinSpeed < 200) {
                    spinSpeed += 10;
                }
            }, spinSpeed);
            
            // Stop this reel after a random delay (staggered stopping)
            const stopDelay = 1500 + (index * 300) + Math.random() * 500;
            setTimeout(() => {
                clearInterval(spinInterval);
                reelContent.textContent = finalSymbol;
                reel.classList.remove('spinning');
            }, stopDelay);
            
            reelAnimations.push(spinInterval);
        });
        
        // Wait for all reels to stop, then check results
        const totalSpinTime = 2500 + Math.random() * 1000;
        setTimeout(() => {
            // Clear any remaining intervals
            reelAnimations.forEach(interval => clearInterval(interval));
            
            // Ensure all reels show final results and stop spinning
            reels.forEach((reel, index) => {
                reel.querySelector('.reel-content').textContent = finalResults[index];
                reel.classList.remove('spinning');
            });
            
            // Check for wins
            const winAmount = checkWin(finalResults);
            
            if (winAmount > 0) {
                degenMode.balance += winAmount;
                degenMode.wins++;
                degenMode.totalWon += winAmount;
                
                // Show win line
                winLine.classList.add('active');
                
                // Show win notification
                showDegenNotification(`🎉 WIN! +$${winAmount}`, 'win');
                
                // Add to recent wins
                addRecentWin(winAmount, finalResults);
                
                // Check for jackpot
                if (winAmount >= degenMode.jackpot * 0.1) {
                    showDegenNotification('🎰 JACKPOT HIT! 🎰', 'jackpot');
                    degenMode.jackpot = 50000; // Reset jackpot
                }
            } else {
                degenMode.losses++;
                showDegenNotification('💸 Better luck next time!', 'loss');
            }
            
            // Update display
            updateDegenDisplay();
            
            // Re-enable spin button
            spinBtn.disabled = false;
            spinBtn.textContent = '🎰 SPIN TO WIN 🎰';
            degenMode.isSpinning = false;
            
        }, totalSpinTime);
    }
    
    // Check for wins
    function checkWin(results) {
        // Three of a kind
        if (results[0] === results[1] && results[1] === results[2]) {
            const multiplier = getSymbolMultiplier(results[0]);
            return degenMode.currentBet * multiplier;
        }
        
        // Two of a kind
        if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
            return degenMode.currentBet * 2;
        }
        
        return 0;
    }
    
    // Get symbol multiplier
    function getSymbolMultiplier(symbol) {
        const multipliers = {
            '🎰': 10,  // Slot machine - highest payout
            '💰': 8,   // Money bag
            '💎': 6,   // Diamond
            '🚀': 5,   // Rocket
            '🎯': 4,   // Target
            '⭐': 3,   // Star
            '🔥': 2    // Fire
        };
        return multipliers[symbol] || 2;
    }
    
    // Update display
    function updateDegenDisplay() {
        const balanceElement = document.getElementById('degen-balance');
        const winsElement = document.getElementById('wins-count');
        const lossesElement = document.getElementById('losses-count');
        const totalWonElement = document.getElementById('total-won');
        const jackpotElement = document.getElementById('jackpot-amount');
        const luckElement = document.getElementById('luck-percentage');
        
        if (balanceElement) balanceElement.textContent = `$${degenMode.balance}`;
        if (winsElement) winsElement.textContent = degenMode.wins;
        if (lossesElement) lossesElement.textContent = degenMode.losses;
        if (totalWonElement) totalWonElement.textContent = `$${degenMode.totalWon}`;
        if (jackpotElement) jackpotElement.textContent = `$${degenMode.jackpot.toLocaleString()}`;
        
        // Calculate luck percentage
        const totalGames = degenMode.wins + degenMode.losses;
        const luckPercentage = totalGames > 0 ? Math.round((degenMode.wins / totalGames) * 100) : 50;
        if (luckElement) luckElement.textContent = `${luckPercentage}%`;
    }
    
    // Show notifications
    function showDegenNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `degen-notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            'win': '#00ff00',
            'loss': '#ff0000',
            'error': '#ff0000',
            'jackpot': '#ffd700'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 30px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            z-index: 10000;
            background: ${colors[type] || '#333'};
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            animation: degenNotification 3s ease forwards;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Add recent win
    function addRecentWin(amount, symbols) {
        const winsList = document.getElementById('wins-list');
        if (!winsList) return;
        
        // Remove "no wins" message if it exists
        const noWins = winsList.querySelector('.no-wins');
        if (noWins) {
            noWins.remove();
        }
        
        const winItem = document.createElement('div');
        winItem.className = 'win-item';
        winItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${symbols.join(' ')}</span>
                <span style="color: #00ff00; font-weight: bold;">+$${amount}</span>
            </div>
        `;
        
        winsList.insertBefore(winItem, winsList.firstChild);
        
        // Keep only last 5 wins
        const winItems = winsList.querySelectorAll('.win-item');
        if (winItems.length > 5) {
            winItems[winItems.length - 1].remove();
        }
    }
    
    // Start jackpot animation
    function startJackpotAnimation() {
        setInterval(() => {
            degenMode.jackpot += Math.floor(Math.random() * 100) + 50;
            updateDegenDisplay();
        }, 5000); // Increase jackpot every 5 seconds
    }
    
    // Initialize Matrix background effect
    function initializeMatrixBackground() {
        const matrixBg = document.getElementById('matrix-bg');
        if (!matrixBg) return;
        
        // Matrix characters (mix of numbers, letters, and symbols)
        const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        // Create matrix columns
        function createMatrixColumn() {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            
            // Random brightness variation
            const brightness = Math.random();
            if (brightness > 0.8) {
                column.classList.add('bright');
            } else if (brightness < 0.3) {
                column.classList.add('dim');
            }
            
            // Random position
            column.style.left = Math.random() * 100 + '%';
            
            // Random animation duration (3-8 seconds)
            const duration = 3 + Math.random() * 5;
            column.style.animationDuration = duration + 's';
            
            // Generate random characters for this column
            let columnText = '';
            const columnLength = 15 + Math.floor(Math.random() * 20);
            
            for (let i = 0; i < columnLength; i++) {
                columnText += matrixChars[Math.floor(Math.random() * matrixChars.length)] + '<br>';
            }
            
            column.innerHTML = columnText;
            matrixBg.appendChild(column);
            
            // Remove column after animation completes
            setTimeout(() => {
                if (column.parentNode) {
                    column.parentNode.removeChild(column);
                }
            }, duration * 1000);
        }
        
        // Create new columns periodically
        function spawnMatrixColumn() {
            createMatrixColumn();
            // Random delay between 100-500ms
            setTimeout(spawnMatrixColumn, 100 + Math.random() * 400);
        }
        
        // Start the matrix effect
        spawnMatrixColumn();
        
        // Create initial columns
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createMatrixColumn(), i * 200);
        }
    }
    
    // Make initializeDegenMode globally available
    window.initializeDegenMode = initializeDegenMode;
    
    // ===== RUG SCANNER FUNCTIONALITY =====
    function initializeRugScanner() {
        const scannerWindow = document.getElementById('scanner-window');
        if (!scannerWindow) return;
        
        console.log('Initializing Rug Scanner...');
        
        // Reset all results to default state
        resetScannerResults();
        
        // Show Y2K COIN results immediately (since it's always legit)
        setTimeout(() => {
            showY2KCoinResults();
        }, 100);
        
        // Setup coin selector buttons
        const coinButtons = scannerWindow.querySelectorAll('.coin-btn');
        coinButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                coinButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const coinType = this.getAttribute('data-coin');
                const scanInput = document.getElementById('scan-input');
                
                if (coinType === 'y2k') {
                    scanInput.value = '9PUqM9R6cEtAw6XqnQSWKs81CBQayBQDrccHti2hpump';
                    scanInput.disabled = true;
                } else {
                    scanInput.value = '';
                    scanInput.disabled = false;
                    scanInput.placeholder = 'Enter contract address...';
                }
            });
        });
        
        // Setup scan button
        const scanBtn = document.getElementById('scan-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', function() {
                startScan();
            });
        }
        
        // Setup enter key on input
        const scanInput = document.getElementById('scan-input');
        if (scanInput) {
            scanInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    startScan();
                }
            });
        }
    }
    
    function startScan() {
        const scanBtn = document.getElementById('scan-btn');
        const scanningAnimation = document.getElementById('scanning-animation');
        const scanResults = document.getElementById('scan-results');
        const scanSummary = document.getElementById('scan-summary');
        const scannerStatus = document.getElementById('scanner-status');
        const scanningProgress = document.getElementById('scanning-progress');
        const scanningText = document.getElementById('scanning-text');
        
        // Disable scan button
        scanBtn.disabled = true;
        scanBtn.textContent = 'SCANNING...';
        
        // Hide previous results
        scanSummary.style.display = 'none';
        
        // Show scanning animation
        scanningAnimation.style.display = 'block';
        scannerStatus.textContent = 'Scanning in progress...';
        
        // Reset progress
        scanningProgress.style.width = '0%';
        
        // Scanning phases
        const phases = [
            { progress: 20, text: 'Connecting to blockchain...' },
            { progress: 40, text: 'Analyzing contract code...' },
            { progress: 60, text: 'Checking liquidity locks...' },
            { progress: 80, text: 'Verifying ownership...' },
            { progress: 100, text: 'Finalizing security report...' }
        ];
        
        let currentPhase = 0;
        
        function updateProgress() {
            if (currentPhase < phases.length) {
                const phase = phases[currentPhase];
                scanningProgress.style.width = phase.progress + '%';
                scanningText.textContent = phase.text;
                currentPhase++;
                setTimeout(updateProgress, 800);
            } else {
                // Scan complete
                setTimeout(completeScan, 1000);
            }
        }
        
        // Start progress updates
        setTimeout(updateProgress, 500);
    }
    
    function completeScan() {
        const scanBtn = document.getElementById('scan-btn');
        const scanningAnimation = document.getElementById('scanning-animation');
        
        // Hide scanning animation
        scanningAnimation.style.display = 'none';
        
        // Show Y2K COIN results
        showY2KCoinResults();
        
        // Re-enable scan button
        setTimeout(() => {
            scanBtn.disabled = false;
            scanBtn.textContent = '🔍 SCAN NOW';
        }, 2000);
    }
    
    // Reset scanner results to default state
    function resetScannerResults() {
        const results = {
            'liquidity-result': '⏳ Scanning...',
            'contract-result': '⏳ Scanning...',
            'ownership-result': '⏳ Scanning...',
            'security-result': '⏳ Scanning...',
            'risk-result': '⏳ Scanning...',
            'overall-result': '⏳ Scanning...'
        };
        
        Object.keys(results).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = results[key];
                element.className = 'scan-result';
            }
        });
        
        // Hide summary
        const scanSummary = document.getElementById('scan-summary');
        if (scanSummary) {
            scanSummary.style.display = 'none';
        }
    }
    
    // Show Y2K COIN results (always legit)
    function showY2KCoinResults() {
        const results = {
            'liquidity-result': { text: '✅ LOCKED FOREVER', class: 'positive' },
            'contract-result': { text: '✅ VERIFIED', class: 'positive' },
            'ownership-result': { text: '✅ RENOUNCED', class: 'positive' },
            'security-result': { text: '🛡️ 100/100', class: 'safe' },
            'risk-result': { text: '🟢 ZERO RISK', class: 'safe' },
            'overall-result': { text: '🎉 100% LEGIT', class: 'positive' }
        };
        
        // Animate results appearing
        Object.keys(results).forEach((key, index) => {
            setTimeout(() => {
                const element = document.getElementById(key);
                if (element) {
                    element.textContent = results[key].text;
                    element.className = 'scan-result ' + results[key].class;
                }
            }, index * 200);
        });
        
        // Show summary after all results
        setTimeout(() => {
            const scanSummary = document.getElementById('scan-summary');
            const scannerStatus = document.getElementById('scanner-status');
            
            if (scanSummary) {
                scanSummary.style.display = 'block';
            }
            if (scannerStatus) {
                scannerStatus.textContent = 'Scan complete - Y2K COIN is 100% LEGIT!';
            }
        }, 1500);
    }
    
    // Make initializeRugScanner globally available
    window.initializeRugScanner = initializeRugScanner;
    
    // Price update messages (every 30-60 seconds)
    setInterval(() => {
        const priceUsers = ['CryptoKing420', 'DegenTrader', 'RocketMan'];
        const user = priceUsers[Math.floor(Math.random() * priceUsers.length)];
        const prices = [175.50, 176.20, 177.80, 178.45, 179.10];
        const price = prices[Math.floor(Math.random() * prices.length)];
        const change = Math.random() > 0.5 ? '+' : '-';
        const percent = (Math.random() * 5 + 1).toFixed(2);
        
        const priceMessage = `SOL just hit $${price}! ${change}${percent}% 📈`;
        
        const typingIndicator = simulateTyping(user);
        setTimeout(() => {
            typingIndicator.remove();
            addMessage(user, priceMessage);
        }, Math.random() * 2000 + 1000);
    }, Math.random() * 30000 + 30000);
    
    // Reaction messages to user messages
    function addReactionToUserMessage(userMessage) {
        const reactions = [
            'This! 💯',
            'Facts! 🔥',
            'Agreed! 👍',
            'Same! 🙌',
            '100%! 💎'
        ];
        
        setTimeout(() => {
            const reactionUser = cryptoUsers[Math.floor(Math.random() * cryptoUsers.length)];
            const reaction = reactions[Math.floor(Math.random() * reactions.length)];
            
            const typingIndicator = simulateTyping(reactionUser);
            setTimeout(() => {
                typingIndicator.remove();
                addMessage(reactionUser, reaction);
            }, Math.random() * 1500 + 500);
        }, Math.random() * 3000 + 1000);
    }
    
    // Contact item clicks (for future private chat functionality)
    document.querySelectorAll('.contact-item').forEach(contact => {
        contact.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            console.log(`Clicked on contact: ${username}`);
            // Future: Implement private chat functionality
        });
    });
    
    // Nudge and Block button functionality
    const nudgeBtn = document.querySelector('.nudge-btn');
    const blockBtn = document.querySelector('.block-btn');
    
    if (nudgeBtn) {
        nudgeBtn.addEventListener('click', function() {
            addMessage('System', 'You nudged the chat room! 📢');
        });
    }
    
    if (blockBtn) {
        blockBtn.addEventListener('click', function() {
            addMessage('System', 'Block feature activated! 🚫');
        });
    }
}); 

// Music Player functionality


// ===== MUSIC PLAYER FUNCTIONALITY =====
let allMusic = [
  {
    name: "Harley Bird - Home",
    artist: "Jordan Schor",
    img: "music-1",
    src: "music-1"
  },
  {
    name: "Ikson Anywhere – Ikson",
    artist: "Audio Library",
    img: "music-2",
    src: "music-2"
  },
  {
    name: "Beauz & Jvna - Crazy",
    artist: "Beauz & Jvna",
    img: "music-3",
    src: "music-3"
  },
  {
    name: "Hardwind - Want Me",
    artist: "Mike Archangelo",
    img: "music-4",
    src: "music-4"
  },
  {
    name: "Jim - Sun Goes Down",
    artist: "Jim Yosef x Roy",
    img: "music-5",
    src: "music-5"
  },
  {
    name: "Lost Sky - Vision NCS",
    artist: "NCS Release",
    img: "music-6",
    src: "music-6"
  }
];

function initializeMusicPlayer() {
    const mediaWindow = document.getElementById('media-window');
    if (!mediaWindow) return;
    
    const wrapper = mediaWindow.querySelector(".wrapper");
    if (!wrapper) return;
    
    const musicImg = wrapper.querySelector(".img-area img");
    const musicName = wrapper.querySelector(".song-details .name");
    const musicArtist = wrapper.querySelector(".song-details .artist");
    const playPauseBtn = wrapper.querySelector(".play-pause");
    const prevBtn = wrapper.querySelector("#prev");
    const nextBtn = wrapper.querySelector("#next");
    const mainAudio = wrapper.querySelector("#main-audio");
    const progressArea = wrapper.querySelector(".progress-area");
    const progressBar = progressArea.querySelector(".progress-bar");
    const musicList = wrapper.querySelector(".music-list");
    const moreMusicBtn = wrapper.querySelector("#more-music");
    const closemoreMusic = musicList.querySelector("#close");

    let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
    let isMusicPaused = true;

    // Load initial music
    loadMusic(musicIndex);
    playingSong();

    function loadMusic(indexNumb){
        musicName.innerText = allMusic[indexNumb - 1].name;
        musicArtist.innerText = allMusic[indexNumb - 1].artist;
        musicImg.src = `https://bluredcodes.github.io/MusicPlayerCN/images/${allMusic[indexNumb - 1].src}.jpg`;
        mainAudio.src = `https://bluredcodes.github.io/MusicPlayerCN/songs/${allMusic[indexNumb - 1].src}.mp3`;
    }

    //play music function
    function playMusic(){
        wrapper.classList.add("paused");
        playPauseBtn.querySelector("i").innerText = "pause";
        mainAudio.play();
    }

    //pause music function
    function pauseMusic(){
        wrapper.classList.remove("paused");
        playPauseBtn.querySelector("i").innerText = "play_arrow";
        mainAudio.pause();
    }

    //prev music function
    function prevMusic(){
        musicIndex--;
        musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong();
    }

    //next music function
    function nextMusic(){
        musicIndex++;
        musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong();
    }

    // play or pause button event
    playPauseBtn.addEventListener("click", ()=>{
        const isMusicPlay = wrapper.classList.contains("paused");
        isMusicPlay ? pauseMusic() : playMusic();
        playingSong();
    });

    //prev music button event
    prevBtn.addEventListener("click", ()=>{
        prevMusic();
    });

    //next music button event
    nextBtn.addEventListener("click", ()=>{
        nextMusic();
    });

    // update progress bar width according to music current time
    mainAudio.addEventListener("timeupdate", (e)=>{
        const currentTime = e.target.currentTime;
        const duration = e.target.duration;
        let progressWidth = (currentTime / duration) * 100;
        progressBar.style.width = `${progressWidth}%`;

        let musicCurrentTime = wrapper.querySelector(".current-time");
        let musicDuartion = wrapper.querySelector(".max-duration");
        mainAudio.addEventListener("loadeddata", ()=>{
            let mainAdDuration = mainAudio.duration;
            let totalMin = Math.floor(mainAdDuration / 60);
            let totalSec = Math.floor(mainAdDuration % 60);
            if(totalSec < 10){
                totalSec = `0${totalSec}`;
            }
            musicDuartion.innerText = `${totalMin}:${totalSec}`;
        });
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){
            currentSec = `0${currentSec}`;
        }
        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
    });

    // update playing song currentTime on according to the progress bar width
    progressArea.addEventListener("click", (e)=>{
        let progressWidth = progressArea.clientWidth;
        let clickedOffsetX = e.offsetX;
        let songDuration = mainAudio.duration;
        
        mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
        playMusic();
        playingSong();
    });

    //change loop, shuffle, repeat icon onclick
    const repeatBtn = wrapper.querySelector("#repeat-plist");
    repeatBtn.addEventListener("click", ()=>{
        let getText = repeatBtn.innerText;
        switch(getText){
            case "repeat":
                repeatBtn.innerText = "repeat_one";
                repeatBtn.setAttribute("title", "Song looped");
                break;
            case "repeat_one":
                repeatBtn.innerText = "shuffle";
                repeatBtn.setAttribute("title", "Playback shuffled");
                break;
            case "shuffle":
                repeatBtn.innerText = "repeat";
                repeatBtn.setAttribute("title", "Playlist looped");
                break;
        }
    });

    //code for what to do after song ended
    mainAudio.addEventListener("ended", ()=>{
        let getText = repeatBtn.innerText;
        switch(getText){
            case "repeat":
                nextMusic();
                break;
            case "repeat_one":
                mainAudio.currentTime = 0;
                loadMusic(musicIndex);
                playMusic();
                break;
            case "shuffle":
                let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
                do{
                    randIndex = Math.floor((Math.random() * allMusic.length) + 1);
                }while(musicIndex == randIndex);
                musicIndex = randIndex;
                loadMusic(musicIndex);
                playMusic();
                playingSong();
                break;
        }
    });

    //show music list onclick of music icon
    moreMusicBtn.addEventListener("click", ()=>{
        musicList.classList.toggle("show");
    });
    closemoreMusic.addEventListener("click", ()=>{
        moreMusicBtn.click();
    });

    const ulTag = wrapper.querySelector("ul");
    // let create li tags according to array length for list
    for (let i = 0; i < allMusic.length; i++) {
        let liTag = `<li li-index="${i + 1}">
                      <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                      </div>
                      <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                      <audio class="${allMusic[i].src}" src="https://bluredcodes.github.io/MusicPlayerCN/songs/${allMusic[i].src}.mp3"></audio>
                    </li>`;
        ulTag.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
        let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
        liAudioTag.addEventListener("loadeddata", ()=>{
            let duration = liAudioTag.duration;
            let totalMin = Math.floor(duration / 60);
            let totalSec = Math.floor(duration % 60);
            if(totalSec < 10){
                totalSec = `0${totalSec}`;
            }
            liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
            liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
        });
    }

    //play particular song from the list onclick of li tag
    function playingSong(){
        const allLiTag = ulTag.querySelectorAll("li");
        
        for (let j = 0; j < allLiTag.length; j++) {
            let audioTag = allLiTag[j].querySelector(".audio-duration");
            
            if(allLiTag[j].classList.contains("playing")){
                allLiTag[j].classList.remove("playing");
                let adDuration = audioTag.getAttribute("t-duration");
                audioTag.innerText = adDuration;
            }

            if(allLiTag[j].getAttribute("li-index") == musicIndex){
                allLiTag[j].classList.add("playing");
                audioTag.innerText = "Playing";
            }

            allLiTag[j].setAttribute("onclick", "clicked(this)");
        }
    }

    //particular li clicked function
    window.clicked = function(element){
        let getLiIndex = element.getAttribute("li-index");
        musicIndex = getLiIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong();
    }
}

// ===== NEW MEDIA PLAYER CONTROLS =====
function setupMediaPlayerControls() {
    const mediaPlayer = document.getElementById('media-window');
    if (!mediaPlayer) return;
    
    // Audio element
    const audioPlayer = document.getElementById('audio-player');
    
    // Window control buttons
    const minimizeBtn = mediaPlayer.querySelector('.minimize-btn');
    const maximizeBtn = mediaPlayer.querySelector('.maximize-btn');
    const closeBtn = mediaPlayer.querySelector('.close-btn');
    
    // Media control buttons
    const playBtn = mediaPlayer.querySelector('.play-btn');
    const prevBtn = mediaPlayer.querySelector('.prev-btn');
    const nextBtn = mediaPlayer.querySelector('.next-btn');
    const shuffleBtn = mediaPlayer.querySelector('.shuffle-btn');
    const repeatBtn = mediaPlayer.querySelector('.repeat-btn');
    
    // Progress and volume
    const progressBar = mediaPlayer.querySelector('.progress-bar');
    const volumeBar = mediaPlayer.querySelector('.volume-bar');
    
    let isPlaying = false;
    let currentTime = 0;
    let totalTime = 225; // 3:45 in seconds
    let progressInterval;
    
    // Window controls
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            mediaPlayer.style.display = 'none';
            // Update taskbar tab to show minimized state
            const appName = getAppNameFromWindowId('media-window');
            if (appName) {
                const tab = document.querySelector(`#taskbar-tabs [data-app="${appName}"]`);
                if (tab) {
                    tab.classList.remove('active');
                }
            }
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            if (mediaPlayer.style.width === '100vw') {
                mediaPlayer.style.width = '350px';
                mediaPlayer.style.height = '450px';
                mediaPlayer.style.top = '50%';
                mediaPlayer.style.left = '50%';
                mediaPlayer.style.transform = 'translate(-50%, -50%)';
            } else {
                mediaPlayer.style.width = '100vw';
                mediaPlayer.style.height = '100vh';
                mediaPlayer.style.top = '0';
                mediaPlayer.style.left = '0';
                mediaPlayer.style.transform = 'none';
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mediaPlayer.style.display = 'none';
            isPlaying = false;
            if (progressInterval) clearInterval(progressInterval);
            
            // Remove from taskbar and open windows tracking
            const appName = getAppNameFromWindowId('media-window');
            if (appName) {
                removeTab(appName);
                openWindows.delete(appName);
            }
        });
    }
    
    // Media controls
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const vinylDisc = mediaPlayer.querySelector('.vinyl-disc');
            
            if (isPlaying) {
                // Pause audio
                audioPlayer.pause();
                isPlaying = false;
                playBtn.innerHTML = '▶️';
                if (vinylDisc) {
                    vinylDisc.style.animationPlayState = 'paused';
                }
                stopProgress();
            } else {
                // Play audio
                audioPlayer.play().then(() => {
                    isPlaying = true;
                    playBtn.innerHTML = '⏸️';
                    if (vinylDisc) {
                        vinylDisc.style.animationPlayState = 'running';
                    }
                    startProgress();
                }).catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        });
    }
    
    // Progress bar click
    if (progressBar && audioPlayer) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            
            if (audioPlayer.duration) {
                const newTime = percentage * audioPlayer.duration;
                audioPlayer.currentTime = newTime;
                updateProgress();
            }
        });
    }
    
    // Volume control with draggable slider
    let currentVolume = 0.7; // Default volume (70%)
    let isVolumeDragging = false;
    
    if (volumeBar) {
        const volumeFill = volumeBar.querySelector('.volume-fill');
        const volumeIcon = mediaPlayer.querySelector('.volume-icon');
        
        // Initialize volume display
        if (volumeFill) {
            volumeFill.style.width = (currentVolume * 100) + '%';
        }
        
        // Add visual slider handle
        const volumeHandle = document.createElement('div');
        volumeHandle.className = 'volume-handle';
        volumeHandle.style.cssText = `
            position: absolute;
            top: 50%;
            width: 12px;
            height: 12px;
            background: #ff6b9d;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: grab;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            transition: all 0.1s ease;
            z-index: 10;
        `;
        volumeBar.appendChild(volumeHandle);
        
        // Position handle based on current volume
        updateVolumeHandle();
        
        // Mouse down - start dragging
        volumeBar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isVolumeDragging = true;
            volumeHandle.style.cursor = 'grabbing';
            volumeBar.style.cursor = 'grabbing';
            
            // Add dragging class for visual feedback
            volumeBar.classList.add('dragging');
            
            updateVolumeFromMouse(e);
        });
        
        // Mouse move - update volume while dragging
        document.addEventListener('mousemove', (e) => {
            if (isVolumeDragging) {
                e.preventDefault();
                updateVolumeFromMouse(e);
            }
        });
        
        // Mouse up - stop dragging
        document.addEventListener('mouseup', (e) => {
            if (isVolumeDragging) {
                isVolumeDragging = false;
                volumeHandle.style.cursor = 'grab';
                volumeBar.style.cursor = 'pointer';
                volumeBar.classList.remove('dragging');
            }
        });
        
        // Touch events for mobile
        volumeBar.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isVolumeDragging = true;
            volumeBar.classList.add('dragging');
            updateVolumeFromTouch(e);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isVolumeDragging) {
                e.preventDefault();
                updateVolumeFromTouch(e);
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (isVolumeDragging) {
                isVolumeDragging = false;
                volumeBar.classList.remove('dragging');
            }
        });
        
        function updateVolumeFromMouse(e) {
            const rect = volumeBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            
            currentVolume = percentage;
            updateVolumeDisplay();
        }
        
        function updateVolumeFromTouch(e) {
            const rect = volumeBar.getBoundingClientRect();
            const touch = e.touches[0];
            const clickX = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            
            currentVolume = percentage;
            updateVolumeDisplay();
        }
        
        function updateVolumeDisplay() {
            // Update fill bar
            if (volumeFill) {
                volumeFill.style.width = (currentVolume * 100) + '%';
            }
            
            // Update handle position
            updateVolumeHandle();
            
            // Update volume icon
            updateVolumeIcon();
            
            // Set volume on audio element
            if (audioPlayer) {
                audioPlayer.volume = currentVolume;
            }
            
            console.log(`Volume set to: ${Math.round(currentVolume * 100)}%`);
        }
        
        function updateVolumeHandle() {
            if (volumeHandle) {
                const percentage = currentVolume * 100;
                volumeHandle.style.left = percentage + '%';
            }
        }
        
        function updateVolumeIcon() {
            if (volumeIcon) {
                if (currentVolume === 0) {
                    volumeIcon.textContent = '🔇';
                } else if (currentVolume < 0.3) {
                    volumeIcon.textContent = '🔈';
                } else if (currentVolume < 0.7) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }
        }
    }
    
    // Progress simulation
    function startProgress() {
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (audioPlayer && !audioPlayer.paused) {
                updateProgress();
            }
        }, 100);
    }
    
    function stopProgress() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
    
    function updateProgress() {
        const progressFill = mediaPlayer.querySelector('.progress-fill');
        const currentTimeDisplay = mediaPlayer.querySelector('.current-time');
        const totalTimeDisplay = mediaPlayer.querySelector('.total-time');
        
        if (audioPlayer && audioPlayer.duration) {
            const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            
            if (progressFill) {
                progressFill.style.width = percentage + '%';
            }
            
            if (currentTimeDisplay) {
                const minutes = Math.floor(audioPlayer.currentTime / 60);
                const seconds = Math.floor(audioPlayer.currentTime % 60);
                currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (totalTimeDisplay) {
                const minutes = Math.floor(audioPlayer.duration / 60);
                const seconds = Math.floor(audioPlayer.duration % 60);
                totalTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }
    
    // Audio event listeners
    if (audioPlayer) {
        audioPlayer.addEventListener('loadedmetadata', () => {
            updateProgress();
        });
        
        audioPlayer.addEventListener('timeupdate', () => {
            updateProgress();
        });
        
        audioPlayer.addEventListener('ended', () => {
            isPlaying = false;
            if (playBtn) {
                playBtn.innerHTML = '▶️';
            }
            if (vinylDisc) {
                vinylDisc.style.animationPlayState = 'paused';
            }
            stopProgress();
        });
    }
    
    // Initialize progress
    updateProgress();
    
    // Expose volume control for external use (when audio is added)
    window.mediaPlayerVolume = {
        getVolume: () => currentVolume,
        setVolume: (volume) => {
            currentVolume = Math.max(0, Math.min(1, volume));
            const volumeFill = mediaPlayer.querySelector('.volume-fill');
            const volumeIcon = mediaPlayer.querySelector('.volume-icon');
            
            if (volumeFill) {
                volumeFill.style.width = (currentVolume * 100) + '%';
            }
            
            if (volumeIcon) {
                if (currentVolume === 0) {
                    volumeIcon.textContent = '🔇';
                } else if (currentVolume < 0.3) {
                    volumeIcon.textContent = '🔈';
                } else if (currentVolume < 0.7) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }
            
            // Set volume on audio element
            if (audioPlayer) {
                audioPlayer.volume = currentVolume;
            }
        }
    };
    
    // Make media player draggable
    let isMediaDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    mediaPlayer.addEventListener('mousedown', (e) => {
        // Don't start dragging if clicking on control buttons
        if (e.target.classList.contains('window-btn') || 
            e.target.classList.contains('play-btn') || 
            e.target.classList.contains('control-btn') ||
            e.target.closest('.player-controls') ||
            e.target.closest('.controls-section')) {
            return;
        }
        
        isMediaDragging = true;
        const rect = mediaPlayer.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        // Bring to front
        mediaPlayer.style.zIndex = getHighestZIndex() + 1;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isMediaDragging) return;
        
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        mediaPlayer.style.left = x + 'px';
        mediaPlayer.style.top = y + 'px';
        mediaPlayer.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', () => {
        isMediaDragging = false;
    });
}

// ===== TASKBAR FUNCTIONALITY =====
let openWindows = new Map(); // Track open windows

// Taskbar functionality is now initialized in the main DOMContentLoaded listener

function initializeTaskbar() {
    // Add click handlers for taskbar icons
    document.querySelectorAll('.taskbar-icon[data-app]').forEach(icon => {
        icon.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            toggleWindow(app);
        });
    });
}

// Initialize taskbar functionality after the function is defined
initializeTaskbar();

function toggleWindow(appName) {
    const windowMap = {
        'trading': 'trading-window',
        'scanner': 'scanner-window', 
        'messenger': 'messenger-window',
        'media': 'media-window',
        'degen': 'degen-window',
        'browser': 'netscape-window'
    };
    
    const windowId = windowMap[appName];
    if (!windowId) return;
    
    const window = document.getElementById(windowId);
    if (!window) return;
    
    const isVisible = window.style.display === 'block' || window.style.display === 'flex';
    
    if (isVisible) {
        // Close window
        window.style.display = 'none';
        removeTab(appName);
        openWindows.delete(appName);
    } else {
        // Open window
        window.style.display = 'block';
        if (windowId === 'media-window') {
            window.style.display = 'flex';
        }
        
        // Ensure proper positioning for restored windows
        if (windowId === 'netscape-window') {
            // Browser window positioning is handled by CSS, just ensure it's centered
            window.style.top = '50%';
            window.style.left = '50%';
            window.style.transform = 'translate(-50%, -50%)';
        } else if (windowId === 'media-window') {
            // Media player positioning is handled by its own CSS
            // Just ensure it's visible
        } else {
            // Other app windows should be centered
            window.style.top = '50%';
            window.style.left = '50%';
            window.style.transform = 'translate(-50%, -50%)';
        }
        
        addTab(appName);
        openWindows.set(appName, windowId);
        
        // Bring to front
        const highestZ = getHighestZIndex();
        window.style.zIndex = highestZ + 1;
    }
}

function addTab(appName) {
    const tabsContainer = document.getElementById('taskbar-tabs');
    if (!tabsContainer) return;
    
    // Check if tab already exists
    if (tabsContainer.querySelector(`[data-app="${appName}"]`)) return;
    
    const appInfo = {
        'trading': { icon: '📈', title: 'Trading Terminal' },
        'scanner': { icon: '🔍', title: 'Rug Scanner' },
        'messenger': { icon: '💬', title: 'MSN Messenger' },
        'media': { icon: '🎵', title: 'Media Player' },
        'degen': { icon: '🎰', title: 'Degen Mode' },
        'browser': { icon: '🌐', title: 'Netscape Navigator' }
    };
    
    const info = appInfo[appName];
    if (!info) return;
    
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab active';
    tab.setAttribute('data-app', appName);
    tab.innerHTML = `
        <span class="tab-icon">${info.icon}</span>
        <span class="tab-title">${info.title}</span>
        <span class="tab-close">×</span>
    `;
    
    // Add click handlers
    tab.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-close')) {
            e.stopPropagation();
            closeWindow(appName);
        } else {
            focusWindow(appName);
        }
    });
    
    tabsContainer.appendChild(tab);
}

function removeTab(appName) {
    const tab = document.querySelector(`#taskbar-tabs [data-app="${appName}"]`);
    if (tab) {
        tab.remove();
    }
}

function closeWindow(appName) {
    const windowMap = {
        'trading': 'trading-window',
        'scanner': 'scanner-window', 
        'messenger': 'messenger-window',
        'media': 'media-window',
        'degen': 'degen-window',
        'browser': 'netscape-window'
    };
    
    const windowId = windowMap[appName];
    if (!windowId) return;
    
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'none';
    }
    
    removeTab(appName);
    openWindows.delete(appName);
}

function focusWindow(appName) {
    const windowMap = {
        'trading': 'trading-window',
        'scanner': 'scanner-window', 
        'messenger': 'messenger-window',
        'media': 'media-window',
        'degen': 'degen-window',
        'browser': 'netscape-window'
    };
    
    const windowId = windowMap[appName];
    if (!windowId) return;
    
    const window = document.getElementById(windowId);
    if (window && (window.style.display === 'block' || window.style.display === 'flex')) {
        // Bring to front
        const highestZ = getHighestZIndex();
        window.style.zIndex = highestZ + 1;
        
        // Update active tab
        document.querySelectorAll('.taskbar-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`#taskbar-tabs [data-app="${appName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
}

function updateTimeDisplay() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) return;
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Initialize time display after the function is defined
updateTimeDisplay();

function getAppNameFromWindowId(windowId) {
    const windowMap = {
        'trading-window': 'trading',
        'scanner-window': 'scanner', 
        'messenger-window': 'messenger',
        'meme-window': 'meme',
        'media-window': 'media',
        'degen-window': 'degen',
        'netscape-window': 'browser'
    };
    return windowMap[windowId];
}

// ===== MEME FOLDER FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Meme item click handlers
    document.querySelectorAll('.meme-item').forEach(item => {
        item.addEventListener('click', function() {
            const memeName = this.getAttribute('data-meme');
            const memeSrc = `memes/${memeName}`;
            openMemeViewer(memeSrc, memeName);
        });
    });

    // Meme viewer close handler
    const memeViewerClose = document.getElementById('meme-viewer-close');
    if (memeViewerClose) {
        memeViewerClose.addEventListener('click', closeMemeViewer);
    }

    // Meme viewer background click to close
    const memeViewer = document.getElementById('meme-viewer');
    if (memeViewer) {
        memeViewer.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMemeViewer();
            }
        });
    }

    // Meme action buttons
    const memeDownload = document.getElementById('meme-download');
    const memeShare = document.getElementById('meme-share');
    const memeFavorite = document.getElementById('meme-favorite');

    if (memeDownload) {
        memeDownload.addEventListener('click', function() {
            const img = document.getElementById('meme-viewer-image');
            if (img) {
                downloadMeme(img.src);
            }
        });
    }

    if (memeShare) {
        memeShare.addEventListener('click', function() {
            const img = document.getElementById('meme-viewer-image');
            if (img) {
                shareMeme(img.src);
            }
        });
    }

    if (memeFavorite) {
        memeFavorite.addEventListener('click', function() {
            favoriteMeme();
        });
    }
});

function openMemeViewer(memeSrc, memeName) {
    const viewer = document.getElementById('meme-viewer');
    const title = document.getElementById('meme-viewer-title');
    const img = document.getElementById('meme-viewer-image');
    
    if (viewer && title && img) {
        title.textContent = memeName;
        img.src = memeSrc;
        img.alt = memeName;
        viewer.style.display = 'flex';
        
        // Add some fun effects
        viewer.style.opacity = '0';
        viewer.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            viewer.style.transition = 'all 0.3s ease';
            viewer.style.opacity = '1';
            viewer.style.transform = 'scale(1)';
        }, 10);
    }
}

function closeMemeViewer() {
    const viewer = document.getElementById('meme-viewer');
    if (viewer) {
        viewer.style.transition = 'all 0.3s ease';
        viewer.style.opacity = '0';
        viewer.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            viewer.style.display = 'none';
        }, 300);
    }
}

function downloadMeme(memeSrc) {
    const link = document.createElement('a');
    link.href = memeSrc;
    link.download = memeSrc.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show feedback
    showMemeFeedback('💾 Meme downloaded!');
}

function shareMeme(memeSrc) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this dank meme!',
            text: 'Look at this Y2K meme I found!',
            url: window.location.href
                    });
                } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMemeFeedback('📤 Link copied to clipboard!');
        });
    }
}

function favoriteMeme() {
    const btn = document.getElementById('meme-favorite');
    if (btn) {
        btn.textContent = '❤️ Favorited!';
        btn.style.background = '#dc3545';
        
        setTimeout(() => {
            btn.textContent = '❤️ Favorite';
            btn.style.background = '#007bff';
        }, 2000);
    }
    
    showMemeFeedback('❤️ Added to favorites!');
}

function showMemeFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10001;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

// Add CSS animations for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);


