export default function UserProfileLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <section className="min-h-full">{children}</section>
      </>
    )
  }