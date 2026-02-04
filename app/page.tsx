"use client";

import {
	ArrowRight,
	Check,
	Fish,
	Leaf,
	MapPin,
	Search,
	Sparkles,
	Star,
	Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export default function LandingPage() {
	return (
		<div className="min-h-screen gradient-bg overflow-hidden">
			{/* Animated background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="gradient-mesh absolute inset-0 opacity-60" />

				{/* Floating orbs */}
				<motion.div
					className="absolute top-20 right-[20%] w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl"
					animate={{
						y: [0, -30, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 8,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute top-1/2 left-[10%] w-96 h-96 rounded-full bg-green-500/10 blur-3xl"
					animate={{
						y: [0, 40, 0],
						x: [0, 20, 0],
					}}
					transition={{
						duration: 10,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
				<motion.div
					className="absolute bottom-20 right-[30%] w-64 h-64 rounded-full bg-teal-400/15 blur-3xl"
					animate={{
						y: [0, -25, 0],
						scale: [1, 0.9, 1],
					}}
					transition={{
						duration: 7,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 2,
					}}
				/>
			</div>

			<div className="relative">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<motion.header
						className="flex items-center justify-between py-6"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center gap-3">
							<motion.div
								className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25"
								whileHover={{ scale: 1.05, rotate: 5 }}
								whileTap={{ scale: 0.95 }}
							>
								<Utensils className="w-5 h-5 text-white" />
							</motion.div>
							<span className="font-bold text-xl">할랄 코리아</span>
						</div>
						<Button size="sm" asChild>
							<Link href="/explore">
								앱 열기
								<ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
					</motion.header>

					{/* Hero Content */}
					<main className="py-16 sm:py-24 lg:py-32">
						<motion.div
							className="text-center max-w-3xl mx-auto"
							variants={staggerContainer}
							initial="initial"
							animate="animate"
						>
							{/* Badge */}
							<motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
								<motion.div
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-primary text-sm font-medium mb-8 shadow-lg"
									whileHover={{ scale: 1.02 }}
								>
									<Sparkles className="w-4 h-4" />
									<span>한국 전역 1,800개 이상의 할랄 음식점</span>
								</motion.div>
							</motion.div>

							{/* Main headline */}
							<motion.h1
								className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
								variants={fadeInUp}
								transition={{ duration: 0.6, delay: 0.1 }}
							>
								한국에서
								<br />
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
									할랄 음식 찾기
								</span>
							</motion.h1>

							{/* Subheadline */}
							<motion.p
								className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
								variants={fadeInUp}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								서울에서 부산까지, 할랄 인증 레스토랑,
								<br className="hidden sm:block" />
								무슬림 친화적 카페, 해산물 맛집을 찾아보세요.
							</motion.p>

							{/* CTA */}
							<motion.div
								className="flex flex-col sm:flex-row items-center justify-center gap-4"
								variants={fadeInUp}
								transition={{ duration: 0.6, delay: 0.3 }}
							>
								<Button size="lg" asChild className="min-w-[180px]">
									<Link href="/explore">
										지금 탐색하기
										<ArrowRight className="w-5 h-5" />
									</Link>
								</Button>
							</motion.div>

							{/* Trust signal */}
							<motion.p
								className="mt-8 text-sm text-muted-foreground"
								variants={fadeInUp}
								transition={{ duration: 0.6, delay: 0.4 }}
							>
								무료 이용 · 회원가입 불필요 · 매일 업데이트
							</motion.p>
						</motion.div>

						{/* Demo mockup - Map Preview */}
						<motion.div
							className="mt-20 relative"
							initial={{ opacity: 0, y: 50, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.5 }}
						>
							<div className="glass rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl shadow-primary/10 hover-lift">
								{/* Search bar mockup */}
								<motion.div
									className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 mb-6"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.8 }}
								>
									<Search className="w-5 h-5 text-muted-foreground" />
									<span className="text-muted-foreground">
										이태원 근처 할랄 음식점 검색...
									</span>
								</motion.div>

								{/* Restaurant cards */}
								<div className="space-y-3">
									<RestaurantPreviewCard
										name="마칸 할랄 코리안 BBQ"
										status="halal"
										distance="0.3 km"
										delay={1.0}
									/>
									<RestaurantPreviewCard
										name="이스탄불 케밥 하우스"
										status="muslim_friendly"
										distance="0.5 km"
										delay={1.2}
									/>
									<RestaurantPreviewCard
										name="서울 프레시 씨푸드"
										status="seafood"
										distance="0.8 km"
										delay={1.4}
									/>
								</div>
							</div>
						</motion.div>
					</main>
				</div>
			</div>

			{/* Features Section */}
			<section className="py-24 relative">
				<div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-sm" />
				<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-3xl sm:text-4xl font-bold mb-4">
							왜 할랄 코리아인가요?
						</h2>
						<p className="text-muted-foreground max-w-xl mx-auto text-lg">
							한국에서 여행하거나 거주하는 무슬림을 위한 가장 포괄적인 할랄
							음식점 가이드입니다.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-6 lg:gap-8">
						<FeatureCard
							icon={<MapPin className="w-6 h-6" />}
							title="위치 기반 검색"
							description="실시간 거리 계산과 지도 보기로 주변 음식점을 찾아보세요."
							delay={0}
						/>
						<FeatureCard
							icon={<Check className="w-6 h-6" />}
							title="검증된 정보"
							description="모든 음식점은 할랄 인증, 무슬림 친화, 해산물, 채식으로 분류됩니다."
							delay={0.1}
						/>
						<FeatureCard
							icon={<Search className="w-6 h-6" />}
							title="쉬운 필터링"
							description="카테고리별, 이름별, 거리별로 필터링하여 원하는 음식점을 찾으세요."
							delay={0.2}
						/>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-24 gradient-bg relative">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-3xl sm:text-4xl font-bold mb-4">
							카테고리별 탐색
						</h2>
					</motion.div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
						<CategoryCard
							icon={<Check className="w-6 h-6" />}
							title="할랄 인증"
							description="정식 할랄 인증을 받은 음식점"
							color="bg-green-600"
							delay={0}
						/>
						<CategoryCard
							icon={<Star className="w-6 h-6" />}
							title="무슬림 친화"
							description="무슬림 식단을 배려하는 음식점"
							color="bg-blue-600"
							delay={0.1}
						/>
						<CategoryCard
							icon={<Fish className="w-6 h-6" />}
							title="해산물"
							description="신선한 해산물 전문 음식점"
							color="bg-cyan-600"
							delay={0.2}
						/>
						<CategoryCard
							icon={<Leaf className="w-6 h-6" />}
							title="채식"
							description="식물성 식단 옵션 제공"
							color="bg-emerald-600"
							delay={0.3}
						/>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 relative">
				<div className="absolute inset-0 bg-white/60 dark:bg-black/30 backdrop-blur-sm" />
				<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<StatCard number="1,800+" label="음식점" delay={0} />
						<StatCard number="5" label="카테고리" delay={0.1} />
						<StatCard number="17" label="도시" delay={0.2} />
						<StatCard number="무료" label="영원히" delay={0.3} />
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 relative overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
				>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
				</motion.div>

				<div className="relative max-w-2xl mx-auto px-4 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<motion.div
							className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30"
							animate={{
								boxShadow: [
									"0 25px 50px oklch(0.55 0.22 255 / 0.3)",
									"0 25px 80px oklch(0.55 0.22 255 / 0.5)",
									"0 25px 50px oklch(0.55 0.22 255 / 0.3)",
								],
							}}
							transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
						>
							<Utensils className="w-10 h-10 text-white" />
						</motion.div>
						<h2 className="text-3xl sm:text-4xl font-bold mb-4">
							지금 바로 시작하세요
						</h2>
						<p className="text-muted-foreground mb-10 text-lg">
							계정이 필요 없습니다. 앱을 열고
							<br />
							한국에서 다음 할랄 식사를 찾아보세요.
						</p>
						<Button size="lg" asChild>
							<Link href="/explore">
								앱 열기
								<ArrowRight className="w-5 h-5" />
							</Link>
						</Button>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 border-t bg-white/30 dark:bg-black/20 backdrop-blur-sm">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
								<Utensils className="w-4 h-4 text-white" />
							</div>
							<span className="font-semibold">할랄 코리아</span>
						</div>
						<p className="text-sm text-muted-foreground">
							무슬림 커뮤니티를 위해 만들었습니다
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function RestaurantPreviewCard({
	name,
	status,
	distance,
	delay,
}: {
	name: string;
	status: string;
	distance: string;
	delay: number;
}) {
	const statusColors: Record<string, string> = {
		halal: "bg-green-600",
		muslim_friendly: "bg-blue-600",
		seafood: "bg-cyan-600",
	};

	const statusIcons: Record<string, React.ReactNode> = {
		halal: <Check className="w-3 h-3" />,
		muslim_friendly: <Star className="w-3 h-3" />,
		seafood: <Fish className="w-3 h-3" />,
	};

	return (
		<motion.div
			className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-border"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay }}
		>
			<div
				className={`w-10 h-10 rounded-full ${statusColors[status]} flex items-center justify-center text-white shrink-0`}
			>
				{statusIcons[status]}
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-medium text-sm truncate">{name}</p>
				<p className="text-xs text-muted-foreground">{distance} 거리</p>
			</div>
			<MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
		</motion.div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
	delay,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}) {
	return (
		<motion.div
			className="glass-card rounded-3xl p-8 text-center hover-lift cursor-default"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6, delay }}
			whileHover={{ y: -8 }}
		>
			<motion.div
				className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 text-white shadow-lg shadow-primary/25"
				whileHover={{ scale: 1.1, rotate: 5 }}
			>
				{icon}
			</motion.div>
			<h3 className="font-bold text-lg mb-3">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{description}
			</p>
		</motion.div>
	);
}

function CategoryCard({
	icon,
	title,
	description,
	color,
	delay,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	color: string;
	delay: number;
}) {
	return (
		<motion.div
			className="glass-card rounded-2xl p-6 hover-lift cursor-default"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay }}
			whileHover={{ y: -4, scale: 1.02 }}
		>
			<div
				className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 text-white`}
			>
				{icon}
			</div>
			<h3 className="font-bold mb-2">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{description}
			</p>
		</motion.div>
	);
}

function StatCard({
	number,
	label,
	delay,
}: {
	number: string;
	label: string;
	delay: number;
}) {
	return (
		<motion.div
			className="text-center"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay }}
		>
			<motion.div
				className="text-4xl font-bold text-foreground mb-2"
				initial={{ scale: 0.5 }}
				whileInView={{ scale: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
			>
				{number}
			</motion.div>
			<p className="text-muted-foreground">{label}</p>
		</motion.div>
	);
}
