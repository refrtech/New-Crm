import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  CustOrMech: number = 0;
  Filtervalue: any;
  typeoffilterinput = "string"
  filters: Array<any> = [];
  FIlterName: any;
  CustFilter = [{
    Title: "Name", values: "name", type: "text"
  },
  {
    Title: "Mobile No", values: "phone", type: "text",
  },
  {
    Title: "Email ID", values: "email", type: "text",
  },
  {
    Title: "To be Credited", values: "acBalCr", type: "number",
  },
  {
    Title: "Refr balance", values: "acBalC", type: "number",
  },
  {
    Title: "Zip", values: "addr[0].zip", type: "number",
  },
  {
    Title: "Bucket List", values: "bucket", type: "text",
  },
  ];

  TYpesoffilters = [
    {
      Title: "Less than or equal to", values: "<=",
    },

    {
      Title: "Greater Than or Equal To", values: ">=",
    },

    {
      Title: "Equal To", values: "<=",
    },

    {
      Title: "Not equal to", values: "!=",
    },

    {
      Title: "array-contains", values: "array-contains",
    },
  ]


  MerchFilter = [{
    Title: "Name", values: "name", type: "text"
  },
  {
    Title: "Mobile No", values: "phone", type: "text",
  },
  {
    Title: "Email ID", values: "email", type: "text",
  },
  {
    Title: "Store Category", values: "cat", type: "text",
  },
  {
    Title: "Store Type", values: "type", type: "text",
  },
  ]
  constructor(public http: HttpClient,) { }

  ngOnInit(): void {
  }

  doSomething() {
    this.filters = this.CustOrMech == 0 ? this.CustFilter : this.MerchFilter;
  }

  Filtersnamechange() {
    this.Filtervalue = undefined;
    this.typeoffilterinput = this.FIlterName.type;
  }

  sendwhatsappNotification() {
    let headers = new HttpHeaders({
      'Authorization':
        'Bearer EAALVbJlELqEBAPO9MUrJlgL0ZB2yZBpEXbbrGUX4CmQQyZAfx29F7awJZB7nkxZA4J1H0oaOQo0ZCjKtWsYvILziB1lpd0J0sAHuIUcy02ZCG3ZCMsneeSdZCPrZBXDh0QoetTDyKXc0ODlgPjD1soavhDLeb8pZAxzOtd8qLLuwgZC0spZCeZAHZBX4PZB2r2EZC4kPSdHd6oQsW6abSSAZDZD',
      'Content-Type': 'application/json',
    });
    const body = {
      messaging_product: 'whatsapp',
      to: ['918879751140','919167452128'],
      type: 'template',
      template: {
        name: 'sample_shipping_confirmation',
        language: {
          code: 'en_US',
          policy: 'deterministic',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: '2',
              },
            ],
          },
        ],
      },
    };
    this.http
      .post<any>(
        'https://graph.facebook.com/v15.0/101348469460797/messages',
        body,
        { headers }
      )
      .subscribe((data) => {
      });
  }
}
