// ===== 全台旅遊資料庫 =====

const TAIWAN_CITIES = [
    { id: 'taipei', name: '台北', region: '北部', lat: 25.0330, lng: 121.5654 },
    { id: 'newtaipei', name: '新北', region: '北部', lat: 25.0120, lng: 121.4650 },
    { id: 'keelung', name: '基隆', region: '北部', lat: 25.1276, lng: 121.7392 },
    { id: 'taoyuan', name: '桃園', region: '北部', lat: 24.9936, lng: 121.3010 },
    { id: 'hsinchu', name: '新竹', region: '北部', lat: 24.8138, lng: 120.9675 },
    { id: 'miaoli', name: '苗栗', region: '中部', lat: 24.5602, lng: 120.8214 },
    { id: 'taichung', name: '台中', region: '中部', lat: 24.1477, lng: 120.6736 },
    { id: 'changhua', name: '彰化', region: '中部', lat: 24.0518, lng: 120.5161 },
    { id: 'nantou', name: '南投', region: '中部', lat: 23.9610, lng: 120.9718 },
    { id: 'yunlin', name: '雲林', region: '中部', lat: 23.7092, lng: 120.4313 },
    { id: 'chiayi', name: '嘉義', region: '南部', lat: 23.4801, lng: 120.4491 },
    { id: 'tainan', name: '台南', region: '南部', lat: 22.9999, lng: 120.2269 },
    { id: 'kaohsiung', name: '高雄', region: '南部', lat: 22.6273, lng: 120.3014 },
    { id: 'pingtung', name: '屏東', region: '南部', lat: 22.5519, lng: 120.5487 },
    { id: 'yilan', name: '宜蘭', region: '東部', lat: 24.7570, lng: 121.7533 },
    { id: 'hualien', name: '花蓮', region: '東部', lat: 23.9871, lng: 121.6016 },
    { id: 'taitung', name: '台東', region: '東部', lat: 22.7583, lng: 121.1444 },
    { id: 'penghu', name: '澎湖', region: '離島', lat: 23.5711, lng: 119.5793 },
    { id: 'kinmen', name: '金門', region: '離島', lat: 24.4493, lng: 118.3767 },
    { id: 'matsu', name: '馬祖', region: '離島', lat: 26.1505, lng: 119.9289 },
];

// 交通方式選項
const TRANSPORT_OPTIONS = [
    { id: 'train', name: '台鐵', icon: 'fa-train', iconClass: 'train', detail: '自強號/莒光號' },
    { id: 'hsr', name: '高鐵', icon: 'fa-bolt', iconClass: 'hsr', detail: '最快速' },
    { id: 'plane', name: '飛機', icon: 'fa-plane', iconClass: 'plane', detail: '國內線' },
    { id: 'bus', name: '客運', icon: 'fa-bus', iconClass: 'bus', detail: '最經濟' },
    { id: 'car', name: '自駕', icon: 'fa-car', iconClass: 'car', detail: '最自由' },
];

