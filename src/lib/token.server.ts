import { CLIENT_KEY, CLIENT_SECRET } from "$env/static/private";
import { SignJWT } from "jose";

type AccentNames = 'ash' | 'brown' | 'coral' | 'pink' | 'rose' | 'red' | 'plum' | 'maroon' | 'purple' | 'lavender' | 'denim' | 'blue' | 'teal' | 'green' | 'lime' | 'mustard';
type WorkspaceNames = 'dark' | 'iron' | 'steel' | 'light';
type ToolNames = 'arrange' | 'crop' | 'cutout' | 'liquify' | 'adjust' | 'effect' | 'filter' | 'ai' | 'retouch' | 'paint' | 'add-text' | 'add-element' | 'frame' | 'marquee' | 'lasso' | 'wand' | 'clone' | 'heal' | 'detail' | 'toning' | 'temper' | 'focus' | 'disperse' | 'pen' | 'fill' | 'draw' | 'shape' | 'eraser' | 'replace' | 'gradient' | 'text' | 'zoom' | 'hand';
type Formats = 'png' | 'jpeg' | 'webp' | 'pxz' | 'pdf';

interface BaseSettings {
  referrer?: string;
  icon?: string;
  accent?: AccentNames;
  workspace?: WorkspaceNames;
  tabLimit?: number;
  blockOpen?: boolean;
  disabledTools?: ToolNames[];
  exportFormats?: Formats[];
}

interface BasePayload {
  mode: "http" | "embedded";
  settings?: BaseSettings;
}

interface EmbeddedPayload extends BasePayload {
  mode: "embedded";
  origin: string;
}

interface HttpPayload extends BasePayload {
  mode: "http";
  openUrl: string;
  saveUrl: string;
  follow?: boolean;
}

export type PixlrPayloadJWT = EmbeddedPayload | HttpPayload;

/**
 * Create a JWT token for our api call
 * @param clientKey The client key for the API
 * @param clientSecret The secret we use to sign with for the API
 * @param payload API settings and data we want to send to the API
 */
export async function createToken(payload: PixlrPayloadJWT) {
  const secret = new TextEncoder().encode(CLIENT_SECRET);
  const alg = "HS256";

  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("1h")
    .setSubject(CLIENT_KEY)
    .sign(secret);

  return jwt; 
}
