import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-addcity-and-area',
  templateUrl: './addcity-and-area.component.html',
  styleUrls: ['./addcity-and-area.component.scss'],
})
export class AddcityAndAreaComponent implements OnInit {
  CityN: string = '';
  CitySN: string = '';
  dropdownList: any = [];
  selectedareas: any = [];
  AreaPIN: string = '';
  AreaN: string = '';
  dropdownSettings!: IDropdownSettings;
  // areas$: Observable<any[]> = of(Mumbai);
  selectedareafiltered: Array<any> = [];
  Areass: Array<any> = []

  // Areass: Array<any> = [
  //   {Area_N:'400001 - Bazargate '	,Area_pin:400001},
  //   {Area_N:'400001 - M.P.T. '	,Area_pin:400001},
  //   {Area_N:'400001 - Stock Exchange '	,Area_pin:400001},
  //   {Area_N:'400001 - Tajmahal '	,Area_pin:400001},
  //   {Area_N:'400001 - Town Hall '	,Area_pin:400001},
  //   {Area_N:'400002 - S. C. Court '	,Area_pin:400002},
  //   {Area_N:'400002 - Thakurdwar '	,Area_pin:400002},
  //   {Area_N:'400002 - Kalbadevi '	,Area_pin:400002},
  //   {Area_N:'400003 - B.P.Lane '	,Area_pin:400003},
  //   {Area_N:'400003 - Mandvi '	,Area_pin:400003},
  //   {Area_N:'400003 - Masjid '	,Area_pin:400003},
  //   {Area_N:'400003 - Null Bazar '	,Area_pin:400003},
  //   {Area_N:'400004 - Ambewadi '	,Area_pin:400004},
  //   {Area_N:'400004 - Charni Road '	,Area_pin:400004},
  //   {Area_N:'400004 - Chaupati '	,Area_pin:400004},
  //   {Area_N:'400004 - Girgaon '	,Area_pin:400004},
  //   {Area_N:'400004 - Madhavbaug '	,Area_pin:400004},
  //   {Area_N:'400004 - Opera House '	,Area_pin:400004},
  //   {Area_N:'400005 - Asvini '	,Area_pin:400005},
  //   {Area_N:'400005 - Colaba '	,Area_pin:400005},
  //   {Area_N:'400005 - Holiday Camp '	,Area_pin:400005},
  //   {Area_N:'400005 - V.W.T.C. '	,Area_pin:400005},
  //   {Area_N:'400005 - Colaba Bazar '	,Area_pin:400005},
  //   {Area_N:'400006 - Malabar Hill '	,Area_pin:400006},
  //   {Area_N:'400007 - Bharat Nagar '	,Area_pin:400007},
  //   {Area_N:'400007 - S V Marg '	,Area_pin:400007},
  //   {Area_N:'400007 - Grant Road '	,Area_pin:400007},
  //   {Area_N:'400007 - N.S.Patkar Marg '	,Area_pin:400007},
  //   {Area_N:'400007 - Tardeo '	,Area_pin:400007},
  //   {Area_N:'400008 - J.J.Hospital '	,Area_pin:400008},
  //   {Area_N:'400008 - Kamathipura '	,Area_pin:400008},
  //   {Area_N:'400008 - Falkland Road '	,Area_pin:400008},
  //   {Area_N:'400008 - M A Marg '	,Area_pin:400008},
  //   {Area_N:'400008 - Mumbai Central '	,Area_pin:400008},
  //   {Area_N:'400009 - Princess Dock '	,Area_pin:400009},
  //   {Area_N:'400009 - Noor Baug '	,Area_pin:400009},
  //   {Area_N:'400009 - Chinchbunder '	,Area_pin:400009},
  //   {Area_N:'400010 - Mazgaon '	,Area_pin:400010},
  //   {Area_N:'400010 - Mazgaon Road '	,Area_pin:400010},
  //   {Area_N:'400010 - Mazgaon Dock '	,Area_pin:400010},
  //   {Area_N:'400010 - V K Bhavan '	,Area_pin:400010},
  //   {Area_N:'400010 - Dockyard Road '	,Area_pin:400010},
  //   {Area_N:'400011 - Chinchpokli '	,Area_pin:400011},
  //   {Area_N:'400011 - Haines Road '	,Area_pin:400011},
  //   {Area_N:'400011 - Jacob Circle '	,Area_pin:400011},
  //   {Area_N:'400011 - Agripada '	,Area_pin:400011},
  //   {Area_N:'400011 - B.P.C. Jacob Circle '	,Area_pin:400011},
  //   {Area_N:'400012 - Parel '	,Area_pin:400012},
  //   {Area_N:'400012 - Parel Naka '	,Area_pin:400012},
  //   {Area_N:'400012 - Haffkin Institute '	,Area_pin:400012},
  //   {Area_N:'400012 - Chamarbaug '	,Area_pin:400012},
  //   {Area_N:'400012 - Lal Baug '	,Area_pin:400012},
  //   {Area_N:'400012 - BEST STaff Quarters '	,Area_pin:400012},
  //   {Area_N:'400012 - Parel Rly Work Shop '	,Area_pin:400012},
  //   {Area_N:'400013 - Delisle Road '	,Area_pin:400013},
  //   {Area_N:'400014 - Dadar Colony '	,Area_pin:400014},
  //   {Area_N:'400014 - Naigaon '	,Area_pin:400014},
  //   {Area_N:'400014 - Dadar '	,Area_pin:400014},
  //   {Area_N:'400015 - Sewri '	,Area_pin:400015},
  //   {Area_N:'400016 - Kapad Bazar '	,Area_pin:400016},
  //   {Area_N:'400016 - Mahim East '	,Area_pin:400016},
  //   {Area_N:'400016 - Mahim Bazar '	,Area_pin:400016},
  //   {Area_N:'400016 - Mori Road '	,Area_pin:400016},
  //   {Area_N:'400016 - Mahim '	,Area_pin:400016},
  //   {Area_N:'400017 - Dharavi '	,Area_pin:400017},
  //   {Area_N:'400017 - Dharavi Road '	,Area_pin:400017},
  //   {Area_N:'400018 - Worli '	,Area_pin:400018},
  //   {Area_N:'400018 - Worli Naka '	,Area_pin:400018},
  //   {Area_N:'400019 - Matunga '	,Area_pin:400019},
  //   {Area_N:'400020 - Central Building '	,Area_pin:400020},
  //   {Area_N:'400020 - Churchgate '	,Area_pin:400020},
  //   {Area_N:'400020 - Marine Lines '	,Area_pin:400020},
  //   {Area_N:'400021 - Elephanta Caves Po '	,Area_pin:400021},
  //   {Area_N:'400021 - Nariman Point '	,Area_pin:400021},
  //   {Area_N:'400021 - New Yogakshema '	,Area_pin:400021},
  //   {Area_N:'400022 - Transit Camp '	,Area_pin:400022},
  //   {Area_N:'400022 - Raoli Camp '	,Area_pin:400022},
  //   {Area_N:'400022 - Sion '	,Area_pin:400022},
  //   {Area_N:'400022 - Chunabhatti '	,Area_pin:400022},
  //   {Area_N:'400024 - Nehru Nagar '	,Area_pin:400024},
  //   {Area_N:'400025 - Prabhadevi '	,Area_pin:400025},
  //   {Area_N:'400025 - New Prabhadevi Road '	,Area_pin:400025},
  //   {Area_N:'400026 - Cumballa Hill '	,Area_pin:400026},
  //   {Area_N:'400026 - Gowalia Tank '	,Area_pin:400026},
  //   {Area_N:'400026 - Dr Deshmukh Marg '	,Area_pin:400026},
  //   {Area_N:'400026 - Cumballa Sea Face '	,Area_pin:400026},
  //   {Area_N:'400027 - V J B Udyan '	,Area_pin:400027},
  //   {Area_N:'400028 - Bhawani Shankar '	,Area_pin:400028},
  //   {Area_N:'400028 - Bhawani Shankar Rd '	,Area_pin:400028},
  //   {Area_N:'400028 - Gokhale Road '	,Area_pin:400028},
  //   {Area_N:'400028 - Ranade Road '	,Area_pin:400028},
  //   {Area_N:'400028 - S V S Marg '	,Area_pin:400028},
  //   {Area_N:'400028 - Shivaji Park '	,Area_pin:400028},
  //   {Area_N:'400029 - A I Staff Colony '	,Area_pin:400029},
  //   {Area_N:'400029 - Santacruz P&t Colony '	,Area_pin:400029},
  //   {Area_N:'400030 - Century Mill '	,Area_pin:400030},
  //   {Area_N:'400030 - Worli Colony '	,Area_pin:400030},
  //   {Area_N:'400030 - Worli Police Camp '	,Area_pin:400030},
  //   {Area_N:'400030 - Worli Sea Face.'	,Area_pin:400030},
  //   {Area_N:'400031 - Wadala'	,Area_pin:400031},
  //   {Area_N:'400031 - Kidwai Nagar '	,Area_pin:400031},
  //   {Area_N:'400032 - High Court Building '	,Area_pin:400032},
  //   {Area_N:'400032 - Mantralaya '	,Area_pin:400032},
  //   {Area_N:'400032 - Secretariate '	,Area_pin:400032},
  //   {Area_N:'400033 - Tank Road '	,Area_pin:400033},
  //   {Area_N:'400033 - Kalachowki'	,Area_pin:400033},
  //   {Area_N:'400033 - Reay Road '	,Area_pin:400033},
  //   {Area_N:'400033 - Cotton Exchange '	,Area_pin:400033},
  //   {Area_N:'400033 - L B S N E collage '	,Area_pin:400033},
  //   {Area_N:'400034 - Tulsiwadi '	,Area_pin:400034},
  //   {Area_N:'400034 - Haji Ali '	,Area_pin:400034},
  //   {Area_N:'400035 - Rajbhavan '	,Area_pin:400035},
  //   {Area_N:'400037 - Antop Hill '	,Area_pin:400037},
  //   {Area_N:'400037 - B P T Colony '	,Area_pin:400037},
  //   {Area_N:'400037 - C G S Colony '	,Area_pin:400037},
  //   {Area_N:'400037 - Wadala Truck Terminal'	,Area_pin:400037},
  //   {Area_N:'400042 - Bhandup East '	,Area_pin:400042},
  //   {Area_N:'400043 - D.M. Colony '	,Area_pin:400043},
  //   {Area_N:'400043 - Shivaji Nagar '	,Area_pin:400043},
  //   {Area_N:'400049 - Juhu '	,Area_pin:400049},
  //   {Area_N:'400050 - Bandra West '	,Area_pin:400050},
  //   {Area_N:'400051 - B.N. Bhavan '	,Area_pin:400051},
  //   {Area_N:'400051 - Kherwadi '	,Area_pin:400051},
  //   {Area_N:'400051 - Bandra(East) '	,Area_pin:400051},
  //   {Area_N:'400051 - Audit Bhavan '	,Area_pin:400051},
  //   {Area_N:'400052 - Danda '	,Area_pin:400052},
  //   {Area_N:'400052 - Khar Colony '	,Area_pin:400052},
  //   {Area_N:'400052 - V.P. Road '	,Area_pin:400052},
  //   {Area_N:'400052 - Khar Delivery '	,Area_pin:400052},
  //   {Area_N:'400053 - Azad Nagar S.O '	,Area_pin:400053},
  //   {Area_N:'400053 - Andheri '	,Area_pin:400053},
  //   {Area_N:'400054 - Santacruz Central '	,Area_pin:400054},
  //   {Area_N:'400054 - Santacruz(West) '	,Area_pin:400054},
  //   {Area_N:'400055 - Vakola '	,Area_pin:400055},
  //   {Area_N:'400055 - Santacruz(East) '	,Area_pin:400055},
  //   {Area_N:'400056 - I.R.L.A. '	,Area_pin:400056},
  //   {Area_N:'400056 - Vileparle(West) '	,Area_pin:400056},
  //   {Area_N:'400057 - Hanuman Road '	,Area_pin:400057},
  //   {Area_N:'400057 - Vileparle Railway Station '	,Area_pin:400057},
  //   {Area_N:'400057 - Vileeparle (East) '	,Area_pin:400057},
  //   {Area_N:'400058 - H.M.P. School '	,Area_pin:400058},
  //   {Area_N:'400058 - Andheri Railway Station '	,Area_pin:400058},
  //   {Area_N:'400059 - Marol Bazar '	,Area_pin:400059},
  //   {Area_N:'400059 - Marol Naka '	,Area_pin:400059},
  //   {Area_N:'400059 - J.B. Nagar '	,Area_pin:400059},
  //   {Area_N:'400060 - Jogeshwari East '	,Area_pin:400060},
  //   {Area_N:'400061 - Madh '	,Area_pin:400061},
  //   {Area_N:'400061 - Vesava '	,Area_pin:400061},
  //   {Area_N:'400063 - Goregaon East '	,Area_pin:400063},
  //   {Area_N:'400063 - Sharma Estate '	,Area_pin:400063},
  //   {Area_N:'400064 - Malad '	,Area_pin:400064},
  //   {Area_N:'400064 - Malad West '	,Area_pin:400064},
  //   {Area_N:'400064 - Orlem '	,Area_pin:400064},
  //   {Area_N:'400064 - Liberty Garden '	,Area_pin:400064},
  //   {Area_N:'400065 - Aareymilk Colony '	,Area_pin:400065},
  //   {Area_N:'400065 - S R P F Camp '	,Area_pin:400065},
  //   {Area_N:'400065 - Nagari Niwara '	,Area_pin:400065},
  //   {Area_N:'400066 - Magthane '	,Area_pin:400066},
  //   {Area_N:'400066 - Borivali East '	,Area_pin:400066},
  //   {Area_N:'400066 - Daulat Nagar '	,Area_pin:400066},
  //   {Area_N:'400066 - Rajendra Nagar '	,Area_pin:400066},
  //   {Area_N:'400066 - S. K.Nagar '	,Area_pin:400066},
  //   {Area_N:'400067 - Kandivali West '	,Area_pin:400067},
  //   {Area_N:'400067 - Charkop '	,Area_pin:400067},
  //   {Area_N:'400067 - Kandivali '	,Area_pin:400067},
  //   {Area_N:'400068 - Ketkipada '	,Area_pin:400068},
  //   {Area_N:'400068 - Dahisar '	,Area_pin:400068},
  //   {Area_N:'400068 - Dahisar'	,Area_pin:400068},
  //   {Area_N:'400069 - Nagardas Road '	,Area_pin:400069},
  //   {Area_N:'400069 - Andheri East '	,Area_pin:400069},
  //   {Area_N:'400070 - Kurla North '	,Area_pin:400070},
  //   {Area_N:'400070 - Kurla '	,Area_pin:400070},
  //   {Area_N:'400070 - Netajinagar '	,Area_pin:400070},
  //   {Area_N:'400071 - Chembur '	,Area_pin:400071},
  //   {Area_N:'400071 - Sindhi Society '	,Area_pin:400071},
  //   {Area_N:'400072 - Vihar Road '	,Area_pin:400072},
  //   {Area_N:'400072 - Sakinaka '	,Area_pin:400072},
  //   {Area_N:'400074 - Chembur Extension '	,Area_pin:400074},
  //   {Area_N:'400074 - F.C.I. '	,Area_pin:400074},
  //   {Area_N:'400074 - Mahul Road '	,Area_pin:400074},
  //   {Area_N:'400075 - Best Staff Colony '	,Area_pin:400075},
  //   {Area_N:'400075 - Pant Nagar '	,Area_pin:400075},
  //   {Area_N:'400075 - R.A.Nagar '	,Area_pin:400075},
  //   {Area_N:'400076 - Powai Iit '	,Area_pin:400076},
  //   {Area_N:'400077 - Rajawadi '	,Area_pin:400077},
  //   {Area_N:'400078 - Bhandup West '	,Area_pin:400078},
  //   {Area_N:'400078 - Bhandup Ind. Estate '	,Area_pin:400078},
  //   {Area_N:'400078 - J.M. Road '	,Area_pin:400078},
  //   {Area_N:'400078 - P.H. Colony '	,Area_pin:400078},
  //   {Area_N:'400078 - Usha Nagar '	,Area_pin:400078},
  //   {Area_N:'400079 - Psm Colony '	,Area_pin:400079},
  //   {Area_N:'400079 - Vikhroli '	,Area_pin:400079},
  //   {Area_N:'400080 - Mulund West '	,Area_pin:400080},
  //   {Area_N:'400080 - Mulund Dd Road '	,Area_pin:400080},
  //   {Area_N:'400080 - Nahur '	,Area_pin:400080},
  //   {Area_N:'400080 - Nehru Road '	,Area_pin:400080},
  //   {Area_N:'400080 - S.B. Road '	,Area_pin:400080},
  //   {Area_N:'400081 - Mulund East '	,Area_pin:400081},
  //   {Area_N:'400081 - Mhada Colony '	,Area_pin:400081},
  //   {Area_N:'400082 - Bhandup Complex '	,Area_pin:400082},
  //   {Area_N:'400082 - Mulund Colony '	,Area_pin:400082},
  //   {Area_N:'400083 - Kannamwar Nagar '	,Area_pin:400083},
  //   {Area_N:'400083 - Tagore Nagar '	,Area_pin:400083},
  //   {Area_N:'400084 - Barve Nagar '	,Area_pin:400084},
  //   {Area_N:'400085 - B.A.R.C. '	,Area_pin:400085},
  //   {Area_N:'400086 - Ghatkopar west '	,Area_pin:400086},
  //   {Area_N:'400086 - Rifle Range '	,Area_pin:400086},
  //   {Area_N:'400086 - Sahakar Bhavan'	,Area_pin:400086},
  //   {Area_N:'400087 - N.I.T.I.E. '	,Area_pin:400087},
  //   {Area_N:'400088 - Govandi '	,Area_pin:400088},
  //   {Area_N:'400088 - T.F.Donar '	,Area_pin:400088},
  //   {Area_N:'400088 - Trombay'	,Area_pin:400088},
  //   {Area_N:'400089 - Chembur Rs '	,Area_pin:400089},
  //   {Area_N:'400089 - Tilak Nagar '	,Area_pin:400089},
  //   {Area_N:'400091 - Borivali '	,Area_pin:400091},
  //   {Area_N:'400092 - Borivali West '	,Area_pin:400092},
  //   {Area_N:'400093 - Chakala Midc '	,Area_pin:400093},
  //   {Area_N:'400094 - Anushakti Nagar '	,Area_pin:400094},
  //   {Area_N:'400095 - Kharodi '	,Area_pin:400095},
  //   {Area_N:'400095 - Ins Hamla '	,Area_pin:400095},
  //   {Area_N:'400096 - Seepz '	,Area_pin:400096},
  //   {Area_N:'400097 - Malad East '	,Area_pin:400097},
  //   {Area_N:'400097 - Rani Sati Marg '	,Area_pin:400097},
  //   {Area_N:'400098 - Vidyanagari'	,Area_pin:400098},
  //   {Area_N:'400099 - Sahargaon '	,Area_pin:400099},
  //   {Area_N:'400099 - Airport '	,Area_pin:400099},
  //   {Area_N:'400099 - International Airport'	,Area_pin:400099},
  //   {Area_N:'400099 - Sahar P & T Colony '	,Area_pin:400099},
  //   {Area_N:'400101 - Kandivali East '	,Area_pin:400101},
  //   {Area_N:'400102 - Jogeshwari West'	,Area_pin:400102},
  //   {Area_N:'400102 - Oshiwara'	,Area_pin:400102},
  //   {Area_N:'400103 - Mandapeshwar '	,Area_pin:400103},
  //   {Area_N:'400104 - Goregaon '	,Area_pin:400104},
  //   {Area_N:'400104 - Motilal Nagar '	,Area_pin:400104},
  //   {Area_N:'400104 - Bangur Nagar '	,Area_pin:400104},
  //   {Area_N:'400104 - Goregaon '	,Area_pin:400104},







