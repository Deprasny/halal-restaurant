"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/use-profile";
import type { Profile } from "@/lib/supabase/types";

const profileSchema = z.object({
	fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
	email: z.string().email().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

interface ProfileFormProps {
	user: User;
	profile: Profile | null;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		profile?.avatar_url || null,
	);

	const updateProfile = useUpdateProfile();
	const uploadAvatar = useUploadAvatar();

	const form = useForm<ProfileInput>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			fullName: profile?.full_name || user.user_metadata?.full_name || "",
			email: user.email || "",
		},
	});

	async function onSubmit(data: ProfileInput) {
		await updateProfile.mutateAsync({
			userId: user.id,
			fullName: data.fullName,
		});
	}

	async function handleAvatarChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (!file) return;

		// Preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);

		// Upload
		const avatarUrl = await uploadAvatar.mutateAsync({
			userId: user.id,
			file,
		});

		// Update profile with new avatar URL
		await updateProfile.mutateAsync({
			userId: user.id,
			avatarUrl,
		});
	}

	const isLoading = updateProfile.isPending || uploadAvatar.isPending;

	return (
		<div className="space-y-8">
			{/* Avatar Section */}
			<div className="flex items-center gap-6">
				<div className="relative">
					<div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden gm-shadow">
						{avatarPreview ? (
							<Image
								src={avatarPreview}
								alt="Avatar"
								fill
								className="object-cover"
								sizes="96px"
							/>
						) : (
							<span className="text-3xl font-semibold">
								{(profile?.full_name || user.email)?.[0]?.toUpperCase() || "?"}
							</span>
						)}
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						className="hidden"
					/>
				</div>
				<div>
					<Button
						type="button"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						disabled={isLoading}
					>
						{uploadAvatar.isPending ? "Uploading..." : "Change Avatar"}
					</Button>
					<p className="text-xs text-muted-foreground mt-2">
						JPG, PNG or GIF. Max 2MB.
					</p>
				</div>
			</div>

			{/* Profile Form */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										disabled
										className="bg-muted/50"
										{...field}
									/>
								</FormControl>
								<p className="text-xs text-muted-foreground">
									Email cannot be changed here
								</p>
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{updateProfile.isPending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
