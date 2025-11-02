export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='w-full h-[100svh] flex justify-center items-center bg-[var(--background-primary)]'>
			{children}
		</div>
	);
}