  //   // {
  //   //   Area_N: 'Kalbadevi H.O, Ramwadi, S. C. Court, Shroff Mahajan, Thakurdwar',
  //   //   Area_pin: 400002,
  //   // },

  //   // {
  //   //   Area_N: 'B.P.Lane, Mandvi (Mumbai), Masjid, Null Bazar',
  //   //   Area_pin: 400003,
  //   // },

  //   // {
  //   //   Area_N:
  //   //     'Ambewadi (Mumbai), Charni Road, Chaupati, Girgaon, Madhavbaug, Opera House',
  //   //   Area_pin: 400004,
  //   // },

  //   // {
  //   //   Area_N: 'Asvini, Colaba Bazar, Colaba, Holiday Camp, V.W.T.C',
  //   //   Area_pin: 400005,
  //   // },

  //   // { Area_N: 'Malabar Hill', Area_pin: 400006 },

  //   // {
  //   //   Area_N:
  //   //     'Bharat Nagar (Mumbai), Grant Road, N.S.Patkar Marg, S V Marg, Tardeo',
  //   //   Area_pin: 400007,
  //   // },

  //   // {
  //   //   Area_N: 'Falkland Road, J.J.Hospital, Kamathipura, M A Marg, Central H.O',
  //   //   Area_pin: 400008,
  //   // },

