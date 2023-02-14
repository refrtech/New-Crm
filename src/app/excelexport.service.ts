import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
const Excel_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const Excel_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelexportService {

  constructor() { }
  exportasexcelfile(Json: any[], excelfilename: string) {
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(Json);
    const workbook: xlsx.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveasExcelfile(excelBuffer, excelfilename);
  }

  saveasExcelfile(buffer: any, filename: string) {
    const data: Blob = new Blob([buffer], { type: Excel_TYPE });
    FileSaver.saveAs(data, filename + '_export_' + new Date().getTime() + Excel_EXTENSION);
  }
}
