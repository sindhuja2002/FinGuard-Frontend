import { ToasterProvider } from "@/components/providers/toaster-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ToasterProvider />
    </>
  )
}