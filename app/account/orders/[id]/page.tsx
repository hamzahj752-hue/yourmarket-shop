import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import OrderDetailView from "@/app/components/orders/OrderDetailView";
import { createClient } from "@/app/lib/supabase/server";
import type {
  OrderItemRow,
  OrderRow,
  OrderStatusHistoryRow,
} from "@/app/types/shop";

type Props = PageProps<"/account/orders/[id]">;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id} | YOURMARKET`,
    description: `Track and review your YOURMARKET order ${id}.`,
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const [{ data: order }, { data: items }, { data: history }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id).order("id"),
    supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <OrderDetailView
          order={{
            order: order as OrderRow,
            items: (items ?? []) as OrderItemRow[],
            history: (history ?? []) as OrderStatusHistoryRow[],
          }}
        />
      </main>
      <Footer />
    </>
  );
}