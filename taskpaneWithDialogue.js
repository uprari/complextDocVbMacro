'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';

export default function TaskPane() {
  useEffect(() => {
    Office.onReady(() => {
      console.log('Office.js is ready');
      checkAuthentication();
    });
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await axios.get('/api/check-auth', { withCredentials: true });
      if (response.status !== 200) {
        openAuthDialog();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      openAuthDialog();
    }
  };

  const openAuthDialog = () => {
    Office.context.ui.displayDialogAsync(
      'https://domain.com/auth/dialog',
      { height: 80, width: 80 },
      (result) => {
        const dialog = result.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
          const message = JSON.parse(arg.message);
          dialog.close();
          if (message.status === 'success') {
            window.location.reload();
          } else {
            console.error('Auth failed:', message.error);
          }
        });
      }
    );
  };

  return (
    <div>
      <h1>Word Add-in Task Pane</h1>
      <Script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js" />
    </div>
  );
}
