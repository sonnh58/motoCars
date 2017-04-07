import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import * as XmlObjects from "nativescript-xmlobjects";

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Config } from "../config"
import { Item } from "./item";

@Injectable()
export class ItemService {
    public stocks: any;

    constructor(private http: Http) {};

    getItems() {
        return this.http.get(Config.apiUrl + 'category')
            .map(response => response.json());

    }

    getItem(id: string) {
        return this.http.get(Config.apiUrl + 'car/category/' + id)
            .map(response => response.json());
    }

    getData() {
        return this.http.get(Config.apiUrl + 'getData')
            .map(res => res.json())
    }
}
