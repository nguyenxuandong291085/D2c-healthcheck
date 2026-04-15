import { useState, useEffect, useRef } from "react";

const TEAL = "#00D4AA";
const TEAL_DIM = "#00B894";
const OBSIDIAN = "#0A0E17";
const OBSIDIAN_LIGHT = "#121828";
const OBSIDIAN_MID = "#1A2238";
const SURFACE = "#1E2A45";
const TEXT_PRIMARY = "#E8ECF4";
const TEXT_SECONDARY = "#8892A8";
const RED = "#FF4D6A";
const ORANGE = "#FF9F43";
const YELLOW = "#FECA57";
const GREEN = "#00D4AA";

const questions = [
  {
    id: "top_channel_pct",
    section: "Channel & Cost",
    sectionIcon: "📡",
    label: "Kênh bán lớn nhất chiếm bao nhiêu % doanh thu?",
    type: "slider",
    min: 10,
    max: 100,
    step: 5,
    unit: "%",
    default: 40,
  },
  {
    id: "active_channels",
    section: "Channel & Cost",
    sectionIcon: "📡",
    label: "Bạn đang bán hàng trên bao nhiêu kênh active?",
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    unit: " kênh",
    default: 3,
  },
  {
    id: "paid_ads_pct",
    section: "Channel & Cost",
    sectionIcon: "📡",
    label: "Chi phí quảng cáo (paid ads) chiếm bao nhiêu % doanh thu?",
    type: "slider",
    min: 0,
    max: 60,
    step: 1,
    unit: "%",
    default: 15,
  },
  {
    id: "ads_trend",
    section: "Channel & Cost",
    sectionIcon: "📡",
    label: "Trend chi phí ads 3 tháng gần nhất?",
    type: "select",
    options: [
      { value: "decreasing", label: "Giảm dần" },
      { value: "stable", label: "Ổn định" },
      { value: "increasing", label: "Tăng dần" },
      { value: "spike", label: "Tăng mạnh" },
    ],
    default: "stable",
  },
  {
    id: "channel_margin_positive",
    section: "Channel & Cost",
    sectionIcon: "📡",
    label: "Tất cả các kênh bán đều có contribution margin dương?",
    type: "select",
    options: [
      { value: "yes", label: "Có — tất cả kênh đều margin dương" },
      { value: "mostly", label: "Hầu hết — 1-2 kênh đang âm nhẹ" },
      { value: "no", label: "Không — đang bù lỗ kênh này bằng kênh khác" },
    ],
    default: "yes",
  },
  {
    id: "rating_change",
    section: "Quality",
    sectionIcon: "⭐",
    label: "Rating sản phẩm thay đổi thế nào khi doanh thu tăng?",
    type: "select",
    options: [
      { value: "up", label: "Tăng hoặc giữ nguyên (≥ 4.5)" },
      { value: "slight_down", label: "Giảm nhẹ (4.0 - 4.4)" },
      { value: "down", label: "Giảm rõ (3.5 - 3.9)" },
      { value: "bad", label: "Giảm mạnh (< 3.5)" },
    ],
    default: "up",
  },
  {
    id: "return_rate",
    section: "Quality",
    sectionIcon: "⭐",
    label: "Tỷ lệ return/complaint hiện tại?",
    type: "slider",
    min: 0,
    max: 15,
    step: 0.5,
    unit: "%",
    default: 3,
  },
  {
    id: "gross_margin",
    section: "Unit Economics",
    sectionIcon: "💰",
    label: "Gross margin hiện tại?",
    type: "slider",
    min: 10,
    max: 80,
    step: 1,
    unit: "%",
    default: 45,
  },
  {
    id: "repeat_rate",
    section: "Unit Economics",
    sectionIcon: "💰",
    label: "Tỷ lệ khách hàng quay lại mua hàng (repeat purchase rate)?",
    type: "slider",
    min: 0,
    max: 60,
    step: 1,
    unit: "%",
    default: 20,
  },
  {
    id: "ltv_minus_cac",
    section: "Unit Economics",
    sectionIcon: "💰",
    label: "LTV - CAC trong năm đầu tiên?",
    type: "select",
    options: [
      { value: "positive_strong", label: "Dương mạnh (LTV > 2x CAC)" },
      { value: "positive", label: "Dương (LTV > CAC)" },
      { value: "breakeven", label: "Hòa vốn" },
      { value: "negative", label: "Âm (LTV < CAC)" },
    ],
    default: "positive",
  },
  {
    id: "revenue_profit_trend",
    section: "Unit Economics",
    sectionIcon: "💰",
    label: "Trend doanh thu và lợi nhuận 3 tháng gần nhất?",
    type: "select",
    options: [
      { value: "both_up", label: "Cả hai đều tăng" },
      { value: "rev_up_profit_flat", label: "Doanh thu tăng, lợi nhuận đi ngang" },
      { value: "rev_up_profit_down", label: "Doanh thu tăng, lợi nhuận giảm" },
      { value: "both_down", label: "Cả hai đều giảm" },
    ],
    default: "both_up",
  },
  {
    id: "team_coverage",
    section: "Team & Founder",
    sectionIcon: "👥",
    label: "Founding team cover đủ 3 trụ cột (Product+Finance, Tech, Marketing)?",
    type: "select",
    options: [
      { value: "all3", label: "Đủ cả 3 trụ cột" },
      { value: "two", label: "Có 2/3 trụ cột" },
      { value: "one", label: "Chỉ có 1 trụ cột" },
    ],
    default: "all3",
  },
  {
    id: "ceo_competency",
    section: "Team & Founder",
    sectionIcon: "👥",
    label: "CEO hiểu sâu về product VÀ finance?",
    type: "select",
    options: [
      { value: "both", label: "Giỏi cả Product lẫn Finance" },
      { value: "product_strong", label: "Giỏi Product, yếu Finance" },
      { value: "finance_strong", label: "Giỏi Finance, yếu Product" },
      { value: "neither", label: "Chưa mạnh cả hai" },
    ],
    default: "both",
  },
  {
    id: "cofounder_alignment",
    section: "Team & Founder",
    sectionIcon: "👥",
    label: "Mức độ alignment của founding team?",
    type: "select",
    options: [
      { value: "strong", label: "Cùng tầm nhìn, có equity agreement rõ ràng, review định kỳ" },
      { value: "ok", label: "Tầm nhìn chung khớp nhưng chưa có cơ chế review" },
      { value: "weak", label: "Có bất đồng nhưng chưa nghiêm trọng" },
      { value: "critical", label: "Bất đồng sâu về tầm nhìn hoặc equity" },
    ],
    default: "strong",
  },
  {
    id: "advisors",
    section: "Team & Founder",
    sectionIcon: "👥",
    label: "Đội ngũ cố vấn (advisors) hiện tại?",
    type: "select",
    options: [
      { value: "strong", label: "≥ 2 advisors active, đúng ngành, đúng giai đoạn" },
      { value: "some", label: "Có advisor nhưng không đúng ngành hoặc không active" },
      { value: "none", label: "Chưa có advisor" },
    ],
    default: "some",
  },
  {
    id: "runway_months",
    section: "Fundraising",
    sectionIcon: "🚀",
    label: "Cash runway còn bao nhiêu tháng?",
    type: "slider",
    min: 0,
    max: 24,
    step: 1,
    unit: " tháng",
    default: 9,
  },
  {
    id: "fundraising_readiness",
    section: "Fundraising",
    sectionIcon: "🚀",
    label: "Tình trạng gọi vốn hiện tại?",
    type: "select",
    options: [
      { value: "not_needed", label: "Chưa cần — đang tự tăng trưởng bền vững" },
      { value: "ready", label: "Đang chuẩn bị — có traction + playbook rõ ràng" },
      { value: "exploring", label: "Đang tìm hiểu — chưa chắc về timing" },
      { value: "urgent", label: "Cấp bách — runway < 6 tháng, cần vốn ngay" },
    ],
    default: "ready",
  },
  {
    id: "investor_fit",
    section: "Fundraising",
    sectionIcon: "🚀",
    label: "Investor hiện tại (nếu có) đang hỗ trợ như thế nào?",
    type: "select",
    options: [
      { value: "great", label: "Có industry knowledge, network, hỗ trợ active" },
      { value: "ok", label: "Hỗ trợ ở mức trung bình" },
      { value: "passive", label: "Ngồi im, chỉ xuất hiện khi có exit event" },
      { value: "burden", label: "Gánh nặng — đòi báo cáo/compliance quá mức" },
      { value: "no_investor", label: "Chưa có investor" },
    ],
    default: "no_investor",
  },
];

