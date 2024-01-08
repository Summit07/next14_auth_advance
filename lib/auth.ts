import { auth } from "@/auth";
// this is for getting userinfo for serverComponent in lib auth.ts,  but client userinfo is in hook useSession
export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
