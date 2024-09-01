// https://tailwindcomponents.com/component/hoverable-table
import { getpaginatedUsers } from "@/actions";
import { Title } from "@/components";

import { redirect } from "next/navigation";
import UsersTable from "./ui/UsersTable";

export default async function page() {
  const { ok, users = [] } = await getpaginatedUsers();

  if (!ok) redirect("/auth/login");

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}
