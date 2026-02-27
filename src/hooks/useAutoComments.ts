import { useState, useEffect, useRef, useCallback } from 'react';
import { Comment, RedeemCode } from '@/types';

const GAMER_NAMES = [
  'ShadowStrike', 'BlazeFury', 'NightHawk', 'IronClaw', 'StormBreaker',
  'PhantomX', 'CyberWolf', 'DarkViper', 'FlashPoint', 'ThunderBolt',
  'SilentKill', 'RapidFire', 'GhostRider', 'DeathLoop', 'PixelSniper',
  'NeonBlade', 'FrostBite', 'VenomShot', 'SteelNerve', 'AcidRain',
  'BulletProof', 'CrimsonFox', 'DragonPulse', 'EliteForce', 'FuryX',
  'HyperNova', 'JetStream', 'KillerInstinct', 'LunarWolf', 'MegaBlast',
  'OmegaKing', 'ProdigyFF', 'QuantumX', 'RogueAgent', 'SkullCrusher',
  'TacticalAce', 'UltraVolt', 'ViperStrike', 'WarMachine', 'ZeroGravity',
  'BooyahKing', 'HeadshotPro', 'ClutchMaster', 'RushGamer', 'SquadLead',
  'Priya_FF', 'Rahul_Pro', 'Arjun_Gaming', 'DesiGamer', 'IndianSniper',
  'BRGamer_01', 'SambaStrike', 'RioKiller', 'IDGamer_X', 'JakartaPro',
];

const COMMENT_TEMPLATES = [
  (reward: string) => `Just claimed ${reward}! Working perfectly on my account 🔥`,
  (reward: string) => `Got the ${reward} instantly. Thanks for the update!`,
  (reward: string) => `Confirmed! ${reward} received in mail. Legit code 👍`,
  (reward: string) => `${reward} redeemed successfully. Amazing find!`,
  (reward: string) => `Works! Got ${reward} on first try. No issues.`,
  (reward: string) => `Redeemed ${reward} just now. Check in-game mail guys!`,
  (reward: string) => `Finally got ${reward}! Been waiting for this one.`,
  (reward: string) => `${reward} claimed! This site updates faster than any other.`,
  (reward: string) => `Can confirm ${reward} is legit. Worked on my server.`,
  (reward: string) => `Just used this code. Got ${reward} in 2 minutes!`,
  (reward: string) => `${reward} added to my inventory! Thanks admin 🙏`,
  (reward: string) => `Yo this actually works! ${reward} received ✅`,
  (reward: string) => `Tried it and got ${reward}. Sharing with my squad now.`,
  (reward: string) => `${reward} verified. Worked on my alt account too.`,
  (reward: string) => `Late to the party but ${reward} still working for me!`,
  (reward: string) => `Nice! ${reward} claimed. Keep these codes coming!`,
  (reward: string) => `${reward} — redeemed without any problem. Solid code.`,
  (reward: string) => `Got ${reward}!! My first time getting diamonds from a code site.`,
];

function getRandomName(usedNames: Set<string>): string {
  const available = GAMER_NAMES.filter(n => !usedNames.has(n));
  const pool = available.length > 0 ? available : GAMER_NAMES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateComment(code: RedeemCode, usedNames: Set<string>, minutesAgo: number): Comment {
  const template = COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)];
  const name = getRandomName(usedNames);
  usedNames.add(name);

  const timeLabel = minutesAgo < 1 ? 'Just now' : minutesAgo < 60 ? `${Math.floor(minutesAgo)}m ago` : `${Math.floor(minutesAgo / 60)}h ago`;

  return {
    id: `auto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    user: name,
    avatar: '',
    text: template(code.reward),
    timeAgo: timeLabel,
    verified: Math.random() > 0.15, // 85% claimed
    isAi: true,
  };
}

export function useAutoComments(code: RedeemCode) {
  const [comments, setComments] = useState<Comment[]>([]);
  const usedNamesRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeRef = useRef(code.code);

  // Reset when code changes (new hourly sync)
  useEffect(() => {
    if (codeRef.current !== code.code) {
      codeRef.current = code.code;
      usedNamesRef.current = new Set();
      // Start fresh with 1 comment
      const first = generateComment(code, usedNamesRef.current, Math.floor(Math.random() * 3) + 1);
      first.likes = Math.floor(Math.random() * 8) + 2;
      setComments([first]);
    }
  }, [code.code]);

  // Initialize with 1 comment on mount
  useEffect(() => {
    usedNamesRef.current = new Set();
    const first = generateComment(code, usedNamesRef.current, Math.floor(Math.random() * 3) + 1);
    first.likes = Math.floor(Math.random() * 8) + 2;
    setComments([first]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add comment every 8-10 minutes
  useEffect(() => {
    const getInterval = () => (Math.floor(Math.random() * 3) + 8) * 60 * 1000; // 8-10 min

    const addComment = () => {
      const newComment = generateComment(code, usedNamesRef.current, Math.random() * 2);
      newComment.likes = Math.floor(Math.random() * 8) + 2;
      setComments(prev => [newComment, ...prev]);
    };

    const scheduleNext = () => {
      intervalRef.current = setTimeout(() => {
        addComment();
        scheduleNext();
      }, getInterval());
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const addUserComment = useCallback((text: string): Comment => {
    const name = getRandomName(usedNamesRef.current);
    usedNamesRef.current.add(name);
    const userComment: Comment = {
      id: `user-${Date.now()}`,
      user: name,
      avatar: '',
      text,
      timeAgo: 'Just now',
      verified: false,
      isAi: false,
      likes: 0,
    };
    setComments(prev => [userComment, ...prev]);
    return userComment;
  }, []);

  return { comments, addUserComment };
}
