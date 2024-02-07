import { CLIENT_KEY, CLIENT_SECRET } from "$env/static/private";
import { Token, type PixlrPayloadJWT } from "pixlr-sdk";

/**
 * Create a JWT token for our api call
 * @param clientKey The client key for the API
 * @param clientSecret The secret we use to sign with for the API
 * @param payload API settings and data we want to send to the API
 */
export async function createToken(payload: PixlrPayloadJWT) {
  const tokenService = new Token({
    clientKey: CLIENT_KEY,
    clientSecret: CLIENT_SECRET,
  });

  await Token
  .generate({ clientKey: CLIENT_KEY, clientSecret: CLIENT_SECRET })
  .createToken(payload);
  
  return tokenService.createToken(payload);

  
}
