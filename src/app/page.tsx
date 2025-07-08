'use client';

import { Customer } from "@/shared/interfaces";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter()

  const fetchCustomers = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/customer');
      const result = await response.json();
      setCustomers(result.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <main className="flex flex-col items-center text-white justify-center mt-20">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="flex gap-3 mt-10">

        {customers.map((customer) => (
          <div onClick={() => router.push(`/categories/?customerCross=${customer.cross}`)} className="px-8 py-10 bg-gray-800 cursor-pointer hover:bg-gray-600 uppercase rounded-md" key={customer.id}>
            <h2 className="">{customer.label}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