  //   // { Area_N: 'Chinchbunder H.O, Princess Dock, Noor Baug', Area_pin: 400009 },

  //   // {
  //   //   Area_N: 'Dockyard Road, Mazgaon Dock, Mazgaon Road, Mazgaon, V K Bhavan',
  //   //   Area_pin: 400010,
  //   // },

  //   // {
  //   //   Area_N: 'Agripada, Chinchpokli, Haines Road, Jacob Circle',
  //   //   Area_pin: 400011,
  //   // },

  //   // {
  //   //   Area_N:
  //   //     'BEST STaff Quarters, Chamarbaug, Haffkin Institute, Lal Baug, Parel Naka, Parel Rly Work Shop, Parel',
  //   //   Area_pin: 400012,
  //   // },

  //   // { Area_N: 'Delisle Road', Area_pin: 400013 },

  //   // { Area_N: 'Dadar Colony, Dadar H.O, Naigaon (Mumbai)', Area_pin: 400014 },

  //   // { Area_N: 'Sewri', Area_pin: 400015 },

  //   // {
  //   //   Area_N: 'Kapad Bazar, Mahim Bazar, Mahim East, Mahim H.O, Mori Road',
  //   //   Area_pin: 400016,
  //   // },

  //   // { Area_N: 'Dharavi Road, Dharavi', Area_pin: 400017 },

