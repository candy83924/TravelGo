/**
 * Google Places Service - TravelGo
 * 封裝 Google Places API (New) 的搜尋與詳情功能
 */
class GooglePlacesService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.isLoaded = false;
        this.isLoading = false;
        this.placesLib = null;
        this._searchCache = new Map(); // 搜尋結果快取
        this._lastSearchTime = 0;
    }

    /** 動態載入 Google Maps JS API */
    async init() {
        if (this.isLoaded) return true;
        if (this.isLoading) {
            // 等待載入完成
            return new Promise(resolve => {
                const check = setInterval(() => {
                    if (this.isLoaded) { clearInterval(check); resolve(true); }
                }, 100);
                setTimeout(() => { clearInterval(check); resolve(false); }, 15000);
            });
        }
        if (!this.apiKey) {
            console.warn('[Places] No API key provided');
            return false;
        }

        this.isLoading = true;
        try {
            // 動態加載 Google Maps API
            await this._loadScript(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&language=zh-TW`);
            // 取得 places library
            this.placesLib = await google.maps.importLibrary('places');
            this.isLoaded = true;
            this.isLoading = false;
            console.log('[Places] Google Places API loaded successfully');
            return true;
        } catch (err) {
            this.isLoading = false;
            console.error('[Places] Failed to load Google Places API:', err);
            return false;
        }
    }

    _loadScript(src) {
        return new Promise((resolve, reject) => {
            // 如果已經載入
            if (window.google?.maps) { resolve(); return; }
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Google Maps script'));
            document.head.appendChild(script);
        });
    }

    /**
     * 搜尋地點 (Text Search)
     * @param {string} query - 搜尋關鍵字
     * @param {object} location - {lat, lng} 搜尋中心
     * @param {string} typeFilter - 'attraction'|'restaurant'|'hotel'|''
     * @param {number} maxResults - 最多返回筆數
     * @returns {Array} 格式化後的地點陣列
     */
    async searchPlaces(query, location = null, typeFilter = '', maxResults = 10) {
        if (!this.isLoaded) {
            const ok = await this.init();
            if (!ok) throw new Error('Google Places API 尚未載入');
        }

        // 防抖: 300ms
        const now = Date.now();
        if (now - this._lastSearchTime < 300) {
            await new Promise(r => setTimeout(r, 300));
        }
        this._lastSearchTime = Date.now();

        // 檢查快取
        const cacheKey = `${query}|${typeFilter}|${location?.lat}|${location?.lng}`;
        if (this._searchCache.has(cacheKey)) {
            return this._searchCache.get(cacheKey);
        }

        try {
            const { Place } = this.placesLib;

            const request = {
                textQuery: query,
                fields: [
                    'id', 'displayName', 'formattedAddress', 'location',
                    'rating', 'userRatingCount', 'photos', 'types',
                    'regularOpeningHours', 'priceLevel', 'editorialSummary',
                    'primaryType', 'primaryTypeDisplayName', 'websiteURI'
                ],
                language: 'zh-TW',
                maxResultCount: maxResults,
            };

            // 如果有位置，加入 locationBias
            if (location) {
                request.locationBias = {
                    center: { lat: location.lat, lng: location.lng },
                    radius: 50000 // 50km
                };
            }

            // 類型過濾
            if (typeFilter === 'restaurant') {
                request.includedType = 'restaurant';
            } else if (typeFilter === 'hotel') {
                request.includedType = 'hotel';
            }

            const { places } = await Place.searchByText(request);

            const results = (places || []).map(p => this.formatPlaceResult(p));

            // 快取結果 (最多保留50組)
            if (this._searchCache.size > 50) {
                const firstKey = this._searchCache.keys().next().value;
                this._searchCache.delete(firstKey);
            }
            this._searchCache.set(cacheKey, results);

            return results;
        } catch (err) {
            console.error('[Places] Search error:', err);
            throw err;
        }
    }

    /**
     * 將 Google Place 結果格式化為 app 的 spotData 格式
     */
    formatPlaceResult(place) {
        let photoUrl = '';
        try {
            if (place.photos && place.photos.length > 0) {
                photoUrl = place.photos[0].getURI({ maxWidth: 600, maxHeight: 400 });
            }
        } catch (e) {
            photoUrl = '';
        }

        // 判斷類型
        const types = place.types || [];
        let itemType = '地點';
        let appType = 'attraction';
        if (types.some(t => ['restaurant', 'food', 'cafe', 'bakery', 'bar', 'meal_delivery', 'meal_takeaway'].includes(t))) {
            itemType = '餐廳';
            appType = 'meal';
        } else if (types.some(t => ['lodging', 'hotel', 'motel', 'resort_hotel'].includes(t))) {
            itemType = '住宿';
            appType = 'hotel';
        } else if (types.some(t => ['tourist_attraction', 'museum', 'park', 'amusement_park', 'zoo', 'aquarium'].includes(t))) {
            itemType = '景點';
            appType = 'attraction';
        }

        // 顯示名稱 (New API 直接回傳字串，非 {text:...} 物件)
        const displayType = (typeof place.primaryTypeDisplayName === 'string'
            ? place.primaryTypeDisplayName
            : place.primaryTypeDisplayName?.text) || itemType;

        // 開放時間
        let hoursStr = '';
        try {
            if (place.regularOpeningHours?.weekdayDescriptions) {
                hoursStr = place.regularOpeningHours.weekdayDescriptions.join(' | ');
            }
        } catch (e) {}

        // 價格等級
        const priceLevelMap = { 'FREE': '$', 'INEXPENSIVE': '$', 'MODERATE': '$$', 'EXPENSIVE': '$$$', 'VERY_EXPENSIVE': '$$$$' };
        const priceLevel = priceLevelMap[place.priceLevel] || '$';

        return {
            id: 'gp_' + (place.id || Math.random().toString(36).substr(2, 9)),
            name: (typeof place.displayName === 'string' ? place.displayName : place.displayName?.text) || '未知地點',
            type: displayType,
            rating: (typeof place.rating === 'number') ? place.rating : 0,
            reviews: (typeof place.userRatingCount === 'number') ? place.userRatingCount : 0,
            ticket: 0,
            price: 0,
            priceLevel: priceLevel,
            address: place.formattedAddress || '',
            lat: (typeof place.location?.lat === 'function' ? place.location.lat() : place.location?.lat) || 0,
            lng: (typeof place.location?.lng === 'function' ? place.location.lng() : place.location?.lng) || 0,
            hours: hoursStr,
            openDays: [0, 1, 2, 3, 4, 5, 6],
            duration: '1-2小時',
            hasTicket: false,
            description: (typeof place.editorialSummary === 'string' ? place.editorialSummary : place.editorialSummary?.text) || '',
            reason: '',
            userReview: '',
            recommended: [],
            tags: ['Google Places'],
            image: photoUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            _isGooglePlace: true,
            _placeId: place.id || '',
            _appType: appType,
            _websiteUrl: place.websiteURI || '',
        };
    }

    /**
     * 將 Google 地點轉為住宿格式
     */
    formatAsHotel(placeData) {
        return {
            id: placeData.id,
            name: placeData.name,
            type: placeData.type || '旅館',
            rating: placeData.rating,
            reviews: placeData.reviews,
            lat: placeData.lat,
            lng: placeData.lng,
            checkIn: '15:00',
            checkOut: '11:00',
            address: placeData.address,
            description: placeData.description || '',
            amenities: [],
            image: placeData.image,
            prices: { agoda: 0, booking: 0, trip: 0, trivago: 0 },
            _isGooglePlace: true,
            _placeId: placeData._placeId,
        };
    }

    /** 清除快取 */
    clearCache() {
        this._searchCache.clear();
    }
}

// 全域實例 (API Key 將在 init 時設定)
window.placesService = new GooglePlacesService('');
