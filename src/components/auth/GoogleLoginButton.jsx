import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@/_hooks/useAuth';
import toast from 'react-hot-toast';
import { useRef, useState } from 'react';

/**
 * Custom Google Login Button with Indonesian text
 * "Masuk dengan Google"
 * 
 * Features:
 * - Loading state to prevent multiple clicks
 * - Overlay during authentication process
 * - Custom Indonesian text with Google branding
 * 
 * @param {string} role - Optional role for registration (volunteer/organization)
 */
export default function GoogleLoginButton({ role = null }) {
	const googleLoginMutation = useGoogleLogin();
	const googleButtonRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleButtonClick = () => {
		if (isLoading) return; // Prevent double click

		setIsLoading(true);

		// Trigger hidden Google button
		const iframe = googleButtonRef.current?.querySelector('div[role="button"]');
		if (iframe) {
			iframe.click();
		} else {
			// Fallback: click any clickable element in the wrapper
			const clickable = googleButtonRef.current?.querySelector('[role="button"], button, a');
			clickable?.click();
		}

		// Reset loading if user closes popup without login
		setTimeout(() => {
			if (!googleLoginMutation.isPending) {
				setIsLoading(false);
			}
		}, 3000);
	};

	// Watch mutation status
	const isMutationLoading = googleLoginMutation.isPending;

	return (
		<div className="w-full relative">
			{/* Hidden Official Google Login (for OAuth flow) */}
			<div ref={googleButtonRef} className="hidden">
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						setIsLoading(true);
						googleLoginMutation.mutate(
							{
								credential: credentialResponse.credential,
								role
							},
							{
								onSettled: () => {
									// Reset loading after mutation completes (success or error)
									setIsLoading(false);
								}
							}
						);
					}}
					onError={() => {
						toast.error('Gagal login dengan Google');
						setIsLoading(false);
					}}
					auto_select={true}
					useOneTap={false}
					text="continue_with"
					shape="rectangular"
					theme="outline"
					size="large"
				/>
			</div>

			{/* Custom Styled Button (visible to user) */}
			<button
				onClick={handleButtonClick}
				type="button"
				disabled={isLoading || isMutationLoading}
				className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#dadce0] rounded-md hover:bg-[#f8f9fa] hover:border-[#d2e3fc] hover:shadow-sm active:bg-[#ecedee] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#dadce0]"
				style={{
					fontFamily: "'Roboto', sans-serif"
				}}
			>
				{/* Loading Spinner or Google Logo */}
				{isLoading || isMutationLoading ? (
					<div className="w-[18px] h-[18px] border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
				) : (
					/* Official Google "G" Logo */
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4" />
						<path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853" />
						<path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54756 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05" />
						<path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335" />
					</svg>
				)}

				{/* Indonesian Text with Roboto Medium */}
				<span
					className="text-[#3c4043]"
					style={{
						fontFamily: "'Roboto', sans-serif",
						fontWeight: 500,
						fontSize: '14px',
						lineHeight: '20px',
						letterSpacing: '0.25px'
					}}
				>
					{isLoading || isMutationLoading ? 'Memproses...' : 'Masuk dengan Google'}
				</span>
			</button>

			{/* Full-screen overlay during authentication */}
			{(isLoading || isMutationLoading) && (
				<div
					className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40 flex items-center justify-center"
					style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
				>
					<div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4">
						<div className="w-12 h-12 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
						<p className="text-gray-700 font-medium">Sedang masuk dengan Google...</p>
						<p className="text-sm text-gray-500">Jangan tutup halaman ini</p>
					</div>
				</div>
			)}
		</div>
	);
}
