import { useState } from "react";

export type ModalType = "trigger" | "action";

export interface ZapItem {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface EmailMetadata {
  to: string;
  subject: string;
  body: string;
}

export interface SolanaMetadata {
  walletAddress: string;
  amount: string;
}

export type ActionMetadata = EmailMetadata | SolanaMetadata | Record<string, never>;

interface ZapModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ZapItem, metadata: ActionMetadata) => void;
  items: ZapItem[];
}


function EmailSelector({ onConfirm }: { onConfirm: (metadata: EmailMetadata) => void }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="px-7 py-6 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-gray-900">Configure Email</h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">To</label>
        <input
          type="email"
          placeholder="recipient@example.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Subject</label>
        <input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Body</label>
        <textarea
          placeholder="Email body..."
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50 resize-none"
        />
      </div>
      <button
        onClick={() => onConfirm({ to, subject, body })}
        className="mt-1 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Save Email Action
      </button>
    </div>
  );
}

function SolanaSelector({ onConfirm }: { onConfirm: (metadata: SolanaMetadata) => void }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="px-7 py-6 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-gray-900">Configure Solana</h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Wallet Address</label>
        <input
          type="text"
          placeholder="Enter Solana wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-gray-50"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Amount (SOL)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-gray-50"
        />
      </div>
      <button
        onClick={() => onConfirm({ walletAddress, amount })}
        className="mt-1 w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
      >
        Save Solana Action
      </button>
    </div>
  );
}

function SelectorFor({ item, onConfirm }: { item: ZapItem; onConfirm: (metadata: ActionMetadata) => void }) {
  if (item.name.includes("Email")) return <EmailSelector onConfirm={onConfirm} />;
  if (item.name.includes("Solana")) return <SolanaSelector onConfirm={onConfirm} />;
  return (
    <div className="px-7 py-8 flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500">
        No configuration needed for <span className="font-semibold text-gray-800">{item.name}</span>.
      </p>
      <button
        onClick={() => onConfirm({})}
        className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
      >
        Confirm
      </button>
    </div>
  );
}


export default function ZapModal({
  type,
  isOpen,
  onClose,
  onSelect,
  items,
}: ZapModalProps) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<ZapItem | null>(null);

  

  if (!isOpen) return null;

  const isTrigger = type === "trigger";
  const title = isTrigger ? "Select a Trigger" : "Select an Action";
  const subtitle = isTrigger
    ? "Choose the event that starts your Zap"
    : "Choose what your Zap does next";

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    setSelectedItem(null);
    setSearch("");
    onClose();
  };

  const handleConfirm = (metadata: ActionMetadata) => {
    if (selectedItem) {
        onSelect(selectedItem, metadata);  // 👈 passes metadata up to page.tsx
    }
    handleClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-[1000]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[520px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header — always visible */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            {/* Back button — only shown on step 2 */}
            {selectedItem && (
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <span
              className={`inline-block text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${
                isTrigger ? "text-violet-700 bg-violet-100" : "text-blue-600 bg-blue-100"
              }`}
            >
              {type}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {selectedItem ? selectedItem.name : title}
          </h2>
          <p className="text-[13px] text-gray-500">
            {selectedItem ? `Configure your ${selectedItem.name} ${type}` : subtitle}
          </p>

          {/* Search — only on step 1 */}
          {!selectedItem && (
            <div className="relative mt-4">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={`Search ${type}s...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full box-border py-2.5 pl-9 pr-3 border-[1.5px] rounded-xl text-sm text-gray-900 outline-none bg-gray-50 transition-colors ${
                  isTrigger ? "focus:border-violet-600" : "focus:border-blue-600"
                } border-gray-200`}
              />
            </div>
          )}
        </div>
        {/* Body — step 1: list, step 2: selector */}
        {selectedItem ? (
          <div className="overflow-y-auto flex-1">
            <SelectorFor item={selectedItem} onConfirm={handleConfirm} />
          </div>
        ) : (
          <div className="overflow-y-auto px-4 pt-3 pb-4 flex-1">
            {items.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No {type}s available</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No results for "{search}"</div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}  // 👈 go to step 2
                  className={`flex items-center gap-3.5 w-full px-3.5 py-3 mb-1.5 border-[1.5px] border-gray-100 rounded-xl bg-white cursor-pointer text-left transition-all ${
                    isTrigger
                      ? "hover:border-violet-600 hover:bg-violet-50"
                      : "hover:border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <div className="w-[42px] h-[42px] rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    )}
                  </div>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth={2} className="shrink-0">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}

        <div className="px-7 py-3.5 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-lg border-[1.5px] border-gray-200 bg-white text-[13px] font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}