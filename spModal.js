import { useState, useEffect } from 'react';

// Tailwind CSS styles (assumes Tailwind is set up in your project)
const modalStyles = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
  content: 'bg-white rounded-lg p-6 w-full max-w-3xl relative',
  closeButton: 'absolute top-2 right-2 text-gray-500 hover:text-gray-700',
  iframe: 'w-full h-96 border-0',
};

export default function SharePointModal({ fileName, userName }) {
  const [isOpen, setIsOpen] = useState(true);

  // Construct SharePoint URL
  const tenant = 'your-tenant'; // Replace with your SharePoint tenant
  const site = 'your-site'; // Replace with your SharePoint site
  const encodedFileName = encodeURIComponent(fileName || 'default.docx');
  const encodedUserName = encodeURIComponent(userName || 'unknown');
  const sharePointUrl = `https://${tenant}.sharepoint.com/sites/${site}/Shared%20Documents/${encodedFileName}?user=${encodedUserName}`;

  const closeModal = () => setIsOpen(false);

  // Log URL for debugging
  useEffect(() => {
    console.log('SharePoint URL:', sharePointUrl);
  }, [sharePointUrl]);

  // Only render modal if isOpen is true
  if (!isOpen) return null;

  return (
    <div className={modalStyles.overlay} onClick={closeModal}>
      <div
        className={modalStyles.content}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={closeModal}
          className={modalStyles.closeButton}
        >
          ×
        </button>
        <h2 className="text-xl mb-4">SharePoint Document</h2>
        <iframe
          src={sharePointUrl}
          className={modalStyles.iframe}
          title="SharePoint Document"
          allowFullScreen
        />
      </div>
    </div>
  );
}
