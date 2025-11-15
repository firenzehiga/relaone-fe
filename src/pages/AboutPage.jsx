import { useFeedbacks } from "@/_hooks/useFeedbacks";
import DynamicButton from "@/components/ui/Button";
import RatingStars from "@/components/ui/RatingStars";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
    const { data: feedbacks = [], isLoading: feedbacksLoading } = useFeedbacks();
    const navigate = useNavigate();

    const featuredFeedbacks = feedbacks?.filter(
        (feedback) => feedback.rating === 4 || feedback.rating === 5
    ).slice(0, 3) || [];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (featuredFeedbacks.length === 0) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % featuredFeedbacks.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredFeedbacks]);

    return (
        <div className="page-transition min-h-screen py-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-4">
                        Tentang RelaOne
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Menghubungkan orang dengan kegiatan sosial yang bermakna
                    </p>
                </div>

                {/* Card Area */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">

                        {/* Logo / Visual */}
                        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                            <div className="flex flex-col items-center">
                                <img
                                    src="/images/logo_fe.png"
                                    alt="RelaOne Logo"
                                    className="w-1/3 mb-5 mx-auto lg:w-1/2 transition-transform duration-300 hover:scale-105"
                                />
                                <div className="text-5xl font-bold bg-black bg-clip-text text-transparent">
                                    Rela
                                    <span className="text-5xl font-bold bg-emerald-600 bg-clip-text text-transparent">
                                        O
                                    </span>
                                    ne.
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="w-full lg:w-1/2 px-2 lg:px-6">
                            <h5 className="text-gray-500 text-sm mb-2">About RelaOne</h5>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                                Connecting People with <br className="hidden md:inline" />Social Purpose
                            </h2>

                            <p className="text-gray-600 leading-relaxed text-justify mb-4">
                                RelaOne Volunteer adalah platform yang dirancang untuk mempermudah organisasi dan relawan
                                berkolaborasi pada kegiatan sosial. Dengan sistem terpusat, organisasi dapat mempublikasikan event
                                dan mengelola peserta, sementara relawan dapat menemukan kegiatan yang sesuai dan mendaftar dengan mudah.
                            </p>

                            <p className="text-gray-600 leading-relaxed text-justify mb-4">
                                Kami berfokus pada aksesibilitas, transparansi, dan efisiensi agar partisipasi sosial menjadi lebih
                                mudah dan berdampak. Setiap kontribusi, sekecil apa pun, dapat membawa perubahan bagi komunitas.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <DynamicButton
                                    variant="success"
                                    onClick={() => navigate("/events")}>
                                    Jelajahi Event
                                </DynamicButton>
                                <DynamicButton
                                    variant="outline"
                                    onClick={() => navigate("/organizations")}>
                                    Lihat Organisasi
                                </DynamicButton>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Testimonial Carousel */}
                <div className="mt-10 relative w-full overflow-hidden py-4">
                    <h3 className="text-3xl font-bold text-gray-900 mb-5 text-center">
                        Pengalaman Mereka Mengikuti Event Di Rela
                        <span className="text-3xl font-bold text-emerald-600">
                            O
                        </span>
                        ne
                    </h3>

                    {/* Loading state */}
                    {feedbacksLoading && (
                        <p className="text-center text-gray-500 italic">Memuat testimoni...</p>
                    )}

                    {/* Carousel Content */}
                    {!feedbacksLoading && featuredFeedbacks.length > 0 && (
                        <div
                            className="flex transition-transform duration-700"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {featuredFeedbacks.map((feedback, i) => (
                                <div key={i} className="w-full flex-shrink-0 px-6">
                                    <div className="bg-emerald-50 p-6 rounded-xl shadow-md max-w-xl mx-auto">
                                        <div className="flex justify-center items-center mb-2">
                                            <RatingStars
                                                rating={feedback.rating}
                                                maxRating={5}
                                                size="xl"
                                                interactive={false}
                                            />
                                        </div>
                                        <p className="text-gray-700 italic text-center mb-3">
                                            "{feedback.komentar}"
                                        </p>
                                        <div className="text-gray-900 font-semibold text-center">
                                            - {feedback.user?.nama}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dots Indicator */}
                    {!feedbacksLoading && featuredFeedbacks.length > 0 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            {featuredFeedbacks.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        current === idx
                                            ? "bg-emerald-600 scale-110"
                                            : "bg-gray-300"
                                    }`}
                                    onClick={() => setCurrent(idx)}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}
