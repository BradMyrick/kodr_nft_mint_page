# NFT React Minting Template by Kodr.eth
## Live Site Demo: [https://horrormint.com](https://horrormint.com)
This is a NFT minting website project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This is a stripped down version of a quick mint site I use for clients. It's a simple web-app utilizing useWeb3ExecuteFunction to interact with a deployed Kodr721a evm smart-contract. It's a good starting point for anyone who wants to mint NFTs on for an evm chain using React.

## Getting Started

First, init and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


## Update the information in the .envExample file and rename it to .env to get started
    Moralis used for authentication
    you will need a deployment of the NFT contract you want to mint to
    if you modify the contract you will need to update the ABI in the abi folder

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
