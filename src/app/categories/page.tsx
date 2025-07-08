'use client';

import { Categories } from "@/shared/interfaces";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Suspense } from 'react'

export default function CategoriesScreen() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Categories[]>([]);
  const router = useRouter();
  const customerCross = searchParams.get("customerCross") ?? "/not-found";

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/categories/?customer=${customerCross}`);
      const result = await response.json();
      setCategories(result.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }, [customerCross]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Suspense>
      <main className="p-6 mx-auto text-white">
        <div className="flex text-sm text-white space-x-2 mb-4">
          <button onClick={() => router.push('/')} className="text-blue-400 hover:underline cursor-pointer">
            Customers
          </button>
          <span>/</span>
          <span className="text-gray-400">Categories</span>
        </div>

        <h1 className="text-2xl font-bold">Categories</h1>

        <div className="flex gap-4 mt-10 flex-wrap">
          {categories.map((category, index: number) => (
            <div
              key={category.id}
              onClick={() => router.push(`/attachments/?customer=${customerCross}&category=${category.label}`)}
              className="relative px-8 py-10 bg-gray-800 cursor-pointer hover:bg-gray-600 uppercase rounded-md w-48"
            >
              {category.unreaded > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {category.unreaded > 9 ? '9+' : category.unreaded}
                </span>
              )}
              <h2 className="text-center">{category.label}</h2>
            </div>
          ))}
        </div>
      </main>
    </Suspense>
  );
}
