'use client';
import React, { useState } from 'react';
import {
  Building2, SlidersHorizontal, AlertTriangle, Check,
} from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';

// ─── Toggle Component ───────────────────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
        enabled ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  );
}

// ─── Toast ──────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState('');
  const show = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };
  return { toast, show };
}

// ─── Field Row ──────────────────────────────────────────────────────
function FieldRow({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 py-1">
        <div>
          <p className="text-[12px] font-medium text-gray-900">{label}</p>
          <p className="text-[11px] text-gray-400">{hint}</p>
        </div>
        <div className="flex-shrink-0 w-56">{children}</div>
      </div>
      <div className="h-px bg-gray-100" />
    </>
  );
}

// ─── Section Card ───────────────────────────────────────────────────
function SectionCard({
  iconBg, icon, title, description, children, onSave, noFooter,
}: {
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  onSave?: () => void;
  noFooter?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900">{title}</p>
          <p className="text-[11px] text-gray-400">{description}</p>
        </div>
      </div>
      <div className="px-4 py-3 flex flex-col gap-1">{children}</div>
      {!noFooter && (
        <div className="flex justify-end px-4 py-2.5 border-t border-gray-100">
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-medium hover:bg-indigo-700 transition-colors"
          >
            <Check size={13} /> Save changes
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Input style ────────────────────────────────────────────────────
const inputCls = 'w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none';

// ─── Main Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'security' | 'notifications'>('general');
  const { toast, show } = useToast();

  // General card state
  const [orgName, setOrgName] = useState('University Research Office');
  const [contactEmail, setContactEmail] = useState('research@university.edu');
  const [timezone, setTimezone] = useState('Asia/Colombo (UTC+5:30)');

  // Proposal card state
  const [maxBudget, setMaxBudget] = useState('500000');
  const [autoAssign, setAutoAssign] = useState(false);
  const [allowEdits, setAllowEdits] = useState(true);

  // Danger zone confirm state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const openConfirm = (msg: string, action: () => void) => {
    setConfirmMsg(msg);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const handleClearMessages = async () => {
    await fetch('/api/admin/messages/all', { method: 'DELETE' });
    show('All messages cleared.');
  };

  const handleReseed = async () => {
    // TODO: wire to /api/setup/seed if implemented
    show('Seed data reset triggered (no-op in production).');
  };

  const dangerBtn = 'text-[11px] font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors whitespace-nowrap';

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage system preferences and admin account</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check size={14} /> {toast}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-0.5 border-b border-gray-200 bg-white rounded-t-xl px-2">
        {(['general', 'account', 'security', 'notifications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[12px] capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'general' ? (
        <div className="space-y-4">
          {/* Organization details */}
          <SectionCard
            iconBg="bg-purple-50 text-purple-600"
            icon={<Building2 size={15} />}
            title="Organization details"
            description="Shown in system emails and exported reports"
            onSave={() => show('Organization details saved!')}
          >
            <FieldRow label="Organization name" hint="Shown in emails and reports">
              <input className={inputCls} value={orgName} onChange={e => setOrgName(e.target.value)} />
            </FieldRow>
            <FieldRow label="Contact email" hint="Public inquiry email">
              <input className={inputCls} type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
            </FieldRow>
            <FieldRow label="System timezone" hint="Used for dates and deadlines">
              <select className={inputCls} value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option>Asia/Colombo (UTC+5:30)</option>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </FieldRow>
          </SectionCard>

          {/* Proposal settings */}
          <SectionCard
            iconBg="bg-blue-50 text-blue-600"
            icon={<SlidersHorizontal size={15} />}
            title="Proposal settings"
            description="Control submission rules and reviewer assignment"
            onSave={() => show('Proposal settings saved!')}
          >
            <FieldRow label="Max budget per proposal ($)" hint="Proposals above this are flagged for review">
              <input className={inputCls} type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} />
            </FieldRow>
            <FieldRow label="Auto-assign reviewer" hint="Randomly assign on submission">
              <Toggle enabled={autoAssign} onToggle={() => setAutoAssign(p => !p)} />
            </FieldRow>
            <FieldRow label="Allow proposal edits" hint="After submission, before review starts">
              <Toggle enabled={allowEdits} onToggle={() => setAllowEdits(p => !p)} />
            </FieldRow>
          </SectionCard>

          {/* Danger zone */}
          <SectionCard
            iconBg="bg-red-50 text-red-600"
            icon={<AlertTriangle size={15} />}
            title="Danger zone"
            description="Irreversible actions — proceed with caution"
            noFooter
          >
            <div className="flex items-center justify-between gap-4 py-1">
              <div>
                <p className="text-[12px] font-medium text-gray-900">Clear all contact messages</p>
                <p className="text-[11px] text-gray-400">Permanently deletes all messages from the database</p>
              </div>
              <button
                className={dangerBtn}
                onClick={() => openConfirm('Are you sure you want to delete ALL contact messages? This cannot be undone.', handleClearMessages)}
              >
                Clear messages
              </button>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between gap-4 py-1">
              <div>
                <p className="text-[12px] font-medium text-gray-900">Reset seed data</p>
                <p className="text-[11px] text-gray-400">Re-runs the database seed script with default data</p>
              </div>
              <button
                className={dangerBtn}
                onClick={() => openConfirm('Are you sure you want to reset all seed data? Existing records will be overwritten.', handleReseed)}
              >
                Reset seed
              </button>
            </div>
          </SectionCard>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl flex flex-col items-center justify-center py-16 text-gray-400 shadow-sm">
          <p className="text-[14px] font-medium">Coming soon</p>
          <p className="text-[12px] mt-1">This section is under development</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { confirmAction(); setConfirmOpen(false); }}
        message={confirmMsg}
      />
    </div>
  );
}
