import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";
import { lazy } from "react";
const AboutSection = lazy(() => import("@/components/about/AboutSection"));
const GallerySection = lazy(() => import("@/components/about/GallerySection"));
const TestimonialSection = lazy(() => import("@/components/about/TestimonialSection"));

export default function AboutPage() {
	useDocumentTitle("Tentang RelaOne");
	const navigate = useNavigate();

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<AboutSection navigate={navigate} />
				<GallerySection />
				<TestimonialSection />
			</div>
		</div>
	);
}
