import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-[350px]  px-10">{children}</div>
    </main>
  );
};

export default layout;
