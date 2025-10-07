import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractCompanyIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/company\/([^\/]+)(?:\/|$)/i);
  return match ? decodeURIComponent(match[1]) : null;
}