function evaluate(answers) {
  let scores = {};
  let flags = [];
  let actions = [];

  // Rule 1: Paid Ads Addiction
  const ads = answers.paid_ads_pct;
  if (ads <= 15) scores.r1 = 10;
  else if (ads <= 20) scores.r1 = 7;
  else if (ads <= 30) scores.r1 = 4;
  else if (ads <= 40) scores.r1 = 2;
  else { scores.r1 = 0; flags.push({ rule: 1, severity: "critical", text: "Chi phí ads > 40% doanh thu — đang ở death zone" }); }
  if (ads > 20 && ads <= 30) flags.push({ rule: 1, severity: "warning", text: `Paid ads ${ads}% — vượt ngưỡng healthy (12-15%)` });
  if (ads > 30 && ads <= 40) flags.push({ rule: 1, severity: "danger", text: `Paid ads ${ads}% — đang nghiện ads nặng` });
  if (ads > 20) actions.push("Giảm paid ads xuống < 20% bằng cách đầu tư vào owned channels (email, Zalo OA, community). Target 12-15%.");

  // Rule 2: Channel Concentration
  const topCh = answers.top_channel_pct;
  if (topCh <= 40) scores.r2 = 10;
  else if (topCh <= 50) scores.r2 = 7;
  else if (topCh <= 60) scores.r2 = 4;
  else if (topCh <= 80) { scores.r2 = 2; flags.push({ rule: 2, severity: "danger", text: `Kênh top chiếm ${topCh}% — rủi ro tập trung cao` }); }
  else { scores.r2 = 0; flags.push({ rule: 2, severity: "critical", text: `Kênh top chiếm ${topCh}% — một thay đổi policy = chết` }); }
  if (topCh > 40) actions.push(`Mở thêm kênh bán mới. Mục tiêu: không kênh nào > 40%. Hiện kênh top đang chiếm ${topCh}%.`);

  // Rule 4: Channel Diversification
  const ch = answers.active_channels;
  if (ch >= 5) scores.r4 = 10;
  else if (ch >= 4) scores.r4 = 7;
  else if (ch >= 3) scores.r4 = 5;
  else { scores.r4 = 2; flags.push({ rule: 4, severity: "warning", text: `Chỉ có ${ch} kênh active — cần đa dạng hóa` }); }
  if (ch < 4) actions.push("Mở rộng lên ít nhất 4 kênh active: web, sàn TMĐT, offline/popup, B2B, telesales.");

  // Rule 5: Channel Margin
  const cm = answers.channel_margin_positive;
  if (cm === "yes") scores.r5 = 10;
  else if (cm === "mostly") { scores.r5 = 6; flags.push({ rule: 5, severity: "warning", text: "Có kênh đang margin âm — cần review" }); }
  else { scores.r5 = 2; flags.push({ rule: 5, severity: "danger", text: "Đang bù lỗ kênh này bằng kênh khác — không bền vững" }); actions.push("Review contribution margin từng kênh. Cut hoặc fix kênh margin âm trước khi scale."); }

  // Rule 3: Quality Decay
  const rating = answers.rating_change;
  const ret = answers.return_rate;
  if (rating === "up" && ret <= 3) scores.r3 = 10;
  else if (rating === "slight_down" || ret <= 5) scores.r3 = 6;
  else if (rating === "down" || ret <= 8) { scores.r3 = 3; flags.push({ rule: 3, severity: "danger", text: "Chất lượng đang giảm khi scale — Quality Collapse warning" }); }
  else { scores.r3 = 0; flags.push({ rule: 3, severity: "critical", text: "Chất lượng giảm mạnh — đóng băng tăng trưởng ngay" }); }
  if (scores.r3 <= 6) actions.push("Đóng băng scale, fix supply chain + QC. So sánh rating và return rate ở các mốc revenue khác nhau.");

  // Rule 6: Quality at scale (combined with r3)
  scores.r6 = scores.r3;

  // Rule 7: Gross Margin
  const gm = answers.gross_margin;
  if (gm >= 55) scores.r7 = 10;
  else if (gm >= 40) scores.r7 = 7;
  else if (gm >= 35) { scores.r7 = 4; flags.push({ rule: 7, severity: "warning", text: `Gross margin ${gm}% — mỏng, scale rất khó` }); }
  else { scores.r7 = 0; flags.push({ rule: 7, severity: "critical", text: `Gross margin ${gm}% — dưới 35%, không thể scale` }); actions.push("Fix product pricing hoặc cost structure. Gross margin phải ≥ 40% mới có thể scale D2C."); }

  // Rule 8: Repeat Purchase
  const rp = answers.repeat_rate;
  if (rp >= 30) scores.r8 = 10;
  else if (rp >= 20) scores.r8 = 7;
  else if (rp >= 15) { scores.r8 = 4; flags.push({ rule: 8, severity: "warning", text: `Repeat rate ${rp}% — chưa đủ để giảm phụ thuộc ads` }); }
  else { scores.r8 = 1; flags.push({ rule: 8, severity: "danger", text: `Repeat rate ${rp}% — đang bán cho stranger liên tục` }); actions.push("Đầu tư vào retention: loyalty program, post-purchase experience, community. Target ≥ 20%."); }

  // Rule 9: Scale Readiness Gate
  const ltv = answers.ltv_minus_cac;
  const trend = answers.revenue_profit_trend;
  let gatesPassed = 0;
  if (ltv === "positive_strong" || ltv === "positive") gatesPassed++;
  if (rp >= 20) gatesPassed++;
  if (ads < 20) gatesPassed++;
  if (trend === "both_up") gatesPassed++;
  scores.r9 = Math.round((gatesPassed / 4) * 10);
  if (gatesPassed < 4) {
    flags.push({ rule: 9, severity: gatesPassed <= 2 ? "danger" : "warning", text: `Scale Readiness: ${gatesPassed}/4 gates passed — ${gatesPassed < 3 ? "CHƯA sẵn sàng scale" : "gần sẵn sàng"}` });
    if (gatesPassed < 3) actions.push("Chưa đủ điều kiện scale. Cần đạt đủ 4 gates: LTV>CAC, repeat ≥20%, ads <20%, revenue+profit cùng tăng.");
  }

  // Rule 10: Team Coverage
  const tc = answers.team_coverage;
  if (tc === "all3") scores.r10 = 10;
  else if (tc === "two") { scores.r10 = 5; flags.push({ rule: 10, severity: "warning", text: "Thiếu 1 trụ cột trong founding team — có blind spot" }); actions.push("Tuyển hoặc tìm co-founder bổ sung trụ cột còn thiếu (Product+Finance / Tech / Marketing)."); }
  else { scores.r10 = 2; flags.push({ rule: 10, severity: "danger", text: "Chỉ có 1 trụ cột — rủi ro rất cao" }); actions.push("Ưu tiên số 1: bổ sung founding team trước khi scale."); }

  // Rule 11: Advisors
  const adv = answers.advisors;
  if (adv === "strong") scores.r11 = 10;
  else if (adv === "some") { scores.r11 = 5; flags.push({ rule: 11, severity: "warning", text: "Advisor không đúng ngành hoặc không active" }); }
  else { scores.r11 = 2; flags.push({ rule: 11, severity: "warning", text: "Chưa có advisor — thiếu vành đai hỗ trợ" }); actions.push("Tìm 2-3 advisors đúng ngành, đúng giai đoạn. Advisor cần có industry knowledge + network thực tế."); }

  // Rule 12: Cofounder Alignment
  const ca = answers.cofounder_alignment;
  if (ca === "strong") scores.r12 = 10;
  else if (ca === "ok") { scores.r12 = 6; flags.push({ rule: 12, severity: "warning", text: "Chưa có cơ chế review vai trò co-founder — bom hẹn giờ" }); actions.push("Thiết lập equity agreement rõ ràng + vesting schedule + review vai trò định kỳ 6 tháng."); }
  else if (ca === "weak") { scores.r12 = 3; flags.push({ rule: 12, severity: "danger", text: "Có bất đồng trong founding team — cần giải quyết sớm" }); actions.push("Ưu tiên giải quyết bất đồng co-founder ngay. Cân nhắc mời mediator hoặc advisor bên ngoài."); }
  else { scores.r12 = 0; flags.push({ rule: 12, severity: "critical", text: "Bất đồng nghiêm trọng — đe dọa sự tồn tại của công ty" }); actions.push("KHẨN CẤP: Giải quyết bất đồng co-founder ngay lập tức trước mọi thứ khác."); }

  // Rule 13: CEO Dual Competency
  const ceo = answers.ceo_competency;
  if (ceo === "both") scores.r13 = 10;
  else if (ceo === "product_strong") { scores.r13 = 5; flags.push({ rule: 13, severity: "warning", text: "CEO yếu Finance — rủi ro 'chết trên giấy': có lãi nhưng hết tiền" }); actions.push("CEO cần bổ sung kiến thức tài chính hoặc tuyển CFO/Finance lead. Focus: cashflow management, unit economics."); }
  else if (ceo === "finance_strong") { scores.r13 = 4; flags.push({ rule: 13, severity: "warning", text: "CEO yếu Product — rủi ro 'chết từ bên trong': mất lợi thế cạnh tranh dần" }); actions.push("CEO cần dành thời gian trực tiếp với khách hàng hàng tuần. Nói chuyện với ≥5 khách/tuần, đọc mọi review."); }
  else { scores.r13 = 1; flags.push({ rule: 13, severity: "danger", text: "CEO chưa mạnh cả Product lẫn Finance — rủi ro kép" }); actions.push("CEO cần intensive development: product immersion + financial literacy. Hoặc tuyển strong COO bổ sung."); }

  // Rule 14 + 15: Fundraising Timing
  const runway = answers.runway_months;
  const fr = answers.fundraising_readiness;
  if (fr === "not_needed") scores.r14 = 10;
  else if (fr === "ready" && runway >= 9) scores.r14 = 9;
  else if (fr === "ready" && runway >= 6) scores.r14 = 7;
  else if (fr === "exploring" && runway >= 9) scores.r14 = 6;
  else if (runway < 6 && fr !== "not_needed") { scores.r14 = 2; flags.push({ rule: 14, severity: "critical", text: `Runway chỉ còn ${runway} tháng — cần gọi vốn ngay hoặc cắt chi phí` }); actions.push("KHẨN CẤP: Runway < 6 tháng. Hai options: (1) cắt chi phí kéo dài runway, (2) bắt đầu fundraise ngay với tư thế rõ ràng."); }
  else { scores.r14 = 4; flags.push({ rule: 14, severity: "warning", text: "Cần rõ ràng về fundraising strategy — đang ở vùng xám" }); }
  scores.r15 = scores.r14;

  // Rule 16: Investor Fit
  const inv = answers.investor_fit;
  if (inv === "great") scores.r16 = 10;
  else if (inv === "ok") scores.r16 = 6;
  else if (inv === "no_investor") scores.r16 = 7;
  else if (inv === "passive") { scores.r16 = 3; flags.push({ rule: 16, severity: "warning", text: "Investor ngồi im — đang chiếm slot trên cap table mà không tạo giá trị" }); }
  else { scores.r16 = 1; flags.push({ rule: 16, severity: "danger", text: "Investor đang là gánh nặng — compliance/báo cáo vượt ngưỡng startup" }); actions.push("Negotiate lại reporting requirements với investor. Set rõ boundary phù hợp với stage hiện tại."); }

  // Calculate total
  const ruleKeys = ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13","r14","r15","r16"];
  const total = ruleKeys.reduce((sum, k) => sum + (scores[k] || 0), 0);
  const maxScore = ruleKeys.length * 10;
  const pct = Math.round((total / maxScore) * 100);

  // Death spiral stage detection
  let spiralStage = 0;
  if (topCh > 60) spiralStage = 1;
  if (topCh > 60 && ads > 25) spiralStage = 2;
  if (spiralStage >= 2 && (rating === "down" || rating === "bad" || ret > 5)) spiralStage = 3;
  if (spiralStage >= 3 && gm < 35) spiralStage = 4;

  const criticalCount = flags.filter(f => f.severity === "critical").length;
  const dangerCount = flags.filter(f => f.severity === "danger").length;

  let grade, gradeColor;
  if (pct >= 80) { grade = "HEALTHY"; gradeColor = GREEN; }
  else if (pct >= 60) { grade = "CAUTION"; gradeColor = YELLOW; }
  else if (pct >= 40) { grade = "WARNING"; gradeColor = ORANGE; }
  else { grade = "CRITICAL"; gradeColor = RED; }

  return { scores, total, maxScore, pct, grade, gradeColor, flags, actions, spiralStage, criticalCount, dangerCount };
}

