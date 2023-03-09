import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {


  constructor(
    private title: Title, 
    private meta: Meta
    ) { }

  setSEO(title: string, description: string, URL: string, image :string, keywords: string){
    this.updateTitle(title);
    this.updateOgImage(image);
    this.updateDescription(description);
    this.updateKeywords(keywords);
    this.updateOgUrl(URL);
  }

  updateTitle(title: string) {
    this.title.setTitle(title)
    this.meta.updateTag({ property: 'og:title', content: title })
    this.meta.updateTag({ name: 'og:title', content: title })
    this.meta.updateTag({ name: 'twitter:title', content: title })
    //let bodyX = <HTMLDivElement> document.getElementById("title");
    //try{bodyX.innerText = title;}catch(e){console.error("error: " + e);}
  }
  updateOgUrl(url: string) {
    this.meta.updateTag({ name: 'og:url', content: url })
    this.meta.updateTag({ property: 'og:url', content: url })
  }
  updateDescription(desc: string) {
    this.meta.updateTag({ property: 'og:description', content: desc })
    this.meta.updateTag({ name: 'og:description', content: desc })
    this.meta.updateTag({ name: 'twitter:description', content: desc })
    //let bodyX = <HTMLDivElement> document.getElementById("about");
    //try{bodyX.innerText = desc;}catch(e){console.error("error: " + e);}
  }
  updateOgImage(image: string) {
    this.meta.updateTag({ property: 'og:image', content: image })
    this.meta.updateTag({ name: 'og:image', content: image })
    this.meta.updateTag({ name: 'twitter:image', content: image })
    //let bodyX = <HTMLImageElement> document.getElementById("avatar");
    //try{bodyX.src = image;}catch(e){console.error("error: " + e);}
  }
  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords })
  }

}