  //   // { Area_N: 'Worli Naka, Worli', Area_pin: 400018 },

  //   // { Area_N: 'Matunga', Area_pin: 400019 },

  //   // { Area_N: 'Central Building, Churchgate, Marine Lines', Area_pin: 400020 },

  //   // { Area_N: 'Nariman Point, New Yogakshema', Area_pin: 400021 },

  //   // { Area_N: 'Chunabhatti, Raoli Camp, Sion, Transit Camp', Area_pin: 400022 },

  //   // { Area_N: 'Nehru Nagar (Mumbai)', Area_pin: 400024 },

  //   // { Area_N: 'New Prabhadevi Road, Prabhadevi', Area_pin: 400025 },

  //   // {
  //   //   Area_N:
  //   //     'Cumballa Hill, Cumballa Sea Face, Dr Deshmukh Marg, Gowalia Tank',
  //   //   Area_pin: 400026,
  //   // },

  //   // { Area_N: 'V J B Udyan', Area_pin: 400027 },

  //   // {
  //   //   Area_N:
  //   //     'Bhawani Shankar Rd, Bhawani Shankar, Gokhale Road (Mumbai), Shivaji Park (Mumbai), S V S Marg, Ranade Road',
  //   //   Area_pin: 400028,
  //   // },

  //   // { Area_N: 'A I Staff Colony, Santacruz P&t Colony', Area_pin: 400029 },

