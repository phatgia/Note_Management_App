import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

// export default function AuthLayout({
//     title = '',
//     description = '',
//     children,
// }: {
//     title?: string;
//     description?: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <AuthLayoutTemplate title={title} description={description}>
//             {children}
//         </AuthLayoutTemplate>
//     );
// }

export default function AuthLayout({ children, ...props }: any) {
    return (
        <div className="w-full min-h-screen m-0 p-0">
            {children}
        </div>
    );
}
