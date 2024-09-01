import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
};

export default layout;
