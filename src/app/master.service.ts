import { Injectable } from '@angular/core';

import {
  Auth,
  authState,
  fetchSignInMethodsForEmail,
  linkWithPhoneNumber,
  updateEmail,
  updatePassword,
  updateProfile,
  signInWithEmailAndPassword,
  UserCredential,
  updatePhoneNumber,
  /*User*/ PhoneAuthCredential,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithPopup,
  linkWithPopup,
  RecaptchaVerifier,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  linkWithCredential,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  collectionGroup,
  doc,
  getDoc,
  docData,
  setDoc,
  updateDoc,
  addDoc,
  query,
  limit,
  orderBy,
  where,
  FieldValue,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  DocumentReference,
  CollectionReference,
  onSnapshot,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

import { Storage, ref, uploadString } from '@angular/fire/storage';
import { getDownloadURL } from '@firebase/storage';
import { Hype, Product } from './universal.model';
import { deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(
    private auth: AuthService,
    private firestore: Firestore,
    private fireStorage: Storage
  ) {}

  get getServerTimestamp() {
    return serverTimestamp;
  }

  getBurnCatByID(id: string) {
    const catData = doc(
      this.firestore,
      `${this.auth.resource.env.db.burnCats}`,
      `${id}`
    );
    return docData(catData);
  }

  getBurnCatsList() {
    const catDataC = collection(
      this.firestore,
      `${this.auth.resource.env.db.burnCats}`
    );
    const qu = query(catDataC, orderBy('tit', 'desc'));
    return collectionData(qu);
  }

  getMyStore(uid: string) {
    const catDataC = collection(
      this.firestore,
      `${this.auth.resource.env.db.shops}`
    );
    const qu = query(catDataC, where('by', '==', uid));
    return collectionData(qu);
  }

  getStoreByID(storeID: string) {
    const shopRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${storeID}`
    );
    return getDoc(shopRef);
  }

  getUserByUID(UID: string) {
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.users}`,
      `${UID}`
    );
    return getDoc(userRef);
  }

  getUserList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.users}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getCustomUserList(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.users}`
    );
    const qu = query(
      catData,
      where(k, q, v),
      //where("ban", "==", false),
      //orderBy("sin", "desc"),
      limit(c)
    );
    return collectionData(qu);
  }

  getStoreList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.shops}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getCustomStoreList(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.shops}`
    );
    const qu = query(
      catData,
      where(k, q, v),
      //where("ban", "==", false),
      //orderBy("sin", "desc"),
      limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList_storeOrdr(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      where('type', 'array-contains', 'addORDER'),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList_storeOrdrCASH(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      where('ordrTYPE', '==', 'CASH'),
      where('type', 'array-contains', 'addORDER'),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList_storeOrdrREFILL(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      //where("ordrTYPE", "==", "CASH"),//campaignBalance
      where('type', 'array-contains', 'addBalance'),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList_storeOrdrPAYOUT(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      //where("ordrTYPE", "==", "CASH"),//campaignBalance
      where('type', 'array-contains', 'payout'),
      orderBy('sin', 'desc')
      //limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList_storeOrdrHandV(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      //where("ordrTYPE", "==", "CASH"),//campaignBalance
      where('type', 'in', ['admin', 'vendorAc']),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getPaymentList_storeOrdrHandC(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      //where("ordrTYPE", "==", "CASH"),//campaignBalance
      where('type', 'array-contains', 'admin'), //,"clientAc"
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getCustomPaymentList(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      where(k, q, v),
      //where("ban", "==", false),
      orderBy('status', 'desc'),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  deletePayment(id: string) {
    const thingsRef = doc(this.firestore, `${'walt'}`, `${id}`);
    return deleteDoc(thingsRef);
  }

  getProductByID(ID: string) {
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${ID}`
    );
    return getDoc(userRef);
  }

  getBurnProductList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    const qu = query(
      catData,
      where('burn', '==', true),
      //where("ban", "==", false),
      //where("sid", "==", sid),
      orderBy('sin', 'asc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getCustomBurnProductList(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    const qu = query(
      catData,
      where('burn', '==', true),
      where(k, q, v),
      //where("ban", "==", false),
      //orderBy("sin", "desc"),
      limit(c)
    );
    return collectionData(qu);
  }

  getBurnProductListReq(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    const qu = query(
      catData,
      where('reqBurn', '==', true),
      //where("ban", "==", false),
      //where("sid", "==", sid),
      orderBy('sin', 'asc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getCustomBurnProductListReq(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    const qu = query(
      catData,
      where('reqBurn', '==', true),
      where(k, q, v),
      //where("ban", "==", false),
      //orderBy("sin", "desc"),
      limit(c)
    );
    return collectionData(qu);
  }

  reqBurn(id: string) {
    const productRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(productRef, {
      reqBurn: true,
      burn: false,
    });
  }

  denyRequest(id: string) {
    const productRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(productRef, { reqBurn: false, burn: false });
  }

  acceptRequest(id: string) {
    const productRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(productRef, { reqBurn: false, burn: true });
  }

  changeFlash(id: string, flash: boolean) {
    const productRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(productRef, { flash: flash });
  }

  deleteProduct(storeID: string, id: string) {
    const productRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    const storeRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${storeID}`
    );
    return deleteDoc(productRef).then(() => {
      return updateDoc(storeRef, { products: increment(-1) });
    });
  }

  getProductList(
    sid: string //, c:number
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      where('sid', '==', sid),
      orderBy('sin', 'asc')
      //limit(c)
    );
    return collectionData(qu);
  }

  getCustomProductList(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    const qu = query(
      catData,
      where(k, q, v),
      //where("ban", "==", false),
      //orderBy("sin", "desc"),
      limit(c)
    );
    return collectionData(qu);
  }

  getCampaignList(
    sid: string //, c:number
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.hypes}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      where('sid', '==', sid),
      orderBy('sin', 'asc')
      //limit(c)
    );
    return collectionData(qu);
  }

  getCustomCampaignList(c: number, k: string, q: any, v: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.auth.resource.env.db.hypes}`
    );
    const qu = query(
      catData,
      where(k, q, v),
      //where("ban", "==", false),
      //orderBy("sin", "desc"),
      limit(c)
    );
    return collectionData(qu);
  }

  addNewCampaign(tX: string, data: any, payCustom: number) {
    const newTimestamp = this.getServerTimestamp();

    const dataSend: Hype = {
      id: '',
      tX: tX,
      customAct: false,
      customPay: payCustom,
      type: data.type,
      storeTyp: data.storeTyp,
      paid: false,
      name: data.campaignName,
      cbNew: data.cbNew,
      cbExi: data.cbExi,
      cbDir: data.cbDir,
      min: data.min,
      max: data.max,
      expiry: data.expiry,
      dateS: data.dateS,
      dateE: data.dateE,
      stage: data.stage,
      paused: false,
      stoped: false,
      ban: false,
      countS: 0,
      countP: 0,
      countM: 0,
      sin: newTimestamp,
      upd: newTimestamp,
      by: data.by,
      sid: data.storeID,
    };
    const hypeRefC = collection(
      this.firestore,
      `${this.auth.resource.env.db.hypes}`
    );
    return addDoc(hypeRefC, dataSend).then((ref) => {
      console.log('DONE', ref.id);

      const cB = data.type == 'flat' ? data.cbNew : data.max;
      const userRef = doc(
        this.firestore,
        `${this.auth.resource.env.db.users}`,
        `${data.by}`
      );
      const shopRef = doc(
        this.firestore,
        `${this.auth.resource.env.db.shops}`,
        `${data.storeID}`
      );

      return updateDoc(userRef, { storeCam: arrayUnion(ref.id), cashback: cB })
        .then(() => {
          return updateDoc(shopRef, { cashback: cB }).then(() => {
            console.log('DONE2');

            const hypeRef = doc(
              this.firestore,
              `${this.auth.resource.env.db.hypes}`,
              `${ref.id}`
            );
            return updateDoc(hypeRef, { id: ref.id })
              .then(() => {
                //console.log("DONE2", ref.id)
                return ref;
              })
              .catch((err) => {
                // HANDLE ISSUE
                console.log('DONE3', err);
                return err;
              });
          });
        })
        .catch((err) => {
          // HANDLE ISSUE
          console.log('DONE1', err);
          return err;
        });
    });
  }

  async updateUserBio(
    uid: string,
    nameCu: string,
    name: string,
    soIG: string,
    soYT: string,
    soTW: string,
    soWA: string
    //username:string, info:string, url:string, typ:number, sex:number, stat:string
  ) {
    const newTimestamp = this.getServerTimestamp();
    if (nameCu !== name) {
      //const credential:any = await this.afAuth.currentUser; // NO API YET FOR ADMIN SIDE
      //updateProfile(credential, {displayName:name})
      const userRef = doc(
        this.firestore,
        `${this.auth.resource.env.db.users}`,
        `${uid}`
      );
      return updateDoc(userRef, {
        name: name,
        //info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks,
        upd: newTimestamp,
      });
      // }
    } else {
      const userRef = doc(
        this.firestore,
        `${this.auth.resource.env.db.users}`,
        `${uid}`
      );
      return updateDoc(userRef, {
        //name:name,
        soIG,
        soYT,
        soTW,
        soWA,
        //info:info, url:url, typ:typ, sex:sex, stat:stat,
        upd: newTimestamp,
      });
    }
  }

  async updateStoreBio(
    id: string,
    nameCu: string,
    name: string
    //soIG:string, soYT:string, soTW:string, soWA:string
    //username:string, info:string, url:string, typ:number, sex:number, stat:string
  ) {
    const newTimestamp = this.getServerTimestamp();
    //const credential:any = await this.afAuth.currentUser;
    //this.afAuth.currentUser.then(data => { data?.updateProfile({displayName:name}) });
    //updateProfile(credential, {displayName:name})
    // if(!username){ //NO USERNAME
    //   let looks:string[] = this.resources.getLOOKUP( name.toLowerCase() );
    //   return this.afs.doc<User>(`${this.resources.env.db.users}/${uid}`).update({ name:name, info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks, upd: newTimestamp });
    // }else{ //HAS USERNAME
    //   let looks:string[] = this.resources.getLOOKUP( username +' '+ name.toLowerCase() );
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      name: name,
      //soIG, soYT, soTW, soWA,
      //info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks,
      upd: newTimestamp,
    });
  }

  async updateStoreAbout(id: string, about: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      about: about,
      upd: newTimestamp,
    });
  }

  async updateStoreGST(id: string) {
    console.log('GST UPDATED         sdadd       -----------' + id);

    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      GST: '123123123',
      upd: newTimestamp,
    });
  }

  async removeStoreBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      banners: arrayRemove(banner),
      upd: newTimestamp,
    });
  }

  async removeProductBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(userRef, {
      banners: arrayRemove(banner),
      upd: newTimestamp,
    });
  }

  async removeProductBurnBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(userRef, {
      burnPics: arrayRemove(banner),
      upd: newTimestamp,
    });
  }

  cloudUpload(idX: string, base64String: string) {
    const imgID = idX + Date.now();
    const bannerRef = ref(this.fireStorage, 'store/' + imgID);
    return uploadString(bannerRef, base64String.split(',')[1], 'base64')
      .then((snapshot) => {
        console.log('Uploaded a base64 string!', snapshot);
        return getDownloadURL(bannerRef).then((dlURL) => {
          console.log('getDownloadURL', dlURL);
          return { success: true, url: dlURL };
        });
      })
      .catch((err) => {
        console.log('Uploaded a base64 string! Fail', err);
        return { success: false, url: '' };
      });
  }

  async updateStoreBanner(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, banner);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        banner: cloudUpload.url,
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async addStoreBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, banner);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        banners: arrayUnion(cloudUpload.url),
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async addProductBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, banner);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        banners: arrayUnion(cloudUpload.url),
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async addProductBurnBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, banner);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        burnPics: arrayUnion(cloudUpload.url),
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async updateStoreLogo(id: string, logo: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, logo);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        logo: cloudUpload.url,
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async updateStoreOrdr(id: string, typeORDER: any) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      typeORDER: typeORDER,
      upd: newTimestamp,
    });
  }

  changeCatData(id: string, cat: string, subCat: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      cat: cat,
      subCat: subCat,
      upd: newTimestamp,
    });
  }

  changeTimeData(id: string, schedule: any) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      schedule: schedule,
      upd: newTimestamp,
    });
  }

  addProduct(data: any, banners: string[]) {
    const newTimestamp = this.getServerTimestamp();
    //const productID = /*data.nationISO + "_" + data.stateISO */ Date.now() + "_" + "";

    const dataSend: Product = {
      id: '', //productID,

      title: data.productName,
      description: data.description,
      banners: [],
      price: data.price,
      cost: data.cost,
      quota: 0,
      sold: 0,
      category: data.category,
      code: data.code,
      variants: data.variants,
      warranty: data.warranty,
      content: data.content,
      reqBurn: false,
      burn: false,

      sin: newTimestamp,
      upd: newTimestamp,
      by: data.by,
      sid: data.storeID,
    };
    console.log('dataSend', dataSend);
    const thingsRefC = collection(
      this.firestore,
      `${this.auth.resource.env.db.things}`
    );
    return addDoc(thingsRefC, dataSend).then((ref) => {
      const storeRef = doc(
        this.firestore,
        `${this.auth.resource.env.db.shops}`,
        `${data.storeID}`
      );
      return updateDoc(storeRef, {
        products: increment(1),
        proCat: arrayUnion(data.category),
      }).then(async () => {
        const thingsRef = doc(
          this.firestore,
          `${this.auth.resource.env.db.things}`,
          `${ref.id}`
        );

        if (banners.length == 0) {
          return updateDoc(thingsRef, { id: ref.id, banners: [] }).then(() => {
            return ref;
          });
        } else {
          const bannersList = [];
          for (let i = 0; i < banners.length; i++) {
            const cloudUpload = await this.cloudUpload(ref.id, banners[i]);
            if (cloudUpload.success) {
              bannersList.push(cloudUpload.url);
            }
            if (banners.length == i + 1) {
              return updateDoc(thingsRef, {
                id: ref.id,
                banners: bannersList,
              }).then(() => {
                return ref;
              });
            }
          }
        }

        /*
         */
      });

      // return this.afs.doc<User>(`${this.resource.env.db.users}/${data.by}`).update({storeLoc: arrayUnion(ref.id)}).then(() => {
      //   return ref.update({id:ref.id, logo:logo, banner:banner}).then(() => {
      //   }).catch(err => {
      //     return err;
      //   })
    });
    //proCat: arrayUnion(data.category),
    //products: arrayUnion(dataSend),
    //upd: newTimestamp })
  }

  async updateProduct(id: string, data: any) {
    const newTimestamp = this.getServerTimestamp();

    const thingsRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(thingsRef, {
      title: data.productName,
      description: data.description, //banners:[],
      price: data.price,
      cost: data.cost,
      quota: data.quota,
      category: data.category,
      code: data.code,
      variants: data.variants,
      warranty: data.warranty,
      content: data.content,
      upd: newTimestamp,
    });
  }

  async updateProductBurn(id: string, data: any) {
    const newTimestamp = this.getServerTimestamp();

    const thingsRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.things}`,
      `${id}`
    );
    return updateDoc(thingsRef, {
      reqBurn: false,
      burn: true,
      flash: data.flash,

      burnPic: data.burnPic,
      burnPics: data.burnPics,
      burnCat: data.burnCat,
      burnCatSub: data.burnCatSub,
      costBurn: data.costBurn,
      burnBrand: data.burnBrand,
      burnDecShort: data.burnDecShort,
      burnSpec: data.burnSpec,
      burnDec: data.burnDec,
      burnHigh: data.burnHigh,
      relate: data.relate,

      upd: newTimestamp,
    });
  }

  c = {
    tit: '',
    id: '',
    img: '',
    //img:"https://app.refr.club/assets/aditya/accessories.webp",
    //url:"/burn/accessories",
    subCat: [
      //{id:"footwear", tit:"Footwear"},
      //{id:"bags_and_wallet", tit:"Bags & Wallet"},
      //{id:"jewellery", tit:"Jewellery"},
      //{id:"clothing", tit:"Clothing"},
    ],

    banners: <any[]>[
      //{url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ],
    newIN: <any[]>[
      { url: '', img: 'https://app.refr.club/assets/aditya/burn-banner-1.svg' },
    ],
    spot: <any[]>[
      { url: '', img: 'https://app.refr.club/assets/aditya/burn-banner-1.svg' },
    ],
  };

  cloudUploadBurn(idX: string, base64String: string) {
    const imgID = idX + Date.now();
    const bannerRef = ref(this.fireStorage, 'burn/' + imgID);

    return uploadString(bannerRef, base64String.split(',')[1], 'base64')
      .then((snapshot) => {
        console.log('Uploaded a base64 string!', snapshot);
        return getDownloadURL(bannerRef).then((dlURL) => {
          console.log('getDownloadURL', dlURL);
          return { success: true, url: dlURL };
        });
      })
      .catch((err) => {
        console.log('Uploaded a base64 string! Fail', err);
        return { success: false, url: '' };
      });
  }

  async createBurnCat(id: string, tit: string, img: string) {
    const cloudUploadLogo = await this.cloudUploadBurn(id, img);
    const data = {
      id: id,
      tit: tit,
      img: cloudUploadLogo.url,
      subCat: [],
      banners: [],
      newIN: [],
      spot: [],
      rank: 0,
      products: 0,
    };
    const burnCatRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.burnCats}`,
      `${id}`
    );
    return setDoc(burnCatRef, data, { merge: true });
  }

  async updateBurnCat(id: string, data: any) {
    const burnCatRef = doc(
      this.firestore,
      `${this.auth.resource.env.db.burnCats}`,
      `${id}`
    );
    return updateDoc(burnCatRef, {
      tit: data.tit,
      img: data.img,
      subCat: data.subCat,
      banners: data.banners,
      newIN: data.newIN,
      spot: data.spot,
    });
  }
}
/*
  if(banners.length == 0){
        
    return updateDoc(thingsRef, {
      title:data.productName, description:data.description, //banners:[],
      price:data.price, cost:data.cost,
      category:data.category, code:data.code, variants:data.variants,
      warranty:data.warranty, content:data.content,
      upd:newTimestamp
    })

  }else{
    const bannersList = [];
    for (let i = 0; i < banners.length; i++) {
      const cloudUpload = await this.cloudUpload(id, banners[i]);
      if(cloudUpload.success){bannersList.push(cloudUpload.url)}

      if(banners.length == (i + 1)){
        return updateDoc(thingsRef, {
          title:data.productName, description:data.description, banners:bannersList,
          price:data.price, cost:data.cost,
          category:data.category, code:data.code, variants:data.variants,
          warranty:data.warranty, content:data.content,
          upd:newTimestamp
        })
      }

    }

  }
*/
