import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {executeTx, getAddress, getBalance } from '.';

const PORT = process.env.PORT || 3000
const app = express();

app.use(bodyParser.json())

const corsOptions = {
    origin: 'localhost',
};
  
app.use(cors(corsOptions));

app.post('/transaction', async (req: any, res: any) => {
    try{
        const tx = await executeTx(
                            req.body.sequenceWallet, 
                            req.body.proof, 
                        )
        res.send({tx: tx.transactionHash, status: 200})
    }catch(e){
        res.send({msg: e, status: 500})
    }
})

app.listen(PORT, async () => {
    
    console.log(`listening on port: ${PORT}`)
    console.log(`relaying from this sequence wallet: ${await getAddress()}`)
    
    const balance = await getBalance();
    
    if(Number(balance) == 0)
        console.log(`please top up with the native token, your current balance is ${balance}`)

})