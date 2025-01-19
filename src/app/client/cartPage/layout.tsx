export default function CartPageLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <section>{children}</section>
      </>
    )
  }