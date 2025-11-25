"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type TableFilterResetButtonProps = {
  clearKeys?: string[];
};

const DEFAULT_KEYS = ["search", "sort"];

const TableFilterResetButton = ({
  clearKeys = [],
}: TableFilterResetButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    const keysToClear = new Set([...DEFAULT_KEYS, ...clearKeys]);
    keysToClear.forEach((key) => params.delete(key));

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow disabled:opacity-50"
      title="Clear search & filters"
    >
      <Image src="/filter.png" alt="filter" width={14} height={14} />
    </button>
  );
};

export default TableFilterResetButton;

