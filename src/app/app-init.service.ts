import { Injectable } from '@angular/core';

@Injectable()
export class AppInitService {

    constructor() { }

    Init() {
        console.log('Resolve Initiated');
        return new Promise<void>((resolve, reject) => {
            const slickSrc = 'https://diesdas.codersunlimited.de/diesdas/assets/slick/slick.js';
            let isLoaded = false;
            let scripts: any = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute('src') == slickSrc) isLoaded = true;
            }
            if (isLoaded) return;
            let slickNode = document.createElement('script');
            slickNode.src = slickSrc;
            slickNode.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(slickNode);

            setTimeout(() => {
                console.log('Resolve Completed');
                resolve();
            }, 1000);
        });
    }

}
