const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-[350px]  px-10">{children}</div>
    </main>
  );
};

export default layout;
