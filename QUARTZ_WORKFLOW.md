# 📚 Cẩm Nang Workflow Làm Việc Với Quartz v5 (Digital Garden)

Tài liệu này hướng dẫn chi tiết quy trình chuẩn từ A-Z khi làm việc với Quartz: từ chuẩn bị file nội dung, quản lý hình ảnh/video, cấu hình giao diện, kiểm tra cục bộ cho đến khi đẩy lên website (GitHub Pages) và cách xử lý các sự cố thường gặp.

---

## 📑 Mục Lục
1. [Cấu Trúc Thư Mục Chuẩn](#1-cấu-trúc-thư-mục-chuẩn)
2. [Cấu Hình Obsidian Để Tự Động Lưu Ảnh Vào `assets/`](#2-cấu-hình-obsidian-để-tự-động-lưu-ảnh-vào-assets)
3. [Quy Tắc Soạn Thảo Nội Dung (Markdown & Frontmatter)](#3-quy-tắc-soạn-thảo-nội-dung-markdown--frontmatter)
4. [Quản Lý & Chèn Hình Ảnh, Video (Media)](#4-quản-lý--chèn-hình-ảnh-video-media)
5. [Tùy Chỉnh Giao Diện & Cấu Hình (`quartz.config.yaml`)](#5-tùy-chỉnh-giao-diện--cấu-hình-quartzconfigyaml)
6. [Chạy Thử Nghiệm & Kiểm Tra Cục Bộ (Local Preview)](#6-chạy-thử-nghiệm--kiểm-tra-cục-bộ-local-preview)
7. [Quy Trình Đẩy Lên Web (Deployment qua GitHub Pages)](#7-quy-trình-đẩy-lên-web-deployment-qua-github-pages)
8. [Xử Lý Sự Cố: File Quá Nặng, Lỗi Push & GitHub Actions Bị Skipped](#8-xử-lý-sự-cố-file-quá-nặng-lỗi-push--github-actions-bị-skipped)
9. [Các Lệnh Quartz Hay Dùng](#9-các-lệnh-quartz-hay-dùng)
10. [Checklist Tóm Tắt Khi Viết Bài Mới](#10-checklist-tóm-tắt-khi-viết-bài-mới)

---

## 1. Cấu Trúc Thư Mục Chuẩn

Trong dự án Quartz v5, bạn chỉ cần tập trung vào các thư mục và tệp sau:

```text
my-notes/
├── content/                     # 📂 NƠI CHỨA BÀI VIẾT VÀ NỘI DUNG CHÍNH
│   ├── assets/                  # 🖼️ Toàn bộ hình ảnh, webp, gif, tài liệu đính kèm
│   ├── index.md                 # 🏠 Trang chủ website
│   ├── Learning Recap.md        # 📄 Bài viết cấp 1
│   └── RMMV_Documentary/        # 📁 Thư mục con (phân mục / category)
│       └── 1. Design_Reflection/
│           └── Map Editor Evaluation.md
│
├── plugins/                     # 🔌 Plugin mở rộng cục bộ (ví dụ: Custom Graph View)
│   └── graph/
├── quartz.config.yaml           # ⚙️ Tệp cấu hình giao diện, font chữ, plugin, layout
├── quartz/
│   └── styles/
│       └── custom.scss          # 🎨 Tùy biến CSS nâng cao (màu sắc, hiệu ứng)
│
└── .github/workflows/           # 🚀 Kịch bản tự động build & deploy lên GitHub Pages
    └── deploy-v5.yaml
```

> [!TIP]
> **Không để file ảnh hoặc file markdown bên ngoài thư mục `content/`**. Toàn bộ những gì bạn muốn hiển thị trên web phải nằm trong `content/`.

---

## 2. Cấu Hình Obsidian Để Tự Động Lưu Ảnh Vào `assets/`

Nếu bạn dùng **Obsidian** để viết bài, hãy bật cấu hình này để mỗi lần dán ảnh (`Ctrl + V`) hoặc kéo thả ảnh vào, Obsidian sẽ tự động đưa vào `content/assets/`:

1. Mở Obsidian, nhấn vào biểu tượng **Settings (⚙️)** (hoặc `Ctrl + ,`).
2. Vào mục **Files and links** ở menu bên trái.
3. Tìm phần **Default location for new attachments**:
   - Chọn: **In the folder specified below**.
   - Trong ô **Attachment folder path**, điền: `content/assets` (hoặc `assets`).
4. Bật tính năng **Automatically update internal links**: **ON**.

---

## 3. Quy Tắc Soạn Thảo Nội Dung (Markdown & Frontmatter)

### 3.1. Frontmatter (Tiêu đề, Thẻ, Ngày tháng)
Ở đầu mỗi file `.md`, bạn có thể thêm khối Frontmatter YAML giữa hai cặp `---` để tối ưu SEO và cấu trúc:

```markdown
---
title: "Tựa Đề Bài Viết"
description: "Mô tả ngắn gọn về bài viết (dùng cho SEO và xem trước liên kết)."
tags:
  - game-dev
  - rmmv
  - tutorial
draft: false     # Đặt true nếu là bản nháp (Quartz sẽ không xuất bản bài này)
---

Nội dung bài viết bắt đầu từ đây...
```

### 3.2. Liên Kết Giữa Các Bài Viết (Internal Links / Wikilinks)
Quartz hỗ trợ hoàn hảo cú pháp Wikilinks của Obsidian:

- **Liên kết cơ bản đến bài viết khác:**
  ```markdown
  Xem thêm tại [[Learning Recap]]
  ```
- **Đổi tên hiển thị cho liên kết (Alias):**
  ```markdown
  Xem bài viết [[Learning Recap|Tổng kết quá trình học]]
  ```
- **Liên kết trực tiếp tới một Heading trong bài:**
  ```markdown
  [[Learning Recap#PHẦN 1: LÀM QUEN CƠ BẢN]]
  ```
- **Liên kết tới một khối văn bản cụ thể (Block Reference):**
  ```markdown
  [[Learning Recap#^0156e2]]
  ```

---

## 4. Quản Lý & Chèn Hình Ảnh, Video (Media)

### 4.1. Cú Pháp Chèn Ảnh
Khi toàn bộ ảnh đã nằm trong `content/assets/`, bạn chèn vào markdown bằng một trong hai cách:

1. **Cú pháp Obsidian Wikilink (Khuyến nghị):**
   ```markdown
   ![[assets/ten_hinh_anh.png]]
   ```
2. **Cú pháp Markdown tiêu chuẩn:**
   ```markdown
   ![Mô tả ảnh](assets/ten_hinh_anh.png)
   ```

### 4.2. Căn chỉnh kích thước & Chú thích ảnh
- **Chỉnh kích thước chiều rộng:**
  ```markdown
  ![[assets/ten_hinh_anh.png|500]]
  ```
- **Thêm chú thích dưới ảnh:**
  ```markdown
  ![[assets/ten_hinh_anh.png]]
  <p align="center"><i>Hình 1: Bản đồ làng tân thủ được thiết kế nhanh</i></p>
  ```

---

## 5. Tùy Chỉnh Giao Diện & Cấu Hình (`quartz.config.yaml`)

Tệp `quartz.config.yaml` kiểm soát mọi thiết lập của web:

### 5.1. Tiêu đề trang (Headline) & Favicon (Icon trang web)

1. **Đổi tiêu đề góc trên cùng (Headline / Page Title):**
   Mở tệp `quartz.config.yaml` và sửa dòng `pageTitle`:
   ```yaml
   configuration:
     pageTitle: "Daesp Write"
     baseUrl: "Daesple.github.io/Daesp_Writes"
   ```

2. **Thêm / Thay đổi Favicon (Logo nhỏ trên tab trình duyệt):**
   * Chuẩn bị 1 file ảnh logo/avatar vuông định dạng **`.png`** (kích thước khuyến nghị từ `64x64px` đến `512x512px`).
   * Đặt tên file là **`icon.png`**.
   * Copy và dán đè vào thư mục:
     📁 `quartz/static/icon.png`
   * Plugin Favicon của Quartz sẽ tự động chuyển đổi file này thành `favicon.ico` chuẩn cho toàn bộ website khi build.

3. **Thay đổi ảnh xem trước khi chia sẻ link (Social Card / Open Graph):**
   * Đặt file ảnh kích thước `1200x630px` tên là **`og-image.png`**.
   * Dán vào thư mục: 📁 `quartz/static/og-image.png`.

### 5.2. Tinh chỉnh Graph View chuẩn Obsidian
Dự án đã sử dụng plugin Graph tùy biến với các thông số vật lý D3 mô phỏng chân thực:

```yaml
  - source: "./plugins/graph"
    enabled: true
    layout:
      position: right
      priority: 10
    options:
      localGraph:
        drag: true
        zoom: true
        depth: 1
        scale: 1.15
        repelForce: 2.4
        centerForce: 0.16
        linkDistance: 55
        fontSize: 0.55
        showTags: true
        focusOnHover: true
      globalGraph:
        drag: true
        zoom: true
        depth: -1
        scale: 0.95
        repelForce: 2.8
        centerForce: 0.14
        linkDistance: 60
        fontSize: 0.55
        showTags: true
        focusOnHover: true
        enableRadial: true
```

---

## 6. Chạy Thử Nghiệm & Kiểm Tra Cục Bộ (Local Preview)

Trước khi đẩy lên web, hãy luôn kiểm tra xem web hiển thị thế nào trên máy tính của bạn:

### Bước 1: Mở Terminal tại thư mục `my-notes`
- Trên VS Code: Nhấn phím tắt `` Ctrl + ` ``
- Hoặc mở PowerShell tại thư mục dự án.

### Bước 2: Chạy lệnh Preview
```powershell
npx quartz build --serve
```

- Terminal sẽ tạo một máy chủ ảo tại địa chỉ: `http://localhost:8080`
- Giữ phím `Ctrl` và click vào đường link, hoặc mở trình duyệt gõ `http://localhost:8080`.
- **Hot Reload:** Mỗi khi bạn sửa file Markdown hoặc file CSS, trang web trên trình duyệt sẽ tự động cập nhật ngay lập tức mà không cần khởi động lại lệnh.
- **Xóa Cache:** Nếu thấy font hoặc CSS chưa cập nhật, nhấn **`Ctrl + F5`** trên trình duyệt.
- Để tắt server: Nhấn `Ctrl + C` trong terminal.

---

## 7. Quy Trình Đẩy Lên Web (Deployment qua GitHub Pages)

Dự án của bạn đã được thiết lập sẵn GitHub Actions (`.github/workflows/deploy-v5.yaml`). Bất cứ khi nào bạn đẩy code lên nhánh `v5`, GitHub sẽ tự động biên dịch và xuất bản website.

### Quy Trình Cập Nhật Hàng Ngày (3 Bước Đơn Giản)

Khi bạn vừa viết xong bài mới hoặc chỉnh sửa xong ghi chú:

```powershell
# Bước 1: Thêm toàn bộ các thay đổi mới
git add .

# Bước 2: Tạo ghi chú commit (mô tả ngắn gọn nội dung vừa làm)
git commit -m "Thêm bài viết mới và cập nhật hình ảnh"

# Bước 3: Đẩy lên GitHub (nhánh v5)
git push origin v5
```

### Cách Kiểm Tra Trạng Thái Deploy Trên GitHub
1. Truy cập vào kho chứa trên GitHub: `https://github.com/Daesple/Daesp_Writes`
2. Nhấn vào tab **Actions** ở menu trên cùng.
3. Bạn sẽ thấy tiến trình **Deploy Quartz site to GitHub Pages** đang chạy (màu vàng) và hoàn thành sau ~1-2 phút (màu xanh lá ✅).
4. Truy cập trang web trực tiếp của bạn: `https://daesple.github.io/Daesp_Writes/`

---

## 8. Xử Lý Sự Cố: File Quá Nặng, Lỗi Push & GitHub Actions Bị Skipped

### 8.1. Nguyên nhân
- **Giới hạn của GitHub:** GitHub cảnh báo khi file > 50MB và **từ chối (block) push** khi có file > 100MB.
- **File WebP quay màn hình từ PixPin:** Các đoạn quay màn hình dài thường có dung lượng từ 30MB – 80MB+, dễ gây tràn bộ nhớ khi GitHub Actions biên dịch hoặc bị hủy giữa chừng (`Skipped` / `Cancelled`).

### 8.2. Quy Trình Xử Lý Khi Push Bị Lỗi

#### 🛑 Bước 1: Xử lý file nặng trước
* **Cách 1 (Khuyên dùng):** Nén file `.webp` qua trang web miễn phí như [ezgif.com/optimize](https://ezgif.com/optimize) hoặc [squoosh.app](https://squoosh.app) để đưa dung lượng xuống dưới **5MB – 10MB**.
* **Cách 2 (Cho video dài/nặng):** Tải video lên **YouTube** (chế độ Unlisted) hoặc **Streamable**, sau đó nhúng iframe trực tiếp vào Markdown:
  ```html
  <iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
  ```

#### ↩️ Bước 2: Hủy bỏ Commit chứa file nặng (Git Reset)
Nếu bạn đã lỡ `git commit` file nặng và bị từ chối khi `git push`, file đó vẫn còn lưu trong lịch sử Git cục bộ. Bạn cần hủy commit đó:

```powershell
# 1. Hủy commit bị lỗi gần nhất (toàn bộ nội dung bài viết vừa sửa vẫn được giữ nguyên)
git reset --soft HEAD~1

# 2. Xóa file nặng cũ ra khỏi danh sách theo dõi của Git
git rm --cached "content/assets/tên_file_nặng.webp"
```

#### 📦 Bước 3: Thay thế file nhẹ và Commit lại
1. Lưu file `.webp` mới (đã nén) vào `content/assets/`.
2. Cập nhật lại đường dẫn trong file Markdown.
3. Thực hiện commit lại sạch sẽ:
   ```powershell
   git add .
   git commit -m "Optimize media files and update notes"
   git push origin v5
   ```

#### 🚀 Bước 4: Xử lý khi GitHub Actions bị Skipped / Muốn chạy lại thủ công
Khi `git push` thành công ở Bước 3, GitHub Actions sẽ **tự động kích hoạt lại** tiến trình build mới.

Nếu muốn chạy lại bằng tay:
1. Mở trình duyệt vào: `https://github.com/Daesple/Daesp_Writes/actions`
2. Chọn workflow **Deploy Quartz site to GitHub Pages** ở cột bên trái.
3. Bấm nút **Run workflow** ở góc trên bên phải:
   - Chọn Branch: **`v5`**
   - Nhấn nút xanh **Run workflow**.

---

## 9. Các Lệnh Quartz Hay Dùng

| Lệnh | Mô tả |
| :--- | :--- |
| `npx quartz build` | Kiểm tra biên dịch toàn bộ trang web (phát hiện lỗi link gãy hoặc lỗi config) |
| `npx quartz build --serve` | Khởi chạy server kiểm tra giao diện trực tiếp trên máy (`http://localhost:8080`) |
| `npm run format` | Tự động định dạng code và làm đẹp các file trong dự án |
| `npm run check` | Kiểm tra lỗi TypeScript và định dạng Prettier |

---

## 10. Checklist Tóm Tắt Khi Viết Bài Mới

- [ ] Tạo file `.md` trong `content/` (hoặc thư mục con bên trong `content/`).
- [ ] Thêm tiêu đề bài viết và liên kết Wikilink `[[Tên Bài]]` vào `content/index.md` nếu muốn trang chủ dẫn tới bài này.
- [ ] Mọi hình ảnh chụp màn hình / video kéo vào phải lưu tại `content/assets/` và kiểm tra dung lượng (< 10MB).
- [ ] Chạy `npx quartz build --serve` xem thử bài viết có lỗi font hoặc mất ảnh không.
- [ ] Chạy `git add .` -> `git commit -m "..."` -> `git push origin v5` để xuất bản lên web!
