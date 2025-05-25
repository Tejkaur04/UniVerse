
"use client";

// This page is effectively deprecated as its content has been merged into src/app/page.tsx
// It can be deleted, or kept as a null render to prevent 404 if old links exist.
// For now, rendering null. Redirects from login/signup now point to "/".

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/'); // Redirect to the main unified page
  }, [router]);
  return null; 
}
