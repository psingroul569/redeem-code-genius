import { supabase } from "@/integrations/supabase/client";

// Public VAPID key — safe to ship in client code, this is how Web Push identifies
// this site to a push service (Chrome/Firefox/etc.), it's not a secret.
const VAPID_PUBLIC_KEY = "BHL43rdkXf-cqftLoXnaX_VIegys2n0cUX2EU6fzjCkAaw9J1SYYuND2pdRyRn6zX9HTpJceG5zk4L7UViISGB8";

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const isPushSupported = (): boolean =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;

export const getPushPermission = (): NotificationPermission | "unsupported" =>
  isPushSupported() ? Notification.permission : "unsupported";

export const subscribeToPush = async (region: string): Promise<boolean> => {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const { error } = await supabase.functions.invoke("push-subscribe", {
    body: { subscription: subscription.toJSON(), region },
  });

  if (error) {
    await subscription.unsubscribe();
    return false;
  }

  localStorage.setItem("ff-push-subscribed", "true");
  return true;
};

export const unsubscribeFromPush = async (): Promise<void> => {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await supabase.functions.invoke("push-subscribe", {
      body: { subscription: subscription.toJSON(), unsubscribe: true },
    });
    await subscription.unsubscribe();
  }
  localStorage.removeItem("ff-push-subscribed");
};

export const isSubscribedLocally = (): boolean => localStorage.getItem("ff-push-subscribed") === "true";
