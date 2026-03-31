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
                lat: 24.1834, lng: 121.4939,
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
                lat: 23.9815, lng: 121.6085,
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
                lat: 23.9736, lng: 121.6019,
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
                lat: 23.9120, lng: 121.5605,
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
                lat: 23.9771, lng: 121.5991,
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
                lat: 23.9210, lng: 121.5180,
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
                lat: 23.9760, lng: 121.6040,
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
                lat: 24.0350, lng: 121.6280,
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
                lat: 23.8920, lng: 121.5300,
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
                id: 'h10', name: '花蓮小旅行迷你旅店', type: '平價旅店', rating: 3.9, reviews: 1800,
                lat: 23.9780, lng: 121.6020,
                address: '花蓮縣花蓮市中山路301號',
                description: '乾淨平價的市區小旅店，步行可達東大門夜市，適合想省住宿費的旅客。',
                amenities: ['WiFi', '冷氣', '共用冰箱', '市區位置'],
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
                prices: { agoda: 1200, booking: 1400, trip: 1300, trivago: 1100 },
                roomTypes: [
                    { name: '標準雙人房', prices: { agoda: 1200, booking: 1400, trip: 1300, trivago: 1100 } },
                    { name: '經濟四人房', prices: { agoda: 1800, booking: 2000, trip: 1900, trivago: 1700 } },
                ],
            },
            {
                id: 'h11', name: '遠雄悅來大飯店', type: '五星飯店', rating: 4.4, reviews: 7800,
                lat: 23.9020, lng: 121.5550,
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
                lat: 23.9755, lng: 121.6055,
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
                lat: 23.9818, lng: 121.6080,
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
                lat: 23.9740, lng: 121.6035,
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
                lat: 23.9765, lng: 121.5995,
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
                lat: 23.9752, lng: 121.6048,
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
                lat: 23.9690, lng: 121.6100,
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
                lat: 23.9560, lng: 121.5970,
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
                lat: 23.9700, lng: 121.6060,
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
                lat: 23.9730, lng: 121.6010,
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
                lat: 23.9850, lng: 121.6130,
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
                lat: 23.4975, lng: 121.3540,
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
