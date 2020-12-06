import { browser, by, element } from 'protractor';
import { Poi } from './poi';

export class ProtractorService {

    private SOCIAL_NETWORKS = ['twitter.com', 'instagram.com', 'ubereats.com', 'facebook.com'];
    private EXCLUDE = ['https://www.instagram.com/accounts/login/'];
    private TIMEOUT = 3000;

    private async navigateTo(url: string) {
        await browser.waitForAngularEnabled(false);
        return browser.get(url);
    }

    async process(poi: Poi) {
        const url = poi.tags.website;
        const links = await this.getSocialLinksFromTheWebsite(url);
        await browser.sleep(this.TIMEOUT);
        const betterLinks = await this.checkSocialLinks(links);
        await browser.sleep(this.TIMEOUT);
        poi.betterLinks = betterLinks;
        return poi;
    }

    private async getSocialLinksFromTheWebsite(url: string, includeIframes = true) {
        await this.navigateTo(url);
        await browser.sleep(this.TIMEOUT);
        const socials = new Map<string, string>();
        await this.getLinksInPage(url, socials);
        if (includeIframes) {
            await browser.sleep(this.TIMEOUT * 3);
            await element.all(by.css('iframe')).each(async (iframe, index) => {
                if (iframe && iframe.isPresent() && index !== undefined) {
                    try {
                        await browser.switchTo().frame(index); // index or iframe
                        // console.log(`success,  iframe with index: ${index} for url: ${url}`);
                    } catch (error) {
                        console.error(`error, no iframe with index: ${index} for url: ${url}`);
                    }
                    await browser.sleep(this.TIMEOUT);
                    await this.getLinksInPage(url, socials);
                }
            });
        }
        socials.forEach((u, key) => socials.set(key, u.replace('http://', 'https://')));
        return socials;
    }

    private async getLinksInPage(url: string, socials: Map<string, string>) {
        await element.all(by.css('a')).each(async (link) => {
            const href = await link?.getAttribute('href');
            if (href && href.startsWith('tel:')) {
                const phone = href.substring('tel:'.length);
                socials.set('phone', phone);
            }
            if (href) {
                // console.log(`in ${url} founded ${href}`);
                this.SOCIAL_NETWORKS.filter(n => href.indexOf(n) !== -1).forEach(n => socials.set(n, href));
            }
        });
        return socials;
    }

    private async checkSocialLinks(socials: Map<string, string>) {
        for (const [key, url] of socials) {
            if (url && url.length > 16) {
                await this.navigateTo(url);
                await browser.sleep(this.TIMEOUT * 2);
                const newUrl = await browser.driver.getCurrentUrl();
                if (!(this.EXCLUDE.includes(newUrl))) {
                    socials.set(key, newUrl);
                }
            }
        }
        return socials;
    }

    writeInFile(buffer: string) {
        const fs = require('fs');
        const logger = fs.createWriteStream('extract.csv', { flags: 'a' });
        logger.write(buffer);
        logger.end();
    }
}
