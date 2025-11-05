import GridShape from "@/components/common/GridShape";
import { useNavigate } from "react-router-dom";
import DynamicButton from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<>
			<div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
				<GridShape />
				<div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
					<h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
						ERROR
					</h1>

					<img src="/images/error/404.svg" alt="404" className="dark:hidden" />
					<img
						src="/images/error/404-dark.svg"
						alt="404"
						className="hidden dark:block"
					/>

					<p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
						We can’t seem to find the page you are looking for!
					</p>

					<DynamicButton
						size="lg"
						variant="success"
						onClick={() => navigate("/")}
						className="group">
						<ArrowLeft
							size={20}
							className="mr-2 group-hover:-translate-x-1 transition-transform"
						/>
						Kembali
					</DynamicButton>
				</div>
				{/* <!-- Footer --> */}
				<p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
					&copy; {new Date().getFullYear()} - RelaOne
				</p>
			</div>
		</>
	);
}
