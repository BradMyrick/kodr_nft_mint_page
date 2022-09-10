import React from 'react';
import { ConnectButton } from 'web3uikit';
import { useMediaQuery } from 'react-responsive'


export default function Header() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  if (isMobile) {
    return (
      <div className="sticky top-4 h-auto bg-transparent z-10">
        <nav className="relative w-90% justify-center">
          <div className="centerbutton">
            <ConnectButton />
          </div>
        </nav>
      </div>
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
