import express from 'express';
import cors from "cors";
import {GoogleGenerativeAI}  from "@google/generative-ai";
import 'dotenv/config';
import getVideoCaptions from 'youtube-captions';

const app = express();
 app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy',"default-src 'self'  http://localhost:3000/ ");
    next();
});
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
   



//https://www.youtube.com/watch?v=kqtD5dpn9C8&pp=ygUGcHl0aG9u
app.get('/',(req,res)=>{
   console.log("iam in get");
   res.send(" Dont Worry Iam Here");
  
   //http://localhost:3000/
});
app.post('/submit', async(req,res)=>{

    console.log(" iam in submit");

    const vi = req.body;
// console.log(vi.vi);

    try {
        console.log("going to get captions");
        
    const captions = await getVideoCaptions(vi.vi, { lang: 'en', plainText: true  });   
    console.log(captions);
                                     
    const prompt = `generate summary for the following text that is fetched from a youtube video and the response sould be in some approriate hrml paragram and headings for the users .the data is: ${captions}`;
    const result = await model.generateContent([prompt]);
    const data = result.response.text();
    let x= data.replace(/```/g,'');
    x = x.replace('html','');
    //console.log(x);
    const summary = JSON.stringify({summary : x})
    res.send(summary)
    } catch (error) {
     const x = "<h4> unable to get summary for this video Please try another video</h4>";
     const summary = JSON.stringify({summary : x})
     res.send(summary);
     console.error(error.message)
    }
    });

app.listen(3000,()=>{
    console.log('iam running in localhost:3000');
    
});