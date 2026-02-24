import { useState } from "react";

export type ModalType = "trigger" | "action";

export interface ZapItem {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface ZapModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ZapItem) => void;
  items: ZapItem[];
}

export default function ZapModal({
  type,
  isOpen,
  onClose,
  onSelect,
  items,
}: ZapModalProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const title = type === "trigger" ? "Select a Trigger" : "Select an Action";
  const subtitle =
    type === "trigger"
      ? "Choose the event that starts your Zap"
      : "Choose what your Zap does next";

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: type === "trigger" ? "#7c3aed" : "#2563eb",
                background: type === "trigger" ? "#ede9fe" : "#dbeafe",
                padding: "3px 10px",
                borderRadius: 99,
              }}
            >
              {type}
            </span>
          </div>

          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
            {subtitle}
          </p>

          <div style={{ position: "relative", marginTop: 16 }}>
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder={`Search ${type}s...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px 10px 36px",
                border: "1.5px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 14,
                color: "#111827",
                outline: "none",
                background: "#fafafa",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  type === "trigger" ? "#7c3aed" : "#2563eb")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#e5e7eb")
              }
            />
          </div>
        </div>

        <div
          style={{
            overflowY: "auto",
            padding: "12px 16px 16px",
            flex: 1,
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              No {type}s available
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              No results for "{search}"
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  padding: "12px 14px",
                  marginBottom: 6,
                  border: "1.5px solid #f1f1f1",
                  borderRadius: 12,
                  background: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    type === "trigger" ? "#7c3aed" : "#2563eb";
                  e.currentTarget.style.background =
                    type === "trigger" ? "#faf5ff" : "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f1f1f1";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1px solid #f1f1f1",
                    background: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: 2,
                    }}
                  >
                    {item.name}
                  </div>

                  {item.description && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description}
                    </div>
                  )}
                </div>

                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth={2}
                  style={{ flexShrink: 0 }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))
          )}
        </div>

        <div
          style={{
            padding: "14px 28px",
            borderTop: "1px solid #f1f1f1",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}