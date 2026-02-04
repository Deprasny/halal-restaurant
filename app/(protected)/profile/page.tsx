import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export default async function ProfilePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Fetch profile from database
	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-2xl md:text-3xl font-semibold">Profile</h1>
				<p className="text-sm text-muted-foreground">
					Manage your account settings
				</p>
			</div>

			{/* Personal Information */}
			<div className="bg-card rounded-lg gm-shadow p-6">
				<div className="mb-6">
					<h2 className="text-lg font-semibold">Personal Information</h2>
					<p className="text-xs text-muted-foreground">
						Update your profile information and avatar
					</p>
				</div>
				<ProfileForm user={user} profile={profile as Profile | null} />
			</div>

			{/* Security */}
			<div className="bg-card rounded-lg gm-shadow p-6" id="security">
				<div className="mb-6">
					<h2 className="text-lg font-semibold">Security</h2>
					<p className="text-xs text-muted-foreground">
						Manage your account security
					</p>
				</div>
				<dl className="space-y-4">
					<div className="flex justify-between items-center rounded-lg p-4 bg-muted/30">
						<div>
							<dt className="text-sm font-medium">Password</dt>
							<dd className="text-xs text-muted-foreground">
								Last changed: Unknown
							</dd>
						</div>
						<a
							href="/auth/reset-password"
							className="text-sm font-medium rounded-md px-4 py-2 bg-secondary hover:bg-muted transition-colors"
						>
							Change
						</a>
					</div>
					<div className="flex justify-between items-center rounded-lg p-4 bg-muted/30">
						<div>
							<dt className="text-sm font-medium">Two-Factor Auth</dt>
							<dd className="text-xs text-muted-foreground">Not enabled</dd>
						</div>
						<span className="text-xs text-muted-foreground">Coming soon</span>
					</div>
				</dl>
			</div>

			{/* Account Info */}
			<div className="bg-card rounded-lg gm-shadow p-6">
				<div className="mb-6">
					<h2 className="text-lg font-semibold">Account Info</h2>
					<p className="text-xs text-muted-foreground">Your account details</p>
				</div>
				<dl className="space-y-3">
					<div className="flex justify-between items-center py-2 border-b border-border">
						<dt className="text-xs text-muted-foreground">User ID</dt>
						<dd className="text-xs">{user.id}</dd>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-border">
						<dt className="text-xs text-muted-foreground">Created</dt>
						<dd className="text-sm">
							{user.created_at
								? new Date(user.created_at).toLocaleDateString()
								: "N/A"}
						</dd>
					</div>
					<div className="flex justify-between items-center py-2">
						<dt className="text-xs text-muted-foreground">Auth Provider</dt>
						<dd className="text-sm capitalize">
							{user.app_metadata?.provider || "email"}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
