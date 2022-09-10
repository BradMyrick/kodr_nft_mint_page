import { useCallback, useEffect, useState, } from 'react';
import contractConfig from '../config/contract-config.json';
import { utils, BigNumber, ContractTransaction } from 'ethers';
import ABI from '../config/abi.json';
import { useNotification, Icon, Loading } from 'web3uikit';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { checkChainIdIncluded } from '../utils/chain';
import type {
  IPosition,
  notifyType,
} from '@web3uikit/core/dist/lib/Notification/types';
import type { TIconType } from '@web3uikit/icons/dist/lib/';
import React from 'react';
import { Countdown, MobileCountdown } from './Countdown';
import { isMobile } from "react-device-detect";
type CustomErrors = {
  [key: string]: string;
};

export default function Mint() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { saleType, gasToken, customErrors } = contractConfig;
  const contractAddress = contractConfig.contractAddress;
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const isChainIdIncluded = checkChainIdIncluded(chainIdHex);
  const [saleState, setSaleState] = useState(0);
  const [mintPrice, setMintPrice] = useState(BigNumber.from(0));
  const [maxMintAmountPerTx, setMaxMintAmountPerWallet] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const [mintAmount, setMintAmount] = useState(1);

  const dispatch = useNotification();

  // publicMint() function
  const {
    fetch: publicMint,
    isFetching: isFetchingPM,
    isLoading: isLoadingPM,
  } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'mint',
    params: {
      amount: mintAmount,
    },
    msgValue: utils
      .parseEther(saleType.publicSale.mintPrice)
      .mul(mintAmount)
      .toString(),
  });

  const { fetch: getSaleState } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'saleState',
  });

  const { fetch: getMintPrice } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'mintPrice',
  });

  const { fetch: getMaxMintAmountPerWallet } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'maxMints',

  });

  const { fetch: getTotalSupply } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'totalSupply',
  });

  const { fetch: getMaxSupply } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'maxSupply',
  });

  const updateUiValues = useCallback(async () => {
    const saleStateFromCall = (await getSaleState()) as number;
    const mintPriceFromCall = (await getMintPrice()) as BigNumber;
    const maxSupplyFromCall = (await getMaxSupply()) as BigNumber;
    const maxMintAmountPerWallet =
      (await getMaxMintAmountPerWallet()) as BigNumber;
    const totalSupplyFromCall = (await getTotalSupply()) as BigNumber;
    setSaleState(saleStateFromCall);
    setMintPrice(mintPriceFromCall);
    setMaxSupply(maxSupplyFromCall.toNumber());
    setMaxMintAmountPerWallet(maxMintAmountPerWallet.toNumber());
    setTotalSupply(totalSupplyFromCall.toNumber());
  }, [getMaxMintAmountPerWallet, getMintPrice, getSaleState, getTotalSupply]);

  useEffect(() => {
    if (isWeb3Enabled && isChainIdIncluded) {
      updateUiValues();

      // cleanup
      return () => {
        setSaleState(0);
        setMintPrice(BigNumber.from(0));
        setMaxMintAmountPerWallet(0);
        setTotalSupply(0);
      };
    }
  }, [isChainIdIncluded, isWeb3Enabled, updateUiValues]);

  function decrementMintAmount() {
    setMintAmount(Math.max(1, mintAmount - 1));
  }

  function incrementMintAmount() {
    setMintAmount(Math.min(maxMintAmountPerTx, mintAmount + 1));
  }

  function handleNotification(
    type: notifyType,
    message?: string,
    title?: string,
    icon?: TIconType,
    position?: IPosition
  ) {
    dispatch({
      type,
      message,
      title,
      position: position || 'bottomR',
    });
  }

  async function handleOnSuccess(tx: ContractTransaction) {
    await tx.wait(1);
    updateUiValues();
    setIsSuccess(true);
    handleNotification(
      'success',
      'Successfully minted!',
      'Transaction Notification',

    );
  }

  function handleErrorMessage(error: Error) {
    const errNames = Object.keys(customErrors);
    const filtered = errNames.filter((errName) =>
      error.message.includes(errName)
    );
    return filtered[0] in customErrors
      ? (customErrors as CustomErrors)[filtered[0]]
      : error.message;
  }

  function handleOnError(error: Error) {
    handleNotification(
      'error',
      handleErrorMessage(error),
      'Transaction Notification'
    );
  }

  async function mint() {
    if (saleState === 0) return;
    if (saleState === 1) {
      await publicMint({
        onSuccess: async (tx) =>
          await handleOnSuccess(tx as ContractTransaction),
        onError: (error) => handleOnError(error),
      });
    }
  }
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
      <div className="mint w-max mx-auto">
        <h2 className="minttext"><strong>Mint</strong></h2>
        {isSuccess ? (
          <div className="border-8 rounded-3xl border-r-gray-300 border-t-gray-300 border-l-gray-300 border-b-gray-300 bg-black p-8">
            <div className="textbox">
              Success! view on <a className='openlink text-red-800' href={`https://opensea.io/collection/kushlion-drip`}>Opensea</a>
            </div> </div>) : (
          <div className="border-8 rounded-3xl border-r-gray-300 border-t-gray-300 border-l-gray-300 border-b-gray-300 bg-black p-8">
            <div className="flex justify-center border-b border-gray-700 pb-8">
              <div className="space-y-1 justify-items-center">
                <div className="text-xl sm:text-2xl">
                  {saleState === 0 &&
                    <div className="wrapper">
                      <MobileCountdown date={"September 11 2022 20:00 UTC-4"} />
                      <div className="textdate font-din">Minting Starts Sept 11 @  5pm PT / 8pm ET</div>
                    </div>
                  }
                  {saleState === 1 &&
                    <div className="wrapper">
                      <MobileCountdown date={"October 01 2022 20:00 UTC-4"} />
                      <div className="textdate font-din">Reaveal Oct 1 @  5pm PT / 8pm ET</div>
                    </div>}
                </div>
              </div>
              <div className="mt-8">

              </div>
            </div>
            {saleState === 0 ? (
              <div className="mt-8">
                <Icon fill="darkgray" size={84} svg="lockClosed" />
              </div>
            ) : (
              <div className="pt-8 space-y-4">
                <span className="text-2xl sm:text-3xl font-bold">
                  {totalSupply} / {maxSupply}
                </span>
                <span className="text-sm sm:text-base"> Minted</span>
                <div className="flex justify-center items-center space-x-8">
                  <button
                    type="button"
                    className={`rounded-full p-2 ${mintAmount <= 1 ? 'bg-white cursor-default' : 'bg-gray-600'
                      }`}
                    onClick={decrementMintAmount}
                  >
                    <Icon fill="darkgray" svg="minus" />
                  </button>

                  <span className="text-xl">{mintAmount}</span>

                  <button
                    type="button"
                    className={`rounded-full p-2 ${mintAmount >= maxMintAmountPerTx
                      ? 'bg-gray-800 cursor-default'
                      : 'bg-gray-600'
                      }`}
                    onClick={incrementMintAmount}
                  >
                    <Icon fill="#fff" svg="plus" />
                  </button>
                </div>

                <div className="text-center text-lg">
                  <span className="text-gray-400">Total Price:</span>{' '}
                  {utils.formatEther(mintPrice.mul(mintAmount))} {gasToken}
                </div>

                <div>
                  {isFetchingPM || isLoadingPM ? (
                    <button
                      type="button"
                      className="flex justify-center rounded px-4 py-2 w-full bg-blue-800 cursor-not-allowed"
                      disabled
                    >
                      <Loading size={24} spinnerColor="#fff" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`rounded font-pagenue px-4 py-2 font-bold w-full ${!isWeb3Enabled || !isChainIdIncluded
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-700 hover:bg-blue-600'
                        }`}
                      disabled={!isWeb3Enabled || !isChainIdIncluded}
                      onClick={mint}
                    >
                      Mint
                    </button>
                  )}
                </div>
              </div>
            )}
            {!isWeb3Enabled && (
              <div className="text-red-500 text-center mt-4 font-pagenue">
                Not connected to your wallet!
              </div>
            )}
            {isWeb3Enabled && !isChainIdIncluded && (
              <div className="text-red-500 text-center mt-4 font-pagenue">
                Switch to {process.env.NEXT_PUBLIC_NETWORK_NAME}
              </div>
            )}
            {isWeb3Enabled && isChainIdIncluded && saleState === 0 && (
              <div className="text-red-500 text-center mt-4 font-pagenue">
                Sales are closed now.
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="mint w-1/3 mx-auto">
        <h2 className="minttext"><strong>Mint</strong></h2>
        {isSuccess ? (
          <div className="border-8 rounded-3xl border-r-gray-300 border-t-gray-300 border-l-gray-300 border-b-gray-300 bg-black p-8">
            <div className="textbox">
              Success! view on <a className='openlink text-red-800' href={`https://opensea.io/collection/kushlion-drip`}>Opensea</a>
            </div> </div>) : (
          <div className="border-8 rounded-3xl border-r-gray-300 border-t-gray-300 border-l-gray-300 border-b-gray-300 bg-black p-8">
            <div className="flex justify-center border-b border-gray-700 pb-8">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl">
                  {saleState === 0 &&
                    <div className="wrapper">
                      <Countdown date={"September 11 2022 20:00 UTC-4"} />
                      <div className="textdate font-din">Minting Starts Sept 11 @  5pm PT / 8pm ET</div>
                    </div>
                  }
                  {saleState === 1 &&
                    <div className="wrapper">
                      <Countdown date={"October 01 2022 20:00 UTC-4"} />
                      <div className="textdate font-din">Reaveal Oct 1 @  5pm PT / 8pm ET</div>
                    </div>}
                </div>
              </div>
              <div className="mt-8">

              </div>
            </div>
            {saleState === 0 ? (
              <div className="mt-8">
                <Icon fill="darkgray" size={84} svg="lockClosed" />
              </div>
            ) : (
              <div className="pt-8 space-y-4">
                <span className="text-2xl sm:text-3xl font-bold">
                  {totalSupply} / {maxSupply}
                </span>
                <span className="text-sm sm:text-base"> Minted</span>
                <div className="flex justify-center items-center space-x-8">
                  <button
                    type="button"
                    className={`rounded-full p-2 ${mintAmount <= 1 ? 'bg-white cursor-default' : 'bg-gray-600'
                      }`}
                    onClick={decrementMintAmount}
                  >
                    <Icon fill="darkgray" svg="minus" />
                  </button>

                  <span className="text-xl">{mintAmount}</span>

                  <button
                    type="button"
                    className={`rounded-full p-2 ${mintAmount >= maxMintAmountPerTx
                      ? 'bg-gray-800 cursor-default'
                      : 'bg-gray-600'
                      }`}
                    onClick={incrementMintAmount}
                  >
                    <Icon fill="#fff" svg="plus" />
                  </button>
                </div>

                <div className="text-center text-lg">
                  <span className="text-gray-400">Total Price:</span>{' '}
                  {utils.formatEther(mintPrice.mul(mintAmount))} {gasToken}
                </div>

                <div>
                  {isFetchingPM || isLoadingPM ? (
                    <button
                      type="button"
                      className="flex justify-center rounded px-4 py-2 w-full bg-blue-800 cursor-not-allowed"
                      disabled
                    >
                      <Loading size={24} spinnerColor="#fff" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`rounded font-pagenue px-4 py-2 font-bold w-full ${!isWeb3Enabled || !isChainIdIncluded
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-700 hover:bg-blue-600'
                        }`}
                      disabled={!isWeb3Enabled || !isChainIdIncluded}
                      onClick={mint}
                    >
                      Mint
                    </button>
                  )}
                </div>
              </div>
            )}
            {!isWeb3Enabled && (
              <div className="text-red-500 text-center mt-4 font-pagenue">
                Not connected to your wallet!
              </div>
            )}
            {isWeb3Enabled && !isChainIdIncluded && (
              <div className="text-red-500 text-center mt-4 font-pagenue">
                Switch to {process.env.NEXT_PUBLIC_NETWORK_NAME}
              </div>
            )}
            {isWeb3Enabled && isChainIdIncluded && saleState === 0 && (
              <div className="text-red-500 text-center mt-4 font-pagenue">
                Sales are closed now.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}