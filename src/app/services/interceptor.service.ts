import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    const orgId = localStorage.getItem('orgId');
console.log("dasdasd");

    let headers:any = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (orgId) {
      headers['OrgId'] = orgId
      req = req.clone({ headers:req.headers.set("orgId",orgId) });
    }

    // const modifiedReq = req.clone({ headers:req.headers.set(...headers) });

    return next.handle(req);
  }
}
