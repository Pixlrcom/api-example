import * as jose from 'jose';

const clientKey = '<update>';
const clientSecret = '<update>';

/**
 * Create a JWT token for our api call
 * @param clientKey The client key for the API
 * @param clientSecret The secret we use to sign with for the API
 * @param payload API settings and data we want to send to the API
 */
export async function createToken(payload: Record<string, any>) {
    const secret = new TextEncoder().encode(clientSecret);
    const alg = 'HS256'
      
    const jwt = await new jose.SignJWT({ ...payload })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setSubject(clientKey)
        .sign(secret);

    return jwt;
}