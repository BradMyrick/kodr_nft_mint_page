import Container from './Container';
import { Icon } from 'web3uikit';
import { parseChainId, getContractAddress } from '../utils/chain';
import { useMoralis } from 'react-moralis';
import contractConfig from '../config/contract-config.json';



const getCurrentYear = () => new Date().getFullYear();

export default function Footer() {
  const  nftName  = contractConfig.nftName;
  const  marketLink  = contractConfig.marketLink;
  const { chainId: chainIdHex } = useMoralis();


  const contractAddress = getContractAddress(chainIdHex);

  return (
    <footer className="border-t bg-black">
      <Container>
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center py-16">
          <div className="flex items-center space-x-2 mb-8 sm:mb-0">
            <a
              href={marketLink}
              aria-label={`${nftName} on OpenSea`}
              rel="noopener noreferrer"
              target="_blank"
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
            >
              <Icon fill="#fff" svg="cart" />
            </a>

            <a
              href={process.env.NEXT_PUBLIC_TWITTER_URL}
              aria-label={`${nftName} on Twitter`}
              rel="noopener noreferrer"
              target="_blank"
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
            >
              <Icon fill="#fff" svg="twitter" />
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}${
                parseChainId(chainIdHex) !==
                process.env.NEXT_PUBLIC_CHAIN_ID!.split(',')[1]
                  ? `/address/${contractAddress}`
                  : '/'
              }`}
              aria-label={`Contract of ${nftName}`}
              rel="noopener noreferrer"
              target="_blank"
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
            >
              <Icon fill="#fff" svg="eth" />
            </a>
          </div>
        </div>
        <div className="flex justify-end">
            © {getCurrentYear()} {"Kodr.eth"}
        </div>
      </Container>
    </footer>
  );
}
