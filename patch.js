const fs = require('fs');
let code = fs.readFileSync('c:/Users/Admin/Desktop/fortune-crm.jsx', 'utf8');

code = code.replace(
  'const [currentUser, setCurrentUser] = useState(null);\n\n  // navigation',
  `const [currentUser, setCurrentUser] = useState(null);\n\n  const [selectedCoverage, setSelectedCoverage] = useState(1000000);\n\n  const displaySchemes = useMemo(() => {\n    return schemes.map(s => {\n      if (s.category === 'Health' || s.category === 'Term' || s.category === 'Travel') {\n        const ratio = selectedCoverage / s.sumInsured;\n        return { ...s, sumInsured: selectedCoverage, premium: Math.round(s.premium * ratio) };\n      }\n      return s;\n    });\n  }, [schemes, selectedCoverage]);\n\n  // navigation`
);

code = code.replace(
  '<Sidebar\n          category={category} schemes={schemes}\n          search={search} setSearch={setSearch}',
  '<Sidebar\n          category={category} schemes={displaySchemes}\n          search={search} setSearch={setSearch}\n          selectedCoverage={selectedCoverage} setSelectedCoverage={setSelectedCoverage}'
);

code = code.replace(
  'category={category} schemes={schemes} search={search} filterInsurer={filterInsurer}',
  'category={category} schemes={displaySchemes} search={search} filterInsurer={filterInsurer}'
);

code = code.replace(
  'scheme={schemes.find((s) => s.id === activeSchemeId)}',
  'scheme={displaySchemes.find((s) => s.id === activeSchemeId)}'
);

code = code.replace(
  'category={category} schemes={schemes} compareIds={compareIds}',
  'category={category} schemes={displaySchemes} compareIds={compareIds}'
);

code = code.replace(
  'schemes={schemes} compareIds={compareIds} notes={notes}',
  'schemes={displaySchemes} compareIds={compareIds} notes={notes}'
);

code = code.replace(
  'proposal={proposals.find((p) => p.id === activeProposalId)}\n              schemes={schemes} user={currentUser}',
  'proposal={proposals.find((p) => p.id === activeProposalId)}\n              schemes={displaySchemes} user={currentUser}'
);

code = code.replace(
  'function Sidebar({ category, schemes, search, setSearch, filterInsurer, setFilterInsurer, sortBy, setSortBy, favouritesOnly, setFavouritesOnly, favIds, onOpenScheme }) {',
  'function Sidebar({ category, schemes, search, setSearch, filterInsurer, setFilterInsurer, sortBy, setSortBy, favouritesOnly, setFavouritesOnly, favIds, onOpenScheme, selectedCoverage, setSelectedCoverage }) {'
);

code = code.replace(
  '<div className="flex flex-col gap-2 mb-4">\n        <Field label="Insurer">',
  `<div className="flex flex-col gap-2 mb-4">\n        {['Health', 'Term', 'Travel'].includes(category) && (\n          <Field label="Coverage (Sum Insured)">\n            <Select value={selectedCoverage} onChange={(e) => setSelectedCoverage(Number(e.target.value))}>\n              <option value="500000">₹5 Lakhs</option>\n              <option value="1000000">₹10 Lakhs</option>\n              <option value="2500000">₹25 Lakhs</option>\n              <option value="5000000">₹50 Lakhs</option>\n              <option value="10000000">₹1 Crore</option>\n            </Select>\n          </Field>\n        )}\n        <Field label="Insurer">`
);

fs.writeFileSync('c:/Users/Admin/Desktop/fortune-crm.jsx', code);
console.log('Patch successful');