  //   // {
  //   //   Area_N: 'Century Mill, Worli Colony, Worli Police Camp',
  //   //   Area_pin: 400030,
  //   // },

  //   // { Area_N: 'Worli Sea Face', Area_pin: 400030 },

  //   // { Area_N: 'Kidwai Nagar (Mumbai), Wadala Rs, Wadala', Area_pin: 400031 },

  //   // {
  //   //   Area_N: 'High Court Building (Mumbai), Mantralaya (Mumbai), Secretariate',
  //   //   Area_pin: 400032,
  //   // },

  //   // {
  //   //   Area_N:
  //   //     'Cotton Exchange, Kalachowki, L B S N E collage, Reay Road, Tank Road',
  //   //   Area_pin: 400033,
  //   // },

  //   // { Area_N: 'Haji Ali, Tulsiwadi', Area_pin: 400034 },

  //   // { Area_N: 'Rajbhavan (Mumbai)', Area_pin: 400035 },

  //   // {
  //   //   Area_N: 'Antop Hill, B P T Colony, C G S Colony, Wadala Truck Terminal',
  //   //   Area_pin: 400037,
  //   // },

  //   // { Area_N: 'Bhandup East', Area_pin: 400042 },

  //   // { Area_N: 'D.M. Colony, Shivaji Nagar (Mumbai)', Area_pin: 400043 },

