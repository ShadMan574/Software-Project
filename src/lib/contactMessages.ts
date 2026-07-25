export type ContactMessageRecord = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
  source?: 'remote' | 'local';
};

export const CONTACT_MESSAGES_STORAGE_KEY = 'contact_messages_fallback';

export const readStoredContactMessages = (): ContactMessageRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CONTACT_MESSAGES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeStoredContactMessage = (message: ContactMessageRecord) => {
  if (typeof window === 'undefined') return;
  const existing = readStoredContactMessages();
  const next = [message, ...existing.filter((item) => item.id !== message.id)];
  window.localStorage.setItem(CONTACT_MESSAGES_STORAGE_KEY, JSON.stringify(next));
};

export const mergeContactMessages = (remoteMessages: ContactMessageRecord[], localMessages: ContactMessageRecord[]) => {
  const merged = [...remoteMessages, ...localMessages];
  const deduped = merged.reduce<ContactMessageRecord[]>((acc, message) => {
    if (!acc.some((item) => item.id === message.id)) {
      acc.push(message);
    }
    return acc;
  }, []);

  return deduped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};
