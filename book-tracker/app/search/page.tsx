import SearchPage from '@/frontend/components/search/searchPage'
import { Suspense } from "react";
// import React from 'react'
export const dynamic = "force-dynamic"; // for npm build-Next.js to try prerendering /search at all (because it always depends on dynamic search input), add:

export default function searchPage() {
  return (
	 <Suspense fallback={<p>Loading search...</p>}>
		< SearchPage />
	</Suspense>
  )
}
