import { NextDrupal } from "next-drupal"

export const serverDrupal = new NextDrupal(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string,
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID as string,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET as string,
    },
  }
)