  //   // { Area_N: 'Juhu', Area_pin: 400049 },

  //   // { Area_N: 'Bandra West', Area_pin: 400050 },

  //   // {
  //   //   Area_N: 'B.N. Bhavan, Bandra(East), Government Colony, Kherwadi',
  //   //   Area_pin: 400051,
  //   // },

  //   // {
  //   //   Area_N: 'Danda, Khar Colony, Khar Delivery, V.P. Road',
  //   //   Area_pin: 400052,
  //   // },

  //   // { Area_N: 'Andheri H.O, Azad Nagar (Mumbai)', Area_pin: 400053 },

  //   // { Area_N: 'Santacruz Central, Santacruz(West)', Area_pin: 400054 },

  //   // { Area_N: 'Santacruz(East), Vakola', Area_pin: 400055 },

  //   // { Area_N: 'IRLA, Vileparle(West)', Area_pin: 400056 },

  //   // {
  //   //   Area_N: 'Hanuman Road, Vileeparle (East), Vileparle Railway Station',
  //   //   Area_pin: 400057,
  //   // },

  //   // { Area_N: 'Andheri Railway Station, H.M.P. School', Area_pin: 400058 },

  //   // { Area_N: 'J.B. Nagar, Marol Bazar, Marol Naka', Area_pin: 400059 },

  //   // { Area_N: 'Jogeshwari East', Area_pin: 400060 },

  //   // { Area_N: 'Madh B.O, Vesava', Area_pin: 400061 },

  //   // { Area_N: 'Goregaon East, Sharma Estate', Area_pin: 400063 },

  //   // {
  //   //   Area_N: 'Liberty Garden, Malad, Malad West Dely, Orlem',
  //   //   Area_pin: 400064,
  //   // },

  //   // {
  //   //   Area_N: 'Aareymilk Colony, Nagari Niwara, S R P F Camp',
  //   //   Area_pin: 400065,
  //   // },

  //   // {
  //   //   Area_N:
  //   //     'Borivali East, Daulat Nagar (Mumbai), Magthane B.O, Rajendra Nagar (Mumbai), S. K.Nagar',
  //   //   Area_pin: 400066,
  //   // },

  //   // { Area_N: 'Charkop, Kandivali West', Area_pin: 400067 },

  //   // { Area_N: 'Dahisar RS, Dahisar, Ketkipada B.O', Area_pin: 400068 },

  //   // { Area_N: 'Andheri East, Nagardas Road', Area_pin: 400069 },

