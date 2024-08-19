import { titleFont } from "@/config/fonts";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <h1>Hello world 1</h1>
      <h1 className={`${titleFont.className} font-bold`}>Hello world 2</h1>
    </div>
  );
}
