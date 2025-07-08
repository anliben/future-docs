'use client';

import { Documents } from "@/shared/interfaces";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

export default function Categories() {
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToday, setShowToday] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const router = useRouter();
  const searchParams = useSearchParams();
  const customerCross = searchParams.get("customer") ?? "/not-found";
  const category = searchParams.get("category") ?? "/not-found";


  const fetchAttachments = useCallback(async (): Promise<void> => {
    try {
      fetch(`/api/attachments/?category=${category}&customer=${customerCross}`)
        .then((res) => res.json())
        .then((res) => {
          if (Array.isArray(res.data)) {
            const docs = res.data.map((doc: any) => ({
              ...doc,
              created_at: new Date(doc.created_at),
              data: criarJson(doc?.data),
            }));
            setDocuments(docs.sort((a: Documents, b: Documents) => b.created_at.getTime() - a.created_at.getTime()));
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
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }, []);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const filteredDocuments = documents.filter(doc => {
    if (!showToday) return true;
    if (isNaN(doc.created_at.getTime())) return false;

    return doc.created_at.toDateString() === new Date().toDateString();
  });

  if (loading) return <div className="p-4 text-gray-500">Carregando...</div>;

  return (
    <div className="p-6 mx-auto">
      <div className="flex text-sm text-white space-x-2 mb-4">
        <button onClick={() => router.push('/')} className="text-blue-400 hover:underline cursor-pointer">
          Customers
        </button>
        <span>/</span>
        <button onClick={() => router.push(`/categories?customerCross=${customerCross}`)} className="text-blue-400 cursor-pointer hover:underline">
          Categories
        </button>
        <span>/</span>
        <span className="text-gray-400">Documents</span>
      </div>

      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold mb-4 text-white">Documentos</h1>
        <button onClick={() => setShowToday(prev => !prev)} className={`${showToday ? 'bg-blue-400' : 'bg-white'} px-6 py-2 cursor-pointer font-bold rounded-lg`}>Today</button>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg text-black flex justify-between items-center">
          <span>{selected.size} {selected.size > 1 ? ('Documentos selecionados') : ('Documento selecionado')}</span>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              selected.forEach(id => {
                const doc = documents.find(d => d.id === id);
                if (doc?.webContentLink) {
                  window.open(doc.webContentLink, '_blank');
                }
              });
            }}
          >
            Baixar Todos
          </button>
        </div>
      )}

      <div className="grid grid-col-2 md:grid-cols-4 gap-2">
        {filteredDocuments.map((doc, index) => {
          const isSelected = selected.has(doc.id);

          return (
            <div
              key={doc.id}
              onClick={() => toggleSelect(doc.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all text-white ${isSelected ? 'border-2 border-blue-600 bg-blue-900/40' : ''
                }`}
            >
              <div className="flex justify-between items-center mb-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="appearance-none w-5 h-5 rounded-full border-2 border-gray-400 checked:bg-blue-600 checked:border-blue-600 transition duration-200 cursor-pointer"
                />
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
          )
        })}
      </div>
    </div>
  )
}