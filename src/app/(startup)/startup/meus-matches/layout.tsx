import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Matches",
};

export default function MeusMatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
