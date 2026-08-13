const fs = require('fs');

let code = fs.readFileSync('c:/Users/Admin/Desktop/fortune-crm.jsx', 'utf8');

// Replace App's onSave logic to accept a premiums mapping
code = code.replace(
  /onSave=\{async \(\) => \{\s+if \(\!client\.name\.trim\(\) \|\| \!client\.mobile\.trim\(\)\) \{ flash\("Add the client's name and mobile number first\."\); return; \}\s+const items = compareIds\.map\(\(id\) => \{\s+const s = (displaySchemes|schemes)\.find\(\(sc\) => sc\.id === id\);\s+return \{ id: uid\(\), category: s\.category, schemeId: s\.id, schemeName: `\$\{s\.insurer\} — \$\{s\.plan\}`\, premium: s\.premium, includedInReport: true \};\s+\}\);/,
  `onSave={async (customPremiums) => {\n                if (!client.name.trim() || !client.mobile.trim()) { flash("Add the client's name and mobile number first."); return; }\n                const items = compareIds.map((id) => {\n                  const s = displaySchemes.find((sc) => sc.id === id);\n                  return { id: uid(), category: s.category, schemeId: s.id, schemeName: \`\${s.insurer} — \${s.plan}\`, premium: customPremiums[s.id] || s.premium, includedInReport: true };\n                });`
);

// We need to replace the entire ProposalBuilderView
const builderStart = code.indexOf('function ProposalBuilderView(');
const builderEndStr = '/* My proposals — saved records list';
const builderEnd = code.indexOf(builderEndStr) - 65; // Back up over the dashed line comment

const newBuilder = `
function ProposalBuilderView({ schemes, compareIds, notes, setNotes, client, setClient, onGoBrowse, onSave }) {
  const items = schemes.filter((s) => compareIds.includes(s.id)).sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
  
  // Health & Lifestyle Questionnaire State
  const [ped, setPed] = useState('No');
  const [tobacco, setTobacco] = useState('No');
  const [occupation, setOccupation] = useState('Standard');
  
  // Manual Premium Overrides State
  const [customPremiums, setCustomPremiums] = useState({});

  // Compute final premium for a scheme considering loadings and overrides
  const getFinalPremium = (s) => {
    if (customPremiums[s.id] !== undefined) {
      return customPremiums[s.id];
    }
    let base = s.premium;
    if (s.category === 'Health' || s.category === 'Term') {
      if (ped === 'Yes') base += s.premium * 0.20;
      if (tobacco === 'Yes') base += s.premium * 0.10;
      if (occupation === 'High Risk') base += s.premium * 0.05;
    }
    return Math.round(base);
  };

  const total = items.reduce((sum, s) => sum + getFinalPremium(s), 0);

  if (items.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: \`1px solid \${C.border}\` }}>
          <span className="text-[12px]" style={{ color: C.textMuted }}>Proposal · client-ready document</span>
        </div>
        <div className="max-w-lg py-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: C.text }}>No schemes selected for this proposal</h2>
          <p className="text-[13.5px] mb-4" style={{ color: C.textMuted }}>Add schemes to compare from Browse or a scheme's detail page — they'll appear here as a client-ready proposal.</p>
          <Btn variant="primary" onClick={onGoBrowse}>Browse schemes</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: \`1px solid \${C.border}\` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>Proposal · client-ready document</span>
        <Tag variant="neutral">{items.length} scheme{items.length === 1 ? "" : "s"}</Tag>
      </div>

      <Card className="p-4 mb-5 max-w-2xl">
        <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Client details</div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Client name"><Input value={client.name} onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))} placeholder="Full name" /></Field>
          <Field label="Mobile"><Input value={client.mobile} onChange={(e) => setClient((c) => ({ ...c, mobile: e.target.value }))} placeholder="10-digit mobile" /></Field>
          <Field label="Email"><Input value={client.email} onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))} placeholder="client@email.com" /></Field>
        </div>
      </Card>
      
      <Card className="p-4 mb-5 max-w-2xl bg-amber-50" style={{ background: C.amber100, border: \`1px solid \${C.amber700}40\` }}>
        <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.amber700 }}>Health & Lifestyle Underwriting</div>
        <div className="text-[12px] mb-3 opacity-80" style={{ color: C.amber700 }}>These answers will dynamically adjust the base premium for health and term plans (e.g. +20% for PED).</div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Pre-existing Illness (PED)">
            <Select value={ped} onChange={e => { setPed(e.target.value); setCustomPremiums({}); }}>
              <option value="No">No</option>
              <option value="Yes">Yes (+20%)</option>
            </Select>
          </Field>
          <Field label="Tobacco / Alcohol">
            <Select value={tobacco} onChange={e => { setTobacco(e.target.value); setCustomPremiums({}); }}>
              <option value="No">No</option>
              <option value="Yes">Yes (+10%)</option>
            </Select>
          </Field>
          <Field label="Occupation Risk">
            <Select value={occupation} onChange={e => { setOccupation(e.target.value); setCustomPremiums({}); }}>
              <option value="Standard">Standard</option>
              <option value="High Risk">High Risk (+5%)</option>
            </Select>
          </Field>
        </div>
      </Card>

      <div className="max-w-2xl">
        {CATEGORIES.filter((c) => items.some((s) => s.category === c)).map((c) => (
          <div key={c} className="mb-3">
            <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.neutral500 }}>{c}</div>
          </div>
        )).length > 0 && items.map((s, i) => {
          const finalPremium = getFinalPremium(s);
          return (
          <Card key={s.id} className="p-5 mb-4">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-none" style={{ background: C.accent100, color: C.accent700 }}>{i + 1}</div>
                <div>
                  <Tag variant="accent">{s.category}</Tag>
                  <h3 className="text-[16px] font-semibold mt-1.5 mb-0.5" style={{ color: C.text }}>{s.plan}</h3>
                  <div className="text-[12px]" style={{ color: C.textMuted }}>{s.insurer}</div>
                </div>
              </div>
              {i === 0 && <Tag variant="accent2">Advisor pick</Tag>}
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="text-[12.5px]"><b className="block" style={{ color: C.text }}>{money(s.sumInsured)}</b><span style={{ color: C.textMuted }}>Sum insured</span></div>
              <div className="text-[12.5px]"><b className="block" style={{ color: C.text }}>{s.tenure} yr</b><span style={{ color: C.textMuted }}>Tenure</span></div>
              <div className="p-2 rounded-md flex flex-col" style={{ background: C.accent100 }}>
                <span className="text-[11px] font-medium mb-1" style={{ color: C.accent700 }}>Est. premium (₹)</span>
                <input 
                  type="number" 
                  className="font-bold text-[14px] bg-white rounded border px-2 py-1 outline-none" 
                  style={{ color: C.accent800, borderColor: C.accent500 }}
                  value={finalPremium} 
                  onChange={e => setCustomPremiums(prev => ({ ...prev, [s.id]: Number(e.target.value) }))} 
                />
              </div>
            </div>

            <p className="text-[13px] mb-3" style={{ color: C.textMuted }}>{s.sections.recommendations}</p>

            <Field label="Advisor note for this scheme">
              <TextArea className="w-full h-16" value={notes[s.id] || ""} onChange={(e) => setNotes((n) => ({ ...n, [s.id]: e.target.value }))} placeholder="Add a recommendation note for this scheme…" />
            </Field>
          </Card>
        )})}

        <Card className="p-4 flex justify-between items-center mb-5">
          <span className="text-[14px] font-semibold" style={{ color: C.text }}>Total estimated premium</span>
          <span className="text-[18px] font-bold" style={{ color: C.accent700 }}>{money(total)}</span>
        </Card>

        <div className="flex gap-2">
          <Btn variant="secondary" onClick={onGoBrowse}>Add more schemes</Btn>
          <Btn variant="primary" onClick={() => {
            const finalPremiumsMap = {};
            items.forEach(s => finalPremiumsMap[s.id] = getFinalPremium(s));
            onSave(finalPremiumsMap);
          }}><Save size={15} /> Save proposal</Btn>
        </div>
      </div>
    </div>
  );
}

`;

code = code.substring(0, builderStart) + newBuilder + code.substring(builderEnd);

fs.writeFileSync('c:/Users/Admin/Desktop/fortune-crm.jsx', code);
console.log('Patch successful');
