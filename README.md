# D2C Health Diagnostic

Chẩn đoán sức khỏe doanh nghiệp D2C qua **16 rules** được đúc kết từ 20+ năm kinh nghiệm đầu tư và tư vấn. Một công cụ tự chẩn đoán cho founder — và lead-gen tool cho đơn vị tư vấn.

> Powered by **TrendLab AI Consulting** · Trend-Forward. AI-Powered.

---

## Tính năng

- **16 rules · 5 tầng phân tích** — Channel & Cost, Quality, Unit Economics, Team & Founder, Fundraising
- **Death Spiral Detection** — phát hiện 4 giai đoạn: Channel Lock-in → Ads Escalation → Quality Collapse → Margin Death
- **Industry benchmarks** — so sánh chỉ số với median ngành (Beauty / Fashion / F&B / Electronics)
- **Scale Readiness Gate** — 4/4 điều kiện để sẵn sàng scale
- **Action Plan ưu tiên theo severity** — critical → danger → warning
- **Xuất báo cáo PDF** — `@media print` tối ưu cho A4, bảo toàn màu sắc
- **Form book tư vấn** — thu thập name / email / phone / company / slot / note

## Demo nhanh

```bash
# Clone
git clone https://github.com/<your-username>/d2c-health-diagnostic.git
cd d2c-health-diagnostic

# Cài dependencies
npm install

# Chạy local (http://localhost:5173)
npm run dev

# Build production
npm run build
npm run preview
```

Yêu cầu: **Node.js 18+** và **npm 9+**.

## Cấu trúc dự án

```
d2c-health-diagnostic/
├── index.html                  # Entry HTML của Vite
├── package.json                # Dependencies + scripts
├── vite.config.js              # Vite config (React plugin)
├── .gitignore
├── README.md
└── src/
    ├── main.jsx                # React entry — render component vào #root
    └── d2c-health-diagnostic.jsx   # Component chính (UI + 16-rule logic)
```

Toàn bộ logic + UI nằm trong 1 file `d2c-health-diagnostic.jsx` để dễ copy/embed vào dự án khác (Next.js, CRA, Remix...).

## 16 Rules

| # | Rule | Pillar |
|---|------|--------|
| 1 | Paid Ads Addiction | Channel & Cost |
| 2 | Channel Concentration | Channel & Cost |
| 3 | Rating Decay | Quality |
| 4 | Channel Diversification | Channel & Cost |
| 5 | Channel Contribution Margin | Channel & Cost |
| 6 | Return Rate | Quality |
| 7 | Gross Margin | Unit Economics |
| 8 | Repeat Purchase | Unit Economics |
| 9 | Scale Readiness Gate (4/4) | Unit Economics |
| 10 | Founding Team Coverage | Team & Founder |
| 11 | Advisors | Team & Founder |
| 12 | Cofounder Alignment | Team & Founder |
| 13 | CEO Dual Competency (Product + Finance) | Team & Founder |
| 14 | Fundraising Timing | Fundraising |
| 15 | Runway Health | Fundraising |
| 16 | Investor Fit | Fundraising |

Tổng điểm: **160** (16 rules × 10). Quy ra thang 100 để hiển thị:

- **80 - 100** · HEALTHY
- **60 - 79** · CAUTION
- **40 - 59** · WARNING
- **< 40** · CRITICAL

## Tuỳ chỉnh

### Đổi benchmark ngành

Mở `src/d2c-health-diagnostic.jsx`, tìm object `BENCHMARKS`. Mỗi ngành có các ngưỡng `good` / `warn` cho từng slider. Thay số theo dữ liệu portfolio thực tế của bạn.

```js
const BENCHMARKS = {
  beauty: {
    gross_margin: { good: 60, warn: 45, label: "Beauty median ~60%" },
    // ...
  }
};
```

### Kết nối form tư vấn với CRM

Mặc định form chỉ lưu state trên browser. Để gửi lead về CRM / Google Sheet / webhook, chỉnh `handleLeadSubmit` trong component:

```js
const handleLeadSubmit = async (e) => {
  e.preventDefault();
  // ...validation
  await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, score: results.pct, industry }),
  });
  setLeadSubmitted(true);
};
```

### Đổi branding

Tất cả màu sắc là constant ở đầu file (`TEAL`, `OBSIDIAN`, `TEXT_PRIMARY`...). Thay một lần, áp dụng toàn app. Tên "TrendLab AI Consulting" xuất hiện ở intro + footer — tìm và thay đúng 3 chỗ.

## Deploy

Project dùng Vite nên deploy được ra mọi static host:

- **Vercel** — `vercel` hoặc kết nối GitHub repo, không cần config
- **Netlify** — build command `npm run build`, publish directory `dist`
- **GitHub Pages** — cần thêm `base: "/<repo-name>/"` vào `vite.config.js`
- **Cloudflare Pages** — auto-detect Vite

## License

Proprietary — © TrendLab AI Consulting. Liên hệ để license cho portfolio companies.

## Liên hệ

Nếu bạn là D2C founder muốn tư vấn chuyên sâu về kết quả chẩn đoán, dùng form "Book tư vấn" trực tiếp trong app, hoặc liên hệ TrendLab để được hỗ trợ.
