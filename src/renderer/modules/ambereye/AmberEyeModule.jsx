import React, { useState, useRef, useEffect } from 'react';

/**
 * AmberEyeModule.jsx
 *
 * Starter React component for the AmberEye module of GoblinHQ.
 * - Sidebar: list of captured CSS selectors (add/edit/tag/clear/export)
 * - Main: embedded browser placeholder (replace with Electron BrowserView / <webview>)
 * - Capture flow: placeholder function `captureSelector()` that should be wired to the embedded chrome panel.
 *
 * Integration notes (also included below in comments):
 * - Place this file under src/renderer/modules/ambereye/AmberEyeModule.jsx
 * - Add a route or entry in the main menu to load '/ambereye' and render this component inside the GoblinHQ renderer.
 * - Replace the <div className="browser-placeholder"> with an Electron <webview> or BrowserView mount when run inside Electron.
 */

export default function AmberEyeModule({ initialSelectors = [], onClose = () => {} }) {
  const [selectors, setSelectors] = useState(initialSelectors);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [filter, setFilter] = useState('');
  const browserRef = useRef(null);

  useEffect(() => {
    const handleMessage = (ev) => {
      if (ev && ev.data && ev.data.type === 'AMBEREYE_CAPTURE') {
        pushSelector(ev.data.selector);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function pushSelector(rawSelector) {
    const entry = {
      id: Date.now().toString(),
      raw: rawSelector,
      short: shortenSelector(rawSelector),
      tags: [],
      notes: '',
    };
    setSelectors((s) => [entry, ...s]);
    setSelectedIndex(0);
  }

  function shortenSelector(sel) {
    const parts = sel.split('>').map((p) => p.trim());
    if (parts.length <= 4) return sel;
    return ['...', ...parts.slice(-3)].join(' > ');
  }

  function captureSelector() {
    const test = window.prompt('Simulate selector capture — paste full CSS selector');
    if (test) pushSelector(test);
  }

  function updateSelector(index, patch) {
    setSelectors((s) => s.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function deleteSelector(index) {
    setSelectors((s) => s.filter((_, i) => i !== index));
    setSelectedIndex((i) => (i === index ? null : i > index ? i - 1 : i));
  }

  function clearSelectors() {
    if (!confirm('Clear all captured selectors?')) return;
    setSelectors([]);
    setSelectedIndex(null);
  }

  function exportJSON() {
    const payload = {
      generatedAt: new Date().toISOString(),
      selectors,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ambereye-selectors.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const rows = ['id,short,raw,tags,notes'];
    selectors.forEach((s) => {
      const row = [s.id, `"${s.short.replace(/\"/g, '"')}"`, `"${s.raw.replace(/\"/g, '"')}"`, `"${(s.tags || []).join(';')}"`, `"${(s.notes || '').replace(/\"/g, '"')}"`];
      rows.push(row.join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ambereye-selectors.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = selectors.filter((s) => s.short.toLowerCase().includes(filter.toLowerCase()) || (s.tags || []).join(' ').toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="h-full w-full flex bg-gray-900 text-white">
      <aside className="w-80 border-r border-gray-800 p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">AmberEye — Selectors</h2>
          <button className="text-sm px-2 py-1 rounded bg-amber-500 text-black" onClick={captureSelector}>Capture</button>
        </div>

        <input placeholder="Filter tags / selector" value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 bg-gray-800 rounded" />

        <div className="flex-1 overflow-auto">
          {filtered.length === 0 && <div className="p-3 text-gray-400">No selectors captured yet.</div>}
          <ul className="space-y-2">
            {filtered.map((s, idx) => (
              <li key={s.id} className={`p-2 rounded cursor-pointer ${selectedIndex === idx ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`} onClick={() => setSelectedIndex(idx)}>
                <div className="text-sm font-medium truncate">{s.short}</div>
                <div className="text-xs text-gray-400 truncate">{s.tags?.join(', ')}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-700" onClick={() => { setSelectors((s) => s.slice().reverse()); }}>Reverse</button>
          <button className="px-2 py-1 rounded bg-amber-500 text-black" onClick={exportJSON}>Export</button>
        </div>

        <div className="text-xs text-gray-500">Pro-tip: wire the embedded webview to postMessage selectors as type 'AMBEREYE_CAPTURE' with payload {selector: string}</div>
      </aside>

      <main className="flex-1 p-4 flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AmberEye</h1>
            <div className="text-sm text-gray-400">Mode: Capture & manage CSS selectors for automated site interactions</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-gray-800 border" onClick={() => updateSelector(selectedIndex, { notes: (selectors[selectedIndex]?.notes || '') + '\nSaved at ' + new Date().toISOString() })}>Save Note</button>
            <button className="px-3 py-1 rounded bg-red-600" onClick={clearSelectors}>Clear</button>
            <button className="px-3 py-1 rounded bg-amber-500 text-black" onClick={exportCSV}>CSV</button>
            <button className="px-3 py-1 rounded bg-gray-800" onClick={onClose}>Close</button>
          </div>
        </header>

        <div className="flex gap-4 flex-1">
          <div className="flex-1 bg-gray-800 rounded p-2">
            <div ref={browserRef} className="browser-placeholder h-full w-full rounded bg-black flex items-center justify-center text-gray-500">Embedded browser (replace with BrowserView / webview)</div>
          </div>

          <div className="w-96 bg-gray-800 rounded p-3 flex flex-col gap-2">
            <h3 className="font-semibold">Details</h3>
            {!selectors[selectedIndex] && <div className="text-gray-400">Select a captured selector to view or edit details.</div>}
            {selectors[selectedIndex] && (
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm"><strong>Short:</strong> {selectors[selectedIndex].short}</div>
                <div className="text-xs text-gray-400 break-words"><strong>Raw:</strong> {selectors[selectedIndex].raw}</div>
                <textarea className="p-2 bg-gray-900 rounded h-20" value={selectors[selectedIndex].notes || ''} onChange={(e) => updateSelector(selectedIndex, { notes: e.target.value })} />

                <div className="flex gap-2">
                  <input placeholder="add tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="p-2 bg-gray-900 rounded flex-1" />
                  <button className="px-3 py-1 rounded bg-amber-500 text-black" onClick={() => { if (!tagInput) return; updateSelector(selectedIndex, { tags: Array.from(new Set([...(selectors[selectedIndex].tags || []), tagInput])) }); setTagInput(''); }}>Add</button>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-2 py-1 rounded bg-gray-700" onClick={() => navigator.clipboard?.writeText(selectors[selectedIndex].raw)}>Copy</button>
                  <button className="px-2 py-1 rounded bg-red-600" onClick={() => deleteSelector(selectedIndex)}>Delete</button>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">Export and share selector bundles with team members for consistent automation.</div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Integration checklist and dev notes are included at the bottom of this component in comments.
