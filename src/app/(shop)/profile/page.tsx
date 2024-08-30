import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  // if (!session?.user) redirect("/auth/login?returnTo=/profile");
  if (!session?.user) redirect("/auth/login");

  return (
    <div>
      <Title title="Perfil" />
      <pre>{JSON.stringify(session.user, null, 2)}</pre>

      <h3>{session.user.role}</h3>
    </div>
  );
};

export default page;
