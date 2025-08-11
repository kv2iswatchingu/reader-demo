import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MainpathService {
    private mainPathSUbject = new BehaviorSubject<string | null>(null);
    mainPath$ = this.mainPathSUbject.asObservable();

    setMainPath(path:string | null) {
        this.mainPathSUbject.next(path);
    }
}