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

export const getOrigin = (): string => {
  if (typeof window === 'undefined') return '';
  
  const { protocol, hostname, port } = window.location;

  const isStandardPort = 
    (protocol === 'https:' && port === '443') ||
    (protocol === 'http:'  && port === '80')  ||
    port === '';

  return `${protocol}//${hostname}${isStandardPort ? '' : `:${port}`}`;
}
