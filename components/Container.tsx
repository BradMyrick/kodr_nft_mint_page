type Props = {
  children: React.ReactNode;
};

export function Container({ children }: Props) {
  return <div className="container mx-auto px-4">{children}</div>;
}
export function MobileContainer({ children }: Props) {
  return <div className="MobileContainer mx-auto px-4">{children}</div>;
}