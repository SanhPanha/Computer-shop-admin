"use client";

import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";

type Props = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  path: string;
  title: string;
};

export function SearchComponent({ onChange, path, title }: Props) {
  const router = useRouter();

  return (
    <div className="flex justify-between gap-3 mt-4 max-w-full">
      <div className="w-full">
        <TextInput
          id="base"
          type="text"
          sizing="md"
          onChange={onChange}
          placeholder="Search..."
        />
      </div>
      <button
        onClick={() => router.push(path)}
        className="bg-orange-400 text-gray-100 px-4 py-2 rounded-lg w-[200px] hover:bg-orange-500"
      >
        {title}
      </button>
    </div>
  );
}
