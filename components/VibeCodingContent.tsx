export default function VibeCodingContent() {
  const steps = [
    {
      num: '01',
      title: 'CLAUDE.md — 奠定地基',
      color: '#849C92',
      body: '專案的「憲法」。Claude 啟動時優先讀取，嚴格限制在 200 行以內。涵蓋 Tech Stack、命名規範、目錄結構，以及絕對禁止踩的 Anti-Patterns。',
    },
    {
      num: '02',
      title: 'Plan Mode — 先設計，再動手',
      color: '#C7978E',
      body: '複雜需求一律先進 Plan Mode。要求輸出模組劃分、Data Flow、預計改動的檔案清單。你必須完全理解並同意設計，才能切換回 Write mode。',
    },
    {
      num: '03',
      title: '小步快跑 — 一次只做一件事',
      color: '#9B84C4',
      body: '把大 Feature 拆成 3–5 個獨立子任務。❌ 「幫我把整個金流串接完」→ ✅ 「我們只做加入購物車的 API 與 Schema，結帳邏輯先留白」。',
    },
    {
      num: '04',
      title: 'TDD — 測試先行',
      color: '#6A8178',
      body: '先請 Claude 寫測試案例（含正常流程、空值、邊界條件），你確認測試覆蓋率後，再讓它寫實作直到測試全通過。',
    },
    {
      num: '05',
      title: '兩分鐘黃金審查',
      color: '#C4845A',
      body: 'AI 生成的程式碼 90% 表面完美，10% 藏在邊緣條件。肉眼 Scan 一遍 Git Diff，檢查記憶體洩漏、錯誤處理、全局變數污染。',
    },
    {
      num: '06',
      title: 'Clean Context — 果斷重置',
      color: '#849C92',
      body: '出現以下症狀就立刻重開新對話：開始忘記 CLAUDE.md 規範、重複犯同樣的錯、輸出速度變慢或給出不相干的程式碼。',
    },
    {
      num: '07',
      title: '資產沉澱 — 封裝 MCP / Skills',
      color: '#9B84C4',
      body: '發現每次新專案都要重新跟 Claude 解釋同樣的事 → 該自動化了。把常用工具封裝成 MCP 服務，把高頻 Workflow 封裝成 Custom Skills。',
    },
  ]

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'rgba(242,237,231,0.97)' }}>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight"
            style={{ background: '#7B6FA0', color: '#fff' }}>
            SOP
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Vibe Coding SOP
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Claude Code 協作最佳實踐</p>
          </div>
        </div>

        {/* Workflow diagram */}
        <div className="rounded-xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto"
          style={{ background: '#1E1E2E', color: '#CDD6F4' }}>
          <div style={{ color: '#A6E3A1' }}>{'[需求想法]'}</div>
          {'    ──> 01. CLAUDE.md  設定邊界'}
          <br />{'         ──> 02. Plan Mode   輸出 Blueprint'}
          <br />{'              ──> 03. 拆解任務   一次一個功能'}
          <br />{'                   ──> 04. TDD      先測試再實作'}
          <br />{'                        ──> 05. Code Review  兩分鐘把關'}
          <br />
          <br />
          <span style={{ color: '#F38BA8' }}>{'[上下文崩壞?]'}</span>
          <span style={{ color: '#CDD6F4' }}>{' ──> 06. Clean Context  重置'}</span>
          <br />
          <span style={{ color: '#89DCEB' }}>{'[穩定輸出中]'}</span>
          <span style={{ color: '#CDD6F4' }}>{' ──> 07. 封裝 MCP / Skills  沉澱資產'}</span>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map(s => (
            <div key={s.num} className="flex gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(132,156,146,0.08)', border: '1px solid var(--glass-border)' }}>
              <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] text-white"
                style={{ background: s.color }}>
                {s.num}
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Motto */}
        <div className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(123,111,160,0.12)', border: '1px solid rgba(123,111,160,0.25)' }}>
          <p className="text-xs font-semibold italic" style={{ color: '#7B6FA0' }}>
            💡 &ldquo;讓 AI 負責瘋狂輸出，讓人腦負責設定邊界與嚴格品管。&rdquo;
          </p>
        </div>

      </div>
    </div>
  )
}
