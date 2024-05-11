import {WorkerEntrypoint} from 'cloudflare:workers';
import puppeteer from '../lib/esm/puppeteer/puppeteer-core.js';

// Worker
export default class extends WorkerEntrypoint {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async fetch(_request: Request) {
    const websocket: WebSocket | undefined = undefined;
    const BROWSERBASE_API_KEY = '';

    try {
      const wsUrl = `wss://connect.browserbase.com?apiKey=${BROWSERBASE_API_KEY}`;
      // const httpUrl = `https://connect.browserbase.com?apiKey=${this.env.BROWSERBASE_API_KEY}`
      // console.log(`Connecting to wsUrl: ${wsUrl}`)
      // const response = await fetch(httpUrl, {
      //   headers: {Upgrade: 'websocket'},
      // });
      // websocket = response.webSocket!
      // websocket.accept()
      //
      // console.log(websocket)
      // console.log(`websocket.url: ${websocket.url}`)
      // console.log(response)
      // websocket = new WebSocket(wsUrl);

      // await new Promise(resolve => setTimeout(resolve, 10000));

      // const browser = await puppeteer.connectWithWs(websocket);
      // const browser = await puppeteer.connectWithWsEndpoint(
      //       wsUrl
      // );
      // const browser = await puppeteer.connectWithWsEndpointFetch(
      //       wsUrl
      // );

      const browser = await puppeteer.connectNative({
        browserWSEndpoint: wsUrl,
      });
      browser.addListener('Disconnected', event => {
        console.log('Disconnected');
        console.log(event);
      });

      console.log('browser launched');
      const page = await browser.newPage();

      const clubReturnUrl = `https://www.chronogolf.com/club/woodmont-golf-country-club`;
      await page.goto(
        `https://www.chronogolf.com/login?returnUrl=${clubReturnUrl}`
      );

      await new Promise(resolve => {
        return setTimeout(resolve, 5000);
      });

      // await Promise.all([
      //     page.goto(`https://www.chronogolf.com/login?returnUrl=${clubReturnUrl}`),
      //     page.waitForNavigation({ waitUntil: 'networkidle2' }),
      // ])

      console.log(`Logging in`);

      const email = await page.waitForSelector('#sessionEmail');
      // await page.type('#sessionEmail', "Test")
      console.log(email);
      await page.screenshot();
      // write this to a file
      await browser.close();
      console.log('browser closed');

      return new Response('hi');
    } catch (e) {
      console.error(e);
      // console.log(websocket)
      return new Response('error');
    }
  }
}
