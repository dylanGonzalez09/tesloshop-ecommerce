import { TopMenu } from "@/components";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <TopMenu />
      {children}
    </main>
  );
};

export default layout;
