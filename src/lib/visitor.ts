// Anonymous, per-browser id used to dedupe votes/likes without requiring an
// account — not identity, just spam prevention for a no-login interaction.
export const getVisitorId = (): string => {
  const key = "ff-visitor-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

const DISPLAY_NAME_KEY = "ff-display-name";

export const getDisplayName = (): string | null => localStorage.getItem(DISPLAY_NAME_KEY);

export const setDisplayName = (name: string): void => {
  localStorage.setItem(DISPLAY_NAME_KEY, name.trim().slice(0, 40));
};
