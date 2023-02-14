import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';


export interface UserData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  displayedColumns: string[] = [
    'Tran_id', 'Phone_no', 'DAT', 'CatAsubCat', 'Bill', 'Type', 'PayMode', 'Refr_eard', 'Refr_Paid', 'manage'
  ];
  dataSource!: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  payments: any = []
  id?: number;
  constructor( public dialog: MatDialog) {
    this.id = 1;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000)
  }

  execute() {
    this.dataSource = new MatTableDataSource(this.payments);
  }

  oepndetails(data: any) {
    const refDialog = this.dialog.open(TransactionDetailsComponent, {
      width: '90%',
      minWidth: '90%',
      maxWidth: '90%',
      maxHeight: '80%',
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'dialogLayout',
      data: { trandata: data, id: this.id },
    });
    refDialog.afterClosed().subscribe(() => { });
  }
}
