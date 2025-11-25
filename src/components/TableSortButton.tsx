"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type TableSortButtonProps = {
  sortKey?: string;
  defaultOrder?: "asc" | "desc";
};

const TableSortButton = ({
  sortKey = "sort",
  defaultOrder = "asc",
}: TableSortButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentValue = searchParams.get(sortKey) ?? defaultOrder;
  const nextValue = currentValue === "asc" ? "desc" : "asc";

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set(sortKey, nextValue);
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
      title={`Toggle sort (${nextValue === "asc" ? "ascending" : "descending"})`}
    >
      <Image src="/sort.png" alt="sort" width={14} height={14} />
    </button>
  );
};

export default TableSortButton;