const sectionOrder = ["Channel & Cost", "Quality", "Unit Economics", "Team & Founder", "Fundraising"];
const sectionIcons = { "Channel & Cost": "📡", "Quality": "⭐", "Unit Economics": "💰", "Team & Founder": "👥", "Fundraising": "🚀" };

export default function D2CHealthDiagnostic() {
  const [step, setStep] = useState("intro");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const def = {};
    questions.forEach(q => { def[q.id] = q.default; });
    return def;
  });
  const [results, setResults] = useState(null);
  const [animScore, setAnimScore] = useState(0);
  const resultsRef = useRef(null);

  const currentSection = sectionOrder[sectionIdx];
  const sectionQuestions = questions.filter(q => q.section === currentSection);

  useEffect(() => {
    if (results && step === "results") {
      let start = 0;
      const target = results.pct;
      const duration = 1500;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) { start = target; clearInterval(timer); }
        setAnimScore(Math.round(start));
      }, 16);
      return () => clearInterval(timer);
    }
  }, [results, step]);

  const handleSubmit = () => {
    const r = evaluate(answers);
    setResults(r);
    setStep("results");
  };

  const spiralLabels = [
    "Không phát hiện Death Spiral",
    "Giai đoạn 1: Channel Lock-in",
    "Giai đoạn 2: Ads Escalation",
    "Giai đoạn 3: Quality Collapse",
    "Giai đoạn 4: Margin Death"
  ];

  const containerStyle = {
    minHeight: "100vh",
    background: `linear-gradient(170deg, ${OBSIDIAN} 0%, ${OBSIDIAN_LIGHT} 50%, ${OBSIDIAN_MID} 100%)`,
    color: TEXT_PRIMARY,
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: "0",
    overflowX: "hidden",
  };

  const renderIntro = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "20px", background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DIM})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 24, boxShadow: `0 8px 32px ${TEAL}33` }}>
        ⚡
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: TEAL, textTransform: "uppercase", marginBottom: 12 }}>TrendLab AI Consulting</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2, background: `linear-gradient(135deg, ${TEXT_PRIMARY}, ${TEAL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        D2C Health Diagnostic
      </h1>
      <p style={{ color: TEXT_SECONDARY, fontSize: 16, maxWidth: 480, lineHeight: 1.7, margin: "0 0 12px" }}>
        Chẩn đoán sức khỏe doanh nghiệp D2C qua 16 rules được đúc kết từ 20+ năm kinh nghiệm đầu tư và tư vấn.
      </p>
      <p style={{ color: TEXT_SECONDARY, fontSize: 13, maxWidth: 480, lineHeight: 1.6, margin: "0 0 40px", fontStyle: "italic" }}>
        5 tầng phân tích · Channel · Quality · Unit Economics · Team · Fundraising
      </p>
      <button onClick={() => setStep("form")} style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DIM})`, border: "none", color: OBSIDIAN, fontWeight: 700, fontSize: 16, padding: "16px 48px", borderRadius: 12, cursor: "pointer", boxShadow: `0 4px 24px ${TEAL}44`, transition: "all 0.3s ease" }}>
        Bắt đầu chẩn đoán →
      </button>
    </div>
  );

  const renderSlider = (q) => {
    const val = answers[q.id];
    const pct = ((val - q.min) / (q.max - q.min)) * 100;
    return (
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: TEAL }}>{val}{q.unit}</span>
        </div>
        <input
          type="range" min={q.min} max={q.max} step={q.step} value={val}
          onChange={e => setAnswers({ ...answers, [q.id]: parseFloat(e.target.value) })}
          style={{ width: "100%", accentColor: TEAL, height: 6, cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: TEXT_SECONDARY, fontSize: 12, marginTop: 4 }}>
          <span>{q.min}{q.unit}</span><span>{q.max}{q.unit}</span>
        </div>
      </div>
    );
  };

  const renderSelect = (q) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {q.options.map(opt => {
        const selected = answers[q.id] === opt.value;
        return (
          <button key={opt.value} onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
            style={{
              background: selected ? `${TEAL}18` : `${SURFACE}88`,
              border: `1.5px solid ${selected ? TEAL : "transparent"}`,
              borderRadius: 10, padding: "12px 16px", textAlign: "left",
              color: selected ? TEXT_PRIMARY : TEXT_SECONDARY,
              fontSize: 14, cursor: "pointer", transition: "all 0.2s ease",
              fontWeight: selected ? 600 : 400,
            }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  const renderForm = () => (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px", minHeight: "100vh" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
        {sectionOrder.map((s, i) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= sectionIdx ? TEAL : SURFACE, transition: "background 0.3s" }} />
        ))}
      </div>
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{sectionIcons[currentSection]}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, textTransform: "uppercase" }}>{currentSection}</span>
      </div>
      <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 28 }}>Phần {sectionIdx + 1} / {sectionOrder.length}</div>

      {/* Questions */}
      {sectionQuestions.map((q, qi) => (
        <div key={q.id} style={{ marginBottom: 32, background: `${SURFACE}66`, borderRadius: 14, padding: "20px 20px 16px", border: `1px solid ${OBSIDIAN_MID}` }}>
          <label style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, display: "block", marginBottom: 16, lineHeight: 1.5 }}>{q.label}</label>
          {q.type === "slider" ? renderSlider(q) : renderSelect(q)}
        </div>
      ))}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, paddingBottom: 40 }}>
        {sectionIdx > 0 && (
          <button onClick={() => setSectionIdx(sectionIdx - 1)} style={{ flex: 1, background: SURFACE, border: "none", color: TEXT_SECONDARY, fontWeight: 600, fontSize: 15, padding: "14px", borderRadius: 10, cursor: "pointer" }}>
            ← Quay lại
          </button>
        )}
        {sectionIdx < sectionOrder.length - 1 ? (
          <button onClick={() => setSectionIdx(sectionIdx + 1)} style={{ flex: 2, background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DIM})`, border: "none", color: OBSIDIAN, fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 10, cursor: "pointer", boxShadow: `0 4px 16px ${TEAL}33` }}>
            Tiếp tục →
          </button>
        ) : (
          <button onClick={handleSubmit} style={{ flex: 2, background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DIM})`, border: "none", color: OBSIDIAN, fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 10, cursor: "pointer", boxShadow: `0 4px 16px ${TEAL}33` }}>
            ⚡ Chẩn đoán ngay
          </button>
        )}
      </div>
    </div>
  );

  const renderScoreRing = () => {
    const r = 80, stroke = 8;
    const circ = 2 * Math.PI * r;
    const offset = circ - (animScore / 100) * circ;
    return (
      <svg width={200} height={200} style={{ display: "block", margin: "0 auto" }}>
        <circle cx={100} cy={100} r={r} fill="none" stroke={SURFACE} strokeWidth={stroke} />
        <circle cx={100} cy={100} r={r} fill="none" stroke={results.gradeColor} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 0.1s linear" }} />
        <text x={100} y={90} textAnchor="middle" fill={results.gradeColor} fontSize={40} fontWeight={800}>{animScore}</text>
        <text x={100} y={115} textAnchor="middle" fill={TEXT_SECONDARY} fontSize={13} fontWeight={600}>/100</text>
        <text x={100} y={145} textAnchor="middle" fill={results.gradeColor} fontSize={14} fontWeight={700}>{results.grade}</text>
      </svg>
    );
  };

  const renderSpiralIndicator = () => {
    const s = results.spiralStage;
    const colors = [GREEN, YELLOW, ORANGE, RED, "#CC0033"];
    return (
      <div style={{ background: `${SURFACE}88`, borderRadius: 14, padding: 20, marginBottom: 20, border: `1px solid ${s > 0 ? colors[s] + "44" : OBSIDIAN_MID}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_SECONDARY, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Death Spiral Detection</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= s ? colors[i] : SURFACE, transition: "background 0.5s" }} />
          ))}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: s > 0 ? colors[s] : GREEN }}>
          {spiralLabels[s]}
        </div>
        {s > 0 && <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, lineHeight: 1.5 }}>
          {s === 1 && "Đang phụ thuộc 1 kênh bán quá nhiều. Cần đa dạng hóa ngay trước khi bị lock."}
          {s === 2 && "Đang leo thang chi phí ads để bù cho channel lock-in. Cần giảm ads và mở kênh mới."}
          {s === 3 && "Chất lượng đang giảm do scale quá nhanh. Đóng băng tăng trưởng, fix QC ngay."}
          {s === 4 && "Margin đã bị bào mòn. Cần restructure toàn diện: pricing, cost, operations."}
        </div>}
      </div>
    );
  };

  const renderFlags = () => {
    if (results.flags.length === 0) return null;
    const severityOrder = { critical: 0, danger: 1, warning: 2 };
    const sorted = [...results.flags].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    const sevColors = { critical: RED, danger: ORANGE, warning: YELLOW };
    const sevLabels = { critical: "CRITICAL", danger: "DANGER", warning: "WARNING" };
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_SECONDARY, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Red Flags ({results.flags.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((f, i) => (
            <div key={i} style={{ background: `${SURFACE}88`, borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${sevColors[f.severity]}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: sevColors[f.severity], letterSpacing: 1 }}>{sevLabels[f.severity]}</span>
              <div style={{ fontSize: 14, color: TEXT_PRIMARY, marginTop: 4, lineHeight: 1.5 }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActions = () => {
    if (results.actions.length === 0) return (
      <div style={{ background: `${GREEN}11`, borderRadius: 14, padding: 20, border: `1px solid ${GREEN}33` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Action Plan</div>
        <div style={{ fontSize: 15, color: TEXT_PRIMARY }}>Doanh nghiệp đang ở trạng thái healthy. Tiếp tục giữ vững các chỉ số hiện tại.</div>
      </div>
    );
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_SECONDARY, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Action Plan ({results.actions.length} items)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {results.actions.map((a, i) => (
            <div key={i} style={{ background: `${SURFACE}88`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: TEAL, minWidth: 24, height: 24, borderRadius: 6, background: `${TEAL}18`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>{i + 1}</span>
              <div style={{ fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div ref={resultsRef} style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: TEAL, textTransform: "uppercase", marginBottom: 20 }}>TrendLab · D2C Health Report</div>
        {renderScoreRing()}
      </div>

      {renderSpiralIndicator()}
      {renderFlags()}
      {renderActions()}

      <div style={{ display: "flex", gap: 12, marginTop: 32, paddingBottom: 40 }}>
        <button onClick={() => { setStep("form"); setSectionIdx(0); setResults(null); setAnimScore(0); }}
          style={{ flex: 1, background: SURFACE, border: "none", color: TEXT_SECONDARY, fontWeight: 600, fontSize: 14, padding: "14px", borderRadius: 10, cursor: "pointer" }}>
          ← Chẩn đoán lại
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "20px 0 40px", borderTop: `1px solid ${OBSIDIAN_MID}` }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: TEXT_SECONDARY, textTransform: "uppercase" }}>Powered by</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, marginTop: 4 }}>TrendLab AI Consulting</div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginTop: 2 }}>Trend-Forward. AI-Powered.</div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      {step === "intro" && renderIntro()}
      {step === "form" && renderForm()}
      {step === "results" && renderResults()}
    </div>
  );
}
