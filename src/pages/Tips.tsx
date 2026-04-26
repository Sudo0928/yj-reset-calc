import { useState, useMemo } from 'react';
import { TIPS, TIP_CATEGORIES, FAQ_LIST, type Tip } from '@/data/tips';
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryItem } from '@/data/glossary';
import { PixelTabs, PixelInput, PixelCard, PixelBadge } from '@/components/pixel';

const TABS = [
  { key: 'tips', label: '팁' },
  { key: 'faq', label: 'FAQ' },
  { key: 'glossary', label: '용어사전' },
];

function searchTip(tip: Tip, q: string): boolean {
  const text = `${tip.title} ${tip.summary} ${tip.body.join(' ')} ${tip.category}`.toLowerCase();
  return text.includes(q.toLowerCase());
}

function searchGlossary(item: GlossaryItem, q: string): boolean {
  const lower = q.toLowerCase();
  if (item.term.toLowerCase().includes(lower)) return true;
  if (item.aliases?.some((a) => a.toLowerCase().includes(lower))) return true;
  if (item.definition.toLowerCase().includes(lower)) return true;
  return false;
}

function TipsTab({ query }: { query: string }) {
  const [filterCat, setFilterCat] = useState<string>('전체');
  const filtered = useMemo(() => {
    return TIPS.filter((t) =>
      (filterCat === '전체' || t.category === filterCat) &&
      (!query || searchTip(t, query)),
    );
  }, [filterCat, query]);

  return (
    <>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <CatChip label="전체" active={filterCat === '전체'} onClick={() => setFilterCat('전체')} />
        {TIP_CATEGORIES.map((c) => (
          <CatChip key={c} label={c} active={filterCat === c} onClick={() => setFilterCat(c)} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && <p style={{ color: 'var(--color-ink-muted)', fontSize: 12 }}>해당하는 팁이 없습니다.</p>}
        {filtered.map((tip) => (
          <PixelCard key={tip.id} title={<>{tip.title} <PixelBadge variant="sky">{tip.category}</PixelBadge></>}>
            <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{tip.summary}</p>
            <ul style={{ paddingLeft: 18, fontSize: 11, lineHeight: 1.7, margin: 0 }}>
              {tip.body.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--color-ink-muted)' }}>
              출처: {tip.source.author} · {tip.source.date} · <a href={tip.source.url} target="_blank" rel="noreferrer noopener" style={{ color: 'var(--color-accent-pink)' }}>라운지 원문</a>
            </div>
          </PixelCard>
        ))}
      </div>
    </>
  );
}

function FaqTab({ query }: { query: string }) {
  const filtered = useMemo(() => {
    return FAQ_LIST.filter((f) =>
      !query || (f.q + ' ' + f.a).toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filtered.map((f) => (
        <details key={f.id} style={{ border: 'var(--border-pixel)', padding: '10px 14px', background: 'var(--color-bg-card)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Q. {f.q}</summary>
          <p style={{ fontSize: 12, lineHeight: 1.7, marginTop: 8, marginBottom: 0 }}>A. {f.a}</p>
        </details>
      ))}
      {filtered.length === 0 && <p style={{ color: 'var(--color-ink-muted)', fontSize: 12 }}>해당하는 FAQ가 없습니다.</p>}
    </div>
  );
}

function GlossaryTab({ query }: { query: string }) {
  const [filterCat, setFilterCat] = useState<string>('전체');
  const filtered = useMemo(() => {
    return GLOSSARY.filter((it) =>
      (filterCat === '전체' || it.category === filterCat) &&
      (!query || searchGlossary(it, query)),
    );
  }, [filterCat, query]);

  return (
    <>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <CatChip label="전체" active={filterCat === '전체'} onClick={() => setFilterCat('전체')} />
        {GLOSSARY_CATEGORIES.map((c) => (
          <CatChip key={c} label={c} active={filterCat === c} onClick={() => setFilterCat(c)} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {filtered.map((it) => (
          <div key={it.term} style={{ padding: '10px 12px', border: 'var(--border-pixel)', background: 'var(--color-bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <strong style={{ fontSize: 13 }}>{it.term}</strong>
              <PixelBadge variant="sky">{it.category}</PixelBadge>
            </div>
            {it.aliases && it.aliases.length > 0 && (
              <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginBottom: 6 }}>
                별칭: {it.aliases.join(', ')}
              </div>
            )}
            <p style={{ fontSize: 11, lineHeight: 1.6, margin: 0 }}>{it.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: 'var(--color-ink-muted)', fontSize: 12 }}>해당하는 용어가 없습니다.</p>}
      </div>
    </>
  );
}

function CatChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px', fontSize: 11, fontWeight: 700,
        border: 'var(--border-pixel)',
        background: active ? 'var(--color-accent-pink)' : 'var(--color-bg-card)',
        color: active ? '#fff' : 'var(--color-ink)',
        cursor: 'pointer',
      }}
    >{label}</button>
  );
}

export function Tips() {
  const [tab, setTab] = useState('tips');
  const [query, setQuery] = useState('');

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>팁 / FAQ / 용어사전</h1>
          <PixelBadge variant="pink">Phase 6 MVP</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          네이버 라운지 글에서 정리한 핵심 팁과 용어 정의. 본문 무단 전재를 피하기 위해 요약 + 출처 링크만 노출.
        </p>
      </div>

      <PixelInput
        placeholder="검색어 입력 (제목·내용·별칭 포함)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <PixelTabs tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ paddingTop: 14 }}>
        {tab === 'tips' && <TipsTab query={query} />}
        {tab === 'faq' && <FaqTab query={query} />}
        {tab === 'glossary' && <GlossaryTab query={query} />}
      </div>
    </div>
  );
}
