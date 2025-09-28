import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth"

export interface FirebaseProfile {
  sub: string
  name: string
  email: string
  picture: string
  email_verified: boolean
}

export default function FirebaseProvider(
  options: OAuthUserConfig<FirebaseProfile>
): OAuthConfig<FirebaseProfile> {
  return {
    id: "firebase",
    name: "Firebase",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://accounts.google.com/o/oauth2/v2/auth",
      params: {
        scope: "openid email profile",
        response_type: "code",
        client_id: "478163117073-your-client-id.apps.googleusercontent.com",
      },
    },
    token: "https://oauth2.googleapis.com/token",
    userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: "USER", // Default role
      }
    },
    options,
  }
}
