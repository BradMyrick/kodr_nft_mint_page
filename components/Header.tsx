import React from 'react';
import { ConnectButton } from 'web3uikit';
import { isMobile } from "react-device-detect";


export default function Header() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  if (isMobile) {
    return (
      <nav className="mobileNav w-screen text-center">
        <div className="center_button">
          <ConnectButton />
        </div>
      </nav>
    )
  } else {

    return (
      <div className="sticky top-0 h-28 bg-bgBanner bg-fit z-10">
        <nav className="relative w-90% justify-center">
          <div className="rightSideButton">
            <ConnectButton />
          </div>
        </nav>
      </div>
    );

  }
}
