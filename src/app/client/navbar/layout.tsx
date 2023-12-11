import UserProductsContextPage from "../context/userProducts/page";

export default function NavbarLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        {/* <UserTypeContextPage> */}
        <UserProductsContextPage>
          <section>{children}</section>
        </UserProductsContextPage>
        {/* </UserTypeContextPage> */}
      </>
    )
  }