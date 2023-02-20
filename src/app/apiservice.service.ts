import { Injectable } from '@angular/core';

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
  WhereFilterOp,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ApiserviceService {
  newTimestamp = this.getServerTimestamp();

  constructor(private firestore: Firestore, private snackBar: MatSnackBar) {}

  get getServerTimestamp() {
    return serverTimestamp;
  }

  getuserdata(id: any) {
    console.log(typeof id);
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
    console.log('side = ' + sid);
    const catData: CollectionReference = collection(
      this.firestore,
      `${'hypes'}`
    );
    const qu = query(catData, where('sid', '==', sid), orderBy('sin', 'desc'));
    // const qu = query(catData, where('sid', '==', sid), orderBy('sin', 'desc'));
    return collectionData(qu);
  }

  getRecentAddedOrder(
    c: number,
    getall: boolean,
    Para?: any,
    Para1?: any,
    operator?: any,
    operator1?: any,
    value?: any,
    value1?: any
  ) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${'walt'}`
    );
    let Parametere: WhereFilterOp = Para;
    let Parametere1: WhereFilterOp = Para1;
    let conditions: WhereFilterOp = operator;
    // let conditions1: WhereFilterOp = operator1;

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
        console.log(1);

        qu = query(
          catData,
          where(Parametere, conditions, value),
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc')
        );
      } else {
        console.log('get ALL');
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
        console.log('parameter = ' + Parametere);
        console.log('operator = ' + operator);
        console.log('value = ' + value);
        console.log('orderbyvalue = ' + orderbyvalue);

        qu = query(
          catData,
          where(Parametere, conditions, value),
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc'),
          // startAfter()
          limit(c)
        );
      } else {
        console.log(4);

        qu = query(
          catData,
          where('type', 'array-contains', 'storeORDER'),
          orderBy(orderbyvalue, 'desc'),
          limit(c)
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
    const catData: CollectionReference = collection(this.firestore, 'shops');
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
    const shopRef = doc(this.firestore, `${'shops'}`, `${storeID}`);
    return getDoc(shopRef);
  }

  // getStoreByID(storeID: string){
  //   const catData: CollectionReference = collection(this.firestore, `${'users'}`)
  //   const qu = query(catData,

  //     where("acBalVr", ">", 0),
  //     // where("storeCam","==",[])
  //     // orderBy("sin", "desc"),
  //   );
  //   return collectionData(qu);
  // }

  getarea() {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'Areas'}`
    );

    const qu = query(manageNode);
    return collectionData(qu);
  }

  deletearea(id: any) {
    const arearefr = doc(this.firestore, `Areas`, `${id}`);
    return deleteDoc(arearefr);
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

  deletecity(id: any) {
    const cityrefr = doc(this.firestore, `${'cities'}`, `${id}`);
    return deleteDoc(cityrefr);
  }

  async addcity(data: any) {
    console.log(data);
    await addDoc(collection(this.firestore, `${'cities'}`), data).then(
      (ref) => {
        const areeas = doc(this.firestore, `${'cities'}`, `${ref.id}`);
        return updateDoc(areeas, { id: ref.id }).then(() => {
          return ref;
        });
      }
    );
  }

  async addstore_brandspotlight(data: any) {
    await addDoc(collection(this.firestore, `${'brandspotlight'}`), data).then(
      (ref) => {
        const stores = doc(this.firestore, `${'brandspotlight'}`, `${ref.id}`);
        return updateDoc(stores, { id: ref.id }).then(() => {
          return ref;
        });
      }
    );
  }

  getspotlightdata() {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'brandspotlight'}`
    );
    const qu = query(manageNode);
    return collectionData(qu);
  }

  updateBStitle(Title: string, id: any) {
    const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
    return updateDoc(cityrefr, { BS_Title: Title })
      .then((datas: any) => {
        if (datas) {
          return 'issue in update title.';
        } else {
          return 'title updated.';
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  updateBSStitle(STitle: string, id: any) {
    const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
    return updateDoc(cityrefr, { BS_STitle: STitle })
      .then((datas: any) => {
        if (datas) {
          return 'issue in update Sub-title.';
        } else {
          return 'Sub-title updated.';
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  addBSstores(stores: any, id: any) {
    const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
    return updateDoc(cityrefr, { Stores: arrayUnion(stores) });
  }

  removeBSstores(stores: any, id: any) {
    const cityrefr = doc(this.firestore, `${'brandspotlight'}`, `${id}`);
    return updateDoc(cityrefr, { Stores: arrayRemove(stores) });
  }

  async addstore_homegrown(data: any) {
    await addDoc(collection(this.firestore, `${'Home_Grown'}`), data).then(
      (ref) => {
        const stores = doc(this.firestore, `${'Home_Grown'}`, `${ref.id}`);
        return updateDoc(stores, { id: ref.id }).then(() => {
          return ref;
        });
      }
    );
  }

  addHGstores(stores: any, id: any) {
    const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
    return updateDoc(cityrefr, { Stores: arrayUnion(stores) });
  }

  removeHGstores(stores: any, id: any) {
    const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
    return updateDoc(cityrefr, { Stores: arrayRemove(stores) });
  }

  updateHGtitle(Title: string, id: any) {
    const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
    return updateDoc(cityrefr, { HG_Title: Title })
      .then((datas: any) => {
        if (datas) {
          return 'issue in update title.';
        } else {
          return 'title updated.';
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  updateHGStitle(STitle: string, id: any) {
    const cityrefr = doc(this.firestore, `${'Home_Grown'}`, `${id}`);
    return updateDoc(cityrefr, { HG_STitle: STitle })
      .then((datas: any) => {
        if (datas) {
          return 'issue in update Sub-title.';
        } else {
          return 'Sub-title updated.';
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  gethomegrowndata() {
    const manageNode: CollectionReference = collection(
      this.firestore,
      `${'Home_Grown'}`
    );
    const qu = query(manageNode);
    return collectionData(qu);
  }

  updatecity(data: any) {
    const cityrefr = doc(this.firestore, `${'cities'}`, `${data.id}`);
    return updateDoc(cityrefr, {
      CityN: data.CityN,
      CitySN: data.CitySN,
      MDateTime: data.MDateTime,
    })
      .then((datas: any) => {
        console.log('*****');
        console.log(datas);
        console.log('*****');
        if (datas) {
          return 'issue in city update';
        } else {
          return 'city updated';
        }
      })
      .catch((err) => {
        console.log(err);
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
    this.startSnackBar('copied to your clipboard.');
  }

  startSnackBar(mes: any) {
    this.snackBar.open(mes, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  // Node functions start
  async addnode(data: any) {
    console.log(data);
    const addedcity = await addDoc(
      collection(this.firestore, 'node_manager'),
      data
    ).then((ref) => {
      const areeas = doc(this.firestore, 'node_manager', `${ref.id}`);
      return updateDoc(areeas, { id: ref.id }).then(() => {
        return ref;
      });
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
      Nareas: nodeData.Nareas,
    });
  }

  // VSA section start

  getVSAData() {
    const VSA_section: CollectionReference = collection(
      this.firestore,
      `${'VSA_section'}`
    );
    const qu = query(VSA_section);
    return collectionData(qu);
  }

  updateVSAtitle(Title: string, id: any) {
    const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
    return updateDoc(cityrefr, { VSA_Title: Title })
      .then((datas: any) => {
        if (datas) {
          return 'issue in update title.';
        } else {
          return 'title updated.';
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  updateVSAStitle(STitle: string, id: any) {
    const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
    return updateDoc(cityrefr, { VSA_STitle: STitle })
      .then((datas: any) => {
        if (datas) {
          return 'issue in update Sub-title.';
        } else {
          return 'Sub-title updated.';
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  addVSAstores(nodes: any, id: any) {
    const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
    return updateDoc(cityrefr, { Nodes: arrayUnion(nodes) });
  }

  editVSAstores(nodes: any, id: any) {
    const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
    return updateDoc(cityrefr, { Nodes: nodes });
  }

  VSAupdatestore(nodes: any, id: any) {
    const cityrefr = doc(this.firestore, `${'VSA_section'}`, `${id}`);
    return updateDoc(cityrefr, { Nodes: nodes });
  }

  // VSA section end

  // top feed video start

  async UploadVideo(data: any) {
    console.log('UploadVideo api');
    await addDoc(collection(this.firestore, `${'Top_Feed'}`), data).then(
      (ref) => {
        const video = doc(this.firestore, 'Top_Feed', `${ref.id}`);
        return updateDoc(video, { id: ref.id }).then(() => {
          return ref;
        });
      }
    );
  }

  getuploadVideo() {
    const getuploadVideo: CollectionReference = collection(
      this.firestore,
      `${'Top_Feed'}`
    );
    const qu = query(getuploadVideo);
    return collectionData(qu);
  }

  // top feed video end
}
