/**
 * Blockchain Verification Ledger Service
 *
 * Prototype Verification Ledger for Waste Traceability.
 * Provides SHA-256 event hashing, previous-block linking, and cryptographic validation.
 *
 * Notice: This is a prototype cryptographic ledger layer designed to easily bridge
 * to a permissioned network (Hyperledger Fabric) or public blockchain (Polygon / Ethereum).
 */

import { WasteLifecycleEvent } from '../types';

/**
 * Sorts object keys recursively for canonical JSON hashing
 */
export function canonicalJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJson).join(',') + ']';
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const sortedObj: Record<string, unknown> = {};
  for (const key of keys) {
    // Exclude mutable or generated fields from the canonical payload
    if (key !== 'hash' && key !== 'verified') {
      sortedObj[key] = (obj as Record<string, unknown>)[key];
    }
  }
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalJson(sortedObj[k])).join(',') + '}';
}

/**
 * Computes SHA-256 hex digest using Web Crypto API or pure fallback
 */
export async function createHash(input: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('SubtleCrypto error, falling back to pseudo-sha256', err);
  }

  // Pure JavaScript SHA-256 fallback implementation
  return '0x' + sha256Fallback(input);
}

/**
 * Creates transaction hash for a lifecycle event
 */
export async function createTransactionHash(
  event: Omit<WasteLifecycleEvent, 'hash' | 'verified'>
): Promise<string> {
  const canonical = canonicalJson({
    eventId: event.eventId,
    wasteId: event.wasteId,
    status: event.status,
    actorId: event.actorId,
    actorName: event.actorName,
    location: event.location,
    timestamp: event.timestamp,
    previousHash: event.previousHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
    description: event.description,
  });

  return createHash(canonical);
}

/**
 * Verifies if an individual event's hash matches its contents
 */
export async function verifyTransaction(event: WasteLifecycleEvent): Promise<boolean> {
  if (!event.hash) return false;
  const expectedHash = await createTransactionHash(event);
  return event.hash.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Verifies complete cryptographic chain of custody for a waste batch
 */
export async function verifyWasteLifecycle(events: WasteLifecycleEvent[]): Promise<{
  isValid: boolean;
  brokenIndex?: number;
  message: string;
  verifiedCount: number;
}> {
  if (!events || events.length === 0) {
    return {
      isValid: false,
      message: 'No lifecycle events found for this waste batch.',
      verifiedCount: 0,
    };
  }

  // Sort events chronologically
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let prevHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < sorted.length; i++) {
    const ev = sorted[i];

    // Check previous hash link (except if first block and previousHash was genesis)
    if (i > 0 && ev.previousHash !== prevHash) {
      return {
        isValid: false,
        brokenIndex: i,
        message: `Ledger block #${i + 1} (${ev.status}) chain link broken. Previous hash does not match previous block hash.`,
        verifiedCount: i,
      };
    }

    // Check self hash computation
    const selfValid = await verifyTransaction(ev);
    if (!selfValid) {
      return {
        isValid: false,
        brokenIndex: i,
        message: `Ledger block #${i + 1} (${ev.status}) payload integrity failure. Hash was tampered with or modified.`,
        verifiedCount: i,
      };
    }

    prevHash = ev.hash;
  }

  return {
    isValid: true,
    message: `All ${sorted.length} lifecycle transactions cryptographically verified and chain is untampered.`,
    verifiedCount: sorted.length,
  };
}

/**
 * Standard SHA-256 implementation in pure JS (for environments without SubtleCrypto)
 */
function sha256Fallback(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) - 56 !== 0) {
    ascii += '\x00';
  }
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (i = 0; i < 8; i++) {
      result += ('0000000' + ((hash[i] >>> 0).toString(16))).slice(-8);
    }
  }
  return result.slice(0, 64);
}
