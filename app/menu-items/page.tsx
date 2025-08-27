
import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/types";

// Page de liste de tous les plats
export default async function MenuItemsPage() {
  // Déterminer l'URL de base de l'API
  const baseUrl =
    process.env.NEXT_PUBLIC_API ||
    (typeof window === "undefined" ? "http://localhost:3000" : "");
  
  // Récupérer la liste des plats depuis l'API
  const res = await fetch(`${baseUrl}/api/menu-items`, { cache: "no-store" });
  const data = await res.json();
  const menuItems: MenuItem[] = data.success ? data.data : [];

  // Affichage principal
  return (
    <div className="p-8 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">Menu Costco Food Court</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`/menu-items/${item.id}`}
            className="block group"
          >
            {/* Carte du plat */}
            <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col h-full transition hover:shadow-lg">
                <Image
                  src={item.imageUrl ?? "/placeholder.png"}
                  alt={item.name}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  style={{ objectFit: "cover" }}
                />
              <h3 className="text-xl font-bold text-[#e31837] mb-2 group-hover:underline">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
