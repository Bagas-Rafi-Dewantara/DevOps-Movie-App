"use client";

import Footer from "@/components/Footer";
import GlobalLoading from "@/components/GlobalLoading";
import Navbar from "@/components/Navbar";
import PlaylistSection from "@/components/PlaylistSection";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {};

function PlaylistPage({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <GlobalLoading isLoading={true} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-8">
        <PlaylistSection />
      </main>
      <Footer />
    </motion.div>
  );
}

export default PlaylistPage;
