import React, { useEffect, useState } from 'react';
import { FileText, Plus, Download, Sparkles, Folder } from 'lucide-react';
import { db } from '../../lib/db';
import { DocumentRecord } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { EmptyState } from '../common/EmptyState';

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    loadDocs();
    window.addEventListener('realtypulse_db_change', loadDocs);
    return () => window.removeEventListener('realtypulse_db_change', loadDocs);
  }, []);

  const loadDocs = async () => {
    const list = await db.getDocuments();
    setDocuments(list);
  };

  const handleAddDoc = async () => {
    const docName = prompt('Document Title:');
    if (!docName) return;

    await db.addDocument({
      organization_id: 'org_default',
      name: docName,
      type: 'contract',
      url: 'https://example.com/docs/contract.pdf',
      created_by: 'usr_default',
    });

    loadDocs();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light font-display text-[#E4E4E7] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#8B5CF6]" />
            Document Asset Vault
          </h1>
          <p className="text-xs text-[#71717A] mt-1 font-mono">
            {documents.length} Legal Agreements, Dossiers, and Purchase Contracts
          </p>
        </div>

        <button
          onClick={handleAddDoc}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-[#8B5CF6]/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Add Document Record
        </button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="0 Documents Stored"
          description="Your document vault is currently empty. Generated PDF dossiers and contracts will appear here."
          actionLabel="Add Document"
          onAction={handleAddDoc}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map(doc => (
            <GlassCard key={doc.id} className="p-5 space-y-3" glow>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1D1D21] border border-[#27272A] text-[#8B5CF6]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#E4E4E7] text-sm line-clamp-1">{doc.name}</h3>
                  <span className="text-[10px] text-[#71717A] uppercase font-mono">{doc.type}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272A] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#71717A] font-mono">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#1D1D21] hover:bg-[#27272A] text-[#8B5CF6] text-[11px] font-medium border border-[#27272A] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> View Asset
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
