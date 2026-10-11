import { useEffect, useState } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";
import { isPushSupported, subscribeToPush, unsubscribeFromPush, isSubscribedLocally } from "@/lib/push";

interface Props {
  region: string;
}

export const NotifyMeButton: React.FC<Props> = ({ region }) => {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(isPushSupported());
    setSubscribed(isSubscribedLocally());
  }, []);

  if (!supported) return null;

  const handleClick = async () => {
    setLoading(true);
    if (subscribed) {
      await unsubscribeFromPush();
      setSubscribed(false);
    } else {
      const ok = await subscribeToPush(region);
      setSubscribed(ok);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-pressed={subscribed}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[10px] font-tech font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
        subscribed
          ? "bg-success-bg border-success-border text-success"
          : "bg-surface border-border text-t-muted hover:text-foreground hover:border-success/40"
      }`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : subscribed ? (
        <BellRing size={14} />
      ) : (
        <Bell size={14} />
      )}
      {subscribed ? "Notifications On" : "Notify Me on New Codes"}
    </button>
  );
};

export default NotifyMeButton;
