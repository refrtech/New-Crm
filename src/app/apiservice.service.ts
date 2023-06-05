import { Injectable } from '@angular/core';
import { ref } from '@angular/fire/storage';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  limit,
  orderBy,
  where,
  serverTimestamp,
  CollectionReference,
} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  getCountFromServer,
  WhereFilterOp,
} from 'firebase/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiserviceService {
  newTimestamp = this.getServerTimestamp();
  fileName: string = '';

  constructor(
    private firestore: Firestore,
    private resource: ResourceService,
    private snackBar: MatSnackBar,
    public http: HttpClient,
    private auth: AuthService
  ) {}

  get getServerTimestamp() {
    return serverTimestamp;
  }

  getuserdata(id: any) {
    const catData: CollectionReference = collection(this.firestore, 'users');
    const qu = query(catData, where('uid', '==', id));
    return collectionData(qu);
  }

  getUserList(
    c: number,
    getall: boolean,
    Para?: any,
    operator?: any,
    value?: any
  ) {
    const catData: CollectionReference = collection(this.firestore, 'users');
    let Parametere: WhereFilterOp = Para;
    let conditions: WhereFilterOp = operator;
    let orderbyvalue = 'acBalC';
    if (
      operator == '!==' ||
      operator == '>' ||
      operator == '<' ||
      operator == '>=' ||
      operator == '<='
    ) {
      orderbyvalue = Para;
    }

    let qu;
    if (getall == true) {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where(Parametere, conditions, value),
          orderBy(orderbyvalue, 'desc')
        );
      } else {
        qu = query(catData, orderBy(orderbyvalue, 'desc'));
      }
    } else {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where(Parametere, conditions, value),
          orderBy(orderbyvalue, 'desc'),
          limit(c)
        );
      } else {
        qu = query(catData, orderBy(orderbyvalue, 'desc'), limit(c));
      }
    }
    return collectionData(qu);
  }

  getProductList(
    sid: string //, c:number
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'things'}`
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

  getCampaignList(sid: string) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'hypes'}`
    );
    const qu = query(catData, where('sid', '==', sid), orderBy('sin', 'desc'));
    // const qu = query(catData, where('sid', '==', sid), orderBy('sin', 'desc'));
    return collectionData(qu);
  }

  getRecentAddedOrder(
    datalimit: number,
    getall: boolean,
    Para?: any,
    operator?: any,
    value?: any
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    let Parametere: WhereFilterOp = Para;
    let conditions: WhereFilterOp = operator;

    var qu;
    let orderbyvalue = 'sin';

    if (
      operator == '!==' ||
      operator == '>' ||
      operator == '<' ||
      operator == '>=' ||
      operator == '<='
    ) {
      orderbyvalue = Para;
    }

    if (getall == true) {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where(Parametere, conditions, value),
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc')
        );
      } else {
        qu = query(
          catData,
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc')
        );
      }
    } else {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where(Parametere, conditions, value),
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc'),
          limit(datalimit)
        );
      } else {
        qu = query(
          catData,
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc'),
          limit(datalimit)
        );
      }
    }

    return collectionData(qu);
  }

  getRecentStores(
    c: number,
    getall: boolean,
    Para?: any,
    operator?: any,
    value?: any
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.shops}`
    );
    let Parametere: WhereFilterOp = Para;
    let conditions: WhereFilterOp = operator;
    let qu;
    let orderbyvalue = 'sin';
    if (
      operator == '!==' ||
      operator == '>' ||
      operator == '<' ||
      operator == '>=' ||
      operator == '<='
    ) {
      orderbyvalue = Para;
    }

    // qu = query(
    //   catData,
    //   where('sin', '>=', new Date('2023,03,01')),
    //   where('sin', '<', new Date('2023,03,31')),
    //   orderBy('sin', 'desc')
    // );

    if (getall == true) {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where(Parametere, conditions, value),
          orderBy(orderbyvalue, 'desc')
        );
      } else {
        qu = query(catData, orderBy(orderbyvalue, 'desc'));
      }
    } else {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where(Parametere, conditions, value),
          orderBy(orderbyvalue, 'desc'),
          limit(c)
        );
      } else {
        qu = query(catData, orderBy(orderbyvalue, 'desc'), limit(c));
      }
    }
    return collectionData(qu);
  }

  getBurnProductList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'things'}`
    );
    const qu = query(
      catData,
      where('burn', '==', true),
      orderBy('sin', 'asc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getRedemList(
    c: number,
    getall: boolean,
    Para?: any,
    operator?: any,
    value?: any
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    let Parametere: WhereFilterOp = Para;
    let conditions: WhereFilterOp = operator;
    let qu;
    let orderbyvalue = 'sin';

    if (
      operator == '!==' ||
      operator == '>' ||
      operator == '<' ||
      operator == '>=' ||
      operator == '<='
    ) {
      orderbyvalue = Para;
    }
    if (getall == true) {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where('type', 'array-contains', 'REDEEM'),
          where(Parametere, conditions, value),
          orderBy(orderbyvalue, 'desc')
        );
      } else {
        qu = query(
          catData,
          where('type', 'array-contains', 'REDEEM'),
          orderBy(orderbyvalue, 'desc')
        );
      }
    } else {
      if (
        Parametere != undefined &&
        operator != undefined &&
        value != undefined
      ) {
        qu = query(
          catData,
          where('type', 'array-contains', 'REDEEM'),
          where(Parametere, conditions, value),
          orderBy(orderbyvalue, 'desc'),
          limit(c)
        );
      } else {
        qu = query(
          catData,
          where('type', 'array-contains', 'REDEEM'),
          orderBy(orderbyvalue, 'desc'),
          limit(c)
        );
      }
    }
    return collectionData(qu);
  }

  getRecentUserTransaction(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      where('type', 'array-contains', 'clientAc'),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getRecentMerchantTransaction(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    const qu = query(
      catData,
      where('type', 'array-contains', 'vendorAc'),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getStoreByID(storeID: string) {
    const shopRef = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${storeID}`
    );
    return getDoc(shopRef);
  }

  getareabycity(cityid: any) {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'Areas'}`
    );
    const qu = query(
      manageNode,
      where('City_id', '==', cityid),
      where('isaddedinNode', '==', false)
    );
    return collectionData(qu);
  }

  deletearea(id: any) {
    const arearefr = doc(this.firestore, `Areas`, `${id}`);
    return deleteDoc(arearefr)
      .then((data) => {
        return { success: true };
      })
      .catch((err) => {
        return { success: false };
      });
  }

  async addarea(data: any) {
    const addedcity = await addDoc(
      collection(this.firestore, 'Areas'),
      data
    ).then((ref) => {
      const areeas = doc(this.firestore, 'Areas', `${ref.id}`);
      return updateDoc(areeas, { id: ref.id }).then(() => {
        return ref;
      });
    });
  }

  getcity() {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'cities'}`
    );

    const qu = query(manageNode);
    return collectionData(qu);
  }

  // deletecity(id: any) {
  //   const cityrefr = doc(this.firestore, `${'cities'}`, `${id}`);
  //   return deleteDoc(cityrefr);
  // }

  async addcity(data: any) {
    await addDoc(collection(this.firestore, `${'cities'}`), data).then(
      (ref) => {
        const citys = doc(this.firestore, `${'cities'}`, `${ref.id}`);
        return updateDoc(citys, { id: ref.id }).then(() => {
          return ref;
        });
      }
    );
  }

  // async addstore_brandspotlight(data: any) {
  //   await addDoc(collection(this.firestore, `${'brandspotlight'}`), data).then(
  //     (ref) => {
  //       const stores = doc(this.firestore, `${'brandspotlight'}`, `${ref.id}`);
  //       return updateDoc(stores, { id: ref.id }).then(() => {
  //         return ref;
  //       });
  //     }
  //   );
  // }

  // getspotlightdata() {
  //   const manageNode: CollectionReference = collection(
  //     this.firestore,
  //     `${'brandspotlight'}`
  //   );
  //   const qu = query(manageNode);
  //   return collectionData(qu);
  // }

  // updateBStitle(Title: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
  //   return updateDoc(cityrefr, { BS_Title: Title })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // updateBSStitle(STitle: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
  //   return updateDoc(cityrefr, { BS_STitle: STitle })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update Sub-title.';
  //       } else {
  //         return 'Sub-title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // addBSstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
  //   return updateDoc(cityrefr, { Stores: arrayUnion(stores) });
  // }

  // removeBSstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
  //   return updateDoc(cityrefr, { Stores: arrayRemove(stores) });
  // }

  // async addstore_homegrown(data: any) {
  //   await addDoc(collection(this.firestore, `${'Home_Grown'}`), data).then(
  //     (ref) => {
  //       const stores = doc(this.firestore, `${'Home_Grown'}`, `${ref.id}`);
  //       return updateDoc(stores, { id: ref.id }).then(() => {
  //         return ref;
  //       });
  //     }
  //   );
  // }

  // async updatehomegrownbanners(
  //   id: string,
  //   croppedImage: string,
  //   catarray: any,
  //   catname: any,
  //   index: number
  // ) {
  //   const newTimestamp = this.getServerTimestamp();
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     let i = catarray.findIndex((x: any) => x.title == catname);
  //     if (index == 1) {
  //       catarray[i].Thumbnail = cloudUpload.url;
  //     } else {
  //       catarray[i].catbanner = cloudUpload.url;
  //     }

  //     return updateDoc(cityrefr, {
  //       Categories: catarray,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  // addHGFRstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { First_Stores: arrayUnion(stores) });
  // }

  // addHGSRstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { Second_Stores: arrayUnion(stores) });
  // }

  // addHGTRstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { third_Stores: arrayUnion(stores) });
  // }

  // removeHGFRstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { First_Stores: arrayRemove(stores) });
  // }

  // removeHGSRstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { Second_Stores: arrayRemove(stores) });
  // }

  // removeHGTRstores(stores: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { third_Stores: arrayRemove(stores) });
  // }

  // async updatehomegrownFirststorelogo(
  //   croppedImage: any,
  //   HGdata: any,
  //   index: number,
  //   homegrownid: string
  // ) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${homegrownid}`);
  //   const cloudUpload: any = await this.cloudupload2(
  //     HGdata[index].id,
  //     croppedImage
  //   );
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     HGdata[index].crmlogo = cloudUpload.url;
  //     return updateDoc(cityrefr, { First_Stores: HGdata })
  //       .then(() => {
  //         return cloudUpload;
  //       })
  //       .catch((err) => {
  //         return false;
  //       });
  //   }
  // }

  // async updatehomegrownSecondstorelogo(
  //   croppedImage: any,
  //   HGdata: any,
  //   index: number,
  //   homegrownid: string
  // ) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${homegrownid}`);
  //   const cloudUpload: any = await this.cloudupload2(
  //     HGdata[index].id,
  //     croppedImage
  //   );

  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     HGdata[index].crmlogo = cloudUpload.url;
  //     return updateDoc(cityrefr, { Second_Stores: HGdata })
  //       .then(() => {
  //         return cloudUpload;
  //       })
  //       .catch((err) => {
  //         return false;
  //       });
  //   }
  // }

  // async updatehomegrownThirdstorelogo(
  //   croppedImage: any,
  //   HGdata: any,
  //   index: number,
  //   homegrownid: string
  // ) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${homegrownid}`);
  //   const cloudUpload: any = await this.cloudupload2(
  //     HGdata[index].id,
  //     croppedImage
  //   );
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     HGdata[index].crmlogo = cloudUpload.url;

  //     return updateDoc(cityrefr, { third_Stores: HGdata })
  //       .then(() => {
  //         return cloudUpload;
  //       })
  //       .catch((err) => {
  //         return false;
  //       });
  //   }
  // }

  // updateHGtitle(Title: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { HG_Title: Title })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // updateHGStitle(STitle: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
  //   return updateDoc(cityrefr, { HG_STitle: STitle })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update Sub-title.';
  //       } else {
  //         return 'Sub-title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // gethomegrowndata() {
  //   const manageNode: CollectionReference = collection(
  //     this.firestore,
  //     `${'Home_Grown'}`
  //   );
  //   const qu = query(manageNode);
  //   return collectionData(qu);
  // }

  // async updatehomegrownproductbanner(
  //   HGdata: any,
  //   croppedImage: any,
  //   index: number
  // ) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${HGdata.id}`);
  //   const cloudUpload: any = await this.cloudupload2(HGdata.id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     HGdata.products[index].crmbanner = cloudUpload.url;
  //     return updateDoc(cityrefr, { products: HGdata.products })
  //       .then(() => {
  //         return cloudUpload;
  //       })
  //       .catch((err) => {
  //         return false;
  //       });
  //   }
  // }

  // async updateHGsubcatbanner(
  //   HGdata: any,
  //   croppedImage: any,
  //   catindex: number,
  //   subcatindex: number
  // ) {
  //   const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${HGdata.id}`);
  //   const cloudUpload: any = await this.cloudupload2(HGdata.id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     HGdata.Categories[catindex].items[subcatindex].crmbanner =
  //       cloudUpload.url;
  //     return updateDoc(cityrefr, { Categories: HGdata.Categories })
  //       .then(() => {
  //         return cloudUpload;
  //       })
  //       .catch((err) => {
  //         return false;
  //       });
  //   }
  // }

  // viewVideo(data: any) {}

  updatecity(data: any) {
    const cityrefr = doc(this.firestore, `${'cities'}`, `${data.id}`);
    return updateDoc(cityrefr, {
      CityN: data.CityN,
      CitySN: data.CitySN,
      MDateTime: data.MDateTime,
    })
      .then((datas: any) => {
        if (datas) {
          return 'issue in city update';
        } else {
          return 'city updated';
        }
      })
      .catch((err) => {
        return false;
      });
  }

  addcityarea(data: any) {
    const cityrefr = doc(this.firestore, `${'cities'}`, `${data.id}`);
    return updateDoc(cityrefr, { Areas: arrayUnion(data.areadata) });
  }

  removecityarea(data: any) {
    const cityrefr = doc(this.firestore, `${'cities'}`, `${data.id}`);
    return updateDoc(cityrefr, { Areas: arrayRemove(data.areadata) });
  }

  getUserByUID(UID: string) {
    const userRef = doc(this.firestore, `${'users'}`, `${UID}`);
    return getDoc(userRef);
  }

  getFormData(c: number, paravalue: string, tab: any) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'reminders'}`
    );
    if (tab) {
      const qu = query(
        catData,
        orderBy('date', 'desc'),
        where('from', '==', paravalue),
        limit(c)
      );
      return collectionData(qu);
    } else {
      const qu = query(catData, orderBy('date', 'desc'), limit(50));
      return collectionData(qu);
    }
  }

  nodeList: any[] = [];
  nodesData: any[] = JSON.parse(localStorage.getItem('nodesData') || '[]');

  addnodearea(data: any) {
    const noderefr = doc(this.firestore, `${'node_manager'}`, `${data.id}`);
    return updateDoc(noderefr, { Nareas: arrayUnion(data.areadata) });
  }

  removenodearea(data: any) {
    const noderefr = doc(this.firestore, `${'node_manager'}`, `${data.id}`);
    return updateDoc(noderefr, { Nareas: arrayRemove(data.areadata) });
  }

  copyClipboard(text: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.auth.resource.startSnackBar('copied to your clipboard.');
  }

  // Node functions start
  async addnode(data: any) {
    await addDoc(collection(this.firestore, 'node_manager'), data)
      .then((ref) => {
        const Nodes = doc(this.firestore, 'node_manager', `${ref.id}`);
        updateDoc(Nodes, { id: ref.id })
          .then((data) => {
            return ref.id;
          })
          .catch((err) => {
            return false;
          });
      })
      .catch((err) => {
        return false;
      });
  }

  getNodeData() {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'node_manager'}`
    );
    const qu = query(manageNode);
    return collectionData(qu);
  }

  getNodeDataaspercity(cityid: string) {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'node_manager'}`
    );
    const qu = query(manageNode, where('city_id', '==', cityid));
    return collectionData(qu);
  }

  deletenode(id: any) {
    const noderefr = doc(this.firestore, `${'node_manager'}`, `${id}`);
    return deleteDoc(noderefr);
  }

  updateNodeData(nodeData: any) {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'node_manager'}`
    );
    const qu = doc(this.firestore, 'node_manager', `${nodeData.id}`);
    return updateDoc(qu, {
      name: nodeData.name,
      updated_at: nodeData.updated_at,
      Nareas: nodeData.Nareas,
      Areaspincodes: nodeData.Areaspincodes,
    });
  }

  // VSA section start

  // getVSAData() {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'VSA_section'}`
  //   );
  //   const qu = query(VSA_section);
  //   return collectionData(qu);
  // }

  // updateVSAtitle(Title: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { VSA_Title: Title })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // updateVSAStitle(STitle: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { VSA_STitle: STitle })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update Sub-title.';
  //       } else {
  //         return 'Sub-title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // addVSAstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: arrayUnion(nodes) });
  // }

  // editVSAstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: nodes });
  // }

  // async addstoretoPeoplechoice(Data: any) {
  //   const nodeinternal = await addDoc(
  //     collection(this.firestore, 'people_choice_store'),
  //     Data
  //   ).then((ref) => {
  //     const areeas = doc(this.firestore, 'people_choice_store', `${ref.id}`);
  //     return updateDoc(areeas, { sectionid: ref.id }).then(() => {
  //       return ref;
  //     });
  //   });
  // }

  // async addstoretoTrendingStore(Data: any) {
  //   const nodeinternal = await addDoc(
  //     collection(this.firestore, 'trending_store'),
  //     Data
  //   ).then((ref) => {
  //     const areeas = doc(this.firestore, 'trending_store', `${ref.id}`);
  //     return updateDoc(areeas, { sectionid: ref.id }).then(() => {
  //       return ref;
  //     });
  //   });
  // }

  // deletestorefrompeopleStore(id: any) {
  //   const vidRef = doc(this.firestore, 'people_choice_store', `${id}`);
  //   return deleteDoc(vidRef);
  // }

  // deletestorefromTrendingStore(id: any) {
  //   const vidRef = doc(this.firestore, 'trending_store', `${id}`);
  //   return deleteDoc(vidRef);
  // }

  // getVSAPeoplechoiceCatstores(nodeid: string, catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'people_choice_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('Nodeid', '==', nodeid),
  //     where('catId', '==', catId),
  //     where('iscat_subCatstore', '==', 'Cat'),
  //     where('sectionName', '==', 'VSAsection')
  //   );
  //   return collectionData(qu);
  // }

  // getVSAtrendingCatstores(nodeid: string, catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'trending_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('Nodeid', '==', nodeid),
  //     where('catId', '==', catId),
  //     where('iscat_subCatstore', '==', 'Cat'),
  //     where('sectionName', '==', 'VSAsection')
  //   );
  //   return collectionData(qu);
  // }

  // getPeoplechoiceCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'people_choice_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('sectionName', '==', 'Categorysection')
  //   );
  //   return collectionData(qu);
  // }

  // gettrendingCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'trending_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('sectionName', '==', 'Categorysection')
  //   );
  //   return collectionData(qu);
  // }

  // getcuratedtrendingCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'trending_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('sectionName', '==', 'Categorysection-CuratedStores')
  //   );
  //   return collectionData(qu);
  // }

  // getHgrownPeoplechoiceCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'people_choice_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('iscat_subCatstore', '==', 'Cat'),
  //     where('sectionName', '==', 'HomegrownSection')
  //   );
  //   return collectionData(qu);
  // }

  // getHgrowntrendingCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'trending_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('iscat_subCatstore', '==', 'Cat'),
  //     where('sectionName', '==', 'HomegrownSection')
  //   );
  //   return collectionData(qu);
  // }

  // getVSAPeoplechoicesubCatstores(
  //   nodeid: string,
  //   catid: string,
  //   subcatId: string
  // ) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'people_choice_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('Nodeid', '==', nodeid),
  //     where('catId', '==', catid),
  //     where('SubcatId', '==', subcatId),
  //     where('iscat_subCatstore', '==', 'SubCat'),
  //     where('sectionName', '==', 'VSAsection')
  //   );
  //   return collectionData(qu);
  // }

  // gethomegrowPeoplechoicesubCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'people_choice_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('iscat_subCatstore', '==', 'SubCat'),
  //     where('sectionName', '==', 'HomegrownSection')
  //   );
  //   return collectionData(qu);
  // }

  // gethomegrowbrandsUlovesubCatstores(catId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'trending_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('catId', '==', catId),
  //     where('iscat_subCatstore', '==', 'SubCat'),
  //     where('sectionName', '==', 'HomegrownSection')
  //   );
  //   return collectionData(qu);
  // }

  // getVSAtrendingsubCatstores(nodeid: string, catId: string, subcatId: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'trending_store'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('Nodeid', '==', nodeid),
  //     where('catId', '==', catId),
  //     where('SubcatId', '==', subcatId),
  //     where('iscat_subCatstore', '==', 'SubCat'),
  //     where('sectionName', '==', 'VSAsection')
  //   );
  //   return collectionData(qu);
  // }

  // async updatesubcatproductbanner(id: string, croppedImage: string) {
  //   const newTimestamp = this.getServerTimestamp();
  //   const cityrefr = doc(this.firestore, `${'ProductsYouHave'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     return updateDoc(cityrefr, {
  //       productbanner: cloudUpload.url,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  // async addProductTohomegrown(Data: any) {
  //   const nodeinternal = await addDoc(
  //     collection(this.firestore, 'ProductsYouHave'),
  //     Data
  //   ).then((ref) => {
  //     const areeas = doc(this.firestore, 'ProductsYouHave', `${ref.id}`);
  //     return updateDoc(areeas, { Docid: ref.id }).then(() => {
  //       return ref;
  //     });
  //   });
  // }

  // gethomegrowproductssubCatstores(sectionname: string, catid: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'ProductsYouHave'}`
  //   );
  //   const qu = query(
  //     VSA_section,
  //     where('sectionName', '==', sectionname),
  //     where('catId', '==', catid)
  //   );
  //   return collectionData(qu);
  // }

  // deleteproductfromhomegrown(id: any) {
  //   const vidRef = doc(this.firestore, 'ProductsYouHave', `${id}`);
  //   return deleteDoc(vidRef);
  // }

  // async updateTrendingstorebanner(id: string, croppedImage: string) {
  //   const newTimestamp = this.getServerTimestamp();
  //   const cityrefr = doc(this.firestore, `${'trending_store'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     return updateDoc(cityrefr, {
  //       TrendingSBanner: cloudUpload.url,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  // async updatePchoicestorebanner(id: string, croppedImage: string) {
  //   const newTimestamp = this.getServerTimestamp();
  //   const cityrefr = doc(this.firestore, `${'people_choice_store'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     return updateDoc(cityrefr, {
  //       PchoiceSBanner: cloudUpload.url,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  async updatecatBannerORthumbnail(
    catid: any,
    croppedImage: string,
    type: string,
    catindex?: number,
    subcatindex?: number
  ) {
    const newTimestamp = this.getServerTimestamp();
    const categoryrefr = doc(this.firestore, `${'cats'}`, `${catid}`);
    const cloudUpload: any = await this.cloudupload2(catid, croppedImage);

    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      if (type == 'homeBanner') {
        return updateDoc(categoryrefr, {
          CategoryBanner: cloudUpload.url,
          upd: newTimestamp,
        }).then(() => {
          return cloudUpload;
        });
      } else if (type == 'logo') {
        return updateDoc(categoryrefr, {
          thumbnail: cloudUpload.url,
          upd: newTimestamp,
        }).then(() => {
          return cloudUpload;
        });
      } else if (type == 'VSAthumbnail') {
        return updateDoc(categoryrefr, {
          VSAthumbnail: cloudUpload.url,
          upd: newTimestamp,
        }).then(() => {
          return cloudUpload;
        });
      } else if (type == 'VSABanner') {
        return updateDoc(categoryrefr, {
          VSABanner: cloudUpload.url,
          upd: newTimestamp,
        }).then(() => {
          return cloudUpload;
        });
      } else if (type == 'VSAcatbanner') {
        return updateDoc(categoryrefr, {
          VSAcatBanner: cloudUpload.url,
          upd: newTimestamp,
        }).then(() => {
          return cloudUpload;
        });
      } else if (type == 'VSAsubcatbanner') {
        this.auth.resource.categoryList[catindex || 0].items[
          subcatindex || 0
        ].VSASubcatbanner = cloudUpload.url;
        return updateDoc(categoryrefr, {
          items: this.auth.resource.categoryList[catindex || 0].items,
          upd: newTimestamp,
        }).then(() => {
          return cloudUpload;
        });
      }
    }
  }

  // getnodeinterdata(nodeid: string) {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'vsa_internal'}`
  //   );
  //   const qu = query(VSA_section, where('node_id', '==', nodeid));
  //   return collectionData(qu);
  // }

  // updatePeoplechoicepara(id: string, catarray: any) {
  //   const cityrefr = doc(this.firestore, `${'vsa_internal'}`, `${id}`);
  //   return updateDoc(cityrefr, { CategoryBanners: catarray })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // async updateNodecatinternalBanner(
  //   id: string,
  //   croppedImage: string,
  //   catarray: any,
  //   catid: any
  // ) {
  //   const newTimestamp = this.getServerTimestamp();
  //   const cityrefr = doc(this.firestore, `${'vsa_internal'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     let i = catarray.findIndex((x: any) => x.Catid == catid);
  //     if (i == -1) {
  //       catarray.push({
  //         Catid: catid,
  //         Catbanner: cloudUpload.url,
  //       });
  //     } else {
  //       catarray[i].Catbanner = cloudUpload.url;
  //     }

  //     return updateDoc(cityrefr, {
  //       CategoryBanners: catarray,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  // async updateNodesubcatinternalBanner(
  //   id: string,
  //   croppedImage: string,
  //   catarray: any,
  //   catid: any,
  //   subcatid: any,
  //   updloadId: string //1 for sub-cat ,2 for cat banner
  // ) {
  //   const newTimestamp = this.getServerTimestamp();
  //   const cityrefr = doc(this.firestore, `${'vsa_internal'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     let i = catarray.findIndex((x: any) => x.Catid == catid);
  //     if (i != -1) {
  //       if (updloadId == '1') {
  //         let j;
  //         if (catarray[i].subcatbanners != undefined) {
  //           j = catarray[i].subcatbanners.findIndex(
  //             (x: any) => x.Subcatid == subcatid
  //           );
  //           if (j == -1) {
  //             catarray[i].subcatbanners.push({
  //               Subcatid: subcatid,
  //               Subcatbanner: cloudUpload.url,
  //             });
  //           } else {
  //             catarray[i].subcatbanners[j].Subcatbanner = cloudUpload.url;
  //           }
  //         } else {
  //           catarray[i].subcatbanners = [
  //             {
  //               Subcatid: subcatid,
  //               Subcatbanner: cloudUpload.url,
  //             },
  //           ];
  //         }
  //       } else {
  //         catarray[i].Catbanner = cloudUpload.url;
  //       }
  //     } else {
  //       if (updloadId == '1') {
  //         catarray.push({
  //           Catbanner: '',
  //           Catid: catid,
  //           subcatbanners: [
  //             {
  //               Subcatid: subcatid,
  //               Subcatbanner: cloudUpload.url,
  //             },
  //           ],
  //         });
  //       } else {
  //         catarray.push({
  //           Catbanner: cloudUpload.url,
  //           Catid: catid,
  //         });
  //       }
  //     }

  //     return updateDoc(cityrefr, {
  //       CategoryBanners: catarray,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  // async addnodeinternal(Data: any) {
  //   const nodeinternal = await addDoc(
  //     collection(this.firestore, 'vsa_internal'),
  //     Data
  //   ).then((ref) => {
  //     const node = doc(this.firestore, 'vsa_internal', `${ref.id}`);
  //     return updateDoc(node, { id: ref.id }).then(() => {
  //       return ref;
  //     });
  //   });
  // }

  // VSAupdatestore(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: nodes });
  // }

  // VSA section end

  //BIYN section start
  // getBIYNData() {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'BIYN_section'}`
  //   );
  //   const qu = query(VSA_section);
  //   return collectionData(qu);
  // }

  // updateBIYNtitle(Title: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'BIYN_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { BN_Title: Title })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // updateBIYNStitle(STitle: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'BIYN_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { BN_STitle: STitle })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update Sub-title.';
  //       } else {
  //         return 'Sub-title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // addBIYNstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'BIYN_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: arrayUnion(nodes) });
  // }

  // editBIYNstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'BIYN_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: nodes });
  // }

  // async addBIYN(data: any) {
  //   const addedcity = await addDoc(collection(this.firestore, "BIYN_section"), data).then(ref => {
  //     const areeas = doc(this.firestore, 'BIYN_section', `${ref.id}`)
  //     return updateDoc(areeas, { id: ref.id }).then(() => { return ref; })
  //   })
  // }

  //BIYN section end

  // NSIYH section start

  // getNSIYHData() {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'NSIYH_section'}`
  //   );
  //   const qu = query(VSA_section);
  //   return collectionData(qu);
  // }

  // updateNSIYHtitle(Title: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'NSIYH_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { NSIYH_Title: Title })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // updateNSIYHStitle(STitle: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'NSIYH_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { NSIYH_STitle: STitle })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update Sub-title.';
  //       } else {
  //         return 'Sub-title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // addNSIYHstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'NSIYH_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: arrayUnion(nodes) });
  // }

  // editNSIYHstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'NSIYH_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: nodes });
  // }

  // async addNSIYH(data: any) {
  //    await addDoc(collection(this.firestore, "NSIYH_section"), data).then(ref => {
  //     const areeas = doc(this.firestore, 'NSIYH_section', `${ref.id}`)
  //     return updateDoc(areeas, { id: ref.id }).then(() => { return ref; })
  //   })
  // }

  // NSIYH section end

  // Daily drop start

  // getDailydropdata() {
  //   const VSA_section: CollectionReference = collection(
  //     this.firestore,
  //     `${'dailyDrop_section'}`
  //   );
  //   const qu = query(VSA_section);
  //   return collectionData(qu);
  // }

  // updateDailydroptitle(Title: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'dailyDrop_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { DDrop_Title: Title })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update title.';
  //       } else {
  //         return 'title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // updateDailydropStitle(STitle: string, id: any) {
  //   const cityrefr = doc(this.firestore, `${'dailyDrop_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { DDrop_STitle: STitle })
  //     .then((datas: any) => {
  //       if (datas) {
  //         return 'issue in update Sub-title.';
  //       } else {
  //         return 'Sub-title updated.';
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  // }

  // addDailydropstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'dailyDrop_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: arrayUnion(nodes) });
  // }

  // editDailydropstores(nodes: any, id: any) {
  //   const cityrefr = doc(this.firestore, `${'dailyDrop_section'}`, `${id}`);
  //   return updateDoc(cityrefr, { Nodes: nodes });
  // }

  // info slide start

  // async infoUploadVideo(data: any) {
  //   await addDoc(collection(this.firestore, `${'info_slide'}`), data).then(
  //     (ref) => {
  //       const video = doc(this.firestore, 'info_slide', `${ref.id}`);
  //       return updateDoc(video, { id: ref.id }).then(() => {
  //         return ref;
  //       });
  //     }
  //   );
  // }

  // cloudUpload(idX: string, base64String: string) {
  //   const imgID = idX + Date.now();
  //   const bannerRef = ref(this.fireStorage, 'store/' + imgID);
  //   return uploadString(bannerRef, base64String.split(',')[1], 'base64')
  //     .then((snapshot) => {
  //       return getDownloadURL(bannerRef).then((dlURL) => {
  //         return { success: true, url: dlURL };
  //       });
  //     })
  //     .catch((err) => {
  //       return { success: false, url: '' };
  //     });
  // }

  cloudupload2(id: string, croppedImage: any) {
    console.log('cloudupload2 hit');
    return new Promise((resolve, reject) => {
      let file = this.dataURLtoFile(croppedImage, id);
      // console.log( "file size = ",(file.size / (1024*1024)).toFixed(2));
      //
      if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        console.log('file : ', file);
        this.fileName = file.name;
        const formData = new FormData();
        formData.append('file', file, file.name);
        const headers = new HttpHeaders();
        headers.append(
          'Content-Type:multipart/form-data; boundary=------------------------1234567890',
          'multipart/form-data'
        );

        this.http
          .post('https://upload.refr.club/upload-image', formData, {
            headers: headers,
          })
          .subscribe(
            (res: any) => {
              resolve({ success: true, url: res.url });
            },
            (err) => {
              console.error(err);
              reject({ success: true, url: '' });
            }
          );
      }
    });
  }

  isareaAlreadyAdded(id: string, isallreadyadded: boolean) {
    const area = doc(this.firestore, 'Areas', `${id}`);
    return updateDoc(area, { isaddedinNode: isallreadyadded }).then(() => {
      return ref;
    });
  }

  // async addstorewithnodeid(data: any) {
  //   const addedcity = await addDoc(
  //     collection(this.firestore, 'Storewithnodes'),
  //     data
  //   ).then((ref) => {
  //     const areeas = doc(this.firestore, 'Storewithnodes', `${ref.id}`);
  //     return updateDoc(areeas, { Docid: ref.id }).then(() => {
  //       return ref;
  //     });
  //   });
  // }

  // deletestorefromnodes(id: string) {
  //   const arearefr = doc(this.firestore, `Storewithnodes`, `${id}`);
  //   return deleteDoc(arearefr)
  //     .then((data) => {
  //       return { success: true };
  //     })
  //     .catch((err) => {
  //       return { success: false };
  //     });
  // }

  // async updatestorewithnodebanner(id: string, croppedImage: any) {
  //   const cityrefr = doc(this.firestore, `${'Storewithnodes'}`, `${id}`);
  //   const cloudUpload: any = await this.cloudupload2(id, croppedImage);
  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     return updateDoc(cityrefr, { CRMbanner: cloudUpload.url })
  //       .then((datas: any) => {
  //         if (datas) {
  //           return 'issue in update Sub-title.';
  //         } else {
  //           return 'Sub-title updated.';
  //         }
  //       })
  //       .catch((err) => {
  //         return false;
  //       });
  //   }
  // }

  dataURLtoFile(dataurl: any, filename: string) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  ////////////////////////////////

  adddatatosectionstore(data: any) {
    return new Promise((resolve, reject) => {
      const addedcity = addDoc(
        collection(this.firestore, 'Section_stores'),
        data
      )
        .then((ref) => {
          const areeas = doc(this.firestore, 'Section_stores', `${ref.id}`);
          updateDoc(areeas, { id: ref.id }).then(() => {
            resolve(ref);
          });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  getCat(cat: string) {
    if (this.auth.resource.categoryList.length == 0) {
      return cat;
    } else {
      const c = this.auth.resource.categoryList.findIndex(
        (x: any) => x.id == cat
      );
      return this.auth.resource.categoryList[c].title || '';
    }
  }

  async updateSectionStorebanner(
    id: any,
    croppedImage: any,
    section: string,
    storebanners?: any
  ) {
    const Shoprefr = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${id}`
    );
    const cloudUpload: any = await this.cloudupload2(id, croppedImage);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      if (section == 'BrandSpotlight') {
        // stores[index].brandspotlightbanner = cloudUpload.url;
        return updateDoc(Shoprefr, { Brandspotlightbanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'BIYN') {
        return updateDoc(Shoprefr, { BIYNbanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'homegrown') {
        return updateDoc(Shoprefr, { HGBanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'DailyDrop') {
        return updateDoc(Shoprefr, { DailyDropBanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'NSIYH') {
        return updateDoc(Shoprefr, { NSIYHBanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'Categores') {
        return updateDoc(Shoprefr, { CategoresBanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'VSA') {
        return updateDoc(Shoprefr, { VSABanner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'Storelogo') {
        return updateDoc(Shoprefr, { logo: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'Storebanner') {
        return updateDoc(Shoprefr, { banner: cloudUpload.url })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      } else if (section == 'Storebannerss') {
        return updateDoc(Shoprefr, { banners: arrayUnion(cloudUpload.url) })
          .then((datas: any) => {
            return 'Banner Uploaded';
          })
          .catch((err) => {
            return false;
          });
      }
    }
  }

  async deletestorebanners(storeid: string, bannerurl: any) {
    const storedata = await doc(
      collection(this.firestore, `${this.resource.env.db.shops}`),
      storeid
    );
    return updateDoc(storedata, {
      banners: arrayRemove(bannerurl),
    });
  }

  getStoresbyIds(StoreIds: any) {
    const Hgrown: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.shops}`
    );
    const qu = query(Hgrown, where('id', 'in', StoreIds));
    return collectionData(qu);
  }

  async AddORRemoveSectionStores(index: number, storeid: any, DocId: string) {
    const sectiondata = await doc(
      collection(this.firestore, 'Section_stores'),
      DocId
    );
    if (index == 1) {
      return updateDoc(sectiondata, {
        Stores: arrayUnion(storeid),
        M_Date: this.newTimestamp,
      });
    } else {
      return updateDoc(sectiondata, {
        Stores: arrayRemove(storeid),
        M_Date: this.newTimestamp,
      });
    }
  }

  deletestoresectiondata(id: any) {
    const arearefr = doc(this.firestore, `Section_stores`, `${id}`);
    return deleteDoc(arearefr)
      .then((data) => {
        return { success: true };
      })
      .catch((err) => {
        return { success: false };
      });
  }

  //// brands in your neighbourhood//////
  getstoreaspernode(sectionname: string, nodeid: string) {
    const Hgrown: CollectionReference = collection(
      this.firestore,
      `${'Section_stores'}`
    );
    const qu = query(
      Hgrown,
      where('SectionName', '==', sectionname),
      where('NodeId', '==', nodeid)
    );
    return collectionData(qu);
  }

  async getstorecount(sectionname: string, cityid: string, nodeid: string) {
    const coll = collection(this.firestore, 'Section_stores');
    const q = query(
      coll,
      where('SectionName', '==', sectionname),
      where('CityId', '==', cityid),
      where('NodeId', '==', nodeid)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  getSectionData(id: string) {
    const Sectiondata: CollectionReference = collection(
      this.firestore,
      `${'Section_Details'}`
    );
    const qu = query(Sectiondata, where('SectionID', '==', id));
    return collectionData(qu);
  }

  async updateSectionData(index: number, id: string, data: string) {
    const addedcity = await doc(
      collection(this.firestore, 'Section_Details'),
      id
    );
    if (index == 1) {
      return updateDoc(addedcity, {
        Section_title: data,
        MDate: this.newTimestamp,
      })
        .then((datas: any) => {
          if (datas) {
            return 'issue in update title.';
          } else {
            return 'title updated.';
          }
        })
        .catch((err) => {
          return false;
        });
    } else {
      return updateDoc(addedcity, {
        Section_Stitle: data,
        MDate: this.newTimestamp,
      })
        .then((datas: any) => {
          if (datas) {
            return 'issue in update Sub-Title.';
          } else {
            return 'title updated.';
          }
        })
        .catch((err) => {
          return false;
        });
    }
  }

  async updateHomeGrwonStoreData(
    isadded: boolean,
    index: string,
    id: string,
    Storeid: string
  ) {
    const homegrown = await doc(
      collection(this.firestore, 'Section_Details'),
      id
    );
    if (isadded == true) {
      if (index == '1') {
        return updateDoc(homegrown, { First_Stores: arrayUnion(Storeid) })
          .then((datas: any) => {
            if (datas) {
              return 'issue in adding Store.';
            } else {
              return 'Store Added.';
            }
          })
          .catch((err) => {
            return false;
          });
      } else if (index == '2') {
        return updateDoc(homegrown, { Second_Stores: arrayUnion(Storeid) })
          .then((datas: any) => {
            if (datas) {
              return 'issue in adding Store.';
            } else {
              return 'Store Added.';
            }
          })
          .catch((err) => {
            return false;
          });
      } else {
        return updateDoc(homegrown, { third_Stores: arrayUnion(Storeid) })
          .then((datas: any) => {
            if (datas) {
              return 'issue in adding Store.';
            } else {
              return 'Store Added.';
            }
          })
          .catch((err) => {
            return false;
          });
      }
    } else {
      if (index == '1') {
        return updateDoc(homegrown, { First_Stores: arrayRemove(Storeid) })
          .then((datas: any) => {
            if (datas) {
              return 'issue in removing Store.';
            } else {
              return 'Store removed.';
            }
          })
          .catch((err) => {
            return false;
          });
      } else if (index == '2') {
        return updateDoc(homegrown, { Second_Stores: arrayRemove(Storeid) })
          .then((datas: any) => {
            if (datas) {
              return 'issue in removing Store.';
            } else {
              return 'Store removed.';
            }
          })
          .catch((err) => {
            return false;
          });
      } else {
        return updateDoc(homegrown, { third_Stores: arrayRemove(Storeid) })
          .then((datas: any) => {
            if (datas) {
              return 'issue in removing Store.';
            } else {
              return 'Store removed.';
            }
          })
          .catch((err) => {
            return false;
          });
      }
    }
  }

  async updatehomegrownbanner(id: string, croppedImage: any) {
    const homegrown = doc(this.firestore, `${'Section_Details'}`, `${id}`);
    const cloudUpload: any = await this.cloudupload2(id, croppedImage);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(homegrown, { HGbanner: cloudUpload.url })
        .then(() => {
          return cloudUpload;
        })
        .catch((err) => {
          return false;
        });
    }
  }

  async updateHomegrownproducts(id: string, products: any) {
    const cityrefr = doc(this.firestore, `${'Section_Details'}`, `${id}`);
    return updateDoc(cityrefr, { products: products });
  }

  async updatehomegrownbanners(
    Catid: string,
    index: number,
    croppedImage: any,
    Catindex?: number,
    Sub_catIndex?: number
  ) {
    const Category = doc(this.firestore, `${'cats'}`, `${Catid}`);
    const cloudUpload: any = await this.cloudupload2(Catid, croppedImage);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      console.log(0);
      if (index == 1) {
        return updateDoc(Category, { HGThumbnail: cloudUpload.url })
          .then(() => {
            return cloudUpload;
          })
          .catch((err) => {
            return false;
          });
      } else if (index == 2) {
        return updateDoc(Category, { HGCatbanner: cloudUpload.url })
          .then(() => {
            return cloudUpload;
          })
          .catch((err) => {
            return false;
          });
      } else if (index == 3) {
        this.auth.resource.categoryList[Catindex || 0].items[
          Sub_catIndex || 0
        ].HGsubCatbanner = cloudUpload.url;
        return updateDoc(Category, {
          items: this.auth.resource.categoryList[Catindex || 0].items,
        })
          .then(() => {
            return cloudUpload;
          })
          .catch((err) => {
            return false;
          });
      } else if (index == 4) {
        console.log(4);
        this.auth.resource.categoryList[Catindex || 0].items[
          Sub_catIndex || 0
        ].subCatbanner = cloudUpload.url;
        return updateDoc(Category, {
          items: this.auth.resource.categoryList[Catindex || 0].items,
        })
          .then(() => {
            return cloudUpload;
          })
          .catch((err) => {
            return false;
          });
      }
    }
  }

  getDataCat_Subcatdata(
    sectionname: string,
    Catid: string,
    ContainerType: string
  ) {
    const coll = collection(this.firestore, 'Section_stores');
    const q = query(
      coll,
      where('SectionName', '==', sectionname),
      where('Catid', '==', Catid),
      where('ContainerType', '==', ContainerType)
    );
    return collectionData(q);
  }

  getvsaDataCat_Subcatdata(
    sectionname: string,
    Nodeid: string,
    Catid: string,
    ContainerType: string,
    SubcatId?: string
  ) {
    const coll = collection(this.firestore, 'Section_stores');
    var q;
    if (SubcatId == undefined || SubcatId == '') {
      q = query(
        coll,
        where('SectionName', '==', sectionname),
        where('NodeId', '==', Nodeid),
        where('Catid', '==', Catid),
        where('ContainerType', '==', ContainerType)
      );
    } else {
      q = query(
        coll,
        where('SectionName', '==', sectionname),
        where('Nodeid', '==', Nodeid),
        where('Catid', '==', Catid),
        where('SubcatId', '==', SubcatId),
        where('ContainerType', '==', ContainerType)
      );
    }
    return collectionData(q);
  }

  updatepeoplechoicepara(index: number, id: string, data: any) {
    const cityrefr = doc(this.firestore, `${'cats'}`, `${id}`);
    if (index == 1) {
      return updateDoc(cityrefr, { VSAPeoplechoicepara: data });
    } else if (index == 3) {
      return updateDoc(cityrefr, { HGCATPeoplechoicepara: data });
    }
    else if (index == 5) {
      return updateDoc(cityrefr, { CATPeoplechoicepara: data });
    }
    else {
      return updateDoc(cityrefr, { HGSUBCATPeoplechoicepara: data });
    }

  }

  // top feed video start

  async UpdateVideo(id: string, data: any) {
    const cityrefr = doc(this.firestore, `${'Section_stores'}`, `${id}`);
    // if (index == 1) {
    return updateDoc(cityrefr, {
      Videos: data,
      M_Date: this.newTimestamp,
    });
    // } else {
    //   return updateDoc(cityrefr, {
    //     FeedVideos: arrayRemove(data),
    //     M_Date: this.newTimestamp,
    //   });
    // }

    // await addDoc(collection(this.firestore, `${'feedVideos'}`), data).then(
    //   (ref) => {
    //     const vid = doc(this.firestore, `${'feedVideos'}`, `${ref.id}`);
    //     return updateDoc(vid, { id: ref.id }).then(() => {
    //       return ref;
    //     });
    //   }
    // );
  }

  getSectionsdata(sectionName: string) {
    const vid: CollectionReference = collection(
      this.firestore,
      'Section_stores'
    );
    const qu = query(vid, where('SectionName', '==', sectionName));
    return collectionData(qu);
  }

  async updateVSAcityBanner(id: string, croppedImage: string) {
    const newTimestamp = this.getServerTimestamp();
    const cityrefr = doc(this.firestore, `${'cities'}`, `${id}`);
    const cloudUpload: any = await this.cloudupload2(id, croppedImage);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(cityrefr, {
        VSAcitybanner: cloudUpload.url,
        MDateTime: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async getrecomcount(storeid: string) {
    const coll = collection(this.firestore, 'walt');
    const q = query(
      coll,
      where('sid', '==', storeid),
      where('type', 'array-contains', 'storeORDER')
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
  updaterecomcount(storeid: string, recomcount: number) {
    const cityrefr = doc(this.firestore, `${'shops'}`, `${storeid}`);
    return updateDoc(cityrefr, { RecommendationCount: recomcount });
  }

  // async deleteVideo(id: any) {
  //   const vidRef = await doc(this.firestore, 'feedVideos', `${id}`);
  //   return deleteDoc(vidRef);
  // }

  // -----------feed end---------------------------
}
