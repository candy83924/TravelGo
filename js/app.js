// ===== TravelGo App v8 - Google Places Integration =====

// ===== Security Utilities =====

// B. Input Sanitization (XSS Prevention)
function sanitizeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// C. localStorage Integrity
function simpleChecksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash |= 0; // Convert to 32-bit integer
    }
    return hash.toString(36);
}

function secureStore(key, data) {
    try {
        const jsonStr = JSON.stringify(data);
        const checksum = simpleChecksum(jsonStr);
        const wrapper = JSON.stringify({ d: jsonStr, c: checksum });
        localStorage.setItem(key, wrapper);
        return true;
    } catch (e) {
        console.error('secureStore error:', e);
        return false;
    }
}

function secureLoad(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const wrapper = JSON.parse(raw);
        if (!wrapper.d || !wrapper.c) return null;
        const checksum = simpleChecksum(wrapper.d);
        if (checksum !== wrapper.c) {
            console.warn('Data integrity check failed for key:', key);
            return null;
        }
        return JSON.parse(wrapper.d);
    } catch (e) {
        console.error('secureLoad error:', e);
        return null;
    }
}

// D. YouTube URL Validation
function isValidYouTubeUrl(url) {
    return /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/.test(url);
}

// E. Rate Limiter
const _rateLimitTimestamps = {};
function rateLimited(actionKey, cooldownMs) {
    const now = Date.now();
    if (_rateLimitTimestamps[actionKey] && (now - _rateLimitTimestamps[actionKey]) < cooldownMs) {
        return true; // still in cooldown
    }
    _rateLimitTimestamps[actionKey] = now;
    return false;
}

// F. Haptic Feedback
function hapticFeedback(type = 'light') {
    if (!navigator.vibrate) return;
    switch(type) {
        case 'light': navigator.vibrate(10); break;
        case 'medium': navigator.vibrate(25); break;
        case 'heavy': navigator.vibrate([30, 10, 30]); break;
        case 'success': navigator.vibrate([10, 30, 10, 30, 50]); break;
        case 'error': navigator.vibrate([50, 20, 50]); break;
    }
}