// openDays: 0=日, 1=一, ..., 6=六
const DESTINATIONS_DB = {
    hualien: {
        name: '花蓮',
        center: { lat: 23.9871, lng: 121.6016 },
        attractions: [
            {
                id: 'a1', name: '太魯閣國家公園', type: '自然景觀', rating: 4.8, reviews: 28500,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣秀林鄉富世村富世291號', lat: 24.1586, lng: 121.4969,
                hours: '08:30-17:00', openDays: [1,2,3,4,5,6,0], duration: '4-6小時',
                description: '台灣最具代表性的峽谷地形國家公園，大理岩峽谷景觀舉世聞名。九曲洞步道、砂卡礑步道、燕子口等都是必訪景點。',
                reason: '全台最壯觀的大理岩峽谷，被國際旅遊雜誌評選為台灣必訪景點第一名。步道規劃完善，適合各種體力程度的遊客。',
                userReview: '「峽谷景色真的令人震撼，尤其是九曲洞步道，走在其中有種被大自然包圍的感動。」— Google 評論精選',
                tags: ['必訪', '免費', '戶外'], hasTicket: false,
                bestTimeSlot: 'morning',
                image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=600&h=400&fit=crop',
            },
            {
                id: 'a2', name: '七星潭風景區', type: '海景', rating: 4.6, reviews: 18200,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣新城鄉海岸路', lat: 24.0410, lng: 121.6311,
                hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1-2小時',
                description: '花蓮最美的礫石海灘，弧形海灣配上蔚藍太平洋，日出景色絕美。',
                reason: '花蓮地標性海灘，獨特的鵝卵石海岸線全台獨有。清晨日出和傍晚夕陽都非常壯觀，是攝影愛好者的天堂。',
                userReview: '「海水顏色美到不真實，從淺綠到深藍的漸層讓人看了就心曠神怡。」— 旅客心得',
                tags: ['必訪', '免費', '海景', '日出'], hasTicket: false,
                bestTimeSlot: 'afternoon',
                image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
            },
            {
                id: 'a3', name: '清水斷崖', type: '自然景觀', rating: 4.7, reviews: 15600,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣秀林鄉蘇花公路', lat: 24.2285, lng: 121.4730,
                hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1-2小時',
                description: '台灣十景之一，斷崖絕壁直落太平洋，層次分明的藍綠色海水令人屏息。',
                reason: '入選台灣十景的絕美斷崖，垂直落差超過1000公尺。從崇德觀景台俯瞰，大理岩斷崖與太平洋交會的壯闊景象獨步全球。',
                userReview: '「第一次看到時真的會倒吸一口氣，照片完全拍不出那種壯觀！」— Google 4.9星評論',
                tags: ['必訪', '免費', '壯觀'], hasTicket: false,
                bestTimeSlot: 'morning',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
            },
            {
                id: 'a4', name: '花蓮東大門夜市', type: '夜市', rating: 4.3, reviews: 22100,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣花蓮市中山路50號', lat: 23.9749, lng: 121.6078,
                hours: '17:00-23:30', openDays: [0,1,2,3,4,5,6], duration: '2-3小時',
                description: '花蓮最大夜市，匯集原住民美食、海鮮燒烤、創意小吃。',
                reason: '全台最具原住民風味的夜市，可品嚐到石板烤肉、竹筒飯等獨特美食。佔地廣大，分為福町、大陸、自強、原住民等四大區域。',
                userReview: '「原住民烤肉串超好吃，價格又便宜，一個人200元就能吃很飽！」— 美食部落客推薦',
                tags: ['美食', '夜間', '熱鬧'], hasTicket: false,
                bestTimeSlot: 'evening',
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
            },
            {
                id: 'a5', name: '遠雄海洋公園', type: '主題樂園', rating: 4.2, reviews: 12300,
                ticket: 890, priceLevel: '$$',
                address: '花蓮縣壽豐鄉鹽寮村福德189號', lat: 23.8960, lng: 121.5531,
                hours: '09:00-17:00', openDays: [1,2,3,4,5,6,0], duration: '5-7小時',
                closedDays: '週三公休（暑假除外）',
                description: '結合海洋生態與遊樂設施的主題公園，海豚表演、海獅秀精彩可期。',
                reason: '全台唯一臨海主題樂園，擁有8大主題區。海豚互動體驗是獨家亮點，小朋友可以近距離接觸海豚，是親子旅遊首選。',
                userReview: '「海豚表演超精彩！小孩玩一整天都不膩，門票雖然不便宜但值得。」— 親子旅遊達人',
                tags: ['親子', '門票', '樂園'], hasTicket: true,
                bestTimeSlot: 'morning',
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
            },
            {
                id: 'a6', name: '瑞穗牧場', type: '農場體驗', rating: 4.1, reviews: 8900,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣瑞穗鄉舞鶴村157號', lat: 23.4969, lng: 121.3586,
                hours: '08:00-18:00', openDays: [0,1,2,3,4,5,6], duration: '1-2小時',
                description: '免費入場的觀光牧場，可近距離接觸乳牛與鴕鳥。',
                reason: '花東縱谷最受歡迎的免費景點。新鮮現擠鮮乳和手工乳酪蛋糕是招牌必買，牧場環境乾淨舒適，適合全家大小。',
                userReview: '「鮮乳超濃超好喝，乳酪蛋糕也好吃到想外帶！免費景點CP值超高。」',
                tags: ['免費', '親子', '體驗'], hasTicket: false,
                bestTimeSlot: 'morning',
                image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=400&fit=crop',
            },
            {
                id: 'a7', name: '雲山水夢幻湖', type: '自然景觀', rating: 4.4, reviews: 11200,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣壽豐鄉豐坪路二段2巷201弄18號', lat: 23.9182, lng: 121.5214,
                hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1-2小時',
                description: '翠綠湖水倒映棕櫚樹，宛如歐洲花園，落羽松季節美不勝收。',
                reason: '有「花蓮小歐洲」美譽的夢幻秘境。湛藍湖水搭配翠綠草地和棕櫚樹，隨手一拍都是明信片。12-1月落羽松變色時期更是美到令人窒息。',
                userReview: '「真的像到了國外一樣！湖水清澈到可以看見魚在游泳。」',
                tags: ['拍照', '免費', '夢幻'], hasTicket: false,
                bestTimeSlot: 'afternoon',
                image: 'https://images.unsplash.com/photo-1518173946687-a50d47f6fac9?w=600&h=400&fit=crop',
            },
            {
                id: 'a8', name: '石梯坪風景區', type: '地質景觀', rating: 4.5, reviews: 6800,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣豐濱鄉石梯坪52號', lat: 23.5089, lng: 121.5108,
                hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時',
                description: '獨特的海蝕地形與壺穴景觀，壯觀的岩石海岸。',
                reason: '擁有全台最完整的海蝕階地地形，被地質學家譽為「地質教室」。退潮時的潮間帶生態豐富，可觀察到各種海洋生物。',
                userReview: '「岩石地形非常特別，退潮時可以看到很多海洋生物，小孩超愛！」',
                tags: ['地質', '免費', '秘境'], hasTicket: false,
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
            },
            {
                id: 'a9', name: '砂卡礑步道', type: '步道健行', rating: 4.6, reviews: 9400,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣秀林鄉砂卡礑林道', lat: 24.1672, lng: 121.4950,
                hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '2-3小時',
                description: '太魯閣最美步道之一，沿途清澈碧綠的溪水、大理岩壁和原始林。',
                reason: '被評為太魯閣最美步道，溪水清澈碧綠宛如翡翠。步道平坦好走，全長4.1公里，是親近大自然的絕佳選擇。',
                userReview: '「溪水的顏色真的是Tiffany藍！步道好走景色又美，大推！」',
                tags: ['步道', '免費', '溪谷'], hasTicket: false,
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
            },
            {
                id: 'a10', name: '花蓮文化創意產業園區', type: '文化藝術', rating: 4.2, reviews: 5600,
                ticket: 0, priceLevel: '$',
                address: '花蓮縣花蓮市中華路144號', lat: 23.9792, lng: 121.6012,
                hours: '11:00-21:00', openDays: [0,2,3,4,5,6], duration: '1-2小時',
                closedDays: '週一公休',
                description: '由舊酒廠改建的文創園區，保留日治時期建築風貌。',
                reason: '日治時代酒廠建築完整保留，結合現代文創展覽。不定期舉辦手作市集和音樂表演，是雨天備案的好去處。',
                userReview: '「建築很有味道，展覽也蠻有水準的，免費參觀很佛心。」',
                tags: ['文創', '免費', '室內'], hasTicket: false,
                bestTimeSlot: 'afternoon',
                image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
            },
            {
                id: 'a11', name: '立川漁場', type: '體驗活動', rating: 4.3, reviews: 7200,
                ticket: 120, priceLevel: '$',
                address: '花蓮縣壽豐鄉魚池45號', lat: 23.8825, lng: 121.5095,
                hours: '08:00-17:00', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時',
                description: '黃金蜆的故鄉，可體驗摸蜆仔兼洗褲的樂趣。',
                reason: '全台最大的黃金蜆養殖場，「摸蜆仔兼洗褲」的體驗活動老少咸宜。蜆精和蜆仔料理是必嚐伴手禮。',
                userReview: '「下水摸蜆仔超有趣，摸到的還可以帶回家煮！很適合帶小孩來。」',
                tags: ['體驗', '門票', '親子'], hasTicket: true,
                image: 'https://images.unsplash.com/photo-1559827291-baf8ef7d081e?w=600&h=400&fit=crop',
            },
        ],

        restaurants: [
            {
                id: 'r1', name: '公正包子店', type: '小吃', rating: 4.5, reviews: 12800,
                price: 50, priceLevel: '$',
                address: '花蓮縣花蓮市中山路199-2號', lat: 23.9753, lng: 121.6045,
                hours: '06:00-12:00', openDays: [0,1,2,3,4,5,6],
                description: '花蓮最知名排隊包子店，營業超過50年。',
                reason: '50年老字號，在地人和觀光客都推薦的早餐首選。小籠包一顆只要5元，皮薄餡多汁，CP值無敵。',
                userReview: '「每次來花蓮一定要來吃！一次買20顆不嫌多。」',
                recommended: ['小籠包 $5/顆', '蒸餃 $5/顆', '酸辣湯 $30'],
                tags: ['排隊名店', '早餐', '便宜'],
                bestTimeSlot: 'breakfast',
                image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop',
            },
            {
                id: 'r2', name: '戴記扁食', type: '小吃', rating: 4.4, reviews: 9200,
                price: 80, priceLevel: '$',
                address: '花蓮縣花蓮市中華路120號', lat: 23.9788, lng: 121.6007,
                hours: '08:00-22:00', openDays: [0,1,2,3,4,5,6],
                description: '花蓮扁食老字號，餛飩皮薄Q彈。',
                reason: '花蓮最有名的扁食（餛飩），傳承三代的好味道。一碗80元份量十足，皮Q餡鮮，湯頭清甜。',
                userReview: '「吃過這裡的扁食就回不去了，皮超Q餡超鮮！」',
                recommended: ['鮮肉扁食 $80', '紅油抄手 $90'],
                tags: ['老字號', '小吃'],
                bestTimeSlot: 'lunch',
                image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop',
            },
            {
                id: 'r3', name: '賴桑壽司屋', type: '日式料理', rating: 4.6, reviews: 7500,
                price: 500, priceLevel: '$$',
                address: '花蓮縣花蓮市林森路46號', lat: 23.9762, lng: 121.5989,
                hours: '11:30-14:00,17:00-20:30', openDays: [0,1,2,3,4,5,6],
                description: '花蓮第一壽司名店，使用當日現撈海鮮。',
                reason: '花蓮排名第一的壽司店，每日菜單依當天漁獲決定，保證新鮮度。價格只有台北同等級的一半，是海鮮控的天堂。',
                userReview: '「生魚片厚切又新鮮，在台北同品質至少要貴一倍！排隊也值得。」',
                recommended: ['綜合生魚片 $350', '海膽握壽司 $120', '炙燒鮭魚 $80'],
                tags: ['必吃', '海鮮', '排隊'],
                bestTimeSlot: 'dinner',
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
            },
            {
                id: 'r4', name: '鵝肉先生', type: '台式料理', rating: 4.3, reviews: 11000,
                price: 300, priceLevel: '$$',
                address: '花蓮縣花蓮市中華路64號', lat: 23.9795, lng: 121.6010,
                hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6],
                description: '花蓮知名鵝肉店，鵝肉鮮嫩多汁。',
                reason: '30年老店，選用本地放養鵝，肉質鮮嫩不柴。半隻鵝肉搭配特調沾醬和白飯，是花蓮人的共同美食記憶。',
                userReview: '「鵝肉鮮嫩到會流汁，搭配蒜蓉醬油超對味！小菜也很出色。」',
                recommended: ['鵝肉（半隻）$450', '鵝肉飯 $60', '筍絲 $50'],
                tags: ['人氣', '台式'],
                bestTimeSlot: 'lunch',
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
            },
            {
                id: 'r5', name: '炸彈蔥油餅', type: '小吃', rating: 4.3, reviews: 15600,
                price: 35, priceLevel: '$',
                address: '花蓮縣花蓮市復興街102號', lat: 23.9765, lng: 121.6053,
                hours: '13:00-18:00', openDays: [0,1,2,3,4,5,6],
                description: '花蓮超人氣銅板美食，金黃酥脆的蔥油餅配半熟蛋。',
                reason: '花蓮IG打卡率最高的銅板美食！蔥油餅炸到外酥內軟，加上半熟蛋一口咬下蛋液流出，畫面超療癒。',
                userReview: '「排了30分鐘但完全值得！蛋液流出來的那瞬間超滿足。」',
                recommended: ['加蛋蔥油餅 $35', '不加蛋 $25'],
                tags: ['排隊名店', '銅板', '必吃'],
                bestTimeSlot: 'breakfast',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
            },
            {
                id: 'r6', name: '噶瑪蘭風味餐廳', type: '原住民料理', rating: 4.4, reviews: 4300,
                price: 400, priceLevel: '$$',
                address: '花蓮縣新城鄉嘉新村嘉新路56號', lat: 24.0312, lng: 121.6108,
                hours: '11:00-14:00,17:00-21:00', openDays: [0,2,3,4,5,6],
                closedDays: '週一公休',
                description: '道地原住民風味料理，竹筒飯、烤山豬肉、野菜沙拉。',
                reason: '體驗花蓮原住民飲食文化的最佳選擇。使用在地食材和傳統烹調方式，竹筒飯和烤山豬肉是必點招牌。',
                userReview: '「竹筒飯香氣十足，烤山豬肉外酥內嫩，很有部落風味！」',
                recommended: ['竹筒飯 $80', '烤山豬肉 $300', '野菜火鍋 $450'],
                tags: ['原住民', '特色', '體驗'],
                bestTimeSlot: 'dinner',
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
            },
            {
                id: 'r7', name: '海埔蚵仔煎', type: '小吃', rating: 4.2, reviews: 8100,
                price: 70, priceLevel: '$',
                address: '花蓮縣花蓮市自由街86號', lat: 23.9778, lng: 121.6031,
                hours: '11:00-21:00', openDays: [0,1,2,3,4,5,6],
                description: '老字號蚵仔煎，蚵仔肥大新鮮。',
                reason: '花蓮在地人推薦的老字號小吃攤，使用當天市場新鮮蚵仔，顆顆飽滿肥美。',
                userReview: '「蚵仔超大顆又新鮮，醬料酸甜剛好，每次來花蓮必吃！」',
                recommended: ['蚵仔煎 $70', '生炒花枝 $120', '蝦仁煎 $80'],
                tags: ['老字號', '海鮮', '小吃'],
                bestTimeSlot: 'dinner',
                image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop',
            },
            {
                id: 'r8', name: '伊万里日本料理', type: '日式料理', rating: 4.5, reviews: 3200,
                price: 800, priceLevel: '$$$',
                address: '花蓮縣花蓮市林森路185號', lat: 23.9745, lng: 121.5978,
                hours: '11:30-14:00,17:30-21:00', openDays: [0,2,3,4,5,6],
                closedDays: '週一公休',
                description: '花蓮高檔日料名店，主廚20年經驗。',
                reason: '花蓮最頂級的日本料理，主廚嚴選當季漁獲。適合特殊紀念日或想犒賞自己的旅客。',
                userReview: '「每一貫壽司都是藝術品！雖然價格高但食材品質對得起這個價錢。」',
                recommended: ['主廚推薦套餐 $1200', '特上握壽司 $680', '海鮮丼 $480'],
                tags: ['高級', '日料', '精緻'],
                image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop',
            },
        ],

        hotels: [
            {
                id: 'h1', name: '太魯閣晶英酒店', type: '五星飯店', rating: 4.7, reviews: 5600,
                lat: 24.1834, lng: 121.4939, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣秀林鄉天祥路18號',
                description: '位於太魯閣國家公園內的五星級飯店，坐擁峽谷絕景。',
                amenities: ['泳池', 'SPA', '健身房', '餐廳', '停車場', '峽谷景觀'],
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
                prices: { agoda: 7800, booking: 8200, trip: 8500, trivago: 7600 },
                roomTypes: [
                    { name: '豪華客房', prices: { agoda: 7800, booking: 8200, trip: 8500, trivago: 7600 } },
                    { name: '峽谷景觀房', prices: { agoda: 11000, booking: 11500, trip: 12000, trivago: 10800 } },
                ],
            },
            {
                id: 'h2', name: '花蓮翰品酒店', type: '四星飯店', rating: 4.4, reviews: 8200,
                lat: 23.9815, lng: 121.6085, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市永興路2號',
                description: '市區親子友善飯店，與幾米品牌聯名打造繽紛空間。',
                amenities: ['泳池', '兒童遊戲室', '餐廳', '停車場', '自行車租借'],
                image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
                prices: { agoda: 2900, booking: 3200, trip: 3100, trivago: 2800 },
                roomTypes: [
                    { name: '標準雙人房', prices: { agoda: 2900, booking: 3200, trip: 3100, trivago: 2800 } },
                    { name: '幾米主題房', prices: { agoda: 4200, booking: 4500, trip: 4300, trivago: 4100 } },
                ],
            },
            {
                id: 'h3', name: '承億文旅花蓮山知道', type: '設計旅店', rating: 4.3, reviews: 4100,
                lat: 23.9736, lng: 121.6019, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市國聯二路56號',
                description: '文創風設計旅店，簡約清新，位置便利。',
                amenities: ['餐廳', '洗衣房', '自行車租借', '市區位置'],
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
                prices: { agoda: 2200, booking: 2500, trip: 2400, trivago: 2100 },
                roomTypes: [
                    { name: '山景雙人房', prices: { agoda: 2200, booking: 2500, trip: 2400, trivago: 2100 } },
                    { name: '海景雙人房', prices: { agoda: 2700, booking: 3000, trip: 2900, trivago: 2600 } },
                ],
            },
            {
                id: 'h4', name: '斯圖亞特海洋莊園', type: '民宿', rating: 4.6, reviews: 2800,
                lat: 23.9120, lng: 121.5605, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣壽豐鄉鹽寮村大坑57號',
                description: '歐風城堡民宿，面海絕佳位置欣賞太平洋日出。',
                amenities: ['海景', '花園', '早餐', '停車場', '拍照景點'],
                image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop',
                prices: { agoda: 3500, booking: 3800, trip: 3600, trivago: 3400 },
                roomTypes: [
                    { name: '公主房', prices: { agoda: 3500, booking: 3800, trip: 3600, trivago: 3400 } },
                    { name: '城堡套房', prices: { agoda: 4800, booking: 5200, trip: 5000, trivago: 4700 } },
                ],
            },
            {
                id: 'h5', name: '力麗華美達安可酒店', type: '商務飯店', rating: 4.2, reviews: 6300,
                lat: 23.9771, lng: 121.5991, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市林森路33號',
                description: '國際品牌，設施新穎，市中心位置交通便利。',
                amenities: ['健身房', '餐廳', '停車場', '會議室'],
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                prices: { agoda: 1900, booking: 2200, trip: 2100, trivago: 1800 },
                roomTypes: [
                    { name: '標準雙人房', prices: { agoda: 1900, booking: 2200, trip: 2100, trivago: 1800 } },
                    { name: '豪華雙人房', prices: { agoda: 2800, booking: 3000, trip: 2900, trivago: 2700 } },
                ],
            },
            {
                id: 'h6', name: '迴音谷森林民宿', type: '民宿', rating: 4.8, reviews: 1500,
                lat: 23.9210, lng: 121.5180, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣壽豐鄉池南村林園路65號',
                description: '隱身山林秘境民宿，被森林環繞的獨棟木屋。',
                amenities: ['森林', '星空觀景', '手作早餐', '停車場'],
                image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop',
                prices: { agoda: 4200, booking: 4500, trip: 4300, trivago: 4000 },
                roomTypes: [
                    { name: '森林雙人房', prices: { agoda: 4200, booking: 4500, trip: 4300, trivago: 4000 } },
                    { name: '星空四人房', prices: { agoda: 6200, booking: 6800, trip: 6500, trivago: 6000 } },
                ],
            },
            {
                id: 'h7', name: '花蓮背包客棧', type: '青年旅舍', rating: 4.0, reviews: 3200,
                lat: 23.9760, lng: 121.6040, checkIn: '14:00', checkOut: '11:00',
                address: '花蓮縣花蓮市國聯一路100號',
                description: '平價背包客棧，位於市中心，交通便利，適合獨旅或預算有限的旅客。',
                amenities: ['共用廚房', '洗衣機', 'WiFi', '置物櫃', '公共休息區'],
                image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
                prices: { agoda: 600, booking: 700, trip: 650, trivago: 580 },
                roomTypes: [
                    { name: '混合背包房（單床位）', prices: { agoda: 600, booking: 700, trip: 650, trivago: 580 } },
                    { name: '女性專屬背包房', prices: { agoda: 650, booking: 750, trip: 700, trivago: 620 } },
                ],
            },
            {
                id: 'h8', name: '七星潭海景民宿', type: '海景民宿', rating: 4.5, reviews: 2100,
                lat: 24.0350, lng: 121.6280, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣新城鄉海岸路198號',
                description: '坐落七星潭旁的絕美海景民宿，每間房皆可眺望太平洋，日出美景盡收眼底。',
                amenities: ['海景陽台', '免費早餐', '停車場', '自行車租借', '觀景台'],
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
                prices: { agoda: 2800, booking: 3100, trip: 2900, trivago: 2700 },
                roomTypes: [
                    { name: '海景雙人房', prices: { agoda: 2800, booking: 3100, trip: 2900, trivago: 2700 } },
                    { name: '海景家庭房', prices: { agoda: 4000, booking: 4300, trip: 4100, trivago: 3900 } },
                ],
            },
            {
                id: 'h9', name: '花蓮理想大地渡假飯店', type: '渡假村', rating: 4.6, reviews: 9500,
                lat: 23.8920, lng: 121.5300, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣壽豐鄉理想路1號',
                description: '佔地250公頃的西班牙風格渡假村，擁有運河、泳池、高爾夫球場等豪華設施。',
                amenities: ['運河遊船', '泳池', 'SPA', '高爾夫', '兒童遊戲區', '多間餐廳', '健身房'],
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
                prices: { agoda: 6500, booking: 7000, trip: 6800, trivago: 6200 },
                roomTypes: [
                    { name: '豪華客房', prices: { agoda: 6500, booking: 7000, trip: 6800, trivago: 6200 } },
                    { name: '運河景觀套房', prices: { agoda: 9500, booking: 10000, trip: 9800, trivago: 9200 } },
                ],
            },
            {
                id: 'h11', name: '遠雄悅來大飯店', type: '五星飯店', rating: 4.4, reviews: 7800,
                lat: 23.9020, lng: 121.5550, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣壽豐鄉山嶺18號',
                description: '坐落於海岸山脈上的五星級飯店，可俯瞰太平洋，毗鄰遠雄海洋公園。',
                amenities: ['泳池', 'SPA', '健身房', '兒童遊戲室', '海景餐廳', '接駁車', '停車場'],
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
                prices: { agoda: 4800, booking: 5200, trip: 5000, trivago: 4600 },
                roomTypes: [
                    { name: '豪華海景房', prices: { agoda: 4800, booking: 5200, trip: 5000, trivago: 4600 } },
                    { name: '家庭套房', prices: { agoda: 7200, booking: 7800, trip: 7500, trivago: 7000 } },
                ],
            },
            {
                id: 'h12', name: '洄瀾窩青年旅舍', type: '青年旅舍', rating: 4.2, reviews: 2600,
                lat: 23.9755, lng: 121.6055, checkIn: '14:00', checkOut: '11:00',
                address: '花蓮縣花蓮市復興街57號',
                description: '文青風格青年旅舍，定期舉辦旅行分享會與在地導覽活動，是結交旅伴的好地方。',
                amenities: ['共用廚房', '交誼廳', '洗衣機', 'WiFi', '行李寄存', '旅遊諮詢'],
                image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop',
                prices: { agoda: 800, booking: 900, trip: 850, trivago: 750 },
                roomTypes: [
                    { name: '背包床位', prices: { agoda: 800, booking: 900, trip: 850, trivago: 750 } },
                    { name: '雙人雅房', prices: { agoda: 1500, booking: 1700, trip: 1600, trivago: 1400 } },
                ],
            },
            {
                id: 'h13', name: '花蓮翰品酒店', type: '四星飯店', rating: 4.4, reviews: 7600,
                lat: 23.9818, lng: 121.6080, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市永興路2號',
                description: '市區精緻四星飯店，與幾米品牌聯名合作，繽紛童趣的設計深受親子家庭喜愛。設施完善，地理位置優越。',
                amenities: ['泳池', '兒童遊戲室', '餐廳', '停車場', 'WiFi', '自行車租借'],
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
                prices: { agoda: 3200, booking: 3500, trip: 3400, trivago: 3100 },
                roomTypes: [
                    { name: '標準雙人房', prices: { agoda: 3200, booking: 3500, trip: 3400, trivago: 3100 } },
                    { name: '幾米主題家庭房', prices: { agoda: 4500, booking: 4800, trip: 4600, trivago: 4300 } },
                ],
            },
            {
                id: 'h14', name: '成旅晶贊飯店花蓮假期', type: '商務飯店', rating: 4.2, reviews: 3800,
                lat: 23.9740, lng: 121.6035, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市中華路231號',
                description: '位於花蓮市中心的商務飯店，鄰近東大門夜市，交通便利，客房乾淨舒適，是商務出差及自由行的理想選擇。',
                amenities: ['WiFi', '餐廳', '停車場', '洗衣服務', '會議室'],
                image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
                prices: { agoda: 2100, booking: 2400, trip: 2300, trivago: 2000 },
                roomTypes: [
                    { name: '標準雙人房', prices: { agoda: 2100, booking: 2400, trip: 2300, trivago: 2000 } },
                    { name: '豪華雙人房', prices: { agoda: 2800, booking: 3100, trip: 3000, trivago: 2700 } },
                ],
            },
            {
                id: 'h15', name: '花蓮力麗哲園', type: '精品旅館', rating: 4.3, reviews: 2900,
                lat: 23.9765, lng: 121.5995, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市林森路180號',
                description: '精品風格旅館，融合在地文化與現代設計，客房寬敞明亮。鄰近花蓮文創園區，步行可達市區各景點。',
                amenities: ['WiFi', '早餐', '停車場', '自行車租借', '圖書閱覽室'],
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
                prices: { agoda: 2500, booking: 2800, trip: 2700, trivago: 2400 },
                roomTypes: [
                    { name: '精緻雙人房', prices: { agoda: 2500, booking: 2800, trip: 2700, trivago: 2400 } },
                    { name: '豪華家庭房', prices: { agoda: 3600, booking: 3900, trip: 3800, trivago: 3500 } },
                ],
            },
            {
                id: 'h16', name: '藍天麗池飯店', type: '城市飯店', rating: 4.1, reviews: 4200,
                lat: 23.9752, lng: 121.6048, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市中正路590號',
                description: '花蓮老字號城市飯店，地理位置絕佳，步行即達市中心商圈與東大門夜市。房間整潔，服務親切。',
                amenities: ['WiFi', '餐廳', '停車場', '洗衣服務', '商務中心'],
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
                prices: { agoda: 1800, booking: 2100, trip: 2000, trivago: 1700 },
                roomTypes: [
                    { name: '標準雙人房', prices: { agoda: 1800, booking: 2100, trip: 2000, trivago: 1700 } },
                    { name: '商務套房', prices: { agoda: 2600, booking: 2900, trip: 2800, trivago: 2500 } },
                ],
            },
            {
                id: 'h17', name: '花蓮福容大飯店', type: '五星飯店', rating: 4.6, reviews: 6100,
                lat: 23.9690, lng: 121.6100, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市民生路51號',
                description: '花蓮市區頂級五星飯店，擁有完善的休閒設施與多間餐廳。頂樓無邊際泳池可眺望太平洋，是城市度假的首選。',
                amenities: ['無邊際泳池', 'SPA', '健身房', '三溫暖', '餐廳', '停車場', '兒童遊戲區'],
                image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop',
                prices: { agoda: 5200, booking: 5600, trip: 5400, trivago: 5000 },
                roomTypes: [
                    { name: '豪華海景房', prices: { agoda: 5200, booking: 5600, trip: 5400, trivago: 5000 } },
                    { name: '行政套房', prices: { agoda: 8500, booking: 9000, trip: 8800, trivago: 8200 } },
                ],
            },
            {
                id: 'h18', name: '麗翔酒店連鎖花蓮館', type: '溫泉飯店', rating: 4.3, reviews: 3400,
                lat: 23.9560, lng: 121.5970, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市中美路142號',
                description: '擁有天然溫泉的休閒飯店，每間客房皆配有獨立溫泉浴池。結合日式湯屋文化與花蓮在地風情，是放鬆身心的好去處。',
                amenities: ['客房溫泉', '露天風呂', '餐廳', '停車場', 'WiFi', 'SPA'],
                image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop',
                prices: { agoda: 3800, booking: 4100, trip: 4000, trivago: 3600 },
                roomTypes: [
                    { name: '溫泉標準房', prices: { agoda: 3800, booking: 4100, trip: 4000, trivago: 3600 } },
                    { name: '溫泉豪華套房', prices: { agoda: 5500, booking: 5900, trip: 5700, trivago: 5300 } },
                ],
            },
            {
                id: 'h19', name: '煙波大飯店花蓮館', type: '度假飯店', rating: 4.5, reviews: 8900,
                lat: 23.9700, lng: 121.6060, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市中美路142號',
                description: '花蓮知名度假飯店，擁有全花蓮最大的室內親水設施。兒童遊樂區設備豐富，是親子旅遊的熱門選擇。',
                amenities: ['室內水樂園', '兒童遊戲區', '健身房', '餐廳', '停車場', 'WiFi', 'SPA'],
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
                prices: { agoda: 4200, booking: 4600, trip: 4400, trivago: 4000 },
                roomTypes: [
                    { name: '精緻家庭房', prices: { agoda: 4200, booking: 4600, trip: 4400, trivago: 4000 } },
                    { name: '豪華海景房', prices: { agoda: 5800, booking: 6200, trip: 6000, trivago: 5600 } },
                ],
            },
            {
                id: 'h20', name: '捷絲旅花蓮中正館', type: '文青旅店', rating: 4.2, reviews: 3100,
                lat: 23.9730, lng: 121.6010, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市中正路396號',
                description: '晶華集團旗下文青風格旅店，設計簡約時尚。提供在地文化體驗活動，讓旅客深度感受花蓮之美。',
                amenities: ['WiFi', '自行車租借', '早餐', '洗衣房', '閱讀空間'],
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
                prices: { agoda: 2300, booking: 2600, trip: 2500, trivago: 2200 },
                roomTypes: [
                    { name: '舒適雙人房', prices: { agoda: 2300, booking: 2600, trip: 2500, trivago: 2200 } },
                ],
            },
            {
                id: 'h21', name: '花蓮美侖大飯店', type: '五星飯店', rating: 4.4, reviews: 7200,
                lat: 23.9850, lng: 121.6130, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣花蓮市林園1-1號',
                description: '花蓮歷史悠久的五星級飯店，佔地廣大，設施完善。擁有標準游泳池、網球場等運動設施，適合家庭及團體旅遊。',
                amenities: ['泳池', '網球場', '健身房', 'SPA', '餐廳', '停車場', '兒童遊戲區', '商務中心'],
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
                prices: { agoda: 4000, booking: 4400, trip: 4200, trivago: 3800 },
                roomTypes: [
                    { name: '豪華雙人房', prices: { agoda: 4000, booking: 4400, trip: 4200, trivago: 3800 } },
                    { name: '總統套房', prices: { agoda: 12000, booking: 12800, trip: 12500, trivago: 11500 } },
                ],
            },
            {
                id: 'h22', name: '瑞穗天合國際觀光酒店', type: '頂級度假村', rating: 4.7, reviews: 5400,
                lat: 23.4975, lng: 121.3540, checkIn: '15:00', checkOut: '11:00',
                address: '花蓮縣瑞穗鄉溫泉路二段368號',
                description: '全台最大歐風城堡度假村，佔地兩萬坪。擁有金色水樂園、溫泉、高爾夫推桿場等頂級設施，宛如置身歐洲小鎮。',
                amenities: ['金色水樂園', '溫泉', 'SPA', '高爾夫', '兒童超跑', '多間餐廳', '健身房', '停車場'],
                image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop',
                prices: { agoda: 12000, booking: 13000, trip: 12800, trivago: 11500 },
                roomTypes: [
                    { name: '莊園標準房', prices: { agoda: 12000, booking: 13000, trip: 12800, trivago: 11500 } },
                    { name: '城堡家庭房', prices: { agoda: 15000, booking: 15800, trip: 15500, trivago: 14500 } },
                ],
            },
        ],

        transport: [
            {
                id: 't1', name: '台鐵自強號', type: 'train', icon: 'fa-train',
                route: '台北 → 花蓮', price: 440, duration: '2小時10分',
                frequency: '每30-60分鐘一班', departure: '台北車站', arrival: '花蓮車站',
                pros: ['班次密集', '價格親民', '直達市區'],
                cons: ['座位較擠', '熱門時段一票難求'],
                tip: '建議提前14天上網訂票，連假期間更要提早',
                schedule: [
                    { time: '06:15', train: '自強408', dur: '2h10m' },
                    { time: '07:00', train: '太魯閣206', dur: '2h00m' },
                    { time: '08:30', train: '普悠瑪222', dur: '2h05m' },
                    { time: '10:00', train: '自強310', dur: '2h15m' },
                    { time: '12:00', train: '太魯閣228', dur: '2h00m' },
                    { time: '14:30', train: '自強318', dur: '2h10m' },
                    { time: '17:00', train: '普悠瑪236', dur: '2h05m' },
                ]
            },
            {
                id: 't2', name: '高鐵+轉乘', type: 'hsr', icon: 'fa-bolt',
                route: '台北 → 花蓮（需轉乘）', price: 1050, duration: '約3.5-4小時',
                frequency: '高鐵每15分鐘一班', departure: '台北高鐵站', arrival: '花蓮車站',
                pros: ['高鐵段舒適快速'], cons: ['需轉乘', '總時間長', '價格較高'],
                tip: '僅在台鐵票搶不到時的替代方案',
                schedule: [{ time: '高鐵至新竹', train: '約30分鐘', dur: '轉客運約3小時' }]
            },
            {
                id: 't3', name: '國內線飛機', type: 'plane', icon: 'fa-plane',
                route: '台北松山 → 花蓮', price: 1500, duration: '35分鐘',
                frequency: '每日4-6班', departure: '台北松山機場', arrival: '花蓮航空站',
                pros: ['最快抵達', '舒適'], cons: ['價格最高', '班次少', '天候影響大'],
                tip: '颱風季節容易取消，建議備案',
                schedule: [
                    { time: '07:30', train: '立榮B7-8701', dur: '35min' },
                    { time: '10:15', train: '華信AE-371', dur: '35min' },
                    { time: '14:00', train: '立榮B7-8705', dur: '35min' },
                    { time: '17:30', train: '華信AE-375', dur: '35min' },
                ]
            },
            {
                id: 't4', name: '客運巴士', type: 'bus', icon: 'fa-bus',
                route: '台北 → 花蓮（蘇花改）', price: 310, duration: '約3.5小時',
                frequency: '每1-2小時一班', departure: '台北轉運站', arrival: '花蓮客運站',
                pros: ['價格最便宜', '沿途風景', '不用搶票'], cons: ['時間最長', '山路可能暈車'],
                tip: '蘇花改通車後時間大幅縮短',
                schedule: [
                    { time: '07:00', train: '統聯1663', dur: '3.5h' },
                    { time: '09:30', train: '葛瑪蘭1917', dur: '3.5h' },
                    { time: '12:00', train: '統聯1663', dur: '3.5h' },
                    { time: '14:30', train: '葛瑪蘭1917', dur: '3.5h' },
                ]
            },
        ]
    },

    // ===== 台北 =====
    taipei: {
        name: '台北',
        center: { lat: 25.0330, lng: 121.5654 },
        attractions: [
            { id: 'tp_a1', name: '台北101', type: '地標', rating: 4.6, reviews: 52000, ticket: 600, priceLevel: '$$', address: '台北市信義區信義路五段7號', lat: 25.0340, lng: 121.5645, hours: '11:00-21:00', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: true, description: '台灣最高地標，觀景台可俯瞰整個台北盆地。', reason: '來台北必訪的地標景點。', userReview: '「夜景超美，值得一看！」', recommended: ['觀景台門票 $600'], tags: ['必訪','地標','夜景'], image: 'https://images.unsplash.com/photo-1508248467877-aec1b08e2082?w=600&h=400&fit=crop' },
            { id: 'tp_a2', name: '故宮博物院', type: '博物館', rating: 4.7, reviews: 38000, ticket: 350, priceLevel: '$$', address: '台北市士林區至善路二段221號', lat: 25.1024, lng: 121.5485, hours: '08:30-18:30', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: true, description: '世界四大博物館之一，收藏近70萬件中華文物珍寶。', reason: '世界級博物館，翠玉白菜、肉形石必看。', userReview: '「館藏太豐富了，半天都看不完。」', recommended: ['門票 $350'], tags: ['必訪','文化','博物館'], image: 'https://images.unsplash.com/photo-1553708881-112abc53fe54?w=600&h=400&fit=crop' },
            { id: 'tp_a3', name: '象山步道', type: '自然步道', rating: 4.5, reviews: 21000, ticket: 0, priceLevel: '$', address: '台北市信義區信義路五段150巷', lat: 25.0275, lng: 121.5728, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: false, description: '可近距離拍攝台北101的最佳步道，夕陽與夜景絕美。', reason: '拍攝101最佳角度，免費又好走。', userReview: '「傍晚來走最美，101就在眼前。」', recommended: [], tags: ['免費','步道','夜景'], image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&h=400&fit=crop' },
            { id: 'tp_a4', name: '九份老街', type: '老街', rating: 4.4, reviews: 45000, ticket: 0, priceLevel: '$', address: '新北市瑞芳區基山街', lat: 25.1090, lng: 121.8443, hours: '10:00-20:00', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: false, description: '神隱少女靈感來源，充滿懷舊風情的山城老街。', reason: '宮崎駿靈感來源，必訪懷舊山城。', userReview: '「夜晚的紅燈籠太夢幻了！」', recommended: ['芋圓 $50','草仔粿 $35'], tags: ['必訪','老街','拍照'], image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop' },
            { id: 'tp_a5', name: '中正紀念堂', type: '歷史古蹟', rating: 4.4, reviews: 32000, ticket: 0, priceLevel: '$', address: '台北市中正區中山南路21號', lat: 25.0350, lng: 121.5219, hours: '09:00-18:00', openDays: [0,1,2,3,4,5,6], duration: '1-2小時', hasTicket: false, description: '台北經典地標，整點衛兵交接儀式必看。', reason: '免費景點，衛兵交接值得一看。', userReview: '「廣場很壯觀，衛兵交接很精彩。」', recommended: [], tags: ['免費','歷史','地標'], image: 'https://images.unsplash.com/photo-1529684657855-5b1c1e8f5b68?w=600&h=400&fit=crop' },
            { id: 'tp_a6', name: '北投溫泉', type: '溫泉', rating: 4.5, reviews: 18000, ticket: 40, priceLevel: '$', address: '台北市北投區中山路', lat: 25.1367, lng: 121.5069, hours: '06:30-22:00', openDays: [0,2,3,4,5,6], closedDays: '週一公休', duration: '2-3小時', hasTicket: true, description: '台北市區就能泡到的天然溫泉，北投公園地熱谷景色壯觀。', reason: '不用跑遠就能泡溫泉，CP值超高。', userReview: '「地熱谷煙霧繚繞超仙！」', recommended: ['公共溫泉 $40'], tags: ['溫泉','放鬆','自然'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop' },
            { id: 'tp_a7', name: '西門町', type: '商圈', rating: 4.3, reviews: 35000, ticket: 0, priceLevel: '$', address: '台北市萬華區西門町', lat: 25.0421, lng: 121.5081, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, description: '台北最熱鬧的年輕人商圈，潮流、美食、文化匯集地。', reason: '台北潮流聖地，逛街美食一次滿足。', userReview: '「好逛好吃好拍！」', recommended: [], tags: ['逛街','美食','潮流'], image: 'https://images.unsplash.com/photo-1525857597365-5f6dbff2e36e?w=600&h=400&fit=crop' },
            { id: 'tp_a8', name: '陽明山國家公園', type: '自然景觀', rating: 4.6, reviews: 25000, ticket: 0, priceLevel: '$', address: '台北市北投區竹子湖路1-20號', lat: 25.1689, lng: 121.5601, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '4-6小時', hasTicket: false, description: '台北後花園，春天賞花秋天賞芒草，擎天崗大草原壯觀。', reason: '台北最美的自然景觀，四季各有風情。', userReview: '「擎天崗的草原好療癒！」', recommended: [], tags: ['自然','步道','賞花'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop' },
            { id: 'tp_a9', name: '淡水老街', type: '老街', rating: 4.3, reviews: 28000, ticket: 0, priceLevel: '$', address: '新北市淡水區中正路', lat: 25.1695, lng: 121.4407, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: false, description: '河岸浪漫老街，看夕陽吃小吃的絕佳去處。', reason: '淡水夕陽是台北最美風景之一。', userReview: '「夕陽配阿給太幸福了。」', recommended: ['阿給 $45','魚丸 $35'], tags: ['老街','夕陽','美食'], image: 'https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?w=600&h=400&fit=crop' },
            { id: 'tp_a10', name: '松山文創園區', type: '文創園區', rating: 4.3, reviews: 15000, ticket: 0, priceLevel: '$', address: '台北市信義區光復南路133號', lat: 25.0442, lng: 121.5602, hours: '08:00-22:00', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: false, description: '日治菸廠改建的文創園區，常有特展和設計市集。', reason: '文青必訪，常有精彩展覽。', userReview: '「園區氛圍很好，適合散步拍照。」', recommended: [], tags: ['文創','展覽','拍照'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'tp_r1', name: '鼎泰豐（信義店）', type: '小籠包', rating: 4.7, reviews: 62000, price: 400, address: '台北市信義區信義路二段194號', lat: 25.0337, lng: 121.5296, hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '世界知名小籠包名店。', reason: '米其林一星，全球觀光客必訪。', userReview: '「小籠包皮薄餡多汁，不愧是世界級。」', recommended: ['小籠包 $250','蝦仁炒飯 $280','酸辣湯 $180'], tags: ['必吃','米其林','排隊名店'], image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop' },
            { id: 'tp_r2', name: '阜杭豆漿', type: '早餐', rating: 4.6, reviews: 28000, price: 80, address: '台北市中正區忠孝東路一段108號2F', lat: 25.0445, lng: 121.5256, hours: '05:30-12:00', openDays: [1,2,3,4,5,6], closedDays: '週一公休', bestTimeSlot: 'breakfast', description: '台北最強早餐，厚燒餅配鹹豆漿絕配。', reason: '米其林必比登推薦，排隊也值得。', userReview: '「厚燒餅夾蛋太銷魂了！」', recommended: ['厚燒餅夾蛋 $65','鹹豆漿 $35','飯糰 $45'], tags: ['必吃','早餐','排隊'], image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop' },
            { id: 'tp_r3', name: '寧夏夜市', type: '夜市', rating: 4.4, reviews: 32000, price: 150, address: '台北市大同區寧夏路', lat: 25.0558, lng: 121.5154, hours: '17:00-01:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'dinner', description: '台北最好吃的夜市，以小吃聞名。', reason: '在地人最愛的美食夜市。', userReview: '「蚵仔煎、滷肉飯、圓環邊蚵仔煎都超讚。」', recommended: ['蚵仔煎 $70','滷肉飯 $40','雞肉飯 $50'], tags: ['夜市','小吃','必吃'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tp_r4', name: '永康牛肉麵', type: '牛肉麵', rating: 4.5, reviews: 18000, price: 220, address: '台北市大安區金山南路二段31巷17號', lat: 25.0315, lng: 121.5298, hours: '11:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '台北牛肉麵代表，紅燒湯頭濃郁入味。', reason: '台北經典牛肉麵，觀光客必吃。', userReview: '「牛肉大塊又軟嫩，湯頭濃郁。」', recommended: ['紅燒牛肉麵 $220','粉蒸排骨 $160'], tags: ['必吃','牛肉麵'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop' },
            { id: 'tp_r5', name: '添好運', type: '港式點心', rating: 4.4, reviews: 15000, price: 200, address: '台北市信義區松壽路12號', lat: 25.0360, lng: 121.5672, hours: '10:00-22:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '全球最便宜米其林一星港式點心。', reason: '平價米其林，酥皮焗叉燒包必點。', userReview: '「叉燒包外酥內軟，超好吃！」', recommended: ['酥皮焗叉燒包 $128','蝦餃 $148','腸粉 $128'], tags: ['米其林','港式','平價'], image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop' },
            { id: 'tp_r6', name: '士林夜市', type: '夜市', rating: 4.3, reviews: 48000, price: 150, address: '台北市士林區基河路101號', lat: 25.0882, lng: 121.5240, hours: '16:00-00:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'dinner', description: '台北最大夜市，觀光客必逛。', reason: '台北最具代表性的夜市。', userReview: '「東西超多，逛不完！」', recommended: ['大餅包小餅 $55','豪大大雞排 $70','藥膳排骨 $80'], tags: ['夜市','觀光','必逛'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tp_r7', name: 'RAW', type: '法式創意料理', rating: 4.8, reviews: 8000, price: 1800, address: '台北市中山區樂群三路301號', lat: 25.0800, lng: 121.5580, hours: '11:30-14:30,18:00-22:00', openDays: [1,2,3,4,5,6], closedDays: '週日公休', bestTimeSlot: 'dinner', description: '江振誠主廚的台北餐廳，融合法式與在地食材。', reason: '亞洲50最佳餐廳，頂級美食體驗。', userReview: '「每道菜都是藝術品，味覺震撼。」', recommended: ['主廚套餐 $3800'], tags: ['高級','米其林','約會'], image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop' },
            { id: 'tp_r8', name: '金峰滷肉飯', type: '台式小吃', rating: 4.5, reviews: 22000, price: 50, address: '台北市中正區羅斯福路一段10號', lat: 25.0325, lng: 121.5180, hours: '08:00-01:00', openDays: [0,2,3,4,5,6], closedDays: '週一公休', bestTimeSlot: 'lunch', description: '台北最強滷肉飯，必比登推薦。', reason: '銅板價就能吃到的米其林美食。', userReview: '「滷肉飯香而不膩，配筍絲完美。」', recommended: ['滷肉飯 $30','排骨湯 $60','筍絲 $30'], tags: ['必吃','銅板','必比登'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'tp_h1', name: '台北W飯店', type: '五星飯店', rating: 4.6, reviews: 8500, lat: 25.0390, lng: 121.5665, checkIn: '15:00', checkOut: '12:00', address: '台北市信義區忠孝東路五段10號', description: '信義區時尚潮流五星飯店，頂樓酒吧夜景絕美。', amenities: ['泳池','健身房','SPA','酒吧','餐廳'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 8500, booking: 9200, trip: 8800, trivago: 8200 } },
            { id: 'tp_h2', name: '台北君悅酒店', type: '五星飯店', rating: 4.7, reviews: 12000, lat: 25.0340, lng: 121.5610, checkIn: '15:00', checkOut: '12:00', address: '台北市信義區松壽路2號', description: '台北101旁的頂級五星酒店，服務一流。', amenities: ['泳池','健身房','SPA','多間餐廳','商務中心'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop', prices: { agoda: 7200, booking: 7800, trip: 7500, trivago: 7000 } },
            { id: 'tp_h3', name: '北門窩泊旅', type: '設計旅店', rating: 4.3, reviews: 5200, lat: 25.0485, lng: 121.5120, checkIn: '15:00', checkOut: '11:00', address: '台北市大同區延平北路一段62號', description: '文青風設計旅店，近北門、西門町。', amenities: ['WiFi','洗衣房','公共廚房','行李寄存'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', prices: { agoda: 1800, booking: 2100, trip: 2000, trivago: 1700 } },
            { id: 'tp_h4', name: '誠品行旅', type: '設計飯店', rating: 4.5, reviews: 6800, lat: 25.0442, lng: 121.5602, checkIn: '15:00', checkOut: '12:00', address: '台北市信義區菸廠路98號', description: '誠品打造的人文飯店，書香氛圍濃厚。', amenities: ['圖書館','餐廳','健身房','WiFi'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', prices: { agoda: 5200, booking: 5600, trip: 5400, trivago: 5000 } },
            { id: 'tp_h5', name: '台北老爺大酒店', type: '四星飯店', rating: 4.4, reviews: 9200, lat: 25.0525, lng: 121.5440, checkIn: '15:00', checkOut: '12:00', address: '台北市中山區中山北路二段37-1號', description: '中山區老牌四星飯店，交通便利服務優良。', amenities: ['健身房','餐廳','商務中心','停車場'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop', prices: { agoda: 3800, booking: 4200, trip: 4000, trivago: 3600 } },
            { id: 'tp_h6', name: '台北背包棧', type: '青年旅舍', rating: 4.1, reviews: 3200, lat: 25.0420, lng: 121.5080, checkIn: '14:00', checkOut: '11:00', address: '台北市萬華區西寧南路36號', description: '西門町旁平價背包客棧，交通超便利。', amenities: ['WiFi','公共廚房','洗衣機','置物櫃'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop', prices: { agoda: 650, booking: 750, trip: 700, trivago: 600 } },
        ],
        transport: [
            { id: 'tp_t1', name: '捷運', type: 'metro', icon: 'fa-subway', route: '台北捷運全線', price: 20, duration: '依距離', frequency: '每3-8分鐘一班', departure: '各站', arrival: '各站', pros: ['班次密集','準時','便宜'], cons: ['尖峰擁擠'], tip: '買悠遊卡最方便', schedule: [] },
            { id: 'tp_t2', name: '公車', type: 'bus', icon: 'fa-bus', route: '台北市公車', price: 15, duration: '依路線', frequency: '每10-20分鐘', departure: '各站', arrival: '各站', pros: ['路線廣','便宜'], cons: ['塞車'], tip: '可用悠遊卡搭乘', schedule: [] },
        ]
    },

    // ===== 台中 =====
    taichung: {
        name: '台中',
        center: { lat: 24.1477, lng: 120.6736 },
        attractions: [
            { id: 'tc_a1', name: '高美濕地', type: '自然景觀', rating: 4.7, reviews: 35000, ticket: 0, priceLevel: '$', address: '台中市清水區美堤街', lat: 24.3126, lng: 120.5498, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, description: '台灣最美夕陽景點，天空之鏡般的倒影絕美。', reason: '世界級夕陽美景，必訪。', userReview: '「夕陽倒映在水面上太震撼了！」', recommended: [], tags: ['必訪','夕陽','自然'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'tc_a2', name: '彩虹眷村', type: '文創景點', rating: 4.3, reviews: 22000, ticket: 0, priceLevel: '$', address: '台中市南屯區春安路56巷25號', lat: 24.1342, lng: 120.6093, hours: '08:00-18:00', openDays: [0,1,2,3,4,5,6], duration: '1小時', hasTicket: false, description: '彩虹爺爺手繪的繽紛眷村，拍照打卡聖地。', reason: '色彩繽紛超好拍。', userReview: '「每面牆都是打卡點！」', recommended: [], tags: ['免費','拍照','文創'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
            { id: 'tc_a3', name: '台中國家歌劇院', type: '建築', rating: 4.6, reviews: 18000, ticket: 0, priceLevel: '$', address: '台中市西屯區惠來路二段101號', lat: 24.1627, lng: 120.6399, hours: '11:30-21:00', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: false, description: '伊東豊雄設計的世界級建築，曲面結構獨特。', reason: '世界級建築，免費參觀。', userReview: '「建築太美了，裡面也很好逛。」', recommended: [], tags: ['建築','免費','文化'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
            { id: 'tc_a4', name: '審計新村', type: '文創市集', rating: 4.3, reviews: 15000, ticket: 0, priceLevel: '$', address: '台中市西區民生路368巷', lat: 24.1430, lng: 120.6640, hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: false, description: '老宿舍群改造的文創聚落，手作小店和美食。', reason: '文青必逛的文創聚落。', userReview: '「小店好有特色，很好拍。」', recommended: [], tags: ['文創','拍照','市集'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
            { id: 'tc_a5', name: '逢甲夜市', type: '夜市', rating: 4.4, reviews: 52000, ticket: 0, priceLevel: '$', address: '台中市西屯區文華路', lat: 24.1785, lng: 120.6461, hours: '17:00-02:00', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, bestTimeSlot: 'evening', description: '全台最大夜市，創意小吃發源地。', reason: '台中必逛夜市，創意美食超多。', userReview: '「每次來都有新東西吃！」', recommended: ['一心臭豆腐 $50','日船章魚丸 $50'], tags: ['必訪','夜市','美食'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tc_a6', name: '宮原眼科', type: '特色建築', rating: 4.5, reviews: 28000, ticket: 0, priceLevel: '$', address: '台中市中區中山路20號', lat: 24.1385, lng: 120.6836, hours: '10:00-22:00', openDays: [0,1,2,3,4,5,6], duration: '1小時', hasTicket: false, description: '日治眼科改造的冰淇淋名店，建築華麗如哈利波特場景。', reason: '拍照+冰淇淋+伴手禮一次滿足。', userReview: '「冰淇淋超好吃，裝潢超華麗！」', recommended: ['冰淇淋 $90'], tags: ['必訪','冰淇淋','拍照'], image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'tc_r1', name: '春水堂（大墩店）', type: '茶飲/簡餐', rating: 4.4, reviews: 15000, price: 250, address: '台中市南屯區大墩路', lat: 24.1450, lng: 120.6500, hours: '09:00-22:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '珍珠奶茶發源地。', reason: '珍珠奶茶發明店！', userReview: '「來台中一定要喝春水堂的珍奶。」', recommended: ['珍珠奶茶 $75','功夫麵 $180'], tags: ['必喝','珍奶','發源地'], image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&h=400&fit=crop' },
            { id: 'tc_r2', name: '第二市場', type: '傳統市場', rating: 4.5, reviews: 12000, price: 80, address: '台中市中區三民路二段87號', lat: 24.1392, lng: 120.6820, hours: '06:00-18:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'breakfast', description: '百年市場，在地早餐聖地。', reason: '老台中人的早餐聖地。', userReview: '「菜頭粿、麻薏、滷肉飯都超好吃。」', recommended: ['菜頭粿 $30','滷肉飯 $35','老賴紅茶 $25'], tags: ['必吃','傳統','早餐'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tc_r3', name: '屋馬燒肉', type: '燒肉', rating: 4.6, reviews: 22000, price: 650, address: '台中市西屯區文心路三段', lat: 24.1650, lng: 120.6450, hours: '11:00-02:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'dinner', description: '台中最夯燒肉店，排隊名店。', reason: '台中人最愛的燒肉，肉質超讚。', userReview: '「和牛燒肉入口即化，值得排隊。」', recommended: ['雙人套餐 $1380','和牛拼盤 $980'], tags: ['必吃','燒肉','排隊'], image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop' },
            { id: 'tc_r4', name: '一中街商圈', type: '小吃街', rating: 4.3, reviews: 18000, price: 100, address: '台中市北區一中街', lat: 24.1500, lng: 120.6830, hours: '11:00-23:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '學生小吃天堂，銅板美食聚集地。', reason: '便宜又好吃的學生美食區。', userReview: '「CP值超高，什麼都好吃。」', recommended: ['豐仁冰 $40','太陽餅 $30'], tags: ['銅板','小吃','學生'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tc_r5', name: '阿裕壽司', type: '日式料理', rating: 4.5, reviews: 8000, price: 350, address: '台中市西區五權西路一段', lat: 24.1380, lng: 120.6600, hours: '11:30-14:00,17:30-21:30', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'dinner', description: '台中高CP平價日料。', reason: '新鮮又便宜的壽司。', userReview: '「海鮮新鮮到不行！」', recommended: ['綜合壽司 $350','鮭魚丼 $280'], tags: ['日料','CP值','新鮮'], image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'tc_h1', name: '台中日月千禧酒店', type: '五星飯店', rating: 4.6, reviews: 7800, lat: 24.1627, lng: 120.6399, checkIn: '15:00', checkOut: '12:00', address: '台中市西屯區市政路77號', description: '台中七期豪華五星酒店，緊鄰國家歌劇院。', amenities: ['泳池','健身房','SPA','餐廳','停車場'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 5200, booking: 5800, trip: 5500, trivago: 5000 } },
            { id: 'tc_h2', name: '台中紅點文旅', type: '設計旅店', rating: 4.4, reviews: 6200, lat: 24.1385, lng: 120.6820, checkIn: '15:00', checkOut: '11:00', address: '台中市中區民族路206號', description: '老旅社改造的設計旅店，大溜滑梯超吸睛。', amenities: ['溜滑梯','WiFi','餐廳','洗衣房'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', prices: { agoda: 2200, booking: 2500, trip: 2400, trivago: 2100 } },
            { id: 'tc_h3', name: '台中林酒店', type: '五星飯店', rating: 4.5, reviews: 5400, lat: 24.1650, lng: 120.6450, checkIn: '15:00', checkOut: '12:00', address: '台中市西屯區朝富路99號', description: '台中頂級五星飯店，自助餐聞名。', amenities: ['泳池','健身房','SPA','三溫暖','餐廳'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop', prices: { agoda: 6800, booking: 7200, trip: 7000, trivago: 6500 } },
            { id: 'tc_h4', name: '逢甲商旅', type: '商務旅館', rating: 4.2, reviews: 4100, lat: 24.1780, lng: 120.6460, checkIn: '15:00', checkOut: '11:00', address: '台中市西屯區福星路', description: '逢甲夜市旁，逛夜市超方便。', amenities: ['WiFi','停車場','洗衣房'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', prices: { agoda: 1600, booking: 1900, trip: 1800, trivago: 1500 } },
            { id: 'tc_h5', name: '台中鵲絲旅店', type: '膠囊旅館', rating: 4.0, reviews: 3800, lat: 24.1750, lng: 120.6470, checkIn: '15:00', checkOut: '11:00', address: '台中市西屯區福星路230號', description: '全台首創無人自助膠囊旅館，機器手臂行李服務。', amenities: ['WiFi','自助入住','置物櫃'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop', prices: { agoda: 800, booking: 950, trip: 900, trivago: 750 } },
        ],
        transport: [
            { id: 'tc_t1', name: '台鐵', type: 'train', icon: 'fa-train', route: '台北→台中', price: 375, duration: '2小時20分', frequency: '每30分鐘', departure: '台北車站', arrival: '台中車站', pros: ['直達市區','班次多'], cons: ['時間較長'], tip: '自強號最快', schedule: [] },
            { id: 'tc_t2', name: '高鐵', type: 'hsr', icon: 'fa-bolt', route: '台北→台中', price: 700, duration: '50分鐘', frequency: '每15-30分鐘', departure: '台北高鐵站', arrival: '台中高鐵站', pros: ['最快','舒適'], cons: ['高鐵站離市區遠'], tip: '早鳥票65折', schedule: [] },
            { id: 'tc_t3', name: '客運', type: 'bus', icon: 'fa-bus', route: '台北→台中', price: 260, duration: '2.5小時', frequency: '每15-30分鐘', departure: '台北轉運站', arrival: '台中轉運站', pros: ['最便宜','班次超多'], cons: ['塞車'], tip: '統聯、國光都有', schedule: [] },
        ]
    },

    // ===== 台南 =====
    tainan: {
        name: '台南',
        center: { lat: 22.9998, lng: 120.2270 },
        attractions: [
            { id: 'tn_a1', name: '赤崁樓', type: '古蹟', rating: 4.4, reviews: 18000, ticket: 70, priceLevel: '$', address: '台南市中西區民族路二段212號', lat: 22.9975, lng: 120.2032, hours: '08:30-21:30', openDays: [0,1,2,3,4,5,6], duration: '1-1.5小時', hasTicket: true, description: '荷蘭時期建造的古蹟，台南必訪歷史景點。', reason: '台南最具代表性的古蹟。', userReview: '「夜晚打燈超美！」', recommended: ['門票 $70'], tags: ['必訪','古蹟','歷史'], image: 'https://images.unsplash.com/photo-1553708881-112abc53fe54?w=600&h=400&fit=crop' },
            { id: 'tn_a2', name: '安平古堡', type: '古蹟', rating: 4.3, reviews: 15000, ticket: 70, priceLevel: '$', address: '台南市安平區國勝路82號', lat: 23.0015, lng: 120.1604, hours: '08:30-17:30', openDays: [0,1,2,3,4,5,6], duration: '1-1.5小時', hasTicket: true, description: '台灣最古老的城堡，見證四百年歷史。', reason: '台灣歷史起點，必訪古蹟。', userReview: '「歷史感很重，值得細細品味。」', recommended: ['門票 $70'], tags: ['必訪','古蹟','歷史'], image: 'https://images.unsplash.com/photo-1553708881-112abc53fe54?w=600&h=400&fit=crop' },
            { id: 'tn_a3', name: '神農街', type: '老街', rating: 4.4, reviews: 12000, ticket: 0, priceLevel: '$', address: '台南市中西區神農街', lat: 22.9970, lng: 120.1970, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1-2小時', hasTicket: false, description: '台南最美老街，復古紅燈籠夜晚超有氣氛。', reason: '文青必訪的復古老街。', userReview: '「夜晚的燈籠好浪漫！」', recommended: [], tags: ['免費','老街','拍照'], image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop' },
            { id: 'tn_a4', name: '奇美博物館', type: '博物館', rating: 4.7, reviews: 25000, ticket: 400, priceLevel: '$$', address: '台南市仁德區文華路二段66號', lat: 22.9350, lng: 120.2263, hours: '09:30-17:30', openDays: [0,2,3,4,5,6], closedDays: '週一公休', duration: '3-4小時', hasTicket: true, description: '歐式宮殿建築的世界級博物館，收藏豐富。', reason: '台南最美博物館，建築本身就是景點。', userReview: '「像是來到歐洲的宮殿！」', recommended: ['門票 $400'], tags: ['必訪','博物館','歐式'], image: 'https://images.unsplash.com/photo-1553708881-112abc53fe54?w=600&h=400&fit=crop' },
            { id: 'tn_a5', name: '花園夜市', type: '夜市', rating: 4.3, reviews: 28000, ticket: 0, priceLevel: '$', address: '台南市北區海安路三段533號', lat: 23.0125, lng: 120.2050, hours: '18:00-01:00', openDays: [4,6,0], closedDays: '僅週四六日', duration: '2-3小時', hasTicket: false, bestTimeSlot: 'evening', description: '台南最大夜市，只在四六日營業。', reason: '台南必逛夜市。', userReview: '「攤位超多，逛到腿軟！」', recommended: ['棺材板 $60','牛排 $100'], tags: ['夜市','美食','必逛'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'tn_r1', name: '阿堂鹹粥', type: '鹹粥', rating: 4.5, reviews: 12000, price: 80, address: '台南市中西區西門路一段728號', lat: 22.9930, lng: 120.1980, hours: '05:30-13:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'breakfast', description: '台南最強早餐鹹粥，虱目魚粥必點。', reason: '台南早餐代表。', userReview: '「虱目魚肚粥鮮到不行！」', recommended: ['虱目魚肚粥 $80','魚皮湯 $60'], tags: ['必吃','早餐','台南味'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop' },
            { id: 'tn_r2', name: '文章牛肉湯', type: '牛肉湯', rating: 4.6, reviews: 15000, price: 120, address: '台南市安平區安平路590號', lat: 23.0010, lng: 120.1630, hours: '04:30-13:00', openDays: [0,2,3,4,5,6], closedDays: '週一公休', bestTimeSlot: 'breakfast', description: '台南牛肉湯名店，清晨現宰超鮮嫩。', reason: '來台南必喝牛肉湯。', userReview: '「牛肉粉嫩鮮甜，配肉燥飯完美。」', recommended: ['牛肉湯 $120','牛肉燥飯 $35'], tags: ['必吃','牛肉湯','凌晨'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop' },
            { id: 'tn_r3', name: '度小月擔仔麵', type: '擔仔麵', rating: 4.3, reviews: 18000, price: 60, address: '台南市中西區中正路16號', lat: 22.9960, lng: 120.2040, hours: '11:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '百年老店，台南擔仔麵代表。', reason: '台南百年老字號。', userReview: '「雖然一碗不大，但味道很經典。」', recommended: ['擔仔麵 $60','滷蛋 $15'], tags: ['必吃','百年','經典'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop' },
            { id: 'tn_r4', name: '周氏蝦捲', type: '小吃', rating: 4.4, reviews: 10000, price: 70, address: '台南市安平區安平路408-1號', lat: 23.0005, lng: 120.1620, hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '安平名產蝦捲，外酥內鮮。', reason: '安平必吃小吃。', userReview: '「蝦捲又大又飽滿！」', recommended: ['蝦捲 $55','蝦仁飯 $60'], tags: ['必吃','安平','小吃'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tn_r5', name: '莉莉水果店', type: '冰品', rating: 4.4, reviews: 8000, price: 70, address: '台南市中西區府前路一段199號', lat: 22.9920, lng: 120.2030, hours: '11:00-23:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '台南人氣水果冰品店。', reason: '台南最強水果冰。', userReview: '「水果超新鮮，份量超大！」', recommended: ['水果盤 $70','芒果冰 $80'], tags: ['必吃','冰品','水果'], image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'tn_h1', name: '台南晶英酒店', type: '五星飯店', rating: 4.7, reviews: 8500, lat: 22.9940, lng: 120.2045, checkIn: '15:00', checkOut: '12:00', address: '台南市中西區和意路1號', description: '新光三越旁頂級五星酒店，無邊際泳池超美。', amenities: ['無邊際泳池','健身房','SPA','餐廳','停車場'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 5800, booking: 6200, trip: 6000, trivago: 5500 } },
            { id: 'tn_h2', name: '友愛街旅館', type: '設計旅店', rating: 4.4, reviews: 4200, lat: 22.9965, lng: 120.2005, checkIn: '15:00', checkOut: '11:00', address: '台南市中西區友愛街115巷5號', description: '文青風設計旅館，位於老城區核心。', amenities: ['WiFi','選書室','公共廚房','自行車租借'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', prices: { agoda: 1800, booking: 2100, trip: 2000, trivago: 1700 } },
            { id: 'tn_h3', name: '捷絲旅台南十鼓館', type: '文創飯店', rating: 4.5, reviews: 3800, lat: 22.9700, lng: 120.2350, checkIn: '15:00', checkOut: '11:00', address: '台南市仁德區文華路二段', description: '晶華集團文創飯店，融合台南在地文化。', amenities: ['WiFi','餐廳','停車場','文化體驗'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', prices: { agoda: 2800, booking: 3100, trip: 3000, trivago: 2700 } },
            { id: 'tn_h4', name: '台南老爺行旅', type: '設計飯店', rating: 4.4, reviews: 5600, lat: 22.9978, lng: 120.2115, checkIn: '15:00', checkOut: '12:00', address: '台南市東區中華東路一段368號', description: '南紡購物中心內的設計飯店。', amenities: ['健身房','餐廳','停車場','WiFi'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop', prices: { agoda: 3200, booking: 3500, trip: 3400, trivago: 3000 } },
            { id: 'tn_h5', name: '佳佳西市場旅店', type: '文青旅店', rating: 4.2, reviews: 2800, lat: 22.9950, lng: 120.1975, checkIn: '15:00', checkOut: '11:00', address: '台南市中西區正興街11號', description: '百年市場改造的文青旅店。', amenities: ['WiFi','公共空間','在地導覽'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop', prices: { agoda: 1500, booking: 1800, trip: 1700, trivago: 1400 } },
        ],
        transport: [
            { id: 'tn_t1', name: '高鐵', type: 'hsr', icon: 'fa-bolt', route: '台北→台南', price: 1350, duration: '1小時45分', frequency: '每30分鐘', departure: '台北高鐵站', arrival: '台南高鐵站', pros: ['最快'], cons: ['高鐵站離市區遠'], tip: '轉乘沙崙線到市區', schedule: [] },
            { id: 'tn_t2', name: '台鐵', type: 'train', icon: 'fa-train', route: '台北→台南', price: 738, duration: '3小時50分', frequency: '每小時', departure: '台北車站', arrival: '台南車站', pros: ['直達市區'], cons: ['時間長'], tip: '自強號最快', schedule: [] },
        ]
    },

    // ===== 高雄 =====
    kaohsiung: {
        name: '高雄',
        center: { lat: 22.6273, lng: 120.3014 },
        attractions: [
            { id: 'kh_a1', name: '駁二藝術特區', type: '文創園區', rating: 4.5, reviews: 28000, ticket: 0, priceLevel: '$', address: '高雄市鹽埕區大勇路1號', lat: 22.6205, lng: 120.2818, hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, description: '高雄最大文創園區，裝置藝術、展覽、美食聚集。', reason: '高雄必訪文青景點。', userReview: '「好逛好拍，很多裝置藝術超酷。」', recommended: [], tags: ['必訪','文創','拍照'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
            { id: 'kh_a2', name: '旗津海岸公園', type: '海灘', rating: 4.3, reviews: 18000, ticket: 0, priceLevel: '$', address: '高雄市旗津區旗津三路990號', lat: 22.6100, lng: 120.2650, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: false, description: '搭渡輪到旗津，海鮮、海灘、廟宇一次滿足。', reason: '搭渡輪就能到的海島體驗。', userReview: '「渡輪很好玩，海鮮又便宜！」', recommended: ['渡輪 $40'], tags: ['海灘','海鮮','渡輪'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'kh_a3', name: '蓮池潭', type: '景點', rating: 4.4, reviews: 22000, ticket: 0, priceLevel: '$', address: '高雄市左營區翠華路1435號', lat: 22.6822, lng: 120.2938, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: false, description: '龍虎塔是高雄地標，湖畔散步超愜意。', reason: '龍虎塔是高雄必拍地標。', userReview: '「龍虎塔很壯觀，入虎口出龍口。」', recommended: [], tags: ['免費','地標','拍照'], image: 'https://images.unsplash.com/photo-1553708881-112abc53fe54?w=600&h=400&fit=crop' },
            { id: 'kh_a4', name: '美麗島站光之穹頂', type: '公共藝術', rating: 4.6, reviews: 32000, ticket: 0, priceLevel: '$', address: '高雄市新興區中山一路115號', lat: 22.6316, lng: 120.3017, hours: '06:00-24:00', openDays: [0,1,2,3,4,5,6], duration: '0.5小時', hasTicket: false, description: '全球最美地鐵站，巨型玻璃藝術穹頂。', reason: '世界第二美的地鐵站。', userReview: '「穹頂太震撼了，必看！」', recommended: [], tags: ['免費','必訪','藝術'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
            { id: 'kh_a5', name: '六合夜市', type: '夜市', rating: 4.2, reviews: 25000, ticket: 0, priceLevel: '$', address: '高雄市新興區六合二路', lat: 22.6312, lng: 120.2997, hours: '18:00-02:00', openDays: [0,1,2,3,4,5,6], duration: '2小時', hasTicket: false, bestTimeSlot: 'evening', description: '高雄最老牌觀光夜市。', reason: '高雄經典夜市。', userReview: '「木瓜牛奶和海鮮粥必吃！」', recommended: ['木瓜牛奶 $60','海鮮粥 $100'], tags: ['夜市','美食','觀光'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'kh_a6', name: '壽山動物園', type: '動物園', rating: 4.4, reviews: 15000, ticket: 40, priceLevel: '$', address: '高雄市鼓山區萬壽路350號', lat: 22.6380, lng: 120.2720, hours: '09:00-17:00', openDays: [0,2,3,4,5,6], closedDays: '週一公休', duration: '2-3小時', hasTicket: true, description: '重新整修的山林動物園，空中廊道可近距離看動物。', reason: '重新開幕後超熱門。', userReview: '「空中步道看動物的視角好特別！」', recommended: ['門票 $40'], tags: ['親子','動物','自然'], image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'kh_r1', name: '鄧師傅功夫菜', type: '功夫菜', rating: 4.5, reviews: 8000, price: 300, address: '高雄市前金區自強三路5號', lat: 22.6280, lng: 120.2950, hours: '11:00-14:00,17:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '高雄知名功夫菜餐廳。', reason: '高雄老字號，功夫菜名店。', userReview: '「滷味拼盤超好吃！」', recommended: ['功夫菜套餐 $380','滷味拼盤 $200'], tags: ['必吃','功夫菜'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'kh_r2', name: '旗津海鮮', type: '海鮮', rating: 4.3, reviews: 12000, price: 250, address: '高雄市旗津區廟前路', lat: 22.6110, lng: 120.2660, hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '旗津新鮮現撈海鮮。', reason: '來旗津必吃海鮮。', userReview: '「海鮮超新鮮又便宜！」', recommended: ['烤魷魚 $100','海鮮粥 $150'], tags: ['海鮮','旗津','新鮮'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'kh_r3', name: '瑞豐夜市', type: '夜市', rating: 4.4, reviews: 22000, price: 120, address: '高雄市左營區裕誠路', lat: 22.6680, lng: 120.3000, hours: '18:00-01:00', openDays: [2,4,5,6,0], closedDays: '週一三公休', bestTimeSlot: 'dinner', description: '在地人最愛的夜市。', reason: '比六合夜市更在地。', userReview: '「在地人都來這裡！」', recommended: ['萬國牛排 $120','麻辣燙 $80'], tags: ['夜市','在地','美食'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'kh_r4', name: '丹丹漢堡', type: '速食', rating: 4.3, reviews: 15000, price: 80, address: '高雄市三民區建工路', lat: 22.6450, lng: 120.3200, hours: '06:00-22:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'breakfast', description: '南部限定速食，炸雞配麵線超特別。', reason: '南部才有的丹丹！', userReview: '「北部人來高雄必吃！」', recommended: ['9號餐 $85','炸雞 $55'], tags: ['必吃','限定','南部'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'kh_h1', name: '高雄萬豪酒店', type: '五星飯店', rating: 4.7, reviews: 6800, lat: 22.6150, lng: 120.2860, checkIn: '15:00', checkOut: '12:00', address: '高雄市鼓山區河西一路262號', description: '亞灣區頂級五星酒店，港灣景觀絕美。', amenities: ['泳池','健身房','SPA','餐廳','酒吧'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 6500, booking: 7000, trip: 6800, trivago: 6200 } },
            { id: 'kh_h2', name: '高雄中央公園英迪格酒店', type: '設計飯店', rating: 4.5, reviews: 5200, lat: 22.6310, lng: 120.3010, checkIn: '15:00', checkOut: '12:00', address: '高雄市新興區中山一路4號', description: '捷運站旁的精品設計飯店。', amenities: ['健身房','餐廳','酒吧','WiFi'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', prices: { agoda: 3200, booking: 3600, trip: 3400, trivago: 3000 } },
            { id: 'kh_h3', name: '鶴宮寓', type: '文創旅店', rating: 4.3, reviews: 3800, lat: 22.6200, lng: 120.2830, checkIn: '15:00', checkOut: '11:00', address: '高雄市鹽埕區七賢三路', description: '駁二旁的文創旅店，老屋新生。', amenities: ['WiFi','公共空間','自行車租借'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', prices: { agoda: 1800, booking: 2100, trip: 2000, trivago: 1700 } },
            { id: 'kh_h4', name: '高雄翰品酒店', type: '四星飯店', rating: 4.3, reviews: 7200, lat: 22.6320, lng: 120.2960, checkIn: '15:00', checkOut: '11:00', address: '高雄市鹽埕區大仁路43號', description: '鹽埕區四星飯店，近愛河駁二。', amenities: ['餐廳','停車場','健身房','WiFi'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop', prices: { agoda: 2500, booking: 2800, trip: 2700, trivago: 2400 } },
        ],
        transport: [
            { id: 'kh_t1', name: '高鐵', type: 'hsr', icon: 'fa-bolt', route: '台北→高雄', price: 1490, duration: '1小時35分', frequency: '每15-30分鐘', departure: '台北高鐵站', arrival: '高雄左營站', pros: ['最快','直達'], cons: ['價格高'], tip: '早鳥票65折', schedule: [] },
            { id: 'kh_t2', name: '台鐵', type: 'train', icon: 'fa-train', route: '台北→高雄', price: 843, duration: '4小時30分', frequency: '每小時', departure: '台北車站', arrival: '高雄車站', pros: ['直達市中心','便宜'], cons: ['時間長'], tip: '搭自強號', schedule: [] },
        ]
    },

    // ===== 宜蘭 =====
    yilan: {
        name: '宜蘭',
        center: { lat: 24.7570, lng: 121.7533 },
        attractions: [
            { id: 'yl_a1', name: '太平山國家森林遊樂區', type: '自然景觀', rating: 4.7, reviews: 18000, ticket: 200, priceLevel: '$$', address: '宜蘭縣大同鄉太平巷58之1號', lat: 24.5070, lng: 121.5260, hours: '06:00-20:00', openDays: [0,1,2,3,4,5,6], duration: '6-8小時', hasTicket: true, description: '見晴懷古步道被評為全球最美小路之一。', reason: '全球最美步道，雲海絕景。', userReview: '「見晴步道美到不像話！」', recommended: ['門票 $200'], tags: ['必訪','森林','步道'], image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop' },
            { id: 'yl_a2', name: '礁溪溫泉', type: '溫泉', rating: 4.5, reviews: 25000, ticket: 0, priceLevel: '$', address: '宜蘭縣礁溪鄉溫泉路', lat: 24.8275, lng: 121.7720, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, description: '台灣平地少有的溫泉鄉，泡湯超方便。', reason: '台北後花園的溫泉鄉。', userReview: '「免費泡腳就很舒服了。」', recommended: ['公共浴池 $80'], tags: ['溫泉','放鬆','免費泡腳'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop' },
            { id: 'yl_a3', name: '幾米廣場', type: '文創景點', rating: 4.2, reviews: 12000, ticket: 0, priceLevel: '$', address: '宜蘭縣宜蘭市光復路1號', lat: 24.7535, lng: 121.7575, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '0.5-1小時', hasTicket: false, description: '幾米繪本主題公園，車站旁超方便。', reason: '拍照打卡必訪。', userReview: '「好可愛，小朋友超愛。」', recommended: [], tags: ['免費','拍照','親子'], image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop' },
            { id: 'yl_a4', name: '龜山島', type: '離島', rating: 4.8, reviews: 8000, ticket: 0, priceLevel: '$', address: '宜蘭縣頭城鎮龜山島', lat: 24.8410, lng: 121.9560, hours: '需預約', openDays: [0,1,2,3,4,5,6], duration: '6-8小時', hasTicket: false, description: '台灣唯一活火山島，賞鯨豚+登島。', reason: '全台最夢幻的離島體驗。', userReview: '「賞鯨超震撼，龜山島美翻！」', recommended: ['登島+賞鯨 $1200'], tags: ['必訪','離島','賞鯨'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'yl_a5', name: '羅東夜市', type: '夜市', rating: 4.4, reviews: 32000, ticket: 0, priceLevel: '$', address: '宜蘭縣羅東鎮民生路', lat: 24.6800, lng: 121.7700, hours: '17:00-00:00', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, bestTimeSlot: 'evening', description: '宜蘭最大最好吃的夜市。', reason: '宜蘭必逛夜市。', userReview: '「蔥油餅、包心粉圓必吃！」', recommended: ['蔥油餅 $35','包心粉圓 $40'], tags: ['夜市','必逛','美食'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'yl_r1', name: '阿宗芋冰城', type: '冰品', rating: 4.4, reviews: 8000, price: 60, address: '宜蘭縣頭城鎮青雲路三段267號', lat: 24.8600, lng: 121.8230, hours: '09:00-19:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '頭城老字號芋頭冰。', reason: '宜蘭經典冰品。', userReview: '「芋頭冰綿密好吃！」', recommended: ['芋頭冰 $40','花生捲冰淇淋 $35'], tags: ['必吃','冰品'], image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop' },
            { id: 'yl_r2', name: '正常鮮肉小籠包', type: '小籠包', rating: 4.5, reviews: 12000, price: 60, address: '宜蘭縣礁溪鄉中正路', lat: 24.8270, lng: 121.7700, hours: '06:30-13:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'breakfast', description: '礁溪排隊名店小籠包。', reason: '便宜又好吃的小籠包。', userReview: '「皮薄餡多汁，CP值超高。」', recommended: ['鮮肉小籠包 $60','酸辣湯 $35'], tags: ['必吃','排隊','早餐'], image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop' },
            { id: 'yl_r3', name: '阿娘給的蒜味肉羹', type: '小吃', rating: 4.3, reviews: 6000, price: 50, address: '宜蘭縣羅東鎮民生路', lat: 24.6810, lng: 121.7710, hours: '15:00-00:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'dinner', description: '羅東夜市必吃蒜味肉羹。', reason: '羅東夜市名攤。', userReview: '「蒜味超香，肉羹軟嫩。」', recommended: ['蒜味肉羹 $50'], tags: ['夜市','小吃'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'yl_h1', name: '礁溪老爺酒店', type: '溫泉飯店', rating: 4.7, reviews: 9500, lat: 24.8320, lng: 121.7750, checkIn: '15:00', checkOut: '11:00', address: '宜蘭縣礁溪鄉五峰路69號', description: '礁溪頂級溫泉飯店，日式湯屋體驗。', amenities: ['溫泉','泳池','SPA','健身房','餐廳'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop', prices: { agoda: 8500, booking: 9200, trip: 8800, trivago: 8200 } },
            { id: 'yl_h2', name: '礁溪寒沐酒店', type: '溫泉飯店', rating: 4.6, reviews: 7200, lat: 24.8280, lng: 121.7730, checkIn: '15:00', checkOut: '11:00', address: '宜蘭縣礁溪鄉健康路1號', description: '寒舍集團溫泉酒店，設施豪華。', amenities: ['溫泉','泳池','兒童遊戲區','餐廳','健身房'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 7200, booking: 7800, trip: 7500, trivago: 7000 } },
            { id: 'yl_h3', name: '捷絲旅礁溪館', type: '溫泉旅店', rating: 4.4, reviews: 5800, lat: 24.8260, lng: 121.7715, checkIn: '15:00', checkOut: '11:00', address: '宜蘭縣礁溪鄉德陽路24巷8號', description: '平價溫泉旅店，房間有獨立湯屋。', amenities: ['溫泉','WiFi','停車場'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', prices: { agoda: 3200, booking: 3600, trip: 3400, trivago: 3000 } },
            { id: 'yl_h4', name: '宜蘭悅川酒店', type: '親子飯店', rating: 4.4, reviews: 4800, lat: 24.7580, lng: 121.7510, checkIn: '15:00', checkOut: '11:00', address: '宜蘭縣宜蘭市中山路五段123號', description: '宜蘭人氣親子飯店，兒童設施豐富。', amenities: ['兒童遊戲區','泳池','餐廳','WiFi'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop', prices: { agoda: 3800, booking: 4200, trip: 4000, trivago: 3600 } },
        ],
        transport: [
            { id: 'yl_t1', name: '客運', type: 'bus', icon: 'fa-bus', route: '台北→宜蘭', price: 143, duration: '1小時', frequency: '每10-20分鐘', departure: '台北轉運站', arrival: '宜蘭轉運站', pros: ['最快','班次超多','便宜'], cons: ['假日塞車'], tip: '葛瑪蘭客運最方便', schedule: [] },
            { id: 'yl_t2', name: '台鐵', type: 'train', icon: 'fa-train', route: '台北→宜蘭', price: 218, duration: '1.5小時', frequency: '每30分鐘', departure: '台北車站', arrival: '宜蘭車站', pros: ['不塞車','準時'], cons: ['假日一票難求'], tip: '普悠瑪最快', schedule: [] },
        ]
    },

    // ===== 台東 =====
    taitung: {
        name: '台東',
        center: { lat: 22.7583, lng: 121.1444 },
        attractions: [
            { id: 'tt_a1', name: '鹿野高台', type: '自然景觀', rating: 4.6, reviews: 15000, ticket: 0, priceLevel: '$', address: '台東縣鹿野鄉永安村高台路42巷', lat: 22.9130, lng: 121.1230, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, description: '台灣熱氣球嘉年華舉辦地，俯瞰花東縱谷。', reason: '熱氣球+縱谷美景。', userReview: '「在高台看日出超震撼！」', recommended: ['熱氣球繫留 $500'], tags: ['必訪','熱氣球','自然'], image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&h=400&fit=crop' },
            { id: 'tt_a2', name: '三仙台', type: '自然景觀', rating: 4.7, reviews: 18000, ticket: 0, priceLevel: '$', address: '台東縣成功鎮三仙里基翬路', lat: 23.1240, lng: 121.3980, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, description: '八拱跨海步橋，台東地標。', reason: '台東必訪地標。', userReview: '「跨海橋超壯觀！」', recommended: [], tags: ['必訪','地標','海景'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'tt_a3', name: '多良車站', type: '車站', rating: 4.5, reviews: 12000, ticket: 0, priceLevel: '$', address: '台東縣太麻里鄉多良村瀧溪8-1號', lat: 22.5420, lng: 120.9520, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1小時', hasTicket: false, description: '全台最美車站，面海的絕景月台。', reason: '全台最美車站。', userReview: '「火車配大海太美了！」', recommended: [], tags: ['免費','拍照','車站'], image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop' },
            { id: 'tt_a4', name: '伯朗大道', type: '田園景觀', rating: 4.5, reviews: 22000, ticket: 0, priceLevel: '$', address: '台東縣池上鄉伯朗大道', lat: 23.1020, lng: 121.2180, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: false, description: '金城武拍廣告的無電桿田園小路。', reason: '台灣最美田園風光。', userReview: '「騎腳踏車穿越稻田好療癒！」', recommended: ['腳踏車租借 $100'], tags: ['必訪','田園','騎車'], image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'tt_r1', name: '池上飯包', type: '便當', rating: 4.4, reviews: 15000, price: 80, address: '台東縣池上鄉忠孝路259號', lat: 23.1010, lng: 121.2200, hours: '07:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '池上米飯包，全台最好吃的便當。', reason: '池上必吃，米飯Q彈。', userReview: '「米飯真的不一樣，粒粒分明！」', recommended: ['招牌飯包 $80'], tags: ['必吃','便當','池上米'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tt_r2', name: '台東觀光夜市', type: '夜市', rating: 4.2, reviews: 8000, price: 100, address: '台東縣台東市正氣路', lat: 22.7550, lng: 121.1500, hours: '17:00-23:00', openDays: [0,4,5,6], closedDays: '僅週四五六日', bestTimeSlot: 'dinner', description: '台東人的夜市。', reason: '台東最大夜市。', userReview: '「烤肉和釋迦冰必吃。」', recommended: ['烤肉串 $50','釋迦冰 $50'], tags: ['夜市','在地'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'tt_r3', name: '藍蜻蜓炸雞', type: '炸雞', rating: 4.5, reviews: 10000, price: 70, address: '台東縣台東市大同路214號', lat: 22.7560, lng: 121.1430, hours: '14:30-22:00', openDays: [0,2,3,4,5,6], closedDays: '週一公休', bestTimeSlot: 'dinner', description: '台東排隊炸雞名店。', reason: '台東必吃炸雞。', userReview: '「外酥內嫩，排隊也值得！」', recommended: ['炸雞腿 $70','炸雞翅 $40'], tags: ['必吃','排隊','炸雞'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'tt_h1', name: '知本老爺酒店', type: '溫泉飯店', rating: 4.5, reviews: 7200, lat: 22.6950, lng: 120.9980, checkIn: '15:00', checkOut: '11:00', address: '台東縣卑南鄉龍泉路113巷23號', description: '知本溫泉區頂級飯店，被森林環繞。', amenities: ['溫泉','泳池','SPA','健身房','餐廳'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop', prices: { agoda: 5200, booking: 5800, trip: 5500, trivago: 5000 } },
            { id: 'tt_h2', name: '台東桂田喜來登', type: '五星飯店', rating: 4.4, reviews: 5800, lat: 22.7520, lng: 121.1380, checkIn: '15:00', checkOut: '12:00', address: '台東縣台東市正氣路316號', description: '台東市區五星飯店。', amenities: ['泳池','健身房','餐廳','停車場'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 3800, booking: 4200, trip: 4000, trivago: 3600 } },
            { id: 'tt_h3', name: '鹿野森活民宿', type: '民宿', rating: 4.6, reviews: 2200, lat: 22.9150, lng: 121.1250, checkIn: '15:00', checkOut: '11:00', address: '台東縣鹿野鄉高台路', description: '鹿野高台旁的森林民宿，環境清幽。', amenities: ['花園','早餐','停車場','WiFi'], image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop', prices: { agoda: 2500, booking: 2800, trip: 2700, trivago: 2400 } },
        ],
        transport: [
            { id: 'tt_t1', name: '台鐵', type: 'train', icon: 'fa-train', route: '台北→台東', price: 783, duration: '4-5小時', frequency: '每1-2小時', departure: '台北車站', arrival: '台東車站', pros: ['沿途風景美'], cons: ['時間長'], tip: '搭普悠瑪最快', schedule: [] },
            { id: 'tt_t2', name: '飛機', type: 'plane', icon: 'fa-plane', route: '台北松山→台東', price: 2100, duration: '50分鐘', frequency: '每日3-4班', departure: '松山機場', arrival: '台東航空站', pros: ['最快'], cons: ['班次少','價格高'], tip: '颱風季注意天候', schedule: [] },
        ]
    },

    // ===== 南投 =====
    nantou: {
        name: '南投',
        center: { lat: 23.8388, lng: 120.6856 },
        attractions: [
            { id: 'nt_a1', name: '日月潭', type: '自然景觀', rating: 4.7, reviews: 42000, ticket: 0, priceLevel: '$', address: '南投縣魚池鄉日月潭', lat: 23.8568, lng: 120.9135, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '4-6小時', hasTicket: false, description: '台灣最美的高山湖泊，環湖自行車道世界級。', reason: '台灣必訪景點TOP3。', userReview: '「日出時湖面如鏡，美到哭！」', recommended: ['遊湖船票 $300','自行車租借 $100'], tags: ['必訪','湖泊','騎車'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'nt_a2', name: '清境農場', type: '農場', rating: 4.5, reviews: 28000, ticket: 200, priceLevel: '$$', address: '南投縣仁愛鄉大同村仁和路170號', lat: 24.0596, lng: 121.1600, hours: '08:00-17:00', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: true, description: '台版小瑞士，綿羊秀和高空步道。', reason: '綿羊+山景+高空步道。', userReview: '「好像來到瑞士！」', recommended: ['門票 $200'], tags: ['必訪','農場','山景'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop' },
            { id: 'nt_a3', name: '溪頭自然教育園區', type: '森林', rating: 4.5, reviews: 18000, ticket: 200, priceLevel: '$$', address: '南投縣鹿谷鄉森林巷9號', lat: 23.6730, lng: 120.7950, hours: '07:00-17:00', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: true, description: '千年神木與竹海的森林浴聖地。', reason: '台灣最棒的森林浴。', userReview: '「空氣超好，身心都淨化了。」', recommended: ['門票 $200'], tags: ['森林','芬多精','步道'], image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'nt_r1', name: '日月潭伊達邵商圈', type: '小吃街', rating: 4.3, reviews: 12000, price: 100, address: '南投縣魚池鄉伊達邵', lat: 23.8530, lng: 120.9350, hours: '10:00-21:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '日月潭旁的原住民美食街。', reason: '日月潭必逛美食區。', userReview: '「烤山豬肉和小米麻糬超好吃。」', recommended: ['烤山豬肉 $100','小米麻糬 $50','紅茶 $40'], tags: ['原住民','小吃','日月潭'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
            { id: 'nt_r2', name: '清境魯媽媽雲南擺夷料理', type: '雲南料理', rating: 4.4, reviews: 6000, price: 250, address: '南投縣仁愛鄉大同村壽亭巷30號', lat: 24.0580, lng: 121.1580, hours: '11:00-14:00,17:00-20:30', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '清境知名雲南料理。', reason: '清境用餐首選。', userReview: '「雲南大薄片和椒麻雞超正宗。」', recommended: ['雲南大薄片 $180','椒麻雞 $250'], tags: ['雲南','清境','合菜'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'nt_h1', name: '日月潭涵碧樓', type: '頂級度假村', rating: 4.8, reviews: 5200, lat: 23.8570, lng: 120.9100, checkIn: '15:00', checkOut: '12:00', address: '南投縣魚池鄉水社村中興路142號', description: '日月潭畔頂級飯店，被譽為台灣最美飯店。', amenities: ['泳池','SPA','健身房','湖景餐廳','瑜珈'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 15000, booking: 16000, trip: 15500, trivago: 14500 } },
            { id: 'nt_h2', name: '日月潭雲品溫泉酒店', type: '溫泉飯店', rating: 4.6, reviews: 8200, lat: 23.8620, lng: 120.9200, checkIn: '15:00', checkOut: '11:00', address: '南投縣魚池鄉中正路23號', description: '日月潭畔溫泉飯店，親子設施豐富。', amenities: ['溫泉','泳池','兒童遊戲區','餐廳','停車場'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop', prices: { agoda: 6800, booking: 7200, trip: 7000, trivago: 6500 } },
            { id: 'nt_h3', name: '清境老英格蘭莊園', type: '歐風民宿', rating: 4.7, reviews: 3800, lat: 24.0610, lng: 121.1620, checkIn: '15:00', checkOut: '11:00', address: '南投縣仁愛鄉壽亭巷20-3號', description: '清境最美歐風莊園，像置身英國鄉村。', amenities: ['花園','下午茶','觀景台','停車場'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop', prices: { agoda: 8500, booking: 9000, trip: 8800, trivago: 8200 } },
            { id: 'nt_h4', name: '溪頭米堤大飯店', type: '度假飯店', rating: 4.4, reviews: 4500, lat: 23.6750, lng: 120.7930, checkIn: '15:00', checkOut: '11:00', address: '南投縣鹿谷鄉米堤街1號', description: '溪頭森林內的度假飯店。', amenities: ['泳池','SPA','健身房','餐廳','停車場'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', prices: { agoda: 4200, booking: 4600, trip: 4400, trivago: 4000 } },
        ],
        transport: [
            { id: 'nt_t1', name: '客運', type: 'bus', icon: 'fa-bus', route: '台中→日月潭', price: 193, duration: '1.5小時', frequency: '每小時', departure: '台中干城站', arrival: '日月潭', pros: ['直達日月潭'], cons: ['班次少'], tip: '南投客運6670', schedule: [] },
            { id: 'nt_t2', name: '自駕', type: 'car', icon: 'fa-car', route: '台中→南投', price: 0, duration: '1-2小時', frequency: '自由', departure: '台中', arrival: '南投各景點', pros: ['最方便','時間自由'], cons: ['需租車','山路'], tip: '清境山路要小心', schedule: [] },
        ]
    },

    // ===== 屏東(墾丁) =====
    pingtung: {
        name: '屏東(墾丁)',
        center: { lat: 21.9484, lng: 120.7760 },
        attractions: [
            { id: 'pt_a1', name: '墾丁大街', type: '商圈', rating: 4.2, reviews: 35000, ticket: 0, priceLevel: '$', address: '屏東縣恆春鎮墾丁路', lat: 21.9450, lng: 120.7970, hours: '17:00-00:00', openDays: [0,1,2,3,4,5,6], duration: '2-3小時', hasTicket: false, bestTimeSlot: 'evening', description: '南台灣最熱鬧的海灘大街。', reason: '墾丁夜生活中心。', userReview: '「好吃好玩又有海風！」', recommended: [], tags: ['夜生活','美食','海灘'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'pt_a2', name: '鵝鑾鼻燈塔', type: '地標', rating: 4.5, reviews: 22000, ticket: 60, priceLevel: '$', address: '屏東縣恆春鎮鵝鑾里鵝鑾路301號', lat: 21.9019, lng: 120.8555, hours: '09:00-17:00', openDays: [0,1,2,3,4,5,6], duration: '1.5-2小時', hasTicket: true, description: '台灣最南端燈塔，東亞之光。', reason: '台灣最南端必訪。', userReview: '「燈塔配藍天大海美翻！」', recommended: ['門票 $60'], tags: ['必訪','地標','海景'], image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop' },
            { id: 'pt_a3', name: '南灣', type: '海灘', rating: 4.4, reviews: 18000, ticket: 0, priceLevel: '$', address: '屏東縣恆春鎮南灣路', lat: 21.9580, lng: 120.7680, hours: '全天開放', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: false, description: '墾丁最美海灘，水上活動天堂。', reason: '墾丁最受歡迎的海灘。', userReview: '「海水超藍，玩水超開心！」', recommended: ['香蕉船 $300','浮潛 $500'], tags: ['海灘','水上活動','玩水'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
            { id: 'pt_a4', name: '海生館', type: '水族館', rating: 4.6, reviews: 25000, ticket: 450, priceLevel: '$$', address: '屏東縣車城鄉後灣路2號', lat: 22.0455, lng: 120.6965, hours: '09:00-17:30', openDays: [0,1,2,3,4,5,6], duration: '3-4小時', hasTicket: true, description: '全台最大水族館，夜宿海生館超熱門。', reason: '親子必訪，夜宿體驗超特別。', userReview: '「海底隧道太震撼了！」', recommended: ['門票 $450','夜宿 $2380'], tags: ['必訪','親子','水族館'], image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&h=400&fit=crop' },
        ],
        restaurants: [
            { id: 'pt_r1', name: '迷路小章魚', type: '海景餐廳', rating: 4.5, reviews: 6000, price: 400, address: '屏東縣恆春鎮草潭路16-3號', lat: 21.9500, lng: 120.7850, hours: '11:30-14:30,17:30-21:00', openDays: [0,2,3,4,5,6], closedDays: '週一公休', bestTimeSlot: 'dinner', description: '墾丁最美海景餐廳。', reason: '看夕陽配美食的絕佳選擇。', userReview: '「夕陽太美了，食物也好吃。」', recommended: ['海鮮義大利麵 $380','披薩 $320'], tags: ['海景','約會','夕陽'], image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop' },
            { id: 'pt_r2', name: '後壁湖海鮮', type: '海鮮', rating: 4.3, reviews: 12000, price: 200, address: '屏東縣恆春鎮大光路', lat: 21.9430, lng: 120.7450, hours: '10:00-20:00', openDays: [0,1,2,3,4,5,6], bestTimeSlot: 'lunch', description: '後壁湖漁港新鮮海鮮。', reason: '墾丁最便宜的新鮮海鮮。', userReview: '「生魚片200元一大盤超划算。」', recommended: ['生魚片 $200','炒海瓜子 $150'], tags: ['海鮮','便宜','新鮮'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop' },
        ],
        hotels: [
            { id: 'pt_h1', name: '墾丁凱撒大飯店', type: '五星飯店', rating: 4.5, reviews: 8500, lat: 21.9470, lng: 120.7950, checkIn: '15:00', checkOut: '11:00', address: '屏東縣恆春鎮墾丁路6號', description: '墾丁大街旁五星飯店，私人沙灘。', amenities: ['私人沙灘','泳池','SPA','餐廳','兒童遊戲區'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', prices: { agoda: 5800, booking: 6200, trip: 6000, trivago: 5500 } },
            { id: 'pt_h2', name: '墾丁夏都沙灘酒店', type: '度假飯店', rating: 4.4, reviews: 9200, lat: 21.9460, lng: 120.7880, checkIn: '15:00', checkOut: '11:00', address: '屏東縣恆春鎮墾丁路451號', description: '直接在海灘上的度假酒店。', amenities: ['私人沙灘','泳池','健身房','餐廳','水上活動'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop', prices: { agoda: 4500, booking: 4900, trip: 4700, trivago: 4300 } },
            { id: 'pt_h3', name: '恆春老屋民宿', type: '民宿', rating: 4.3, reviews: 2800, lat: 22.0025, lng: 120.7460, checkIn: '15:00', checkOut: '11:00', address: '屏東縣恆春鎮中山路', description: '恆春古城內的老屋民宿。', amenities: ['WiFi','自行車租借','早餐','停車場'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', prices: { agoda: 1800, booking: 2100, trip: 2000, trivago: 1700 } },
        ],
        transport: [
            { id: 'pt_t1', name: '高鐵+墾丁快線', type: 'hsr', icon: 'fa-bolt', route: '台北→墾丁', price: 1850, duration: '約4小時', frequency: '高鐵每30分', departure: '台北高鐵站', arrival: '墾丁', pros: ['最方便'], cons: ['需轉乘','價格高'], tip: '高鐵到左營轉墾丁快線', schedule: [] },
            { id: 'pt_t2', name: '自駕', type: 'car', icon: 'fa-car', route: '高雄→墾丁', price: 0, duration: '2小時', frequency: '自由', departure: '高雄', arrival: '墾丁', pros: ['最方便','沿途玩'], cons: ['需租車'], tip: '走台88快速道路最快', schedule: [] },
        ]
    }
};

// Helper: 取得某目的地的資料，若不存在回傳 hualien 作為預設
function getDestData(cityId) {
    return DESTINATIONS_DB[cityId] || DESTINATIONS_DB.hualien;
}

// Helper: 計算兩點間距離（公里）
function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Helper: 檢查某日是否營業
function isOpenOnDate(item, date) {
    if (!item.openDays) return true;
    const dow = date.getDay(); // 0=Sunday
    return item.openDays.includes(dow);
}

// Helper: 取得星期幾的中文
function getDayName(date) {
    return ['日','一','二','三','四','五','六'][date.getDay()];
}

// ===== Departure Routes =====
const DEPARTURE_ROUTES = {
  taipei: { name: '台北', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '台北 → 花蓮', price: 440, duration: '2小時10分', departure: '台北車站', arrival: '花蓮車站' },
      { type: 'hsr', name: '高鐵+轉乘', route: '台北 → 花蓮', price: 1050, duration: '約3.5小時', departure: '台北高鐵站', arrival: '花蓮車站' },
      { type: 'plane', name: '國內線飛機', route: '松山 → 花蓮', price: 1500, duration: '35分鐘', departure: '松山機場', arrival: '花蓮航空站' },
      { type: 'bus', name: '客運巴士', route: '台北 → 花蓮', price: 310, duration: '約3.5小時', departure: '台北轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '台北 → 花蓮', price: 800, duration: '約3小時', departure: '台北', arrival: '花蓮' },
    ]
  }},
  taichung: { name: '台中', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '台中 → 花蓮', price: 598, duration: '4小時30分', departure: '台中車站', arrival: '花蓮車站' },
      { type: 'bus', name: '客運巴士', route: '台中 → 花蓮', price: 450, duration: '約5小時', departure: '台中轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '台中 → 花蓮', price: 1200, duration: '約4.5小時', departure: '台中', arrival: '花蓮' },
    ]
  }},
  kaohsiung: { name: '高雄', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '高雄 → 花蓮', price: 780, duration: '5小時40分', departure: '高雄車站', arrival: '花蓮車站' },
      { type: 'plane', name: '國內線飛機', route: '高雄 → 花蓮', price: 1800, duration: '50分鐘', departure: '高雄小港機場', arrival: '花蓮航空站' },
      { type: 'bus', name: '客運巴士', route: '高雄 → 花蓮', price: 600, duration: '約7小時', departure: '高雄轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '高雄 → 花蓮', price: 1500, duration: '約5.5小時', departure: '高雄', arrival: '花蓮' },
    ]
  }},
  tainan: { name: '台南', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '台南 → 花蓮', price: 680, duration: '5小時', departure: '台南車站', arrival: '花蓮車站' },
      { type: 'bus', name: '客運巴士', route: '台南 → 花蓮', price: 550, duration: '約6.5小時', departure: '台南轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '台南 → 花蓮', price: 1300, duration: '約5小時', departure: '台南', arrival: '花蓮' },
    ]
  }},
  taoyuan: { name: '桃園', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '桃園 → 花蓮', price: 380, duration: '2小時40分', departure: '桃園車站', arrival: '花蓮車站' },
      { type: 'bus', name: '客運巴士', route: '桃園 → 花蓮', price: 280, duration: '約4小時', departure: '桃園轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '桃園 → 花蓮', price: 700, duration: '約3小時', departure: '桃園', arrival: '花蓮' },
    ]
  }},
  hsinchu: { name: '新竹', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '新竹 → 花蓮', price: 420, duration: '3小時20分', departure: '新竹車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '新竹 → 花蓮', price: 900, duration: '約3.5小時', departure: '新竹', arrival: '花蓮' },
    ]
  }},
  keelung: { name: '基隆', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '基隆 → 花蓮', price: 380, duration: '約2小時', departure: '基隆車站', arrival: '花蓮車站' },
      { type: 'bus', name: '客運巴士', route: '基隆 → 花蓮', price: 270, duration: '約3小時', departure: '基隆轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '基隆 → 花蓮', price: 700, duration: '約2.5小時', departure: '基隆', arrival: '花蓮' },
    ]
  }},
  miaoli: { name: '苗栗', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '苗栗 → 花蓮', price: 480, duration: '約3小時30分', departure: '苗栗車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '苗栗 → 花蓮', price: 1000, duration: '約4小時', departure: '苗栗', arrival: '花蓮' },
    ]
  }},
  changhua: { name: '彰化', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '彰化 → 花蓮', price: 560, duration: '約4小時30分', departure: '彰化車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '彰化 → 花蓮', price: 1100, duration: '約4.5小時', departure: '彰化', arrival: '花蓮' },
    ]
  }},
  nantou: { name: '南投', transports: {
    hualien: [
      { type: 'bus', name: '客運巴士', route: '南投 → 花蓮', price: 500, duration: '約5小時', departure: '南投轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '南投 → 花蓮', price: 1000, duration: '約4小時', departure: '南投', arrival: '花蓮' },
    ]
  }},
  yunlin: { name: '雲林', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '雲林 → 花蓮', price: 600, duration: '約5小時', departure: '斗六車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '雲林 → 花蓮', price: 1200, duration: '約5小時', departure: '雲林', arrival: '花蓮' },
    ]
  }},
  chiayi: { name: '嘉義', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '嘉義 → 花蓮', price: 640, duration: '約5小時30分', departure: '嘉義車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '嘉義 → 花蓮', price: 1300, duration: '約5小時', departure: '嘉義', arrival: '花蓮' },
    ]
  }},
  pingtung: { name: '屏東', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '屏東 → 花蓮', price: 820, duration: '約6小時', departure: '屏東車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '屏東 → 花蓮', price: 1600, duration: '約6小時', departure: '屏東', arrival: '花蓮' },
    ]
  }},
  yilan: { name: '宜蘭', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '宜蘭 → 花蓮', price: 200, duration: '約1小時30分', departure: '宜蘭車站', arrival: '花蓮車站' },
      { type: 'bus', name: '客運巴士', route: '宜蘭 → 花蓮', price: 180, duration: '約2小時', departure: '宜蘭轉運站', arrival: '花蓮客運站' },
      { type: 'car', name: '自駕', route: '宜蘭 → 花蓮', price: 400, duration: '約1.5小時', departure: '宜蘭', arrival: '花蓮' },
    ]
  }},
  taitung: { name: '台東', transports: {
    hualien: [
      { type: 'train', name: '台鐵自強號', route: '台東 → 花蓮', price: 340, duration: '約2小時30分', departure: '台東車站', arrival: '花蓮車站' },
      { type: 'car', name: '自駕', route: '台東 → 花蓮', price: 600, duration: '約3小時', departure: '台東', arrival: '花蓮' },
    ]
  }},
  penghu: { name: '澎湖', transports: {
    hualien: [
      { type: 'plane', name: '飛機轉乘', route: '澎湖 → 台北 → 花蓮', price: 3000, duration: '約4小時（含轉乘）', departure: '澎湖馬公機場', arrival: '花蓮車站' },
    ]
  }},
  kinmen: { name: '金門', transports: {
    hualien: [
      { type: 'plane', name: '飛機轉乘', route: '金門 → 台北 → 花蓮', price: 4000, duration: '約4.5小時（含轉乘）', departure: '金門尚義機場', arrival: '花蓮車站' },
    ]
  }},
  matsu: { name: '馬祖', transports: {
    hualien: [
      { type: 'plane', name: '飛機轉乘', route: '馬祖 → 台北 → 花蓮', price: 4500, duration: '約5小時（含轉乘）', departure: '馬祖南竿機場', arrival: '花蓮車站' },
    ]
  }},
  hualien: { name: '花蓮', transports: {
    hualien: [
      { type: 'car', name: '當地出發', route: '花蓮市區', price: 0, duration: '0分鐘', departure: '花蓮', arrival: '花蓮' },
    ]
  }},
};
Object.freeze(DEPARTURE_ROUTES);

// ===== Freeze Critical Data =====
function deepFreeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(prop => {
        const val = obj[prop];
        if (val !== null && typeof val === 'object' && !Object.isFrozen(val)) {
            deepFreeze(val);
        }
    });
    return obj;
}

Object.freeze(TAIWAN_CITIES);
TAIWAN_CITIES.forEach(c => Object.freeze(c));
Object.freeze(TRANSPORT_OPTIONS);
TRANSPORT_OPTIONS.forEach(t => Object.freeze(t));
// Shallow freeze DESTINATIONS_DB keys (inner data remains mutable for inline price editing)
Object.freeze(DESTINATIONS_DB);
