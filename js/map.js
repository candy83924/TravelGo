// ===== Leaflet Map Manager (OpenStreetMap - no API key needed) =====

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.routeLine = null;
        this.isExpanded = false;
        this.init();
    }

    init() {
        this.map = L.map('map', {
            center: [23.9871, 121.6016],
            zoom: 12,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 18,
        }).addTo(this.map);

        this.setupControls();

        // Fix: Leaflet needs resize when container size changes
        setTimeout(() => this.map.invalidateSize(), 300);
    }

    // 清除所有標記和路線
    clearAll() {
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
            this.routeLine = null;
        }
    }

    // 自訂圖標
    createIcon(color, icon) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${color};width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white"><i class="fas ${icon}"></i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -18],
        });
    }

    // 顯示目的地中心
    showDestination(cityName, lat, lng) {
        this.clearAll();
        this.map.setView([lat, lng], 12);
    }

    // 顯示單一地點
    showLocation(name, lat, lng, type) {
        this.clearAll();
        const iconMap = {
            attraction: { color: '#0ea5e9', icon: 'fa-camera' },
            meal: { color: '#f97316', icon: 'fa-utensils' },
            hotel: { color: '#8b5cf6', icon: 'fa-bed' },
            transport: { color: '#22c55e', icon: 'fa-train' },
        };
        const style = iconMap[type] || iconMap.attraction;
        const marker = L.marker([lat, lng], { icon: this.createIcon(style.color, style.icon) })
            .addTo(this.map)
            .bindPopup(`<div class="map-popup-title">${name}</div>`)
            .openPopup();
        this.markers.push(marker);
        this.map.setView([lat, lng], 15);
        this.scrollToMap();
    }

    // 顯示每日行程路線（以住宿為中心）
    showDayRoute(hotel, daySpots, dayNum) {
        this.clearAll();

        if (!hotel) return;

        // Hotel marker
        const hotelMarker = L.marker([hotel.lat, hotel.lng], {
            icon: this.createIcon('#8b5cf6', 'fa-bed')
        }).addTo(this.map).bindPopup(`
            <div class="map-popup-title"><i class="fas fa-bed"></i> ${hotel.name}</div>
            <div class="map-popup-desc">住宿據點</div>
        `);
        this.markers.push(hotelMarker);

        // Spot markers with numbers
        const routePoints = [[hotel.lat, hotel.lng]];

        daySpots.forEach((spot, i) => {
            const isRestaurant = spot.price !== undefined && spot.recommended;
            const color = isRestaurant ? '#f97316' : '#0ea5e9';
            const icon = isRestaurant ? 'fa-utensils' : 'fa-camera';

            const marker = L.marker([spot.lat, spot.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white">${i + 1}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -18],
                })
            }).addTo(this.map).bindPopup(`
                <div class="map-popup-title">${i + 1}. ${spot.name}</div>
                <div class="map-popup-desc">${spot.type || ''} · ${spot.rating ? '★' + spot.rating : ''}</div>
            `);
            this.markers.push(marker);
            routePoints.push([spot.lat, spot.lng]);
        });

        // Close the route back to hotel
        routePoints.push([hotel.lat, hotel.lng]);

        // Draw route line
        this.routeLine = L.polyline(routePoints, {
            color: '#0ea5e9',
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 8',
        }).addTo(this.map);

        // Fit bounds
        const bounds = L.latLngBounds(routePoints);
        this.map.fitBounds(bounds, { padding: [30, 30] });
    }

    // 顯示所有天的總覽
    showAllDaysOverview(hotel, allDays) {
        this.clearAll();
        if (!hotel) return;

        const hotelMarker = L.marker([hotel.lat, hotel.lng], {
            icon: this.createIcon('#8b5cf6', 'fa-bed')
        }).addTo(this.map).bindPopup(`<div class="map-popup-title">${hotel.name}</div><div class="map-popup-desc">住宿據點</div>`);
        this.markers.push(hotelMarker);

        const dayColors = ['#0ea5e9', '#f97316', '#22c55e', '#ef4444', '#8b5cf6', '#eab308', '#ec4899'];
        const allPoints = [[hotel.lat, hotel.lng]];

        allDays.forEach((day, di) => {
            const color = dayColors[di % dayColors.length];
            day.spots.forEach((spot, si) => {
                const marker = L.marker([spot.lat, spot.lng], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white">D${di + 1}</div>`,
                        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16],
                    })
                }).addTo(this.map).bindPopup(`<div class="map-popup-title">${spot.name}</div><div class="map-popup-desc">Day ${di + 1} · ${spot.type || ''}</div>`);
                this.markers.push(marker);
                allPoints.push([spot.lat, spot.lng]);
            });
        });

        if (allPoints.length > 1) {
            this.map.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30] });
        }
    }

    scrollToMap() {
        const section = document.getElementById('map-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setupControls() {
        const toggleBtn = document.getElementById('btn-toggle-map');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.isExpanded = !this.isExpanded;
                const container = document.getElementById('map-container');
                container.classList.toggle('expanded', this.isExpanded);
                toggleBtn.querySelector('i').className = this.isExpanded ? 'fas fa-compress' : 'fas fa-expand';
                setTimeout(() => this.map.invalidateSize(), 350);
            });
        }
    }

    invalidate() {
        if (this.map) this.map.invalidateSize();
    }
}
