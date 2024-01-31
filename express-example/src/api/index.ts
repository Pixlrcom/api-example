import express from 'express';
import { SignJWT } from 'jose';

const PIXLR_CLIENT_KEY = process.env.PIXLR_CLIENT_KEY || 'pixlr-client-key';
const PIXLR_CLIENT_SECRET =
  process.env.PIXLR_CLIENT_SECRET || 'pixlr-client-secret';

const router = express.Router();

export async function createToken(payload: Record<string, any>) {
  console.log({
    PIXLR_CLIENT_KEY,
    PIXLR_CLIENT_SECRET,
  });
  const secret = new TextEncoder().encode(PIXLR_CLIENT_SECRET);
  const alg = 'HS256';

  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .setSubject(PIXLR_CLIENT_KEY)
    .sign(secret);

  return jwt;
}

router.post('/token', async (req, res) => {
  const origin = req.protocol + '://' + req.get('host');

  const payload = {
    mode: 'embedded',
    origin,
  };
  // const payload = {
  //   mode: 'http',
  //   follow: true,
  //   openUrl: `${origin}/upload/image.png`,
  //   saveUrl: `${origin}/http?/save`,
  // };

  const token = await createToken(payload);

  res.json({ token });
});



export default router;
