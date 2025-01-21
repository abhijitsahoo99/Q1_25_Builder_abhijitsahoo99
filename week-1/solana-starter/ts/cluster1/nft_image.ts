import wallet from "./wallet/Turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import path from "path";
// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: "https://devnet.irys.xyz/" }));
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const filePath = path.join(process.cwd(), "cluster1", "generug.png");
    const img = await readFile(filePath);

    //2. Convert image to generic file.
    const file = createGenericFile(img, "rug.png", {
      contentType: "image/png",
    });

    //3. Upload image

    const [myUri] = await umi.uploader.upload([file]);
    console.log("Your image URI: ", myUri);

    //uri: https://arweave.net/6Jzw5wmajvZ5RXUy6ZnxmnSojVNynuYcU4ErY1So7n1t
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
