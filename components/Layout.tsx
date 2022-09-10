import Footer from './Footer';
import Header from './Header';
import Meta from './Meta';

type Props = {
  children: React.ReactNode;
  pageTitle?: string;
};

export default function Layout({ children, pageTitle }: Props) {
  return (
    <>
      <Meta pageTitle={pageTitle} />
      <Header />
      <main className="w-auto justify-center">{children}</main>
      <Footer />
    </>
  );
}