// YouTube 推薦影片資料庫
const YT_RECOMMENDATIONS = {
    hualien: [
        { title: '花蓮三天兩夜行程全攻略！在地人帶路必去景點', videoId: '5PEbCHBMXrY', channel: '旅遊達人', views: '125萬', thumb: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=240&h=135&fit=crop' },
        { title: '太魯閣一日遊｜砂卡礑步道＋燕子口＋白楊步道', videoId: 'KJWBfMBp38o', channel: '山林探險家', views: '89萬', thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=240&h=135&fit=crop' },
        { title: '花蓮美食TOP10！公正包子、炸彈蔥油餅全攻略', videoId: 'qGc0Ew7t2yA', channel: '美食旅行', views: '67萬', thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=240&h=135&fit=crop' },
        { title: '七星潭日出＋清水斷崖｜花蓮最美海岸線', videoId: 'T7os0ya7RE4', channel: '攝影旅人', views: '52萬', thumb: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=240&h=135&fit=crop' },
        { title: '花蓮住宿推薦｜6間高CP值飯店民宿評比', videoId: 'xIxsKMERW_Y', channel: '旅宿評鑑', views: '38萬', thumb: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=240&h=135&fit=crop' },
    ],
};

// YouTube URL 解析後的模擬回傳
const YT_PARSE_RESULTS = {
    default: {
        title: '花蓮四天三夜完整攻略',
        spots: [
            { name: '太魯閣國家公園', type: 'attraction' },
            { name: '七星潭', type: 'attraction' },
            { name: '清水斷崖', type: 'attraction' },
            { name: '東大門夜市', type: 'attraction' },
            { name: '公正包子店', type: 'restaurant' },
            { name: '賴桑壽司屋', type: 'restaurant' },
            { name: '炸彈蔥油餅', type: 'restaurant' },
            { name: '雲山水夢幻湖', type: 'attraction' },
            { name: '砂卡礑步道', type: 'attraction' },
        ]
    }
};

class TravelApp {
    constructor() {
        this.mapManager = null;
        this.currentTab = 'itinerary';
        this.selectedCity = 'hualien';
        this.selectedDays = 4;
        this.startDate = null;
        this.selectedTransport = 'train';
        this.departureCity = 'taipei';
        this.selectedHotel = null;
        this.generatedItinerary = null;
        this.editMode = false;
        this.preferences = { rating: 4.0, mealBudget: 500, includeTicket: true, includeFree: true };
        this.attractionsPerDay = 3;
        this.mealBudgets = { breakfast: 150, lunch: 300, dinner: 500 };
        this.perDayTimes = [];
        this.googleApiKey = '';
        this._googleSearchResults = []; // 暫存 Google 搜尋結果
        this.init();
    }

    init() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.startDate = tomorrow;

        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
                document.getElementById('app').classList.remove('hidden');
                this.mapManager = new MapManager();
                this.setupAll();
            }, 500);
        }, 2500);
    }

    setupAll() {
        this.renderCityGrid();
        this.renderTransportOptions();
        this.setupDateInput();
        this.setupDayButtons();
        this.setupCustomDays();
        this.setupPreferences();
        this.setupDestTabs();
        this.renderHotelList();
        this.setupYouTube();
        this.setupDailySettings();
        this.setupEventListeners();
    }

    // ===== City Grid =====
    renderCityGrid() {
        const grid = document.getElementById('city-grid');
        grid.innerHTML = TAIWAN_CITIES.map(c => `
            <button class="city-btn ${c.id === this.selectedCity ? 'active' : ''}" data-city="${c.id}">
                ${c.name}<span class="city-region">${c.region}</span>
            </button>`).join('');
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.city-btn');
            if (!btn) return;
            hapticFeedback('light');
            grid.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.selectedCity = btn.dataset.city;
            this.selectedHotel = null;
            this.renderHotelList();
            this.renderTransportOptions();
            this.renderYTRecommendations();
        });
    }

    setupDestTabs() {
        document.querySelectorAll('.dest-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.dest-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.dest-mode').forEach(m => m.classList.remove('active'));
                document.getElementById(`dest-${tab.dataset.destMode}-mode`).classList.add('active');
            });
        });
    }

    // ===== Date =====
    setupDateInput() {
        const input = document.getElementById('start-date');
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        input.value = tomorrow.toISOString().split('T')[0];
        input.min = new Date().toISOString().split('T')[0];
        input.addEventListener('change', (e) => { this.startDate = new Date(e.target.value); });
    }

    setupDayButtons() {
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDays = parseInt(btn.dataset.days);
                document.getElementById('custom-days').value = this.selectedDays;
                this.updateDaysLabel();
                this.renderPerDayTimes();
            });
        });
    }

    setupCustomDays() {
        const input = document.getElementById('custom-days');
        document.getElementById('days-minus').addEventListener('click', () => {
            if (this.selectedDays > 1) { this.selectedDays--; input.value = this.selectedDays; this.updateDaysLabel(); this.highlightDayBtn(); this.renderPerDayTimes(); }
        });
        document.getElementById('days-plus').addEventListener('click', () => {
            if (this.selectedDays < 14) { this.selectedDays++; input.value = this.selectedDays; this.updateDaysLabel(); this.highlightDayBtn(); this.renderPerDayTimes(); }
        });
        input.addEventListener('change', () => {
            this.selectedDays = Math.max(1, Math.min(14, parseInt(input.value) || 4));
            input.value = this.selectedDays; this.updateDaysLabel(); this.highlightDayBtn(); this.renderPerDayTimes();
        });
        this.updateDaysLabel();
        this.renderPerDayTimes();
    }

    updateDaysLabel() { document.getElementById('days-label').textContent = `天 ${this.selectedDays - 1} 夜`; }
    highlightDayBtn() { document.querySelectorAll('.day-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.days) === this.selectedDays)); }

    // ===== Daily Settings (attractions per day + meal budgets) =====
    setupDailySettings() {
        const attrInput = document.getElementById('attractions-per-day');
        document.getElementById('attr-minus').addEventListener('click', () => {
            if (this.attractionsPerDay > 1) { this.attractionsPerDay--; attrInput.value = this.attractionsPerDay; }
        });
        document.getElementById('attr-plus').addEventListener('click', () => {
            if (this.attractionsPerDay < 5) { this.attractionsPerDay++; attrInput.value = this.attractionsPerDay; }
        });
        attrInput.addEventListener('change', () => {
            this.attractionsPerDay = Math.max(1, Math.min(5, parseInt(attrInput.value) || 3));
            attrInput.value = this.attractionsPerDay;
        });

        document.getElementById('meal-breakfast').addEventListener('change', (e) => {
            this.mealBudgets.breakfast = Math.max(0, parseInt(e.target.value) || 0);
            e.target.value = this.mealBudgets.breakfast;
        });
        document.getElementById('meal-lunch').addEventListener('change', (e) => {
            this.mealBudgets.lunch = Math.max(0, parseInt(e.target.value) || 0);
            e.target.value = this.mealBudgets.lunch;
        });
        document.getElementById('meal-dinner').addEventListener('change', (e) => {
            this.mealBudgets.dinner = Math.max(0, parseInt(e.target.value) || 0);
            e.target.value = this.mealBudgets.dinner;
        });
    }

    renderPerDayTimes() {
        const container = document.getElementById('per-day-times-container');
        if (!container || !this.selectedDays) return;
        if (this.perDayTimes.length !== this.selectedDays) {
            this.perDayTimes = [];
            for (let i = 0; i < this.selectedDays; i++) {
                this.perDayTimes.push({ start: '09:00', end: '21:00' });
            }
        }
        container.innerHTML = this.perDayTimes.map((t, i) => `
            <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;padding:0.5rem;background:rgba(255,143,163,0.05);border-radius:var(--radius-sm)">
                <span style="font-size:0.8rem;font-weight:600;color:var(--primary);min-width:3rem">Day ${i+1}</span>
                <input type="time" class="input-field" value="${t.start}" onchange="app.perDayTimes[${i}].start=this.value" style="flex:1;padding:0.4rem;font-size:0.8rem">
                <span style="color:var(--text-secondary);font-size:0.8rem">～</span>
                <input type="time" class="input-field" value="${t.end}" onchange="app.perDayTimes[${i}].end=this.value" style="flex:1;padding:0.4rem;font-size:0.8rem">
            </div>
        `).join('');
    }

    // ===== Preferences =====
    setupPreferences() {
        document.getElementById('pref-rating').addEventListener('input', (e) => {
            this.preferences.rating = parseFloat(e.target.value);
            document.getElementById('pref-rating-val').textContent = this.preferences.rating.toFixed(1);
        });
        document.getElementById('pref-meal-budget').addEventListener('input', (e) => {
            this.preferences.mealBudget = parseInt(e.target.value);
            document.getElementById('pref-meal-val').textContent = `NT$${this.preferences.mealBudget}`;
        });
        document.getElementById('pref-ticket').addEventListener('change', (e) => { this.preferences.includeTicket = e.target.checked; });
        document.getElementById('pref-free').addEventListener('change', (e) => { this.preferences.includeFree = e.target.checked; });
    }

    // ===== Transport =====
    renderTransportOptions() {
        const grid = document.getElementById('transport-select-grid');
        const depRoutes = DEPARTURE_ROUTES[this.departureCity]?.transports[this.selectedCity];
        const availableTypes = depRoutes ? depRoutes.map(r => r.type) : null;
        const options = availableTypes ? TRANSPORT_OPTIONS.filter(t => availableTypes.includes(t.id)) : TRANSPORT_OPTIONS;
        // If current selection is not available, default to first available
        if (options.length > 0 && !options.find(t => t.id === this.selectedTransport)) {
            this.selectedTransport = options[0].id;
        }
        grid.innerHTML = options.map(t => {
            const route = depRoutes?.find(r => r.type === t.id);
            const priceInfo = route ? ` · NT$${route.price}` : '';
            return `<div class="transport-option ${t.id === this.selectedTransport ? 'active' : ''}" data-transport="${t.id}">
                <div class="t-icon ${t.iconClass}"><i class="fas ${t.icon}"></i></div>
                <div class="t-info"><div class="t-name">${t.name}</div><div class="t-detail">${t.detail}${priceInfo}</div></div>
            </div>`;
        }).join('');
        grid.addEventListener('click', (e) => {
            const opt = e.target.closest('.transport-option');
            if (!opt) return;
            grid.querySelectorAll('.transport-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            this.selectedTransport = opt.dataset.transport;
        });
    }

    // ===== Hotel List (with editable prices) =====
    renderHotelList() {
        const container = document.getElementById('hotel-list');
        const data = getDestData(this.selectedCity);
        if (!data?.hotels) { container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:1rem">此目的地住宿資料建置中</p>'; return; }

        // 在住宿列表上方插入 Google 搜尋（只插入一次）
        let searchWrap = document.getElementById('gp-hotel-search-wrap');
        if (!searchWrap) {
            searchWrap = document.createElement('div');
            searchWrap.id = 'gp-hotel-search-wrap';
            searchWrap.innerHTML = `
                <div class="gp-search-section" style="margin-bottom:0.8rem">
                    <div class="gp-search-bar">
                        <i class="fas fa-search gp-search-icon"></i>
                        <input type="text" id="gp-search-hotels" class="input-field gp-search-input" placeholder="🔍 搜尋 Google 地圖上的住宿...">
                        <button class="gp-search-btn" onclick="app.doGoogleSearch('hotels')"><i class="fas fa-search"></i></button>
                    </div>
                    <div id="gp-results-hotels" class="gp-results-container"></div>
                </div>`;
            container.parentNode.insertBefore(searchWrap, container);
            document.getElementById('gp-search-hotels')?.addEventListener('keypress', e => { if(e.key==='Enter') app.doGoogleSearch('hotels'); });
        }

        const priceFilter = document.getElementById('hotel-price-filter')?.value || 'all';
        const ratingFilter = parseFloat(document.getElementById('hotel-rating-filter')?.value || '0');

        let hotels = data.hotels.filter(h => {
            const best = Math.min(...Object.values(h.prices));
            if (ratingFilter > 0 && h.rating < ratingFilter) return false;
            if (priceFilter === 'budget' && best > 2000) return false;
            if (priceFilter === 'mid' && (best < 2000 || best > 5000)) return false;
            if (priceFilter === 'high' && best < 5000) return false;
            return true;
        });

        container.innerHTML = hotels.map(h => {
            const bp = this.getBestPrice(h.prices);
            const sel = this.selectedHotel?.id === h.id;
            return `<div class="hotel-option ${sel ? 'selected' : ''}" data-hotel-id="${h.id}">
                <div class="hotel-thumb" style="background-image:url('${h.image}')"></div>
                <div class="hotel-info">
                    <div class="hotel-name">${h.name} <span style="color:#fbbf24">★</span> ${h.rating}</div>
                    <div class="hotel-meta">${h.type} · ${h.address}</div>
                    <div class="hotel-prices">${this.renderPlatformPrices(h)}</div>
                    ${h.lat && h.lng ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name)}+${h.lat},${h.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a>` : ''}
                </div>
            </div>`;
        }).join('');

        container.querySelectorAll('.hotel-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                if (e.target.classList.contains('price-input-inline')) return;
                hapticFeedback('light');
                const hid = opt.dataset.hotelId;
                this.selectedHotel = data.hotels.find(h => h.id === hid) || this._googleHotels?.find(h => h.id === hid);
                container.querySelectorAll('.hotel-option').forEach(o => o.classList.remove('selected'));
                // Also deselect Google hotel results
                document.querySelectorAll('#gp-results-hotels .hotel-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });

        // Price input listeners
        container.querySelectorAll('.price-input-inline').forEach(input => {
            input.addEventListener('change', (e) => {
                const hid = e.target.dataset.hotelId;
                const platform = e.target.dataset.platform;
                const val = parseInt(e.target.value) || 0;
                const hotel = data.hotels.find(h => h.id === hid);
                if (hotel) hotel.prices[platform] = val;
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });

        // Filter listeners (only bind once)
        if (!this._hotelFiltersBound) {
            ['hotel-price-filter', 'hotel-rating-filter', 'booking-platform'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', () => this.renderHotelList());
            });
            this._hotelFiltersBound = true;
        }
    }

    getBestPrice(prices) {
        let best = { platform: '', price: Infinity };
        for (const [p, v] of Object.entries(prices)) { if (v < best.price) best = { platform: p, price: v }; }
        return best;
    }

    renderPlatformPrices(hotel) {
        const filterPlatform = document.getElementById('booking-platform')?.value || 'all';
        const platforms = filterPlatform === 'all' ? Object.keys(hotel.prices) : [filterPlatform];
        const bp = this.getBestPrice(hotel.prices);
        return platforms.map(p => {
            if (!hotel.prices[p] && hotel.prices[p] !== 0) return '';
            const isBest = p === bp.platform;
            return `<span class="platform-price ${p} ${isBest ? 'best' : ''}">${p} $<input type="number" class="price-input-inline" value="${hotel.prices[p]}" data-hotel-id="${hotel.id}" data-platform="${p}" min="0" step="100">${isBest ? ' ✓' : ''}</span>`;
        }).join('');
    }

    // ===== Custom Hotel =====
    addCustomHotel() {
        const name = document.getElementById('custom-hotel-name').value.trim();
        const address = document.getElementById('custom-hotel-address').value.trim();
        const price = parseInt(document.getElementById('custom-hotel-price').value) || 0;
        const rating = parseFloat(document.getElementById('custom-hotel-rating').value) || 4.0;
        const lat = parseFloat(document.getElementById('custom-hotel-lat').value) || null;
        const lng = parseFloat(document.getElementById('custom-hotel-lng').value) || null;

        // D. Input Validation
        if (!name) { this.showToast('請輸入住宿名稱'); return; }
        if (price <= 0) { this.showToast('請輸入有效的每晚價格（大於 0）'); return; }
        if (rating < 1 || rating > 5) { this.showToast('評分需在 1-5 之間'); return; }
        if (lat !== null && (lat < -90 || lat > 90)) { this.showToast('緯度需在 -90 到 90 之間'); return; }
        if (lng !== null && (lng < -180 || lng > 180)) { this.showToast('經度需在 -180 到 180 之間'); return; }

        const data = getDestData(this.selectedCity);
        const centerLat = lat || data.center.lat;
        const centerLng = lng || data.center.lng;

        const customHotel = {
            id: 'custom_' + Date.now(),
            name: name,
            type: '自訂住宿',
            rating: Math.min(5, Math.max(1, rating)),
            reviews: 0,
            lat: centerLat,
            lng: centerLng,
            address: address || '自行填入',
            description: '使用者自行填入的住宿選項',
            amenities: [],
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
            prices: { agoda: price, booking: price, trip: price, trivago: price },
            roomTypes: [
                { name: '標準房', prices: { agoda: price, booking: price, trip: price, trivago: price } },
            ],
        };

        this.selectedHotel = customHotel;

        // Clear inputs
        document.getElementById('custom-hotel-name').value = '';
        document.getElementById('custom-hotel-address').value = '';
        document.getElementById('custom-hotel-price').value = '';
        document.getElementById('custom-hotel-rating').value = '';
        document.getElementById('custom-hotel-lat').value = '';
        document.getElementById('custom-hotel-lng').value = '';

        // Deselect any existing hotel option
        document.querySelectorAll('.hotel-option').forEach(o => o.classList.remove('selected'));

        this.showToast(`已選擇自訂住宿：${sanitizeHTML(name)} (NT$${price}/晚)`);
    }

    // ===== YouTube =====
    setupYouTube() {
        document.getElementById('btn-parse-yt').addEventListener('click', () => this.parseYouTubeUrl());
        this.renderYTRecommendations();
    }

    parseYouTubeUrl() {
        try {
            const url = document.getElementById('youtube-url').value.trim();
            if (!url) { this.showToast('請輸入 YouTube 網址'); return; }
            if (!isValidYouTubeUrl(url)) { this.showToast('請輸入有效的 YouTube 網址（youtube.com 或 youtu.be）'); return; }

            const container = document.getElementById('yt-parsed-result');
            container.innerHTML = '<div style="text-align:center;padding:0.5rem;color:var(--text-light)"><i class="fas fa-spinner fa-spin"></i> 正在分析影片內容...</div>';

            setTimeout(() => {
                const result = YT_PARSE_RESULTS.default;
                container.innerHTML = `
                    <div class="yt-parsed-card">
                        <h4><i class="fab fa-youtube" style="color:#ff0000"></i> 影片行程擷取結果</h4>
                        <p style="font-size:0.8rem;color:var(--text-secondary)">${sanitizeHTML(result.title)}</p>
                        <div class="yt-spots">
                            ${result.spots.map(s => `
                                <span class="yt-spot-tag" data-name="${sanitizeHTML(s.name)}" data-type="${sanitizeHTML(s.type)}" onclick="app.toggleYTSpot(this)">
                                    <i class="fas ${s.type === 'restaurant' ? 'fa-utensils' : 'fa-map-marker-alt'}"></i> ${sanitizeHTML(s.name)}
                                </span>
                            `).join('')}
                        </div>
                        <p style="font-size:0.7rem;color:var(--text-light);margin-top:0.5rem"><i class="fas fa-info-circle"></i> 點擊標籤可加入/移除行程參考</p>
                    </div>
                `;
                this.showToast('影片內容分析完成！');
            }, 1200);
        } catch (e) {
            console.error('parseYouTubeUrl error:', e);
            this.showToast('影片分析發生錯誤，請稍後再試');
        }
    }

    toggleYTSpot(el) {
        el.classList.toggle('added');
        const name = el.dataset.name;
        const action = el.classList.contains('added') ? '已加入' : '已移除';
        this.showToast(`${name} ${action}參考清單`);
    }

    renderYTRecommendations() {
        const container = document.getElementById('yt-recommend-list');
        const videos = YT_RECOMMENDATIONS[this.selectedCity] || YT_RECOMMENDATIONS.hualien;
        container.innerHTML = videos.map(v => `
            <div class="yt-video-card" onclick="app.showYTPlayer('${v.videoId}')">
                <div class="yt-video-thumb">
                    <img src="${v.thumb}" alt="${v.title}">
                    <span class="play-icon"><i class="fas fa-play"></i></span>
                </div>
                <div class="yt-video-info">
                    <div class="yt-video-title">${v.title}</div>
                    <div class="yt-video-meta">${v.channel} · ${v.views}次觀看</div>
                    <div style="margin-top:0.3rem"><a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()" style="background:#fff0f0;color:#ff0000;border-color:rgba(255,0,0,0.2)"><i class="fab fa-youtube"></i> 開啟 YouTube</a></div>
                </div>
            </div>
        `).join('');
    }

    // ===== YouTube Player Modal (info card, no iframe) =====
    showYTPlayer(videoId) {
        const allVideos = Object.values(YT_RECOMMENDATIONS).flat();
        const video = allVideos.find(v => v.videoId === videoId);
        const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const thumbUrl = video ? video.thumb : `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=480&h=270&fit=crop`;
        const title = video ? video.title : '旅遊影片';
        const channel = video ? video.channel : '';
        const views = video ? video.views : '';

        const body = document.getElementById('yt-player-body');
        const safeTitle = sanitizeHTML(title);
        const safeChannel = sanitizeHTML(channel);
        const safeViews = sanitizeHTML(views);
        const safeYtUrl = sanitizeHTML(ytUrl);
        body.innerHTML = `
            <img src="${thumbUrl}" alt="${safeTitle}" class="yt-thumb-large">
            <div class="yt-video-title-lg">${safeTitle}</div>
            <div class="yt-channel-info">${safeChannel}${safeViews ? ' · ' + safeViews + '次觀看' : ''}</div>
            <div class="yt-url-display">${safeYtUrl}</div>
            <button class="btn-copy-link" onclick="navigator.clipboard.writeText('${ytUrl}').then(()=>app.showToast('已複製連結！'))">
                <i class="fas fa-copy"></i> 複製 YouTube 連結
            </button>
            <div style="margin-top:0.75rem">
                <a href="${ytUrl}" target="_blank" style="color:#ff0000;font-size:0.85rem;text-decoration:underline">
                    <i class="fab fa-youtube"></i> 在新分頁開啟 YouTube
                </a>
            </div>
        `;
        document.getElementById('yt-player-modal').classList.remove('hidden');
    }

    closeYTPlayer() {
        document.getElementById('yt-player-modal').classList.add('hidden');
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        document.getElementById('btn-generate-trip').addEventListener('click', () => this.generateTrip());
        document.getElementById('btn-back-setup').addEventListener('click', () => {
            document.getElementById('setup-section').classList.remove('hidden');
            document.getElementById('result-section').classList.add('hidden');
            document.getElementById('bottom-nav').style.display = 'none';
        });
        document.querySelectorAll('.tab-btn, .bottom-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        document.getElementById('btn-edit-mode').addEventListener('click', () => this.toggleEditMode());
        document.getElementById('btn-save-itinerary').addEventListener('click', () => this.saveItinerary());
        document.getElementById('btn-save-trip').addEventListener('click', () => this.saveItinerary());
        document.getElementById('btn-load-trip').addEventListener('click', () => this.loadItinerary());
        document.getElementById('btn-export-pdf').addEventListener('click', () => this.exportPDF());
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal('detail-modal'));
        document.getElementById('edit-modal-close').addEventListener('click', () => this.closeModal('edit-modal'));
        const depInput = document.getElementById('departure-city-input');
        if (depInput) {
            depInput.addEventListener('input', (e) => {
                const val = e.target.value;
                const matchKey = Object.keys(DEPARTURE_ROUTES).find(k => DEPARTURE_ROUTES[k].name === val);
                if (matchKey) {
                    this.departureCity = matchKey;
                    this.renderTransportOptions();
                } else if (val.trim()) {
                    this.departureCity = 'custom';
                    this.customDepartureName = val.trim();
                    this.renderTransportOptions();
                }
            });
        }
        document.getElementById('detail-modal').addEventListener('click', (e) => { if (e.target === e.currentTarget) this.closeModal('detail-modal'); });
        document.getElementById('edit-modal').addEventListener('click', (e) => { if (e.target === e.currentTarget) this.closeModal('edit-modal'); });
        document.getElementById('yt-player-modal').addEventListener('click', (e) => { if (e.target === e.currentTarget) this.closeYTPlayer(); });
    }

    // ===== Generate Trip =====
    generateTrip() {
        if (rateLimited('generate', 3000)) { this.showToast('請稍候，不要重複點擊'); return; }
        hapticFeedback('medium');
        if (!this.selectedHotel) { this.showToast('請先選擇住宿！'); return; }
        const sd = document.getElementById('start-date').value;
        if (!sd) { this.showToast('請選擇出發日期！'); return; }
        // D. Date validation
        const selectedDate = new Date(sd);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) { this.showToast('出發日期不能是過去的日期'); return; }
        this.startDate = selectedDate;

        const btn = document.getElementById('btn-generate-trip');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在規劃最佳行程...';
        btn.disabled = true;

        setTimeout(() => {
            this.buildItinerary();
            btn.innerHTML = '<i class="fas fa-check"></i> 行程已產生！';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => {
                document.getElementById('setup-section').classList.add('hidden');
                document.getElementById('result-section').classList.remove('hidden');
                document.getElementById('bottom-nav').style.display = 'flex';
                this.renderTripSummary();
                this.renderMapDayTabs();
                this.switchTab('itinerary');
                // Show all days on map
                this.mapManager.showAllDaysOverview(this.selectedHotel, this.generatedItinerary.days);
                btn.innerHTML = '<i class="fas fa-magic"></i> 🐾 自動產生最佳行程';
                btn.style.background = ''; btn.disabled = false;
            }, 600);
        }, 1200);
    }

    buildItinerary() {
        try {
        const data = getDestData(this.selectedCity);
        const hotel = this.selectedHotel;

        // Helper functions for time math
        function timeToMin(t) { const [h,m] = t.split(':').map(Number); return h*60+m; }
        function minToTime(m) { return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`; }

        // Time slot definitions
        const TIME_SLOTS = {
            breakfast: { start: 420, end: 540 },   // 07:00-09:00
            morning:   { start: 480, end: 660 },    // 08:00-11:00
            lunch:     { start: 690, end: 780 },     // 11:30-13:00
            afternoon: { start: 780, end: 1020 },    // 13:00-17:00
            dinner:    { start: 1050, end: 1170 },   // 17:30-19:30
            evening:   { start: 1080, end: 1260 },   // 18:00-21:00
        };

        // Per-day times will be read inside the loop

        // Check if attraction is a night market
        function isNightMarket(item) {
            if (!item) return false;
            const name = item.name || '';
            return name.includes('夜市') || item.type === '夜市';
        }

        // Determine best time slot for an item
        function getBestSlot(item) {
            if (!item) return null;
            if (item.bestTimeSlot) return item.bestTimeSlot;
            if (isNightMarket(item)) return 'evening';
            return null;
        }

        let attractions = data.attractions.filter(a => {
            if (a.rating < this.preferences.rating) return false;
            if (!this.preferences.includeTicket && a.hasTicket) return false;
            if (!this.preferences.includeFree && !a.hasTicket && a.ticket === 0) return false;
            return true;
        });

        let restaurants = data.restaurants.filter(r => {
            if (r.rating < this.preferences.rating) return false;
            if (r.price > this.preferences.mealBudget) return false;
            return true;
        });

        attractions.forEach(a => { a._dist = haversine(hotel.lat, hotel.lng, a.lat, a.lng); });
        attractions.sort((a, b) => a._dist - b._dist);

        // Separate restaurants by price range for meal type assignment
        const breakfastRestaurants = restaurants.filter(r => r.price <= this.mealBudgets.breakfast);
        const lunchRestaurants = restaurants.filter(r => r.price <= this.mealBudgets.lunch);
        const dinnerRestaurants = restaurants.filter(r => r.price <= this.mealBudgets.dinner);

        // Also separate restaurants by bestTimeSlot
        const breakfastSlotRestaurants = restaurants.filter(r => getBestSlot(r) === 'breakfast');
        const lunchSlotRestaurants = restaurants.filter(r => getBestSlot(r) === 'lunch');
        const dinnerSlotRestaurants = restaurants.filter(r => getBestSlot(r) === 'dinner');

        const days = [];
        const usedA = new Set(), usedR = new Set();

        for (let d = 0; d < this.selectedDays; d++) {
            const date = new Date(this.startDate); date.setDate(date.getDate() + d);
            const items = [], spots = [];
            const isFirst = d === 0, isLast = d === this.selectedDays - 1;
            const dayTimes = this.perDayTimes[d] || { start: '09:00', end: '21:00' };
            const startMin = timeToMin(dayTimes.start);
            const endMin = timeToMin(dayTimes.end);
            let currentMin = startMin; // Track current time position

            // === FIRST DAY: Transport + Arrival ===
            if (isFirst) {
                const depRoutes = DEPARTURE_ROUTES[this.departureCity]?.transports[this.selectedCity];
                const tr = depRoutes?.find(t => t.type === this.selectedTransport) || data.transport?.find(t => t.type === this.selectedTransport);
                const departureTime = minToTime(startMin);
                items.push({ time: departureTime, title: `搭乘${tr?.name || '交通工具'}前往${data.name}`, type: 'transport', desc: tr ? `${tr.route} ${tr.duration} · NT$${tr.price}/人` : '' });

                // Estimate arrival time based on transport duration
                let travelMinutes = 150; // default 2.5 hours
                if (tr?.duration) {
                    const durMatch = tr.duration.match(/(\d+)/);
                    if (durMatch) {
                        const hours = parseFloat(durMatch[1]);
                        travelMinutes = Math.round(hours * 60);
                        // Handle "X小時Y分" format
                        const minMatch = tr.duration.match(/(\d+)\s*分/);
                        if (minMatch) travelMinutes = Math.round(hours * 60) + parseInt(minMatch[1]);
                    }
                }
                const arrivalMin = startMin + travelMinutes;
                const arrivalTime = minToTime(Math.min(arrivalMin, endMin));

                const checkInTime = hotel?.checkIn || '15:00';
                const checkInMin = timeToMin(checkInTime);
                let arrivalDesc = `前往 ${hotel?.name || '飯店'} 放行李（Check-in ${checkInTime}）`;
                if (arrivalMin < checkInMin) {
                    arrivalDesc = `前往 ${hotel?.name || '飯店'} 放行李（Check-in ${checkInTime}，可先寄放行李）`;
                }
                items.push({ time: arrivalTime, title: `抵達${data.name}`, type: 'transport', desc: arrivalDesc });
                currentMin = arrivalMin + 30; // 30 min to settle in
            }

            // === NON-FIRST DAY: Breakfast ===
            if (!isFirst) {
                // Try breakfast-slot restaurants first, then budget-based
                const breakfastR = this.pickMealRestaurant(breakfastSlotRestaurants, breakfastRestaurants, usedR, date)
                    || this.pickMealRestaurant(breakfastRestaurants, restaurants, usedR, date);
                const breakfastTime = Math.max(currentMin, TIME_SLOTS.breakfast.start);
                if (breakfastR) {
                    items.push({ time: minToTime(breakfastTime), title: breakfastR.name, type: 'meal', mealType: 'breakfast', desc: `${breakfastR.recommended?.[0] || ''} ~NT$${breakfastR.price}/人`, spotData: breakfastR });
                    spots.push(breakfastR);
                } else {
                    items.push({ time: minToTime(breakfastTime), title: '飯店早餐', type: 'meal', mealType: 'breakfast', desc: hotel.name });
                }
                currentMin = breakfastTime + 50; // 50 min for breakfast
            }

            // === Collect daily attractions ===
            const dailyCount = isFirst || isLast ? Math.max(1, this.attractionsPerDay - 1) : this.attractionsPerDay;
            const dayAttractions = [];
            let added = 0;
            for (const attr of attractions) {
                if (added >= dailyCount || usedA.has(attr.id)) continue;
                if (!isOpenOnDate(attr, date)) { usedA.add(attr.id); continue; }
                usedA.add(attr.id);
                dayAttractions.push(attr);
                added++;
            }

            // Separate attractions by time slot
            const morningAttrs = dayAttractions.filter(a => getBestSlot(a) === 'morning');
            const afternoonAttrs = dayAttractions.filter(a => getBestSlot(a) === 'afternoon');
            const eveningAttrs = dayAttractions.filter(a => getBestSlot(a) === 'evening' || isNightMarket(a));
            const unslottedAttrs = dayAttractions.filter(a => !getBestSlot(a) && !isNightMarket(a));

            // Distribute unslotted attractions to fill morning/afternoon
            const morningSlots = morningAttrs.length;
            const afternoonSlots = afternoonAttrs.length;
            for (const attr of unslottedAttrs) {
                if (morningAttrs.length <= afternoonAttrs.length) {
                    morningAttrs.push(attr);
                } else {
                    afternoonAttrs.push(attr);
                }
            }

            // === Schedule morning attractions ===
            const morningStartMin = isFirst ? currentMin : Math.max(currentMin, TIME_SLOTS.morning.start);
            let morningCurrent = morningStartMin;
            for (const attr of morningAttrs) {
                if (morningCurrent + 20 > endMin) break; // Don't go past daily end
                const schedTime = Math.max(morningCurrent, TIME_SLOTS.morning.start);
                items.push({
                    time: minToTime(schedTime),
                    title: attr.name,
                    type: 'attraction',
                    desc: attr.description ? attr.description.substring(0, 50) + '...' : '',
                    spotData: attr,
                    isOpen: true
                });
                spots.push(attr);
                morningCurrent = schedTime + 110; // ~1.5-2 hours + 20 min travel
            }
            currentMin = Math.max(currentMin, morningCurrent);

            // === Lunch ===
            const lunchTime = Math.max(currentMin, TIME_SLOTS.lunch.start);
            const lunch = this.pickMealRestaurant(lunchSlotRestaurants, lunchRestaurants, usedR, date)
                || this.pickMealRestaurant(lunchRestaurants, restaurants, usedR, date);
            if (lunch) {
                items.push({ time: minToTime(lunchTime), title: lunch.name, type: 'meal', mealType: 'lunch', desc: `${lunch.recommended?.[0] || ''} ~NT$${lunch.price}/人`, spotData: lunch });
                spots.push(lunch);
            }
            currentMin = lunchTime + 60; // 1 hour for lunch

            // === Schedule afternoon attractions ===
            let afternoonCurrent = Math.max(currentMin, TIME_SLOTS.afternoon.start);
            for (const attr of afternoonAttrs) {
                if (afternoonCurrent + 20 > endMin) break;
                items.push({
                    time: minToTime(afternoonCurrent),
                    title: attr.name,
                    type: 'attraction',
                    desc: attr.description ? attr.description.substring(0, 50) + '...' : '',
                    spotData: attr,
                    isOpen: true
                });
                spots.push(attr);
                afternoonCurrent += 110; // ~1.5-2 hours + 20 min travel
            }
            currentMin = Math.max(currentMin, afternoonCurrent);

            // === First day: Hotel check-in ===
            if (isFirst) {
                const checkInTime = hotel?.checkIn || '15:00';
                const checkInMin = timeToMin(checkInTime);
                const actualCheckIn = Math.max(currentMin, checkInMin);
                items.push({ time: minToTime(actualCheckIn), title: `${hotel.name} Check-in`, type: 'hotel', desc: hotel.type });
                currentMin = Math.max(currentMin, actualCheckIn + 30);
            }

            // === Dinner ===
            const dinnerTime = Math.max(currentMin, TIME_SLOTS.dinner.start);
            if (dinnerTime < endMin) {
                const dinner = this.pickMealRestaurant(dinnerSlotRestaurants, dinnerRestaurants, usedR, date)
                    || this.pickMealRestaurant(dinnerRestaurants, restaurants, usedR, date);
                if (dinner) {
                    items.push({ time: minToTime(dinnerTime), title: dinner.name, type: 'meal', mealType: 'dinner', desc: `${dinner.recommended?.[0] || ''} ~NT$${dinner.price}/人`, spotData: dinner });
                    spots.push(dinner);
                }
                currentMin = dinnerTime + 60;
            }

            // === Schedule evening attractions (night markets etc.) - MUST be 18:00+ ===
            let eveningCurrent = Math.max(currentMin, TIME_SLOTS.evening.start);
            for (const attr of eveningAttrs) {
                if (eveningCurrent + 20 > endMin) break;
                // Night markets MUST be 18:00+
                const minStart = isNightMarket(attr) ? Math.max(eveningCurrent, 1080) : eveningCurrent;
                items.push({
                    time: minToTime(minStart),
                    title: attr.name,
                    type: 'attraction',
                    desc: attr.description ? attr.description.substring(0, 50) + '...' : '',
                    spotData: attr,
                    isOpen: true
                });
                spots.push(attr);
                eveningCurrent = minStart + 90; // ~1.5 hours for evening activities
            }

            // === Last day: Checkout + Return transport ===
            if (isLast) {
                items.push({ time: '08:30', title: '退房整理行李', type: 'hotel', desc: '' });
                const depRoutes = DEPARTURE_ROUTES[this.departureCity]?.transports[this.selectedCity];
                const tr = depRoutes?.find(t => t.type === this.selectedTransport) || data.transport?.find(t => t.type === this.selectedTransport);
                items.push({ time: '14:00', title: `搭乘${tr?.name || '交通工具'}返回${DEPARTURE_ROUTES[this.departureCity]?.name || ''}`, type: 'transport', desc: tr?.duration || '' });
            }

            items.sort((a, b) => a.time.localeCompare(b.time));

            let totalDist = 0;
            const ordered = [hotel, ...spots, hotel];
            for (let i = 0; i < ordered.length - 1; i++) {
                if (ordered[i].lat && ordered[i+1].lat) totalDist += haversine(ordered[i].lat, ordered[i].lng, ordered[i+1].lat, ordered[i+1].lng);
            }

            days.push({ day: d+1, date, title: this.getDayTitle(d, this.selectedDays, data.name), items, spots, totalDistance: Math.round(totalDist) });
        }
        this.generatedItinerary = { days, hotel, cityName: data.name };
        } catch (e) {
            console.error('buildItinerary error:', e);
            this.showToast('行程產生發生錯誤，請重試');
        }
    }

    pickMealRestaurant(preferred, fallback, used, date) {
        // Try preferred list first (never reuse)
        for (const r of preferred) { if (!used.has(r.id) && isOpenOnDate(r, date)) { used.add(r.id); return r; } }
        // Fall back to any unused restaurant
        for (const r of fallback) { if (!used.has(r.id) && isOpenOnDate(r, date)) { used.add(r.id); return r; } }
        // No unused restaurant available - return null instead of repeating
        return null;
    }

    pickRestaurant(rs, used, date) {
        for (const r of rs) { if (!used.has(r.id) && isOpenOnDate(r, date)) { used.add(r.id); return r; } }
        // No unused restaurant available - return null instead of repeating
        return null;
    }

    getDayTitle(i, total, name) {
        if (i === 0) return `抵達${name}・初探`;
        if (i === total - 1) return `最後巡禮・賦歸`;
        return ['深度探索','自然之旅','文化體驗','秘境探訪','悠閒慢遊'][i-1] || `第${i+1}天行程`;
    }

    // ===== Trip Summary =====
    renderTripSummary() {
        const it = this.generatedItinerary; if (!it) return;
        const bp = this.getBestPrice(it.hotel.prices);
        const totalHotel = bp.price * (this.selectedDays - 1);
        document.getElementById('trip-summary').innerHTML = `
            <div class="summary-title">${it.cityName} ${this.selectedDays}天${this.selectedDays-1}夜 旅行計畫</div>
            <div class="summary-chips">
                <span class="summary-chip"><i class="fas fa-calendar"></i> ${this.formatDate(this.startDate)} 出發</span>
                <span class="summary-chip"><i class="fas fa-moon"></i> ${this.selectedDays}天${this.selectedDays-1}夜</span>
                <span class="summary-chip"><i class="fas fa-users"></i> ${document.getElementById('people-select').value}人</span>
                <span class="summary-chip transport-chip"><i class="fas fa-${TRANSPORT_OPTIONS.find(t=>t.id===this.selectedTransport)?.icon||'train'}"></i> ${TRANSPORT_OPTIONS.find(t=>t.id===this.selectedTransport)?.name||''}</span>
                <span class="summary-chip hotel-chip"><i class="fas fa-hotel"></i> ${it.hotel.name}</span>
                <span class="summary-chip"><i class="fas fa-dollar-sign"></i> 住宿約NT$${totalHotel.toLocaleString()} (${bp.platform})</span>
                <span class="summary-chip"><i class="fas fa-camera"></i> ${this.attractionsPerDay}景點/天</span>
            </div>`;
    }

    // ===== Map Day Tabs =====
    renderMapDayTabs() {
        const c = document.getElementById('map-day-tabs'); if (!this.generatedItinerary) return;
        c.innerHTML = `<button class="map-day-btn active" data-map-day="all">全部</button>
            ${this.generatedItinerary.days.map(d => `<button class="map-day-btn" data-map-day="${d.day}">D${d.day}</button>`).join('')}`;
        c.addEventListener('click', (e) => {
            const btn = e.target.closest('.map-day-btn'); if (!btn) return;
            c.querySelectorAll('.map-day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.showMapForDay(btn.dataset.mapDay);
        });
    }

    showMapForDay(d) {
        const hotel = this.generatedItinerary.hotel;
        if (d === 'all') {
            this.mapManager.showAllDaysOverview(hotel, this.generatedItinerary.days);
        } else {
            const day = this.generatedItinerary.days[parseInt(d)-1];
            if (day) this.mapManager.showDayRoute(hotel, day.spots, parseInt(d));
        }
    }

    // ===== Tab Switching =====
    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const el = document.getElementById(`tab-${tab}`);
        if (el) el.classList.add('active');
        this.renderTab(tab);
        if (tab === 'map-overview') {
            setTimeout(() => {
                this.mapManager.invalidate();
                this.showMapForDay('all');
            }, 200);
        }
    }

    renderTab(tab) {
        switch(tab) {
            case 'itinerary': this.renderItinerary(); break;
            case 'map-overview': this.renderMapOverview(); break;
            case 'attractions': this.renderAttractions(); break;
            case 'restaurants': this.renderRestaurants(); break;
            case 'transport-detail': this.renderTransportDetail(); break;
            case 'youtube': this.renderYouTubeTab(); break;
        }
    }

    // ===== Itinerary =====
    renderItinerary() {
        const c = document.getElementById('tab-itinerary');
        if (!this.generatedItinerary) { c.innerHTML = '<div class="itinerary-empty"><i class="fas fa-route"></i><h3>尚未產生行程</h3></div>'; return; }
        c.innerHTML = this.generatedItinerary.days.map((day, dayIndex) => `
            <div class="day-section ${this.editMode ? 'edit-mode' : ''}">
                <div class="day-header">
                    <div class="day-number">${day.day}</div>
                    <div class="day-title">Day ${day.day} - ${day.title}</div>
                    <div class="day-date">${this.formatDate(day.date)} (${getDayName(day.date)})</div>
                    ${day.totalDistance ? `<div class="day-distance"><i class="fas fa-road"></i> ~${day.totalDistance}km</div>` : ''}
                </div>
                <div class="timeline">
                    ${day.items.map((item, idx) => this.renderTimelineItem(item, day.day, idx, day.date, dayIndex)).join('')}
                </div>
                <button class="add-item-btn" onclick="app.showAddItemModal(${dayIndex})" style="margin-top:0.5rem;width:100%;padding:0.5rem;border:2px dashed var(--border-solid);background:transparent;color:var(--text-secondary);border-radius:var(--radius-sm);cursor:pointer;font-size:0.85rem;transition:all 0.2s">
                    <i class="fas fa-plus"></i> 新增行程項目
                </button>
                ${this.editMode ? `<button class="btn-outline-sm" style="margin-top:0.5rem" onclick="app.addItemToDay(${day.day})"><i class="fas fa-plus"></i> 新增項目（編輯模式）</button>` : ''}
            </div>`).join('');
        this.setupDragDrop();
    }

    renderTimelineItem(item, dayNum, idx, date, dayIndex) {
        const di = typeof dayIndex === 'number' ? dayIndex : (dayNum - 1);
        let warn = '';
        if (item.spotData && !isOpenOnDate(item.spotData, date))
            warn = `<div class="timeline-warning"><i class="fas fa-exclamation-triangle"></i> 此日為公休日 ${item.spotData.closedDays||''}</div>`;

        let mealBadge = '';
        if (item.mealType) {
            const mealLabels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
            mealBadge = `<span class="meal-type-badge ${item.mealType}">${mealLabels[item.mealType]}</span>`;
        }

        return `<div class="timeline-item ${item.type} ${warn ? 'closed' : ''}" data-day="${di}" data-item="${idx}">
            <div class="timeline-drag-handle" title="拖曳排序"><i class="fas fa-grip-vertical"></i></div>
            <div class="timeline-item-content">
                <div class="timeline-time">
                    <span class="time-text" onclick="event.stopPropagation();this.style.display='none';this.nextElementSibling.style.display='inline-block';this.nextElementSibling.focus()">${item.time}</span>
                    <input type="time" class="time-edit-input" value="${item.time}" style="display:none" onchange="app.updateItemTime(${di}, ${idx}, this.value);this.previousElementSibling.textContent=this.value;this.style.display='none';this.previousElementSibling.style.display='inline-block'" onblur="this.style.display='none';this.previousElementSibling.style.display='inline-block'">
                </div>
                <div class="timeline-title">${this.getIcon(item.type)} ${item.title}${mealBadge}${item.spotData?.lat && item.spotData?.lng ? ` <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.spotData?.name || item.title)}+${item.spotData.lat},${item.spotData.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()" style="font-size:0.6rem;padding:0.1rem 0.4rem"><i class="fas fa-map-marker-alt"></i></a>` : ''}</div>
                ${item.desc ? `<div class="timeline-desc">${item.desc}</div>` : ''}${warn}
                <div class="timeline-actions">
                    ${item.spotData ? `<button class="btn-edit-item" onclick="event.stopPropagation();app.showOnMap(${item.spotData.lat},${item.spotData.lng},'${item.spotData.name.replace(/'/g,"\\'")}','${item.type}')"><i class="fas fa-map"></i></button>` : ''}
                    <button class="btn-edit-item" onclick="event.stopPropagation();app.editItem(${dayNum},${idx})"><i class="fas fa-edit"></i></button>
                    <button class="btn-edit-item" onclick="event.stopPropagation();app.removeItem(${di},${idx})" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
                </div>
            </div></div>`;
    }

    getIcon(t) {
        return { transport:'<i class="fas fa-car" style="color:var(--success)"></i>', meal:'<i class="fas fa-utensils" style="color:var(--accent)"></i>', attraction:'<i class="fas fa-camera" style="color:var(--primary)"></i>', hotel:'<i class="fas fa-bed" style="color:var(--purple)"></i>' }[t] || '';
    }

    // ===== Edit Mode =====
    toggleEditMode() {
        this.editMode = !this.editMode;
        const btn = document.getElementById('btn-edit-mode');
        btn.classList.toggle('active', this.editMode);
        btn.innerHTML = this.editMode ? '<i class="fas fa-check"></i> 完成編輯' : '<i class="fas fa-edit"></i> 編輯行程';
        this.renderItinerary();
    }

    deleteItem(d, i) {
        const day = this.generatedItinerary.days[d-1];
        if (day) { day.items.splice(i, 1); this.renderItinerary(); this.showToast('已刪除'); }
    }

    editItem(d, i) {
        const item = this.generatedItinerary.days[d-1]?.items[i]; if (!item) return;
        document.getElementById('edit-modal-body').innerHTML = `<div style="padding:1.5rem">
            <h3 style="margin-bottom:1rem">編輯行程項目</h3>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">時間</label><input type="time" id="edit-time" class="input-field" value="${sanitizeHTML(item.time)}"></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">標題</label><input type="text" id="edit-title" class="input-field" value="${sanitizeHTML(item.title)}"></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">說明</label><input type="text" id="edit-desc" class="input-field" value="${sanitizeHTML(item.desc||'')}"></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">類型</label>
                <select id="edit-type" class="input-field">
                    <option value="attraction" ${item.type==='attraction'?'selected':''}>景點</option>
                    <option value="meal" ${item.type==='meal'?'selected':''}>餐廳</option>
                    <option value="transport" ${item.type==='transport'?'selected':''}>交通</option>
                    <option value="hotel" ${item.type==='hotel'?'selected':''}>住宿</option>
                </select></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">費用 (NT$)</label><input type="number" id="edit-cost" class="input-field" value="${item.cost||0}" min="0"></div>
            <button class="btn-primary btn-full" onclick="app.saveEditItem(${d},${i})"><i class="fas fa-save"></i> 儲存</button></div>`;
        document.getElementById('edit-modal').classList.remove('hidden');
    }

    saveEditItem(d, i) {
        const item = this.generatedItinerary.days[d-1]?.items[i]; if (!item) return;
        item.time = document.getElementById('edit-time').value;
        item.title = sanitizeHTML(document.getElementById('edit-title').value);
        item.desc = sanitizeHTML(document.getElementById('edit-desc').value);
        item.type = document.getElementById('edit-type').value;
        item.cost = parseInt(document.getElementById('edit-cost').value) || 0;
        this.generatedItinerary.days[d-1].items.sort((a,b) => a.time.localeCompare(b.time));
        this.closeModal('edit-modal'); this.renderItinerary(); this.showToast('已更新！');
    }

    addItemToDay(d) {
        document.getElementById('edit-modal-body').innerHTML = `<div style="padding:1.5rem">
            <h3 style="margin-bottom:1rem">新增行程項目 - Day ${d}</h3>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">時間</label><input type="time" id="edit-time" class="input-field" value="10:00"></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">標題</label><input type="text" id="edit-title" class="input-field" placeholder="輸入地點名稱"></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">說明</label><input type="text" id="edit-desc" class="input-field" placeholder="簡短說明"></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">類型</label>
                <select id="edit-type" class="input-field"><option value="attraction">景點</option><option value="meal">餐廳</option><option value="transport">交通</option><option value="hotel">住宿</option></select></div>
            <div style="margin-bottom:0.75rem"><label style="font-size:0.8rem;color:var(--text-secondary)">費用 (NT$)</label><input type="number" id="edit-cost" class="input-field" value="0" min="0"></div>
            <button class="btn-primary btn-full" onclick="app.saveNewItem(${d})"><i class="fas fa-plus"></i> 新增</button></div>`;
        document.getElementById('edit-modal').classList.remove('hidden');
    }

    saveNewItem(d) {
        const day = this.generatedItinerary.days[d-1]; if (!day) return;
        day.items.push({ time: document.getElementById('edit-time').value, title: sanitizeHTML(document.getElementById('edit-title').value), desc: sanitizeHTML(document.getElementById('edit-desc').value), type: document.getElementById('edit-type').value, cost: parseInt(document.getElementById('edit-cost').value)||0 });
        day.items.sort((a,b) => a.time.localeCompare(b.time));
        this.closeModal('edit-modal'); this.renderItinerary(); this.showToast('已新增！');
    }

    // ===== Map Overview =====
    renderMapOverview() {
        const c = document.getElementById('tab-map-overview'); if (!this.generatedItinerary) return;
        c.innerHTML = this.generatedItinerary.days.map(day => `
            <div style="margin-bottom:1rem">
                <h4 style="margin-bottom:0.5rem"><span style="background:var(--primary);color:white;padding:0.15rem 0.5rem;border-radius:50%;font-size:0.8rem">${day.day}</span> Day ${day.day} - ${day.title} <span style="font-size:0.75rem;color:var(--text-light)">${this.formatDate(day.date)}</span></h4>
                <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.5rem">
                    ${day.spots.map(s => `
                        <button class="btn-outline-sm" onclick="app.showOnMap(${s.lat},${s.lng},'${s.name.replace(/'/g,"\\'")}')">
                            <i class="fas fa-map-marker-alt"></i> ${s.name}
                        </button>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name)}+${s.lat},${s.lng}" target="_blank" class="gmaps-link" style="font-size:0.65rem;padding:0.1rem 0.3rem;margin-left:-0.3rem" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>
                    `).join('')}
                    <button class="btn-primary-sm" onclick="app.showMapForDay('${day.day}')"><i class="fas fa-route"></i> 顯示路線</button>
                </div>
                ${day.totalDistance ? `<div style="font-size:0.75rem;color:var(--primary)"><i class="fas fa-road"></i> ~${day.totalDistance}km</div>` : ''}
            </div>`).join('');
    }

    showOnMap(lat, lng, name, type) { this.mapManager.showLocation(name, lat, lng, type); }

    // ===== Attractions (with editable ticket price) =====
    renderAttractions() {
        const c = document.getElementById('tab-attractions');
        const data = getDestData(this.selectedCity);
        c.innerHTML = `
            <div class="gp-search-section">
                <div class="gp-search-bar">
                    <i class="fas fa-search gp-search-icon"></i>
                    <input type="text" id="gp-search-attractions" class="input-field gp-search-input" placeholder="🔍 搜尋 Google 地圖上的任何景點...">
                    <button class="gp-search-btn" onclick="app.doGoogleSearch('attractions')"><i class="fas fa-search"></i></button>
                </div>
                <div id="gp-results-attractions" class="gp-results-container"></div>
            </div>
            <div class="section-header"><h3><i class="fas fa-fire"></i> ${data.name}精選推薦</h3></div>
            <div class="card-list">${data.attractions.map((a,i) => this.renderAttractionCard(a,i)).join('')}</div>`;
        // Enter key 搜尋
        document.getElementById('gp-search-attractions')?.addEventListener('keypress', e => { if(e.key==='Enter') app.doGoogleSearch('attractions'); });
    }

    renderAttractionCard(a, i) {
        let closed = [];
        for (let d = 0; d < this.selectedDays; d++) {
            const dt = new Date(this.startDate); dt.setDate(dt.getDate()+d);
            if (!isOpenOnDate(a, dt)) closed.push(`D${d+1}(${getDayName(dt)})`);
        }
        return `<div class="card" onclick="app.showDetail('attraction','${a.id}')" style="animation-delay:${i*0.05}s">
            <div class="card-image" style="background-image:url('${a.image}')">
                <span class="card-badge">${a.type}</span><span class="card-rating-badge"><i class="fas fa-star"></i> ${a.rating}</span>
                ${a.hasTicket ? `<span class="card-ticket-badge"><i class="fas fa-ticket-alt"></i> NT$<input type="number" class="price-input-inline" style="width:60px;color:white;background:transparent;border-color:rgba(255,255,255,0.5)" value="${a.ticket}" min="0" onclick="event.stopPropagation()" onchange="event.stopPropagation();this.closest('.card').dataset.ticket=this.value"></span>` : ''}
                ${closed.length ? `<div style="position:absolute;bottom:0.5rem;left:0.5rem;background:rgba(239,68,68,0.9);color:white;padding:0.15rem 0.5rem;border-radius:4px;font-size:0.65rem"><i class="fas fa-times-circle"></i> ${closed.join(', ')} 公休</div>` : ''}
            </div>
            <div class="card-body">
                <div class="card-title">${a.name}</div>
                <div class="card-subtitle"><i class="fas fa-map-marker-alt"></i> ${a.address}</div>
                <div class="card-meta">
                    <span class="card-meta-item"><i class="fas fa-clock"></i> ${a.duration}</span>
                    <span class="card-meta-item"><i class="fas fa-comment"></i> ${(a.reviews/1000).toFixed(1)}K</span>
                    <span class="card-price">${a.ticket===0?'免費':`NT$${a.ticket}`}</span>
                </div>
            </div>
            <div class="card-footer"><div class="card-tags">${a.tags.map(t=>`<span class="tag ${t==='必訪'?'tag-hot':''} ${t==='門票'?'tag-ticket':''}">${t}</span>`).join('')}</div><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.name)}+${a.lat},${a.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a></div></div>`;
    }

    // ===== Restaurants (with editable price) =====
    renderRestaurants() {
        const c = document.getElementById('tab-restaurants');
        const data = getDestData(this.selectedCity);
        c.innerHTML = `
            <div class="gp-search-section">
                <div class="gp-search-bar">
                    <i class="fas fa-search gp-search-icon"></i>
                    <input type="text" id="gp-search-restaurants" class="input-field gp-search-input" placeholder="🔍 搜尋 Google 地圖上的任何餐廳...">
                    <button class="gp-search-btn" onclick="app.doGoogleSearch('restaurants')"><i class="fas fa-search"></i></button>
                </div>
                <div id="gp-results-restaurants" class="gp-results-container"></div>
            </div>
            <div class="section-header"><h3><i class="fas fa-star"></i> ${data.name}精選推薦</h3></div>
            <div class="card-list">${data.restaurants.map((r,i) => this.renderRestaurantCard(r,i)).join('')}</div>`;
        document.getElementById('gp-search-restaurants')?.addEventListener('keypress', e => { if(e.key==='Enter') app.doGoogleSearch('restaurants'); });
    }

    renderRestaurantCard(r, i) {
        let closed = [];
        for (let d=0; d<this.selectedDays; d++) { const dt=new Date(this.startDate); dt.setDate(dt.getDate()+d); if (!isOpenOnDate(r,dt)) closed.push(`D${d+1}(${getDayName(dt)})`); }
        return `<div class="card" onclick="app.showDetail('restaurant','${r.id}')" style="animation-delay:${i*0.05}s">
            <div class="card-image" style="background-image:url('${r.image}')">
                <span class="card-badge">${r.type}</span><span class="card-rating-badge"><i class="fas fa-star"></i> ${r.rating}</span>
                ${closed.length?`<div style="position:absolute;bottom:0.5rem;left:0.5rem;background:rgba(239,68,68,0.9);color:white;padding:0.15rem 0.5rem;border-radius:4px;font-size:0.65rem"><i class="fas fa-times-circle"></i> ${closed.join(', ')} 公休</div>`:''}
            </div>
            <div class="card-body">
                <div class="card-title">${r.name}</div>
                <div class="card-subtitle"><i class="fas fa-map-marker-alt"></i> ${r.address}</div>
                <div class="card-meta">
                    <span class="card-meta-item"><i class="fas fa-clock"></i> ${r.hours}</span>
                    <span class="card-price">~NT$<input type="number" class="price-input-inline" value="${r.price}" min="0" onclick="event.stopPropagation()" onchange="event.stopPropagation()"> <span class="card-price-label">/人</span></span>
                </div>
            </div>
            <div class="card-footer"><div class="card-tags">${r.tags.map(t=>`<span class="tag ${t==='必吃'||t==='排隊名店'?'tag-hot':''}">${t}</span>`).join('')}</div><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}+${r.lat},${r.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a></div></div>`;
    }

    // ===== Transport Detail =====
    renderTransportDetail() {
        const c = document.getElementById('tab-transport-detail');
        const data = getDestData(this.selectedCity);
        const depRoutes = DEPARTURE_ROUTES[this.departureCity]?.transports[this.selectedCity];
        const depName = DEPARTURE_ROUTES[this.departureCity]?.name || '出發地';

        // Build departure route section if available
        let depHTML = '';
        if (depRoutes && depRoutes.length > 0) {
            depHTML = `<div class="section-header" style="margin-bottom:0.75rem"><h3><i class="fas fa-map-pin"></i> 從${sanitizeHTML(depName)}出發</h3></div>` +
                depRoutes.map(t => {
                    const icon = TRANSPORT_OPTIONS.find(o => o.id === t.type)?.icon || 'fa-route';
                    return `<div class="transport-card">
                        <div class="transport-header" onclick="this.nextElementSibling.classList.toggle('show')">
                            <div class="transport-icon ${t.type}"><i class="fas ${icon}"></i></div>
                            <div class="transport-info"><div class="transport-name">${t.name}</div><div class="transport-route">${t.route}</div></div>
                            <div class="transport-price-tag"><div class="price">NT$${t.price}</div><div class="label">單程/人</div></div>
                        </div>
                        <div class="transport-details">
                            <div class="transport-detail-grid">
                                <div class="detail-item"><div class="label">行車時間</div><div class="value">${t.duration}</div></div>
                                <div class="detail-item"><div class="label">出發地</div><div class="value">${t.departure}</div></div>
                                <div class="detail-item"><div class="label">抵達地</div><div class="value">${t.arrival}</div></div>
                            </div>
                        </div>
                    </div>`;
                }).join('');
        }

        // Original transport data from destination (fallback / additional info)
        let origHTML = '';
        if (data.transport) {
            origHTML = (depHTML ? `<div class="section-header" style="margin:1rem 0 0.75rem"><h3><i class="fas fa-info-circle"></i> 詳細交通資訊</h3></div>` : '') +
                data.transport.map(t => `
                <div class="transport-card">
                    <div class="transport-header" onclick="this.nextElementSibling.classList.toggle('show')">
                        <div class="transport-icon ${t.type}"><i class="fas ${t.icon}"></i></div>
                        <div class="transport-info"><div class="transport-name">${t.name}</div><div class="transport-route">${t.route}</div></div>
                        <div class="transport-price-tag"><div class="price">NT$<input type="number" class="price-input-inline" value="${t.price}" min="0" onclick="event.stopPropagation()" onchange="event.stopPropagation()"></div><div class="label">單程/人</div></div>
                    </div>
                    <div class="transport-details">
                        <div class="transport-detail-grid">
                            <div class="detail-item"><div class="label">行車時間</div><div class="value">${t.duration}</div></div>
                            <div class="detail-item"><div class="label">班次頻率</div><div class="value">${t.frequency}</div></div>
                            <div class="detail-item"><div class="label">出發地</div><div class="value">${t.departure}</div></div>
                            <div class="detail-item"><div class="label">抵達地</div><div class="value">${t.arrival}</div></div>
                        </div>
                        <div style="margin-top:0.5rem"><strong style="font-size:0.8rem;color:var(--success)"><i class="fas fa-thumbs-up"></i> 優點</strong>${t.pros.map(p=>`<div style="font-size:0.75rem;color:var(--text-secondary)">✓ ${p}</div>`).join('')}</div>
                        <div style="margin-top:0.4rem"><strong style="font-size:0.8rem;color:var(--danger)"><i class="fas fa-thumbs-down"></i> 缺點</strong>${t.cons.map(x=>`<div style="font-size:0.75rem;color:var(--text-secondary)">✗ ${x}</div>`).join('')}</div>
                        <div class="transport-tip"><i class="fas fa-lightbulb"></i> ${t.tip}</div>
                    </div>
                </div>`).join('');
        }

        if (!depHTML && !origHTML) {
            c.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:2rem">交通資訊建置中</p>';
            return;
        }
        c.innerHTML = depHTML + origHTML;
    }

    // ===== YouTube Tab =====
    renderYouTubeTab() {
        const c = document.getElementById('tab-youtube');
        const videos = YT_RECOMMENDATIONS[this.selectedCity] || YT_RECOMMENDATIONS.hualien;
        c.innerHTML = `
            <div class="section-header"><h3><i class="fab fa-youtube" style="color:#ff0000"></i> 相關旅遊影片</h3></div>
            <div style="margin-bottom:1rem">
                <div class="yt-input-row">
                    <input type="text" id="yt-tab-url" class="input-field" placeholder="貼上 YouTube 網址擷取行程...">
                    <button class="btn-primary-sm" onclick="document.getElementById('youtube-url').value=document.getElementById('yt-tab-url').value;app.parseYouTubeUrl()"><i class="fas fa-download"></i> 擷取</button>
                </div>
            </div>
            <div class="yt-recommend-list">
                ${videos.map(v => `
                    <div class="yt-video-card" onclick="app.showYTPlayer('${v.videoId}')">
                        <div class="yt-video-thumb"><img src="${v.thumb}" alt=""><span class="play-icon"><i class="fas fa-play"></i></span></div>
                        <div class="yt-video-info">
                            <div class="yt-video-title">${v.title}</div>
                            <div class="yt-video-meta">${v.channel} · ${v.views}次觀看</div>
                            <div style="margin-top:0.3rem"><a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()" style="background:#fff0f0;color:#ff0000;border-color:rgba(255,0,0,0.2)"><i class="fab fa-youtube"></i> 開啟 YouTube</a></div>
                        </div>
                    </div>`).join('')}
            </div>`;
    }

    // ===== Detail Modal =====
    showDetail(type, id) {
        try {
        const data = getDestData(this.selectedCity);
        const item = type==='attraction' ? data.attractions.find(a=>a.id===id) : data.restaurants.find(r=>r.id===id);
        if (!item) return;
        const stars = '★'.repeat(Math.floor(item.rating)) + (item.rating%1>=0.5?'½':'');
        let html = `<div class="modal-image" style="background-image:url('${item.image}')"></div>
            <div class="modal-body-content">
                <div class="modal-title">${item.name}</div>
                <div class="modal-rating"><span class="stars">${stars}</span><span class="score">${item.rating}</span><span class="reviews">(${item.reviews.toLocaleString()} 則評論)</span></div>
                <div class="recommend-reason"><h4><i class="fas fa-lightbulb"></i> 為什麼推薦？</h4><p>${item.reason||item.description}</p></div>
                ${item.userReview?`<div style="background:#fefce8;padding:0.6rem;border-radius:var(--radius-sm);margin-bottom:0.75rem;font-size:0.8rem;color:#854d0e;font-style:italic"><i class="fas fa-quote-left" style="color:#eab308"></i> ${item.userReview}</div>`:''}
                <div class="modal-desc">${item.description}</div>
                <div class="modal-info-grid">
                    <div class="modal-info-item"><div class="label">類型</div><div class="value">${item.type}</div></div>
                    <div class="modal-info-item"><div class="label">${type==='attraction'?'門票':'每人消費'}</div><div class="value">${(item.ticket||item.price)===0?'免費':`NT$${(item.ticket||item.price).toLocaleString()}`}</div></div>
                    ${item.hours?`<div class="modal-info-item"><div class="label">營業時間</div><div class="value">${item.hours}</div></div>`:''}
                    ${item.duration?`<div class="modal-info-item"><div class="label">建議停留</div><div class="value">${item.duration}</div></div>`:''}
                    ${item.closedDays?`<div class="modal-info-item"><div class="label">公休日</div><div class="value" style="color:var(--danger)">${item.closedDays}</div></div>`:''}
                </div>
                ${item.recommended?`<div style="margin-bottom:0.75rem"><h4 style="font-size:0.85rem;margin-bottom:0.4rem"><i class="fas fa-star" style="color:var(--accent)"></i> 推薦必點</h4>${item.recommended.map(r=>`<div style="padding:0.2rem 0;font-size:0.8rem;border-bottom:1px dashed var(--border-solid)">${r}</div>`).join('')}</div>`:''}
            </div>
            <div class="modal-actions">
                <button class="btn-outline" onclick="app.mapManager.showLocation('${item.name.replace(/'/g,"\\'")}',${item.lat},${item.lng},'${type}');app.closeModal('detail-modal')"><i class="fas fa-map"></i> 地圖</button>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}+${item.lat},${item.lng}" target="_blank" class="btn-outline" style="text-decoration:none;text-align:center;flex:1;padding:0.6rem;border-radius:var(--radius-sm);font-size:0.85rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:0.3rem;background:rgba(255,255,255,0.7);color:#1a73e8;border:1.5px solid #1a73e8"><i class="fas fa-map-marker-alt"></i> Google Maps</a>
                <button class="btn-primary" style="border:none" onclick="app.closeModal('detail-modal')"><i class="fas fa-check"></i> 關閉</button>
            </div>`;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('detail-modal').classList.remove('hidden');
        } catch (e) {
            console.error('showDetail error:', e);
            this.showToast('載入詳情發生錯誤');
        }
    }

    // ===== Drag & Drop =====
    setupDragDrop() {
        if (typeof Sortable === 'undefined') return;
        // Destroy old sortable instances
        if (this._sortables) this._sortables.forEach(s => s.destroy());
        this._sortables = [];

        const timelines = document.querySelectorAll('.timeline');
        const self = this;
        timelines.forEach((timeline, dayIdx) => {
            const sortable = Sortable.create(timeline, {
                group: 'itinerary',
                animation: 250,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                handle: '.timeline-drag-handle',
                filter: '.btn-edit-item, .time-text, .time-edit-input, .gmaps-link, .timeline-actions, a',
                preventOnFilter: false,
                delay: 100,
                delayOnTouchOnly: true,
                onEnd: function(evt) {
                    const fromDayIdx = evt.from.closest('.day-section') ? Array.from(document.querySelectorAll('.timeline')).indexOf(evt.from) : 0;
                    const toDayIdx = evt.to.closest('.day-section') ? Array.from(document.querySelectorAll('.timeline')).indexOf(evt.to) : 0;
                    const oldIdx = evt.oldIndex;
                    const newIdx = evt.newIndex;

                    const fromDay = self.generatedItinerary.days[fromDayIdx];
                    const toDay = self.generatedItinerary.days[toDayIdx];
                    if (!fromDay || !toDay) return;

                    const [movedItem] = fromDay.items.splice(oldIdx, 1);
                    toDay.items.splice(newIdx, 0, movedItem);

                    hapticFeedback('medium');
                    self.renderItinerary();
                }
            });
            self._sortables.push(sortable);
        });
    }

    // ===== Inline Time Editing =====
    updateItemTime(dayIdx, itemIdx, newTime) {
        if (this.generatedItinerary?.days[dayIdx]?.items[itemIdx]) {
            this.generatedItinerary.days[dayIdx].items[itemIdx].time = newTime;
            hapticFeedback('light');
        }
    }

    // ===== Remove Item (quick delete) =====
    removeItem(dayIdx, itemIdx) {
        if (this.generatedItinerary?.days[dayIdx]) {
            this.generatedItinerary.days[dayIdx].items.splice(itemIdx, 1);
            this.renderItinerary();
            hapticFeedback('light');
        }
    }

    // ===== Add Item Modal =====
    showAddItemModal(dayIdx) {
        const data = getDestData(this.selectedCity);
        const existingTitles = new Set();
        this.generatedItinerary.days.forEach(d => d.items.forEach(i => existingTitles.add(i.title)));

        const availableAttractions = data.attractions.filter(a => !existingTitles.has(a.name));
        const availableRestaurants = data.restaurants.filter(r => !existingTitles.has(r.name));
        this._addItemDayIdx = dayIdx;
        this._addItemSelectedGP = null;

        const modal = document.getElementById('detail-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.getElementById('modal-body').innerHTML = `
            <h3 style="margin-bottom:1rem"><i class="fas fa-plus-circle"></i> 新增行程項目</h3>
            <div style="margin-bottom:1rem">
                <label class="form-label" style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem">時間</label>
                <input type="time" id="new-item-time" class="input-field" value="12:00">
            </div>
            <div style="margin-bottom:1rem">
                <label class="form-label" style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem">類型</label>
                <select id="new-item-type" class="input-field" onchange="app.toggleAddItemType()">
                    <option value="attraction">景點（精選）</option>
                    <option value="meal">餐廳（精選）</option>
                    <option value="google">🔍 Google 地圖搜尋</option>
                    <option value="custom">✏️ 自訂</option>
                </select>
            </div>
            <div id="add-item-preset" style="margin-bottom:1rem">
                <label class="form-label" style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem">選擇</label>
                <select id="new-item-select" class="input-field">
                    ${availableAttractions.map(a => `<option value="${sanitizeHTML(a.name)}" data-type="attraction">${a.name} (${a.type})</option>`).join('')}
                </select>
            </div>
            <div id="add-item-custom" style="display:none;margin-bottom:1rem">
                <label class="form-label" style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem">標題</label>
                <input type="text" id="new-item-title" class="input-field" placeholder="輸入活動名稱">
                <label class="form-label" style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem">說明</label>
                <input type="text" id="new-item-desc" class="input-field" placeholder="簡短說明（選填）">
            </div>
            <div id="add-item-google" style="display:none;margin-bottom:1rem">
                <div class="gp-search-bar" style="margin-bottom:0.5rem">
                    <input type="text" id="gp-modal-search" class="input-field gp-search-input" placeholder="搜尋任何地點、餐廳、景點...">
                    <button class="gp-search-btn" onclick="app.doModalGoogleSearch()"><i class="fas fa-search"></i></button>
                </div>
                <div id="gp-modal-results" class="gp-modal-results"></div>
            </div>
            <button class="btn-primary" onclick="app.confirmAddItem(${dayIdx})" style="width:100%;border:none;padding:0.7rem;border-radius:var(--radius-sm);cursor:pointer;font-size:0.9rem">
                <i class="fas fa-check"></i> 加入行程
            </button>
        `;
        // Enter key for Google search in modal
        setTimeout(() => {
            document.getElementById('gp-modal-search')?.addEventListener('keypress', e => { if(e.key==='Enter') app.doModalGoogleSearch(); });
        }, 100);
    }

    toggleAddItemType() {
        const type = document.getElementById('new-item-type').value;
        const presetDiv = document.getElementById('add-item-preset');
        const customDiv = document.getElementById('add-item-custom');
        const googleDiv = document.getElementById('add-item-google');
        const select = document.getElementById('new-item-select');

        presetDiv.style.display = 'none';
        customDiv.style.display = 'none';
        googleDiv.style.display = 'none';
        this._addItemSelectedGP = null;

        if (type === 'custom') {
            customDiv.style.display = 'block';
        } else if (type === 'google') {
            googleDiv.style.display = 'block';
        } else {
            presetDiv.style.display = 'block';
            const data = getDestData(this.selectedCity);
            const existingTitles = new Set();
            this.generatedItinerary.days.forEach(d => d.items.forEach(i => existingTitles.add(i.title)));

            const items = type === 'attraction'
                ? data.attractions.filter(a => !existingTitles.has(a.name))
                : data.restaurants.filter(r => !existingTitles.has(r.name));

            select.innerHTML = items.map(i => `<option value="${sanitizeHTML(i.name)}">${i.name} ${i.type ? '('+i.type+')' : ''}</option>`).join('');
        }
    }

    confirmAddItem(dayIdx) {
        const time = document.getElementById('new-item-time')?.value;
        const type = document.getElementById('new-item-type')?.value;
        if (!time) { this.showToast('請選擇時間'); return; }
        let newItem;

        if (type === 'custom') {
            const title = document.getElementById('new-item-title')?.value?.trim();
            if (!title) { this.showToast('請輸入活動名稱'); return; }
            newItem = { time, title: sanitizeHTML(title), desc: sanitizeHTML(document.getElementById('new-item-desc')?.value || ''), type: 'custom', cost: 0 };
        } else if (type === 'google') {
            if (!this._addItemSelectedGP) { this.showToast('請先搜尋並選擇一個地點'); return; }
            const gp = this._addItemSelectedGP;
            newItem = {
                time,
                title: gp.name,
                type: gp._appType || 'attraction',
                desc: gp.description || gp.type || '',
                spotData: gp,
                cost: gp.ticket || gp.price || 0
            };
        } else {
            const name = document.getElementById('new-item-select')?.value;
            const data = getDestData(this.selectedCity);
            const source = type === 'attraction' ? data.attractions : data.restaurants;
            const item = source.find(s => s.name === name);
            if (!item) { this.showToast('請選擇一個項目'); return; }
            newItem = {
                time,
                title: item.name,
                type: type === 'attraction' ? 'attraction' : 'meal',
                desc: item.description || item.type || '',
                spotData: item,
                cost: item.price || item.fee || item.ticket || 0
            };
        }

        if (!this.generatedItinerary?.days[dayIdx]) { this.showToast('無效的日期'); return; }
        this.generatedItinerary.days[dayIdx].items.push(newItem);
        // Sort by time
        this.generatedItinerary.days[dayIdx].items.sort((a, b) => a.time.localeCompare(b.time));
        this.closeModal('detail-modal');
        this.renderItinerary();
        hapticFeedback('success');
        this.showToast('已新增行程項目');
    }

    closeModal(id) { const el = document.getElementById(id); if (!el) return; el.classList.add('hidden'); el.style.display = ''; }

    // ===== Google Places 搜尋功能 =====

    async _ensureGooglePlaces() {
        if (!this.googleApiKey) {
            // 嘗試從 localStorage 讀取
            this.googleApiKey = localStorage.getItem('travelgo_gp_key') || '';
        }
        if (!this.googleApiKey) {
            // 顯示 API Key 輸入對話框
            return new Promise((resolve) => {
                const modal = document.getElementById('detail-modal');
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                document.getElementById('modal-body').innerHTML = `
                    <h3 style="margin-bottom:1rem"><i class="fab fa-google"></i> 設定 Google Places API</h3>
                    <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;line-height:1.5">
                        要使用 Google 地圖搜尋功能，需要提供 Google Places API Key。<br>
                        <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color:var(--primary)">👉 前往 Google Cloud Console 取得 API Key</a>
                    </p>
                    <p style="font-size:0.75rem;color:var(--text-light);margin-bottom:1rem">
                        需啟用: Places API (New)。每月有免費額度。
                    </p>
                    <input type="text" id="gp-api-key-input" class="input-field" placeholder="貼上你的 API Key" style="margin-bottom:1rem;font-family:monospace">
                    <div style="display:flex;gap:0.5rem">
                        <button class="btn-primary" onclick="app._saveGoogleApiKey()" style="flex:1;border:none;padding:0.7rem;border-radius:var(--radius-sm);cursor:pointer;font-size:0.9rem">
                            <i class="fas fa-check"></i> 儲存
                        </button>
                        <button class="btn-secondary" onclick="app.closeModal('detail-modal')" style="flex:1;border:1px solid var(--border-solid);padding:0.7rem;border-radius:var(--radius-sm);cursor:pointer;font-size:0.9rem;background:var(--bg-card)">
                            取消
                        </button>
                    </div>
                `;
                this._gpKeyResolve = resolve;
            });
        }
        // 初始化 service
        window.placesService.apiKey = this.googleApiKey;
        const ok = await window.placesService.init();
        if (!ok) {
            this.showToast('Google Places API 載入失敗，請檢查 API Key');
            return false;
        }
        return true;
    }

    async _saveGoogleApiKey() {
        const key = document.getElementById('gp-api-key-input')?.value?.trim();
        if (!key) { this.showToast('請輸入 API Key'); return; }
        this.googleApiKey = key;
        localStorage.setItem('travelgo_gp_key', key);
        this.closeModal('detail-modal');
        this.showToast('API Key 已儲存！');
        if (this._gpKeyResolve) {
            this._gpKeyResolve(true);
            this._gpKeyResolve = null;
        }
    }

    /** 景點/餐廳/住宿頁面的 Google 搜尋 */
    async doGoogleSearch(tabType) {
        const inputId = `gp-search-${tabType}`;
        const resultId = `gp-results-${tabType}`;
        const query = document.getElementById(inputId)?.value?.trim();
        if (!query) { this.showToast('請輸入搜尋關鍵字'); return; }

        const ok = await this._ensureGooglePlaces();
        if (!ok) return;

        const resultContainer = document.getElementById(resultId);
        resultContainer.innerHTML = '<div class="gp-loading"><i class="fas fa-spinner fa-spin"></i> 搜尋中...</div>';

        try {
            const data = getDestData(this.selectedCity);
            const location = data?.center || null;
            const typeFilter = tabType === 'restaurants' ? 'restaurant' : (tabType === 'hotels' ? 'hotel' : '');

            const results = await window.placesService.searchPlaces(query, location, typeFilter, 10);

            if (!results || results.length === 0) {
                resultContainer.innerHTML = '<div class="gp-no-results"><i class="fas fa-search"></i> 找不到相關結果</div>';
                return;
            }

            if (tabType === 'hotels') {
                this._googleHotels = results.map(r => window.placesService.formatAsHotel(r));
                resultContainer.innerHTML = `
                    <div class="gp-results-label"><i class="fab fa-google"></i> Google 搜尋結果</div>
                    ${this._googleHotels.map(h => {
                        const sel = this.selectedHotel?.id === h.id;
                        return `<div class="hotel-option gp-hotel ${sel?'selected':''}" data-hotel-id="${h.id}">
                            <div class="hotel-thumb" style="background-image:url('${h.image}')">
                                <span class="gp-badge">Google</span>
                            </div>
                            <div class="hotel-info">
                                <div class="hotel-name">${h.name} <span style="color:#fbbf24">★</span> ${h.rating || '-'}</div>
                                <div class="hotel-meta">${h.type} · ${h.address}</div>
                                <div class="hotel-meta" style="font-size:0.7rem;color:var(--text-light)">價格請至訂房平台查詢</div>
                            </div>
                        </div>`;
                    }).join('')}`;
                // 綁定點擊事件
                resultContainer.querySelectorAll('.hotel-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        const hid = opt.dataset.hotelId;
                        this.selectedHotel = this._googleHotels.find(h => h.id === hid);
                        document.querySelectorAll('.hotel-option').forEach(o => o.classList.remove('selected'));
                        opt.classList.add('selected');
                        hapticFeedback('light');
                        this.showToast(`已選擇: ${this.selectedHotel.name}`);
                    });
                });
            } else {
                this._googleSearchResults = results;
                resultContainer.innerHTML = `
                    <div class="gp-results-label"><i class="fab fa-google"></i> Google 搜尋結果</div>
                    <div class="card-list gp-card-list">${results.map((r, i) => this._renderGPCard(r, i)).join('')}</div>`;
            }
        } catch (err) {
            console.error('Google search error:', err);
            resultContainer.innerHTML = `<div class="gp-error"><i class="fas fa-exclamation-circle"></i> 搜尋失敗: ${err.message || '請稍後再試'}</div>`;
        }
    }

    /** 新增項目 Modal 內的 Google 搜尋 */
    async doModalGoogleSearch() {
        const query = document.getElementById('gp-modal-search')?.value?.trim();
        if (!query) { this.showToast('請輸入搜尋關鍵字'); return; }

        const ok = await this._ensureGooglePlaces();
        if (!ok) return;

        const container = document.getElementById('gp-modal-results');
        container.innerHTML = '<div class="gp-loading"><i class="fas fa-spinner fa-spin"></i> 搜尋中...</div>';

        try {
            const data = getDestData(this.selectedCity);
            const results = await window.placesService.searchPlaces(query, data?.center, '', 8);

            if (!results || results.length === 0) {
                container.innerHTML = '<div class="gp-no-results"><i class="fas fa-search"></i> 找不到相關結果</div>';
                return;
            }

            this._modalSearchResults = results;
            container.innerHTML = results.map((r, i) => `
                <div class="gp-modal-item ${this._addItemSelectedGP?.id === r.id ? 'selected' : ''}" data-idx="${i}" onclick="app._selectModalGP(${i})">
                    <img class="gp-modal-thumb" src="${r.image}" alt="" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'">
                    <div class="gp-modal-info">
                        <div class="gp-modal-name">${sanitizeHTML(r.name)}</div>
                        <div class="gp-modal-meta">${r.type} ${r.rating ? '· ★'+r.rating : ''}</div>
                        <div class="gp-modal-addr">${sanitizeHTML(r.address)}</div>
                    </div>
                    <i class="fas fa-check-circle gp-modal-check"></i>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = `<div class="gp-error"><i class="fas fa-exclamation-circle"></i> ${err.message || '搜尋失敗'}</div>`;
        }
    }

    _selectModalGP(idx) {
        this._addItemSelectedGP = this._modalSearchResults?.[idx] || null;
        document.querySelectorAll('.gp-modal-item').forEach((el, i) => {
            el.classList.toggle('selected', i === idx);
        });
        if (this._addItemSelectedGP) {
            this.showToast(`已選擇: ${this._addItemSelectedGP.name}`);
        }
    }

    /** 渲染 Google Places 搜尋結果卡片 (景點/餐廳頁面用) */
    _renderGPCard(place, i) {
        return `<div class="card gp-card" onclick="app.showGPDetail('${place.id}')" style="animation-delay:${i*0.05}s">
            <div class="card-image" style="background-image:url('${place.image}')">
                <span class="card-badge gp-badge-card">Google</span>
                <span class="card-badge">${place.type}</span>
                ${place.rating ? `<span class="card-rating-badge"><i class="fas fa-star"></i> ${place.rating}</span>` : ''}
            </div>
            <div class="card-body">
                <div class="card-title">${sanitizeHTML(place.name)}</div>
                <div class="card-subtitle"><i class="fas fa-map-marker-alt"></i> ${sanitizeHTML(place.address)}</div>
                <div class="card-meta">
                    ${place.reviews ? `<span class="card-meta-item"><i class="fas fa-comment"></i> ${(place.reviews/1000).toFixed(1)}K</span>` : ''}
                    <span class="card-price">${place.priceLevel}</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="card-tags"><span class="tag" style="background:rgba(66,133,244,0.1);color:#4285f4">Google Places</span></div>
                <a href="https://www.google.com/maps/place/?q=place_id:${place._placeId}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a>
            </div>
        </div>`;
    }

    /** 顯示 Google Place 詳情 */
    showGPDetail(placeId) {
        const place = this._googleSearchResults?.find(r => r.id === placeId);
        if (!place) return;

        const modal = document.getElementById('detail-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.getElementById('modal-body').innerHTML = `
            <div class="detail-hero" style="background-image:url('${place.image}');height:180px;background-size:cover;background-position:center;border-radius:var(--radius-md);margin:-1rem -1rem 1rem;position:relative">
                <div style="position:absolute;bottom:0;left:0;right:0;padding:1rem;background:linear-gradient(transparent,rgba(0,0,0,0.7));color:white;border-radius:0 0 var(--radius-md) var(--radius-md)">
                    <h3 style="margin:0">${sanitizeHTML(place.name)}</h3>
                    <p style="margin:0.2rem 0 0;font-size:0.85rem;opacity:0.9">${place.type} ${place.rating ? '· ★'+place.rating+' ('+place.reviews+'則評論)' : ''}</p>
                </div>
                <span class="gp-badge" style="position:absolute;top:0.5rem;right:0.5rem">Google</span>
            </div>
            <div style="margin-bottom:0.8rem"><i class="fas fa-map-marker-alt" style="color:var(--primary);margin-right:0.3rem"></i> ${sanitizeHTML(place.address)}</div>
            ${place.hours ? `<div style="margin-bottom:0.8rem;font-size:0.8rem;color:var(--text-secondary)"><i class="fas fa-clock" style="margin-right:0.3rem"></i> ${sanitizeHTML(place.hours.substring(0,100))}...</div>` : ''}
            ${place.description ? `<p style="margin-bottom:0.8rem;font-size:0.85rem;color:var(--text-secondary)">${sanitizeHTML(place.description)}</p>` : ''}
            ${place._websiteUrl ? `<a href="${place._websiteUrl}" target="_blank" style="display:inline-block;margin-bottom:0.8rem;color:var(--primary);font-size:0.85rem"><i class="fas fa-globe"></i> 官方網站</a>` : ''}
            <div style="display:flex;gap:0.5rem;margin-top:0.5rem">
                <a href="https://www.google.com/maps/place/?q=place_id:${place._placeId}" target="_blank" style="flex:1;text-align:center;padding:0.6rem;background:#4285f4;color:white;border-radius:var(--radius-sm);text-decoration:none;font-size:0.85rem">
                    <i class="fab fa-google"></i> 在 Google Maps 查看
                </a>
                <button onclick="app.closeModal('detail-modal')" style="flex:1;padding:0.6rem;border:1px solid var(--border-solid);border-radius:var(--radius-sm);cursor:pointer;font-size:0.85rem;background:var(--bg-card)">
                    關閉
                </button>
            </div>
        `;
    }

    // ===== Save / Load =====
    saveItinerary() {
        if (rateLimited('save', 2000)) { this.showToast('操作太頻繁，請稍後再試'); return; }
        if (!this.generatedItinerary) { this.showToast('尚未產生行程'); return; }
        const d = { itinerary: this.generatedItinerary, selectedCity: this.selectedCity, selectedDays: this.selectedDays, startDate: this.startDate.toISOString(), selectedTransport: this.selectedTransport, selectedHotelId: this.selectedHotel?.id, attractionsPerDay: this.attractionsPerDay, mealBudgets: this.mealBudgets, savedAt: new Date().toISOString() };
        if (secureStore('travelgo_saved', d)) {
            hapticFeedback('success');
            this.showToast('行程已儲存！');
        } else {
            this.showToast('儲存失敗，請稍後再試');
        }
    }

    loadItinerary() {
        if (rateLimited('load', 2000)) { this.showToast('操作太頻繁，請稍後再試'); return; }
        const d = secureLoad('travelgo_saved');
        if (!d) {
            // Try legacy format (plain JSON) for backward compatibility
            const legacy = localStorage.getItem('travelgo_saved');
            if (!legacy) { this.showToast('沒有已儲存的行程'); return; }
            try { const parsed = JSON.parse(legacy); if (parsed.itinerary) { secureStore('travelgo_saved', parsed); return this.loadItinerary(); } } catch(e) {}
            this.showToast('儲存的行程資料已損壞或被竄改'); return;
        }
        try {
            d.itinerary.days.forEach(x => x.date = new Date(x.date));
            this.generatedItinerary = d.itinerary; this.selectedCity = d.selectedCity;
            this.selectedDays = d.selectedDays; this.startDate = new Date(d.startDate);
            this.selectedTransport = d.selectedTransport;
            if (d.attractionsPerDay) this.attractionsPerDay = d.attractionsPerDay;
            if (d.mealBudgets) this.mealBudgets = d.mealBudgets;
            const dd = getDestData(this.selectedCity);
            this.selectedHotel = dd.hotels.find(h=>h.id===d.selectedHotelId) || dd.hotels[0];
            document.getElementById('setup-section').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
            document.getElementById('bottom-nav').style.display = 'flex';
            this.renderTripSummary(); this.renderMapDayTabs(); this.switchTab('itinerary');
            this.showToast('已載入行程！');
        } catch(e) { this.showToast('載入失敗'); }
    }

    // ===== Export PDF (page-by-page rendering to avoid content cut-off) =====
    async exportPDF() {
        hapticFeedback('medium');
        if (rateLimited('exportPDF', 10000)) { this.showToast('PDF 正在產生中，請稍候'); return; }
        if (!this.generatedItinerary) { this.showToast('請先產生行程'); return; }

        const progress = document.createElement('div');
        progress.className = 'pdf-progress';
        progress.innerHTML = '<div class="pdf-progress-box"><div class="spinner"><i class="fas fa-spinner fa-spin"></i></div><p>正在產生 PDF（含中文字型）...</p></div>';
        document.body.appendChild(progress);

        try {
            const it = this.generatedItinerary;
            const trName = TRANSPORT_OPTIONS.find(t=>t.id===this.selectedTransport)?.name || '';
            const bp = this.getBestPrice(it.hotel.prices);
            const ticketAttractions = it.days.flatMap(d => d.items.filter(i => i.spotData?.hasTicket && i.spotData?.ticket > 0));
            const allSpots = it.days.flatMap(d => d.items.filter(i => i.spotData));
            const hasOutdoor = allSpots.some(i => ['自然景觀','步道健行','海景','地質景觀'].includes(i.spotData?.type));
            const hasNightMarket = allSpots.some(i => i.spotData?.type === '夜市');
            const hasThemePark = allSpots.some(i => i.spotData?.type === '主題樂園');
            const hasFarm = allSpots.some(i => ['農場體驗','體驗活動'].includes(i.spotData?.type));
            const trType = this.selectedTransport;

            const baseStyle = 'width:595px;background:white;padding:30px 35px;font-family:"Kosugi Maru","Noto Sans TC",sans-serif;color:#1e293b;line-height:1.8;';

            // Build separate page sections
            const sections = [];

            // Cover page
            sections.push(`<div style="${baseStyle}">
                <div style="text-align:center;margin-bottom:30px;padding-top:40px">
                    <div style="font-size:36px;margin-bottom:10px">🐾</div>
                    <h1 style="color:#FF8FA3;font-size:26px;margin:0">TravelGo 旅遊行程</h1>
                    <h2 style="font-size:20px;margin:8px 0">${it.cityName} ${this.selectedDays}天${this.selectedDays-1}夜</h2>
                    <p style="color:#64748b;font-size:13px">出發日期：${this.formatDateFull(this.startDate)} | 交通：${trName} | 住宿：${it.hotel.name}</p>
                    <p style="color:#64748b;font-size:13px">住宿費用：NT$${(bp.price*(this.selectedDays-1)).toLocaleString()} (${bp.platform}最低價)</p>
                </div>
                <div style="margin-top:20px;padding:14px;background:#FFF0F3;border-radius:8px;border:2px solid rgba(255,143,163,0.2)">
                    <div style="font-weight:700;font-size:14px;color:#FF6B8A;margin-bottom:8px">行程總覽</div>
                    ${it.days.map(d => `<div style="font-size:12px;padding:4px 0;border-bottom:1px dashed #f0e0d6"><strong>Day ${d.day}</strong> - ${d.title} (${this.formatDateFull(d.date)}) ${d.totalDistance?'~'+d.totalDistance+'km':''}</div>`).join('')}
                </div>
            </div>`);

            // Each day as a separate page
            for (const day of it.days) {
                let dayHtml = `<div style="${baseStyle}">
                    <div style="background:linear-gradient(135deg,#FF8FA3,#FFB347);color:white;padding:8px 16px;border-radius:8px;font-size:15px;font-weight:700;margin-bottom:14px">
                        Day ${day.day} - ${day.title}
                        <span style="font-size:11px;opacity:0.9;margin-left:8px">${this.formatDateFull(day.date)} (${getDayName(day.date)}) ${day.totalDistance?`| ~${day.totalDistance}km`:''}</span>
                    </div>`;

                for (const item of day.items) {
                    const typeColors = { attraction:'#FF8FA3', meal:'#FFB347', transport:'#7ED6A5', hotel:'#B39DDB' };
                    const color = typeColors[item.type] || '#64748b';
                    const mealLabels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
                    const mealTag = item.mealType ? ` [${mealLabels[item.mealType]}]` : '';
                    dayHtml += `<div style="margin-bottom:8px;padding:8px 12px;border-left:4px solid ${color};background:#f8fafc;border-radius:0 6px 6px 0">
                        <div style="font-size:11px;color:${color};font-weight:700">${item.time}${mealTag}</div>
                        <div style="font-size:14px;font-weight:600">${item.title}</div>
                        ${item.desc?`<div style="font-size:12px;color:#64748b;margin-top:2px">${item.desc}</div>`:''}`;

                    if (item.spotData?.reason) {
                        dayHtml += `<div style="margin-top:4px;padding:4px 8px;background:#FFF0F3;border-radius:4px;font-size:11px;color:#FF6B8A"><strong>推薦原因：</strong>${item.spotData.reason}</div>`;
                    }
                    if (item.spotData?.userReview) {
                        dayHtml += `<div style="margin-top:3px;padding:4px 8px;background:#fefce8;border-radius:4px;font-size:11px;color:#854d0e;font-style:italic">${item.spotData.userReview}</div>`;
                    }
                    dayHtml += '</div>';
                }
                dayHtml += '</div>';
                sections.push(dayHtml);
            }

            // Reminders page
            sections.push(`<div style="${baseStyle}">
                <div style="background:linear-gradient(135deg,#FF8FA3,#B39DDB);color:white;padding:10px 16px;border-radius:8px;font-size:15px;font-weight:700;margin-bottom:14px">
                    &#9888; 旅遊提醒事項 & 行前準備
                </div>
                <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:8px 12px;border-radius:0 6px 6px 0;margin-bottom:10px">
                    <div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:4px">&#128092; 必備物品清單</div>
                    <div style="font-size:11px;color:#78350f;line-height:1.8">
                        &#10003; 身分證/健保卡 &#10003; 手機充電器/行動電源 &#10003; 現金<br>
                        &#10003; 防曬用品（防曬乳SPF50+、墨鏡、帽子）<br>
                        ${hasOutdoor ? '&#10003; 登山鞋/防滑鞋 &#10003; 雨衣/輕便雨傘 &#10003; 防蚊液 &#10003; 水壺<br>' : ''}
                        ${hasNightMarket ? '&#10003; 濕紙巾/環保餐具（逛夜市必備）<br>' : ''}
                        &#10003; 薄外套 &#10003; 個人藥物（暈車藥、腸胃藥、OK繃）
                    </div>
                </div>
                ${ticketAttractions.length > 0 ? `
                <div style="background:#ede9fe;border-left:4px solid #B39DDB;padding:8px 12px;border-radius:0 6px 6px 0;margin-bottom:10px">
                    <div style="font-weight:700;font-size:13px;color:#5b21b6;margin-bottom:4px">&#127915; 門票購買建議</div>
                    <div style="font-size:11px;color:#4c1d95;line-height:1.8">
                        ${ticketAttractions.map(i => `<strong>${i.spotData.name}</strong> NT$${i.spotData.ticket}/人`).join(' | ')}<br>
                        購票管道：KKday/Klook線上預購 | ibon便利商店 | 官方網站 | 現場購買
                    </div>
                </div>` : ''}
                <div style="background:#e0f2fe;border-left:4px solid #FF8FA3;padding:8px 12px;border-radius:0 6px 6px 0;margin-bottom:10px">
                    <div style="font-weight:700;font-size:13px;color:#0369a1;margin-bottom:4px">&#128652; 交通注意事項</div>
                    <div style="font-size:11px;color:#0c4a6e;line-height:1.8">
                        ${trType === 'train' ? '&#10003; 台鐵票建議提前14天上網訂票 &#10003; 太魯閣號/普悠瑪號全車對號<br>' : ''}
                        ${trType === 'hsr' ? '&#10003; 高鐵早鳥票65折起（28天前開賣）<br>' : ''}
                        ${trType === 'plane' ? '&#10003; 國內線建議提前1-2週訂票 &#10003; 松山機場提前1小時報到<br>' : ''}
                        ${trType === 'bus' ? '&#10003; 蘇花改通車後車程約3.5小時 &#10003; 建議備暈車藥<br>' : ''}
                        ${trType === 'car' ? '&#10003; 蘇花改請遵守速限 &#10003; 連假建議清晨出發<br>' : ''}
                        &#10003; 當地可租機車/電動車代步 約NT$400-600/天
                    </div>
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #7ED6A5;padding:8px 12px;border-radius:0 6px 6px 0;margin-bottom:10px">
                    <div style="font-weight:700;font-size:13px;color:#166534;margin-bottom:4px">&#128161; 實用小提醒</div>
                    <div style="font-size:11px;color:#14532d;line-height:1.8">
                        &#10003; 出發前請查詢中央氣象署預報 &#10003; 太魯閣步道注意落石<br>
                        &#10003; 熱門餐廳建議避開尖峰時間 &#10003; 七星潭禁止下水游泳<br>
                        &#10003; 部分景點手機訊號較弱，建議先下載離線地圖<br>
                        &#10003; Check-in 15:00後，Check-out 11:00前
                    </div>
                </div>
                <div style="background:#fce7f3;border-left:4px solid #ec4899;padding:8px 12px;border-radius:0 6px 6px 0;margin-bottom:10px">
                    <div style="font-weight:700;font-size:13px;color:#9d174d;margin-bottom:4px">&#128222; 緊急聯絡</div>
                    <div style="font-size:11px;color:#831843;line-height:1.8">
                        報警：110 | 救護車/消防：119 | 花蓮縣政府：03-8230751<br>
                        太魯閣遊客中心：03-8621100 | 公路救援：0800-000-930
                    </div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:8px 12px;border-radius:6px;margin-bottom:10px">
                    <div style="font-weight:700;font-size:13px;color:#475569;margin-bottom:4px">&#128176; 預估花費總覽</div>
                    <div style="font-size:11px;color:#64748b;line-height:1.8">
                        住宿：NT$${(bp.price * (this.selectedDays - 1)).toLocaleString()} (${this.selectedDays - 1}晚) |
                        三餐：約NT$${((this.mealBudgets.breakfast + this.mealBudgets.lunch + this.mealBudgets.dinner) * this.selectedDays).toLocaleString()}/人 |
                        門票：約NT$${ticketAttractions.reduce((s, i) => s + (i.spotData?.ticket || 0), 0).toLocaleString()}/人<br>
                        <strong>預估總計（不含來回交通）：約 NT$${(bp.price * (this.selectedDays - 1) + (this.mealBudgets.breakfast + this.mealBudgets.lunch + this.mealBudgets.dinner) * this.selectedDays + ticketAttractions.reduce((s, i) => s + (i.spotData?.ticket || 0), 0) + this.selectedDays * 500).toLocaleString()}/人</strong>
                    </div>
                </div>
                <div style="text-align:center;color:#94a3b8;font-size:10px;margin-top:20px;padding-top:10px;border-top:1px solid #e2e8f0">
                    Generated by TravelGo 🐾 | ${new Date().toLocaleDateString('zh-TW')}</div>
            </div>`);

            // Wait for fonts to load
            await document.fonts.ready;

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageW = 210, pageH = 297;

            for (let si = 0; si < sections.length; si++) {
                const pdfDiv = document.createElement('div');
                pdfDiv.style.cssText = 'position:fixed;left:-9999px;top:0;';
                pdfDiv.innerHTML = sections[si];
                document.body.appendChild(pdfDiv);

                await new Promise(r => setTimeout(r, 200));

                const canvas = await html2canvas(pdfDiv, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.92);
                const imgW = pageW;
                const imgH = (canvas.height * imgW) / canvas.width;

                if (si > 0) pdf.addPage();

                // If this section fits in one page, add directly
                if (imgH <= pageH) {
                    pdf.addImage(imgData, 'JPEG', 0, 0, imgW, imgH);
                } else {
                    // If it overflows, split across pages
                    let heightLeft = imgH;
                    let position = 0;
                    pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
                    heightLeft -= pageH;
                    while (heightLeft > 0) {
                        position -= pageH;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
                        heightLeft -= pageH;
                    }
                }

                document.body.removeChild(pdfDiv);
            }

            pdf.save(`${it.cityName}_${this.selectedDays}天${this.selectedDays-1}夜行程.pdf`);
            this.showToast('PDF 已下載！');
        } catch(e) {
            console.error('PDF export error:', e);
            this.showToast('PDF 產生失敗，改用文字檔匯出');
            this.exportText();
        } finally {
            progress.remove();
        }
    }

    exportText() {
        const it = this.generatedItinerary;
        let t = `${it.cityName} ${this.selectedDays}天${this.selectedDays-1}夜行程\n${'='.repeat(40)}\n住宿：${it.hotel.name}\n\n`;
        it.days.forEach(d => {
            t += `【Day ${d.day}】${d.title} - ${this.formatDateFull(d.date)} (${getDayName(d.date)})\n${'-'.repeat(30)}\n`;
            d.items.forEach(i => {
                const mealLabels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
                const mealTag = i.mealType ? ` [${mealLabels[i.mealType]}]` : '';
                t += `${i.time}${mealTag} ${i.title}${i.desc?' - '+i.desc:''}\n`;
                if (i.spotData?.reason) t += `  推薦原因: ${i.spotData.reason}\n`;
                if (i.spotData?.userReview) t += `  評論: ${i.spotData.userReview}\n`;
            });
            t += '\n';
        });
        const blob = new Blob([t], {type:'text/plain;charset=utf-8'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `${it.cityName}_行程.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    // ===== Utility =====
    formatDate(d) { if (!d) return ''; const x = new Date(d); return `${x.getMonth()+1}/${x.getDate()}`; }
    formatDateFull(d) { if (!d) return ''; const x = new Date(d); return `${x.getFullYear()}/${x.getMonth()+1}/${x.getDate()}`; }

    showToast(msg) {
        hapticFeedback('light');
        const old = document.querySelector('.toast'); if (old) old.remove();
        const t = document.createElement('div'); t.className = 'toast';
        t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(30,41,59,0.85);color:white;padding:0.5rem 1rem;border-radius:20px;font-size:0.85rem;z-index:9999;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:fadeInUp 0.3s;border:1px solid rgba(255,255,255,0.1)';
        t.textContent = msg; document.body.appendChild(t);
        setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(), 300); }, 2000);
    }

    // ===== AI Chat Assistant =====
    toggleAIChat() {
        const panel = document.getElementById('ai-chat-panel');
        const fab = document.getElementById('ai-chat-fab');
        const badge = document.getElementById('ai-chat-badge');
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            fab.style.display = 'none';
            badge.style.display = 'none';
            document.getElementById('ai-chat-input').focus();
        } else {
            panel.classList.add('hidden');
            fab.style.display = 'flex';
        }
        hapticFeedback('light');
    }

    sendAIChatSuggestion(text) {
        document.getElementById('ai-chat-input').value = text;
        this.sendAIChat();
    }

    sendAIChat() {
        const input = document.getElementById('ai-chat-input');
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';

        // Hide welcome message on first send
        const welcome = document.querySelector('.ai-chat-welcome');
        if (welcome) welcome.style.display = 'none';

        this._addChatMsg(msg, 'user');
        this._showTyping();

        setTimeout(() => {
            this._hideTyping();
            const result = this._processAICommand(msg);
            this._addChatMsg(result.reply, 'bot', result.actions);
        }, 600 + Math.random() * 400);
    }

    _addChatMsg(text, role, actions) {
        const container = document.getElementById('ai-chat-messages');
        const div = document.createElement('div');
        div.className = `ai-msg ${role}`;
        let html = '';
        if (role === 'bot') html += '<span class="ai-msg-avatar">🦫</span> ';
        html += sanitizeHTML(text).replace(/\n/g, '<br>');
        if (actions && actions.length > 0) {
            html += '<div class="ai-msg-actions">';
            actions.forEach((a, i) => {
                html += `<button class="ai-msg-action-btn" onclick="app._execChatAction(${i}, this)">${sanitizeHTML(a.label)}</button>`;
            });
            html += '</div>';
        }
        div.innerHTML = html;
        if (actions) div._chatActions = actions;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    _showTyping() {
        const container = document.getElementById('ai-chat-messages');
        const div = document.createElement('div');
        div.className = 'ai-chat-typing';
        div.id = 'ai-typing-indicator';
        div.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    _hideTyping() {
        const el = document.getElementById('ai-typing-indicator');
        if (el) el.remove();
    }

    _execChatAction(actionIndex, btnEl) {
        const msgEl = btnEl.closest('.ai-msg');
        const actions = msgEl?._chatActions;
        if (!actions || !actions[actionIndex]) return;
        const action = actions[actionIndex];
        if (action.fn) {
            action.fn();
            this.renderItinerary();
            this._addChatMsg(action.confirmMsg || '已完成修改！', 'bot');
            hapticFeedback('success');
        }
    }

    _processAICommand(msg) {
        if (!this.generatedItinerary) {
            return { reply: '你還沒有產生行程喔！請先在設定頁面產生行程，我才能幫你修改～', actions: [] };
        }

        const days = this.generatedItinerary.days;
        const data = getDestData(this.selectedCity);
        const m = msg.toLowerCase();

        // Parse day number from message
        const dayMatch = m.match(/第([一二三四五六七八九十\d]+)[天日]/);
        let targetDay = null;
        if (dayMatch) {
            const numMap = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10};
            targetDay = numMap[dayMatch[1]] || parseInt(dayMatch[1]);
        }
        // Also match "day 1", "day1", "Day 1"
        const dayMatch2 = m.match(/day\s*(\d+)/i);
        if (!targetDay && dayMatch2) targetDay = parseInt(dayMatch2[1]);

        // ===== SUMMARIZE =====
        if (m.includes('總結') || m.includes('摘要') || m.includes('目前行程') || m.includes('看一下行程') || m.includes('行程概覽')) {
            let summary = `目前行程：${this.generatedItinerary.cityName} ${days.length}天${days.length-1}夜\n住宿：${this.generatedItinerary.hotel.name}\n\n`;
            days.forEach(d => {
                summary += `【Day ${d.day}】${d.title}\n`;
                d.items.forEach(item => {
                    summary += `  ${item.time} ${item.title}\n`;
                });
                summary += '\n';
            });
            return { reply: summary, actions: [] };
        }

        // ===== DELETE / REMOVE =====
        if (m.includes('刪除') || m.includes('移除') || m.includes('拿掉') || m.includes('取消') || m.includes('不要')) {
            // Try to find specific item by name
            const nameMatch = this._findItemByName(msg, days);
            if (nameMatch) {
                const { dayIdx, itemIdx, item } = nameMatch;
                return {
                    reply: `找到了「${item.title}」在 Day ${dayIdx + 1}，要幫你刪除嗎？`,
                    actions: [{
                        label: `確認刪除「${item.title}」`,
                        fn: () => { days[dayIdx].items.splice(itemIdx, 1); },
                        confirmMsg: `已刪除「${item.title}」！`
                    }]
                };
            }
            // Delete by meal type
            if (targetDay) {
                const di = targetDay - 1;
                if (di < 0 || di >= days.length) return { reply: `沒有第 ${targetDay} 天的行程喔～`, actions: [] };
                const mealType = m.includes('早餐') ? 'breakfast' : m.includes('午餐') ? 'lunch' : m.includes('晚餐') ? 'dinner' : null;
                if (mealType) {
                    const mealIdx = days[di].items.findIndex(i => i.mealType === mealType);
                    if (mealIdx >= 0) {
                        const mealItem = days[di].items[mealIdx];
                        return {
                            reply: `找到 Day ${targetDay} 的${mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : '晚餐'}：「${mealItem.title}」，要刪除嗎？`,
                            actions: [{
                                label: '確認刪除',
                                fn: () => { days[di].items.splice(mealIdx, 1); },
                                confirmMsg: `已刪除 Day ${targetDay} 的「${mealItem.title}」！`
                            }]
                        };
                    }
                }
                return { reply: `找不到要刪除的項目，請說得更具體一些，例如：「刪除第一天的午餐」或「刪除太魯閣」`, actions: [] };
            }
            return { reply: '請告訴我要刪除哪一天的什麼項目？例如：「刪除第二天的午餐」或「刪除七星潭」', actions: [] };
        }

        // ===== SWAP / REPLACE =====
        if (m.includes('換') || m.includes('替換') || m.includes('改成') || m.includes('換成')) {
            if (targetDay) {
                const di = targetDay - 1;
                if (di < 0 || di >= days.length) return { reply: `沒有第 ${targetDay} 天的行程喔～`, actions: [] };

                const mealType = m.includes('早餐') ? 'breakfast' : m.includes('午餐') ? 'lunch' : m.includes('晚餐') ? 'dinner' : null;
                if (mealType) {
                    const mealIdx = days[di].items.findIndex(i => i.mealType === mealType);
                    if (mealIdx >= 0) {
                        const currentMeal = days[di].items[mealIdx];
                        const usedNames = new Set();
                        days.forEach(d => d.items.forEach(i => usedNames.add(i.title)));
                        const alternatives = data.restaurants.filter(r => !usedNames.has(r.name) && r.rating >= 3.5);
                        if (alternatives.length === 0) return { reply: '沒有其他可替換的餐廳了～', actions: [] };
                        const picks = alternatives.slice(0, 3);
                        return {
                            reply: `目前 Day ${targetDay} 的${mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : '晚餐'}是「${currentMeal.title}」，可以換成：`,
                            actions: picks.map(r => ({
                                label: `${r.name} (${r.rating}★ ~NT$${r.price})`,
                                fn: () => {
                                    days[di].items[mealIdx] = { ...currentMeal, title: r.name, desc: `${r.recommended?.[0] || r.type || ''} ~NT$${r.price}/人`, spotData: r };
                                },
                                confirmMsg: `已將 Day ${targetDay} 的餐點換成「${r.name}」！`
                            }))
                        };
                    }
                }

                // Replace attraction
                if (m.includes('景點') || (!mealType)) {
                    const attrIdx = days[di].items.findIndex(i => i.type === 'attraction');
                    if (attrIdx >= 0) {
                        const currentAttr = days[di].items[attrIdx];
                        const usedNames = new Set();
                        days.forEach(d => d.items.forEach(i => usedNames.add(i.title)));
                        const alternatives = data.attractions.filter(a => !usedNames.has(a.name) && a.rating >= 3.5);
                        if (alternatives.length === 0) return { reply: '沒有其他可替換的景點了～', actions: [] };
                        const picks = alternatives.slice(0, 3);
                        return {
                            reply: `Day ${targetDay} 的景點「${currentAttr.title}」可以換成：`,
                            actions: picks.map(a => ({
                                label: `${a.name} (${a.rating}★)`,
                                fn: () => {
                                    days[di].items[attrIdx] = { ...currentAttr, title: a.name, desc: a.description?.substring(0, 50) || '', spotData: a };
                                },
                                confirmMsg: `已將景點換成「${a.name}」！`
                            }))
                        };
                    }
                }
            }

            // Try to find specific item by name
            const nameMatch = this._findItemByName(msg, days);
            if (nameMatch) {
                const { dayIdx, itemIdx, item } = nameMatch;
                const isAttr = item.type === 'attraction';
                const pool = isAttr ? data.attractions : data.restaurants;
                const usedNames = new Set();
                days.forEach(d => d.items.forEach(i => usedNames.add(i.title)));
                const alternatives = pool.filter(p => !usedNames.has(p.name) && p.rating >= 3.5).slice(0, 3);
                if (alternatives.length === 0) return { reply: '沒有可替換的項目了～', actions: [] };
                return {
                    reply: `「${item.title}」可以換成：`,
                    actions: alternatives.map(a => ({
                        label: `${a.name} (${a.rating}★)`,
                        fn: () => {
                            days[dayIdx].items[itemIdx] = { ...item, title: a.name, desc: a.description?.substring(0, 50) || a.type || '', spotData: a };
                        },
                        confirmMsg: `已換成「${a.name}」！`
                    }))
                };
            }

            return { reply: '請說清楚要換什麼，例如：「把第一天的午餐換掉」或「換掉七星潭」', actions: [] };
        }

        // ===== ADD =====
        if (m.includes('加') || m.includes('新增') || m.includes('增加') || m.includes('多一個') || m.includes('再來一個')) {
            const isRestaurant = m.includes('餐') || m.includes('吃') || m.includes('美食') || m.includes('餐廳');
            const isAttraction = m.includes('景點') || m.includes('玩') || m.includes('逛') || m.includes('去');
            const pool = isRestaurant ? data.restaurants : data.attractions;
            const usedNames = new Set();
            days.forEach(d => d.items.forEach(i => usedNames.add(i.title)));
            const available = pool.filter(p => !usedNames.has(p.name) && p.rating >= 3.5);

            if (available.length === 0) return { reply: '已經沒有更多可以新增的項目了～', actions: [] };

            const di = targetDay ? targetDay - 1 : 0;
            if (di < 0 || di >= days.length) return { reply: `沒有第 ${targetDay || '?'} 天的行程喔～`, actions: [] };

            const picks = available.slice(0, 4);
            return {
                reply: `以下是推薦${isRestaurant ? '餐廳' : '景點'}，選一個加到 Day ${di + 1}：`,
                actions: picks.map(p => ({
                    label: `${p.name} (${p.rating}★${p.price ? ' ~NT$' + p.price : ''})`,
                    fn: () => {
                        const newItem = {
                            time: '12:00',
                            title: p.name,
                            type: isRestaurant ? 'meal' : 'attraction',
                            desc: p.description?.substring(0, 50) || p.type || '',
                            spotData: p,
                            cost: p.price || p.ticket || 0
                        };
                        days[di].items.push(newItem);
                        days[di].items.sort((a, b) => a.time.localeCompare(b.time));
                    },
                    confirmMsg: `已將「${p.name}」加入 Day ${di + 1}！`
                }))
            };
        }

        // ===== ADJUST TIME =====
        if (m.includes('時間') || m.includes('提前') || m.includes('延後') || m.includes('改時間') || m.includes('調整')) {
            if (targetDay) {
                const di = targetDay - 1;
                if (di < 0 || di >= days.length) return { reply: `沒有第 ${targetDay} 天的行程喔～`, actions: [] };

                // Check for specific time adjustment
                const timeMatch = m.match(/(\d{1,2})[:\s：]?(\d{2})?/);
                if (timeMatch && m.includes('改') || m.includes('調')) {
                    // Show day's items for user to pick
                    const dayItems = days[di].items;
                    return {
                        reply: `Day ${targetDay} 的行程如下，點選要調整時間的項目：`,
                        actions: dayItems.map((item, idx) => ({
                            label: `${item.time} ${item.title}`,
                            fn: () => {
                                // Shift everything by showing edit
                                this.editItem(targetDay, idx);
                            },
                            confirmMsg: `已開啟編輯視窗，可以修改時間！`
                        }))
                    };
                }

                // General time adjustment
                if (m.includes('提前') || m.includes('早一點')) {
                    return {
                        reply: `要把 Day ${targetDay} 所有行程提前多久？`,
                        actions: [30, 60, 90].map(mins => ({
                            label: `提前 ${mins} 分鐘`,
                            fn: () => { this._shiftDayTimes(di, -mins); },
                            confirmMsg: `Day ${targetDay} 所有行程已提前 ${mins} 分鐘！`
                        }))
                    };
                }
                if (m.includes('延後') || m.includes('晚一點') || m.includes('往後')) {
                    return {
                        reply: `要把 Day ${targetDay} 所有行程延後多久？`,
                        actions: [30, 60, 90].map(mins => ({
                            label: `延後 ${mins} 分鐘`,
                            fn: () => { this._shiftDayTimes(di, mins); },
                            confirmMsg: `Day ${targetDay} 所有行程已延後 ${mins} 分鐘！`
                        }))
                    };
                }

                // Default: show the day's items
                return {
                    reply: `Day ${targetDay} 目前的時間安排：\n${days[di].items.map(i => `${i.time} ${i.title}`).join('\n')}\n\n你可以說「提前」或「延後」來調整時間`,
                    actions: []
                };
            }
            return { reply: '請指定是第幾天的行程要調整時間，例如：「第一天提前30分鐘」', actions: [] };
        }

        // ===== SHOW DAY DETAIL =====
        if (targetDay && (m.includes('看') || m.includes('顯示') || m.includes('查看') || m.includes('什麼') || m.includes('有什麼') || m.includes('行程'))) {
            const di = targetDay - 1;
            if (di < 0 || di >= days.length) return { reply: `沒有第 ${targetDay} 天的行程喔～`, actions: [] };
            const day = days[di];
            let detail = `Day ${targetDay} - ${day.title}\n${this.formatDate(day.date)} (${getDayName(day.date)})\n\n`;
            day.items.forEach(item => {
                const mealLabels = { breakfast: ' [早餐]', lunch: ' [午餐]', dinner: ' [晚餐]' };
                detail += `${item.time}${item.mealType ? mealLabels[item.mealType] : ''} ${item.title}\n`;
                if (item.desc) detail += `  ${item.desc}\n`;
            });
            return { reply: detail, actions: [] };
        }

        // ===== MOVE ITEM BETWEEN DAYS =====
        if (m.includes('移到') || m.includes('搬到') || m.includes('移去') || m.includes('放到')) {
            const nameMatch = this._findItemByName(msg, days);
            const toDay = m.match(/第([一二三四五六七八九十\d]+)[天日]/g);
            if (nameMatch && toDay && toDay.length >= 1) {
                const numMap = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10};
                const lastDayRef = toDay[toDay.length - 1];
                const toDayMatch = lastDayRef.match(/第([一二三四五六七八九十\d]+)/);
                const toDayNum = toDayMatch ? (numMap[toDayMatch[1]] || parseInt(toDayMatch[1])) : null;
                if (toDayNum && toDayNum >= 1 && toDayNum <= days.length) {
                    const { dayIdx, itemIdx, item } = nameMatch;
                    return {
                        reply: `把「${item.title}」從 Day ${dayIdx + 1} 移到 Day ${toDayNum}？`,
                        actions: [{
                            label: '確認移動',
                            fn: () => {
                                const removed = days[dayIdx].items.splice(itemIdx, 1)[0];
                                days[toDayNum - 1].items.push(removed);
                                days[toDayNum - 1].items.sort((a, b) => a.time.localeCompare(b.time));
                            },
                            confirmMsg: `已將「${item.title}」移到 Day ${toDayNum}！`
                        }]
                    };
                }
            }
            return { reply: '請說清楚要移動什麼到第幾天，例如：「把七星潭移到第二天」', actions: [] };
        }

        // ===== RECOMMEND =====
        if (m.includes('推薦') || m.includes('建議') || m.includes('還有什麼')) {
            const usedNames = new Set();
            days.forEach(d => d.items.forEach(i => usedNames.add(i.title)));
            const unusedAttr = data.attractions.filter(a => !usedNames.has(a.name)).sort((a, b) => b.rating - a.rating).slice(0, 3);
            const unusedRest = data.restaurants.filter(r => !usedNames.has(r.name)).sort((a, b) => b.rating - a.rating).slice(0, 3);
            let reply = '以下是還沒安排到的高評分景點和餐廳：\n\n';
            if (unusedAttr.length) reply += '景點：\n' + unusedAttr.map(a => `  ${a.name} (${a.rating}★) - ${a.type}`).join('\n') + '\n\n';
            if (unusedRest.length) reply += '餐廳：\n' + unusedRest.map(r => `  ${r.name} (${r.rating}★) ~NT$${r.price}`).join('\n');
            if (!unusedAttr.length && !unusedRest.length) reply = '所有景點和餐廳都已經安排進行程了！';
            return { reply, actions: [] };
        }

        // ===== FALLBACK =====
        return {
            reply: '我可以幫你做這些事情：\n\n' +
                '• 總結行程 - 「幫我總結目前行程」\n' +
                '• 刪除項目 - 「刪除第一天的午餐」\n' +
                '• 替換項目 - 「把第二天的景點換掉」\n' +
                '• 新增項目 - 「第三天加一個景點」\n' +
                '• 調整時間 - 「第一天提前30分鐘」\n' +
                '• 移動項目 - 「把七星潭移到第二天」\n' +
                '• 查看行程 - 「第一天有什麼行程」\n' +
                '• 推薦 - 「還有什麼好玩的」',
            actions: []
        };
    }

    _findItemByName(msg, days) {
        // Find an itinerary item by partial name match
        for (let di = 0; di < days.length; di++) {
            for (let ii = 0; ii < days[di].items.length; ii++) {
                const item = days[di].items[ii];
                if (msg.includes(item.title) || (item.spotData && msg.includes(item.spotData.name))) {
                    return { dayIdx: di, itemIdx: ii, item };
                }
            }
        }
        // Fuzzy match: check if any item title appears partially in msg
        for (let di = 0; di < days.length; di++) {
            for (let ii = 0; ii < days[di].items.length; ii++) {
                const item = days[di].items[ii];
                const title = item.title;
                // Check if significant portion of title matches
                if (title.length >= 3) {
                    for (let len = title.length; len >= 2; len--) {
                        for (let start = 0; start <= title.length - len; start++) {
                            const sub = title.substring(start, start + len);
                            if (sub.length >= 2 && msg.includes(sub)) return { dayIdx: di, itemIdx: ii, item };
                        }
                    }
                }
            }
        }
        return null;
    }

    _shiftDayTimes(dayIdx, minutes) {
        const day = this.generatedItinerary.days[dayIdx];
        if (!day) return;
        day.items.forEach(item => {
            const [h, m] = item.time.split(':').map(Number);
            let total = h * 60 + m + minutes;
            total = Math.max(0, Math.min(total, 23 * 60 + 59));
            item.time = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
        });
    }
}

const app = new TravelApp();

// ===== Intersection Observer for card entrance animations =====
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${i * 0.08}s`;
            entry.target.classList.add('animate-in');
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-card, .hotel-option, .city-card').forEach(el => {
    animObserver.observe(el);
});

// ===== Button Ripple Effect =====
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-primary, .btn-generate, .day-btn, .tab-btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

