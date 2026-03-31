// ===== TravelGo App v7 =====

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
        this.selectedHotel = null;
        this.generatedItinerary = null;
        this.editMode = false;
        this.preferences = { rating: 4.0, mealBudget: 500, includeTicket: true, includeFree: true };
        this.attractionsPerDay = 3;
        this.mealBudgets = { breakfast: 150, lunch: 300, dinner: 500 };
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
            this.renderHotelList();
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
            });
        });
    }

    setupCustomDays() {
        const input = document.getElementById('custom-days');
        document.getElementById('days-minus').addEventListener('click', () => {
            if (this.selectedDays > 1) { this.selectedDays--; input.value = this.selectedDays; this.updateDaysLabel(); this.highlightDayBtn(); }
        });
        document.getElementById('days-plus').addEventListener('click', () => {
            if (this.selectedDays < 14) { this.selectedDays++; input.value = this.selectedDays; this.updateDaysLabel(); this.highlightDayBtn(); }
        });
        input.addEventListener('change', () => {
            this.selectedDays = Math.max(1, Math.min(14, parseInt(input.value) || 4));
            input.value = this.selectedDays; this.updateDaysLabel(); this.highlightDayBtn();
        });
        this.updateDaysLabel();
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
        grid.innerHTML = TRANSPORT_OPTIONS.map(t => `
            <div class="transport-option ${t.id === this.selectedTransport ? 'active' : ''}" data-transport="${t.id}">
                <div class="t-icon ${t.iconClass}"><i class="fas ${t.icon}"></i></div>
                <div class="t-info"><div class="t-name">${t.name}</div><div class="t-detail">${t.detail}</div></div>
            </div>`).join('');
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
                    ${h.lat && h.lng ? `<a href="https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a>` : ''}
                </div>
            </div>`;
        }).join('');

        container.querySelectorAll('.hotel-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                if (e.target.classList.contains('price-input-inline')) return;
                hapticFeedback('light');
                const hid = opt.dataset.hotelId;
                this.selectedHotel = data.hotels.find(h => h.id === hid);
                container.querySelectorAll('.hotel-option').forEach(o => o.classList.remove('selected'));
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

        const days = [];
        const usedA = new Set(), usedR = new Set();

        for (let d = 0; d < this.selectedDays; d++) {
            const date = new Date(this.startDate); date.setDate(date.getDate() + d);
            const items = [], spots = [];
            const isFirst = d === 0, isLast = d === this.selectedDays - 1;

            if (isFirst) {
                const tr = data.transport?.find(t => t.type === this.selectedTransport);
                items.push({ time: '09:00', title: `搭乘${tr?.name || '交通工具'}前往${data.name}`, type: 'transport', desc: tr ? `${tr.route} ${tr.duration}` : '' });
                items.push({ time: '11:30', title: `抵達${data.name}`, type: 'transport', desc: '前往住宿放行李' });
            }
            if (!isFirst) {
                // Breakfast
                const breakfastR = this.pickMealRestaurant(breakfastRestaurants, restaurants, usedR, date);
                if (breakfastR) {
                    items.push({ time: '07:30', title: breakfastR.name, type: 'meal', mealType: 'breakfast', desc: `${breakfastR.recommended?.[0] || ''} ~NT$${breakfastR.price}/人`, spotData: breakfastR });
                    spots.push(breakfastR);
                } else {
                    items.push({ time: '07:30', title: '飯店早餐', type: 'meal', mealType: 'breakfast', desc: hotel.name });
                }
            }

            const dailyCount = isFirst || isLast ? Math.max(1, this.attractionsPerDay - 1) : this.attractionsPerDay;
            let added = 0;
            for (const attr of attractions) {
                if (added >= dailyCount || usedA.has(attr.id)) continue;
                usedA.add(attr.id);
                if (!isOpenOnDate(attr, date)) continue;
                const h = isFirst ? 13 + added * 2 : 9 + added * 2.5;
                items.push({ time: `${String(Math.floor(h)).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}`, title: attr.name, type: 'attraction', desc: attr.description.substring(0, 50) + '...', spotData: attr, isOpen: true });
                spots.push(attr); added++;
            }

            // Lunch
            const lunch = this.pickMealRestaurant(lunchRestaurants, restaurants, usedR, date);
            if (lunch) { items.push({ time: isFirst ? '12:00' : '12:30', title: lunch.name, type: 'meal', mealType: 'lunch', desc: `${lunch.recommended?.[0] || ''} ~NT$${lunch.price}/人`, spotData: lunch }); spots.push(lunch); }

            // Dinner
            const dinner = this.pickMealRestaurant(dinnerRestaurants, restaurants, usedR, date);
            if (dinner) { items.push({ time: '18:30', title: dinner.name, type: 'meal', mealType: 'dinner', desc: `${dinner.recommended?.[0] || ''} ~NT$${dinner.price}/人`, spotData: dinner }); spots.push(dinner); }

            if (isFirst) items.push({ time: '17:00', title: `${hotel.name} Check-in`, type: 'hotel', desc: hotel.type });
            if (isLast) {
                items.push({ time: '08:30', title: '退房整理行李', type: 'hotel', desc: '' });
                const tr = data.transport?.find(t => t.type === this.selectedTransport);
                items.push({ time: '14:00', title: `搭乘${tr?.name || '交通工具'}返回`, type: 'transport', desc: tr?.duration || '' });
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
        if (tab === 'map-overview') setTimeout(() => this.mapManager.invalidate(), 100);
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
        c.innerHTML = this.generatedItinerary.days.map(day => `
            <div class="day-section ${this.editMode ? 'edit-mode' : ''}">
                <div class="day-header">
                    <div class="day-number">${day.day}</div>
                    <div class="day-title">Day ${day.day} - ${day.title}</div>
                    <div class="day-date">${this.formatDate(day.date)} (${getDayName(day.date)})</div>
                    ${day.totalDistance ? `<div class="day-distance"><i class="fas fa-road"></i> ~${day.totalDistance}km</div>` : ''}
                </div>
                <div class="timeline">
                    ${day.items.map((item, idx) => this.renderTimelineItem(item, day.day, idx, day.date)).join('')}
                </div>
                ${this.editMode ? `<button class="btn-outline-sm" style="margin-top:0.5rem" onclick="app.addItemToDay(${day.day})"><i class="fas fa-plus"></i> 新增項目</button>` : ''}
            </div>`).join('');
    }

    renderTimelineItem(item, dayNum, idx, date) {
        let warn = '';
        if (item.spotData && !isOpenOnDate(item.spotData, date))
            warn = `<div class="timeline-warning"><i class="fas fa-exclamation-triangle"></i> 此日為公休日 ${item.spotData.closedDays||''}</div>`;

        let mealBadge = '';
        if (item.mealType) {
            const mealLabels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
            mealBadge = `<span class="meal-type-badge ${item.mealType}">${mealLabels[item.mealType]}</span>`;
        }

        return `<div class="timeline-item ${item.type} ${warn ? 'closed' : ''}">
            <div class="timeline-time">${item.time}</div>
            <div class="timeline-title">${this.getIcon(item.type)} ${item.title}${mealBadge}${item.spotData?.lat && item.spotData?.lng ? ` <a href="https://www.google.com/maps/search/?api=1&query=${item.spotData.lat},${item.spotData.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()" style="font-size:0.6rem;padding:0.1rem 0.4rem"><i class="fas fa-map-marker-alt"></i></a>` : ''}</div>
            ${item.desc ? `<div class="timeline-desc">${item.desc}</div>` : ''}${warn}
            <div class="timeline-actions">
                <button class="btn-edit-item" onclick="app.editItem(${dayNum},${idx})"><i class="fas fa-edit"></i> 編輯</button>
                <button class="btn-delete-item" onclick="app.deleteItem(${dayNum},${idx})"><i class="fas fa-trash"></i> 刪除</button>
                ${item.spotData ? `<button class="btn-edit-item" onclick="app.showOnMap(${item.spotData.lat},${item.spotData.lng},'${item.spotData.name.replace(/'/g,"\\'")}','${item.type}')"><i class="fas fa-map"></i> 地圖</button>` : ''}
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
                    ${day.spots.map(s => `<button class="btn-outline-sm" onclick="app.showOnMap(${s.lat},${s.lng},'${s.name.replace(/'/g,"\\'")}')"><i class="fas fa-map-marker-alt"></i> ${s.name}</button>`).join('')}
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
        c.innerHTML = `<div class="section-header"><h3><i class="fas fa-fire"></i> ${data.name}景點推薦</h3></div>
            <div class="card-list">${data.attractions.map((a,i) => this.renderAttractionCard(a,i)).join('')}</div>`;
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
            <div class="card-footer"><div class="card-tags">${a.tags.map(t=>`<span class="tag ${t==='必訪'?'tag-hot':''} ${t==='門票'?'tag-ticket':''}">${t}</span>`).join('')}</div><a href="https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a></div></div>`;
    }

    // ===== Restaurants (with editable price) =====
    renderRestaurants() {
        const c = document.getElementById('tab-restaurants');
        const data = getDestData(this.selectedCity);
        c.innerHTML = `<div class="section-header"><h3><i class="fas fa-star"></i> ${data.name}美食推薦</h3></div>
            <div class="card-list">${data.restaurants.map((r,i) => this.renderRestaurantCard(r,i)).join('')}</div>`;
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
            <div class="card-footer"><div class="card-tags">${r.tags.map(t=>`<span class="tag ${t==='必吃'||t==='排隊名店'?'tag-hot':''}">${t}</span>`).join('')}</div><a href="https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}" target="_blank" class="gmaps-link" onclick="event.stopPropagation()"><i class="fas fa-map-marker-alt"></i> Google Maps</a></div></div>`;
    }

    // ===== Transport Detail =====
    renderTransportDetail() {
        const c = document.getElementById('tab-transport-detail');
        const data = getDestData(this.selectedCity);
        if (!data.transport) { c.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:2rem">交通資訊建置中</p>'; return; }
        c.innerHTML = data.transport.map(t => `
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
                <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" target="_blank" class="btn-outline" style="text-decoration:none;text-align:center;flex:1;padding:0.6rem;border-radius:var(--radius-sm);font-size:0.85rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:0.3rem;background:rgba(255,255,255,0.7);color:#1a73e8;border:1.5px solid #1a73e8"><i class="fas fa-map-marker-alt"></i> Google Maps</a>
                <button class="btn-primary" style="border:none" onclick="app.closeModal('detail-modal')"><i class="fas fa-check"></i> 關閉</button>
            </div>`;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('detail-modal').classList.remove('hidden');
        } catch (e) {
            console.error('showDetail error:', e);
            this.showToast('載入詳情發生錯誤');
        }
    }

    closeModal(id) { document.getElementById(id).classList.add('hidden'); }

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

// ===== PWA Install Prompt =====
(function() {
    // iOS Safari detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    if (isIOS && !isStandalone && !localStorage.getItem('travelgo_pwa_dismissed')) {
        setTimeout(() => {
            const banner = document.createElement('div');
            banner.className = 'pwa-install-banner';
            banner.innerHTML = `
                <div class="pwa-icon"><i class="fas fa-mobile-alt"></i></div>
                <div class="pwa-text">
                    <strong>安裝 TravelGo App</strong>
                    <span>點擊 Safari 分享按鈕 <i class="fas fa-external-link-alt"></i> 然後選擇「加入主畫面」即可安裝</span>
                </div>
                <button class="pwa-close" onclick="this.parentElement.remove();localStorage.setItem('travelgo_pwa_dismissed','1')"><i class="fas fa-times"></i></button>
            `;
            document.body.appendChild(banner);
            // Auto dismiss after 15 seconds
            setTimeout(() => banner.remove(), 15000);
        }, 3000);
    }

    // Android / Chrome install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (localStorage.getItem('travelgo_pwa_dismissed')) return;
        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-icon"><i class="fas fa-download"></i></div>
            <div class="pwa-text">
                <strong>安裝 TravelGo App</strong>
                <span>加入桌面，離線也能查看行程</span>
            </div>
            <button class="btn-primary-sm" onclick="installPWA(this)" style="white-space:nowrap"><i class="fas fa-plus"></i> 安裝</button>
            <button class="pwa-close" onclick="this.parentElement.remove();localStorage.setItem('travelgo_pwa_dismissed','1')"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(banner);
    });

    window.installPWA = async function(btn) {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            btn.closest('.pwa-install-banner').remove();
        }
        deferredPrompt = null;
    };
})();
