import express, {Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from 'axios'
import cheerio from 'cheerio';
import { count } from "console";

dotenv.config();

interface Proxy {
    ip: string;
    port: number;
    protocol: string;
    country: string;
    lastChecked: string;
}


const main = async () => {
    const app = express();
    const PORT = process.env.PORT || 8088

    app.use(
        cors({
            origin: '*'
        })
    );

    app.get('/', async (req : Request, res : Response) =>{
        const url = 'https://scrapingant.com/free-proxies/'
        const page = await axios.get(url)
        const $ = cheerio.load(page.data);
        // go to chrome browser, Inspect Element > Copy > Copy selector
        const selector = 'body > main > div > div.elementor.elementor-216 > div > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-517b2e5.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div > div > div.elementor-element.elementor-element-9c72b31.elementor-widget.elementor-widget-shortcode > div > div > table > tbody > tr';
        const table = $(selector);
        const response: Proxy[] = []
        
        for(let i = 1; i< table.length; i++){
            const temp: string[] = []
            $("td", table[i]).each((_,element) => {
                temp.push($(element).text())
                console.log($(element).text())
            })
            let country = temp[3].split(/[ ,]+/)
            country.shift()

            response.push({
                ip: temp[0],
                port: parseInt(temp[1]),
                protocol: temp[2],
                country: country.join(" "),
                lastChecked: temp[4]
            })
        }
        res.json(response)
    });

    app.listen(PORT, () => {
        console.log(`server has started at port ${PORT}`);
    });
}

main();