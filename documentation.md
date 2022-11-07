# NFT Marketplace

## Create NFT

### 15/06/2022

to create NFTs a form needs to be filled out to provide NFT details, after which an image and metadata need to be uploaded to ipfs and finally a sales order needs to be generated which needs to be signed through metamask and stored on a database.

To create the form, formik was used with Material UI input components for everything except the image file which needed to be uploaded to ipfs before being stored. This also allows for a preview of the image to be shown before the submit button is clicked

```javascript
const formik = useFormik({
  initialValues: {
    name: "",
    description: "",
    price: 0,
    category: "",
    collection: "",
    image: "",
  },
  onSubmit: async (values) => {
    const withIpfs = { ...values, image: props.ipfsImage };
    //console.log(withIpfs);
    try {
      const result = await client.add(
        JSON.stringify({
          name: withIpfs.name,
          description: withIpfs.description,
          category: withIpfs.category,
          collection: withIpfs.collection,
          image: withIpfs.image,
        })
      );
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
      const nftData: NFT = {
        ...props.salesOrder.nftData,
        tokenID: 0,
        uri: uri,
        price: withIpfs.price,
        category: withIpfs.category,
        collection: withIpfs.collection,
      };
      props.setSalesOrder({
        nftData: nftData,
        signature: "",
        sold: false,
        name: withIpfs.name,
        description: withIpfs.description,
      });
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  },
});
```

For the ipfs upload, an infura http client was used to add the file and the metadata.

```javascript
const uploadToIPFS = async (event: SyntheticEvent) => {
    event.preventDefault();
    const file = (event.target as HTMLFormElement).files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        //console.log(result);
        props.setIpfsImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.table("ipfs image upload error: ", error);
      }
    }
  };
```

After all fields are entered, a confirmation modal confirms the details after which wagmi was used to call the signtypeddata method which allows for a signature to be generated through metamask.

```javascript
const { data, isError, isLoading, isSuccess, signTypedData } = useSignTypedData(
  {
    domain,
    types,
    value,
  }
);
```

### 16/06/2022

Got the general functionality working for creating sales orders and then lazy minting from them. This included deploying the marketplace and nft contracts to rinkeby through hardhat.

To deploy, I used hardhat after trying remix. Remix didnt work because the abi it generates doesnt expose the methods of parent contracts. I had to create an infura project and deploy from a test account.

```javascript
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/b0dec0c51dbd4223bcbbbe2fae3ac4da", //Infura url with projectId
      accounts: [
        "1b27212c394ac361744e355fa5245217a5bffa90a80abeeb239ac7aee88770ba",
      ], // add the account that will deploy the contract (private key)
    },
  },
};
```

To connect smart contracts and to get the metamask signer wagmi hooks were used. I saved the contract addresses and abis to a separate folder to make it easier to redeploy contracts without changing the frontend code or hardcoding anything.

```javascript
const { data: signer, isError, isLoading } = useSigner();
const nftCollection1_ = useContract({
  addressOrName: NFTCollection1Address.address,
  contractInterface: NFTCollection1Abi.abi,
  signerOrProvider: signer,
});
```

I then refactored the code in the explore and view pages so that they would accept SalesOrder objects rather than the NFTData objects i was using to mock up the ui. Finally i fixed a bug in the marketplace contract which prevented signatures from being properlly verified and tested the lazy minting process from creation to minting which worked
