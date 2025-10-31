import React from "react";

export default function LinkField({
  link,
  index,
  onChange,
  onLock,
  onUnlock,
  onCopy,
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        className={`w-full border p-2 rounded ${
          link.locked ? "bg-gray-200" : ""
        }`}
        placeholder={link.placeholder}
        value={link.value}
        onChange={(e) => onChange(index, e.target.value)}
        disabled={link.locked}
      />
      {!link.locked && (
        <button
          onClick={() => onLock(index)}
          className="bg-blue-500 px-3 py-1 rounded"
        >
          <img className="text-white w-8" src="/public/copy.png" alt="copy" />
        </button>
      )}
      {link.locked && (
        <>
          <button
            onClick={() => onCopy(link.value)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Copy
          </button>
          <button
            onClick={() => onUnlock(index)}
            className="bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
