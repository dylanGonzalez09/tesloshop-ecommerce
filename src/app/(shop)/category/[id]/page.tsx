import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const page = ({ params }: Props) => {
  const { id } = params;
  console.log({ id });

  if (id === "kids") {
    notFound();
  }

  return <div>Category page</div>;
};

export default page;
