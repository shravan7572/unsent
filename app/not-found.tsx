import type { Metadata } from "next";
import NotFoundContent from "@/app/component/not-found-content";

export const metadata: Metadata = {
  title: "404 • This letter got lost | अनकहा • Unsent",
  description:
    "The page you’re looking for was never delivered — or maybe it was never meant to arrive.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
