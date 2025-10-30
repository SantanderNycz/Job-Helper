import React, { useState, useEffect } from 'react';
import LinkField from './components/LinkField.jsx';
import jsPDF from 'jspdf';

const translations = {
  en: {
    yourName: 'Your name',
    companyName: 'Company name',
    yourSkills: 'Your skills',
    interestPlaceholder: 'Why are you interested in this company?',
    addInterest: 'Add interest in company (optional)',
    generateButton: 'Generate Cover Letter',
    exportButton: 'Export PDF',
    github: 'GitHub link',
    linkedin: 'LinkedIn link',
    addLink: '+ Add Link',
    title: 'Job Application Helper',
    copySuccess: 'Link copied!'
  },
  pt: {
    yourName: 'Seu nome',
    companyName: 'Nome da empresa',
    yourSkills: 'Suas competências',
    interestPlaceholder: 'Por que você está interessado nesta empresa?',
    addInterest: 'Adicionar interesse na empresa (opcional)',
    generateButton: 'Gerar Carta de Apresentação',
    exportButton: 'Exportar PDF',
    github: 'Link do GitHub',
    linkedin: 'Link do LinkedIn',
    addLink: '+ Adicionar Link',
    title: 'Assistente de Candidatura',
    copySuccess: 'Link copiado!'
  }
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState({ en: '', pt: ''});
  const [includeInterest, setIncludeInterest] = useState(false);
  const [interest, setInterest] = useState({ en: '', pt: ''});
  const [links, setLinks] = useState([
    { type: 'github', value: '', locked: false, placeholder: translations.en.github },
    { type: 'linkedin', value: '', locked: false, placeholder: translations.en.linkedin }
  ]);
  const [letter, setLetter] = useState('');

  // keep placeholders in current language
  useEffect(() => {
    setLinks(prev => prev.map(l => {
      if (l.type === 'github') return { ...l, placeholder: translations[language].github };
      if (l.type === 'linkedin') return { ...l, placeholder: translations[language].linkedin };
      return l;
    }));
  }, [language]);

  // naive "translation" sync for skills/interest fields: if switching language and other field empty, copy text
  useEffect(() => {
    if (language === 'en' && skills.pt && !skills.en) setSkills(prev => ({ ...prev, en: skills.pt }));
    if (language === 'pt' && skills.en && !skills.pt) setSkills(prev => ({ ...prev, pt: skills.en }));
    if (language === 'en' && interest.pt && !interest.en) setInterest(prev => ({ ...prev, en: interest.pt }));
    if (language === 'pt' && interest.en && !interest.pt) setInterest(prev => ({ ...prev, pt: interest.en }));
  }, [language]);

  const handleSkillsChange = (v) => setSkills(prev => ({ ...prev, [language]: v }));
  const handleInterestChange = (v) => setInterest(prev => ({ ...prev, [language]: v }));

  const addLink = () => setLinks(prev => ([...prev, { type: 'custom', value: '', locked: false, placeholder: 'Custom link' }]));

  const handleLinkChange = (i, v) => setLinks(prev => { const n=[...prev]; n[i].value=v; return n; });
  const lockLink = (i) => setLinks(prev => { const n=[...prev]; n[i].locked=true; return n; });
  const unlockLink = (i) => setLinks(prev => { const n=[...prev]; n[i].locked=false; return n; });
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t.copySuccess);
    } catch(e) {
      alert('Failed to copy');
    }
  };

  const generateLetter = () => {
    const variationsEn = [
      `I am excited to apply for an opportunity at ${company}.`,
      `I was impressed by ${company}'s mission and would like to contribute to your team.`,
      `I believe ${company} is a great place to grow professionally and make an impact.`
    ];
    const variationsPt = [
      `Gostaria de me candidatar a uma oportunidade na ${company}.`,
      `Fiquei impressionado com a missão da ${company} e gostaria de contribuir para a vossa equipa.`,
      `Acredito que a ${company} é um excelente lugar para crescer profissionalmente e gerar impacto.`
    ];
    const rand = Math.floor(Math.random()*3);
    const interestText = includeInterest && interest[language] ? (language==='en' ? `\nIn addition, ${interest[language]}.` : `\nAlém disso, ${interest[language]}.`) : '';
    const text = language==='en'
      ? `Dear Hiring Team at ${company},\n\n${variationsEn[rand]} My background includes ${skills.en}.${interestText}\n\nBest regards,\n${name}`
      : `Exmos. recrutadores da ${company},\n\n${variationsPt[rand]} Tenho experiência em ${skills.pt}.${interestText}\n\nCom os melhores cumprimentos,\n${name}`;
    setLetter(text);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const filename = `${name || 'cover-letter'} - cover letter.pdf`;
    const lines = letter.split('\n');
    let y = 20;
    doc.setFontSize(12);
    lines.forEach(line => {
      const pieces = doc.splitTextToSize(line, 170);
      pieces.forEach(p => { doc.text(p, 20, y); y+=8; });
      y+=4;
    });
    doc.save(filename);
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#0A66C2]">{t.title}</h1>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${language==='en'?'font-semibold':''}`}>EN</span>
            <button
              aria-label="language-switch"
              onClick={() => setLanguage(language==='en'?'pt':'en')}
              className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors"
              style={{ backgroundColor: language==='pt' ? '#0A66C2' : '#ccc' }}
            >
              <span className="sr-only">Toggle Language</span>
              <span
                className="inline-block w-4 h-4 bg-white rounded-full transform transition-transform"
                style={{ marginLeft: language==='pt' ? '18px' : '4px' }}
              />
            </button>
            <span className={`text-sm ${language==='pt'?'font-semibold':''}`}>PT</span>
          </div>
        </div>

        <input className="w-full border p-2 rounded" placeholder={t.yourName} value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder={t.companyName} value={company} onChange={(e)=>setCompany(e.target.value)} />
        <textarea className="w-full border p-2 rounded" placeholder={t.yourSkills} value={skills[language]} onChange={(e)=>handleSkillsChange(e.target.value)} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeInterest} onChange={() => setIncludeInterest(v=>!v)} />
          <span>{t.addInterest}</span>
        </label>

        {includeInterest && (
          <textarea className="w-full border p-2 rounded" placeholder={t.interestPlaceholder} value={interest[language]} onChange={(e)=>handleInterestChange(e.target.value)} />
        )}

        <div className="space-y-2">
          {links.map((link, idx) => (
            <LinkField
              key={idx}
              link={link}
              index={idx}
              onChange={handleLinkChange}
              onLock={lockLink}
              onUnlock={unlockLink}
              onCopy={copyToClipboard}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={addLink} className="text-[#0A66C2] underline">{t.addLink}</button>
          <div className="flex-1" />
          <button onClick={generateLetter} className="bg-[#0A66C2] text-white px-4 py-2 rounded">{t.generateButton}</button>
          <button onClick={exportPDF} className="bg-gray-700 text-white px-4 py-2 rounded">{t.exportButton}</button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{language==='en'?'Preview':'Pré-visualização'}</h3>
          <div className="border p-4 rounded min-h-[120px] whitespace-pre-line bg-gray-50">{letter || (language==='en'?'Your cover letter will appear here.':'A sua carta aparecerá aqui.')}</div>
        </div>
      </div>
    </div>
  );
}
