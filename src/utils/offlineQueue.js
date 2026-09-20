const STORAGE_KEY = 'RESQGRID_OFFLINE_QUEUE_V1';

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading offline queue:', e);
    return [];
  }
}

export function saveToOfflineQueue(packet) {
  try {
    const queue = getOfflineQueue();
    queue.push({
      ...packet,
      queuedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    return queue;
  } catch (e) {
    console.error('Error saving to offline queue:', e);
    return [];
  }
}

export function clearOfflineQueue() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing offline queue:', e);
  }
}
