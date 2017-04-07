import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { Http, Headers, Response } from "@angular/http";

import { registerElement } from "nativescript-angular/element-registry";
import { PullToRefresh } from "nativescript-pulltorefresh"
registerElement("pullToRefresh",() => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Array<any>;
    cars: any;
    groupsByMake: Array<any>;
    rows: string = "auto";

    constructor(private itemService: ItemService, private http: Http) {
    }

    ngOnInit(): void {
        this.itemService.getItems()
            .subscribe(res => this.items = res);
        this.itemService.getData()
            .subscribe(res => {
                this.cars = res['listings'].listing;
                this.makeGroup(this.cars);
            })
    };

    makeGroup(cars){
        let carsSortedByMake = cars.sort((a, b): number => {
            if (a.make < b.make)
                return -1;
            if (a.make > b.make)
                return 1;
            return 0;
        });
        this.groupsByMake = [];

        let currentMake = carsSortedByMake[0].make;
        let currentGroup = [];
        console.log(carsSortedByMake.length);

        for(let i = 0; i < carsSortedByMake.length; i++) {
            this.rows = this.rows.concat(" auto")
            //using toString because server return array not string
            //fix image_url if empty
            if (carsSortedByMake[i].image_url == null) {
                if (carsSortedByMake[i].images != null && carsSortedByMake[i].Images != null) {
                    carsSortedByMake[i].image_url = carsSortedByMake[i].Images.Image[0];
                } else {
                    //console.log(carsSortedByMake[i]);
                    carsSortedByMake[i].image_url = "assets/icon/coming_soon3.jpg";
                }
            }

            //fix price
            let priceCar: string = carsSortedByMake[i].price.toString();
            let index: number = priceCar.indexOf(".");
            if(parseInt(priceCar.substring(index + 1, priceCar.length)) == 0) {
                carsSortedByMake[i].price = priceCar.substring(0, index)
            }

            if((carsSortedByMake[i].make.toString() != currentMake.toString())) {
                console.log(currentMake);
                console.log("khac");
                let newGroup = {
                    make: currentMake,
                    cars: currentGroup
                };
                this.groupsByMake.push(newGroup);

                currentMake = carsSortedByMake[i].make;
                currentGroup = [];

            }
            currentGroup.push(carsSortedByMake[i]);
        }

        let lastGroup = {
            make: currentMake,
            cars: currentGroup
        };
        this.groupsByMake.push(lastGroup);
    }
    public refreshMe (args: any) {
        console.log("refreshing...");
        this.itemService.getData()
            .subscribe(res => {
                this.cars = res['listings'].listing;
                this.makeGroup(this.cars);
                (<PullToRefresh>args.object).refreshing = false;
            })

    }
}
