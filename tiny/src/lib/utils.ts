import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCookieValue = (name: string, defaultValue?: string) => {  
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
  
  if (!cookie) return defaultValue;

  try {
    return cookie.split('=')[1];
  } catch {
    return defaultValue;
  }
}
