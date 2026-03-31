# TravelGo iOS App 建置指南

## 前置需求

### 硬體需求
- **Mac 電腦**（macOS 13 Ventura 以上）- iOS App 只能在 macOS 上編譯
- 建議至少 8GB RAM 和 30GB 可用磁碟空間

### 軟體需求
1. **Xcode 15 以上**
   - 從 Mac App Store 下載安裝：https://apps.apple.com/app/xcode/id497799835
   - 安裝完成後開啟 Xcode，同意授權條款
   - 至 `Xcode > Settings > Platforms` 確認已安裝 iOS 模擬器

2. **Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

3. **CocoaPods**（如果使用原生插件需要）
   ```bash
   sudo gem install cocoapods
   ```

4. **Node.js 18+** 和 **npm**
   - 從 https://nodejs.org 下載安裝

5. **Apple Developer 帳號**
   - 免費帳號可在模擬器上測試
   - 付費帳號（年費 USD $99）才能上架 App Store 和 TestFlight
   - 註冊網址：https://developer.apple.com/programs/

---

## 步驟一：準備專案

1. 開啟終端機，進入專案目錄：
   ```bash
   cd /path/to/旅遊app
   ```

2. 安裝依賴套件：
   ```bash
   npm install
   ```

3. 同步 Web 資源到 iOS 專案：
   ```bash
   npm run cap:sync
   ```
   此指令會將 `www/` 目錄的網頁檔案複製到 iOS 原生專案中。

---

## 步驟二：在 Xcode 中開啟 iOS 專案

### 方法一：使用指令
```bash
npm run cap:open:ios
```

### 方法二：手動開啟
用 Xcode 開啟以下檔案：
```
ios/App/App.xcworkspace
```

> **注意**：請務必開啟 `.xcworkspace` 檔案，而非 `.xcodeproj`。

---

## 步驟三：設定簽署 (Code Signing)

1. 在 Xcode 左側面板中選擇 **App** 專案（最頂層藍色圖示）
2. 選擇 **TARGETS > App**
3. 切換到 **Signing & Capabilities** 頁籤
4. 勾選 **Automatically manage signing**（自動管理簽署）
5. 在 **Team** 下拉選單中選擇你的 Apple Developer 帳號
   - 如果尚未登入，點擊 `Add an Account...` 登入你的 Apple ID
6. 確認 **Bundle Identifier** 為 `com.travelgo.app`
7. 如果出現紅色錯誤，可能需要修改 Bundle Identifier 為你的唯一識別碼

### 設定 App 圖示
1. 在 Xcode 左側點選 `App > Assets.xcassets > AppIcon`
2. 將你的 App 圖示（1024x1024 PNG）拖入對應的位置
3. 建議使用 https://appicon.co 線上工具自動產生各尺寸圖示

---

## 步驟四：在模擬器上建置與執行

1. 在 Xcode 上方工具列選擇目標裝置：
   - 點擊裝置選擇器（靠近播放按鈕旁）
   - 選擇一個 iOS 模擬器，例如 **iPhone 15 Pro**
2. 點擊 **播放按鈕**（或按 `Cmd + R`）開始建置
3. 等待編譯完成，模擬器會自動啟動並開啟 App

### 常見問題排解
- **建置失敗**：嘗試 `Product > Clean Build Folder`（`Cmd + Shift + K`）
- **模擬器沒出現**：到 `Xcode > Settings > Platforms` 下載 iOS 模擬器
- **Web 內容沒更新**：回到終端機執行 `npm run cap:sync`，再重新建置

### 在實機上測試
1. 使用 USB 線連接 iPhone 到 Mac
2. iPhone 上信任此電腦
3. 在 Xcode 裝置選擇器中選擇你的 iPhone
4. 首次在實機上執行需要在 iPhone 上信任開發者：
   - 設定 > 一般 > VPN與裝置管理 > 信任開發者憑證

---

## 步驟五：部署到 TestFlight（Beta 測試）

### 1. 準備 App Store Connect
1. 登入 https://appstoreconnect.apple.com
2. 點選 **我的 App** > **+** > **新增 App**
3. 填寫以下資訊：
   - 平台：iOS
   - App 名稱：TravelGo
   - 主要語言：繁體中文
   - 套裝組 ID：com.travelgo.app
   - SKU：travelgo-001

### 2. 建置 Archive（封存）
1. 在 Xcode 裝置選擇器中選擇 **Any iOS Device (arm64)**
2. 點選 `Product > Archive`
3. 等待 Archive 完成（可能需要數分鐘）

### 3. 上傳到 App Store Connect
1. Archive 完成後會自動開啟 **Organizer** 視窗
2. 選擇剛建立的 Archive
3. 點選 **Distribute App**
4. 選擇 **App Store Connect**
5. 選擇 **Upload**
6. 依照提示完成上傳

### 4. 設定 TestFlight
1. 回到 App Store Connect 網站
2. 進入你的 App > **TestFlight** 頁籤
3. 等待 Apple 審查處理（通常 10-30 分鐘）
4. 新增內部測試人員：
   - 點選 **內部群組** > **+** > 新增測試人員（最多 100 人）
