import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Shield, FileText, Eye, AlertCircle, ArrowLeft } from "lucide-react";

import privacyPolicyMd from "@/assets/policies/privacy-policy.md?raw";
import termsConditionsMd from "@/assets/policies/terms-of-service.md?raw";

import { Link } from "react-router-dom";
/* ------------------------------------------------------------
 *  SHARED MARKDOWN COMPONENTS (EMERALD THEME)
 * ------------------------------------------------------------ */
const markdownComponents = {
	h1: ({ ...props }) => (
		<h1
			className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-emerald-600 flex items-center gap-3"
			{...props}
		/>
	),
	h2: ({ ...props }) => (
		<h2
			className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2 bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-600"
			{...props}
		/>
	),
	h3: ({ ...props }) => (
		<h3
			className="text-xl font-medium text-gray-700 mt-6 mb-3 bg-gray-50 p-2 rounded-md"
			{...props}
		/>
	),
	p: ({ ...props }) => (
		<p className="text-gray-700 mb-4 leading-relaxed text-base" {...props} />
	),

	ul: ({ ...props }) => (
		<ul className="ml-6 mb-6 space-y-3 bg-gray-50 p-4 rounded-lg" {...props} />
	),

	li: ({ ...props }) => (
		<li className="text-gray-700 relative flex items-start">
			<span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-4 shadow-sm flex-shrink-0"></span>
			<span className="flex-1" {...props} />
		</li>
	),

	strong: ({ ...props }) => (
		<strong
			className="font-semibold text-gray-900 bg-emerald-100 px-1 rounded"
			{...props}
		/>
	),

	ol: ({ ...props }) => (
		<ol
			className="ml-6 mb-6 space-y-3 list-decimal bg-gray-50 p-4 rounded-lg"
			{...props}
		/>
	),
};

/* ------------------------------------------------------------
 *  PRIVACY POLICY PAGE
 * ------------------------------------------------------------ */
export function PrivacyPolicyPage({ onNavigate }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm">
				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="flex items-center gap-4">
						<Link
							to="/"
							className="p-2 hover:bg-white/20 rounded-full transition-colors">
							<ArrowLeft className="w-6 h-6" />
						</Link>

						<div className="flex items-center gap-3">
							<div className="bg-white/20 p-3 rounded-full">
								<Shield className="w-8 h-8" />
							</div>
							<div>
								<h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
								<p className="text-emerald-100 text-base font-medium">
									RelaOne – Volunteer Activity Platform
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Body */}
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8">
						<ReactMarkdown components={markdownComponents}>
							{privacyPolicyMd}
						</ReactMarkdown>
					</div>

					{/* Footer */}
					<FooterUpdated onNavigate={onNavigate} />
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------
 *  TERMS OF SERVICE PAGE
 * ------------------------------------------------------------ */
export function TermsOfServicePage({ onNavigate }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm">
				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="flex items-center gap-4">
						<Link
							to="/"
							className="p-2 hover:bg-white/20 rounded-full transition-colors">
							<ArrowLeft className="w-6 h-6" />
						</Link>

						<div className="flex items-center gap-3">
							<div className="bg-white/20 p-3 rounded-full">
								<FileText className="w-8 h-8" />
							</div>
							<div>
								<h1 className="text-3xl font-bold">Syarat & Ketentuan</h1>
								<p className="text-emerald-100 text-base font-medium">
									RelaOne – Volunteer Activity Platform
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Body */}
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8">
						<ReactMarkdown components={markdownComponents}>
							{termsConditionsMd}
						</ReactMarkdown>
					</div>

					{/* Footer */}
					<FooterUpdated onNavigate={onNavigate} />
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------
 *  POLICY/TOS TAB PAGE (DUAL VIEW)
 * ------------------------------------------------------------ */
export default function PolicyTermsPage({ onNavigate }) {
	const [activeTab, setActiveTab] = useState("privacy");

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="flex items-center gap-4">
						<button
							onClick={() => onNavigate("home")}
							className="p-2 hover:bg-white/20 rounded-full transition-colors">
							<ArrowLeft className="w-6 h-6" />
						</button>

						<div className="flex items-center gap-3">
							<div className="bg-white/20 p-3 rounded-full">
								<Shield className="w-8 h-8" />
							</div>
							<div>
								<h1 className="text-3xl font-bold">
									{activeTab === "privacy"
										? "Kebijakan Privasi"
										: "Syarat & Ketentuan"}
								</h1>
								<p className="text-emerald-100 text-base font-medium">
									RelaOne – Volunteer Activity Platform
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="border-b bg-white rounded-t-xl shadow-sm">
					<div className="flex">
						<TabButton
							active={activeTab === "privacy"}
							onClick={() => setActiveTab("privacy")}
							icon={<Eye className="w-5 h-5" />}
							label="Kebijakan Privasi"
						/>

						<TabButton
							active={activeTab === "terms"}
							onClick={() => setActiveTab("terms")}
							icon={<FileText className="w-5 h-5" />}
							label="Syarat & Ketentuan"
						/>
					</div>
				</div>

				{/* Content */}
				<div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8">
						<ReactMarkdown components={markdownComponents}>
							{activeTab === "privacy" ? privacyPolicyMd : termsConditionsMd}
						</ReactMarkdown>
					</div>

					<FooterUpdated onNavigate={onNavigate} />
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------
 *  SHARED COMPONENTS
 * ------------------------------------------------------------ */

function FooterUpdated({ onNavigate }) {
	return (
		<div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 text-sm text-gray-600">
					<div className="bg-emerald-100 p-2 rounded-full">
						<AlertCircle className="w-4 h-4 text-emerald-700" />
					</div>
					<div>
						<p className="font-medium text-gray-700">Terakhir diperbarui</p>
						<p className="text-xs text-gray-500">November 2025</p>
					</div>
				</div>

				<Link
					to="/"
					className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg shadow-md hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg transition-all font-medium">
					Kembali ke Beranda
				</Link>
			</div>
		</div>
	);
}

function TabButton({ active, onClick, icon, label }) {
	return (
		<button
			onClick={onClick}
			className={`px-8 py-5 font-medium transition-all relative group ${
				active
					? "text-emerald-700 bg-white border-b-4 border-emerald-600 shadow-sm"
					: "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
			}`}>
			<div className="flex items-center gap-3">
				{icon} {label}
			</div>
		</button>
	);
}