  //   // { Area_N: 'Kurla North, Kurla, Netajinagar', Area_pin: 400070 },

  //   // { Area_N: 'Chembur H.O, Sindhi Society', Area_pin: 400071 },

  //   // { Area_N: 'Sakinaka, Vihar Road', Area_pin: 400072 },

  //   // { Area_N: 'Chembur Extension, Mahul Road, FCI', Area_pin: 400074 },

  //   // { Area_N: 'Best Staff Colony, Pant Nagar, R.A.Nagar', Area_pin: 400075 },

  //   // { Area_N: 'Powai Iit', Area_pin: 400076 },

  //   // { Area_N: 'Rajawadi', Area_pin: 400077 },

  //   // {
  //   //   Area_N:
  //   //     'Bhandup Ind. Estate, J.M. Road, P.H. Colony, Usha Nagar, Bhandup West',
  //   //   Area_pin: 400078,
  //   // },

  //   // { Area_N: 'Psm Colony, Vikhroli', Area_pin: 400079 },

  //   // {
  //   //   Area_N:
  //   //     'Mulund Dd Road, Mulund West, Nahur, Nehru Road (Mumbai), S.B. Road',
  //   //   Area_pin: 400080,
  //   // },

  //   // { Area_N: 'Mhada Colony, Mulund East', Area_pin: 400081 },

  //   // { Area_N: 'Mulund Colony, Bhandup Complex', Area_pin: 400082 },

  //   // { Area_N: 'Kannamwar Nagar, Tagore Nagar', Area_pin: 400083 },

  //   // { Area_N: 'Barve Nagar', Area_pin: 400084 },

  //   // { Area_N: 'BARC', Area_pin: 400085 },

  //   // { Area_N: 'Ghatkopar West, Rifle Range, Sahakar Bhavan', Area_pin: 400086 },

  //   // { Area_N: 'NITIE', Area_pin: 400087 },

  //   // { Area_N: 'Govandi, T.F.Donar, Trombay', Area_pin: 400088 },

  //   // { Area_N: 'Chembur Rs, Tilak Nagar (Mumbai)', Area_pin: 400089 },

  //   // { Area_N: 'Borivali H.O', Area_pin: 400091 },

  //   // { Area_N: 'Borivali West', Area_pin: 400092 },

  //   // { Area_N: 'Chakala Midc', Area_pin: 400093 },

  //   // { Area_N: 'Anushakti Nagar', Area_pin: 400094 },

  //   // { Area_N: 'Ins Hamla, Kharodi', Area_pin: 400095 },

  //   // { Area_N: 'Seepz', Area_pin: 400096 },

  //   // { Area_N: 'Malad East, Rani Sati Marg', Area_pin: 400097 },

  //   // { Area_N: 'Vidyanagari', Area_pin: 400098 },

  //   // {
  //   //   Area_N: 'International Airport, Sahar P & T Colony, Sahargaon B.O',
  //   //   Area_pin: 400099,
  //   // },

  //   // { Area_N: 'Kandivali East', Area_pin: 400101 },

  //   // { Area_N: 'Jogeshwari West, Oshiwara', Area_pin: 400102 },

  //   // { Area_N: 'Mandapeshwar', Area_pin: 400103 },

  //   // {
  //   //   Area_N: 'Bangur Nagar, Goregaon RS, Goregaon (Mumbai), Motilal Nagar',
  //   //   Area_pin: 400104,
  //   // },
  // ];

  constructor(
    private httpClient: HttpClient,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AddcityAndAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // if (this.data.id != undefined && this.data.citydata != undefined) {
    //   this.CityN = this.data.citydata.CityN;
    //   this.CitySN = this.data.citydata.CitySN;
    //   for (let i = 0; i < this.data.citydata.Areas.length; i++) {
    //     this.selectedareas.push({
    //       Area_N: this.data.citydata.Areas[i].Area_N,
    //       id: this.data.citydata.Areas[i].id,
    //     });
    //   }
    // }
  }

  ngOnInit(): void {
    for (let i = 0; i < this.Areass.length; i++) {
      this.cratearea(this.Areass[i]);
    }
    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'id',
    //   textField: 'Area_N',
    //   enableCheckAll: false,
    //   itemsShowLimit: 2,
    //   allowSearchFilter: true,
    // };
    // this.execute(Mumbai);
  }

  // execute(Mumbai) {
  //   if (this.data.id == 1) {
  //     this.getarea(Mumbai);
  //   }
  // }

  // cityanamechange(Mumbai) {
  //   if (this.CityN.length >= 3) {
  //     this.CitySN = this.CityN.slice(0, 3).toUpperCase(Mumbai);
  //   }
  // }

