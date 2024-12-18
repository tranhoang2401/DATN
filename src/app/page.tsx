import Header from "@/components/layout/Header";
import { SignOut } from "@/utils/auth-helpers/server";
import { getUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Container, Grid, Title, Text, Card, Image } from "@mantine/core";
import HomePage from "@/components/layout/HomePage";

export default async function Home() {
  const supabase = createClient();
  const user = await getUser(supabase);

  // if (user) {
  //   return redirect("/hosotruong");
  // }

  if (user) {
    return (
      <>
        <Header />
        <HomePage />
      </>
    );
  }

  const redirectPath = await SignOut();
  return redirect(redirectPath);
}
