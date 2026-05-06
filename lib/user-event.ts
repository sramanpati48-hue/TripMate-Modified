// Custom event dispatcher for user updates
// This allows components to listen for user changes across the entire app

const USER_UPDATE_EVENT = 'user-update';

export const userEventBus = {
  subscribe: (callback: (user: any) => void) => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    };
    
    window.addEventListener(USER_UPDATE_EVENT, handler);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener(USER_UPDATE_EVENT, handler);
    };
  },

  emit: (user: any) => {
    const event = new CustomEvent(USER_UPDATE_EVENT, {
      detail: user,
      bubbles: true,
    });
    window.dispatchEvent(event);
  },
};