  // getarea(Mumbai) {
  //   this.api.getarea(Mumbai).subscribe((data: any) => {
  //     this.dropdownList = data;
  //   });
  // }

  // CreateCity(Mumbai) {
  //   if (this.CityN == undefined || this.CityN.length < 4) {
  //     alert('please enter the name of the City.');
  //   } else if (this.CitySN == undefined) {
  //     alert('please enter the Short id for City.');
  //   }
  //   // else if (this.selectedareas.length == 0) {
  //   //   alert("please select the areas.");
  //   // }
  //   else {
  //     // for (let i = 0; i < this.selectedareas.length; i++) {
  //     //   let j = this.dropdownList.findIndex((a: any) => a.id == this.selectedareas[i].id);
  //     //   this.selectedareafiltered.push(this.dropdownList[j]);
  //     // }
  //     let datas = {
  //       CityN: this.CityN.toUpperCase(Mumbai),
  //       CitySN: this.CitySN.toUpperCase(Mumbai),
  //       CDateTime: this.api.newTimestamp,
  //       // MDateTime: this.api.newTimestamp,
  //       // Areas: this.selectedareafiltered
  //     };
  //     this.api
  //       .addcity(datas)
  //       .then((data) => {
  //         if (data != undefined) {
  //           this.dialogRef.close(Mumbai);
  //           alert('city added');
  //         }
  //       })
  //       .catch((Mumbai) => {
  //         return false;
  //       });
  //   }
  // }

  // updateCity(Mumbai) {
  //   if (this.CityN == undefined || this.CityN.length < 4) {
  //     alert('please enter the name of the City.');
  //   } else if (this.CitySN == undefined) {
  //     alert('please enter the Short id for City.');
  //   } else if (this.selectedareas.length == 0) {
  //     alert('please select the areas.');
  //   } else {
  //     let datas = {
  //       CityN: this.CityN,
  //       CitySN: this.CitySN,
  //       MDateTime: this.api.newTimestamp,
  //       id: this.data.citydata.id,
  //     };
  //     this.api
  //       .updatecity(datas)
  //       .then((data) => {
  //         if (data != undefined) {
  //           this.dialogRef.close(Mumbai);
  //         }
  //       })
  //       .catch((Mumbai) => {
  //         return false;
  //       });
  //   }
  // }

  // addarea(event: any) {
  //   let index = this.dropdownList.findIndex((x: any) => x.id == event.id);
  //   let datas = {
  //     id: this.data.citydata.id,
  //     areadata: {
  //       Area_N: this.dropdownList[index].Area_N.toUpperCase(Mumbai),
  //       Area_Pin: this.dropdownList[index].Area_Pin,
  //       CDateTime: this.dropdownList[index].CDateTime,
  //       id: this.dropdownList[index].id,
  //       City_id:"2ll96ci1eU5g2mBrPimG",
  //       isaddedinNode: this.dropdownList[index].isaddedincity,
  //     },
  //   };
  //   this.api.addcityarea(datas);
  // }

  // removearea(event: any) {
  //   let index = this.dropdownList.findIndex((x: any) => x.id == event.id);
  //   let datas = {
  //     id: this.data.citydata.id,
  //     areadata: {
  //       Area_N: this.dropdownList[index].Area_N.toUpperCase(Mumbai),
  //       Area_Pin: this.dropdownList[index].Area_Pin,
  //       CDateTime: this.dropdownList[index].CDateTime,
  //       MDateTime: this.dropdownList[index].MDateTime,
  //       id: this.dropdownList[index].id,
  //       isaddedincity: this.dropdownList[index].isaddedincity,
  //     },
  //   };
  //   this.api.removecityarea(datas);
  // }

  async cratearea(datass: any) {
    // if (this.AreaN == undefined || this.AreaN.length < 4) {
    //   alert('please enter the name of the area');
    // } else if (this.AreaPIN.length != 6) {
    //   alert('Please enter the valid PIN code.');
    // } else {
      console.log(datass.Area_pin);
    await this.httpClient
      .get('https://api.postalpincode.in/pincode/' + datass.Area_pin + '')
      .subscribe((data: any) => {
        if ((data[0].Status = 'Success')) {
          let datas = {
            Area_N: datass.Area_N.toUpperCase(),
            Area_Pin: datass.Area_pin,
            CDateTime: this.api.newTimestamp,
            City_id: '2ll96ci1eU5g2mBrPimG',
            isaddedinNode: false,
          };
          this.api
            .addarea(datas)
            .then((data) => {
              if (data != undefined) {
                console.log(datass.Area_pin);
                // this.dialogRef.close();
                // alert('new area added');
              }
            })
            .catch(() => {
              return false;
            });
        } else {
          alert('No pin record found.');
        }
      });
    // }
  }
}
