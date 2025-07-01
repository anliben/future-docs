'use client';

import { useEffect, useState } from 'react';

type Doc = {
  id: string;
  name: string;
  type: string;
  webContentLink: string;
  data: any;
  created_at: Date;
};

function criarJson(str: string): Record<string, string> {
  const json: Record<string, string> = {};

  str.split(';').forEach(part => {
    const trimmed = part.trim();
    if (!trimmed) return;

    const [key, value] = trimmed.split(':').map(s => s.trim());

    if (key && value !== undefined) {
      json[key] = value;
    }
  });

  return json;
}


export default function DocumentList() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToday, setShowToday] = useState(false);

  useEffect(() => {
    fetch('/api/attachments')
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res.data)) {
          const docs = res.data.map((doc: any) => ({
            ...doc,
            created_at: doc.created_at ? new Date(doc.created_at.split('-').reverse().join('-')) : new Date(0),
            data: criarJson(doc?.data),
          }));
          setDocuments(docs.sort((a: Doc, b: Doc) => b.created_at.getTime() - a.created_at.getTime()));
        } else {
          console.error('Resposta inesperada da API:', res);
          setDocuments([]); // ou algum fallback
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar os anexos:', err);
        setLoading(false);
      });
  }, []);


  const setShowingToday = () => {
    setShowToday(prev => !prev);
  }


  if (loading) return <div className="p-4 text-gray-500">Carregando...</div>;

  return (
    <div className="p-6 mx-auto">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold mb-4 text-white">Documentos</h1>
        <button className={`${showToday ? 'bg-blue-400' : 'bg-white'} px-6 py-2 cursor-pointer font-bold rounded-lg`} onClick={() => setShowingToday()}>Today</button>
      </div>
      <div className="grid grid-col-2 md:grid-cols-4 gap-2">
        {documents
          .filter((doc: any) => {
            if (!showToday) return true;
            if (isNaN(doc.created_at.getTime())) return false;

            return doc.created_at.toDateString() === new Date().toDateString();
          }).map((doc, index) => (
            <div
              key={doc.id}
              className="p-4 text-white rounded-xl shadow-md border border-[#262626]"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold uppercase tracking-wide">
                  {doc.type}: {index + 1}
                </span>
                <a
                  href={doc.webContentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  Baixar PDF
                </a>
              </div>
              {doc.type === 'invoice' && (<ul className='mt-4 bg-[#262626] rounded-md my-4 p-4'>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="invoice_number">Invoice Number:</label>
                  <span id='invoice_number'>{doc.data['invoice_number']}</span>
                </div>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="due_date">Due Date:</label>
                  <span id='due_date'>{doc.data['due_date']}</span>
                </div>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="total_amount_due">Total Amount Due:</label>
                  <span id='total_amount_due'>{doc.data['total_amount_due']}</span>
                </div>
              </ul>)}

              {doc.type === 'contract' && (<ul className='mt-4 bg-[#262626] rounded-md my-4 p-4'>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="parties_involved">Parties Involved:</label>
                  <span id='parties_involved'>{doc.data['parties_involved']}</span>
                </div>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="effective_date">Effective Date:</label>
                  <span id='effective_date'>{doc.data['effective_date']}</span>
                </div>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="compensation_amount">Compensation Amount:</label>
                  <span id='compensation_amount'>{doc.data['compensation_amount']}</span>
                </div>
              </ul>)}

              {doc.type === 'financial' && (<ul className='mt-4 bg-[#262626] rounded-md my-4 p-4'>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="total_assets">Total Assets:</label>
                  <span id='total_assets'>{doc.data['total_assets']}</span>
                </div>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="total_liabilities">Total Liabilities:</label>
                  <span id='total_liabilities'>{doc.data['total_liabilities']}</span>
                </div>
                <div>
                  <label className='font-bold text-md mr-2' htmlFor="total_equity">Total Equity:</label>
                  <span id='total_equity'>{doc.data['total_equity']}</span>
                </div>
              </ul>)}
            </div>
          ))}
      </div>
    </div>
  );
}