5. 新增外部測試人員：
   - 點選 **外部測試** > **+** > 新增群組
   - 需要通過 Beta App 審查（通常 24-48 小時）
6. 測試人員會收到 Email 邀請，下載 TestFlight App 即可安裝測試版

---

## 步驟六：提交 App Store 審查

### 1. 準備 App Store 資訊
在 App Store Connect 的 **App Store** 頁籤中填寫：

- **App 預覽和螢幕截圖**（必填）
  - 需提供 6.7 吋（iPhone 15 Pro Max）的螢幕截圖
  - 建議也提供 6.1 吋、5.5 吋尺寸
  - 每組最多 10 張截圖
  - 尺寸規格：
    - 6.7 吋：1290 x 2796 px
    - 6.1 吋：1179 x 2556 px

- **描述**（必填）
  - 建議包含 App 主要功能、特色、使用情境
  - 範例：
    > TravelGo 是您的智慧旅遊規劃助手！自動產生台灣各地最佳行程，包含景點、美食、住宿比價和交通資訊，讓旅行規劃輕鬆又有趣。

- **關鍵字**：旅遊, 台灣, 行程, 規劃, 旅行, 景點, 美食, 住宿
- **支援 URL**：你的網站或 GitHub 頁面
- **隱私權政策 URL**（必填）：需提供有效的隱私權政策網頁

### 2. 設定價格
- 在 **價格與供應狀況** 中設定（免費或付費）

### 3. 設定 App 分級
- 填寫內容分級問卷，TravelGo 應為 4+（無限制級內容）

### 4. 提交審查
1. 確認所有必填欄位都已完成
2. 在 **版本資訊** 中選擇已上傳的 build
3. 點選 **提交審查**
4. 審查時間通常為 24-48 小時（首次可能較久）

---

## 重要 App Store 審查注意事項

### 必須遵守的規範

1. **隱私權政策**（App Store Review Guideline 5.1）
   - 必須提供清楚的隱私權政策
   - 說明收集哪些資料（例如 localStorage 的行程資料）
   - 說明是否與第三方分享資料

2. **App 完整性**（Guideline 2.1）
   - App 不可有明顯 bug 或閃退
   - 所有功能必須可以正常運作
   - 連結不可導向空白頁或錯誤頁面

3. **使用者介面**（Guideline 4.0）
   - 必須適配各種 iPhone 螢幕尺寸
   - 支援安全區域（Safe Area）避免被瀏海/動態島遮擋
   - 支援深色模式為加分項目

4. **最低功能要求**（Guideline 4.2）
   - App 不可只是一個網頁的包裝殼
   - 建議加入原生功能如推播通知、離線存取等
   - TravelGo 已有 PWA 離線功能，但建議再強化

5. **第三方內容**（Guideline 5.2）
   - YouTube 連結和影片資訊需確保符合 YouTube API 使用條款
   - Unsplash 圖片需遵守其授權條款

6. **位置資訊**（Guideline 5.1.2）
   - 如果使用地圖功能取用使用者位置，需在 Info.plist 中說明用途
   - 目前 TravelGo 未使用使用者定位，僅顯示景點位置

7. **資料儲存**（Guideline 2.5.2）
   - localStorage 資料要有合理的清除機制
   - 避免佔用過多裝置空間

### 常見被拒原因及對策

| 被拒原因 | 對策 |
|---------|------|
| 只是網頁包裝（Guideline 4.2） | 加入 Capacitor 原生插件（如推播、相機） |
| 缺少隱私權政策 | 建立隱私權政策頁面並填入 URL |
| App 閃退或 bug | 在各種裝置和 iOS 版本上充分測試 |
| 螢幕截圖不符 | 使用實際 App 截圖，不要用 mock-up |
| 缺少登入測試帳號 | 如有登入功能，在審查備註中提供測試帳號 |
| 中繼資料不完整 | 確保所有必填欄位都已正確填寫 |

### 加速審查的建議
- 首次提交前先使用 TestFlight 充分測試
- App 描述要清楚說明所有功能
- 在審查備註中說明 App 的使用方式
- 如果使用網頁技術，強調離線功能和原生體驗

---

## 更新 App 流程

當 Web 內容更新後：

```bash
# 1. 更新 www 目錄
npm run build

# 2. 同步到 iOS 專案
npx cap sync ios

# 3. 在 Xcode 中建置並測試
npm run cap:open:ios

# 4. 確認無誤後，重新 Archive 並上傳
```

### 版本號管理
- 在 Xcode 的 **General** 頁籤中更新：
  - **Version**：對使用者可見的版本號（如 1.0.1）
  - **Build**：每次上傳遞增的內部編號（如 2, 3, 4...）

---

## 實用指令速查

```bash
# 同步 Web 資源到原生專案
npm run cap:sync

# 開啟 Xcode
npm run cap:open:ios

# 檢查 Capacitor 環境
npx cap doctor

# 新增 Capacitor 插件（範例：推播通知）
npm install @capacitor/push-notifications
npx cap sync
```

---

*本指南最後更新：2026/03/30*
