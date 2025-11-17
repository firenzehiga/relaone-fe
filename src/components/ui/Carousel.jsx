import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Avatar from "./Avatar";
import RatingStars from "./RatingStars";

const DEFAULT_ITEMS = [
	{
		nama: "User Anonymous",
		judul: "Event",
		komentar: "Keren Eventnya.",
		rating: 5,
		id: 1,
	},
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({
	items,
	baseWidth = 300,
	autoplay = false,
	autoplayDelay = 3000,
	pauseOnHover = false,
	loop = false,
	round = false,
}) {
	const containerPadding = 16;
	const itemWidth = baseWidth - containerPadding * 2;
	const trackItemOffset = itemWidth + GAP;

	// make sure `items` is an array (caller might pass objects or undefined)
	const safeItems = Array.isArray(items)
		? items
		: items
		? Object.values(items)
		: DEFAULT_ITEMS;
	const carouselItems = loop ? [...safeItems, safeItems[0]] : safeItems;
	const [currentIndex, setCurrentIndex] = useState(0);
	const x = useMotionValue(0);
	const [isHovered, setIsHovered] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const containerRef = useRef(null);
	useEffect(() => {
		if (pauseOnHover && containerRef.current) {
			const container = containerRef.current;
			const handleMouseEnter = () => setIsHovered(true);
			const handleMouseLeave = () => setIsHovered(false);
			container.addEventListener("mouseenter", handleMouseEnter);
			container.addEventListener("mouseleave", handleMouseLeave);
			return () => {
				container.removeEventListener("mouseenter", handleMouseEnter);
				container.removeEventListener("mouseleave", handleMouseLeave);
			};
		}
	}, [pauseOnHover]);

	useEffect(() => {
		if (autoplay && (!pauseOnHover || !isHovered)) {
			const timer = setInterval(() => {
				setCurrentIndex((prev) => {
					if (prev === safeItems.length - 1 && loop) {
						return prev + 1;
					}
					if (prev === carouselItems.length - 1) {
						return loop ? 0 : prev;
					}
					return prev + 1;
				});
			}, autoplayDelay);
			return () => clearInterval(timer);
		}
	}, [
		autoplay,
		autoplayDelay,
		isHovered,
		loop,
		safeItems.length,
		carouselItems.length,
		pauseOnHover,
	]);

	const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

	const handleAnimationComplete = () => {
		if (loop && currentIndex === carouselItems.length - 1) {
			setIsResetting(true);
			x.set(0);
			setCurrentIndex(0);
			setTimeout(() => setIsResetting(false), 50);
		}
	};

	const handleDragEnd = (_, info) => {
		const offset = info.offset.x;
		const velocity = info.velocity.x;
		let nextIndex = currentIndex;

		if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
			// user swiped left -> go to next
			if (loop && currentIndex === safeItems.length - 1) {
				nextIndex = currentIndex + 1;
			} else {
				nextIndex = Math.min(currentIndex + 1, carouselItems.length - 1);
			}
		} else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
			// user swiped right -> go to previous
			if (loop && currentIndex === 0) {
				nextIndex = safeItems.length - 1;
			} else {
				nextIndex = Math.max(currentIndex - 1, 0);
			}
		}

		// clamp defensively
		nextIndex = Math.max(0, Math.min(nextIndex, carouselItems.length - 1));
		if (nextIndex !== currentIndex) setCurrentIndex(nextIndex);
	};

	// Always provide drag constraints so the user can't pull the track beyond available items.
	const dragProps = {
		dragConstraints: {
			left: -trackItemOffset * (carouselItems.length - 1),
			right: 0,
		},
	};

	return (
		<div
			ref={containerRef}
			className={`relative overflow-hidden p-4 mx-auto ${
				round
					? "rounded-full border border-white"
					: "rounded-[24px] border border-emerald-700"
			}`}
			style={{
				width: `${baseWidth}px`,
				...(round && { height: `${baseWidth}px` }),
			}}>
			<motion.div
				className="flex"
				drag="x"
				{...dragProps}
				style={{
					gap: `${GAP}px`,
					perspective: 1000,
					perspectiveOrigin: `${
						currentIndex * trackItemOffset + itemWidth / 2
					}px 50%`,
					x,
				}}
				onDragEnd={handleDragEnd}
				animate={{ x: -(currentIndex * trackItemOffset) }}
				transition={effectiveTransition}
				onAnimationComplete={handleAnimationComplete}>
				{carouselItems.map((item, index) => {
					const range = [
						-(index + 1) * trackItemOffset,
						-index * trackItemOffset,
						-(index - 1) * trackItemOffset,
					];
					const outputRange = [90, 0, -90];
					// eslint-disable-next-line react-hooks/rules-of-hooks
					const rotateY = useTransform(x, range, outputRange, { clamp: false });
					return (
						<motion.div
							key={index}
							className={`relative shrink-0 flex flex-col ${
								round
									? "items-center justify-center text-center bg-emerald-100 border-0"
									: "items-start justify-between bg-emerald-100 border border-emerald-700 rounded-[12px]"
							} overflow-hidden cursor-grab active:cursor-grabbing`}
							style={{
								width: itemWidth,
								height: round ? itemWidth : "100%",
								rotateY: rotateY,
								...(round && { borderRadius: "50%" }),
							}}
							transition={effectiveTransition}>
							<div
								className={`${
									round ? "p-0 m-0" : "mb-1 p-5"
								} flex items-center gap-4 `}>
								<Avatar size="md" fallback={item.nama} />
								<span className="text-lg font-bold">{item.nama}</span>
							</div>
							<div className="px-5">
								<RatingStars
									rating={item.rating}
									maxRating={5}
									size="xl"
									interactive={true}
									showNumber={false}
								/>
							</div>

							<div className="p-5">
								<div className="mb-1 font-black text-lg text-black">
									{item.judul}
								</div>
								<p className="text-sm text-black">{item.komentar}</p>
							</div>
						</motion.div>
					);
				})}
			</motion.div>
			<div
				className={`flex w-full justify-center ${
					round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
				}`}>
				<div className="mt-4 flex w-[110px] justify-between px-8">
					{safeItems.map((_, index) => (
						<motion.div
							key={index}
							className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
								currentIndex % safeItems.length === index
									? round
										? "bg-white"
										: "bg-emerald-600"
									: round
									? "bg-[#555]"
									: "bg-[rgba(51,51,51,0.4)]"
							}`}
							animate={{
								scale: currentIndex % safeItems.length === index ? 1.2 : 1,
							}}
							onClick={() => setCurrentIndex(index)}
							transition={{ duration: 0.15 }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
