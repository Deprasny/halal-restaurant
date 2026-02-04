import Link from "next/link";

export default function DashboardPage() {
	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
				<p className="text-sm text-muted-foreground">Welcome to your app</p>
			</div>

			<div className="bg-card rounded-lg gm-shadow p-6 md:p-8">
				<h2 className="text-xl font-semibold mb-4">Getting Started</h2>
				<p className="text-muted-foreground mb-6">
					This is a clean Next.js + Supabase boilerplate. Start building your
					app by editing this page.
				</p>
				<div className="grid gap-4 sm:grid-cols-2">
					<Link
						href="/profile"
						className="rounded-lg bg-muted/50 p-4 text-sm font-medium hover:bg-muted transition-colors"
					>
						Edit Profile
					</Link>
					<a
						href="https://supabase.com/docs"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-lg bg-muted/50 p-4 text-sm font-medium hover:bg-muted transition-colors"
					>
						Supabase Docs
					</a>
				</div>
			</div>
		</div>
	);
}
