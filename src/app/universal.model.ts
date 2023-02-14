import { FieldValue } from '@angular/fire/firestore';

export interface User {
    uid: string;
    name: string; display: string;
    phone: string; iso: string; coin: string;
    email: string; emailV: boolean; emails: string[];
    soIG: string; soYT: string; soTW: string; soWA: string;
    storeLoc: string[] | FieldValue; storeCam: string[] | FieldValue;
    acBalC: number; acBalCr: number; acBalP: number;
    acBalV: number; acBalVr: number; acBalH: number;
    ban: boolean; note: any[];
    sin: any; log: any; upd: any;
    axess: string[]
}

export interface Shop {
    id: string;
    email: string; phone: string; name: string; logo: string,
    banner: string; banners: string[];
    type: string; cat: string; subCat: string;
    proCat: string[]; products: number;
    loc: Locate[]; schedule: Schedule;
    by: string; typeORDER: {
        logistics: boolean; delivery: string;
        exchange: boolean; return: boolean; refund: boolean;
        COD: boolean;
    }
    sin: any; log: any; upd: any;
}

export interface Locate {
    id: string;
    lat: number, lon: number; area: string;
    line1: string; line2: string; locality: string; zip: string;
    city: string; region: string; state: string; nation: string;
}

export interface Product {
    id: string;
    title: string; description: string; banners: string[];
    price: number; cost: number; quota: number; sold: number;
    category: string; code: string; variants: any[];
    warranty: boolean; content: boolean;
    reqBurn: boolean; burn: boolean;
    sin: any, upd: any, by: string; sid: string;
}

export interface Hype {
    id: string; tX: string; customAct: boolean, customPay: number;
    type: string; storeTyp: string;
    name: string;
    cbNew: number; cbExi: number; cbDir: number; paid: boolean;
    min: number; max: number;
    expiry: boolean; dateS: any; dateE: any;
    stage: number; paused: false, stoped: false, ban: false,
    countS: number; countP: number; countM: number;
    sin: any, upd: any, by: string; sid: string;
}

export interface Schedule {
    opensDaily: boolean, opensDailyS: string; opensDailyE: string;
    openMon: boolean, openMonS: string; openMonE: string;
    openTue: boolean, openTueS: string; openTueE: string;
    openWed: boolean, openWedS: string; openWedE: string;
    openThu: boolean, openThuS: string; openThuE: string;
    openFri: boolean, openFriS: string; openFriE: string;
    openSat: boolean, openSatS: string; openSatE: string;
    openSun: boolean, openSunS: string; openSunE: string;
}